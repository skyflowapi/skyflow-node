import {
  Skyflow,
  InsertRequest,
  InsertOptions,
  InsertResponse,
  GetRequest,
  GetOptions,
  UpdateRequest,
  DeleteRequest,
  QueryRequest,
  QueryResponse,
  DetokenizeRequest,
  DetokenizeResponse,
  GetTokensRequest,
  UploadFilesRequest,
  UploadFilesResponse,
  DeleteFilesRequest,
  Env,
  LogLevel,
} from '../src';
import VaultController from '../src/controller/vault';

// A rawResponse stub whose headers carry an x-request-id.
const rawResponse = { headers: new Map([['x-request-id', 'req-abc-123']]) };

// Builds a fake VaultClient exposing only what the controller touches.
function makeFakeClient(overrides: Record<string, unknown>) {
  return {
    vaultId: 'vault123',
    getLogLevel: () => LogLevel.ERROR,
    getToken: jest.fn().mockResolvedValue(undefined),
    failureResponse: (e: unknown) => (e instanceof Error ? e : new Error(String(e))),
    ...overrides,
  };
}

function resourceMethod(data: unknown) {
  return jest.fn().mockReturnValue({
    withRawResponse: () => Promise.resolve({ data, rawResponse }),
  });
}

describe('FlowVault model classes', () => {
  it('construct request classes with their fields', () => {
    const insertReq = new InsertRequest('cards', [{ data: { card_number: '4111' } }]);
    expect(insertReq.tableName).toBe('cards');
    expect(insertReq.records).toHaveLength(1);

    const getReq = new GetRequest('cards', ['id1', 'id2']);
    expect(getReq.table).toBe('cards');
    expect(getReq.ids).toEqual(['id1', 'id2']);

    const updateReq = new UpdateRequest('cards', [{ skyflowId: 'id1', data: { x: 1 } }]);
    expect(updateReq.records[0].skyflowId).toBe('id1');

    const deleteReq = new DeleteRequest('cards', ['id1']);
    expect(deleteReq.ids).toEqual(['id1']);

    const queryReq = new QueryRequest('SELECT * FROM cards');
    expect(queryReq.query).toContain('SELECT');

    const detokenizeReq = new DetokenizeRequest(['tok1', 'tok2']);
    expect(detokenizeReq.tokens).toHaveLength(2);

    const getTokensReq = new GetTokensRequest([{ value: '4111', tokenGroupName: 'cards' }]);
    expect(getTokensReq.records[0].tokenGroupName).toBe('cards');

    const uploadReq = new UploadFilesRequest([
      { tableName: 'onboarding', columns: [{ column: 'resume', base64: 'aGk=', fileName: 'r.pdf' }] },
    ]);
    expect(uploadReq.records[0].tableName).toBe('onboarding');

    const deleteFilesReq = new DeleteFilesRequest([
      { tableName: 'onboarding', columns: ['resume'], skyflowId: 'id1' },
    ]);
    expect(deleteFilesReq.records[0].columns).toEqual(['resume']);
  });

  it('construct options classes via setters/getters', () => {
    const insertOptions = new InsertOptions();
    insertOptions.setUpsert({ updateType: 'UPDATE', uniqueColumns: ['email'] });
    expect(insertOptions.getUpsert()).toEqual({ updateType: 'UPDATE', uniqueColumns: ['email'] });

    const getOptions = new GetOptions();
    getOptions.setFields(['name']);
    getOptions.setLimit(10);
    getOptions.setOffset(2);
    expect(getOptions.getFields()).toEqual(['name']);
    expect(getOptions.getLimit()).toBe(10);
    expect(getOptions.getOffset()).toBe(2);
  });
});

describe('Skyflow facade', () => {
  it('builds a client from a dummy config and returns a VaultController', () => {
    const client = new Skyflow({
      vaultConfigs: [
        {
          vaultId: 'vault123',
          clusterId: 'abc-cluster',
          env: Env.PROD,
          credentials: { apiKey: 'sky-dummy-key' },
        },
      ],
      logLevel: LogLevel.ERROR,
    });
    expect(client.vault('vault123')).toBeInstanceOf(VaultController);
    // No id defaults to the first configured vault.
    expect(client.vault()).toBeInstanceOf(VaultController);
    expect(client.getVaultConfig('vault123').vaultId).toBe('vault123');
  });
});

