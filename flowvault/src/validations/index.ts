import {
  SkyflowError,
  SKYFLOW_ERROR_CODE,
  LogLevel,
  MessageType,
  printLog,
} from 'skyflow-common';
import InsertRequest from '../model/request/insert';
import GetRequest from '../model/request/get';
import UpdateRequest from '../model/request/update';
import DeleteRequest from '../model/request/delete';
import QueryRequest from '../model/request/query';
import DetokenizeRequest from '../model/request/detokenize';
import GetTokensRequest from '../model/request/get-tokens';
import UploadFilesRequest from '../model/request/upload-files';
import DeleteFilesRequest from '../model/request/delete-files';

const isNonEmptyString = (value: unknown): boolean =>
  typeof value === 'string' && value.trim().length > 0;

const isNonEmptyArray = (value: unknown): boolean =>
  Array.isArray(value) && value.length > 0;

const fail = (code: { httpCode: number; message: string }, logLevel?: LogLevel): never => {
  printLog(code.message, MessageType.ERROR, logLevel);
  throw new SkyflowError(code);
};

export const validateInsertRequest = (
  request: InsertRequest,
  _options?: unknown,
  logLevel?: LogLevel,
): void => {
  if (!request || !(request instanceof InsertRequest)) {
    fail(SKYFLOW_ERROR_CODE.INVALID_INSERT_REQUEST, logLevel);
  }
  if (!isNonEmptyString(request.tableName)) {
    fail(SKYFLOW_ERROR_CODE.EMPTY_TABLE_NAME, logLevel);
  }
  if (!isNonEmptyArray(request.records)) {
    fail(SKYFLOW_ERROR_CODE.EMPTY_RECORD_IN_INSERT, logLevel);
  }
  request.records.forEach((record) => {
    if (!record || typeof record.data !== 'object' || record.data === null) {
      fail(SKYFLOW_ERROR_CODE.EMPTY_DATA_IN_INSERT, logLevel);
    }
  });
};

export const validateGetRequest = (
  request: GetRequest,
  _options?: unknown,
  logLevel?: LogLevel,
): void => {
  if (!request || !(request instanceof GetRequest)) {
    fail(SKYFLOW_ERROR_CODE.INVALID_GET_REQUEST, logLevel);
  }
  const hasMultiTable = isNonEmptyArray(request.records);
  if (!hasMultiTable) {
    if (!isNonEmptyString(request.table)) {
      fail(SKYFLOW_ERROR_CODE.EMPTY_TABLE_NAME, logLevel);
    }
    if (!isNonEmptyArray(request.ids)) {
      fail(SKYFLOW_ERROR_CODE.EMPTY_IDS_IN_GET, logLevel);
    }
  }
};

export const validateUpdateRequest = (
  request: UpdateRequest,
  _options?: unknown,
  logLevel?: LogLevel,
): void => {
  if (!request || !(request instanceof UpdateRequest)) {
    fail(SKYFLOW_ERROR_CODE.INVALID_UPDATE_REQUEST, logLevel);
  }
  if (!isNonEmptyString(request.tableName)) {
    fail(SKYFLOW_ERROR_CODE.EMPTY_TABLE_NAME, logLevel);
  }
  if (!isNonEmptyArray(request.records)) {
    fail(SKYFLOW_ERROR_CODE.INVALID_RECORD_IN_UPDATE, logLevel);
  }
  request.records.forEach((record) => {
    if (!isNonEmptyString(record?.skyflowId)) {
      fail(SKYFLOW_ERROR_CODE.MISSING_SKYFLOW_ID_IN_UPDATE, logLevel);
    }
    if (!record || typeof record.data !== 'object' || record.data === null) {
      fail(SKYFLOW_ERROR_CODE.EMPTY_DATA_IN_UPDATE, logLevel);
    }
  });
};

export const validateDeleteRequest = (request: DeleteRequest, logLevel?: LogLevel): void => {
  if (!request || !(request instanceof DeleteRequest)) {
    fail(SKYFLOW_ERROR_CODE.INVALID_DELETE_REQUEST, logLevel);
  }
  if (!isNonEmptyString(request.table)) {
    fail(SKYFLOW_ERROR_CODE.EMPTY_TABLE_NAME, logLevel);
  }
  const hasUniqueValues = isNonEmptyArray(request.uniqueValues);
  if (!hasUniqueValues && !isNonEmptyArray(request.ids)) {
    fail(SKYFLOW_ERROR_CODE.EMPTY_DELETE_IDS, logLevel);
  }
};

export const validateQueryRequest = (request: QueryRequest, logLevel?: LogLevel): void => {
  if (!request || !(request instanceof QueryRequest)) {
    fail(SKYFLOW_ERROR_CODE.INVALID_QUERY_REQUEST, logLevel);
  }
  if (!isNonEmptyString(request.query)) {
    fail(SKYFLOW_ERROR_CODE.EMPTY_QUERY, logLevel);
  }
};

