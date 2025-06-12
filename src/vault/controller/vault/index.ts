//imports
import * as fs from 'fs';
import InsertRequest from "../../model/request/insert";
import { BatchRecordMethod, QueryServiceExecuteQueryBody, RecordServiceBatchOperationBody, RecordServiceBulkDeleteRecordBody, RecordServiceInsertRecordBody, RecordServiceUpdateRecordBody, V1Byot, V1DetokenizePayload, V1DetokenizeRecordRequest, V1FieldRecords, V1TokenizePayload, V1TokenizeRecordRequest } from '../../../ _generated_/rest/api';
import InsertOptions from "../../model/options/insert";
import GetRequest from "../../model/request/get";
import GetOptions from "../../model/options/get";
import DetokenizeRequest from "../../model/request/detokenize";
import DetokenizeOptions from "../../model/options/detokenize";
import DeleteRequest from "../../model/request/delete";
import UpdateRequest from "../../model/request/update";
import UpdateOptions from "../../model/options/update";
import FileUploadRequest from "../../model/request/file-upload";
import QueryRequest from '../../model/request/query';
import InsertResponse from '../../model/response/insert';
import DetokenizeResponse from '../../model/response/detokenize';
import UpdateResponse from '../../model/response/update';
import DeleteResponse from '../../model/response/delete';
import GetResponse from '../../model/response/get';
import QueryResponse from '../../model/response/query';
import FileUploadResponse from '../../model/response/file-upload';
import TokenizeResponse from '../../model/response/tokenize';
import TokenizeRequest from '../../model/request/tokenize';
import { InsertResponseType, ParsedDetokenizeResponse, ParsedInsertBatchResponse, RecordsResponse, SkyflowIdResponse, StringKeyValueMapType, TokenizeRequestType, TokensResponse } from '../../types';
import { generateSDKMetrics, getBearerToken, MessageType, parameterizedString, printLog, TYPES, SDK_METRICS_HEADER_KEY, removeSDKVersion, RedactionType, SKYFLOW_ID, SkyflowRecordError } from '../../../utils';
import GetColumnRequest from '../../model/request/get-column';
import logs from '../../../utils/logs';
import VaultClient from '../../client';
import { validateDeleteRequest, validateDetokenizeRequest, validateGetColumnRequest, validateGetRequest, validateInsertRequest, validateQueryRequest, validateTokenizeRequest, validateUpdateRequest, validateUploadFileRequest } from '../../../utils/validations';
import path from 'path';
import { Records } from '../../../ _generated_/rest/api/resources/records/client/Client';
import FileUploadOptions from '../../model/options/fileUpload';

class VaultController {

    private client: VaultClient;

    constructor(client: VaultClient) {
        this.client = client;
    }

    private createSdkHeaders() {
        return { [SDK_METRICS_HEADER_KEY]: JSON.stringify(generateSDKMetrics()) };
    }

    private handleRecordsResponse(records?: Record<string, unknown>[]): Record<string, unknown>[] {
        if (records && Array.isArray(records) && records.length > 0) {
            return records;
        }
        return [];
    }

    private handleInsertBatchResponse(responses: Record<string, unknown>[]): Record<string, unknown>[] {
        if (responses && Array.isArray(responses) && responses.length > 0) {
            return responses;
        }
        return [];
    }

    private parseDetokenizeResponse(records: Record<string,string>[], requestId: string): ParsedDetokenizeResponse {
        const response: ParsedDetokenizeResponse = {
            success: [],
            errors: []
        };
        if (!Array.isArray(records) || records.length === 0) {
            return response;
        }
        records.forEach(record => {
            if (record.error) {
                const detokenizeError: SkyflowRecordError = {
                    token: record.token,
                    error: record.error, 
                    requestId: requestId
                }
                response.errors.push(detokenizeError);
            } else {
                response.success.push({
                    token: record.token,
                    value: record.value,
                    type: record.valueType
                });
            }
        });
        return response;
    }

