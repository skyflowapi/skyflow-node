import { CONNECTION, CONNECTION_ID, Env, isValidURL, LogLevel, MessageType, RequestMethod, OrderByEnum, parameterizedString, printLog, RedactionType, SKYFLOW_ID, VAULT, VAULT_ID, TokenMode } from "..";
import { V1Byot } from "../../ _generated_/rest/api";
import SkyflowError from "../../error";
import SKYFLOW_ERROR_CODE from "../../error/codes";
import ConnectionConfig from "../../vault/config/connection";
import Credentials, { ApiKeyCredentials, PathCredentials, StringCredentials, TokenCredentials } from "../../vault/config/credentials";
import VaultConfig from "../../vault/config/vault";
import DetokenizeOptions from "../../vault/model/options/detokenize";
import GetOptions from "../../vault/model/options/get";
import InsertOptions from "../../vault/model/options/insert";
import UpdateOptions from "../../vault/model/options/update";
import DeleteRequest from "../../vault/model/request/delete";
import DetokenizeRequest from "../../vault/model/request/detokenize";
import FileUploadRequest from "../../vault/model/request/file-upload";
import GetRequest from "../../vault/model/request/get";
import GetColumnRequest from "../../vault/model/request/get-column";
import InvokeConnectionRequest from "../../vault/model/request/inkove";
import InsertRequest from "../../vault/model/request/insert";
import QueryRequest from "../../vault/model/request/query";
import TokenizeRequest from "../../vault/model/request/tokenize";
import UpdateRequest from "../../vault/model/request/update";
import { SkyflowConfig, StringKeyValueMapType } from "../../vault/types";
import * as fs from 'fs';
import * as path from 'path';
import { isExpired } from "../jwt-utils";
import logs from "../logs";
import FileUploadOptions from "../../vault/model/options/fileUpload";
import DeidentifyTextRequest from "../../vault/model/request/deidentify-text";
import DeidentifyTextOptions from "../../vault/model/options/deidentify-text";
import TokenFormat from "../../vault/model/options/deidentify-text/token-format";
import Transformations from "../../vault/model/options/deidentify-text/transformations";
import ReidentifyTextRequest from "../../vault/model/request/reidentify-text";
import ReidentifyTextOptions from "../../vault/model/options/reidentify-text";
import DeidentifyFileOptions from "../../vault/model/options/deidentify-file";
import DeidentifyFileRequest from "../../vault/model/request/deidentify-file";
import { Bleep } from "../../vault/model/options/deidentify-file/bleep-audio";
import GetDetectRunRequest from "../../vault/model/request/get-detect-run";

export function isEnv(value?: string): boolean {
    return value !== undefined && Object.values(Env).includes(value as Env);
}

export function isRedactionType(value?: string): boolean {
    return value !== undefined && Object.values(RedactionType).includes(value as RedactionType);
}

export function isByot(value?: string): boolean {
    return value !== undefined && Object.values(V1Byot).includes(value as V1Byot);
}

export function isOrderBy(value?: string): boolean {
    return value !== undefined && Object.values(OrderByEnum).includes(value as OrderByEnum);
}

export function isMethod(value?: string): boolean {
    return value !== undefined && Object.values(RequestMethod).includes(value as RequestMethod);
}

export function isLogLevel(value?: string): boolean {
    return value !== undefined && Object.values(LogLevel).includes(value as LogLevel);
}

export function isValidAPIKey(apiKey: string) {
    if (!apiKey || apiKey === null || apiKey === undefined) {
        return false;
    }
    if (apiKey && typeof apiKey === 'string' && apiKey.startsWith("sky-")) {
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
            credentialsObj = JSON.parse(credentialsString);
            if (credentialsObj?.clientID === null || credentialsObj?.keyID === null || credentialsObj?.clientID === null) {
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
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TYPE_FOR_CONFIG, [VAULT])
        }

        if (config?.connectionConfigs && !Array.isArray(config?.connectionConfigs)) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TYPE_FOR_CONFIG, [CONNECTION])
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
        if (pathCred.context !== undefined && typeof pathCred.context !== 'string') {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_CONTEXT, [type, typeId, id]);
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
        if (stringCred.context !== undefined && typeof stringCred.context !== 'string') {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_CONTEXT, [type, typeId, id]);
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
            validateCredentialsWithId(vaultConfig.credentials, VAULT, VAULT_ID, vaultConfig.vaultId, logLevel);
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
            validateCredentialsWithId(vaultConfig.credentials, VAULT, VAULT_ID, vaultConfig.vaultId, logLevel);
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
        if (pathCred.context !== undefined && typeof pathCred.context !== 'string') {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_CONTEXT);
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
        if (stringCred.context !== undefined && typeof stringCred.context !== 'string') {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_CONTEXT);
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
            validateCredentialsWithId(connectionConfig.credentials, CONNECTION, CONNECTION_ID, connectionConfig.connectionId, logLevel);
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
            validateCredentialsWithId(connectionConfig.credentials, CONNECTION, CONNECTION_ID, connectionConfig.connectionId, logLevel);
        }
    } else {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_CONNECTION_CONFIG)
    }
};

