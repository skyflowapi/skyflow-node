import {
  InsertRequest,
  GetRequest,
  UpdateRequest,
  DeleteRequest,
  QueryRequest,
  DetokenizeRequest,
  GetTokensRequest,
  UploadFilesRequest,
  DeleteFilesRequest,
} from '../../src';

describe('FlowVault request models', () => {
  it('InsertRequest: ctor, getters and setters round-trip', () => {
    const req = new InsertRequest('cards', [{ data: { card_number: '4111' } }]);
    expect(req.tableName).toBe('cards');
    expect(req.records).toEqual([{ data: { card_number: '4111' } }]);

    req.tableName = 'people';
    req.records = [{ data: { ssn: '123' }, tokens: { ssn: 'tok' } }];
    expect(req.tableName).toBe('people');
    expect(req.records[0].tokens).toEqual({ ssn: 'tok' });
  });

  it('GetRequest: ctor, getters and setters (table/ids/records)', () => {
    const req = new GetRequest('cards', ['id1', 'id2']);
    expect(req.table).toBe('cards');
    expect(req.ids).toEqual(['id1', 'id2']);
    expect(req.records).toBeUndefined();

    req.table = 'people';
    req.ids = ['id3'];
    req.records = [{ tableName: 't2', ids: ['a', 'b'] }];
    expect(req.table).toBe('people');
    expect(req.ids).toEqual(['id3']);
    expect(req.records).toEqual([{ tableName: 't2', ids: ['a', 'b'] }]);

    // Multi-table via ctor third arg.
    const multi = new GetRequest('', [], [{ tableName: 't', ids: ['x'] }]);
    expect(multi.records).toEqual([{ tableName: 't', ids: ['x'] }]);
  });

  it('UpdateRequest: ctor, getters and setters', () => {
    const req = new UpdateRequest('cards', [{ skyflowId: 'id1', data: { x: 1 } }]);
    expect(req.tableName).toBe('cards');
    expect(req.records[0].skyflowId).toBe('id1');

    req.tableName = 'people';
    req.records = [{ skyflowId: 'id2', data: { y: 2 }, tokens: { y: 'tok' } }];
    expect(req.tableName).toBe('people');
    expect(req.records[0].tokens).toEqual({ y: 'tok' });
  });

  it('DeleteRequest: ctor, getters and setters (ids + uniqueValues)', () => {
    const req = new DeleteRequest('cards', ['id1']);
    expect(req.table).toBe('cards');
    expect(req.ids).toEqual(['id1']);
    expect(req.uniqueValues).toBeUndefined();

    req.table = 'people';
    req.ids = ['id2', 'id3'];
    req.uniqueValues = [{ email: 'a@b.com' }];
    expect(req.table).toBe('people');
    expect(req.ids).toEqual(['id2', 'id3']);
    expect(req.uniqueValues).toEqual([{ email: 'a@b.com' }]);

    const withUnique = new DeleteRequest('t', [], [{ ssn: '111' }]);
    expect(withUnique.uniqueValues).toEqual([{ ssn: '111' }]);
  });

  it('QueryRequest: ctor, getter and setter', () => {
    const req = new QueryRequest('SELECT * FROM cards');
    expect(req.query).toBe('SELECT * FROM cards');
    req.query = 'SELECT name FROM cards';
    expect(req.query).toBe('SELECT name FROM cards');
  });

  it('DetokenizeRequest: ctor, getters and setters (tokens + redactions)', () => {
    const req = new DetokenizeRequest(['tok1', 'tok2']);
    expect(req.tokens).toEqual(['tok1', 'tok2']);
    expect(req.tokenGroupRedactions).toBeUndefined();

    req.tokens = ['tok3'];
    req.tokenGroupRedactions = [{ tokenGroupName: 'g', redaction: 'MASKED' }];
    expect(req.tokens).toEqual(['tok3']);
    expect(req.tokenGroupRedactions).toEqual([{ tokenGroupName: 'g', redaction: 'MASKED' }]);

    const withRedaction = new DetokenizeRequest(['t'], [{ tokenGroupName: 'cards', redaction: 'PLAIN_TEXT' }]);
    expect(withRedaction.tokenGroupRedactions?.[0].tokenGroupName).toBe('cards');
  });

  it('GetTokensRequest: ctor, getter and setter', () => {
    const req = new GetTokensRequest([{ value: '4111', tokenGroupName: 'cards' }]);
    expect(req.records[0].value).toBe('4111');
    expect(req.records[0].tokenGroupName).toBe('cards');

    req.records = [{ value: '5555', tokenGroupName: 'cvv' }];
    expect(req.records[0].value).toBe('5555');
  });

  it('UploadFilesRequest: ctor, getter and setter', () => {
    const req = new UploadFilesRequest([
      { tableName: 'onboarding', columns: [{ column: 'resume', base64: 'aGk=', fileName: 'r.pdf' }] },
    ]);
    expect(req.records[0].tableName).toBe('onboarding');
    expect(req.records[0].columns[0].column).toBe('resume');

    req.records = [{ tableName: 't', skyflowId: 'id1', columns: [{ column: 'c', filePath: '/p/x.png' }] }];
    expect(req.records[0].skyflowId).toBe('id1');
    expect(req.records[0].columns[0].filePath).toBe('/p/x.png');
  });

  it('DeleteFilesRequest: ctor, getter and setter', () => {
    const req = new DeleteFilesRequest([
      { tableName: 'onboarding', columns: ['resume'], skyflowId: 'id1' },
    ]);
    expect(req.records[0].columns).toEqual(['resume']);
    expect(req.records[0].skyflowId).toBe('id1');

    req.records = [{ tableName: 't', columns: ['c'], uniqueValues: [{ a: 1 }] }];
    expect(req.records[0].uniqueValues).toEqual([{ a: 1 }]);
  });
});
