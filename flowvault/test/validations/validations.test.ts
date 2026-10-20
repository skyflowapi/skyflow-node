import {
  SkyflowError,
  SKYFLOW_ERROR_CODE,
  InsertRequest,
  GetRequest,
  GetOptions,
  UpdateRequest,
  DeleteRequest,
  QueryRequest,
  DetokenizeRequest,
  GetTokensRequest,
  UploadFilesRequest,
  DeleteFilesRequest,
} from '../../src';
import {
  validateInsertRequest,
  validateGetRequest,
  validateUpdateRequest,
  validateDeleteRequest,
  validateQueryRequest,
  validateDetokenizeRequest,
  validateGetTokensRequest,
  validateUploadFilesRequest,
  validateDeleteFilesRequest,
} from '../../src/validations';
import { silenceConsole } from '../helpers';

silenceConsole();

type Code = { httpCode: number; message: string };

/** Assert `fn` throws a SkyflowError carrying the given error code. */
function expectCode(fn: () => void, code: Code): void {
  let thrown: unknown;
  try {
    fn();
  } catch (e) {
    thrown = e;
  }
  expect(thrown).toBeInstanceOf(SkyflowError);
  const err = thrown as SkyflowError;
  expect(err.error?.message).toBe(code.message);
  expect(err.error?.httpCode).toBe(code.httpCode);
}

describe('validateInsertRequest', () => {
  it('throws on invalid request / empty table / empty records / empty data', () => {
    expectCode(() => validateInsertRequest({} as unknown as InsertRequest), SKYFLOW_ERROR_CODE.INVALID_INSERT_REQUEST);
    expectCode(() => validateInsertRequest(null as unknown as InsertRequest), SKYFLOW_ERROR_CODE.INVALID_INSERT_REQUEST);
    expectCode(() => validateInsertRequest(new InsertRequest('', [{ data: { a: 1 } }])), SKYFLOW_ERROR_CODE.EMPTY_TABLE_NAME);
    expectCode(() => validateInsertRequest(new InsertRequest('t', [])), SKYFLOW_ERROR_CODE.EMPTY_RECORD_IN_INSERT);
    expectCode(
      () => validateInsertRequest(new InsertRequest('t', [{ data: null as unknown as Record<string, unknown> }])),
      SKYFLOW_ERROR_CODE.EMPTY_DATA_IN_INSERT,
    );
  });

  it('does not throw on valid input', () => {
    expect(() => validateInsertRequest(new InsertRequest('t', [{ data: { a: 1 } }]))).not.toThrow();
  });
});

describe('validateGetRequest', () => {
  it('throws on invalid request / empty table / empty ids (single-table)', () => {
    expectCode(() => validateGetRequest({} as unknown as GetRequest), SKYFLOW_ERROR_CODE.INVALID_GET_REQUEST);
    expectCode(() => validateGetRequest(new GetRequest('', ['id'])), SKYFLOW_ERROR_CODE.EMPTY_TABLE_NAME);
    expectCode(() => validateGetRequest(new GetRequest('t', [])), SKYFLOW_ERROR_CODE.EMPTY_IDS_IN_GET);
  });

  it('does not throw for valid single-table or multi-table input', () => {
    expect(() => validateGetRequest(new GetRequest('t', ['id']))).not.toThrow();
    expect(() => validateGetRequest(new GetRequest('', [], [{ tableName: 't', ids: ['i'] }]))).not.toThrow();
  });

  it('allows empty ids when uniqueValues are provided on GetOptions', () => {
    const options = new GetOptions();
    options.setUniqueValues([{ email: 'jane@example.com' }]);
    expect(() => validateGetRequest(new GetRequest('t', []), options)).not.toThrow();
  });
});

describe('validateUpdateRequest', () => {
  it('throws on invalid request / empty table / empty records / missing skyflowId / empty data', () => {
    expectCode(() => validateUpdateRequest({} as unknown as UpdateRequest), SKYFLOW_ERROR_CODE.INVALID_UPDATE_REQUEST);
    expectCode(
      () => validateUpdateRequest(new UpdateRequest('', [{ skyflowId: 'i', data: { a: 1 } }])),
      SKYFLOW_ERROR_CODE.EMPTY_TABLE_NAME,
    );
    expectCode(() => validateUpdateRequest(new UpdateRequest('t', [])), SKYFLOW_ERROR_CODE.INVALID_RECORD_IN_UPDATE);
    expectCode(
      () => validateUpdateRequest(new UpdateRequest('t', [{ skyflowId: '', data: { a: 1 } }])),
      SKYFLOW_ERROR_CODE.MISSING_SKYFLOW_ID_IN_UPDATE,
    );
    expectCode(
      () => validateUpdateRequest(new UpdateRequest('t', [{ skyflowId: 'i', data: null as unknown as Record<string, unknown> }])),
      SKYFLOW_ERROR_CODE.EMPTY_DATA_IN_UPDATE,
    );
  });

  it('does not throw on valid input', () => {
    expect(() => validateUpdateRequest(new UpdateRequest('t', [{ skyflowId: 'i', data: { a: 1 } }]))).not.toThrow();
  });

  it('treats a null record entry as a missing skyflowId', () => {
    expectCode(
      () => validateUpdateRequest(new UpdateRequest('t', [null as unknown as { skyflowId: string; data: Record<string, unknown> }])),
      SKYFLOW_ERROR_CODE.MISSING_SKYFLOW_ID_IN_UPDATE,
    );
  });
});

