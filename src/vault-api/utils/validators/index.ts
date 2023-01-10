/*
  Copyright (c) 2022 Skyflow, Inc. 
*/
import SkyflowError from '../../libs/SkyflowError';
import { ISkyflow } from '../../Skyflow';
import {
  IInsertRecordInput, IDetokenizeInput, RedactionType, IGetByIdInput, IConnectionConfig, RequestMethod, IUpdateInput, IGetInput,
} from '../common';
import SKYFLOW_ERROR_CODE from '../constants';


export const validateInsertRecords = (recordObj: IInsertRecordInput) => {
  if (!('records' in recordObj)) {
    throw new SkyflowError(SKYFLOW_ERROR_CODE.RECORDS_KEY_NOT_FOUND, [], true);
  }
  const { records } = recordObj;
  if (records.length === 0) {
    throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_RECORDS, [], true);
  }
  records.forEach((record, index) => {
    if (!('table' in record && 'fields' in record)) {
      throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_TABLE_AND_FIELDS, [`${index}`], true);
    }
    if (record.table === '') {
      throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_TABLE, [`${index}`], true);
    }
  });
};

export const validateDetokenizeInput = (detokenizeInput: IDetokenizeInput) => {
  if (!Object.prototype.hasOwnProperty.call(detokenizeInput, 'records')) throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_RECORDS);

  const { records } = detokenizeInput;
  if (records.length === 0) throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_RECORDS);
  records.forEach((record) => {
    if (Object.keys(record).length === 0) {
      throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_RECORDS);
    }

    const recordToken = record.token;
    if (!recordToken) {
      throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_TOKEN);
    }
    if (recordToken === '' || typeof recordToken !== 'string') { throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TOKEN_ID); }

  });
};

export const validateGetByIdInput = (getByIdInput: IGetByIdInput) => {
  if (!Object.prototype.hasOwnProperty.call(getByIdInput, 'records')) {
    throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_RECORDS);
  }
  const { records } = getByIdInput;
  if (records.length === 0) {
    throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_RECORDS);
  }

  records.forEach((record) => {
    if (Object.keys(record).length === 0) {
      throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_RECORDS);
    }

    const recordIds = record.ids;

    if (!recordIds) {
      throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_IDS);
    }
    if (recordIds?.length === 0) throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_RECORD_IDS);
    recordIds?.forEach((skyflowId) => {
      if (typeof skyflowId !== 'string') throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_RECORD_ID_TYPE);
    });

    const recordRedaction = record.redaction;
    if (!recordRedaction) throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_REDACTION);
    if (!Object.values(RedactionType).includes(recordRedaction)) {
      throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_REDACTION_TYPE);
    }

    const recordTable = record.table;
    if (!Object.prototype.hasOwnProperty.call(record, 'table')) { throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_TABLE); }

    if (recordTable === '' || typeof recordTable !== 'string') { throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_RECORD_TABLE_VALUE); }
  
    if(record.hasOwnProperty('columnName') || record.hasOwnProperty('columnValues')) {
      throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_GET_BY_ID_INPUT);
    }
  });
};

export const validateGetInput = (getInput: IGetInput) => {
  if (!Object.prototype.hasOwnProperty.call(getInput, 'records')) {
    throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_RECORDS);
  }
  const { records } = getInput;
  if (records.length === 0) {
    throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_RECORDS);
  }

  records.forEach((record) => {
    if (Object.keys(record).length === 0) {
      throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_RECORDS);
    }

    const recordIds = record.ids;
    if (recordIds?.length === 0) throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_RECORD_IDS);
    recordIds?.forEach((skyflowId) => {
      if (typeof skyflowId !== 'string') throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_RECORD_ID_TYPE);
    });

    const recordRedaction = record.redaction;
    if (!recordRedaction) throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_REDACTION);
    if (!Object.values(RedactionType).includes(recordRedaction)) {
      throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_REDACTION_TYPE);
    }

    const recordTable = record.table;
    if (!Object.prototype.hasOwnProperty.call(record, 'table')) { throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_TABLE); }

    if (recordTable === '' || typeof recordTable !== 'string') { throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_RECORD_TABLE_VALUE); }

    if (record.columnName === undefined && record.columnValues === undefined && recordIds === undefined) { throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_ID_AND_COLUMN_NAME); }
    if (record.columnName != undefined && record.columnValues === undefined) { throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_RECORD_COLUMN_VALUE); }
    if (record.columnName === undefined && record.columnValues !== undefined) { throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_RECORD_COLUMN_NAME); }

    const columnName = record.columnName;
    if (columnName != null && typeof columnName !== 'string') { throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_RECORD_COLUMN_VALUE); }
    if (columnName != null && columnName === '') { throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_COLUMN_NAME); }

    const columnValues = record.columnValues;
    if (columnValues != null && !(columnValues && Array.isArray(columnValues)))
      throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_COLUMN_VALUES_OPTION_TYPE)

    if (columnValues != null) {
      if (columnValues.length === 0) throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_RECORD_COLUMN_VALUES);
      columnValues.forEach((eachColumnValue) => {
        if (typeof eachColumnValue !== 'string') throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_RECORD_COLUMN_VALUE_TYPE);
        if (eachColumnValue === '') throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_COLUMN_VALUE);
      });
    }
  });
};