function validateInsertInput(input: unknown, index: number): void {
    try {
        const inputObject = input as { [key: string]: unknown };

        // Check if the object is empty
        const entries = Object.entries(inputObject);

        if (entries.length === 0) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_RECORD_IN_INSERT, [index]);
        }

        for (const [key] of entries) {
            if (key && typeof key !== 'string') {
                throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_RECORD_IN_INSERT, [index]);
            }
        }

    } catch (error) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_RECORD_IN_INSERT, [index]);
    }

}

function validateUpdateInput(input: unknown): void {
    try {
        const inputObject = input as { [key: string]: unknown };

        // Check if the object is empty
        const entries = Object.entries(inputObject);

        if (entries.length === 0) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_RECORD_IN_UPDATE);
        }

        for (const [key] of entries) {
            if (key && typeof key !== 'string') {
                throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_RECORD_IN_UPDATE);
            }
        }

    } catch (error) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_RECORD_IN_UPDATE);
    }

}

function validateUpdateToken(input: unknown): void {
    try {
        const inputObject = input as { [key: string]: unknown };

        // Check if the object is empty
        const entries = Object.entries(inputObject);

        if (entries.length === 0) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TOKEN_IN_UPDATE);
        }

        for (const [key] of entries) {
            if (key && typeof key !== 'string') {
                throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TOKEN_IN_UPDATE);
            }
        }

    } catch (error) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TOKEN_IN_UPDATE);
    }

}

export const validateInsertOptions = (insertOptions?: InsertOptions) => {
    if (insertOptions) {
        if (insertOptions?.getReturnTokens && insertOptions?.getReturnTokens() && typeof insertOptions?.getReturnTokens() !== 'boolean') {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_RETURN_TOKEN, [typeof insertOptions?.getReturnTokens()]);
        }

        if (insertOptions?.getUpsertColumn && insertOptions?.getUpsertColumn() && typeof insertOptions.getUpsertColumn() !== 'string') {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_UPSERT, [typeof insertOptions?.getUpsertColumn()]);
        }

        if (insertOptions?.getContinueOnError && insertOptions?.getContinueOnError() && typeof insertOptions.getContinueOnError() !== 'boolean') {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_CONTINUE_ON_ERROR, [typeof insertOptions?.getContinueOnError()]);
        }

        if (insertOptions?.getHomogeneous && insertOptions?.getHomogeneous() && typeof insertOptions.getHomogeneous() !== 'boolean') {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_HOMOGENEOUS, [typeof insertOptions?.getHomogeneous()]);
        }

        if (insertOptions?.getTokenMode && insertOptions?.getTokenMode() && !isByot(insertOptions?.getTokenMode())) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TOKEN_MODE, [typeof insertOptions?.getTokenMode()]);
        }

        if (insertOptions?.getTokens && insertOptions?.getTokens() && !Array.isArray(insertOptions?.getTokens())) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_INSERT_TOKENS);
        }

        if (insertOptions?.getTokens && insertOptions?.getTokens() && Array.isArray(insertOptions?.getTokens())) {
            insertOptions.getTokens()!.forEach((token, index) => {
                if (!token) {
                    throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_INSERT_TOKEN, [index]);
                }
                if (typeof token !== 'object') {
                    throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_INSERT_TOKEN, [index]);
                }
            });
        }
    }
};

const validateTokensMapWithTokenStrict = (
    data: Record<string, unknown>,
    tokens: Record<string, unknown>
) => {
    const dataKeys = Object.keys(data);

    for (const key of dataKeys) {
        if (!tokens.hasOwnProperty(key)) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INSUFFICIENT_TOKENS_PASSED_FOR_TOKEN_MODE_ENABLE_STRICT);
        }
    }
};

export const validateTokensForInsertRequest = (
    insertRequest?: InsertRequest,
    insertOptions?: InsertOptions
) => {
    if (insertRequest && insertOptions && insertOptions.getTokenMode()) {
        if (
            (insertOptions.getTokenMode() == TokenMode.ENABLE ||
                insertOptions.getTokenMode() == TokenMode.ENABLE_STRICT) && !insertOptions.getTokens()
        ) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.NO_TOKENS_WITH_TOKEN_MODE);
        }

        if ((insertOptions.getTokenMode() == TokenMode.ENABLE_STRICT) && insertOptions.getTokens()) {
            if (insertRequest.data.length != insertOptions.getTokens()?.length) {
                throw new SkyflowError(SKYFLOW_ERROR_CODE.INSUFFICIENT_TOKENS_PASSED_FOR_TOKEN_MODE_ENABLE_STRICT);
            }

            if (insertOptions.getTokens()) {
                for (let i = 0; i < insertRequest.data.length; i++) {
                    validateTokensMapWithTokenStrict(insertRequest.data[i], insertOptions.getTokens()![i])
                }
            }
        }
    }
};

