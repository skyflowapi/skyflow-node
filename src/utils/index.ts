import SkyflowError from "../error";
import * as sdkDetails from "../../package.json";
import { generateBearerToken, generateBearerTokenFromCreds } from "../service-account";
import Credentials from "../vault/config/credentials";
import dotenv from "dotenv";
import logs from "./logs";
import os from 'os';
import process from "process";
import SKYFLOW_ERROR_CODE from "../error/codes";
import { isExpired, isValid } from "./jwt-utils";

dotenv.config();

export const SDK_METRICS_HEADER_KEY = "sky-metadata";

export const SKYFLOW_AUTH_HEADER_KEY = "x-skyflow-authorization";

export const REQUEST_ID_KEY = "x-request-id";

export const LOGLEVEL = "loglevel";

export const CREDENTIALS = "credentials";

export const VAULT_ID = "vaultId";

export const CONNECTION_ID = "connectionId";

export const VAULT = "vault";

export const CONNECTION = "connection";

export enum BYOT {
    DISABLE = 'DISABLE',
    ENABLE = 'ENABLE',
    ENABLE_STRICT = 'ENABLE_STRICT'
};

export enum LogLevel {
    WARN = 'WARN',
    INFO = 'INFO',
    DEBUG = 'DEBUG',
    ERROR = 'ERROR',
    OFF = 'OFF'
}

export enum AuthType {
    TOKEN = 'TOKEN',
    API_KEY = 'API_KEY'
}

export enum MessageType {
    LOG = 'LOG',
    WARN = 'WARN',
    ERROR = 'ERROR',
}

export enum Method {
    POST = 'POST',
    GET = 'GET',
    PUT = 'PUT',
    PATCH = 'PATCH',
}

export enum Env {
    DEV = 'DEV',
    STAGE = 'STAGE',
    SANDBOX = 'SANDBOX',
    PROD = 'PROD',
}

export enum RedactionType {
    DEFAULT = 'DEFAULT',
    PLAIN_TEXT = 'PLAIN_TEXT',
    MASKED = 'MASKED',
    REDACTED = 'REDACTED',
}

export enum OrderByEnum {
    ASCENDING = 'ASCENDING',
    DESCENDING = 'DESCENDING',
    NONE = 'NONE'
};

export const TYPES = {
    INSERT: 'INSERT',
    INSERT_BATCH: 'INSERT_BATCH',
    DETOKENIZE: 'DETOKENIZE',
    TOKENIZE: 'TOKENIZE',
    DELETE: 'DELETE',
    UPDATE: 'UPDATE',
    GET: 'GET',
    FILE_UPLOAD: 'FILE_UPLOAD',
    QUERY: 'QUERY',
    INVOKE_CONNECTION: 'INVOKE_CONNECTION',
};

export interface ISkyflowError {
    http_status?: string | number | null,
    grpc_code?: string | number | null,
    http_code: string | number | null,
    message: string,
    request_ID?: string | null,
    details?: Array<string> | null,
}

export interface AuthInfo {
    key: string,
    type: AuthType
}

export function getVaultURL(clusterID: string, env: Env) {
    switch (env) {
        case Env.PROD:
            return `https://${clusterID}.vault.skyflowapis.com`;
        case Env.SANDBOX:
            return `https://${clusterID}.vault.skyflowapis-preview.com`;
        case Env.DEV:
            return `https://${clusterID}.vault.skyflowapis.dev`;
        case Env.STAGE:
            return `https://${clusterID}.vault.skyflowapis.tech`;
        default:
            return `https://${clusterID}.vault.skyflowapis.com`;
    }
}

export function getConnectionBaseURL(clusterID: string, env: Env) {
    switch (env) {
        case Env.PROD:
            return `https://${clusterID}.gateway.skyflowapis.com`;
        case Env.SANDBOX:
            return `https://${clusterID}.gateway.skyflowapis-preview.com`;
        case Env.DEV:
            return `https://${clusterID}.gateway.skyflowapis.dev`;
        case Env.STAGE:
            return `https://${clusterID}.gateway.skyflowapis.tech`;
        default:
            return `https://${clusterID}.gateway.skyflowapis.com`;
    }
}