    private parseInsertBatchResponse(records: Record<string, unknown>[], requestId: string): InsertResponse {
        const response: ParsedInsertBatchResponse = {
            success: [],
            errors: []
        };

        if (!records || !Array.isArray(records) || records.length === 0) {
            return new InsertResponse({ insertedFields:null, errors: null });
        }

        records.forEach((record: Record<string, unknown>, index: number) => {
            if (this.isSuccess(record)) {
                
                this.processSuccess(record, index, response);
            } else {
                this.processError(record, index, requestId, response);
            }
        });

        return new InsertResponse({ insertedFields: response.success.length>0 ? response.success : null, errors: response.errors.length>0 ? response.errors : null });
    }

    private isSuccess(record: Record<string, unknown>): boolean {
        return record?.Status === 200;
    }

    private processSuccess(record: Record<string, unknown>, index: number, response: ParsedInsertBatchResponse): void {
        const body = record.Body as { records: StringKeyValueMapType[] };
        if (body && Array.isArray(body.records)) {
            body.records.forEach((field: StringKeyValueMapType) => {
                response.success.push({
                    skyflowId: String(field?.skyflow_id),
                    requestIndex: index,
                    ...(typeof field?.tokens === 'object' && field?.tokens !== null ? field.tokens : {})
                });
            });
        }
    }

    private processError(record: Record<string, unknown>, index: number, requestId: string, response: ParsedInsertBatchResponse): void {
        let httpCode: string | number | null = null;
        if (typeof record?.Status === 'string' || typeof record?.Status === 'number') {
            httpCode = record.Status;
        }
        const recordBody = record?.Body as { error: string };
        const errorObj: SkyflowRecordError = {
            httpCode,
            error: recordBody?.error,
            requestId: requestId ?? null,
            requestIndex: index ?? null,
        };
        response.errors.push(errorObj);
    }

    private handleRequest<T>(apiCall: Function, requestType: string): Promise<T> {
        return new Promise((resolve, reject) => {
            printLog(parameterizedString(logs.infoLogs.EMIT_REQUEST, TYPES[requestType]), MessageType.LOG, this.client.getLogLevel());
            const sdkHeaders = this.createSdkHeaders();

            getBearerToken(this.client.getCredentials(), this.client.getLogLevel()).then(authInfo => {
                this.client.initAPI(authInfo, requestType);
                apiCall({ headers: { ...sdkHeaders } })
                    .then((response: any) => {
                        const { data, rawResponse } = response;
                        const requestId = rawResponse?.headers?.get('x-request-id');
                        printLog(logs.infoLogs[`${requestType}_REQUEST_RESOLVED`], MessageType.LOG, this.client.getLogLevel());
                        switch (requestType) {
                            case TYPES.INSERT:
                            case TYPES.GET:
                            case TYPES.QUERY:
                            case TYPES.DETOKENIZE:
                            case TYPES.TOKENIZE:
                                resolve({records: this.handleRecordsResponse(data?.records), requestId} as T);
                                break;
                            case TYPES.INSERT_BATCH:
                                resolve({records: this.handleInsertBatchResponse(data?.responses), requestId} as T)
                                break;
                            case TYPES.UPDATE:
                            case TYPES.FILE_UPLOAD:
                                resolve(data)
                                break;
                            case TYPES.DELETE:
                                resolve(new DeleteResponse({ deletedIds: data?.RecordIDResponse, errors: null }) as T);
                                break;
                        }
                    }).catch((error: any) => {
                        printLog(logs.errorLogs[`${requestType}_REQUEST_REJECTED`], MessageType.ERROR, this.client.getLogLevel());
                        this.client.failureResponse(error).catch((err) => reject(err))
                    });
            }).catch(reject);
        });
    }

    private getTokens(index:number, tokens?: Record<string, unknown>[]) : Record<string, unknown> | undefined {
        if(tokens && tokens.length !== 0 && tokens.length > index ) return tokens[index];
    }

