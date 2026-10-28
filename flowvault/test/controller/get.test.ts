import { GetRequest, GetOptions, GetResponse } from '../../src';
import VaultController from '../../src/controller/vault';
import { makeFakeClient, resourceMethod, rejectingMethod, REQUEST_ID, silenceConsole } from '../helpers';

silenceConsole();

describe('VaultController.get', () => {
  it('single-table: builds tableName/skyflowIDs and maps records', async () => {
    const getRecords = resourceMethod({
      records: [
        {
          skyflowID: 'id1',
          tableName: 'cards',
          data: { name: 'alice' },
          hashedData: { name: 'h' },
          tokens: { name: [{ token: 'tok', tokenGroupName: 'deterministic_string' }] },
          httpCode: 200,
        },
      ],
    });
    const controller = new VaultController(makeFakeClient({ records: { getRecords } }));

    const resp = await controller.get(new GetRequest('cards', ['id1', 'id2']));

    expect(resp).toBeInstanceOf(GetResponse);
    expect(getRecords).toHaveBeenCalledTimes(1);
    const [genReq] = getRecords.mock.calls[0];
    expect(genReq.vaultID).toBe('vault123');
    expect(genReq.tableName).toBe('cards');
    expect(genReq.skyflowIDs).toEqual(['id1', 'id2']);
    expect(genReq.records).toBeUndefined();

    const record = resp.records[0];
    expect(record.skyflowId).toBe('id1');
    expect(record.data).toEqual({ name: 'alice' });
    expect(record.hashedData).toEqual({ name: 'h' });
    expect(record.tokens).toEqual({ name: [{ token: 'tok', tokenGroupName: 'deterministic_string' }] });
    expect(record.httpCode).toBe(200);
    expect(record.error).toBeNull();
    expect(record.requestId).toBeUndefined();
  });

  it('multi-table: builds the records[] array from request.records', async () => {
    const getRecords = resourceMethod({ records: [] });
    const controller = new VaultController(makeFakeClient({ records: { getRecords } }));

    const req = new GetRequest('', [], [
      { tableName: 't1', ids: ['a', 'b'] },
      { tableName: 't2', ids: ['c'] },
    ]);
    await controller.get(req);

    const [genReq] = getRecords.mock.calls[0];
    expect(genReq.records).toEqual([
      { tableName: 't1', skyflowIDs: ['a', 'b'] },
      { tableName: 't2', skyflowIDs: ['c'] },
    ]);
    expect(genReq.tableName).toBeUndefined();
    expect(genReq.skyflowIDs).toBeUndefined();
  });

  it('multi-table: carries per-record columns / columnRedactions / uniqueValues', async () => {
    const getRecords = resourceMethod({ records: [] });
    const controller = new VaultController(makeFakeClient({ records: { getRecords } }));

    const req = new GetRequest('', [], [
      {
        tableName: 't1',
        ids: ['a'],
        columns: ['name'],
        columnRedactions: [{ columnName: 'ssn', redaction: 'MASKED' }],
        uniqueValues: [{ email: 'x@y.com' }],
      },
      { tableName: 't2', ids: ['b'] }, // no per-record fields -> only tableName/skyflowIDs
    ]);
    await controller.get(req);

    const [genReq] = getRecords.mock.calls[0];
    expect(genReq.records[0]).toEqual({
      tableName: 't1',
      skyflowIDs: ['a'],
      columns: ['name'],
      columnRedactions: [{ columnName: 'ssn', redaction: 'MASKED' }],
      uniqueValues: [{ data: { email: 'x@y.com' } }],
    });
    expect(genReq.records[1]).toEqual({ tableName: 't2', skyflowIDs: ['b'] });
  });

  it('maps options: columns, columnRedactions, uniqueValues->{data}, limit, offset', async () => {
    const getRecords = resourceMethod({ records: [] });
    const controller = new VaultController(makeFakeClient({ records: { getRecords } }));

    const options = new GetOptions();
    options.setFields(['name', 'email']);
    options.setColumnRedactions([{ columnName: 'ssn', redaction: 'MASKED' }]);
    options.setUniqueValues([{ email: 'a@b.com' }, { email: 'c@d.com' }]);
    options.setLimit(5);
    options.setOffset(1);

    await controller.get(new GetRequest('cards', ['id1']), options);

    const [genReq] = getRecords.mock.calls[0];
    expect(genReq.columns).toEqual(['name', 'email']);
    expect(genReq.columnRedactions).toEqual([{ columnName: 'ssn', redaction: 'MASKED' }]);
    expect(genReq.uniqueValues).toEqual([{ data: { email: 'a@b.com' } }, { data: { email: 'c@d.com' } }]);
    expect(genReq.limit).toBe(5);
    expect(genReq.offset).toBe(1);
  });

  it('honors limit/offset of 0 (uses !== undefined guard)', async () => {
    const getRecords = resourceMethod({ records: [] });
    const controller = new VaultController(makeFakeClient({ records: { getRecords } }));

    const options = new GetOptions();
    options.setLimit(0);
    options.setOffset(0);
    await controller.get(new GetRequest('cards', ['id1']), options);

    const [genReq] = getRecords.mock.calls[0];
    expect(genReq.limit).toBe(0);
    expect(genReq.offset).toBe(0);
  });

  it('per-record error gets requestId from the header', async () => {
    const getRecords = resourceMethod({ records: [{ httpCode: 404, error: 'not found' }] });
    const controller = new VaultController(makeFakeClient({ records: { getRecords } }));
    const resp = await controller.get(new GetRequest('cards', ['id1']));
    expect(resp.records[0].error).toBe('not found');
    expect(resp.records[0].requestId).toBe(REQUEST_ID);
  });

  it('returns an empty records array when the response has none', async () => {
    const getRecords = resourceMethod({});
    const controller = new VaultController(makeFakeClient({ records: { getRecords } }));
    const resp = await controller.get(new GetRequest('cards', ['id1']));
    expect(resp.records).toEqual([]);
  });

  it('sets requestId to null on an errored record when the raw response is absent', async () => {
    // rawResponse null -> getRequestId short-circuits -> requestId falls back to null.
    const getRecords = resourceMethod({ records: [{ httpCode: 404, error: 'not found' }] }, null);
    const controller = new VaultController(makeFakeClient({ records: { getRecords } }));
    const resp = await controller.get(new GetRequest('cards', ['id1']));
    expect(resp.records[0].error).toBe('not found');
    expect(resp.records[0].requestId).toBeNull();
  });

  it('rejects when the generated method throws', async () => {
    const getRecords = rejectingMethod(new Error('boom-get'));
    const controller = new VaultController(makeFakeClient({ records: { getRecords } }));
    await expect(controller.get(new GetRequest('cards', ['id1']))).rejects.toThrow('boom-get');
  });
});
