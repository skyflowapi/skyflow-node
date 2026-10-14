import { DeleteRequest, DeleteResponse } from '../../src';
import VaultController from '../../src/controller/vault';
import { makeFakeClient, resourceMethod, rejectingMethod, REQUEST_ID, silenceConsole } from '../helpers';

silenceConsole();

describe('VaultController.delete', () => {
  it('builds skyflowIDs and maps the response (no tableName on record)', async () => {
    const deleteRecords = resourceMethod({
      records: [{ skyflowID: 'id1', httpCode: 200 }],
    });
    const controller = new VaultController(makeFakeClient({ records: { deleteRecords } }));

    const resp = await controller.delete(new DeleteRequest('cards', ['id1', 'id2']));

    expect(resp).toBeInstanceOf(DeleteResponse);
    expect(deleteRecords).toHaveBeenCalledTimes(1);
    const [genReq] = deleteRecords.mock.calls[0];
    expect(genReq.vaultID).toBe('vault123');
    expect(genReq.tableName).toBe('cards');
    expect(genReq.skyflowIDs).toEqual(['id1', 'id2']);
    expect(genReq.uniqueValues).toBeUndefined();

    const record = resp.records[0];
    expect(record.skyflowId).toBe('id1');
    expect(record.httpCode).toBe(200);
    expect(record.error).toBeNull();
    expect(record.requestId).toBeUndefined();
    expect((record as Record<string, unknown>).tableName).toBeUndefined();
  });

  it('builds uniqueValues->{data} when ids are absent', async () => {
    const deleteRecords = resourceMethod({ records: [] });
    const controller = new VaultController(makeFakeClient({ records: { deleteRecords } }));

    await controller.delete(new DeleteRequest('cards', [], [{ email: 'a@b.com' }, { ssn: '111' }]));

    const [genReq] = deleteRecords.mock.calls[0];
    expect(genReq.skyflowIDs).toBeUndefined();
    expect(genReq.uniqueValues).toEqual([{ data: { email: 'a@b.com' } }, { data: { ssn: '111' } }]);
  });

  it('per-record error gets requestId from the header', async () => {
    const deleteRecords = resourceMethod({ records: [{ skyflowID: 'id1', httpCode: 404, error: 'missing' }] });
    const controller = new VaultController(makeFakeClient({ records: { deleteRecords } }));
    const resp = await controller.delete(new DeleteRequest('cards', ['id1']));
    expect(resp.records[0].error).toBe('missing');
    expect(resp.records[0].requestId).toBe(REQUEST_ID);
  });

  it('rejects when the generated method throws', async () => {
    const deleteRecords = rejectingMethod(new Error('boom-delete'));
    const controller = new VaultController(makeFakeClient({ records: { deleteRecords } }));
    await expect(controller.delete(new DeleteRequest('cards', ['id1']))).rejects.toThrow('boom-delete');
  });
});
