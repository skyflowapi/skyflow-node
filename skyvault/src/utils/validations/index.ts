import { HTTP_HEADER, LogLevel, MessageType, RequestMethod, OrderByEnum, parameterizedString, printLog, RedactionType, SKYFLOW, TokenMode, SkyflowError, SKYFLOW_ERROR_CODE, logs, StringKeyValueMapType } from "skyflow-common";
import { V1Byot } from "../../ _generated_/rest/api";
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
import * as fs from 'fs';
import * as path from 'path';
import FileUploadOptions from "../../vault/model/options/fileUpload";

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

function validateInsertInput(input: unknown, index: number): void {
    if (typeof input !== 'object' || input === null || Array.isArray(input)) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_RECORD_IN_INSERT, [index]);
    }

    const inputObject = input as { [key: string]: unknown };
    const entries = Object.entries(inputObject);

    if (entries.length === 0) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_RECORD_IN_INSERT, [index]);
    }

    for (const [key] of entries) {
        if (!key || typeof key !== 'string') {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_RECORD_IN_INSERT, [index]);
        }
    }
}

function validateUpdateInput(input: unknown): void {
    if (typeof input !== 'object' || input === null || Array.isArray(input)) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_RECORD_IN_UPDATE);
    }

    const inputObject = input as { [key: string]: unknown };

    // Exclude skyflow_id — it is the record identifier, not a data field to update
    const entries = Object.entries(inputObject).filter(([key]) => key !== SKYFLOW.ID && key !== SKYFLOW.LEGACY_ID);

    if (entries.length === 0) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_RECORD_IN_UPDATE);
    }

    for (const [key] of entries) {
        if (!key || typeof key !== 'string') {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_RECORD_IN_UPDATE);
        }
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

        const hasNewId = Object.prototype.hasOwnProperty.call(updateRequest.data, SKYFLOW.ID);
        const hasLegacyId = Object.prototype.hasOwnProperty.call(updateRequest.data, 'skyflow_id');
        if (updateRequest?.data && !hasNewId && !hasLegacyId) {
            printLog(logs.errorLogs.EMPTY_SKYFLOW_ID_IN_UPDATE, MessageType.ERROR, logLevel);
            throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_SKYFLOW_ID_IN_UPDATE);
        }
        if (hasLegacyId) {
            printLog(logs.warnLogs.DEPRECATED_SKYFLOW_ID_PROPERTY, MessageType.WARN, logLevel);
        }

        const idValue = updateRequest.data[SKYFLOW.ID] ?? updateRequest.data[SKYFLOW.LEGACY_ID];
        if (typeof idValue !== 'string' || (idValue as string).trim().length === 0) {
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

        if (getOptions?.getDownloadUrl && getOptions?.getDownloadUrl() && typeof getOptions.getDownloadUrl() !== 'boolean') {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_DOWNLOAD_URL, [typeof getOptions?.getDownloadUrl()]);
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

        if (detokenizeOptions?.getDownloadUrl && detokenizeOptions?.getDownloadUrl() && typeof detokenizeOptions.getDownloadUrl() !== 'boolean') {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_DOWNLOAD_URL, [typeof detokenizeOptions?.getDownloadUrl()]);
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
            if (data.value === null || data.value === undefined || data.value === '') {
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

    const effectiveSkyflowId = options?.getSkyflowId() ?? (fileRequest as any)._legacySkyflowId;
    if (!effectiveSkyflowId) {
        printLog(logs.errorLogs.EMPTY_SKYFLOW_ID_IN_FILE_UPLOAD, MessageType.ERROR, logLevel);
        throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_SKYFLOW_ID_IN_UPLOAD_FILE);
    }

    if (typeof effectiveSkyflowId !== 'string' || effectiveSkyflowId.trim().length === 0) {
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

        const contentType = invokeRequest?.headers?.[HTTP_HEADER.CONTENT_TYPE] || invokeRequest?.headers?.[HTTP_HEADER.CONTENT_TYPE_LOWER] || '';
        const isStringBody = typeof invokeRequest?.body === 'string';
        if (invokeRequest?.body && !isStringKeyValueMap(invokeRequest?.body) && !(isStringBody && contentType)) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_BODY);
        }

        if (invokeRequest?.headers && !isStringKeyValueMap(invokeRequest?.headers)) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_HEADERS);
        }

    } else {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_INVOKE_CONNECTION_REQUEST);
    }
};