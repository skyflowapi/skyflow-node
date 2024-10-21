import { CONNECTION, CONNECTION_ID, Env, isValidURL, LogLevel, METHOD, OrderByEnum, VAULT, VAULT_ID } from "..";
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

export function isEnv(value?: string): boolean {
    return value !== undefined && Object.values(Env).includes(value as Env);
}

export function isByot(value?: string): boolean {
    return value !== undefined && Object.values(V1BYOT).includes(value as V1BYOT);
}

export function isOrderBy(value?: string): boolean {
    return value !== undefined && Object.values(OrderByEnum).includes(value as OrderByEnum);
}

export function isMethod(value?: string): boolean {
    return value !== undefined && Object.values(METHOD).includes(value as METHOD);
}

export function isLogLevel(value?: string): boolean {
    return value !== undefined && Object.values(LogLevel).includes(value as LogLevel);
}

export const validateSkyflowConfig = (config: SkyflowConfig) => {
    if (config) {
        if (!Object.prototype.hasOwnProperty.call(config, 'vaultConfigs')) {
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


export const validateCredentialsWithId = (credentials: Credentials, type: string, typeId: string, id: string) => {
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

};

export const validateVaultConfig = (vaultConfig: VaultConfig) => {
    if (!Object.prototype.hasOwnProperty.call(vaultConfig, 'vaultId')) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_VAULT_ID);
    }
    if (!vaultConfig.vaultId || typeof vaultConfig.vaultId !== 'string') {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_VAULT_ID);
    }
    if (!Object.prototype.hasOwnProperty.call(vaultConfig, 'clusterId')) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_CLUSTER_ID, [vaultConfig?.vaultId]);
    }
    if (!vaultConfig.clusterId || typeof vaultConfig.clusterId !== 'string') {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_CLUSTER_ID, [vaultConfig?.vaultId]);
    }
    if (vaultConfig.env && !isEnv(vaultConfig.env)) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_ENV, [vaultConfig?.vaultId]);
    }
    if (vaultConfig?.credentials) {
        validateCredentialsWithId(vaultConfig.credentials, VAULT, VAULT_ID, vaultConfig.vaultId);
    }
};

export const validateSkyflowCredentials = (credentials: Credentials) => {
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

};

export const validateConnectionConfig = (connectionConfig: ConnectionConfig) => {
    if (!Object.prototype.hasOwnProperty.call(connectionConfig, 'connectionId')) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_CONNECTION_ID);
    }

    if (typeof connectionConfig?.connectionId !== 'string' || connectionConfig?.connectionId.trim().length === 0) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_CONNECTION_ID);
    }

    if (!Object.prototype.hasOwnProperty.call(connectionConfig, 'connectionUrl')) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_CONNECTION_URL);
    }

    if (typeof connectionConfig?.connectionUrl !== 'string' || connectionConfig?.connectionUrl.trim().length === 0) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_CONNECTION_URL);
    }

    if (connectionConfig.connectionUrl && !isValidURL(connectionConfig.connectionUrl)) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_CONNECTION_URL);
    }

    if (connectionConfig?.credentials) {
        validateCredentialsWithId(connectionConfig.credentials, CONNECTION, CONNECTION_ID, connectionConfig.connectionId);
    }
};

function validateInsertInput(input: unknown): void {
    try {
        const inputObject = input as { [key: string]: unknown };

        // Check if the object is empty
        const entries = Object.entries(inputObject);

        if (entries.length === 0) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_RECORD_IN_INSERT);
        }

        // Iterate over the key-value pairs and check their types
        for (const [key, value] of entries) {
            if (key && typeof key !== 'string') {
                throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_RECORD_IN_INSERT);
            }
            // update the data type accordingly
            if (value && typeof value !== 'string') {
                throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_RECORD_IN_INSERT);
            }
        }

    } catch (error) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_RECORD_IN_INSERT);
    }

}

