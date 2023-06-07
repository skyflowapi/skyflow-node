import {
  validateUpsertOptions,
  validateUpdateInput,
  validateInsertRecords,
  validateInitConfig,
  isValidURL
} from "../../src/vault-api/utils/validators";
import SKYFLOW_ERROR_CODE from "../../src/vault-api/utils/constants";
import { parameterizedString } from "../../src/vault-api/utils/logs-helper";
import SkyflowError from "../../src/vault-api/libs/SkyflowError";
import { fillUrlWithPathAndQueryParams, formatVaultURL, toLowerKeys, objectToFormData, generateSDKMetrics } from "../../src/vault-api/utils/helpers";
const FormData = require('form-data');

let mockJson = {};
jest.mock('../../package.json',()=>(mockJson));
let mockProcess = {};
jest.mock('process',()=>(mockProcess));
let mockOS= {};
jest.mock('os',()=>(mockOS))

describe("validate upsert options in collect", () => {
  it("invalid upsert options type", () => {
    try {
      validateUpsertOptions({});
    } catch (err) {
      expect(err?.error?.description).toEqual(
        SKYFLOW_ERROR_CODE.INVALID_UPSERT_OPTION_TYPE.description
      );
    }
  });
  it("empty upsert array", () => {
    try {
      validateUpsertOptions([]);
    } catch (err) {
      expect(err?.error?.description).toEqual(
        SKYFLOW_ERROR_CODE.EMPTY_UPSERT_OPTIONS_ARRAY.description
      );
    }
  });
  it("invalid upsert object type", () => {
    try {
      validateUpsertOptions([undefined]);
    } catch (err) {
      expect(err?.error?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.INVALID_UPSERT_OPTION_OBJECT_TYPE.description,
          0
        )
      );
    }
  });
  it("missing table key", () => {
    try {
      validateUpsertOptions([
        {
          column: "column",
        },
      ]);
    } catch (err) {
      expect(err?.error?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.MISSING_TABLE_IN_UPSERT_OPTION.description,
          0
        )
      );
    }
  });
  it("missing column key", () => {
    try {
      validateUpsertOptions([
        {
          table: "table",
        },
      ]);
    } catch (err) {
      expect(err?.error?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.MISSING_COLUMN_IN_UPSERT_OPTION.description,
          0
        )
      );
    }
  });
  it("invalid table key type", () => {
    try {
      validateUpsertOptions([
        {
          table: true,
          column: "column",
        },
      ]);
    } catch (err) {
      expect(err?.error?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.INVALID_TABLE_IN_UPSERT_OPTION.description,
          0
        )
      );
    }
  });
  it("invalid column key type", () => {
    try {
      validateUpsertOptions([
        {
          table: "table",
          column: true,
        },
      ]);
    } catch (err) {
      expect(err?.error?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.INVALID_COLUMN_IN_UPSERT_OPTION.description,
          0
        )
      );
    }
  });
});