export const validateInsertRequest = (insertRequest: InsertRequest, insertOptions?: InsertOptions, logLevel: LogLevel = LogLevel.ERROR) => { //
    if (insertRequest) {
        if (!insertRequest?.table || !Object.prototype.hasOwnProperty.call(insertRequest, '_table')) {
            printLog(logs.errorLogs.EMPTY_TABLE_IN_INSERT, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_TABLE_NAME);
        }

        if (typeof insertRequest.table !== 'string' || insertRequest.table.trim().length === 0) {
            printLog(logs.errorLogs.INVALID_TABLE_IN_INSERT, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TABLE_NAME);
        }

        if (!insertRequest.data) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_DATA_IN_INSERT)
        }

        if (!Array.isArray(insertRequest.data)) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TYPE_OF_DATA_IN_INSERT)
        }

        const records = insertRequest.data;
        if (records.length === 0) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_DATA_IN_INSERT);
        }

        records.forEach((record, index) => {
            if (!record) {
                throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_RECORD_IN_INSERT, [index]);
            }
            if (typeof record !== 'object') {
                throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_RECORD_IN_INSERT, [index]);
            }
            validateInsertInput(record, index);
        });
        validateInsertOptions(insertOptions);
        validateTokensForInsertRequest(insertRequest, insertOptions)
    } else {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_INSERT_REQUEST);
    }
};

export const validateUpdateOptions = (updateOptions?: UpdateOptions) => {
    if (updateOptions) {
        if (updateOptions?.getReturnTokens && updateOptions?.getReturnTokens() && typeof updateOptions?.getReturnTokens() !== 'boolean') {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_RETURN_TOKEN, [typeof updateOptions?.getReturnTokens()]);
        }

        if (updateOptions?.getTokenMode && updateOptions?.getTokenMode() && !isByot(updateOptions?.getTokenMode())) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TOKEN_MODE, [typeof updateOptions?.getTokenMode()]);
        }

        if (updateOptions?.getTokens && updateOptions?.getTokens() && typeof updateOptions?.getTokens() !== 'object') {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_UPDATE_TOKENS);
        }

        if (updateOptions?.getTokens && updateOptions?.getTokens()) {
            validateUpdateToken(updateOptions?.getTokens());
        }
    }
};

export const validateUpdateRequest = (updateRequest: UpdateRequest, updateOptions?: UpdateOptions, logLevel: LogLevel = LogLevel.ERROR) => {
    if (updateRequest) {
        if (!updateRequest?.table || !Object.prototype.hasOwnProperty.call(updateRequest, '_table')) {
            printLog(logs.errorLogs.EMPTY_TABLE_IN_UPDATE, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_TABLE_NAME);
        }

        if (typeof updateRequest.table !== 'string' || updateRequest.table.trim().length === 0) {
            printLog(logs.errorLogs.INVALID_TABLE_IN_UPDATE, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TABLE_NAME);
        }

        if (!updateRequest.data) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_UPDATE_DATA);
        }
        if (typeof updateRequest.data !== 'object') {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TYPE_OF_UPDATE_DATA);
        }

        if (updateRequest?.data && !Object.prototype.hasOwnProperty.call(updateRequest.data, SKYFLOW_ID)) {
            printLog(logs.errorLogs.EMPTY_SKYFLOW_ID_IN_UPDATE, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_SKYFLOW_ID_IN_UPDATE);
        }

        if (updateRequest?.data[SKYFLOW_ID]  && typeof updateRequest.data[SKYFLOW_ID] !== 'string' || (updateRequest.data[SKYFLOW_ID] as string).trim().length === 0) {
            printLog(logs.errorLogs.INVALID_SKYFLOW_ID_IN_UPDATE, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_SKYFLOW_ID_IN_UPDATE);
        }

        validateUpdateInput(updateRequest.data);
        validateUpdateOptions(updateOptions);
    } else {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_UPDATE_REQUEST);
    }
};