    private buildBatchInsertBody(request: InsertRequest, options?: InsertOptions): RecordServiceBatchOperationBody {
        const records = request.data.map((record, index) => ({
            fields: record as Record<string, unknown> || {},
            tableName: request.tableName,
            tokenization: options?.getReturnTokens() || false,
            method: BatchRecordMethod.Post,
            tokens: this.getTokens(index, options?.getTokens()) as Record<string, unknown>,
            upsert: options?.getUpsertColumn(),
        }));
        return {
            records,
            continueOnError: true,
            byot: options?.getTokenMode(),
        };
    }

    private buildBulkInsertBody(request: InsertRequest, options?: InsertOptions): RecordServiceInsertRecordBody {
        const records = request.data.map((record, index) => ({ 
            fields: record, 
            tokens: this.getTokens(index, options?.getTokens()),
        })) as Array<V1FieldRecords>;
        return {
            records,
            tokenization: options?.getReturnTokens(),
            upsert: options?.getUpsertColumn(),
            homogeneous: options?.getHomogeneous(),
            byot: options?.getTokenMode()
        };
    }

    private parseBulkInsertResponse(records: Record<string, unknown>[]): InsertResponse {
        const insertedFields: InsertResponseType[] = records.map(record => ({
            skyflowId: String(record.skyflow_id),
            ...(typeof record.tokens === 'object' && record.tokens !== null ? record.tokens : {})
        }));
        return new InsertResponse({ insertedFields, errors: null });
    }

    insert(request: InsertRequest, options?: InsertOptions): Promise<InsertResponse> {
        return new Promise((resolve, reject) => {
            try {
                printLog(logs.infoLogs.INSERT_TRIGGERED, MessageType.LOG, this.client.getLogLevel());
                printLog(logs.infoLogs.VALIDATE_INSERT_INPUT, MessageType.LOG, this.client.getLogLevel());
                // validations checks
                validateInsertRequest(request, options, this.client.getLogLevel());

                const isContinueOnError = options?.getContinueOnError();

                const requestBody = isContinueOnError
                    ? this.buildBatchInsertBody(request, options)
                    : this.buildBulkInsertBody(request, options);


                const operationType = isContinueOnError ? TYPES.INSERT_BATCH : TYPES.INSERT;
                const tableName = request.tableName;
                this.handleRequest<RecordsResponse>(
                    (headers: Records.RequestOptions | undefined) =>
                        isContinueOnError
                            ? this.client.vaultAPI.recordServiceBatchOperation(this.client.vaultId, requestBody, headers).withRawResponse()
                            : this.client.vaultAPI.recordServiceInsertRecord(this.client.vaultId, tableName, requestBody as RecordServiceInsertRecordBody, headers).withRawResponse(),
                    operationType
                ).then((resp) => {
                    printLog(logs.infoLogs.INSERT_DATA_SUCCESS, MessageType.LOG, this.client.getLogLevel());
                    const parsedResponse = isContinueOnError
                        ? this.parseInsertBatchResponse(resp.records, resp.requestId)
                        : this.parseBulkInsertResponse(resp.records);
                    resolve(parsedResponse);
                })
                .catch(error => {
                    reject(error);
                });
            } catch (error) {
                if (error instanceof Error)
                    printLog(removeSDKVersion(error.message), MessageType.ERROR, this.client.getLogLevel());
                reject(error);
            }
        });
    }

    update(request: UpdateRequest, options?: UpdateOptions): Promise<UpdateResponse> {
        return new Promise((resolve, reject) => {
            try {
                printLog(logs.infoLogs.UPDATE_TRIGGERED, MessageType.LOG, this.client.getLogLevel());
                printLog(logs.infoLogs.VALIDATE_UPDATE_INPUT, MessageType.LOG, this.client.getLogLevel());
                // Validation checks
                validateUpdateRequest(request, options, this.client.getLogLevel());

                const skyflowId = request.data[SKYFLOW_ID];
                delete request.data[SKYFLOW_ID];
                const record = { fields: request.data, tokens: options?.getTokens() };
                const strictMode = options?.getTokenMode() ? options?.getTokenMode() : V1Byot.Disable;
                const updateData: RecordServiceUpdateRecordBody = {
                    record: record,
                    tokenization: options?.getReturnTokens(),
                    byot: strictMode
                };

                this.handleRequest<TokensResponse>(
                    (headers: Records.RequestOptions | undefined) => this.client.vaultAPI.recordServiceUpdateRecord(
                        this.client.vaultId,
                        request.tableName,
                        skyflowId as string,
                        updateData,
                        headers
                    ).withRawResponse(),
                    TYPES.UPDATE
                ).then(data => {
                    printLog(logs.infoLogs.UPDATE_SUCCESS, MessageType.LOG, this.client.getLogLevel());
                    const updatedRecord = {
                        skyflowId: data.skyflow_id,
                        ...data?.tokens
                    };
                    resolve(new UpdateResponse({ updatedField: updatedRecord, errors: null }));
                })
                    .catch(error => {
                        reject(error);
                    });
            } catch (error) {
                if (error instanceof Error)
                    printLog(removeSDKVersion(error.message), MessageType.ERROR, this.client.getLogLevel());
                reject(error);
            }
        });
    }

