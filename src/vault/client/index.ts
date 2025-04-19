// imports 
import { Query } from "../../ _generated_/rest/api/resources/query/client/Client";
import { Records } from "../../ _generated_/rest/api/resources/records/client/Client";
import { Tokens } from "../../ _generated_/rest/api/resources/tokens/client/Client";
import SkyflowError from "../../error";
import errorMessages from "../../error/messages";
import { AuthInfo, AuthType, LogLevel, MessageType, printLog, TYPES } from "../../utils/index";
import { isExpired } from "../../utils/jwt-utils";
import logs from "../../utils/logs";
import Credentials from "../config/credentials";

class VaultClient {

    vaultId!: string;

    url!: string;

    configuration!: Records.Options;

    vaultAPI!: Records;

    tokensAPI!: Tokens;

    queryAPI!: Query;

    individualCredentials?: Credentials;

    skyflowCredentials?: Credentials;

    logLevel!: LogLevel;

    authInfo?: AuthInfo;

    updateTriggered: boolean = false;

    constructor(url: string, vaultId: string, individualCredentials?: Credentials, skyflowCredentials?: Credentials, logLevel?: LogLevel) {
        this.initializeClient(url, vaultId, individualCredentials, skyflowCredentials, logLevel);
    }

    private initializeClient(url: string, vaultId: string, individualCredentials?: Credentials, skyflowCredentials?: Credentials, logLevel?: LogLevel) {
        this.url = url;
        this.vaultId = vaultId;
        this.individualCredentials = individualCredentials;
        this.skyflowCredentials = skyflowCredentials;
        this.logLevel = logLevel || LogLevel.ERROR;
    }

    updateClientConfig(clusterID: string, vaultId: string, individualCredentials?: Credentials, skyflowCredentials?: Credentials, logLevel?: LogLevel) {
        this.updateTriggered = true;
        this.initializeClient(clusterID, vaultId, individualCredentials, skyflowCredentials, logLevel);
    }

    private initConfig(authInfo: AuthInfo) {
        this.authInfo = authInfo;
        this.configuration = {
            baseUrl: this.url,
            token: authInfo.key,
        };

    }

    initAPI(authInfo: AuthInfo, apiType: string) {
        this.initConfig(authInfo);
        switch (apiType) {
            case TYPES.DELETE:
            case TYPES.FILE_UPLOAD:
            case TYPES.GET:
            case TYPES.INSERT:
            case TYPES.INSERT_BATCH:
            case TYPES.UPDATE:
                this.vaultAPI = new Records(this.configuration);
                break;
            case TYPES.DETOKENIZE:
            case TYPES.TOKENIZE:
                this.tokensAPI = new Tokens(this.configuration);
                break;
            case TYPES.QUERY:
                this.queryAPI = new Query(this.configuration);
                break;
            default:
                break;
        }

    }

    getCredentials(): Credentials | undefined {
        if (this.authInfo?.key && !this.updateTriggered) {
            switch (this.authInfo.type) {
                case AuthType.API_KEY:
                    printLog(logs.infoLogs.REUSE_API_KEY, MessageType.LOG, this.logLevel);
                    return { apiKey: this.authInfo.key } as Credentials;
                case AuthType.TOKEN:
                    if (!isExpired(this.authInfo.key)) {
                        printLog(logs.infoLogs.REUSE_BEARER_TOKEN, MessageType.LOG, this.logLevel);
                        return { token: this.authInfo.key } as Credentials;
                    }
            }
        }
        this.updateTriggered = false;
        return this.individualCredentials ?? this.skyflowCredentials;
    }

    getLogLevel(): LogLevel {
        return this.logLevel;
    }

    setLogLevel(logLevel: LogLevel) {
        this.logLevel = logLevel;
    }

    updateSkyflowCredentials(credentials?: Credentials) {
        this.updateTriggered = true;
        this.skyflowCredentials = credentials;
    }

