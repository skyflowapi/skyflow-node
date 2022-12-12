import {validateUpsertOptions,validateUpdateInput} from "../../src/vault-api/utils/validators";
import SKYFLOW_ERROR_CODE from "../../src/vault-api/utils/constants";
import { parameterizedString } from '../../src/vault-api/utils/logs-helper';

describe("validate upsert options in collect", () => {
    test('invalid upsert options type', () => {
      try {
        validateUpsertOptions({})
      } catch (err) {
        expect(err?.error?.description).toEqual(SKYFLOW_ERROR_CODE.INVALID_UPSERT_OPTION_TYPE.description)
      }
    })
    test('empty upsert array', () => {
      try {
        validateUpsertOptions([])
      } catch (err) {
        expect(err?.error?.description).toEqual(SKYFLOW_ERROR_CODE.EMPTY_UPSERT_OPTIONS_ARRAY.description)
      }
    })
    test('invalid upsert object type', () => {
      try {
        validateUpsertOptions([undefined])
      } catch (err) {
        expect(err?.error?.description).toEqual(parameterizedString(SKYFLOW_ERROR_CODE.INVALID_UPSERT_OPTION_OBJECT_TYPE.description, 0))
      }
    })
    test('missing table key', () => {
      try {
        validateUpsertOptions([{
          column: 'column'
        }])
      } catch (err) {
        expect(err?.error?.description).toEqual(parameterizedString(SKYFLOW_ERROR_CODE.MISSING_TABLE_IN_UPSERT_OPTION.description, 0))
      }
    })
    test('missing column key', () => {
      try {
        validateUpsertOptions([{
          table: 'table'
        }])
      } catch (err) {
        expect(err?.error?.description).toEqual(parameterizedString(SKYFLOW_ERROR_CODE.MISSING_COLUMN_IN_UPSERT_OPTION.description, 0))
      }
    })
    test('invalid table key type', () => {
      try {
        validateUpsertOptions([{
          table: true,
          column: 'column'
        }])
      } catch (err) {
        expect(err?.error?.description).toEqual(parameterizedString(SKYFLOW_ERROR_CODE.INVALID_TABLE_IN_UPSERT_OPTION.description, 0))
      }
    })
    test('invalid column key type', () => {
      try {
        validateUpsertOptions([{
          table: 'table',
          column: true
        }])
      } catch (err) {
        expect(err?.error?.description).toEqual(parameterizedString(SKYFLOW_ERROR_CODE.INVALID_COLUMN_IN_UPSERT_OPTION.description, 0))
      }
    })
  
  });