export const validateGetOptions = (getOptions?: GetOptions) => {
    if (getOptions) {
        if (getOptions?.getReturnTokens && getOptions?.getReturnTokens() && typeof getOptions?.getReturnTokens() !== 'boolean') {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_RETURN_TOKEN, [typeof getOptions?.getReturnTokens()]);
        }

        if (getOptions?.getRedactionType && getOptions?.getRedactionType() && !isRedactionType(getOptions?.getRedactionType())) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_REDACTION_TYPE);
        }

        if (getOptions?.getOffset && getOptions?.getOffset() && typeof getOptions.getOffset() !== 'string') {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_OFFSET, [typeof getOptions?.getOffset()]);
        }

        if (getOptions?.getLimit && getOptions?.getLimit() && typeof getOptions.getLimit() !== 'string') {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_LIMIT, [typeof getOptions?.getLimit()]);
        }

        if (getOptions?.getDownloadURL && getOptions?.getDownloadURL() && typeof getOptions.getDownloadURL() !== 'boolean') {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_DOWNLOAD_URL, [typeof getOptions?.getDownloadURL()]);
        }

        if (getOptions?.getColumnName && getOptions?.getColumnName() && typeof getOptions.getColumnName() !== 'string') {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_COLUMN_NAME);
        }

        if (getOptions?.getOrderBy && getOptions?.getOrderBy() && !isOrderBy(getOptions.getOrderBy())) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_ORDER_BY, [typeof getOptions?.getOrderBy()]);
        }

        if (getOptions?.getFields && getOptions?.getFields() && !Array.isArray(getOptions?.getFields())) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_FIELDS, [typeof getOptions?.getFields()]);
        }

        if (getOptions?.getFields && getOptions?.getFields() && Array.isArray(getOptions?.getFields())) {
            getOptions?.getFields()!.forEach((field, index) => {
                if (!field) {
                    throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_FIELD, [index]);
                }
                if (typeof field !== 'string' || field.trim().length === 0) {
                    throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_FIELD, [index]);
                }
            });
        }

        if (getOptions?.getColumnValues && getOptions?.getColumnValues() && !Array.isArray(getOptions?.getColumnValues())) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_COLUMN_VALUES);
        }

        if (getOptions?.getColumnValues && getOptions?.getColumnValues() && Array.isArray(getOptions?.getColumnValues())) {
            getOptions?.getColumnValues()!.forEach((column, index) => {
                if (!column) {
                    throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_COLUMN_VALUE, [index]);
                }
                if (typeof column !== 'string' || column.trim().length === 0) {
                    throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_COLUMN_VALUE, [index]);
                }
            });
        }
    }
};

export const validateGetRequest = (getRequest: GetRequest, getOptions?: GetOptions, logLevel: LogLevel = LogLevel.ERROR) => {
    if (getRequest) {
        if (!getRequest?.table || !Object.prototype.hasOwnProperty.call(getRequest, '_table')) {
            printLog(logs.errorLogs.EMPTY_TABLE_IN_GET, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_TABLE_NAME);
        }

        if (typeof getRequest.table !== 'string' || getRequest.table.trim().length === 0) {
            printLog(logs.errorLogs.INVALID_TABLE_IN_GET, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TABLE_NAME);
        }

        if (!getRequest?.ids) {
            printLog(logs.errorLogs.EMPTY_IDS_IN_GET, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_IDS_IN_GET)
        }

        if (!Array.isArray(getRequest?.ids)) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TYPE_OF_IDS)
        }

        const ids = getRequest.ids;
        if (ids.length === 0) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_IDS_IN_GET);
        }
        ids.forEach((id, index) => {
            if (!id) {
                printLog(parameterizedString(logs.errorLogs.INVALID_ID_IN_GET, [index]), MessageType.ERROR, logLevel);
                throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_ID_IN_GET, [index]);
            }
            if (typeof id !== 'string') {
                throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_ID_IN_GET, [index]);
            }
        });
        validateGetOptions(getOptions);
    } else {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_GET_REQUEST);
    }
};

export const validateGetColumnRequest = (getRequest: GetColumnRequest, getOptions?: GetOptions, logLevel: LogLevel = LogLevel.ERROR) => {
    if (getRequest) {
        if (!getRequest?.table || !Object.prototype.hasOwnProperty.call(getRequest, '_table')) {
            printLog(logs.errorLogs.EMPTY_TABLE_IN_GET_COLUMN, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_TABLE_NAME);
        }

        if (typeof getRequest.table !== 'string' || getRequest.table.trim().length === 0) {
            printLog(logs.errorLogs.INVALID_TABLE_IN_GET_COLUMN, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TABLE_NAME);
        }

        if (!getRequest?.columnName || !Object.prototype.hasOwnProperty.call(getRequest, '_columnName')) {
            printLog(logs.errorLogs.EMPTY_COLUMN_NAME_IN_GET_COLUMN, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_COLUMN_NAME);
        }

        if (typeof getRequest.columnName !== 'string' || getRequest.columnName.trim().length === 0) {
            printLog(logs.errorLogs.INVALID_COLUMN_NAME_IN_GET_COLUMN, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_COLUMN_NAME);
        }

        if (!getRequest?.columnValues) {
            printLog(logs.errorLogs.EMPTY_COLUMN_VALUES_IN_GET_COLUMN, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_COLUMN_VALUES)
        }

        if (!Array.isArray(getRequest.columnValues)) {
            printLog(logs.errorLogs.INVALID_COLUMN_VALUES_IN_GET_COLUMN, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_COLUMN_VALUES)
        }

        const columnValues = getRequest.columnValues;
        if (columnValues.length === 0) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_COLUMN_VALUES);
        }
        columnValues.forEach((columnValue, index) => {
            if (!columnValue) {
                printLog(parameterizedString(logs.errorLogs.INVALID_COLUMN_VALUE_IN_GET_COLUMN, [index]), MessageType.ERROR, logLevel);
                throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_COLUMN_VALUE, [index]);
            }
            if (typeof columnValue !== 'string') {
                throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_COLUMN_VALUE, [index]);
            }
        });
        validateGetOptions(getOptions);
    } else {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_GET_COLUMN_REQUEST);
    }
};

