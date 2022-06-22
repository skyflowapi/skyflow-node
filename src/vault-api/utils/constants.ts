/*
	Copyright (c) 2022 Skyflow, Inc. 
*/
import logs from './logs';

const SKYFLOW_ERROR_CODE = {
  VAULTID_IS_REQUIRED: { code: 400, description: logs.errorLogs.VAULTID_IS_REQUIRED },
  EMPTY_VAULTID_IN_INIT: { code: 400, description: logs.errorLogs.EMPTY_VAULTID_IN_INIT },
  VAULTURL_IS_REQUIRED: { code: 400, description: logs.errorLogs.VAULTURL_IS_REQUIRED },
  EMPTY_VAULTURL_IN_INIT: { code: 400, description: logs.errorLogs.EMPTY_VAULTURL_IN_INIT },
  INVALID_VAULTURL_IN_INIT: { code: 400, description: logs.errorLogs.INVALID_VAULTURL_IN_INIT },
  GET_BEARER_TOKEN_IS_REQUIRED: {
    code: 400,
    description: logs.errorLogs.GET_BEARER_TOKEN_IS_REQUIRED,
  },
  INVALID_BEARER_TOKEN : { code : 400, description: logs.errorLogs.INVALID_BEARER_TOKEN},
  INVALID_CREDENTIALS: { code: 400, description: logs.errorLogs.INVALID_CREDENTIALS },
  INVALID_CONTAINER_TYPE: { code: 400, description: logs.errorLogs.INVALID_CONTAINER_TYPE },
  INVALID_TABLE_OR_COLUMN: { code: 400, description: logs.errorLogs.INVALID_TABLE_OR_COLUMN },
  CLIENT_CONNECTION: { code: 400, description: logs.errorLogs.CLIENT_CONNECTION },
  RECORDS_KEY_NOT_FOUND: { code: 404, description: logs.errorLogs.RECORDS_KEY_NOT_FOUND },
  EMPTY_RECORDS: { code: 400, description: logs.errorLogs.EMPTY_RECORDS },
  MISSING_RECORDS: { code: 400, description: logs.errorLogs.MISSING_RECORDS },
  EMPTY_RECORD_IDS: { code: 400, description: logs.errorLogs.EMPTY_RECORD_IDS },
  INVALID_RECORD_ID_TYPE: { code: 400, description: logs.errorLogs.INVALID_RECORD_ID_TYPE },
  INVALID_RECORD_LABEL: { code: 400, description: logs.errorLogs.INVALID_RECORD_LABEL },
  INVALID_RECORD_ALT_TEXT: { code: 400, description: logs.errorLogs.INVALID_RECORD_ALT_TEXT },
  EMPTY_TABLE_AND_FIELDS: { code: 400, description: logs.errorLogs.EMPTY_TABLE_AND_FIELDS },
  EMPTY_TABLE: { code: 400, description: logs.errorLogs.EMPTY_TABLE },
  MISSING_TABLE: { code: 400, description: logs.errorLogs.MISSING_TABLE },
  INVALID_RECORD_TABLE_VALUE: { code: 400, description: logs.errorLogs.INVALID_RECORD_TABLE_VALUE },

  INVALID_TOKEN_ID: { code: 400, description: logs.errorLogs.INVALID_TOKEN_ID },
  MISSING_TOKEN: { code: 400, description: logs.errorLogs.MISSING_TOKEN },
  MISSING_TOKEN_KEY: { code: 400, description: logs.errorLogs.MISSING_TOKEN_KEY },
  INVALID_REDACTION_TYPE: { code: 400, description: logs.errorLogs.INVALID_REDACTION_TYPE },
  MISSING_REDACTION: { code: 400, description: logs.errorLogs.MISSING_REDACTION },
  MISSING_REDACTION_VALUE: { code: 400, description: logs.errorLogs.MISSING_REDACTION_VALUE },
  MISSING_IDS: { code: 400, description: logs.errorLogs.MISSING_IDS },
  MISSING_CONNECTION_URL: { code: 400, description: logs.errorLogs.MISSING_CONNECTION_URL },
  INVALID_CONNECTION_URL_TYPE: { code: 400, description: logs.errorLogs.INVALID_CONNECTION_URL_TYPE },
  INVALID_CONNECTION_URL: { code: 400, description: logs.errorLogs.INVALID_CONNECTION_URL },
  MISSING_METHODNAME_KEY: { code: 400, description: logs.errorLogs.MISSING_METHODNAME_KEY },
  INVALID_METHODNAME_VALUE: { code: 400, description: logs.errorLogs.INVALID_METHODNAME_VALUE },
  UNKNOWN_ERROR: { code: 400, description: logs.errorLogs.UNKNOWN_ERROR },
  CONNECTION_ERROR: { code: 400, description: logs.errorLogs.CONNECTION_ERROR },
  TRANSACTION_ERROR: { code: 400, description: logs.errorLogs.TRANSACTION_ERROR },
};

export default SKYFLOW_ERROR_CODE;
