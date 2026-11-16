import { CONFIG, Env, isValidURL, LogLevel, MessageType, printLog, API_KEY } from "../utils";
import SkyflowError from "../error";
import SKYFLOW_ERROR_CODE from "../error/codes";
import ConnectionConfig from "../config/connection";
import Credentials, { ApiKeyCredentials, PathCredentials, StringCredentials, TokenCredentials } from "../config/credentials";
import VaultConfig from "../config/vault";
import { SkyflowConfig } from "../types";
import * as fs from 'fs';
import { isExpired } from "../utils/jwt-utils";
import logs from "../utils/logs";

export function isEnv(value?: string): boolean {
    return value !== undefined && Object.values(Env).includes(value as Env);
}

export function isLogLevel(value?: string): boolean {
    return value !== undefined && Object.values(LogLevel).includes(value as LogLevel);
}

export function isValidAPIKey(apiKey: string) {
    if (!apiKey) {
        return false;
    }
    if (apiKey && typeof apiKey === 'string' && apiKey.startsWith(API_KEY.PREFIX)) {
        return true;
    }
    return false;
};

function isValidCredentialsString(credentialsString: string) {
    if (!credentialsString || credentialsString === null || credentialsString === undefined) {
        return false;
    }
    if (credentialsString && typeof credentialsString === 'string') {
        try {
            let credentialsObj = JSON.parse("{}")
            const parsed = JSON.parse(credentialsString);
            credentialsObj = {
                ...parsed,
                clientId: parsed.clientId ?? parsed.clientID,
                keyId: parsed.keyId ?? parsed.keyID,
                tokenUri: parsed.tokenUri ?? parsed.tokenURI,
            };
            if (credentialsObj?.clientId == null || credentialsObj?.keyId == null) {
                return false;
            }
            return true;
        } catch (err) {
            return false;
        }
    }
    return false;
};

function isValidPath(path: string) {
    if (!path || path === null || path === undefined) {
        return false;
    }
    if (path && typeof path === 'string' && fs.existsSync(path)) {
        return true;
    }
    return false;
};

export const validateSkyflowConfig = (config: SkyflowConfig, logLevel: LogLevel = LogLevel.ERROR) => {
    if (config) {
        if (!Object.prototype.hasOwnProperty.call(config, 'vaultConfigs')) {
            printLog(logs.errorLogs.VAULT_CONFIG_KEY_MISSING, MessageType.ERROR, logLevel);
        }

        const { vaultConfigs, connectionConfigs } = config;

        // Count how many of the fields are defined
        const definedFields = [vaultConfigs, connectionConfigs].filter(Boolean).length;

        // If none are present
        if (definedFields === 0) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_SKYFLOW_CONFIG);
        }

        if (config?.vaultConfigs && !Array.isArray(config.vaultConfigs)) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TYPE_FOR_CONFIG, [CONFIG.VAULT])
        }

        if (config?.connectionConfigs && !Array.isArray(config?.connectionConfigs)) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TYPE_FOR_CONFIG, [CONFIG.CONNECTION])
        }

    } else {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.CONFIG_MISSING);
    }
};