describe("test validateUpdateInput",()=>{
  test('test invalid update input',()=>{
    try {
      validateUpdateInput(null);
    } catch (err) {
      expect(err?.errors[0].description).toEqual(SKYFLOW_ERROR_CODE.INVALID_UPDATE_INPUT.description)
    }
    try {
      validateUpdateInput(undefined);
    } catch (err) {
      expect(err?.errors[0].description).toEqual(SKYFLOW_ERROR_CODE.INVALID_UPDATE_INPUT.description)
    }
  });

  test('test missing records key in update input',()=>{
    try {
      validateUpdateInput({});
    } catch (err) {
      expect(err?.errors[0].description).toEqual(SKYFLOW_ERROR_CODE.MISSING_RECORDS.description)
    }
  });

  test('test records not array input',()=>{
    try {
      validateUpdateInput({records:{}});
    } catch (err) {
      expect(err?.errors[0].description).toEqual(SKYFLOW_ERROR_CODE.INVALID_RECORDS_UPDATE_INPUT.description)
    }

    try {
      validateUpdateInput({records:true});
    } catch (err) {
      expect(err?.errors[0].description).toEqual(SKYFLOW_ERROR_CODE.INVALID_RECORDS_UPDATE_INPUT.description)
    }
  });


  test('test records empty array input',()=>{
    try {
      validateUpdateInput({records:{}});
    } catch (err) {
      expect(err?.errors[0].description).toEqual(SKYFLOW_ERROR_CODE.INVALID_RECORDS_UPDATE_INPUT.description)
    }
  });

  test('test records empty array input',()=>{
    try {
      validateUpdateInput({records:[]});
    } catch (err) {
      expect(err?.errors[0].description).toEqual(SKYFLOW_ERROR_CODE.EMPTY_RECORDS.description)
    }
  });

  test('test invalid empty record object',()=>{
    try {
      validateUpdateInput({records:[{}]});
    } catch (err) {
      expect(err?.errors[0].description).toEqual(parameterizedString(SKYFLOW_ERROR_CODE.EMPTY_RECORDS.description,0))
    }
  });

  test('test missing id key in record object',()=>{
    try {
      validateUpdateInput({records:[{ids:[]}]});
    } catch (err) {
      expect(err?.errors[0].description).toEqual(parameterizedString(SKYFLOW_ERROR_CODE.MISSING_ID_IN_UPDATE.description,0))
    }
  });

  test('test invalid id values in record object',()=>{
    try {
      validateUpdateInput({records:[{id:{}}]});
    } catch (err) {
      expect(err?.errors[0].description).toEqual(parameterizedString(SKYFLOW_ERROR_CODE.INVALID_ID_IN_UPDATE.description,0))
    }
    try {
      validateUpdateInput({records:[{id:true}]});
    } catch (err) {
      expect(err?.errors[0].description).toEqual(parameterizedString(SKYFLOW_ERROR_CODE.INVALID_ID_IN_UPDATE.description,0))
    }
    try {
      validateUpdateInput({records:[{id:''}]});
    } catch (err) {
      expect(err?.errors[0].description).toEqual(parameterizedString(SKYFLOW_ERROR_CODE.INVALID_ID_IN_UPDATE.description,0))
    }
  });

  test('test missing table key in record object',()=>{
    try {
      validateUpdateInput({records:[{id:'test_id'}]});
    } catch (err) {
      expect(err?.errors[0].description).toEqual(parameterizedString(SKYFLOW_ERROR_CODE.MISSING_TABLE_IN_IN_UPDATE.description,0))
    }
  });

  test('test invalid table values in record object',()=>{
    try {
      validateUpdateInput({records:[{id:'test_id',table:{}}]});
    } catch (err) {
      expect(err?.errors[0].description).toEqual(parameterizedString(SKYFLOW_ERROR_CODE.INVALID_TABLE_IN_UPDATE.description,0))
    }
    try {
      validateUpdateInput({records:[{id:'test_id',table:true}]});
    } catch (err) {
      expect(err?.errors[0].description).toEqual(parameterizedString(SKYFLOW_ERROR_CODE.INVALID_TABLE_IN_UPDATE.description,0))
    }
    try {
      validateUpdateInput({records:[{id:'test_id',table:''}]});
    } catch (err) {
      expect(err?.errors[0].description).toEqual(parameterizedString(SKYFLOW_ERROR_CODE.INVALID_TABLE_IN_UPDATE.description,0))
    }
  });

  test('test missing fields key in record object',()=>{
    try {
      validateUpdateInput({records:[{id:'test_id',table:'table1'}]});
    } catch (err) {
      expect(err?.errors[0].description).toEqual(parameterizedString(SKYFLOW_ERROR_CODE.MISSING_FIELDS_IN_IN_UPDATE.description,0))
    }
  });

  test('test invalid fields values in record object',()=>{
    try {
      validateUpdateInput({records:[{id:'test_id',table:'table1',fields:true}]});
    } catch (err) {
      expect(err?.errors[0].description).toEqual(parameterizedString(SKYFLOW_ERROR_CODE.INVALID_FIELDS_IN_UPDATE.description,0))
    }
    try {
      validateUpdateInput({records:[{id:'test_id',table:'table1',fields:''}]});
    } catch (err) {
      expect(err?.errors[0].description).toEqual(parameterizedString(SKYFLOW_ERROR_CODE.INVALID_FIELDS_IN_UPDATE.description,0))
    }
    try {
      validateUpdateInput({records:[{id:'test_id',table:'table1',fields:{}}]});
    } catch (err) {
      expect(err?.errors[0].description).toEqual(parameterizedString(SKYFLOW_ERROR_CODE.INVALID_FIELDS_IN_UPDATE.description,0))
    }
  });

});