    private normalizeErrorMeta(err: any) {
        const isNewFormat = !!err?.rawResponse;
    
        if (isNewFormat) {
            const headers = err?.rawResponse?.headers;
            const contentType = headers?.get('content-type');
            const requestId = headers?.get('x-request-id');
            const errorFromClientHeader = headers?.get('error-from-client');
            const errorFromClient = errorFromClientHeader
                ? String(errorFromClientHeader).toLowerCase() === 'true'
                : undefined;
    
            return {
                isNewFormat,
                contentType,
                requestId,
                errorFromClient
            };
        } else {
            const headers = err?.response?.headers || {};
            const contentType = headers['content-type'];
            const requestId = headers['x-request-id'];
            const errorFromClientHeader = headers['error-from-client'];
            const errorFromClient = errorFromClientHeader
                ? String(errorFromClientHeader).toLowerCase() === 'true'
                : undefined;
    
            return {
                isNewFormat,
                contentType,
                requestId,
                errorFromClient
            };
        }
    }
    

    failureResponse = (err: any) => new Promise((_, reject) => {
        const { isNewFormat, contentType, requestId, errorFromClient } = this.normalizeErrorMeta(err);
    
        const data = isNewFormat ? err?.body?.error : err?.response?.data;
    
        if (contentType) {
            if (contentType.includes('application/json')) {
                this.handleJsonError(err, data, requestId, reject, errorFromClient);
            } else if (contentType.includes('text/plain')) {
                this.handleTextError(err, data, requestId, reject, errorFromClient);
            } else {
                this.handleGenericError(err, requestId, reject, errorFromClient);
            }
        } else {
            this.handleGenericError(err, requestId, reject, errorFromClient);
        }
    });
    

    private handleJsonError(err: any, data: any, requestId: string, reject: Function, errorFromClient?: boolean) {
        const isNewFormat = !!err?.rawResponse;
    
        if (isNewFormat) {
            let description = data?.message;
            const statusCode = data?.http_code;
            const grpcCode = data?.grpc_code;
            let details = data?.details || [];
    
            if (errorFromClient !== undefined) {
                details = Array.isArray(details)
                    ? [...details, { errorFromClient }]
                    : [{ errorFromClient }];
            }
    
            this.logAndRejectError(description, err, requestId, reject, statusCode, grpcCode, details, isNewFormat);
        } else {
            let description = data;
            const statusCode = description?.error?.http_status;
            const grpcCode = description?.error?.grpc_code;
            let details = description?.error?.details;
    
            if (errorFromClient !== undefined) {
                details = Array.isArray(details)
                    ? [...details, { errorFromClient }]
                    : [{ errorFromClient }];
            }
    
            description = description?.error?.message || description;
            this.logAndRejectError(description, err, requestId, reject, statusCode, grpcCode, details, isNewFormat);
        }
    }
    
    
    private handleTextError(err: any, data: any, requestId: string, reject: Function, errorFromClient?: boolean) {
        const isNewFormat = !!err?.rawResponse
        let details: any = [];
    
        if (errorFromClient !== undefined) {
            details.push({ errorFromClient });
        }
    
        const description = isNewFormat ? data?.message: data;
        this.logAndRejectError(description, err, requestId, reject, undefined, undefined, details, isNewFormat);
    }
    
    
    private handleGenericError(err: any, requestId: string, reject: Function, errorFromClient?: boolean) {
        const isNewFormat = !!err?.rawResponse;
        let description: any;
        let grpcCode: any;
        let details: any = [];
    
        if (isNewFormat) {
            description = err?.body?.error?.message || err?.message;
            grpcCode = err?.body?.error?.grpc_code;
            details = err?.body?.error?.details || [];
        } else {
            description = err?.response?.data || err?.message || errorMessages.ERROR_OCCURRED;
        }
    
        if (errorFromClient !== undefined) {
            details = Array.isArray(details)
                ? [...details, { errorFromClient }]
                : [{ errorFromClient }];
        }
    
        this.logAndRejectError(description, err, requestId, reject, undefined, grpcCode, details, isNewFormat);
    }
    
    
    private logAndRejectError(
        description: string,
        err: any,
        requestId: string,
        reject: Function,
        httpStatus?: number,
        grpcCode?: number,
        details?: any,
        isNewError?: boolean
    ) {
        printLog(description, MessageType.ERROR, this.getLogLevel());
        reject(new SkyflowError({
            http_code: isNewError ? err?.statusCode : err?.response?.status || 400,
            message: description,
            request_ID: requestId,
            grpc_code: grpcCode,
            http_status: httpStatus,
            details: details,
        }, []));
    }

}

export default VaultClient;