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

    failureResponse = (err: any) => new Promise((_, reject) => {
        const contentType = err.response?.headers['content-type'];
        const data = err.response?.data;
        const requestId = err.response?.headers['x-request-id'];

        const errorFromClientHeader = err.response?.headers?.['error-from-client'];
        const errorFromClient = errorFromClientHeader ? String(errorFromClientHeader).toLowerCase() === 'true' : undefined;

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
        let description = data;
        const statusCode = description?.error?.http_status;
        const grpcCode = description?.error?.grpc_code;
        let details = description?.error?.details;
        
        if (errorFromClient !== undefined) {
            details = Array.isArray(details)
                        ? [...details, { errorFromClient: errorFromClient }]
                        : [{ errorFromClient: errorFromClient }];
        }
 
        description = description?.error?.message || description;
        this.logAndRejectError(description, err, requestId, reject, statusCode, grpcCode, details);
    }

    private handleTextError(err: any, data: any, requestId: string, reject: Function, errorFromClient?: boolean) {
        let details: any = [];

        if (errorFromClient !== undefined) {
            details.push({ errorFromClient });
        }
        
        this.logAndRejectError(data, err, requestId, reject, undefined, undefined, details);
    }

    private handleGenericError(err: any, requestId: string, reject: Function, errorFromClient?: boolean) {
        const description =  err?.response?.data || err?.message || errorMessages.ERROR_OCCURRED;
        let details: any = [];

        if (errorFromClient !== undefined) {
            details.push({ errorFromClient });
        }
        this.logAndRejectError(description, err, requestId, reject, undefined, undefined, details);
    }

    private logAndRejectError(
        description: string,
        err: any,
        requestId: string,
        reject: Function,
        httpStatus?: number,
        grpcCode?: number,
        details?: any
    ) {
        printLog(description, MessageType.ERROR, this.getLogLevel());
        reject(new SkyflowError({
            http_code: err?.response?.status || 400,
            message: description,
            request_ID: requestId,
            grpc_code: grpcCode,
            http_status: httpStatus,
            details: details,
        }, []));
    }

}

export default VaultClient;