import { UpdateRequest, UpdateResponse } from '../../src';
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

describe('VaultController.update', () => {
  it('builds skyflowID/data(+BYOT tokens) records and maps the response', async () => {
    const updateRecords = resourceMethod({
      records: [{ skyflowID: 'id1', tokens: { x: 'tok' }, hashedData: { x: 'h' }, tableName: 'cards', httpCode: 200 }],
    });
    const controller = new VaultController(makeFakeClient({ records: { updateRecords } }));

    const req = new UpdateRequest('cards', [{ skyflowId: 'id1', data: { x: 1 }, tokens: { x: 'byot' } }]);
    const resp = await controller.update(req);

    expect(resp).toBeInstanceOf(UpdateResponse);
    expect(updateRecords).toHaveBeenCalledTimes(1);
    const [genReq] = updateRecords.mock.calls[0];
    expect(genReq.vaultID).toBe('vault123');
    expect(genReq.tableName).toBe('cards');
    expect(genReq.records).toEqual([{ skyflowID: 'id1', data: { x: 1 }, tokens: { x: 'byot' } }]);

    const record = resp.records[0];
    expect(record.skyflowId).toBe('id1');
    expect(record.tokens).toEqual({ x: 'tok' });
    expect(record.data).toBeNull();
    expect(record.hashedData).toEqual({ x: 'h' });
    expect(record.tableName).toBe('cards');
    expect(record.httpCode).toBe(200);
    expect(record.error).toBeNull();
    expect(record.requestId).toBeUndefined();
  });

  it('omits BYOT tokens when not provided; fields fall back to data', async () => {
    const updateRecords = resourceMethod({ records: [{ skyflowID: 'id1', data: { x: 2 }, httpCode: 200 }] });
    const controller = new VaultController(makeFakeClient({ records: { updateRecords } }));

    const resp = await controller.update(new UpdateRequest('cards', [{ skyflowId: 'id1', data: { x: 2 } }]));

    const [genReq] = updateRecords.mock.calls[0];
    expect(genReq.records[0].tokens).toBeUndefined();
    expect(resp.records[0].data).toEqual({ x: 2 });
    expect(resp.records[0].tokens).toBeNull();
  });

  it('sends a per-record tableName when records carry their own table (falls back to request table)', async () => {
    const updateRecords = resourceMethod({ records: [] });
    const controller = new VaultController(makeFakeClient({ records: { updateRecords } }));

    await controller.update(new UpdateRequest('cards', [
      { skyflowId: 'id1', data: { x: 1 }, table: 'cards' },
      { skyflowId: 'id2', data: { y: 2 } }, // no per-record table -> request table 'cards'
    ]));

    const [genReq] = updateRecords.mock.calls[0];
    expect(genReq.tableName).toBeUndefined();
    expect(genReq.records).toEqual([
      { skyflowID: 'id1', data: { x: 1 }, tableName: 'cards' },
      { skyflowID: 'id2', data: { y: 2 }, tableName: 'cards' },
    ]);
  });

  it('sends a request-level updateType when set', async () => {
    const updateRecords = resourceMethod({ records: [] });
    const controller = new VaultController(makeFakeClient({ records: { updateRecords } }));

    await controller.update(new UpdateRequest('cards', [{ skyflowId: 'id1', data: { x: 1 } }], 'REPLACE'));

    const [genReq] = updateRecords.mock.calls[0];
    expect(genReq.updateType).toBe('REPLACE');
  });

  it('omits updateType when not set', async () => {
    const updateRecords = resourceMethod({ records: [] });
    const controller = new VaultController(makeFakeClient({ records: { updateRecords } }));

    await controller.update(new UpdateRequest('cards', [{ skyflowId: 'id1', data: { x: 1 } }]));

    const [genReq] = updateRecords.mock.calls[0];
    expect(genReq.updateType).toBeUndefined();
  });

  it('per-record error gets requestId from the header', async () => {
    const updateRecords = resourceMethod({ records: [{ httpCode: 400, error: 'update failed' }] });
    const controller = new VaultController(makeFakeClient({ records: { updateRecords } }));
    const resp = await controller.update(new UpdateRequest('cards', [{ skyflowId: 'id1', data: { x: 1 } }]));
    expect(resp.records[0].error).toBe('update failed');
    expect(resp.records[0].requestId).toBe(REQUEST_ID);
  });

  it('returns an empty records array when the response has none', async () => {
    const updateRecords = resourceMethod({});
    const controller = new VaultController(makeFakeClient({ records: { updateRecords } }));
    const resp = await controller.update(new UpdateRequest('cards', [{ skyflowId: 'id1', data: { x: 1 } }]));
    expect(resp.records).toEqual([]);
  });

  it('sets requestId to null on an errored record when the raw response has no headers', async () => {
    const updateRecords = resourceMethod({ records: [{ httpCode: 400, error: 'update failed' }] }, rawResponseNoHeaders);
    const controller = new VaultController(makeFakeClient({ records: { updateRecords } }));
    const resp = await controller.update(new UpdateRequest('cards', [{ skyflowId: 'id1', data: { x: 1 } }]));
    expect(resp.records[0].error).toBe('update failed');
    expect(resp.records[0].requestId).toBeNull();
  });

  it('rejects when the generated method throws', async () => {
    const updateRecords = rejectingMethod(new Error('boom-update'));
    const controller = new VaultController(makeFakeClient({ records: { updateRecords } }));
    await expect(
      controller.update(new UpdateRequest('cards', [{ skyflowId: 'id1', data: { x: 1 } }])),
    ).rejects.toThrow('boom-update');
  });
});
