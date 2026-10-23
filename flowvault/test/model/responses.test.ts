import {
  InsertResponse,
  GetResponse,
  UpdateResponse,
  DeleteResponse,
  QueryResponse,
  DetokenizeResponse,
  GetTokensResponse,
  UploadFilesResponse,
  DeleteFilesResponse,
} from '../../src';

describe('FlowVault response models', () => {
  it('InsertResponse holds its records', () => {
    const records = [
      { tableName: 'cards', skyflowId: 'id1', tokens: { card_number: 'tok' }, data: null, hashedData: null, httpCode: 200, error: null },
    ];
    const resp = new InsertResponse({ records });
    expect(resp.records).toBe(records);
    expect(resp.records[0].skyflowId).toBe('id1');
  });

  it('GetResponse holds its records', () => {
    const records = [
      { skyflowId: 'id1', tableName: 'cards', data: { name: 'a' }, hashedData: null, tokens: null, httpCode: 200, error: null },
    ];
    const resp = new GetResponse({ records });
    expect(resp.records[0].data).toEqual({ name: 'a' });
  });

  it('UpdateResponse holds its records', () => {
    const records = [
      { skyflowId: 'id1', tableName: 'cards', tokens: { x: 1 }, data: null, hashedData: null, httpCode: 200, error: null },
    ];
    const resp = new UpdateResponse({ records });
    expect(resp.records[0].tokens).toEqual({ x: 1 });
  });

  it('DeleteResponse holds its records (no tableName field)', () => {
    const records = [{ skyflowId: 'id1', httpCode: 200, error: null }];
    const resp = new DeleteResponse({ records });
    expect(resp.records[0].skyflowId).toBe('id1');
    expect((resp.records[0] as Record<string, unknown>).tableName).toBeUndefined();
  });

  it('DetokenizeResponse holds its records', () => {
    const records = [
      { token: 'tok1', tokenGroupName: 'cards', value: '4111', metadata: { skyflowId: 'id1', tableName: 'cards' }, httpCode: 200, error: null },
    ];
    const resp = new DetokenizeResponse({ records });
    expect(resp.records[0].value).toBe('4111');
    expect(resp.records[0].metadata).toEqual({ skyflowId: 'id1', tableName: 'cards' });
  });

  it('GetTokensResponse holds its records', () => {
    const records = [{ value: '4111', tokenGroupName: 'cards', token: 'tok', httpCode: 200, error: null }];
    const resp = new GetTokensResponse({ records });
    expect(resp.records[0].token).toBe('tok');
  });

  it('UploadFilesResponse holds its records', () => {
    const records = [
      { skyflowId: 'id1', tableName: 't', columns: [{ column: 'resume', fileName: 'r.pdf', uploadStatus: 'UPLOADED' as const }], httpCode: 200, error: null },
    ];
    const resp = new UploadFilesResponse({ records });
    expect(resp.records[0].columns[0].uploadStatus).toBe('UPLOADED');
  });

  it('DeleteFilesResponse holds its records', () => {
    const records = [
      { skyflowId: 'id1', tableName: 't', columns: [{ column: 'resume', status: 'DELETED' }], httpCode: 200, error: null },
    ];
    const resp = new DeleteFilesResponse({ records });
    expect(resp.records[0].columns?.[0].status).toBe('DELETED');
  });

  it('QueryResponse holds fields/errors/metadata/requestId', () => {
    const resp = new QueryResponse({
      fields: [{ name: 'alice' }, { name: 'bob' }],
      errors: null,
      metadata: { columns: ['name'] },
      requestId: 'req-1',
    });
    expect(resp.fields).toEqual([{ name: 'alice' }, { name: 'bob' }]);
    expect(resp.errors).toBeNull();
    expect(resp.metadata.columns).toEqual(['name']);
    expect(resp.requestId).toBe('req-1');
  });
});