describe("it validateUpdateInput", () => {
  it("it invalid update input", () => {
    try {
      validateUpdateInput(null);
    } catch (err) {
      expect(err?.errors[0].description).toEqual(
        SKYFLOW_ERROR_CODE.INVALID_UPDATE_INPUT.description
      );
    }
    try {
      validateUpdateInput(undefined);
    } catch (err) {
      expect(err?.errors[0].description).toEqual(
        SKYFLOW_ERROR_CODE.INVALID_UPDATE_INPUT.description
      );
    }
  });

  it("it missing records key in update input", () => {
    try {
      validateUpdateInput({});
    } catch (err) {
      expect(err?.errors[0].description).toEqual(
        SKYFLOW_ERROR_CODE.MISSING_RECORDS.description
      );
    }
  });

  it("it records not array input", () => {
    try {
      validateUpdateInput({ records: {} });
    } catch (err) {
      expect(err?.errors[0].description).toEqual(
        SKYFLOW_ERROR_CODE.INVALID_RECORDS_UPDATE_INPUT.description
      );
    }

    try {
      validateUpdateInput({ records: true });
    } catch (err) {
      expect(err?.errors[0].description).toEqual(
        SKYFLOW_ERROR_CODE.INVALID_RECORDS_UPDATE_INPUT.description
      );
    }
  });

  it("it records empty array input", () => {
    try {
      validateUpdateInput({ records: {} });
    } catch (err) {
      expect(err?.errors[0].description).toEqual(
        SKYFLOW_ERROR_CODE.INVALID_RECORDS_UPDATE_INPUT.description
      );
    }
  });

  it("it records empty array input", () => {
    try {
      validateUpdateInput({ records: [] });
    } catch (err) {
      expect(err?.errors[0].description).toEqual(
        SKYFLOW_ERROR_CODE.EMPTY_RECORDS.description
      );
    }
  });

  it("it invalid empty record object", () => {
    try {
      validateUpdateInput({ records: [{}] });
    } catch (err) {
      expect(err?.errors[0].description).toEqual(
        parameterizedString(SKYFLOW_ERROR_CODE.EMPTY_RECORDS.description, 0)
      );
    }
  });

  it("it missing id key in record object", () => {
    try {
      validateUpdateInput({ records: [{ ids: [] }] });
    } catch (err) {
      expect(err?.errors[0].description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.MISSING_ID_IN_UPDATE.description,
          0
        )
      );
    }
  });

  it("it invalid id values in record object", () => {
    try {
      validateUpdateInput({ records: [{ id: {} }] });
    } catch (err) {
      expect(err?.errors[0].description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.INVALID_ID_IN_UPDATE.description,
          0
        )
      );
    }
    try {
      validateUpdateInput({ records: [{ id: true }] });
    } catch (err) {
      expect(err?.errors[0].description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.INVALID_ID_IN_UPDATE.description,
          0
        )
      );
    }
    try {
      validateUpdateInput({ records: [{ id: "" }] });
    } catch (err) {
      expect(err?.errors[0].description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.INVALID_ID_IN_UPDATE.description,
          0
        )
      );
    }
  });

  it("it missing table key in record object", () => {
    try {
      validateUpdateInput({ records: [{ id: "it_id" }] });
    } catch (err) {
      expect(err?.errors[0].description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.MISSING_TABLE_IN_IN_UPDATE.description,
          0
        )
      );
    }
  });

  it("it invalid table values in record object", () => {
    try {
      validateUpdateInput({ records: [{ id: "it_id", table: {} }] });
    } catch (err) {
      expect(err?.errors[0].description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.INVALID_TABLE_IN_UPDATE.description,
          0
        )
      );
    }
    try {
      validateUpdateInput({ records: [{ id: "it_id", table: true }] });
    } catch (err) {
      expect(err?.errors[0].description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.INVALID_TABLE_IN_UPDATE.description,
          0
        )
      );
    }
    try {
      validateUpdateInput({ records: [{ id: "it_id", table: "" }] });
    } catch (err) {
      expect(err?.errors[0].description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.INVALID_TABLE_IN_UPDATE.description,
          0
        )
      );
    }
  });

  it("it missing fields key in record object", () => {
    try {
      validateUpdateInput({ records: [{ id: "it_id", table: "table1" }] });
    } catch (err) {
      expect(err?.errors[0].description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.MISSING_FIELDS_IN_IN_UPDATE.description,
          0
        )
      );
    }
  });

  it("it invalid fields values in record object", () => {
    try {
      validateUpdateInput({
        records: [{ id: "it_id", table: "table1", fields: true }],
      });
    } catch (err) {
      expect(err?.errors[0].description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.INVALID_FIELDS_IN_UPDATE.description,
          0
        )
      );
    }
    try {
      validateUpdateInput({
        records: [{ id: "it_id", table: "table1", fields: "" }],
      });
    } catch (err) {
      expect(err?.errors[0].description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.INVALID_FIELDS_IN_UPDATE.description,
          0
        )
      );
    }
    try {
      validateUpdateInput({
        records: [{ id: "it_id", table: "table1", fields: {} }],
      });
    } catch (err) {
      expect(err?.errors[0].description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.INVALID_FIELDS_IN_UPDATE.description,
          0
        )
      );
    }
  });
});

