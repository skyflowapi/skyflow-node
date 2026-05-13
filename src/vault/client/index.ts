// imports 
import { Files } from "../../ _generated_/rest/api/resources/files/client/Client";
import { Query } from "../../ _generated_/rest/api/resources/query/client/Client";
import { Records } from "../../ _generated_/rest/api/resources/records/client/Client";
import { Strings } from "../../ _generated_/rest/api/resources/strings/client/Client";
import { Tokens } from "../../ _generated_/rest/api/resources/tokens/client/Client";
import SkyflowError from "../../error";
import errorMessages from "../../error/messages";
import { AuthInfo, AuthType, LogLevel, MessageType, printLog, TYPES, HTTP_HEADER, CONTENT_TYPE, BOOLEAN_STRING, HTTP_STATUS_CODE } from "../../utils/index";
import { isExpired } from "../../utils/jwt-utils";
import logs from "../../utils/logs";
import Credentials from "../config/credentials";
import { SkyflowApiErrorLegacy, SkyflowApiErrorNewFormat, SkyflowErrorData } from "../types";

class VaultClient {

    vaultId!: string;

    url!: string;

    private currentToken: string = '';

    vaultAPI!: Records;

    tokensAPI!: Tokens;

    queryAPI!: Query;

    stringsAPI!: Strings;

    filesAPI!: Files;

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

    updateClientConfig(clusterId: string, vaultId: string, individualCredentials?: Credentials, skyflowCredentials?: Credentials, logLevel?: LogLevel) {
        this.updateTriggered = true;
        this.initializeClient(clusterId, vaultId, individualCredentials, skyflowCredentials, logLevel);
    }

    private initConfig(authInfo: AuthInfo) {
        this.authInfo = authInfo;
        this.currentToken = authInfo.key;
    }

    private supplierOptions(): Records.Options {
        return {
            baseUrl: () => this.url,
            token: () => this.currentToken,
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
                if (!this.vaultAPI) {
                    this.vaultAPI = new Records(this.supplierOptions());
                } 
                break;
            case TYPES.DETOKENIZE:
            case TYPES.TOKENIZE:
                if (!this.tokensAPI) {
                    this.tokensAPI = new Tokens(this.supplierOptions());
                } 
                break;
            case TYPES.QUERY:
                if (!this.queryAPI) {
                    this.queryAPI = new Query(this.supplierOptions());
                } 
                break;
            case TYPES.DEIDENTIFY_TEXT:
            case TYPES.REIDENTIFY_TEXT:
                if (!this.stringsAPI) {
                    this.stringsAPI = new Strings(this.supplierOptions());
                }
                break;
            case TYPES.DEIDENTIFY_FILE:
            case TYPES.DETECT_RUN:
                if (!this.filesAPI) {
                    this.filesAPI = new Files(this.supplierOptions());
                }
                break;
            default:
                break;
        }
    }

