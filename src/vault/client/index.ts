// imports 
import { Configuration, QueryApi, RecordsApi, TokensApi } from "../../ _generated_/rest";
import SkyflowError from "../../error";
import errorMessages from "../../error/messages";
import { AuthInfo, AuthType, LogLevel, MessageType, printLog, TYPES } from "../../utils/index";
import { isExpired } from "../../utils/jwt-utils";
import Credentials from "../config/credentials";

class VaultClient {

    vaultId!: string;

    url!: string;

    configuration!: Configuration;

    vaultAPI!: RecordsApi;

    tokensAPI!: TokensApi;

    queryAPI!: QueryApi;

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
        this.updateTriggered = true
        this.initializeClient(clusterID, vaultId, individualCredentials, skyflowCredentials, logLevel);
    }

    private initConfig(authInfo: AuthInfo) {
        this.authInfo = authInfo;
        this.configuration = new Configuration({
            basePath: this.url,
            accessToken: authInfo.key,
        });

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
                this.vaultAPI = new RecordsApi(this.configuration);
                break;
            case TYPES.DETOKENIZE:
            case TYPES.TOKENIZE:
                this.tokensAPI = new TokensApi(this.configuration);
                break;
            case TYPES.QUERY:
                this.queryAPI = new QueryApi(this.configuration);
                break;
            default:
                break;
        }

    }

    getCredentials(): Credentials | undefined {
        if (this.authInfo?.key && !this.updateTriggered) {
            switch (this.authInfo.type) {
                case AuthType.API_KEY:
                    return { apiKey: this.authInfo.key } as Credentials;
                case AuthType.TOKEN:
                    if (!isExpired(this.authInfo.key)) {
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

    updateLogLevel(logLevel: LogLevel) {
        this.logLevel = logLevel;
    }

    updateSkyflowCredentials(credentials?: Credentials) {
        this.skyflowCredentials = credentials;
    }

    failureResponse = (err: any) => new Promise((_, reject) => {
        const contentType = err.response?.headers['content-type'];
        const data = err.response?.data;
        const requestId = err.response?.headers['x-request-id'];

        if (contentType) {
            if (contentType.includes('application/json')) {
                this.handleJsonError(err, data, requestId, reject);
            } else if (contentType.includes('text/plain')) {
                this.handleTextError(err, data, requestId, reject);
            } else {
                this.handleGenericError(err, requestId, reject);
            }
        } else {
            this.handleGenericError(err, requestId, reject);
        }
    });

    private handleJsonError(err: any, data: any, requestId: string, reject: Function) {
        let description = data;
        const statusCode = description?.error?.http_status;
        const grpcCode = description?.error?.grpc_code;
        const details = description?.error?.details;

        description = description?.error?.message || description;
        this.logAndRejectError(description, err, requestId, reject, statusCode, grpcCode, details);
    }

    private handleTextError(err: any, data: any, requestId: string, reject: Function) {
        this.logAndRejectError(data, err, requestId, reject);
    }

    private handleGenericError(err: any, requestId: string, reject: Function) {
        const description = err?.message || errorMessages.ERROR_OCCURRED;
        this.logAndRejectError(description, err, requestId, reject);
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