describe("validateInsertRecords", () => {
  it("should throw an error if the records key is not found in recordObj", () => {
    const recordObj = {};
    const error = new SkyflowError(SKYFLOW_ERROR_CODE.RECORDS_KEY_NOT_FOUND);
    expect(() => validateInsertRecords(recordObj)).toThrow(error);
  });

  it("should throw an error if the records array is empty", () => {
    const recordObj = { records: [] };
    const error = new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_RECORDS);
    expect(() => validateInsertRecords(recordObj)).toThrow(error);
  });

  it("should throw an error if table and fields keys not found in a record", () => {
    const recordObj = { records: [{}] };
    const error = new SkyflowError({
      code: 400,
      description: parameterizedString(
        SKYFLOW_ERROR_CODE.EMPTY_TABLE_AND_FIELDS.description,
        0
      ),
    });
    expect(() => validateInsertRecords(recordObj)).toThrow(error);
  });

  it("should throw an error if table is empty in a record", () => {
    const recordObj = { records: [{ table: "", fields: {} }] };
    const error = new SkyflowError({
      code: 400,
      description: parameterizedString(
        SKYFLOW_ERROR_CODE.EMPTY_TABLE.description,
        0
      ),
    });
    expect(() => validateInsertRecords(recordObj)).toThrow(error);
  });

  it("should not throw an error if the records array has valid records", () => {
    const recordObj = {
      records: [{ table: "users", fields: { name: "John Doe" } }],
    };
    expect(() => validateInsertRecords(recordObj)).not.toThrow();
  });
});

describe("validateInitConfig", () => {
  it("should throw an error if the vault id is not found in initConfig", () => {
    const initConfigObj = { vaultURL: "https://example.com" };
    const error = new SkyflowError(SKYFLOW_ERROR_CODE.VAULTID_IS_REQUIRED);
    expect(() => validateInitConfig(initConfigObj)).toThrow(error);
  });

  it("should throw an error if the vault id is found but empty in initConfig", () => {
    const initConfigObj = { vaultID: "", vaultURL: "https://example.com" };
    const error = new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_VAULTID_IN_INIT);
    expect(() => validateInitConfig(initConfigObj)).toThrow(error);
  });

  it("should throw an error if the vault url is not found in initConfig", () => {
    const initConfigObj = { vaultID: "123" };
    const error = new SkyflowError(SKYFLOW_ERROR_CODE.VAULTURL_IS_REQUIRED);
    expect(() => validateInitConfig(initConfigObj)).toThrow(error);
  });

  it("should throw an error if the vault url is found but empty in initConfig", () => {
    const initConfigObj = { vaultID: "123", vaultURL: "" };
    const error = new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_VAULTURL_IN_INIT);
    expect(() => validateInitConfig(initConfigObj)).toThrow(error);
  });

  it("should throw an error if the vault url is found but it is in invalid format in initConfig", () => {
    const initConfigObj = { vaultID: "123", vaultURL: "invalid" };
    const error = new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_VAULTURL_IN_INIT);
    expect(() => validateInitConfig(initConfigObj)).toThrow(error);
  });

  it("should throw an error if valid vault url and id are given but getBearerToken method is not present", () => {
    const initConfigObj = {
      vaultID: "123",
      vaultURL: "https://example.com",
    };
    const error = new SkyflowError(
      SKYFLOW_ERROR_CODE.GET_BEARER_TOKEN_IS_REQUIRED
    );
    expect(() => validateInitConfig(initConfigObj)).toThrow(error);
  });
});

describe("validateURL", () => {
  it("should it for Valid URL for given url's", () => {
    expect(isValidURL("https://example.com")).toBe(true);
    expect(isValidURL("http://example.com")).toBe(false);
    expect(isValidURL("example.com")).toBe(false);
    expect(isValidURL("")).toBe(false);
    expect(isValidURL("https://www .example.com")).toBe(false);
    expect(isValidURL("https://www.example.com")).toBe(true);
  });
});