    delete(request: DeleteRequest): Promise<DeleteResponse> {
        return new Promise((resolve, reject) => {
            try {
                printLog(logs.infoLogs.DELETE_TRIGGERED, MessageType.LOG, this.client.getLogLevel());
                printLog(logs.infoLogs.VALIDATE_DELETE_INPUT, MessageType.LOG, this.client.getLogLevel());
                // Validation checks
                validateDeleteRequest(request, this.client.getLogLevel());

                const deleteRequest: RecordServiceBulkDeleteRecordBody = {
                    skyflow_ids: request.ids,
                };

                this.handleRequest<DeleteResponse>(
                    (headers: Records.RequestOptions | undefined) => this.client.vaultAPI.recordServiceBulkDeleteRecord(
                        this.client.vaultId,
                        request.tableName,
                        deleteRequest,
                        headers
                    ).withRawResponse(),
                    TYPES.DELETE
                ).then(data => {
                    printLog(logs.infoLogs.DELETE_SUCCESS, MessageType.LOG, this.client.getLogLevel());
                    resolve(data);
                })
                    .catch(error => {
                        reject(error);
                    });
            } catch (error) {
                if (error instanceof Error)
                    printLog(removeSDKVersion(error.message), MessageType.ERROR, this.client.getLogLevel());
                reject(error);
            }
        });
    }

    get(request: GetRequest | GetColumnRequest, options?: GetOptions): Promise<GetResponse> {
        return new Promise((resolve, reject) => {
            try {
                printLog(logs.infoLogs.GET_TRIGGERED, MessageType.LOG, this.client.getLogLevel());
                printLog(logs.infoLogs.VALIDATE_GET_INPUT, MessageType.LOG, this.client.getLogLevel());

                // Validation checks
                if (request instanceof GetRequest) {
                    validateGetRequest(request, options, this.client.getLogLevel());
                }
                if (request instanceof GetColumnRequest) {
                    validateGetColumnRequest(request, options, this.client.getLogLevel());
                }


                let records: Array<string> = [];
                let columnName: string = "";
                let columnValues: Array<string> = [];
                if (request instanceof GetRequest && request.ids) {
                    records = request.ids as Array<string>;
                }
                if (request instanceof GetColumnRequest && request.columnName && request.columnValues) {
                    columnName = request.columnName as string;
                    columnValues = request.columnValues as Array<string>;
                }
                const payload = {
                    skyflow_ids: records,
                    redaction: options?.getRedactionType(),
                    tokenization: options?.getReturnTokens(),
                    fields: options?.getFields(),
                    offset: options?.getOffset(),
                    limit: options?.getLimit(),
                    downloadURL: options?.getDownloadURL(),
                    column_name: columnName,
                    column_values: columnValues,
                    order_by: options?.getOrderBy(),
                };

                this.handleRequest<RecordsResponse>(
                    (headers: Records.RequestOptions | undefined) => this.client.vaultAPI.recordServiceBulkGetRecord(
                        this.client.vaultId,
                        request.tableName,
                        payload,
                        headers
                    ).withRawResponse(),
                    TYPES.GET
                ).then(response => {
                    printLog(logs.infoLogs.GET_SUCCESS, MessageType.LOG, this.client.getLogLevel());
                    const processedRecords = response.records.map(record => ({
                        ...(typeof record.fields === 'object' && record.fields !== null ? record.fields : {}),
                    }));
                    resolve(new GetResponse({ data: processedRecords, errors: null }));
                })
                    .catch(error => {
                        reject(error);
                    });
            } catch (error) {
                if (error instanceof Error)
                    printLog(removeSDKVersion(error.message), MessageType.ERROR, this.client.getLogLevel());
                reject(error);
            }
        });
    }