    getCredentials(): Credentials | undefined {
        if (this.authInfo?.key && !this.updateTriggered) {
            switch (this.authInfo.type) {
                case AuthType.API_KEY:
                    printLog(logs.infoLogs.REUSE_KEY, MessageType.LOG, this.logLevel);
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

    private normalizeErrorMeta(err: SkyflowApiErrorNewFormat | SkyflowApiErrorLegacy | SkyflowError | Error) {
        const isNewFormat = (err as SkyflowApiErrorNewFormat).rawResponse !== undefined;
        if (isNewFormat) {
            const headers = (err as SkyflowApiErrorNewFormat).rawResponse?.headers;
            const contentType = headers?.get(HTTP_HEADER.CONTENT_TYPE_LOWER);
            const requestId = headers?.get(HTTP_HEADER.X_REQUEST_ID) || '';
            const errorFromClientHeader = headers?.get(HTTP_HEADER.ERROR_FROM_CLIENT);
            const errorFromClient = errorFromClientHeader
                ? String(errorFromClientHeader).toLowerCase() === BOOLEAN_STRING.TRUE
                : undefined;
    
            return {
                isNewFormat,
                contentType,
                requestId,
                errorFromClient
            };
        } else {
            const headers = (err as SkyflowApiErrorLegacy).headers || {};
            const contentType = headers.get(HTTP_HEADER.CONTENT_TYPE_LOWER);
            const requestId = headers.get(HTTP_HEADER.X_REQUEST_ID) || '';

            
            
            const errorFromClientHeader = headers.get(HTTP_HEADER.ERROR_FROM_CLIENT);
            const errorFromClient = errorFromClientHeader
                ? String(errorFromClientHeader).toLowerCase() === BOOLEAN_STRING.TRUE
                : undefined;
    
            return {
                isNewFormat,
                contentType,
                requestId,
                errorFromClient
            };
        }
    }
    

    failureResponse = (err: SkyflowApiErrorNewFormat | SkyflowApiErrorLegacy | SkyflowError | Error) => new Promise((_, reject) => {
        const { isNewFormat, contentType, requestId, errorFromClient } = this.normalizeErrorMeta(err);
    
        const data: SkyflowErrorData = isNewFormat
        ? (err as SkyflowApiErrorNewFormat).body?.error
        : (err as SkyflowApiErrorLegacy).body?.error;

        if (contentType) {
            if (contentType.includes(CONTENT_TYPE.APPLICATION_JSON)) {
                this.handleJsonError(err as SkyflowApiErrorNewFormat | SkyflowApiErrorLegacy, data, requestId, reject, errorFromClient);
            } else if (contentType.includes(CONTENT_TYPE.TEXT_PLAIN)) {
                this.handleTextError(err as SkyflowApiErrorNewFormat | SkyflowApiErrorLegacy, data, requestId, reject, errorFromClient);
            } else {
                this.handleGenericError(err as SkyflowApiErrorNewFormat | SkyflowApiErrorLegacy, requestId, reject, errorFromClient);
            }
        } else {
            this.handleGenericError(err as SkyflowApiErrorNewFormat | SkyflowApiErrorLegacy, requestId, reject, errorFromClient);
        }
    });
    


    private isSkyflowApiErrorNewFormat(err: SkyflowApiErrorNewFormat | SkyflowApiErrorLegacy): err is SkyflowApiErrorNewFormat {
        return (err as SkyflowApiErrorNewFormat).rawResponse !== undefined;
    }

    private handleJsonError(
        err: SkyflowApiErrorNewFormat | SkyflowApiErrorLegacy,
        data: SkyflowErrorData,
        requestId: string,
        reject: Function,
        errorFromClient?: boolean
        ) {
        const isNewFormat = this.isSkyflowApiErrorNewFormat(err);

        if (isNewFormat) {
            const errorData = data as SkyflowApiErrorNewFormat['body']['error'];
            let description: string = errorData?.message;
            const grpcCode: number | string | undefined = errorData?.grpc_code;
            const status: string | undefined = errorData?.http_status;
            let details: any = errorData?.details || [];

            if (errorFromClient !== undefined) {
            details = Array.isArray(details)
                ? [...details, { errorFromClient }]
                : [{ errorFromClient }];
            }

            this.logAndRejectError(
            description,
            err,
            requestId,
            reject,
            status,
            grpcCode,
            details,
            isNewFormat
            );
        } else {
            // data is SkyflowApiErrorLegacyBody['error']
            const legacyErr = err as SkyflowApiErrorLegacy;
            const errorData = legacyErr.body?.error;
            let description: string = errorData?.message || errorMessages.ERROR_OCCURRED;
            const statusCode: number | undefined = errorData?.http_code;
            const grpcCode: number | string | undefined = errorData?.grpc_code;
            let details: any = errorData?.details || [];

            if (errorFromClient !== undefined) {
            details = Array.isArray(details)
                ? [...details, { errorFromClient }]
                : [{ errorFromClient }];
            }

            this.logAndRejectError(
            description,
            err,
            requestId,
            reject,
            statusCode,
            grpcCode,
            details,
            isNewFormat
            );
        }
    }

    private handleTextError(
        err: SkyflowApiErrorNewFormat | SkyflowApiErrorLegacy,
        data: SkyflowErrorData,
        requestId: string,
        reject: Function,
        errorFromClient?: boolean
    ) {
        const isNewFormat = this.isSkyflowApiErrorNewFormat(err);
        let details: object[] = [];

        if (errorFromClient !== undefined) {
            details.push({ errorFromClient });
        }

        let description: string;
        let status: string | number | undefined;
        let grpcCode: number | string | undefined;

        if (isNewFormat) {
            const errorData = data as SkyflowApiErrorNewFormat['body']['error'];
            description = errorData?.message || data?.rawBody || errorMessages.ERROR_OCCURRED;
            status = errorData?.http_code;
            grpcCode = errorData?.grpc_code;
        } else {
            const legacyErr = err as SkyflowApiErrorLegacy;
            const errorData = legacyErr.body?.error;
            description = errorData?.message || errorMessages.ERROR_OCCURRED;
            status = errorData?.http_status;
            grpcCode = errorData?.grpc_code;
        }

        this.logAndRejectError(
            description,
            err,
            requestId,
            reject,
            status,
            grpcCode,
            details,
            isNewFormat
        );
    }

    private handleGenericError(
        err: SkyflowApiErrorNewFormat | SkyflowApiErrorLegacy,
        requestId: string,
        reject: Function,
        errorFromClient?: boolean
    ) {
        const isNewFormat = this.isSkyflowApiErrorNewFormat(err);
        let description: string;
        let grpcCode: number | string | undefined;
        let details: any = [];

        if (isNewFormat) {
            const errorData = (err as SkyflowApiErrorNewFormat).body?.error;
            description =
            errorData?.message ??
            (err as SkyflowApiErrorNewFormat).message ??
            errorMessages.GENERIC_API_ERROR;
            grpcCode = errorData?.grpc_code;
            details = errorData?.details || [];
        } else {
            const legacyErr = err as SkyflowApiErrorLegacy;
            const errorData = legacyErr.body?.error;
            description = errorData?.message || errorMessages.ERROR_OCCURRED;
            grpcCode = errorData?.grpc_code;
            details = errorData?.details || [];
        }

        if (errorFromClient !== undefined) {
            details = Array.isArray(details)
            ? [...details, { errorFromClient }]
            : [{ errorFromClient }];
        }

        this.logAndRejectError(
            description,
            err,
            requestId,
            reject,
            undefined,
            grpcCode,
            details,
            isNewFormat
        );
    }
    
    private logAndRejectError(
        description: string,
        err: SkyflowApiErrorNewFormat | SkyflowApiErrorLegacy,
        requestId: string,
        reject: Function,
        httpStatus?: string | number,
        grpcCode?: number | string,
        details?: any,
        isNewError?: boolean
    ) {
        printLog(description, MessageType.ERROR, this.getLogLevel());
        reject(new SkyflowError({
            http_code: isNewError ? (err?.statusCode ?? err?.body?.error?.http_code ?? HTTP_STATUS_CODE.BAD_REQUEST) : err?.body?.error?.http_code ?? HTTP_STATUS_CODE.BAD_REQUEST,
            message: description,
            requestId: requestId,
            grpc_code: grpcCode,
            http_status: httpStatus,
            details: details,
        }, []));
    }

}

export default VaultClient;