describe("URL helper its", () => {
  
  it('fillUrlWithPathAndQueryParams should add query params to the url', () => {
    const url = 'https://example.com';
    const queryParams = { param1: 'value1', param2: 'value2' };
    const expectedUrl = 'https://example.com?param1=value1&param2=value2';
    
    const result = fillUrlWithPathAndQueryParams(url, undefined, queryParams);
    
    expect(result).toEqual(expectedUrl);
  });
  
  it('fillUrlWithPathAndQueryParams should replace path params and add query params to the url', () => {
    const url = 'https://example.com/{param1}';
    const pathParams = { param1: 'path1' };
    const queryParams = { param2: 'value2', param3: 'value3' };
    const expectedUrl = 'https://example.com/path1?param2=value2&param3=value3';
    
    const result = fillUrlWithPathAndQueryParams(url, pathParams, queryParams);
    
    expect(result).toEqual(expectedUrl);
  });
  
  it('fillUrlWithPathAndQueryParams should not change the url if no pathParams and queryParams are passed', () => {
    const url = 'https://example.com';
    const expectedUrl = 'https://example.com';
    
    const result = fillUrlWithPathAndQueryParams(url);
    
    expect(result).toEqual(expectedUrl);
  });

  it('formatVaultURL should remove trailing slash from the url', () => {
    const url = 'https://example.com/';
    const expectedUrl = 'https://example.com';
    
    const result = formatVaultURL(url);
    
    expect(result).toEqual(expectedUrl);
  });
  
  it('formatVaultURL should remove leading and trailing whitespaces from the url', () => {
    const url = ' https://example.com ';
    const expectedUrl = 'https://example.com';
    
    const result = formatVaultURL(url);
    
    expect(result).toEqual(expectedUrl);
  });
  
  it('formatVaultURL should not change the url if it is already formatted', () => {
    const url = 'https://example.com';
    const expectedUrl = 'https://example.com';
    
    const result = formatVaultURL(url);
    
    expect(result).toEqual(expectedUrl);
  });
  
  it('formatVaultURL should not change the url if it is not a string', () => {
    const url = { key: 'value' };
    const expectedUrl = { key: 'value' };
    
    const result = formatVaultURL(url);
    
    expect(result).toEqual(expectedUrl);
  });
  
  it('toLowerKeys should convert object keys to lowercase', () => {
    const obj = { Key1: 'value1', Key2: 'value2' };
    const expectedObj = { key1: 'value1', key2: 'value2' };
    
    const result = toLowerKeys(obj);
    
    expect(result).toEqual(expectedObj);
  });
  
  it('toLowerKeys should return an empty object if input is not an object', () => {
    const obj = 'string';
    const expectedObj = {};
    
    const result = toLowerKeys(obj);
    
    expect(result).toEqual(expectedObj);
  });
  
  it('toLowerKeys should return an empty object if input is null or undefined', () => {
    const obj = null;
    const expectedObj = {};
    
    const result = toLowerKeys(obj);
    
    expect(result).toEqual(expectedObj);
  });

  it('objectToFormData should convert object to form data', () => {
    const obj = { key1: 'value1', key2: 'value2' };
    const form = new FormData();
    form.append('key1', 'value1');
    form.append('key2', 'value2');
    const result = objectToFormData(obj);
    expect(result).toBeDefined()
  });
  
  it('objectToFormData should convert nested object to form data', () => {
    const obj = { key1: 'value1', key2: { key3: 'value3', key4: 'value4' } };
    const form = new FormData();
    form.append('key1', 'value1');
    form.append('key2[key3]', 'value3');
    form.append('key2[key4]', 'value4');
    const result = objectToFormData(obj);
    expect(result).toBeDefined();
  });
  
  it('objectToFormData should convert array of objects to form data', () => {
    const obj = { key1: 'value1', key2: [{ key3: 'value3' }, { key4: 'value4' }] };
    const form = new FormData();
    form.append('key1', 'value1');
    form.append('key2[0][key3]', 'value3');
    form.append('key2[1][key4]', 'value4');
    const result = objectToFormData(obj);
    expect(result).toBeDefined();
  });  
});

describe("test generateSDKMetrics",()=>{

  test('should set it empty string when name version are undefined',()=>{
      mockJson = {name:undefined,version:null}
      const metrics = generateSDKMetrics();
      expect(metrics.sdk_name_version).toBe('');
  }); 

  test('should set it device model empty string when process is invalid or empty',()=>{
    mockProcess = {};
    const metrics = generateSDKMetrics();
    expect(metrics.sdk_client_device_model).toBe('');
  });

  test('should set it run time details empty string when process is invalid or empty',()=>{
    mockProcess = {};
    const metrics = generateSDKMetrics();
    expect(metrics.sdk_runtime_details).toBe('');
  });

  test('should set it os details empty string when process is invalid or empty',()=>{
    mockOS = {};
    const metrics = generateSDKMetrics();
    expect(metrics.sdk_client_os_details).toBe('');
  });






}); 