export const validateDetokenizeOptions = (detokenizeOptions?: DetokenizeOptions) => {
    if (detokenizeOptions) {

        if (detokenizeOptions?.getContinueOnError && detokenizeOptions?.getContinueOnError() && typeof detokenizeOptions.getContinueOnError() !== 'boolean') {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_CONTINUE_ON_ERROR, [typeof detokenizeOptions?.getContinueOnError()]);
        }

        if (detokenizeOptions?.getDownloadURL && detokenizeOptions?.getDownloadURL() && typeof detokenizeOptions.getDownloadURL() !== 'boolean') {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_DOWNLOAD_URL, [typeof detokenizeOptions?.getDownloadURL()]);
        }

    }
};

export const validateDetokenizeRequest = (detokenizeRequest: DetokenizeRequest, detokenizeOptions?: DetokenizeOptions, logLevel: LogLevel = LogLevel.ERROR) => {
    if (detokenizeRequest) {
        if (!detokenizeRequest?.data) {
            printLog(logs.errorLogs.EMPTY_TOKENS_IN_DETOKENIZE, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_TOKENS_IN_DETOKENIZE)
        }

        if (!Array.isArray(detokenizeRequest.data)) {
            printLog(logs.errorLogs.INVALID_TOKENS_IN_DETOKENIZE, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TOKENS_TYPE_IN_DETOKENIZE)
        }

        const records = detokenizeRequest?.data;

        if (records.length === 0)
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_TOKENS_IN_DETOKENIZE);

        records.forEach((record, index) => {
            if (!record) {
                printLog(parameterizedString(logs.errorLogs.INVALID_TOKEN_IN_DETOKENIZE, [index]), MessageType.ERROR, logLevel);
                throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_TOKEN_IN_DETOKENIZE, [index]);
            }
            if (typeof record.token !== 'string' || record.token.trim().length === 0) {
                throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TOKEN_IN_DETOKENIZE, [index]);
            }
            if (record?.redactionType && (typeof record.redactionType !== 'string' || !isRedactionType(record.redactionType))) {
                throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_REDACTION_TYPE);
            }
        });

        validateDetokenizeOptions(detokenizeOptions);

    } else {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_DETOKENIZE_REQUEST);
    }
};

export const validateTokenizeRequest = (tokenizeRequest: TokenizeRequest, logLevel: LogLevel = LogLevel.ERROR) => {
    if (tokenizeRequest) {
        if (!tokenizeRequest?.values || !Object.prototype.hasOwnProperty.call(tokenizeRequest, '_values')) {
            printLog(logs.errorLogs.EMPTY_VALUES_IN_TOKENIZE, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_VALUES_IN_TOKENIZE);
        }

        if (!Array.isArray(tokenizeRequest?.values)) {
            printLog(logs.errorLogs.VALUES_IS_REQUIRED_TOKENIZE, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_VALUES_TYPE_IN_TOKENIZE)
        }

        const values = tokenizeRequest?.values;

        if (values.length === 0)
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_VALUES_IN_TOKENIZE);

        values.forEach((data, index) => {
            if (!data) {
                throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_DATA_IN_TOKENIZE, [index]);
            }
            if (typeof data !== 'object') {
                throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_DATA_IN_TOKENIZE, [index]);
            }
            if (!data.value) {
                throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_VALUE_IN_TOKENIZE, [index]);
            }
            if (typeof data.value !== 'string' || data.value.trim().length === 0) {
                throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_VALUE_IN_TOKENIZE, [index]);
            }
            if (!data.columnGroup) {
                printLog(parameterizedString(logs.errorLogs.EMPTY_COLUMN_GROUP_IN_COLUMN_VALUES, [index]), MessageType.ERROR, logLevel);
                throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_COLUMN_GROUP_IN_TOKENIZE, [index]);
            }
            if (typeof data.columnGroup !== 'string' || data.columnGroup.trim().length === 0) {
                throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_COLUMN_GROUP_IN_TOKENIZE, [index]);
            }
        });
    } else {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TOKENIZE_REQUEST);
    }
};