export const validateInsertOptions = (insertOptions?: InsertOptions) => {
    if (insertOptions) {
        if (insertOptions?.getReturnTokens() && typeof insertOptions?.getReturnTokens() !== 'boolean') {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_RETURN_TOKEN, [typeof insertOptions?.getReturnTokens()]);
        }

        if (insertOptions?.getUpsert() && typeof insertOptions.getUpsert() !== 'string') {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_UPSERT, [typeof insertOptions?.getUpsert()]);
        }

        if (insertOptions?.getContinueOnError() && typeof insertOptions.getContinueOnError() !== 'boolean') {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_CONTINUE_ON_ERROR, [typeof insertOptions?.getContinueOnError()]);
        }

        if (insertOptions?.getTokenStrict() && typeof insertOptions.getTokenStrict() !== 'boolean') {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TOKEN_STRICT, [typeof insertOptions?.getTokenStrict()]);
        }

        if (insertOptions?.getHomogeneous() && typeof insertOptions.getHomogeneous() !== 'boolean') {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_HOMOGENEOUS, [typeof insertOptions?.getHomogeneous()]);
        }

        if (insertOptions?.getTokenMode() && !isByot(insertOptions?.getTokenMode())) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TOKEN_MODE, [typeof insertOptions?.getTokenMode()]);
        }

        if (insertOptions?.getTokens() && !Array.isArray(insertOptions?.getTokens())) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_INSERT_TOKENS);
        }

        if (insertOptions?.getTokens() && Array.isArray(insertOptions?.getTokens())) {
            insertOptions.getTokens()!.forEach((token, index) => {
                if (!token) {
                    throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_INSERT_TOKEN, [index]);
                }
                if (typeof token !== 'string' || token.trim().length === 0) {
                    throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_INSERT_TOKEN, [index]);
                }
            });
        }
    }
};

export const validateInsertRequest = (insertRequest: InsertRequest, insertOptions?: InsertOptions) => {
    if (insertRequest) {
        if (!Object.prototype.hasOwnProperty.call(insertRequest, '_tableName')) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_TABLE_NAME);
        }

        if (typeof insertRequest.tableName !== 'string' || insertRequest.tableName.trim().length === 0) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TABLE_NAME);
        }

        if (!Array.isArray(insertRequest.data)) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TYPE_OF_DATA_IN_INSERT)
        }

        const records = insertRequest.data;
        if (records.length === 0) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_DATA_IN_INSERT);
        }

        records.forEach(record => {
            if (!record) {
                throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_RECORD_IN_INSERT);
            }
            if (typeof record !== 'object') {
                throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_RECORD_IN_INSERT);
            }
            validateInsertInput(record);
        });
        validateInsertOptions(insertOptions);
    } else {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_INSERT_REQUEST);
    }
};

export const validateUpdateOptions = (updateOptions?: UpdateOptions) => {
    if (updateOptions) {
        if (updateOptions?.getReturnTokens() && typeof updateOptions?.getReturnTokens() !== 'boolean') {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_RETURN_TOKEN, [typeof updateOptions?.getReturnTokens()]);
        }

        if (updateOptions?.getTokenMode() && !isByot(updateOptions?.getTokenMode())) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TOKEN_MODE, [typeof updateOptions?.getTokenMode()]);
        }

    }
};

export const validateUpdateRequest = (updateRequest: UpdateRequest, updateOptions?: UpdateOptions) => {
    if (updateRequest) {
        if (!Object.prototype.hasOwnProperty.call(updateRequest, '_tableName')) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_TABLE_NAME);
        }

        if (typeof updateRequest.tableName !== 'string' || updateRequest.tableName.trim().length === 0) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TABLE_NAME);
        }

        if (!Object.prototype.hasOwnProperty.call(updateRequest, '_skyflowId')) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_SKYFLOW_ID_IN_UPDATE);
        }

        if (typeof updateRequest.skyflowId !== 'string' || updateRequest.skyflowId.trim().length === 0) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_SKYFLOW_ID_IN_UPDATE);
        }

        if (!Array.isArray(updateRequest.updateData)) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TYPE_OF_UPDATE_DATA)
        }

        const records = updateRequest.updateData;
        if (records.length === 0) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_UPDATE_DATA);
        }
        records.forEach((record, index) => {
            if (!record) {
                throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_DATA_IN_UPDATE, [index]);
            }
            if (typeof record !== 'object') {
                throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_DATA_IN_UPDATE, [index]);
            }
            validateInsertInput(record);
        });
        validateUpdateOptions(updateOptions);
    } else {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_UPDATE_REQUEST);
    }
};

