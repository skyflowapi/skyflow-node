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

describe("validate upsert options in collect", () => {
  test("invalid upsert options type", () => {
    try {
      validateUpsertOptions({});
    } catch (err) {
      expect(err?.error?.description).toEqual(
        SKYFLOW_ERROR_CODE.INVALID_UPSERT_OPTION_TYPE.description
      );
    }
  });
  test("empty upsert array", () => {
    try {
      validateUpsertOptions([]);
    } catch (err) {
      expect(err?.error?.description).toEqual(
        SKYFLOW_ERROR_CODE.EMPTY_UPSERT_OPTIONS_ARRAY.description
      );
    }
  });
  test("invalid upsert object type", () => {
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
  test("missing table key", () => {
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
  test("missing column key", () => {
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
  test("invalid table key type", () => {
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
  test("invalid column key type", () => {
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

describe("test validateUpdateInput", () => {
  test("test invalid update input", () => {
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

  test("test missing records key in update input", () => {
    try {
      validateUpdateInput({});
    } catch (err) {
      expect(err?.errors[0].description).toEqual(
        SKYFLOW_ERROR_CODE.MISSING_RECORDS.description
      );
    }
  });

  test("test records not array input", () => {
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

  test("test records empty array input", () => {
    try {
      validateUpdateInput({ records: {} });
    } catch (err) {
      expect(err?.errors[0].description).toEqual(
        SKYFLOW_ERROR_CODE.INVALID_RECORDS_UPDATE_INPUT.description
      );
    }
  });

  test("test records empty array input", () => {
    try {
      validateUpdateInput({ records: [] });
    } catch (err) {
      expect(err?.errors[0].description).toEqual(
        SKYFLOW_ERROR_CODE.EMPTY_RECORDS.description
      );
    }
  });

  test("test invalid empty record object", () => {
    try {
      validateUpdateInput({ records: [{}] });
    } catch (err) {
      expect(err?.errors[0].description).toEqual(
        parameterizedString(SKYFLOW_ERROR_CODE.EMPTY_RECORDS.description, 0)
      );
    }
  });

  test("test missing id key in record object", () => {
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

  test("test invalid id values in record object", () => {
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

  test("test missing table key in record object", () => {
    try {
      validateUpdateInput({ records: [{ id: "test_id" }] });
    } catch (err) {
      expect(err?.errors[0].description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.MISSING_TABLE_IN_IN_UPDATE.description,
          0
        )
      );
    }
  });

  test("test invalid table values in record object", () => {
    try {
      validateUpdateInput({ records: [{ id: "test_id", table: {} }] });
    } catch (err) {
      expect(err?.errors[0].description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.INVALID_TABLE_IN_UPDATE.description,
          0
        )
      );
    }
    try {
      validateUpdateInput({ records: [{ id: "test_id", table: true }] });
    } catch (err) {
      expect(err?.errors[0].description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.INVALID_TABLE_IN_UPDATE.description,
          0
        )
      );
    }
    try {
      validateUpdateInput({ records: [{ id: "test_id", table: "" }] });
    } catch (err) {
      expect(err?.errors[0].description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.INVALID_TABLE_IN_UPDATE.description,
          0
        )
      );
    }
  });

  test("test missing fields key in record object", () => {
    try {
      validateUpdateInput({ records: [{ id: "test_id", table: "table1" }] });
    } catch (err) {
      expect(err?.errors[0].description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.MISSING_FIELDS_IN_IN_UPDATE.description,
          0
        )
      );
    }
  });

  test("test invalid fields values in record object", () => {
    try {
      validateUpdateInput({
        records: [{ id: "test_id", table: "table1", fields: true }],
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
        records: [{ id: "test_id", table: "table1", fields: "" }],
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
        records: [{ id: "test_id", table: "table1", fields: {} }],
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
  it("should test for Valid URL for given url's", () => {
    expect(isValidURL("https://example.com")).toBe(true);
    expect(isValidURL("http://example.com")).toBe(false);
    expect(isValidURL("example.com")).toBe(false);
    expect(isValidURL("")).toBe(false);
    expect(isValidURL("https://www .example.com")).toBe(false);
    expect(isValidURL("https://www.example.com")).toBe(true);
  });
});