export const validateDeleteRequest = (deleteRequest: DeleteRequest, logLevel: LogLevel = LogLevel.ERROR) => {
    if (deleteRequest) {
        if (!deleteRequest?.table || !Object.prototype.hasOwnProperty.call(deleteRequest, '_table')) {
            printLog(logs.errorLogs.EMPTY_TABLE_IN_DELETE, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_TABLE_NAME);
        }

        if (typeof deleteRequest?.table !== 'string' || deleteRequest?.table.trim().length === 0) {
            printLog(logs.errorLogs.INVALID_TABLE_IN_DELETE, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TABLE_NAME);
        }

        if (!deleteRequest?.ids) {
            printLog(logs.errorLogs.EMPTY_IDS_IN_DELETE, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_DELETE_IDS)
        }

        if (!Array.isArray(deleteRequest?.ids)) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_DELETE_IDS_INPUT)
        }

        const deleteIds = deleteRequest?.ids;
        if (deleteIds.length === 0) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_DELETE_IDS);
        }

        deleteIds.forEach((deleteId, index) => {
            if (!deleteId) {
                printLog(parameterizedString(logs.errorLogs.INVALID_ID_IN_DELETE, [index]), MessageType.ERROR, logLevel);
                throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_ID_IN_DELETE, [index]);
            }
            if (typeof deleteId !== 'string' || deleteId.trim().length === 0) {
                throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_ID_IN_DELETE, [index]);
            }
        });
    } else {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_DELETE_REQUEST);
    }
}

export const validateUploadFileRequest = (fileRequest: FileUploadRequest, options?: FileUploadOptions,  logLevel: LogLevel = LogLevel.ERROR) => {
    if (!fileRequest) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_FILE_UPLOAD_REQUEST);
    }

    if (!fileRequest?.table || !Object.prototype.hasOwnProperty.call(fileRequest, '_table')) {
        printLog(logs.errorLogs.EMPTY_TABLE_IN_FILE_UPLOAD, MessageType.ERROR, logLevel);
        throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_TABLE_IN_UPLOAD_FILE);
    }

    if (typeof fileRequest?.table !== 'string' || fileRequest?.table.trim().length === 0) {
        printLog(logs.errorLogs.INVALID_TABLE_IN_FILE_UPLOAD, MessageType.ERROR, logLevel);
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TABLE_IN_UPLOAD_FILE);
    }

    if (!fileRequest?.skyflowId || !Object.prototype.hasOwnProperty.call(fileRequest, '_skyflowId')) {
        printLog(logs.errorLogs.EMPTY_SKYFLOW_ID_IN_FILE_UPLOAD, MessageType.ERROR, logLevel);
        throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_SKYFLOW_ID_IN_UPLOAD_FILE);
    }

    if (typeof fileRequest?.skyflowId !== 'string' || fileRequest.skyflowId.trim().length === 0) {
        printLog(logs.errorLogs.INVALID_SKYFLOW_ID_IN_FILE_UPLOAD, MessageType.ERROR, logLevel);
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_SKYFLOW_ID_IN_UPLOAD_FILE);
    }

    if (!fileRequest?.columnName || !Object.prototype.hasOwnProperty.call(fileRequest, '_columnName')) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_COLUMN_NAME_IN_UPLOAD_FILE);
    }

    if (typeof fileRequest?.columnName !== 'string' || fileRequest?.columnName.trim().length === 0) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_COLUMN_NAME_IN_UPLOAD_FILE);
    }

    if(options){
        const hasFilePath = !!options.getFilePath();
        if(hasFilePath && typeof options.getFilePath() !== 'string') {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_FILE_PATH_IN_UPLOAD_FILE);
        }
        const hasBase64 = !!options.getBase64();
        if(hasBase64 && typeof options.getBase64() !== 'string') {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_BASE64_IN_UPLOAD_FILE);
        }
        const hasFileObject = !!options.getFileObject();
        if(hasFileObject && typeof options.getFileObject() !== 'object') {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_FILE_OBJECT_IN_UPLOAD_FILE);
        }

        if (!hasFilePath && !hasBase64 && !hasFileObject) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_FILE_SOURCE_IN_UPLOAD_FILE);
        }

        if (hasBase64 && !options.getFileName()) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_FILE_NAME_FOR_BASE64);
        }

        if (hasFileObject) {
            const fileObject = options.getFileObject();
            if (!(fileObject instanceof File)) {
                throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_FILE_OBJECT_IN_UPLOAD_FILE);
            }
            if (!fileObject.name || typeof fileObject.name !== 'string' || fileObject.name.trim().length === 0) {
                throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_FILE_NAME_IN_FILE_OBJECT);
            }
        }
    }
}