export const validateCredentialsWithId = (credentials: Credentials, type: string, typeId: string, id: string, logLevel: LogLevel = LogLevel.ERROR) => {
    if (!credentials) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_CREDENTIALS_WITH_ID, [type, typeId, id]);
    }

    const isTokenCred = 'token' in credentials;
    const isPathCred = 'path' in credentials;
    const isStringCred = 'credentialsString' in credentials;
    const isApiKeyCred = 'apiKey' in credentials;

    // Check if exactly one credential type is provided
    const definedTypes = [isTokenCred, isPathCred, isStringCred, isApiKeyCred].filter(Boolean).length;

    if (definedTypes === 0) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_CREDENTIALS_WITH_ID, [type, typeId, id]);
    }

    if (definedTypes > 1) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.MULTIPLE_CREDENTIALS_PASSED_WITH_ID, [type, typeId, id]);
    }

    // Validate TokenCredentials
    if (isTokenCred) {
        const tokenCred = credentials as TokenCredentials;
        if (typeof tokenCred.token !== 'string' || isExpired(tokenCred.token)) {
            printLog(logs.errorLogs.EMPTY_TOKEN_VALUE, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_BEARER_TOKEN_WITH_ID, [type, typeId, id]);
        }
    }

    // Validate PathCredentials
    if (isPathCred) {
        const pathCred = credentials as PathCredentials;
        if (typeof pathCred.path !== 'string' || !isValidPath(pathCred.path)) {
            printLog(logs.errorLogs.EMPTY_CREDENTIALS_PATH, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_FILE_PATH_WITH_ID, [type, typeId, id]);
        }
        if (pathCred.roles !== undefined && !Array.isArray(pathCred.roles)) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_ROLES_KEY_TYPE, [type, typeId, id]);
        }
        if (pathCred.context !== undefined && (typeof pathCred.context !== 'string' && typeof pathCred.context !== 'object')) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_CONTEXT, [type, typeId, id]);
        }
        if(Object.prototype.hasOwnProperty.call(pathCred, 'tokenUri')) {
            if (pathCred.tokenUri === undefined || typeof pathCred.tokenUri !== 'string' || !isValidURL(pathCred.tokenUri)) {
                printLog(logs.errorLogs.INVALID_TOKEN_URI, MessageType.ERROR, logLevel);
                throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TOKEN_URI_WITH_ID, [type, typeId, id]);
            }
        }
    }

    // Validate StringCredentials
    if (isStringCred) {
        const stringCred = credentials as StringCredentials;
        if (typeof stringCred.credentialsString !== 'string' || !isValidCredentialsString(stringCred.credentialsString)) {
            printLog(logs.errorLogs.EMPTY_CREDENTIALS_STRING, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_PARSED_CREDENTIALS_STRING_WITH_ID, [type, typeId, id]);
        }
        if (stringCred.roles !== undefined && !Array.isArray(stringCred.roles)) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_ROLES_KEY_TYPE, [type, typeId, id]);
        }
        if (stringCred.context !== undefined && (typeof stringCred.context !== 'string' && typeof stringCred.context !== 'object')) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_CONTEXT, [type, typeId, id]);
        }
        if (Object.prototype.hasOwnProperty.call(stringCred, 'tokenUri')) {
            if (stringCred.tokenUri === undefined || typeof stringCred.tokenUri !== 'string' || !isValidURL(stringCred.tokenUri)) {
                printLog(logs.errorLogs.INVALID_TOKEN_URI, MessageType.ERROR, logLevel);
                throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TOKEN_URI_WITH_ID, [type, typeId, id]);
            }
        }
    }

    // Validate ApiKeyCredentials
    if (isApiKeyCred) {
        const apiKeyCred = credentials as ApiKeyCredentials;
        if (typeof apiKeyCred.apiKey !== 'string' || !isValidAPIKey(apiKeyCred.apiKey)) {
            printLog(logs.errorLogs.INVALID_KEY, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_KEY_WITH_ID, [type, typeId, id]);
        }
    }
};

export const validateVaultConfig = (vaultConfig: VaultConfig, logLevel: LogLevel = LogLevel.ERROR) => {
    if (vaultConfig) {
        if (!Object.prototype.hasOwnProperty.call(vaultConfig, 'vaultId')) {
            printLog(logs.errorLogs.EMPTY_VAULT_ID, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_VAULT_ID);
        }
        if (!vaultConfig.vaultId || typeof vaultConfig.vaultId !== 'string') {
            printLog(logs.errorLogs.INVALID_VAULT_ID, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_VAULT_ID);
        }
        if (!Object.prototype.hasOwnProperty.call(vaultConfig, 'clusterId')) {
            printLog(logs.errorLogs.EMPTY_CLUSTER_ID, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_CLUSTER_ID, [vaultConfig?.vaultId]);
        }
        if (!vaultConfig.clusterId || typeof vaultConfig.clusterId !== 'string') {
            printLog(logs.errorLogs.INVALID_CLUSTER_ID, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_CLUSTER_ID, [vaultConfig?.vaultId]);
        }
        if (vaultConfig?.env && !isEnv(vaultConfig.env)) {
            printLog(logs.errorLogs.INVALID_ENV, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_ENV, [vaultConfig?.vaultId]);
        }
        if (vaultConfig?.credentials) {
            validateCredentialsWithId(vaultConfig.credentials, CONFIG.VAULT, CONFIG.VAULT_ID, vaultConfig.vaultId, logLevel);
        }
    } else {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_VAULT_CONFIG);
    }
};

