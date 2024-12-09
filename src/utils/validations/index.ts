import { CONNECTION, CONNECTION_ID, Env, isValidURL, LogLevel, MessageType, RequestMethod, OrderByEnum, parameterizedString, printLog, RedactionType, SKYFLOW_ID, VAULT, VAULT_ID } from "..";
import { V1BYOT } from "../../ _generated_/rest";
import SkyflowError from "../../error";
import SKYFLOW_ERROR_CODE from "../../error/codes";
import ConnectionConfig from "../../vault/config/connection";
import Credentials from "../../vault/config/credentials";
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
import { isExpired } from "../jwt-utils";
import logs from "../logs";

export function isEnv(value?: string): boolean {
    return value !== undefined && Object.values(Env).includes(value as Env);
}

export function isRedactionType(value?: string): boolean {
    return value !== undefined && Object.values(RedactionType).includes(value as RedactionType);
}

export function isByot(value?: string): boolean {
    return value !== undefined && Object.values(V1BYOT).includes(value as V1BYOT);
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
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_SKYFLOW_CONFIG);
        }

        if (config?.vaultConfigs && !Array.isArray(config.vaultConfigs)) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TYPE_FOR_CONFIG, [VAULT])
        }

        if (config?.vaultConfigs.length === 0) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_VAULT_CONFIG);
        }

        if (config?.connectionConfigs && !Array.isArray(config?.connectionConfigs)) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TYPE_FOR_CONFIG, [CONNECTION])
        }

    } else {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.CONFIG_MISSING);
    }
};


