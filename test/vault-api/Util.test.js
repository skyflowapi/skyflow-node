import {validateUpsertOptions} from "../../src/vault-api/utils/validators";
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
  
  })