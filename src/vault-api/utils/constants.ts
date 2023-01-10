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
  INVALID_BEARER_TOKEN: { code: 400, description: logs.errorLogs.INVALID_BEARER_TOKEN },
  INVALID_CREDENTIALS: { code: 400, description: logs.errorLogs.INVALID_CREDENTIALS },
  INVALID_CONTAINER_TYPE: { code: 400, description: logs.errorLogs.INVALID_CONTAINER_TYPE },
  INVALID_TABLE_OR_COLUMN: { code: 400, description: logs.errorLogs.INVALID_TABLE_OR_COLUMN },
  CLIENT_CONNECTION: { code: 400, description: logs.errorLogs.CLIENT_CONNECTION },
  RECORDS_KEY_NOT_FOUND: { code: 404, description: logs.errorLogs.RECORDS_KEY_NOT_FOUND },
  EMPTY_RECORDS: { code: 400, description: logs.errorLogs.EMPTY_RECORDS },
  MISSING_RECORDS: { code: 400, description: logs.errorLogs.MISSING_RECORDS },
  EMPTY_RECORD_IDS: { code: 400, description: logs.errorLogs.EMPTY_RECORD_IDS },
  EMPTY_RECORD_COLUMN_VALUES: { code: 400, description: logs.errorLogs.EMPTY_RECORD_COLUMN_VALUES },
  INVALID_RECORD_ID_TYPE: { code: 400, description: logs.errorLogs.INVALID_RECORD_ID_TYPE },
  INVALID_RECORD_COLUMN_VALUE_TYPE: { code: 400, description: logs.errorLogs.INVALID_RECORD_COLUMN_VALUE_TYPE },
  INVALID_COLUMN_VALUES_OPTION_TYPE: { code: 400, description: logs.errorLogs.INVALID_COLUMN_VALUES_OPTION_TYPE },


  INVALID_RECORD_LABEL: { code: 400, description: logs.errorLogs.INVALID_RECORD_LABEL },
  INVALID_RECORD_ALT_TEXT: { code: 400, description: logs.errorLogs.INVALID_RECORD_ALT_TEXT },
  EMPTY_TABLE_AND_FIELDS: { code: 400, description: logs.errorLogs.EMPTY_TABLE_AND_FIELDS },
  EMPTY_TABLE: { code: 400, description: logs.errorLogs.EMPTY_TABLE },
  MISSING_TABLE: { code: 400, description: logs.errorLogs.MISSING_TABLE },
  EMPTY_COLUMN_NAME: { code: 400, description: logs.errorLogs.EMPTY_COLUMN_NAME },
  EMPTY_COLUMN_VALUE: { code: 400, description: logs.errorLogs.EMPTY_COLUMN_VALUE },
  INVALID_RECORD_TABLE_VALUE: { code: 400, description: logs.errorLogs.INVALID_RECORD_TABLE_VALUE },
  INVALID_RECORD_COLUMN_VALUE: { code: 400, description: logs.errorLogs.INVALID_RECORD_COLUMN_VALUE },
  MISSING_RECORD_COLUMN_VALUE: { code: 400, description: logs.errorLogs.MISSING_RECORD_COLUMN_VALUE },
  MISSING_RECORD_COLUMN_NAME: { code: 400, description: logs.errorLogs.MISSING_RECORD_COLUMN_NAME },
  MISSING_ID_AND_COLUMN_NAME: { code: 400, description: logs.errorLogs.MISSING_ID_AND_COLUMN_NAME },
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
  INVALID_UPSERT_OPTION_TYPE: {
    code: 400,
    description: logs.errorLogs.INVALID_UPSERT_OPTION_TYPE,
  },
  EMPTY_UPSERT_OPTIONS_ARRAY: {
    code: 400,
    description: logs.errorLogs.EMPTY_UPSERT_OPTIONS_ARRAY,
  },
  INVALID_UPSERT_OPTION_OBJECT_TYPE: {
    code: 400,
    description: logs.errorLogs.INVALID_UPSERT_OPTION_OBJECT_TYPE,
  },
  MISSING_TABLE_IN_UPSERT_OPTION: {
    code: 400,
    description: logs.errorLogs.MISSING_TABLE_IN_UPSERT_OPTION,
  },
  MISSING_COLUMN_IN_UPSERT_OPTION: {
    code: 400,
    description: logs.errorLogs.MISSING_COLUMN_IN_UPSERT_OPTION,
  },
  INVALID_TABLE_IN_UPSERT_OPTION: {
    code: 400,
    description: logs.errorLogs.INVALID_TABLE_IN_UPSERT_OPTION,
  },
  INVALID_COLUMN_IN_UPSERT_OPTION: {
    code: 400,
    description: logs.errorLogs.INVALID_COLUMN_IN_UPSERT_OPTION,
  },
  INVALID_TOKENS_IN_INSERT: {
    code: 400,
    description: logs.errorLogs.INVALID_TOKENS_IN_INSERT,
  },
  INVALID_TOKENS_IN_UPDATE: {
    code: 400,
    description: logs.errorLogs.INVALID_TOKENS_IN_UPDATE,
  },
  MISSING_TABLE_IN_IN_UPDATE: {
    code: 400,
    description: logs.errorLogs.MISSING_TABLE_IN_IN_UPDATE,
  },
  MISSING_FIELDS_IN_IN_UPDATE: {
    code: 400,
    description: logs.errorLogs.MISSING_FIELDS_IN_IN_UPDATE,
  },
  MISSING_ID_IN_UPDATE: {
    code: 400,
    description: logs.errorLogs.MISSING_ID_IN_UPDATE,
  },
  INVALID_ID_IN_UPDATE: {
    code: 400,
    description: logs.errorLogs.INVALID_ID_IN_UPDATE,
  },
  INVALID_TABLE_IN_UPDATE: {
    code: 400,
    description: logs.errorLogs.INVALID_TABLE_IN_UPDATE,
  },
  INVALID_FIELDS_IN_UPDATE: {
    code: 400,
    description: logs.errorLogs.INVALID_FIELDS_IN_UPDATE,
  },
  INVALID_UPDATE_INPUT: {
    code: 400,
    description: logs.errorLogs.INVALID_UPDATE_INPUT,
  },
  INVALID_RECORDS_UPDATE_INPUT:{
    code: 400,
    description: logs.errorLogs.INVALID_RECORDS_UPDATE_INPUT,
  },
  INVALID_GET_BY_ID_INPUT:{
    code: 400,
    description: logs.errorLogs.INVALID_GET_BY_ID_INPUT,
  }

};

export default SKYFLOW_ERROR_CODE;
