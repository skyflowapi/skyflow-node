// imports 
import { Configuration, QueryApi, RecordsApi, TokensApi } from "../../ _generated_/rest";
import { AuthInfo, AuthType, LogLevel, TYPES } from "../../utils/index";
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

}

export default VaultClient;