export function validateToken(token: string) {
    if (!isValid(token)) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TOKEN);
    }
    if (isExpired(token)) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.TOKEN_EXPIRED);
    }
    return token;
}

export function removeSDKVersion(message: string): string {
    const sdkVersionPattern = /Skyflow Node SDK v[\d\.a-zA-Z\-]+/;
    const cleanedMessage = message.replace(sdkVersionPattern, '').trim();
    return cleanedMessage;
}

// Helper function to generate token based on credentials
export async function getToken(credentials?: Credentials, logLevel?: LogLevel) {
    if (credentials?.credentialsString) {
        return generateBearerTokenFromCreds(credentials.credentialsString, {
            roleIDs: credentials.roles,
            ctx: credentials.context,
            logLevel,
        });
    }

    if (credentials?.path) {
        return generateBearerToken(credentials.path, {
            roleIDs: credentials.roles,
            ctx: credentials.context,
            logLevel,
        });
    }

    throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_CREDENTIALS);
}

export async function getBearerToken(credentials?: Credentials, logLevel?: LogLevel): Promise<AuthInfo> {
    try {
        // If no credentials and no environment variable, throw error
        if (!credentials && process.env.SKYFLOW_CREDENTIALS === undefined) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_CREDENTIALS);
        }
        // If credentials are missing but environment variable exists, use it
        if (!credentials && process.env.SKYFLOW_CREDENTIALS) {
            printLog(logs.infoLogs.USING_SKYFLOW_CREDENTIALS_ENV, MessageType.LOG, logLevel);
            credentials = {
                credentialsString: process.env.SKYFLOW_CREDENTIALS
            }
        }

        // If token already exists, resolve immediately
        if (credentials?.apiKey && credentials.apiKey.trim().length > 0) {
            printLog(logs.infoLogs.USING_API_KEY, MessageType.LOG, logLevel);
            return { type: AuthType.API_KEY, key: credentials.apiKey };
        }

        // If token already exists, resolve immediately
        if (credentials?.token) {
            printLog(logs.infoLogs.USING_BEARER_TOKEN, MessageType.LOG, logLevel);
            return { type: AuthType.TOKEN, key: validateToken(credentials.token) };
        }

        printLog(logs.infoLogs.BEARER_TOKEN_LISTENER, MessageType.LOG, logLevel);

        // Generate token based on provided credentials
        const token = await getToken(credentials, logLevel);

        printLog(logs.infoLogs.BEARER_TOKEN_RESOLVED, MessageType.LOG, logLevel);

        return { type: AuthType.TOKEN, key: token.accessToken };

    } catch (err) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_CREDENTIALS); // rethrow any errors that occur
    }
};

export function getBaseUrl(url: string): string {
    try {
        const parsedUrl = new URL(url);
        return `${parsedUrl.protocol}//${parsedUrl.hostname}`;
    } catch (error) {
        return '';
    }
}

export function fillUrlWithPathAndQueryParams(url: string,
    pathParams?: object,
    queryParams?: object) {
    let filledUrl = url;
    if (pathParams) {
        Object.entries(pathParams).forEach(([key, value]) => {
            filledUrl = url.replace(`{${key}}`, value);
        });
    }
    if (queryParams) {
        filledUrl += '?';
        Object.entries(queryParams).forEach(([key, value]) => {
            filledUrl += `${key}=${value}&`;
        });
        filledUrl = filledUrl.substring(0, filledUrl.length - 1);
    }
    return filledUrl;
}

export const LogLevelOptions = {
    DEBUG: {
        showDebugLogs: true, showInfoLogs: true, showWarnLogs: true, showErrorLogs: true,
    },
    INFO: {
        showDebugLogs: false, showInfoLogs: true, showWarnLogs: true, showErrorLogs: true,
    },
    WARN: {
        showDebugLogs: false, showInfoLogs: false, showWarnLogs: true, showErrorLogs: true,
    },
    ERROR: {
        showDebugLogs: false, showInfoLogs: false, showWarnLogs: false, showErrorLogs: true,
    },
    OFF: {
        showDebugLogs: false, showInfoLogs: false, showWarnLogs: false, showErrorLogs: false,
    }
};