    uploadFile(request: FileUploadRequest, options?: FileUploadOptions): Promise<FileUploadResponse> {
        return new Promise((resolve, reject) => {
            try {
                printLog(logs.infoLogs.UPLOAD_FILE_TRIGGERED, MessageType.LOG, this.client.getLogLevel());
                printLog(logs.infoLogs.VALIDATE_FILE_UPLOAD_INPUT, MessageType.LOG, this.client.getLogLevel());

                // Validation checks
                validateUploadFileRequest(request, options, this.client.getLogLevel());

                //handle file exits
                let fileBlob: Blob | File | undefined;
                let fileName: string | undefined;

                if(options?.getFilePath()) {
                    const fileBuffer = fs.readFileSync(options.getFilePath()!);
                    fileName = path.basename(options.getFilePath()!);
                    fileBlob = new File([fileBuffer], fileName, {
                        type: 'application/json'
                    });
                } 
                else if (options?.getBase64()) { 
                    const buffer = Buffer.from(options.getBase64()!, 'base64');
                    fileName = options.getFileName()!;
                    fileBlob = new File([buffer], fileName, {
                        type: 'application/json'
                    });
                }
                
                else if (options?.getFileObject() as File) {
                    fileBlob = options?.getFileObject();
                }

                this.handleRequest<SkyflowIdResponse>(
                    (headers: Records.RequestOptions | undefined) => this.client.vaultAPI.fileServiceUploadFile(
                        fileBlob as unknown as import('buffer').Blob,
                        this.client.vaultId,
                        request.tableName,
                        request.skyflowId,
                        {
                            columnName: request.columnName
                        }
                    ).withRawResponse(),
                    TYPES.FILE_UPLOAD
                ).then(data => {
                    printLog(logs.infoLogs.FILE_UPLOAD_DATA_SUCCESS, MessageType.LOG, this.client.getLogLevel());
                    resolve(new FileUploadResponse({ skyflowId: data.skyflow_id, errors: null }));
                })
                    .catch(error => {
                        reject(error);
                    });
            } catch (error) {
                if (error instanceof Error)
                    printLog(removeSDKVersion(error.message), MessageType.ERROR, this.client.getLogLevel());
                reject(error);
            }
        });
    }

    query(request: QueryRequest): Promise<QueryResponse> {
        return new Promise((resolve, reject) => {
            try {
                printLog(logs.infoLogs.QUERY_TRIGGERED, MessageType.LOG, this.client.getLogLevel());
                printLog(logs.infoLogs.VALIDATE_QUERY_INPUT, MessageType.LOG, this.client.getLogLevel());

                // Validation checks
                validateQueryRequest(request, this.client.getLogLevel());

                const query: QueryServiceExecuteQueryBody = {
                    query: request.query,
                };

                this.handleRequest<RecordsResponse>(
                    (headers: Records.RequestOptions | undefined) => this.client.queryAPI.queryServiceExecuteQuery(
                        this.client.vaultId,
                        query,
                        headers
                    ).withRawResponse(),
                    TYPES.QUERY
                ).then(response => {
                    printLog(logs.infoLogs.QUERY_SUCCESS, MessageType.LOG, this.client.getLogLevel());
                    const processedRecords = response.records.map(record => ({
                        ...(typeof record.fields === 'object' && record.fields !== null ? record.fields : {}),
                        tokenizedData: {
                            ...(typeof record.tokens === 'object' && record.tokens !== null ? record.tokens : {}),
                        },
                    }));
                    resolve(new QueryResponse({ fields: processedRecords, errors: null }));
                })
                    .catch(error => {
                        reject(error);
                    });
            } catch (error) {
                if (error instanceof Error)
                    printLog(removeSDKVersion(error.message), MessageType.ERROR, this.client.getLogLevel());
                reject(error);
            }
        });
    }

