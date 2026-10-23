import { InsertRequest, InsertOptions, InsertResponse } from '../../src';
import VaultController from '../../src/controller/vault';
import {
  makeFakeClient,
  resourceMethod,
  rejectingMethod,
  rawResponseNoHeaders,
  REQUEST_ID,
  silenceConsole,
} from '../helpers';

silenceConsole();

describe('VaultController.insert', () => {
  it('maps records, calls the generated method once, and builds the request', async () => {
    const insertRecords = resourceMethod({
      records: [
        {
          skyflowID: 'id1',
          tokens: { card_number: 'tok_1' },
          hashedData: { card_number: 'hash_1' },
          httpCode: 200,
          tableName: 'cards',
        },
      ],
    });
    const controller = new VaultController(makeFakeClient({ records: { insertRecords } }));

    const req = new InsertRequest('cards', [{ data: { card_number: '4111' }, tokens: { card_number: 'byot_1' } }]);
    const options = new InsertOptions();
    options.setUpsert({ updateType: 'UPDATE', uniqueColumns: ['card_number'] });

    const resp = await controller.insert(req, options);

    expect(resp).toBeInstanceOf(InsertResponse);
    expect(insertRecords).toHaveBeenCalledTimes(1);

    // Request built correctly (vaultID, tableName, BYOT tokens, upsert).
    const [genReq, opts] = insertRecords.mock.calls[0];
    expect(genReq.vaultID).toBe('vault123');
    expect(genReq.tableName).toBe('cards');
    expect(genReq.records).toEqual([{ data: { card_number: '4111' }, tokens: { card_number: 'byot_1' } }]);
    expect(genReq.upsert).toEqual({ updateType: 'UPDATE', uniqueColumns: ['card_number'] });
    expect(opts.headers).toBeDefined();

    // Response mapped field-by-field.
    const record = resp.records[0];
    expect(record.skyflowId).toBe('id1');
    expect(record.tokens).toEqual({ card_number: 'tok_1' });
    expect(record.data).toBeNull();
    expect(record.hashedData).toEqual({ card_number: 'hash_1' });
    expect(record.tableName).toBe('cards');
    expect(record.httpCode).toBe(200);
    expect(record.error).toBeNull();
    expect(record.requestId).toBeUndefined();
  });

  it('omits BYOT tokens and upsert when not provided; fields fall back to data', async () => {
    const insertRecords = resourceMethod({
      records: [{ skyflowID: 'id1', data: { card_number: '4111' }, httpCode: 200 }],
    });
    const controller = new VaultController(makeFakeClient({ records: { insertRecords } }));

    const resp = await controller.insert(new InsertRequest('cards', [{ data: { card_number: '4111' } }]));

    const [genReq] = insertRecords.mock.calls[0];
    expect(genReq.records[0]).toEqual({ data: { card_number: '4111' } });
    expect(genReq.records[0].tokens).toBeUndefined();
    expect(genReq.upsert).toBeUndefined();
    expect(resp.records[0].data).toEqual({ card_number: '4111' }); // data used when no tokens
    expect(resp.records[0].tokens).toBeNull();
  });

  it('sends a per-record tableName when records carry their own table (multi-table insert)', async () => {
    const insertRecords = resourceMethod({ records: [] });
    const controller = new VaultController(makeFakeClient({ records: { insertRecords } }));

    await controller.insert(new InsertRequest('cards', [
      { data: { a: 1 }, table: 'cards' },
      { data: { b: 2 }, table: 'contacts' },
    ]));

    const [genReq] = insertRecords.mock.calls[0];
    expect(genReq.tableName).toBeUndefined(); // table lives per-record, not at request level
    expect(genReq.records).toEqual([
      { data: { a: 1 }, tableName: 'cards' },
      { data: { b: 2 }, tableName: 'contacts' },
    ]);
  });

  it('falls back to the request table for a record with no table of its own', async () => {
    const insertRecords = resourceMethod({ records: [] });
    const controller = new VaultController(makeFakeClient({ records: { insertRecords } }));

    await controller.insert(new InsertRequest('cards', [
      { data: { a: 1 }, table: 'contacts' },
      { data: { b: 2 } }, // no per-record table -> request table 'cards'
    ]));

    const [genReq] = insertRecords.mock.calls[0];
    expect(genReq.tableName).toBeUndefined();
    expect(genReq.records).toEqual([
      { data: { a: 1 }, tableName: 'contacts' },
      { data: { b: 2 }, tableName: 'cards' },
    ]);
  });

  it('sends per-record upsert when records carry it and drops the request-level upsert', async () => {
    const insertRecords = resourceMethod({ records: [] });
    const controller = new VaultController(makeFakeClient({ records: { insertRecords } }));

    const options = new InsertOptions();
    options.setUpsert({ updateType: 'UPDATE', uniqueColumns: ['req'] }); // request-level — used as fallback

    await controller.insert(
      new InsertRequest('cards', [
        { data: { a: 1 }, upsert: { updateType: 'UPDATE', uniqueColumns: ['email'] } },
        { data: { b: 2 } }, // no per-record upsert -> falls back to the request-level one
      ]),
      options,
    );

    const [genReq] = insertRecords.mock.calls[0];
    expect(genReq.upsert).toBeUndefined(); // request-level dropped once any record has its own
    expect(genReq.records[0].upsert).toEqual({ updateType: 'UPDATE', uniqueColumns: ['email'] });
    expect(genReq.records[1].upsert).toEqual({ updateType: 'UPDATE', uniqueColumns: ['req'] });
  });

  it('populates error + requestId (from header) on a per-record error', async () => {
    const insertRecords = resourceMethod({ records: [{ httpCode: 400, error: 'bad record' }] });
    const controller = new VaultController(makeFakeClient({ records: { insertRecords } }));

    const resp = await controller.insert(new InsertRequest('cards', [{ data: { card_number: '4111' } }]));

    expect(resp.records[0].error).toBe('bad record');
    expect(resp.records[0].requestId).toBe(REQUEST_ID);
    expect(resp.records[0].skyflowId).toBeNull();
    expect(resp.records[0].tokens).toBeNull();
    expect(resp.records[0].data).toBeNull();
  });

  it('sets requestId to null on an errored record when the raw response has no headers', async () => {
    const insertRecords = resourceMethod({ records: [{ httpCode: 400, error: 'bad' }] }, rawResponseNoHeaders);
    const controller = new VaultController(makeFakeClient({ records: { insertRecords } }));
    const resp = await controller.insert(new InsertRequest('cards', [{ data: { a: 1 } }]));
    expect(resp.records[0].error).toBe('bad');
    expect(resp.records[0].requestId).toBeNull();
  });

  it('returns an empty records array when the response has none', async () => {
    const insertRecords = resourceMethod({});
    const controller = new VaultController(makeFakeClient({ records: { insertRecords } }));
    const resp = await controller.insert(new InsertRequest('cards', [{ data: { a: 1 } }]));
    expect(resp.records).toEqual([]);
  });

  it('rejects (via failureResponse) when the generated method throws', async () => {
    const insertRecords = rejectingMethod(new Error('network down'));
    const controller = new VaultController(makeFakeClient({ records: { insertRecords } }));
    await expect(
      controller.insert(new InsertRequest('cards', [{ data: { a: 1 } }])),
    ).rejects.toThrow('network down');
  });

  it('rejects on invalid input before calling the generated method', async () => {
    const insertRecords = resourceMethod({ records: [] });
    const controller = new VaultController(makeFakeClient({ records: { insertRecords } }));
    await expect(controller.insert(new InsertRequest('', [{ data: { a: 1 } }]))).rejects.toBeDefined();
    expect(insertRecords).not.toHaveBeenCalled();
  });
});