export const validateDetokenizeRequest = (
  request: DetokenizeRequest,
  _options?: unknown,
  logLevel?: LogLevel,
): void => {
  if (!request || !(request instanceof DetokenizeRequest)) {
    fail(SKYFLOW_ERROR_CODE.INVALID_DETOKENIZE_REQUEST, logLevel);
  }
  if (!isNonEmptyArray(request.tokens)) {
    fail(SKYFLOW_ERROR_CODE.EMPTY_TOKENS_IN_DETOKENIZE, logLevel);
  }
  request.tokens.forEach((token) => {
    if (!isNonEmptyString(token)) {
      fail(SKYFLOW_ERROR_CODE.EMPTY_TOKEN_IN_DETOKENIZE, logLevel);
    }
  });
};

export const validateGetTokensRequest = (
  request: GetTokensRequest,
  logLevel?: LogLevel,
): void => {
  if (!request || !(request instanceof GetTokensRequest)) {
    fail(SKYFLOW_ERROR_CODE.INVALID_TOKENIZE_REQUEST, logLevel);
  }
  if (!isNonEmptyArray(request.records)) {
    fail(SKYFLOW_ERROR_CODE.EMPTY_VALUES_IN_TOKENIZE, logLevel);
  }
  request.records.forEach((record) => {
    if (!isNonEmptyString(record?.tokenGroupName)) {
      fail(SKYFLOW_ERROR_CODE.EMPTY_COLUMN_GROUP_IN_TOKENIZE, logLevel);
    }
  });
};

export const validateUploadFilesRequest = (
  request: UploadFilesRequest,
  _options?: unknown,
  logLevel?: LogLevel,
): void => {
  if (!request || !(request instanceof UploadFilesRequest)) {
    fail(SKYFLOW_ERROR_CODE.INVALID_FILE_UPLOAD_REQUEST, logLevel);
  }
  if (!isNonEmptyArray(request.records)) {
    fail(SKYFLOW_ERROR_CODE.INVALID_FILE_UPLOAD_REQUEST, logLevel);
  }
  request.records.forEach((record) => {
    if (!isNonEmptyString(record?.tableName)) {
      fail(SKYFLOW_ERROR_CODE.MISSING_TABLE_IN_UPLOAD_FILE, logLevel);
    }
    if (!isNonEmptyArray(record?.columns)) {
      fail(SKYFLOW_ERROR_CODE.MISSING_COLUMN_NAME_IN_UPLOAD_FILE, logLevel);
    }
    record.columns.forEach((column) => {
      if (!isNonEmptyString(column?.column)) {
        fail(SKYFLOW_ERROR_CODE.MISSING_COLUMN_NAME_IN_UPLOAD_FILE, logLevel);
      }
      const sources = [column.filePath, column.base64, column.file].filter(
        (source) => source !== undefined && source !== null,
      );
      if (sources.length !== 1) {
        fail(SKYFLOW_ERROR_CODE.MISSING_FILE_SOURCE_IN_UPLOAD_FILE, logLevel);
      }
      if (column.base64 !== undefined && !isNonEmptyString(column.fileName)) {
        fail(SKYFLOW_ERROR_CODE.MISSING_FILE_NAME_FOR_BASE64, logLevel);
      }
    });
  });
};

export const validateDeleteFilesRequest = (
  request: DeleteFilesRequest,
  logLevel?: LogLevel,
): void => {
  if (!request || !(request instanceof DeleteFilesRequest)) {
    fail(SKYFLOW_ERROR_CODE.INVALID_FILE_UPLOAD_REQUEST, logLevel);
  }
  if (!isNonEmptyArray(request.records)) {
    fail(SKYFLOW_ERROR_CODE.INVALID_FILE_UPLOAD_REQUEST, logLevel);
  }
  request.records.forEach((record) => {
    if (!isNonEmptyString(record?.tableName)) {
      fail(SKYFLOW_ERROR_CODE.MISSING_TABLE_IN_UPLOAD_FILE, logLevel);
    }
    if (!isNonEmptyArray(record?.columns)) {
      fail(SKYFLOW_ERROR_CODE.MISSING_COLUMN_NAME_IN_UPLOAD_FILE, logLevel);
    }
    const hasSkyflowId = isNonEmptyString(record?.skyflowId);
    const hasUniqueValues = isNonEmptyArray(record?.uniqueValues);
    if (hasSkyflowId === hasUniqueValues) {
      // exactly one of skyflowId / uniqueValues is required
      fail(SKYFLOW_ERROR_CODE.MISSING_SKYFLOW_ID_IN_UPLOAD_FILE, logLevel);
    }
  });
};
