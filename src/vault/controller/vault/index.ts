//imports
import * as fs from 'fs';
import InsertRequest from "../../model/request/insert";
import { BatchRecordMethod, QueryServiceExecuteQueryBody, RecordServiceBatchOperationBody, RecordServiceBulkDeleteRecordBody, RecordServiceInsertRecordBody, RecordServiceUpdateRecordBody, V1BYOT, V1DetokenizePayload, V1DetokenizeRecordRequest, V1FieldRecords, V1TokenizePayload, V1TokenizeRecordRequest } from "../../../ _generated_/rest";
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
import { ParsedDetokenizeResponse, ParsedInsertBatchResponse, tokenizeRequestType } from '../../types';
import { generateSDKMetrics, getBearerToken, MessageType, parameterizedString, printLog, TYPES, SDK_METRICS_HEADER_KEY } from '../../../utils';
import GetColumnRequest from '../../model/request/get-column';
import logs from '../../../utils/logs';
import VaultClient from '../../client';
import { RawAxiosRequestConfig } from 'axios';
import { validateDeleteRequest, validateDetokenizeRequest, validateGetColumnRequest, validateGetRequest, validateInsertRequest, validateQueryRequest, validateTokenizeRequest, validateUpdateRequest, validateUploadFileRequest } from '../../../utils/validations';

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

    private parseDetokenizeResponse(records: any[]): ParsedDetokenizeResponse {
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

    private parseInsertBatchResponse(records: any[]): InsertResponse {
        const response: ParsedInsertBatchResponse = {
            success: [],
            errors: []
        };

        if (!records || !Array.isArray(records) || records.length === 0) {
            return new InsertResponse({ errors: [] });
        }

        records.forEach((record, index) => {
            if (this.isSuccess(record)) {
                this.processSuccess(record, index, response);
            } else {
                this.processError(record, index, response);
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

    private processError(record: any, index: number, response: ParsedInsertBatchResponse): void {
        response.errors.push({
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
                        const data = JSON.parse(JSON.stringify(response.data));
                        printLog(logs.infoLogs[`${requestType}_REQUEST_RESOLVED`], MessageType.LOG, this.client.getLogLevel());
                        switch (requestType) {
                            case TYPES.INSERT:
                            case TYPES.GET:
                            case TYPES.QUERY:
                            case TYPES.DETOKENIZE:
                            case TYPES.TOKENIZE:
                                resolve(this.handleRecordsResponse(data))
                                break;
                            case TYPES.INSERT_BATCH:
                                resolve(this.handleInsertBatchResponse(data))
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
                        // console.log(error.cause)
                        // handle JSON Parse issue
                        printLog(logs.errorLogs[`${requestType}_REQUEST_REJECTED`], MessageType.ERROR, this.client.getLogLevel());
                        this.client.failureResponse(error).catch((err) => reject(err))
                    });
            }).catch(reject);
        });
    }

    private buildBatchInsertBody(request: InsertRequest, options?: InsertOptions): RecordServiceBatchOperationBody {
        const records = request.data.map(record => ({
            fields: record,
            tableName: request.tableName,
            tokenization: options?.getReturnTokens() || false,
            method: BatchRecordMethod.Post,
            tokens: options?.getTokens(),
            upsert: options?.getUpsert(),
        }));
        return {
            records,
            continueOnError: true,
            byot: options?.getTokenMode(),
        };
    }

    private buildBulkInsertBody(request: InsertRequest, options?: InsertOptions): RecordServiceInsertRecordBody {
        const records = request.data.map(record => ({ fields: record })) as Array<V1FieldRecords>;
        return {
            records,
            tokenization: options?.getReturnTokens(),
            upsert: options?.getUpsert(),
            homogeneous: options?.getHomogeneous(),
            byot: options?.getTokenMode()
        };
    }

    private parseBulkInsertResponse(records: any[]): InsertResponse {
        const insertedFields = records.map(record => ({
            skyflow_id: record.skyflow_id,
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
                validateInsertRequest(request, options);

                const isContinueOnError = options?.getContinueOnError();

                const requestBody = isContinueOnError
                    ? this.buildBatchInsertBody(request, options)
                    : this.buildBulkInsertBody(request, options);


                const operationType = isContinueOnError ? TYPES.INSERT_BATCH : TYPES.INSERT;
                const tableName = request.tableName;

                this.handleRequest(
                    (headers: RawAxiosRequestConfig | undefined) =>
                        isContinueOnError
                            ? this.client.vaultAPI.recordServiceBatchOperation(this.client.vaultId, requestBody, headers)
                            : this.client.vaultAPI.recordServiceInsertRecord(this.client.vaultId, tableName, requestBody as RecordServiceInsertRecordBody, headers),
                    operationType
                ).then((resp: any) => {
                    const parsedResponse = isContinueOnError
                        ? this.parseInsertBatchResponse(resp)
                        : this.parseBulkInsertResponse(resp);
                    resolve(parsedResponse);
                })
                    .catch(error => {
                        if (error instanceof Error)
                            printLog(error.message, MessageType.ERROR, this.client.getLogLevel());
                        reject(error);
                    });
            } catch (error) {
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
                validateUpdateRequest(request, options);

                const record = { fields: request.updateData };
                const strictMode = options?.getTokenMode() ? V1BYOT.Enable : V1BYOT.Disable;
                const updateData: RecordServiceUpdateRecordBody = {
                    record: record,
                    tokenization: options?.getReturnTokens(),
                    byot: strictMode
                };

                this.handleRequest(
                    (headers: RawAxiosRequestConfig | undefined) => this.client.vaultAPI.recordServiceUpdateRecord(
                        this.client.vaultId,
                        request.tableName,
                        request.skyflowId,
                        updateData,
                        headers
                    ),
                    TYPES.UPDATE
                ).then(data => {
                    const updatedRecord = {
                        skyflowID: data.skyflow_id,
                        ...data?.tokens
                    };
                    resolve(new UpdateResponse({ updatedField: updatedRecord, errors: [] }));
                })
                    .catch(error => {
                        if (error instanceof Error)
                            printLog(error.message, MessageType.ERROR, this.client.getLogLevel());
                        // throw Skyflow Error
                        reject(error);
                    });
            } catch (error) {
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
                validateDeleteRequest(request);

                const deleteRequest: RecordServiceBulkDeleteRecordBody = {
                    skyflow_ids: request.deleteIds,
                };

                this.handleRequest(
                    (headers: RawAxiosRequestConfig | undefined) => this.client.vaultAPI.recordServiceBulkDeleteRecord(
                        this.client.vaultId,
                        request.tableName,
                        deleteRequest,
                        headers
                    ),
                    TYPES.DELETE
                ).then(data => {
                    resolve(data);
                })
                    .catch(error => {
                        if (error instanceof Error)
                            printLog(error.message, MessageType.ERROR, this.client.getLogLevel());
                        reject(error);
                    });
            } catch (error: any) {
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
                    validateGetRequest(request);
                }
                if (request instanceof GetColumnRequest) {
                    validateGetColumnRequest(request);
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

                this.handleRequest(
                    (headers: RawAxiosRequestConfig | undefined) => this.client.vaultAPI.recordServiceBulkGetRecord(
                        this.client.vaultId,
                        request.tableName,
                        records,
                        options?.getRedactionType(),
                        options?.getReturnTokens(),
                        options?.getFields(),
                        options?.getOffset(),
                        options?.getLimit(),
                        options?.getDownloadURL(),
                        columnName,
                        columnValues,
                        options?.getOrderBy(),
                        headers
                    ),
                    TYPES.GET
                ).then(records => {
                    const processedRecords = records.map(record => ({
                        ...record.fields,
                    }));
                    resolve(new GetResponse({ data: processedRecords, errors: [] }));
                })
                    .catch(error => {
                        if (error instanceof Error)
                            printLog(error.message, MessageType.ERROR, this.client.getLogLevel());
                        // throw Skyflow Error
                        reject(error);
                    });
            } catch (error) {
                reject(error);
            }
        });
    }

    uploadFile(request: FileUploadRequest): Promise<FileUploadResponse> {
        return new Promise((resolve, reject) => {
            try {
                printLog(logs.infoLogs.UPLOAD_FILE_TRIGGERED, MessageType.LOG, this.client.getLogLevel());
                printLog(logs.infoLogs.VALIDATE_FILE_UPLOAD_INPUT, MessageType.LOG, this.client.getLogLevel());

                // Validation checks
                validateUploadFileRequest(request);

                //handle file exits
                const formData = new FormData();
                const fileStream = fs.createReadStream(request.filePath) as unknown as Blob;
                formData.append('file', fileStream);
                formData.append('columnName', request.columnName);

                this.handleRequest(
                    (headers: RawAxiosRequestConfig | undefined) => this.client.vaultAPI.fileServiceUploadFile(
                        this.client.vaultId,
                        request.tableName,
                        request.skyflowId,
                        formData,
                        headers
                    ),
                    TYPES.FILE_UPLOAD
                ).then(data => {
                    resolve(new FileUploadResponse({ skyflowID: data.skyflow_id, errors: [] }));
                })
                    .catch(error => {
                        if (error instanceof Error)
                            printLog(error.message, MessageType.ERROR, this.client.getLogLevel());
                        // throw Skyflow Error
                        reject(error);
                    });
            } catch (error) {
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
                validateQueryRequest(request);

                const query: QueryServiceExecuteQueryBody = {
                    query: request.query,
                };

                this.handleRequest(
                    (headers: RawAxiosRequestConfig | undefined) => this.client.queryAPI.queryServiceExecuteQuery(
                        this.client.vaultId,
                        query,
                        headers
                    ),
                    TYPES.QUERY
                ).then(records => {
                    const processedRecords = records.map(record => ({
                        ...record?.fields,
                        tokenizedData: {
                            ...record?.tokens,
                        },
                    }));
                    resolve(new QueryResponse({ fields: processedRecords, errors: [] }));
                })
                    .catch(error => {
                        if (error instanceof Error)
                            printLog(error.message, MessageType.ERROR, this.client.getLogLevel());
                        // throw Skyflow Error
                        reject(error);
                    });
            } catch (error) {
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
                validateDetokenizeRequest(request, options);

                const fields = request.tokens.map(record => ({ token: record, redaction: request?.redactionType })) as Array<V1DetokenizeRecordRequest>;
                const detokenizePayload: V1DetokenizePayload = { detokenizationParameters: fields, continueOnError: options?.getContinueOnError(), downloadURL: options?.getDownloadURL() };

                this.handleRequest(
                    (headers: RawAxiosRequestConfig | undefined) => this.client.tokensAPI.recordServiceDetokenize(this.client.vaultId, detokenizePayload, headers),
                    TYPES.DETOKENIZE
                ).then(records => {
                    const parsedResponse: ParsedDetokenizeResponse = this.parseDetokenizeResponse(records);
                    resolve(new DetokenizeResponse({ detokenizedFields: parsedResponse.success, errors: parsedResponse.errors }));
                })
                    .catch(error => {
                        if (error instanceof Error)
                            printLog(error.message, MessageType.ERROR, this.client.getLogLevel());
                        // throw Skyflow Error
                        reject(error);
                    });
            } catch (error) {
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
                validateTokenizeRequest(request);

                const fields = request.values.map((record: tokenizeRequestType) => ({ value: record.value, columnGroup: record.columnGroup })) as Array<V1TokenizeRecordRequest>;
                const tokenizePayload: V1TokenizePayload = { tokenizationParameters: fields };

                this.handleRequest(
                    () => this.client.tokensAPI.recordServiceTokenize(this.client.vaultId, tokenizePayload),
                    TYPES.TOKENIZE
                ).then(records => resolve(new TokenizeResponse({ tokens: records, errors: [] })))
                    .catch(error => {
                        if (error instanceof Error)
                            printLog(error.message, MessageType.ERROR, this.client.getLogLevel());
                        // throw Skyflow Error
                        reject(error);
                    });
            } catch (error) {
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