export const isValidURL = (url: string) => {
  if (url.substring(0, 5).toLowerCase() !== 'https') {
    return false;
  }
  try {
    const tempUrl = new URL(url);
    if (tempUrl) return true;
  } catch (err) {
    return false;
  }

  return true;
};

export const validateConnectionConfig = (config: IConnectionConfig) => {
  if (!Object.prototype.hasOwnProperty.call(config, 'connectionURL')) {
    throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_CONNECTION_URL);
  }
  if (typeof config.connectionURL !== 'string') {
    throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_CONNECTION_URL_TYPE);
  }
  if (!isValidURL(config.connectionURL)) {
    throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_CONNECTION_URL);
  }

  if (!Object.prototype.hasOwnProperty.call(config, 'methodName')) {
    throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_METHODNAME_KEY);
  }
  if (!Object.values(RequestMethod).includes(config.methodName)) {
    throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_METHODNAME_VALUE);
  }
};

export const validateInitConfig = (initConfig: ISkyflow) => {
  if (!Object.prototype.hasOwnProperty.call(initConfig, 'vaultID')) {
    throw new SkyflowError(SKYFLOW_ERROR_CODE.VAULTID_IS_REQUIRED, [], true);
  }
  if (!initConfig.vaultID) {
    throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_VAULTID_IN_INIT, [], true);
  }
  if (!Object.prototype.hasOwnProperty.call(initConfig, 'vaultURL')) {
    throw new SkyflowError(SKYFLOW_ERROR_CODE.VAULTURL_IS_REQUIRED, [], true);
  }
  if (!initConfig.vaultURL) {
    throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_VAULTURL_IN_INIT, [], true);
  }
  if (initConfig.vaultURL && !isValidURL(initConfig.vaultURL)) {
    throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_VAULTURL_IN_INIT, [], true);
  }
  if (!Object.prototype.hasOwnProperty.call(initConfig, 'getBearerToken')) {
    throw new SkyflowError(SKYFLOW_ERROR_CODE.GET_BEARER_TOKEN_IS_REQUIRED, [], true);
  }
};

export const validateUpsertOptions = (upsertOptions) => {
  if (!(upsertOptions && Array.isArray(upsertOptions)))
    throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_UPSERT_OPTION_TYPE, [], true);

  if (!upsertOptions.length)
    throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_UPSERT_OPTIONS_ARRAY, [], true);

  upsertOptions.forEach((upsertOption, index: number) => {
    if (!(upsertOption && typeof upsertOption === 'object')) {
      throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_UPSERT_OPTION_OBJECT_TYPE, [index], true);
    }

    if (!Object.prototype.hasOwnProperty.call(upsertOption, 'table')) {
      throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_TABLE_IN_UPSERT_OPTION, [index], true);
    }

    if (!(upsertOption.table && typeof upsertOption.table === 'string' && upsertOption.table.length)) {
      throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TABLE_IN_UPSERT_OPTION, [index], true);
    }
    if (!Object.prototype.hasOwnProperty.call(upsertOption, 'column')) {
      throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_COLUMN_IN_UPSERT_OPTION, [index], true);
    }

    if (!(upsertOption.column && typeof upsertOption.column === 'string' && upsertOption.column.length)) {
      throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_COLUMN_IN_UPSERT_OPTION, [index], true);
    }
  });
};

export const validateUpdateInput = (updateInput: IUpdateInput) => {
  if (updateInput) {
    if (!Object.prototype.hasOwnProperty.call(updateInput, 'records'))
      throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_RECORDS);

    if (!Array.isArray(updateInput.records))
      throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_RECORDS_UPDATE_INPUT)
    const { records } = updateInput;
    if (records.length === 0) {
      throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_RECORDS);
    }
    records.forEach((updateRecord, index) => {
      if (Object.keys(updateRecord).length === 0)
        throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_RECORDS);

      if (!Object.prototype.hasOwnProperty.call(updateRecord, 'id'))
        throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_ID_IN_UPDATE, [index]);
      if (typeof updateRecord.id !== 'string' || updateRecord.id.trim().length === 0)
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_ID_IN_UPDATE, [index]);

      if (!Object.prototype.hasOwnProperty.call(updateRecord, 'table'))
        throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_TABLE_IN_IN_UPDATE, [index]);

      const recordTable = updateRecord.table;
      if (typeof recordTable !== 'string' || recordTable.trim().length === 0)
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TABLE_IN_UPDATE, [index]);

      if (!Object.prototype.hasOwnProperty.call(updateRecord, 'fields'))
        throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_FIELDS_IN_IN_UPDATE, [index]);
      if (typeof updateRecord?.fields !== 'object' || Object.keys(updateRecord).length === 0)
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_FIELDS_IN_UPDATE, [index]);
    });
  } else {
    throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_UPDATE_INPUT);
  }
};