export const validateUpdateVaultConfig = (vaultConfig: VaultConfig, logLevel: LogLevel = LogLevel.ERROR) => {
    if (vaultConfig) {
        if (!Object.prototype.hasOwnProperty.call(vaultConfig, 'vaultId')) {
            printLog(logs.errorLogs.EMPTY_VAULT_ID, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_VAULT_ID);
        }
        if (!vaultConfig?.vaultId || typeof vaultConfig?.vaultId !== 'string') {
            printLog(logs.errorLogs.INVALID_VAULT_ID, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_VAULT_ID);
        }
        if (vaultConfig?.clusterId && typeof vaultConfig.clusterId !== 'string') {
            printLog(logs.errorLogs.INVALID_CLUSTER_ID, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_CLUSTER_ID, [vaultConfig?.vaultId]);
        }
        if (vaultConfig?.env && !isEnv(vaultConfig.env)) {
            printLog(logs.errorLogs.INVALID_ENV, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_ENV, [vaultConfig?.vaultId]);
        }
        if (vaultConfig?.credentials) {
            validateCredentialsWithId(vaultConfig.credentials, CONFIG.VAULT, CONFIG.VAULT_ID, vaultConfig.vaultId, logLevel);
        }
    } else {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_VAULT_CONFIG);
    }
};

export const validateSkyflowCredentials = (credentials: Credentials, logLevel: LogLevel = LogLevel.ERROR) => {
    if (!credentials) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.CREDENTIALS_WITH_NO_VALID_KEY);
    }

    const isTokenCred = 'token' in credentials;
    const isPathCred = 'path' in credentials;
    const isStringCred = 'credentialsString' in credentials;
    const isApiKeyCred = 'apiKey' in credentials;

    // Check if exactly one credential type is provided
    const definedTypes = [isTokenCred, isPathCred, isStringCred, isApiKeyCred].filter(Boolean).length;

    if (definedTypes === 0) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.CREDENTIALS_WITH_NO_VALID_KEY);
    }

    if (definedTypes > 1) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.MULTIPLE_CREDENTIALS_PASSED);
    }

    // Validate TokenCredentials
    if (isTokenCred) {
        const tokenCred = credentials as TokenCredentials;
        if (typeof tokenCred.token !== 'string' || isExpired(tokenCred.token)) {
            printLog(logs.errorLogs.EMPTY_TOKEN_VALUE, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_BEARER_TOKEN);
        }
    }

    // Validate PathCredentials
    if (isPathCred) {
        const pathCred = credentials as PathCredentials;
        if (typeof pathCred.path !== 'string' || !isValidPath(pathCred.path)) {
            printLog(logs.errorLogs.EMPTY_CREDENTIALS_PATH, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_CREDENTIALS_FILE_PATH);
        }
        if (pathCred.roles !== undefined && !Array.isArray(pathCred.roles)) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_ROLES_KEY_TYPE);
        }
        if (pathCred.context !== undefined && (typeof pathCred.context !== 'string' && typeof pathCred.context !== 'object')) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_CONTEXT);
        }

        if(Object.prototype.hasOwnProperty.call(pathCred, 'tokenUri')) {
            if (pathCred.tokenUri === undefined || typeof pathCred.tokenUri !== 'string' || !isValidURL(pathCred.tokenUri)) {
                printLog(logs.errorLogs.INVALID_TOKEN_URI, MessageType.ERROR, logLevel);
                throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TOKEN_URI);
            }
        }
    }

    // Validate StringCredentials
    if (isStringCred) {
        const stringCred = credentials as StringCredentials;
        if (typeof stringCred.credentialsString !== 'string' || !isValidCredentialsString(stringCred.credentialsString)) {
            printLog(logs.errorLogs.EMPTY_CREDENTIALS_STRING, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_PARSED_CREDENTIALS_STRING);
        }
        if (stringCred.roles !== undefined && !Array.isArray(stringCred.roles)) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_ROLES_KEY_TYPE);
        }
        // validate both string | Record<string, any>
        if (stringCred.context !== undefined && (typeof stringCred.context !== 'string' && typeof stringCred.context !== 'object')) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_CONTEXT);
        }
        if (Object.prototype.hasOwnProperty.call(stringCred, 'tokenUri')) {
            if (stringCred.tokenUri === undefined || typeof stringCred.tokenUri !== 'string' || !isValidURL(stringCred.tokenUri)) {
                printLog(logs.errorLogs.INVALID_TOKEN_URI, MessageType.ERROR, logLevel);
                throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TOKEN_URI);
            }
        }
    }

    // Validate ApiKeyCredentials
    if (isApiKeyCred) {
        const apiKeyCred = credentials as ApiKeyCredentials;
        if (typeof apiKeyCred.apiKey !== 'string' || !isValidAPIKey(apiKeyCred.apiKey)) {
            printLog(logs.errorLogs.INVALID_KEY, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_KEY);
        }
    }
};