export const validateQueryRequest = (queryRequest: QueryRequest, logLevel: LogLevel = LogLevel.ERROR) => {
    if (queryRequest) {
        if (!queryRequest?.query || !Object.prototype.hasOwnProperty.call(queryRequest, '_query')) {
            printLog(logs.errorLogs.EMPTY_QUERY, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_QUERY);
        }

        if (typeof queryRequest?.query !== 'string' || queryRequest?.query.trim().length === 0) {
            printLog(logs.errorLogs.QUERY_IS_REQUIRED, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_QUERY);
        }

    } else {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_QUERY_REQUEST);
    }
}

export const validateDeIdentifyTextRequest = (deIdentifyTextRequest: DeidentifyTextRequest, options?: DeidentifyTextOptions, logLevel: LogLevel = LogLevel.ERROR) => {
    if (!deIdentifyTextRequest.text || typeof deIdentifyTextRequest.text !== 'string' || deIdentifyTextRequest.text.trim().length === 0) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TEXT_IN_DEIDENTIFY);
    }

    if (options) {
        if (options.getEntities() && !Array.isArray(options.getEntities())) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_ENTITIES_IN_DEIDENTIFY);
        }

        if (options.getAllowRegexList() && !Array.isArray(options.getAllowRegexList())) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_ALLOW_REGEX_LIST);
        }

        if (options.getRestrictRegexList() && !Array.isArray(options.getRestrictRegexList())) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_RESTRICT_REGEX_LIST);
        }

        if (options.getTokenFormat() && !(options.getTokenFormat() instanceof TokenFormat)) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TOKEN_FORMAT);
        }

        if (options.getTransformations() && !(options.getTransformations() instanceof Transformations)) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TRANSFORMATIONS);
        }
    }
};

export const validateReidentifyTextRequest = (request: ReidentifyTextRequest, options?: ReidentifyTextOptions, logLevel: LogLevel = LogLevel.ERROR) => {
    if (!request.text || typeof request.text !== 'string' || request.text.trim().length === 0) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TEXT_IN_REIDENTIFY);
    }

    if (options) {
        if (options.getRedactedEntities() && !Array.isArray(options.getRedactedEntities())) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_REDACTED_ENTITIES_IN_REIDENTIFY);
        }

        if (options.getMaskedEntities() && !Array.isArray(options.getMaskedEntities())) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_MASKED_ENTITIES_IN_REIDENTIFY);
        }
        if (options.getPlainTextEntities() && !Array.isArray(options.getPlainTextEntities())) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_PLAIN_TEXT_ENTITIES_IN_REIDENTIFY);
        }
    }
};

export const validateDeidentifyFileRequest = (deidentifyFileRequest: DeidentifyFileRequest, deidentifyFileOptions?: DeidentifyFileOptions, logLevel: LogLevel = LogLevel.ERROR) => {
    if (!deidentifyFileRequest) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_DEIDENTIFY_FILE_REQUEST);
    }

    const fileType = deidentifyFileRequest.getFile();

    const hasFile = 'file' in fileType && fileType.file;
    const hasFilePath = 'filePath' in fileType && fileType.filePath;

    // Must provide exactly one of file or filePath
    if ((hasFile && hasFilePath) || (!hasFile && !hasFilePath)) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_DEIDENTIFY_FILE_INPUT);
    }

    if (hasFile) {
        const file = fileType.file;
        if (!(file instanceof File)) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_FILE_TYPE);
        }
        if (!file.name || typeof file.name !== 'string' || file.name.trim().length === 0) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_FILE_TYPE);
        }
        const fileBaseName = path.parse(file.name).name;
        if (!fileBaseName || typeof fileBaseName !== 'string' || fileBaseName.trim().length === 0) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_FILE_TYPE);
        }
    } else if (hasFilePath) {
        const filePath = fileType.filePath;
        if (typeof filePath !== 'string' || filePath.trim().length === 0) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_DEIDENTIFY_FILE_PATH);
        }
        if (!fs.existsSync(filePath) || !fs.lstatSync(filePath).isFile()) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_DEIDENTIFY_FILE_PATH);
        }
    }

    // Validate options if provided
    if (deidentifyFileOptions) {
        validateDeidentifyFileOptions(deidentifyFileOptions);
    }
};

export const validateGetDetectRunRequest = (getDetectRunRequest: GetDetectRunRequest, logLevel: LogLevel = LogLevel.ERROR) => {
    if (getDetectRunRequest) {
        if (!getDetectRunRequest?.runId) {
            printLog(logs.errorLogs.EMPTY_RUN_ID, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_RUN_ID);
        }
        if (typeof getDetectRunRequest.runId !== 'string' || getDetectRunRequest.runId.trim().length === 0) {
            printLog(logs.errorLogs.INVALID_RUN_ID, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_RUN_ID);
        }
    }
}       