export const validateGetOptions = (getOptions?: GetOptions) => {
    if (getOptions) {
        if (getOptions?.getReturnTokens() && typeof getOptions?.getReturnTokens() !== 'boolean') {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_RETURN_TOKEN, [typeof getOptions?.getReturnTokens()]);
        }

        if (getOptions.getRedactionType() && typeof getOptions.getRedactionType() !== 'string') {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_REDACTION_TYPE);
        }

        if (getOptions?.getOffset() && typeof getOptions.getOffset() !== 'string') {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_OFFSET, [typeof getOptions?.getOffset()]);
        }

        if (getOptions?.getLimit() && typeof getOptions.getLimit() !== 'string') {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_LIMIT, [typeof getOptions?.getLimit()]);
        }

        if (getOptions?.getDownloadURL() && typeof getOptions.getDownloadURL() !== 'boolean') {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_DOWNLOAD_URL, [typeof getOptions?.getDownloadURL()]);
        }

        if (getOptions?.getColumnName() && typeof getOptions.getColumnName() !== 'string') {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_COLUMN_NAME);
        }

        if (getOptions?.getOrderBy() && !isOrderBy(getOptions.getOrderBy())) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_ORDER_BY, [typeof getOptions?.getOrderBy()]);
        }

        if (getOptions?.getFields() && !Array.isArray(getOptions?.getFields())) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_FIELDS, [typeof getOptions?.getFields()]);
        }

        if (getOptions?.getFields() && Array.isArray(getOptions?.getFields())) {
            getOptions?.getFields()!.forEach((field, index) => {
                if (!field) {
                    throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_FIELD, [index]);
                }
                if (typeof field !== 'string' || field.trim().length === 0) {
                    throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_FIELD, [index]);
                }
            });
        }

        if (getOptions?.getColumnValues() && !Array.isArray(getOptions?.getColumnValues())) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_COLUMN_VALUES);
        }

        if (getOptions?.getColumnValues() && Array.isArray(getOptions?.getColumnValues())) {
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

export const validateGetRequest = (getRequest: GetRequest, getOptions?: GetOptions) => {
    if (getRequest) {
        if (!Object.prototype.hasOwnProperty.call(getRequest, '_tableName')) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_TABLE_NAME);
        }

        if (typeof getRequest.tableName !== 'string' || getRequest.tableName.trim().length === 0) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TABLE_NAME);
        }

        const ids = getRequest.ids;
        if (ids.length === 0) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_IDS_IN_GET);
        }
        ids.forEach((id, index) => {
            if (!id) {
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

export const validateGetColumnRequest = (getRequest: GetColumnRequest, getOptions?: GetOptions) => {
    if (getRequest) {
        if (!Object.prototype.hasOwnProperty.call(getRequest, '_tableName')) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_TABLE_NAME);
        }

        if (typeof getRequest.tableName !== 'string' || getRequest.tableName.trim().length === 0) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TABLE_NAME);
        }

        if (!Object.prototype.hasOwnProperty.call(getRequest, '_columnName'))
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_COLUMN_NAME);

        if (typeof getRequest.columnName !== 'string' || getRequest.columnName.trim().length === 0) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_COLUMN_NAME);
        }

        if (!Array.isArray(getRequest.columnValues)) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_COLUMN_VALUES)
        }

        const columnValues = getRequest.columnValues;
        if (columnValues.length === 0) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_COLUMN_VALUES);
        }
        columnValues.forEach((columnValue, index) => {
            if (!columnValue) {
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

        if (detokenizeOptions?.getContinueOnError() && typeof detokenizeOptions.getContinueOnError() !== 'boolean') {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_CONTINUE_ON_ERROR, [typeof detokenizeOptions?.getContinueOnError()]);
        }

        if (detokenizeOptions?.getDownloadURL() && typeof detokenizeOptions.getDownloadURL() !== 'boolean') {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_DOWNLOAD_URL, [typeof detokenizeOptions?.getDownloadURL()]);
        }

    }
};

export const validateDetokenizeRequest = (detokenizeRequest: DetokenizeRequest, detokenizeOptions?: DetokenizeOptions) => {
    if (detokenizeRequest) {
        if (!Object.prototype.hasOwnProperty.call(detokenizeRequest, '_redactionType'))
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_REDACTION_TYPE);

        if (typeof detokenizeRequest.redactionType !== 'string' || detokenizeRequest.redactionType.trim().length === 0) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_REDACTION_TYPE);
        }

        if (!Array.isArray(detokenizeRequest.tokens)) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TOKENS_TYPE_IN_DETOKENIZE)
        }

        const tokens = detokenizeRequest?.tokens;

        if (tokens.length === 0)
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_TOKENS_IN_DETOKENIZE);

        tokens.forEach((token, index) => {
            if (!token) {
                throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_TOKEN_IN_DETOKENIZE, [index]);
            }
            if (typeof token !== 'string' || token.trim().length === 0) {
                throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TOKEN_IN_DETOKENIZE, [index]);
            }
        });

        validateDetokenizeOptions(detokenizeOptions);

    } else {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_DETOKENIZE_REQUEST);
    }
};

export const validateTokenizeRequest = (tokenizeRequest: TokenizeRequest) => {
    if (tokenizeRequest) {
        if (!Object.prototype.hasOwnProperty.call(tokenizeRequest, '_values'))
            throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_VALUES_IN_TOKENIZE);

        if (!Array.isArray(tokenizeRequest?.values)) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_VALUES_TYPE_IN_TOKENIZE)
        }

        const values = tokenizeRequest?.values;

        if (values.length === 0)
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_VALUES_IN_TOKENIZE);

        values.forEach((data, index) => {
            if (!data) {
                throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_DATA_IN_TOKENIZE, [index]);
            }
            if (!data.columnGroup) {
                throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_COLUMN_GROUP_IN_TOKENIZE, [index]);
            }
            if (typeof data.columnGroup !== 'string' || data.columnGroup.trim().length === 0) {
                throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_COLUMN_GROUP_IN_TOKENIZE, [index]);
            }
            if (!data.value) {
                throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_VALUE_IN_TOKENIZE, [index]);
            }
            if (typeof data.value !== 'string' || data.value.trim().length === 0) {
                throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_VALUE_IN_TOKENIZE, [index]);
            }
        });
    } else {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TOKENIZE_REQUEST);
    }
};

