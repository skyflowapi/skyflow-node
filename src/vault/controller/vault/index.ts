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
import { ParsedDetokenizeResponse, ParsedInsertBatchResponse, TokenizeRequestType } from '../../types';
import { generateSDKMetrics, getBearerToken, MessageType, parameterizedString, printLog, TYPES, SDK_METRICS_HEADER_KEY, removeSDKVersion, RedactionType, SKYFLOW_ID } from '../../../utils';
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
        printLog(logs.infoLogs.CONTROLLER_INITIALIZED, MessageType.LOG, this.client.getLogLevel());
    }

    private createSdkHeaders() {
        return { [SDK_METRICS_HEADER_KEY]: JSON.stringify(generateSDKMetrics()) };
    }

    private handleRecordsResponse(data: any): any[] {
        if (data?.records && Array.isArray(data.records) && data.records.length > 0) {
            return data.records;
        }
        return [];
    }

    private handleInsertBatchResponse(data: any): any[] {
        if (data?.responses && Array.isArray(data.responses) && data.responses.length > 0) {
            return data.responses;
        }
        return [];
    }

    private parseDetokenizeResponse(records: any[], requestId: any): ParsedDetokenizeResponse {
        const response: ParsedDetokenizeResponse = {
            success: [],
            errors: []
        };
        if (!Array.isArray(records) || records.length === 0) {
            return response;
        }
        records.forEach(record => {
            if (record.error) {
                response.errors.push({
                    requestId: requestId,
                    token: record.token,
                    error: record.error
                });
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

    private parseInsertBatchResponse(records: any[], requestId: any): InsertResponse {
        const response: ParsedInsertBatchResponse = {
            success: [],
            errors: []
        };

        if (!records || !Array.isArray(records) || records.length === 0) {
            return new InsertResponse({ insertedFields:[], errors: [] });
        }

        records.forEach((record, index) => {
            if (this.isSuccess(record)) {
                
                this.processSuccess(record, index, response);
            } else {
                this.processError(record, index, requestId, response);
            }
        });

        return new InsertResponse({ insertedFields: response.success, errors: response.errors });
    }

    private isSuccess(record: any): boolean {
        return record?.Status === 200;
    }

    private processSuccess(record: any, index: number, response: ParsedInsertBatchResponse): void {
        record.Body.records.forEach((field: any) => {
            response.success.push({
                skyflowId: field?.skyflow_id,
                requestIndex: index,
                ...field?.tokens
            });
        });
    }

    private processError(record: any, index: number, requestId: any, response: ParsedInsertBatchResponse): void {
        response.errors.push({
            requestId: requestId,
            requestIndex: index,
            error: record?.Body?.error
        });
    }

    private handleRequest(apiCall: Function, requestType: string): Promise<any> {
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
                                resolve({records: this.handleRecordsResponse(data), requestId})
                                break;
                            case TYPES.INSERT_BATCH:
                                resolve({records: this.handleInsertBatchResponse(data), requestId})
                                break;
                            case TYPES.UPDATE:
                            case TYPES.FILE_UPLOAD:
                                resolve(data)
                                break;
                            case TYPES.DELETE:
                                resolve(new DeleteResponse({ deletedIds: data.RecordIDResponse, errors: [] }));
                                break;
                        }
                    }).catch((error: any) => {
                        printLog(logs.errorLogs[`${requestType}_REQUEST_REJECTED`], MessageType.ERROR, this.client.getLogLevel());
                        this.client.failureResponse(error).catch((err) => reject(err))
                    });
            }).catch(reject);
        });
    }

    private getTokens(index:number, tokens?: Array<object>) : object | undefined {
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

    private parseBulkInsertResponse(records: any[]): InsertResponse {
        const insertedFields = records.map(record => ({
            skyflowId: record.skyflow_id,
            ...record.tokens
        }));
        return new InsertResponse({ insertedFields, errors: [] });
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
                this.handleRequest(
                    (headers: Records.RequestOptions | undefined) =>
                        isContinueOnError
                            ? this.client.vaultAPI.recordServiceBatchOperation(this.client.vaultId, requestBody, headers).withRawResponse()
                            : this.client.vaultAPI.recordServiceInsertRecord(this.client.vaultId, tableName, requestBody as RecordServiceInsertRecordBody, headers).withRawResponse(),
                    operationType
                ).then((resp: any) => {
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

                this.handleRequest(
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
                    resolve(new UpdateResponse({ updatedField: updatedRecord, errors: [] }));
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

                this.handleRequest(
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
            } catch (error: any) {
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

                this.handleRequest(
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
                        ...record.fields,
                    }));
                    resolve(new GetResponse({ data: processedRecords, errors: [] }));
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

                this.handleRequest(
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
                    resolve(new FileUploadResponse({ skyflowId: data.skyflow_id, errors: [] }));
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

                this.handleRequest(
                    (headers: Records.RequestOptions | undefined) => this.client.queryAPI.queryServiceExecuteQuery(
                        this.client.vaultId,
                        query,
                        headers
                    ).withRawResponse(),
                    TYPES.QUERY
                ).then(response => {
                    printLog(logs.infoLogs.QUERY_SUCCESS, MessageType.LOG, this.client.getLogLevel());
                    const processedRecords = response.records.map(record => ({
                        ...record?.fields,
                        tokenizedData: {
                            ...record?.tokens,
                        },
                    }));
                    resolve(new QueryResponse({ fields: processedRecords, errors: [] }));
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

                this.handleRequest(
                    (headers: Records.RequestOptions | undefined) => this.client.tokensAPI.recordServiceDetokenize(this.client.vaultId, detokenizePayload, headers).withRawResponse(),
                    TYPES.DETOKENIZE
                ).then(response => {
                    printLog(logs.infoLogs.DETOKENIZE_SUCCESS, MessageType.LOG, this.client.getLogLevel());
                    const parsedResponse: ParsedDetokenizeResponse = this.parseDetokenizeResponse(response.records, response.requestId);
                    resolve(new DetokenizeResponse({ detokenizedFields: parsedResponse.success, errors: parsedResponse.errors }));
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

                this.handleRequest(
                    (headers: Records.RequestOptions | undefined) => this.client.tokensAPI.recordServiceTokenize(this.client.vaultId, tokenizePayload,headers).withRawResponse(),
                    TYPES.TOKENIZE
                ).then(response => {
                    printLog(logs.infoLogs.TOKENIZE_SUCCESS, MessageType.LOG, this.client.getLogLevel());
                    resolve(new TokenizeResponse({ tokens: response.records, errors: [] }))
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