export const validateDeidentifyFileOptions = (deidentifyFileOptions: DeidentifyFileOptions) => {
    if (!deidentifyFileOptions) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_DEIDENTIFY_FILE_OPTIONS);
    }

    //Validate waitTime
    const waitTime = deidentifyFileOptions.getWaitTime();
    if (waitTime !== undefined) {
        if (typeof waitTime !== 'number' || waitTime > 64) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_WAIT_TIME);
        }
    }

    // Validate outputDirectory
    const outputDirectory = deidentifyFileOptions.getOutputDirectory();
    if (outputDirectory !== undefined) {
        if (typeof outputDirectory !== 'string') {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_OUTPUT_DIRECTORY);
        }
        if (!fs.existsSync(outputDirectory) || !fs.lstatSync(outputDirectory).isDirectory()) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_OUTPUT_DIRECTORY_PATH);
        }
    }

    // Validate entities
    if (deidentifyFileOptions.getEntities() !== undefined && (!Array.isArray(deidentifyFileOptions.getEntities()))) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_ENTITIES);
    }

    // Validate allowRegexList
    if (deidentifyFileOptions.getAllowRegexList() && !Array.isArray(deidentifyFileOptions.getAllowRegexList())) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_ALLOW_REGEX_LIST);
    }

    // Validate restrictRegexList
    if (deidentifyFileOptions.getRestrictRegexList() && !Array.isArray(deidentifyFileOptions.getRestrictRegexList())) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_RESTRICT_REGEX_LIST);
    }

    // Validate tokenFormat
    if (deidentifyFileOptions.getTokenFormat() && !(deidentifyFileOptions.getTokenFormat() instanceof TokenFormat)) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TOKEN_FORMAT);
    }

    const tokenFormat = deidentifyFileOptions.getTokenFormat();
    if(tokenFormat != null && tokenFormat.getVaultToken() != null && tokenFormat.getVaultToken()!.length > 0) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.TOKEN_FORMAT_NOT_ALLOWED);
    }

    // Validate transformations
    if (deidentifyFileOptions.getTransformations() && !(deidentifyFileOptions.getTransformations() instanceof Transformations)) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TRANSFORMATIONS);
    }

    // Validate image-specific options
    if (deidentifyFileOptions.getOutputProcessedImage() !== undefined && typeof deidentifyFileOptions.getOutputProcessedImage() !== 'boolean') {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_OUTPUT_PROCESSED_IMAGE);
    }

    if (deidentifyFileOptions.getOutputOcrText() !== undefined && typeof deidentifyFileOptions.getOutputOcrText() !== 'boolean') {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_OUTPUT_OCR_TEXT);
    }

    if (deidentifyFileOptions.getMaskingMethod() !== undefined && typeof deidentifyFileOptions.getMaskingMethod() !== 'string') {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_MASKING_METHOD);
    }

    // Validate PDF-specific options
    if (deidentifyFileOptions.getPixelDensity() !== undefined && typeof deidentifyFileOptions.getPixelDensity() !== 'number') {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_PIXEL_DENSITY);
    }

    if (deidentifyFileOptions.getMaxResolution() !== undefined && typeof deidentifyFileOptions.getMaxResolution() !== 'number') {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_MAX_RESOLUTION);
    }

    // Validate audio-specific options
    if (deidentifyFileOptions.getOutputProcessedAudio() !== undefined && typeof deidentifyFileOptions.getOutputProcessedAudio() !== 'boolean') {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_OUTPUT_PROCESSED_AUDIO);
    }

    if (deidentifyFileOptions.getOutputTranscription() !== undefined && typeof deidentifyFileOptions.getOutputTranscription() !== 'string') {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_OUTPUT_TRANSCRIPTION);
    }

    if (deidentifyFileOptions.getBleep() && !(deidentifyFileOptions.getBleep() instanceof Bleep)) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_BLEEP);
    }
};

function isStringKeyValueMap(obj: unknown): obj is StringKeyValueMapType {
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
        return false;
    }

    for (const key in obj) {
        if (typeof key !== 'string' || (typeof obj[key] !== 'object' && typeof obj[key] !== 'string')) {
            return false;
        }
    }

    return true;
}

export const validateInvokeConnectionRequest = (invokeRequest: InvokeConnectionRequest) => {
    if (invokeRequest) {

        if (!invokeRequest?.method || !Object.prototype.hasOwnProperty.call(invokeRequest, 'method'))
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_METHOD_NAME);

        if (!isMethod(invokeRequest.method)) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_METHOD_NAME);
        }

        if (invokeRequest?.queryParams && !isStringKeyValueMap(invokeRequest?.queryParams)) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_QUERY_PARAMS);
        }

        if (invokeRequest?.pathParams && !isStringKeyValueMap(invokeRequest?.pathParams)) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_PATH_PARAMS);
        }

        if (invokeRequest?.body && !isStringKeyValueMap(invokeRequest?.body)) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_BODY);
        }

        if (invokeRequest?.headers && !isStringKeyValueMap(invokeRequest?.headers)) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_HEADERS);
        }

    } else {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_INVOKE_CONNECTION_REQUEST);
    }
};