export const printLog = (message: string, messageType: MessageType, logLevel: LogLevel = LogLevel.ERROR) => {
    const {
        showDebugLogs, showInfoLogs, showWarnLogs, showErrorLogs,
    } = LogLevelOptions[logLevel];
    const version = sdkDetails?.version ? `v${sdkDetails?.version}` : '';
    if (messageType === MessageType.LOG && showDebugLogs) {
        // eslint-disable-next-line no-console
        console.log(`DEBUG: [Skyflow Node SDK ${version}] ` + message);
    } else if (messageType === MessageType.LOG && showInfoLogs) {
        // eslint-disable-next-line no-console
        console.log(`INFO: [Skyflow Node SDK ${version}] ` + message);
    } else if (messageType === MessageType.WARN && showWarnLogs) {
        // eslint-disable-next-line no-console
        console.warn(`WARN: [Skyflow Node SDK ${version}] ` + message);
    } else if (messageType === MessageType.ERROR && showErrorLogs) {
        // eslint-disable-next-line no-console
        console.error(`ERROR: [Skyflow Node SDK ${version}] ` + message);
    }
};

export const parameterizedString = (...args: any[]) => {
    const str = args[0];
    const params = args.filter((arg, index) => index !== 0);
    if (!str) return '';
    return str.replace(/%s[0-9]+/g, (matchedStr: any) => {
        const variableIndex = matchedStr.replace('%s', '') - 1;
        return params[variableIndex];
    });
};

export const generateSDKMetrics = (logLevel?: LogLevel) => {
    let sdkNameVersion = "";
    let clientDeviceModel = "";
    let clientOSDetails = "";
    let runtimeDetails = "";
    try {
        sdkNameVersion = `${sdkDetails.name ? `${sdkDetails.name}@` : ""}${sdkDetails.version ? sdkDetails.version : ""
            }`;
    } catch (err) {
        printLog(
            parameterizedString(logs.infoLogs.UNABLE_TO_GENERATE_SDK_METRIC, "sdkNameVersion")
            , MessageType.LOG,
            logLevel
        );
        sdkNameVersion = "";
    }

    try {
        clientDeviceModel = `${process.platform ? `${process.platform}` : ""} ${process.arch ? process.arch : ""
            }`;
    } catch (err) {
        printLog(
            parameterizedString(logs.infoLogs.UNABLE_TO_GENERATE_SDK_METRIC, "clientDeviceModel")
            , MessageType.LOG,
            logLevel
        );
        clientDeviceModel = "";
    }

    try {
        clientOSDetails = `${os.release() && os.platform() ? os.platform() + '-' + os.release() : ""}`;
    } catch (err) {
        printLog(
            parameterizedString(logs.infoLogs.UNABLE_TO_GENERATE_SDK_METRIC, "clientOSDetails")
            , MessageType.LOG,
            logLevel
        );
        clientOSDetails = "";
    }

    try {
        runtimeDetails = `${process.version ? `Node@${process.version}` : ""}`;
    } catch (err) {
        printLog(
            parameterizedString(logs.infoLogs.UNABLE_TO_GENERATE_SDK_METRIC, "runtimeDetails")
            , MessageType.LOG,
            logLevel
        );
        runtimeDetails = "";
    }

    return {
        sdk_name_version: sdkNameVersion,
        sdk_client_device_model: clientDeviceModel,
        sdk_client_os_details: clientOSDetails,
        sdk_runtime_details: runtimeDetails,
    };
};

export const isValidURL = (url: string) => {
    if (url && url.substring(0, 5).toLowerCase() !== 'https') {
        return false;
    }
    try {
        const tempUrl = new URL(url);
        if (tempUrl) return true;
    } catch (err) {
        return false;
    }
};