export const validateConnectionConfig = (connectionConfig: ConnectionConfig, logLevel: LogLevel = LogLevel.ERROR) => {
    if (connectionConfig) {
        if (!Object.prototype.hasOwnProperty.call(connectionConfig, 'connectionId')) {
            printLog(logs.errorLogs.EMPTY_CONNECTION_ID, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_CONNECTION_ID);
        }

        if (typeof connectionConfig?.connectionId !== 'string' || connectionConfig?.connectionId.trim().length === 0) {
            printLog(logs.errorLogs.INVALID_CONNECTION_ID, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_CONNECTION_ID);
        }

        if (!Object.prototype.hasOwnProperty.call(connectionConfig, 'connectionUrl')) {
            printLog(logs.errorLogs.EMPTY_CONNECTION_URL, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_CONNECTION_URL);
        }

        if (typeof connectionConfig?.connectionUrl !== 'string' || connectionConfig?.connectionUrl.trim().length === 0) {
            printLog(logs.errorLogs.INVALID_CONNECTION_URL, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_CONNECTION_URL);
        }

        if (connectionConfig.connectionUrl && !isValidURL(connectionConfig.connectionUrl)) {
            printLog(logs.errorLogs.INVALID_CONNECTION_URL_TYPE, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_CONNECTION_URL);
        }

        if (connectionConfig?.credentials) {
            validateCredentialsWithId(connectionConfig.credentials, CONFIG.CONNECTION, CONFIG.CONNECTION_ID, connectionConfig.connectionId, logLevel);
        }
    } else {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_CONNECTION_CONFIG)
    }
};

export const validateUpdateConnectionConfig = (connectionConfig: ConnectionConfig, logLevel: LogLevel = LogLevel.ERROR) => {
    if (connectionConfig) {
        if (!Object.prototype.hasOwnProperty.call(connectionConfig, 'connectionId')) {
            printLog(logs.errorLogs.EMPTY_CONNECTION_ID, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_CONNECTION_ID);
        }

        if (typeof connectionConfig?.connectionId !== 'string' || connectionConfig?.connectionId.trim().length === 0) {
            printLog(logs.errorLogs.INVALID_CONNECTION_ID, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_CONNECTION_ID);
        }

        if (connectionConfig?.connectionUrl && (typeof connectionConfig?.connectionUrl !== 'string' || connectionConfig?.connectionUrl.trim().length === 0)) {
            printLog(logs.errorLogs.INVALID_CONNECTION_URL, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_CONNECTION_URL);
        }

        if (connectionConfig?.connectionUrl && !isValidURL(connectionConfig.connectionUrl)) {
            printLog(logs.errorLogs.INVALID_CONNECTION_URL_TYPE, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_CONNECTION_URL);
        }

        if (connectionConfig?.credentials) {
            validateCredentialsWithId(connectionConfig.credentials, CONFIG.CONNECTION, CONFIG.CONNECTION_ID, connectionConfig.connectionId, logLevel);
        }
    } else {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_CONNECTION_CONFIG)
    }
};