    detokenize(request: DetokenizeRequest, options?: DetokenizeOptions): Promise<DetokenizeResponse> {
        return new Promise((resolve, reject) => {
            try {
                printLog(logs.infoLogs.DETOKENIZE_TRIGGERED, MessageType.LOG, this.client.getLogLevel());
                printLog(logs.infoLogs.VALIDATE_DETOKENIZE_INPUT, MessageType.LOG, this.client.getLogLevel());
                
                //validations checks
                validateDetokenizeRequest(request, options, this.client.getLogLevel());

                const fields = request.data.map(record => ({ token: record.token, redaction: record?.redactionType || RedactionType.DEFAULT })) as Array<V1DetokenizeRecordRequest>;
                const detokenizePayload: V1DetokenizePayload = { detokenizationParameters: fields, continueOnError: options?.getContinueOnError(), downloadURL: options?.getDownloadURL() };

                this.handleRequest<RecordsResponse<Record<string, string>>>(
                    (headers: Records.RequestOptions | undefined) => this.client.tokensAPI.recordServiceDetokenize(this.client.vaultId, detokenizePayload, headers).withRawResponse(),
                    TYPES.DETOKENIZE
                ).then(response => {
                    printLog(logs.infoLogs.DETOKENIZE_SUCCESS, MessageType.LOG, this.client.getLogLevel());
                    const parsedResponse: ParsedDetokenizeResponse = this.parseDetokenizeResponse(response.records, response.requestId);
                    resolve(new DetokenizeResponse({ detokenizedFields: parsedResponse.success.length>0 ? parsedResponse.success : null, errors: parsedResponse.errors.length>0 ? parsedResponse.errors : null }));
                })
                    .catch(error => {
                        reject(error);
                    });
            } catch (error) {
                if (error instanceof Error)
                    printLog(removeSDKVersion(error.message), MessageType.ERROR, this.client.getLogLevel());
                reject(error);
            }
        });
    }

    tokenize(request: TokenizeRequest): Promise<TokenizeResponse> {
        return new Promise((resolve, reject) => {
            try {
                printLog(logs.infoLogs.TOKENIZE_TRIGGERED, MessageType.LOG, this.client.getLogLevel());
                printLog(logs.infoLogs.VALIDATE_TOKENIZE_INPUT, MessageType.LOG, this.client.getLogLevel());
                
                //validation checks
                validateTokenizeRequest(request, this.client.getLogLevel());

                const fields = request.values.map((record: TokenizeRequestType) => ({ value: record.value, columnGroup: record.columnGroup })) as Array<V1TokenizeRecordRequest>;
                const tokenizePayload: V1TokenizePayload = { tokenizationParameters: fields };

                this.handleRequest<RecordsResponse<string>>(
                    (headers: Records.RequestOptions | undefined) => this.client.tokensAPI.recordServiceTokenize(this.client.vaultId, tokenizePayload,headers).withRawResponse(),
                    TYPES.TOKENIZE
                ).then(response => {
                    printLog(logs.infoLogs.TOKENIZE_SUCCESS, MessageType.LOG, this.client.getLogLevel());
                    resolve(new TokenizeResponse({ tokens: response.records, errors: null }))
                })
                    .catch(error => {
                        reject(error);
                    });
            } catch (error) {
                if (error instanceof Error)
                    printLog(removeSDKVersion(error.message), MessageType.ERROR, this.client.getLogLevel());
                reject(error);
            }
        });
    }

    connection() {
        // cache detect object if created
        // return detect object using static func
    }

    lookUpBin() {
        // cache binlookup object if created
        // return binlookup object using static func
    }

    audit() {
        // cache audit object if created
        // return audit object using static func
    }

    detect() {
        // cache detect object if created
        // return detect object using static func
    }
}

export default VaultController;