describe('validateDeleteRequest', () => {
  it('throws on invalid request / empty table / no ids nor uniqueValues', () => {
    expectCode(() => validateDeleteRequest({} as unknown as DeleteRequest), SKYFLOW_ERROR_CODE.INVALID_DELETE_REQUEST);
    expectCode(() => validateDeleteRequest(new DeleteRequest('', ['id'])), SKYFLOW_ERROR_CODE.EMPTY_TABLE_NAME);
    expectCode(() => validateDeleteRequest(new DeleteRequest('t', [])), SKYFLOW_ERROR_CODE.EMPTY_DELETE_IDS);
  });

  it('does not throw with ids or with uniqueValues', () => {
    expect(() => validateDeleteRequest(new DeleteRequest('t', ['id']))).not.toThrow();
    expect(() => validateDeleteRequest(new DeleteRequest('t', [], [{ email: 'a@b.com' }]))).not.toThrow();
  });
});

describe('validateQueryRequest', () => {
  it('throws on invalid request / empty query', () => {
    expectCode(() => validateQueryRequest({} as unknown as QueryRequest), SKYFLOW_ERROR_CODE.INVALID_QUERY_REQUEST);
    expectCode(() => validateQueryRequest(new QueryRequest('')), SKYFLOW_ERROR_CODE.EMPTY_QUERY);
  });

  it('does not throw on valid input', () => {
    expect(() => validateQueryRequest(new QueryRequest('SELECT 1'))).not.toThrow();
  });
});

describe('validateDetokenizeRequest', () => {
  it('throws on invalid request / empty tokens / empty token entry', () => {
    expectCode(() => validateDetokenizeRequest({} as unknown as DetokenizeRequest), SKYFLOW_ERROR_CODE.INVALID_DETOKENIZE_REQUEST);
    expectCode(() => validateDetokenizeRequest(new DetokenizeRequest([])), SKYFLOW_ERROR_CODE.EMPTY_TOKENS_IN_DETOKENIZE);
    expectCode(() => validateDetokenizeRequest(new DetokenizeRequest([''])), SKYFLOW_ERROR_CODE.EMPTY_TOKEN_IN_DETOKENIZE);
  });

  it('does not throw on valid input', () => {
    expect(() => validateDetokenizeRequest(new DetokenizeRequest(['tok']))).not.toThrow();
  });
});

describe('validateGetTokensRequest', () => {
  it('throws on invalid request / empty records / missing tokenGroupName', () => {
    expectCode(() => validateGetTokensRequest({} as unknown as GetTokensRequest), SKYFLOW_ERROR_CODE.INVALID_TOKENIZE_REQUEST);
    expectCode(() => validateGetTokensRequest(new GetTokensRequest([])), SKYFLOW_ERROR_CODE.EMPTY_VALUES_IN_TOKENIZE);
    expectCode(
      () => validateGetTokensRequest(new GetTokensRequest([{ value: 'v', tokenGroupName: '' }])),
      SKYFLOW_ERROR_CODE.EMPTY_COLUMN_GROUP_IN_TOKENIZE,
    );
  });

  it('does not throw on valid input', () => {
    expect(() => validateGetTokensRequest(new GetTokensRequest([{ value: 'v', tokenGroupName: 'g' }]))).not.toThrow();
  });

  it('treats a null record entry as a missing tokenGroupName', () => {
    expectCode(
      () => validateGetTokensRequest(new GetTokensRequest([null as unknown as { value: unknown; tokenGroupName: string }])),
      SKYFLOW_ERROR_CODE.EMPTY_COLUMN_GROUP_IN_TOKENIZE,
    );
  });
});