export const validateDeleteRequest = (deleteRequest: DeleteRequest) => {
    if (deleteRequest) {
        if (!Object.prototype.hasOwnProperty.call(deleteRequest, '_tableName')) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_TABLE_NAME);
        }

        if (typeof deleteRequest.tableName !== 'string' || deleteRequest.tableName.trim().length === 0) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TABLE_NAME);
        }

        if (!Array.isArray(deleteRequest.deleteIds)) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_DELETE_IDS_INPUT)
        }

        const deleteIds = deleteRequest?.deleteIds;
        if (deleteIds.length === 0) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_DELETE_IDS);
        }

        deleteIds.forEach((deleteId, index) => {
            if (!deleteId) {
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

export const validateUploadFileRequest = (fileRequest: FileUploadRequest) => {
    if (fileRequest) {
        if (!Object.prototype.hasOwnProperty.call(fileRequest, '_tableName')) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_TABLE_IN_UPLOAD_FILE);
        }

        if (typeof fileRequest.tableName !== 'string' || fileRequest.tableName.trim().length === 0) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TABLE_IN_UPLOAD_FILE);
        }

        if (!Object.prototype.hasOwnProperty.call(fileRequest, '_skyflowId')) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_SKYFLOW_ID_IN_UPLOAD_FILE);
        }

        if (typeof fileRequest.skyflowId !== 'string' || fileRequest.skyflowId.trim().length === 0) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_SKYFLOW_ID_IN_UPLOAD_FILE);
        }


        if (!Object.prototype.hasOwnProperty.call(fileRequest, '_columnName')) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_COLUMN_NAME_IN_UPLOAD_FILE);
        }

        if (typeof fileRequest.columnName !== 'string' || fileRequest.columnName.trim().length === 0) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_COLUMN_NAME_IN_UPLOAD_FILE);
        }


        if (!Object.prototype.hasOwnProperty.call(fileRequest, '_filePath')) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_FILE_PATH_IN_UPLOAD_FILE);
        }

        if (typeof fileRequest.filePath !== 'string' || fileRequest.filePath.trim().length === 0) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_FILE_PATH_IN_UPLOAD_FILE);
        }
    } else {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_FILE_UPLOAD_REQUEST);
    }
}

export const validateQueryRequest = (queryRequest: QueryRequest) => {
    if (queryRequest) {
        if (!Object.prototype.hasOwnProperty.call(queryRequest, '_query')) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_QUERY);
        }

        if (typeof queryRequest.query !== 'string' || queryRequest.query.trim().length === 0) {
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
        if (typeof key !== 'string' || typeof obj[key] !== 'string') {
            return false;
        }
    }

    return true;
}

export const validateInvokeConnectionRequest = (invokeRequest: InvokeConnectionRequest) => {
    if (invokeRequest) {
        if (!Object.prototype.hasOwnProperty.call(invokeRequest, 'url')) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_URL);
        }

        if (typeof invokeRequest.url !== 'string' || invokeRequest.url.trim().length === 0) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_URL);
        }

        if (!Object.prototype.hasOwnProperty.call(invokeRequest, 'method'))
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_METHOD_NAME);

        if (isMethod(invokeRequest.method)) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_METHOD_NAME);
        }

        if (!Object.prototype.hasOwnProperty.call(invokeRequest, 'queryParams'))
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_QUERY_PARAMS);

        if (isStringKeyValueMap(invokeRequest?.queryParams)) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_QUERY_PARAMS);
        }

        if (!Object.prototype.hasOwnProperty.call(invokeRequest, 'pathParams'))
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_PATH_PARAMS);

        if (isStringKeyValueMap(invokeRequest?.pathParams)) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_PATH_PARAMS);
        }

        if (!Object.prototype.hasOwnProperty.call(invokeRequest, 'body'))
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_BODY);

        if (isStringKeyValueMap(invokeRequest?.body)) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_BODY);
        }

        if (!Object.prototype.hasOwnProperty.call(invokeRequest, 'headers'))
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_HEADERS);

        if (isStringKeyValueMap(invokeRequest?.headers)) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_HEADERS);
        }

    } else {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_INVOKE_CONNECTION_REQUEST);
    }
};