describe('VaultController maps generated responses', () => {
  it('insert maps records to InsertResponse', async () => {
    const insertRecords = resourceMethod({
      records: [{ skyflowID: 'id1', tokens: { card_number: 'tok_1' }, httpCode: 200, tableName: 'cards' }],
    });
    const controller = new VaultController(
      makeFakeClient({ records: { insertRecords } }) as any,
    );

    const resp = await controller.insert(new InsertRequest('cards', [{ data: { card_number: '4111' } }]));
    expect(resp).toBeInstanceOf(InsertResponse);
    expect(insertRecords).toHaveBeenCalledTimes(1);
    expect(resp.records[0].skyflowId).toBe('id1');
    expect(resp.records[0].fields).toEqual({ card_number: 'tok_1' });
    expect(resp.records[0].tableName).toBe('cards');
    expect(resp.records[0].httpCode).toBe(200);
    expect(resp.records[0].error).toBeNull();
    expect(resp.records[0].requestId).toBeUndefined();
  });

  it('insert attaches requestId when a record has an error', async () => {
    const insertRecords = resourceMethod({
      records: [{ httpCode: 400, error: 'bad record' }],
    });
    const controller = new VaultController(
      makeFakeClient({ records: { insertRecords } }) as any,
    );
    const resp = await controller.insert(new InsertRequest('cards', [{ data: { card_number: '4111' } }]));
    expect(resp.records[0].error).toBe('bad record');
    expect(resp.records[0].requestId).toBe('req-abc-123');
  });

  it('detokenize maps the generated `response` array to DetokenizeResponse', async () => {
    const detokenize = resourceMethod({
      response: [
        {
          token: 'tok1',
          value: '4111',
          tokenGroupName: 'cards',
          httpCode: 200,
          metadata: { skyflowID: 'id1', tableName: 'cards' },
        },
      ],
    });
    const controller = new VaultController(
      makeFakeClient({ tokens: { detokenize } }) as any,
    );

    const resp = await controller.detokenize(new DetokenizeRequest(['tok1']));
    expect(resp).toBeInstanceOf(DetokenizeResponse);
    expect(resp.records[0].token).toBe('tok1');
    expect(resp.records[0].value).toBe('4111');
    expect(resp.records[0].tokenGroupName).toBe('cards');
    expect(resp.records[0].metadata).toEqual({ skyflowId: 'id1', tableName: 'cards' });
    expect(resp.records[0].httpCode).toBe(200);
  });

  it('query maps records, metadata and requestId to QueryResponse', async () => {
    const executeQuery = resourceMethod({
      records: [{ data: { name: 'alice' } }, { data: { name: 'bob' } }],
      metadata: { columns: ['name'] },
    });
    const controller = new VaultController(
      makeFakeClient({ query: { executeQuery } }) as any,
    );

    const resp = await controller.query(new QueryRequest('SELECT name FROM cards'));
    expect(resp).toBeInstanceOf(QueryResponse);
    expect(resp.fields).toEqual([{ name: 'alice' }, { name: 'bob' }]);
    expect(resp.metadata.columns).toEqual(['name']);
    expect(resp.errors).toBeNull();
    expect(resp.requestId).toBe('req-abc-123');
  });

  it('uploadFiles performs the two-phase upload and maps UploadFilesResponse', async () => {
    const originalFetch = (global as any).fetch;
    const fetchMock = jest.fn().mockResolvedValue({ ok: true, status: 200 });
    (global as any).fetch = fetchMock;
    try {
      const uploadFiles = resourceMethod({
        records: [
          {
            skyflowID: 'id1',
            tableName: 'onboarding',
            data: { resume: 'https://signed.example/upload/resume' },
            httpCode: 200,
          },
        ],
      });
      const controller = new VaultController(
        makeFakeClient({ files: { uploadFiles } }) as any,
      );

      const req = new UploadFilesRequest([
        {
          tableName: 'onboarding',
          columns: [{ column: 'resume', base64: Buffer.from('hello').toString('base64'), fileName: 'resume.pdf' }],
        },
      ]);
      const resp = await controller.uploadFiles(req);
      expect(resp).toBeInstanceOf(UploadFilesResponse);
      expect(uploadFiles).toHaveBeenCalledTimes(1);
      // Phase B: a signed-URL PUT with no Authorization header.
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe('https://signed.example/upload/resume');
      expect(init.method).toBe('PUT');
      expect(init.headers.Authorization).toBeUndefined();
      expect(init.headers['Content-Type']).toBe('application/pdf');

      expect(resp.records[0].skyflowId).toBe('id1');
      expect(resp.records[0].columns[0].column).toBe('resume');
      expect(resp.records[0].columns[0].uploadStatus).toBe('UPLOADED');
      expect(resp.records[0].columns[0].fileName).toBe('resume.pdf');
    } finally {
      (global as any).fetch = originalFetch;
    }
  });
});