describe('validateUploadFilesRequest', () => {
  it('throws on invalid request / empty records', () => {
    expectCode(() => validateUploadFilesRequest({} as unknown as UploadFilesRequest), SKYFLOW_ERROR_CODE.INVALID_FILE_UPLOAD_REQUEST);
    expectCode(() => validateUploadFilesRequest(new UploadFilesRequest([])), SKYFLOW_ERROR_CODE.INVALID_FILE_UPLOAD_REQUEST);
  });

  it('throws on missing table / columns / column name', () => {
    expectCode(
      () => validateUploadFilesRequest(new UploadFilesRequest([{ tableName: '', columns: [{ column: 'c', base64: 'x', fileName: 'f.pdf' }] }])),
      SKYFLOW_ERROR_CODE.MISSING_TABLE_IN_UPLOAD_FILE,
    );
    expectCode(
      () => validateUploadFilesRequest(new UploadFilesRequest([{ tableName: 't', columns: [] }])),
      SKYFLOW_ERROR_CODE.MISSING_COLUMN_NAME_IN_UPLOAD_FILE,
    );
    expectCode(
      () => validateUploadFilesRequest(new UploadFilesRequest([{ tableName: 't', columns: [{ column: '', base64: 'x', fileName: 'f.pdf' }] }])),
      SKYFLOW_ERROR_CODE.MISSING_COLUMN_NAME_IN_UPLOAD_FILE,
    );
  });

  it('throws unless exactly one of filePath/base64/file is provided', () => {
    expectCode(
      () => validateUploadFilesRequest(new UploadFilesRequest([{ tableName: 't', columns: [{ column: 'c' }] }])),
      SKYFLOW_ERROR_CODE.MISSING_FILE_SOURCE_IN_UPLOAD_FILE,
    );
    expectCode(
      () => validateUploadFilesRequest(new UploadFilesRequest([{ tableName: 't', columns: [{ column: 'c', base64: 'x', filePath: '/p', fileName: 'f.pdf' }] }])),
      SKYFLOW_ERROR_CODE.MISSING_FILE_SOURCE_IN_UPLOAD_FILE,
    );
  });

  it('throws when base64 is provided without a fileName', () => {
    expectCode(
      () => validateUploadFilesRequest(new UploadFilesRequest([{ tableName: 't', columns: [{ column: 'c', base64: 'x' }] }])),
      SKYFLOW_ERROR_CODE.MISSING_FILE_NAME_FOR_BASE64,
    );
  });

  it('treats a null record entry as a missing table', () => {
    expectCode(
      () => validateUploadFilesRequest(new UploadFilesRequest([null as unknown as { tableName: string; columns: [] }])),
      SKYFLOW_ERROR_CODE.MISSING_TABLE_IN_UPLOAD_FILE,
    );
  });

  it('does not throw for valid base64 / filePath / file sources', () => {
    const fakeFile = { name: 'f.pdf', arrayBuffer: async () => new ArrayBuffer(0) } as unknown as File;
    expect(() => validateUploadFilesRequest(new UploadFilesRequest([{ tableName: 't', columns: [{ column: 'c', base64: 'x', fileName: 'f.pdf' }] }]))).not.toThrow();
    expect(() => validateUploadFilesRequest(new UploadFilesRequest([{ tableName: 't', columns: [{ column: 'c', filePath: '/p/x.png' }] }]))).not.toThrow();
    expect(() => validateUploadFilesRequest(new UploadFilesRequest([{ tableName: 't', columns: [{ column: 'c', file: fakeFile }] }]))).not.toThrow();
  });
});

describe('validateDeleteFilesRequest', () => {
  it('throws on invalid request / empty records / missing table / missing columns', () => {
    expectCode(() => validateDeleteFilesRequest({} as unknown as DeleteFilesRequest), SKYFLOW_ERROR_CODE.INVALID_FILE_UPLOAD_REQUEST);
    expectCode(() => validateDeleteFilesRequest(new DeleteFilesRequest([])), SKYFLOW_ERROR_CODE.INVALID_FILE_UPLOAD_REQUEST);
    expectCode(
      () => validateDeleteFilesRequest(new DeleteFilesRequest([{ tableName: '', columns: ['c'], skyflowId: 'i' }])),
      SKYFLOW_ERROR_CODE.MISSING_TABLE_IN_UPLOAD_FILE,
    );
    expectCode(
      () => validateDeleteFilesRequest(new DeleteFilesRequest([{ tableName: 't', columns: [], skyflowId: 'i' }])),
      SKYFLOW_ERROR_CODE.MISSING_COLUMN_NAME_IN_UPLOAD_FILE,
    );
  });

  it('requires exactly one of skyflowId / uniqueValues', () => {
    expectCode(
      () => validateDeleteFilesRequest(new DeleteFilesRequest([{ tableName: 't', columns: ['c'] }])),
      SKYFLOW_ERROR_CODE.MISSING_SKYFLOW_ID_IN_UPLOAD_FILE,
    );
    expectCode(
      () => validateDeleteFilesRequest(new DeleteFilesRequest([{ tableName: 't', columns: ['c'], skyflowId: 'i', uniqueValues: [{ a: 1 }] }])),
      SKYFLOW_ERROR_CODE.MISSING_SKYFLOW_ID_IN_UPLOAD_FILE,
    );
  });

  it('treats a null record entry as a missing table', () => {
    expectCode(
      () => validateDeleteFilesRequest(new DeleteFilesRequest([null as unknown as { tableName: string; columns: string[] }])),
      SKYFLOW_ERROR_CODE.MISSING_TABLE_IN_UPLOAD_FILE,
    );
  });

  it('does not throw with skyflowId only or uniqueValues only', () => {
    expect(() => validateDeleteFilesRequest(new DeleteFilesRequest([{ tableName: 't', columns: ['c'], skyflowId: 'i' }]))).not.toThrow();
    expect(() => validateDeleteFilesRequest(new DeleteFilesRequest([{ tableName: 't', columns: ['c'], uniqueValues: [{ a: 1 }] }]))).not.toThrow();
  });
});