export const validateCredentialsWithId = (credentials: Credentials, type: string, typeId: string, id: string, logLevel: LogLevel = LogLevel.ERROR) => {
    // validates types for ctx roles
    const { token, path, credentialsString, apiKey } = credentials;

    // Count how many of the fields are defined
    const definedFields = [token, path, credentialsString, apiKey].filter(Boolean).length;

    // If none are present
    if (definedFields === 0) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_CREDENTIALS_WITH_ID, [type, typeId, id]);
    }

    // If more than one is present
    if (definedFields > 1) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.MULTIPLE_CREDENTIALS_PASSED_WITH_ID, [type, typeId, id]);
    }

    if (credentials?.token && (typeof credentials?.token !== 'string' || isExpired(credentials?.token))) {
        printLog(logs.errorLogs.EMPTY_TOKEN_VALUE, MessageType.ERROR, logLevel);
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_BEARER_TOKEN_WITH_ID, [type, typeId, id]);
    }

    if (credentials?.credentialsString && (typeof credentials?.credentialsString !== 'string' || !isValidCredentialsString(credentials?.credentialsString))) {
        printLog(logs.errorLogs.EMPTY_CREDENTIALS_STRING, MessageType.ERROR, logLevel);
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_PARSED_CREDENTIALS_STRING_WITH_ID, [type, typeId, id]);
    }

    if (credentials?.apiKey && (typeof credentials?.apiKey !== 'string' || !isValidAPIKey(credentials?.apiKey))) {
        printLog(logs.errorLogs.INVALID_API_KEY, MessageType.ERROR, logLevel);
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_API_KEY_WITH_ID, [type, typeId, id]);
    }

    if (credentials?.path && (typeof credentials?.path !== 'string' || !isValidPath(credentials?.path))) {
        printLog(logs.errorLogs.EMPTY_CREDENTIALS_PATH, MessageType.ERROR, logLevel);
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_FILE_PATH_WITH_ID, [type, typeId, id]);
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
    const { token, path, credentialsString, apiKey } = credentials;

    // Count how many of the fields are defined
    const definedFields = [token, path, credentialsString, apiKey].filter(Boolean).length;

    // If none are present
    if (definedFields === 0) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.CREDENTIALS_WITH_NO_VALID_KEY);
    }

    // If more than one is present
    if (definedFields > 1) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.MULTIPLE_CREDENTIALS_PASSED);
    }

    if (credentials?.token && (typeof credentials?.token !== 'string' || isExpired(credentials?.token))) {
        printLog(logs.errorLogs.EMPTY_TOKEN_VALUE, MessageType.ERROR, logLevel);
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_BEARER_TOKEN);
    }

    if (credentials?.credentialsString && (typeof credentials?.credentialsString !== 'string' || !isValidCredentialsString(credentials?.credentialsString))) {
        printLog(logs.errorLogs.EMPTY_CREDENTIALS_STRING, MessageType.ERROR, logLevel);
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_PARSED_CREDENTIALS_STRING);
    }

    if (credentials?.apiKey && (typeof credentials?.apiKey !== 'string' || !isValidAPIKey(credentials?.apiKey))) {
        printLog(logs.errorLogs.INVALID_API_KEY, MessageType.ERROR, logLevel);
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_API_KEY);
    }

    if (credentials?.path && (typeof credentials?.path !== 'string' || !isValidPath(credentials?.path))) {
        printLog(logs.errorLogs.EMPTY_CREDENTIALS_PATH, MessageType.ERROR, logLevel);
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_FILE_PATH);
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

        // Iterate over the key-value pairs and check their types
        for (const [key, value] of entries) {
            if (key && typeof key !== 'string') {
                throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_RECORD_IN_INSERT, [index]);
            }
            // update the data type accordingly
            if (value && typeof value !== 'string') {
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

        // Iterate over the key-value pairs and check their types
        for (const [key, value] of entries) {
            if (key && typeof key !== 'string') {
                throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_RECORD_IN_UPDATE);
            }
            // update the data type accordingly
            if (value && typeof value !== 'string') {
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

        // Iterate over the key-value pairs and check their types
        for (const [key, value] of entries) {
            if (key && typeof key !== 'string') {
                throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TOKEN_IN_UPDATE);
            }
            // update the data type accordingly
            if (value && typeof value !== 'string') {
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

export const validateInsertRequest = (insertRequest: InsertRequest, insertOptions?: InsertOptions, logLevel: LogLevel = LogLevel.ERROR) => {
    if (insertRequest) {
        if (!insertRequest?.tableName || !Object.prototype.hasOwnProperty.call(insertRequest, '_tableName')) {
            printLog(logs.errorLogs.EMPTY_TABLE_IN_INSERT, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_TABLE_NAME);
        }

        if (typeof insertRequest.tableName !== 'string' || insertRequest.tableName.trim().length === 0) {
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
        if (!updateRequest?.tableName || !Object.prototype.hasOwnProperty.call(updateRequest, '_tableName')) {
            printLog(logs.errorLogs.EMPTY_TABLE_IN_UPDATE, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_TABLE_NAME);
        }

        if (typeof updateRequest.tableName !== 'string' || updateRequest.tableName.trim().length === 0) {
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

        if (updateRequest?.data[SKYFLOW_ID]  && typeof updateRequest.data[SKYFLOW_ID] !== 'string' || updateRequest.data[SKYFLOW_ID].trim().length === 0) {
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
        if (!getRequest?.tableName || !Object.prototype.hasOwnProperty.call(getRequest, '_tableName')) {
            printLog(logs.errorLogs.EMPTY_TABLE_IN_GET, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_TABLE_NAME);
        }

        if (typeof getRequest.tableName !== 'string' || getRequest.tableName.trim().length === 0) {
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
        if (!getRequest?.tableName || !Object.prototype.hasOwnProperty.call(getRequest, '_tableName')) {
            printLog(logs.errorLogs.EMPTY_TABLE_IN_GET_COLUMN, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_TABLE_NAME);
        }

        if (typeof getRequest.tableName !== 'string' || getRequest.tableName.trim().length === 0) {
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
        if (!detokenizeRequest?.tokens) {
            printLog(logs.errorLogs.EMPTY_TOKENS_IN_DETOKENIZE, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_TOKENS_IN_DETOKENIZE)
        }

        if (!Array.isArray(detokenizeRequest.tokens)) {
            printLog(logs.errorLogs.INVALID_TOKENS_IN_DETOKENIZE, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TOKENS_TYPE_IN_DETOKENIZE)
        }

        const tokens = detokenizeRequest?.tokens;

        if (tokens.length === 0)
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_TOKENS_IN_DETOKENIZE);

        tokens.forEach((token, index) => {
            if (!token) {
                printLog(parameterizedString(logs.errorLogs.INVALID_TOKEN_IN_DETOKENIZE, [index]), MessageType.ERROR, logLevel);
                throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_TOKEN_IN_DETOKENIZE, [index]);
            }
            if (typeof token !== 'string' || token.trim().length === 0) {
                throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TOKEN_IN_DETOKENIZE, [index]);
            }
        });

        if (detokenizeRequest?.redactionType && (typeof detokenizeRequest.redactionType !== 'string' || !isRedactionType(detokenizeRequest.redactionType))) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_REDACTION_TYPE);
        }

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
        if (!deleteRequest?.tableName || !Object.prototype.hasOwnProperty.call(deleteRequest, '_tableName')) {
            printLog(logs.errorLogs.EMPTY_TABLE_IN_DELETE, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_TABLE_NAME);
        }

        if (typeof deleteRequest?.tableName !== 'string' || deleteRequest?.tableName.trim().length === 0) {
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

export const validateUploadFileRequest = (fileRequest: FileUploadRequest, logLevel: LogLevel = LogLevel.ERROR) => {
    if (fileRequest) {
        if (!fileRequest?.tableName || !Object.prototype.hasOwnProperty.call(fileRequest, '_tableName')) {
            printLog(logs.errorLogs.EMPTY_TABLE_IN_FILE_UPLOAD, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_TABLE_IN_UPLOAD_FILE);
        }

        if (typeof fileRequest?.tableName !== 'string' || fileRequest?.tableName.trim().length === 0) {
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


        if (!fileRequest?.filePath || !Object.prototype.hasOwnProperty.call(fileRequest, '_filePath')) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_FILE_PATH_IN_UPLOAD_FILE);
        }

        if (typeof fileRequest?.filePath !== 'string' || fileRequest?.filePath.trim().length === 0 || !isValidPath(fileRequest.filePath)) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_FILE_PATH_IN_UPLOAD_FILE);
        }
    } else {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_FILE_UPLOAD_REQUEST);
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

function isStringKeyValueMap(obj: any): obj is StringKeyValueMapType {
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