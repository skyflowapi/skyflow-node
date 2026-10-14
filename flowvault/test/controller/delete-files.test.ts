import { DeleteFilesRequest, DeleteFilesResponse } from '../../src';
import VaultController from '../../src/controller/vault';
import { makeFakeClient, resourceMethod, rejectingMethod, REQUEST_ID, silenceConsole } from '../helpers';

silenceConsole();

describe('VaultController.deleteFiles', () => {
  it('builds skyflowID + columns and parses status (object->.status, else value)', async () => {
    const deleteFiles = resourceMethod({
      records: [
        {
          skyflowID: 'id1',
          tableName: 'onboarding',
          data: { resume: { status: 'DELETED' }, photo: 'DELETED' },
          httpCode: 200,
        },
      ],
    });
    const controller = new VaultController(makeFakeClient({ files: { deleteFiles } }));

    const req = new DeleteFilesRequest([
      { tableName: 'onboarding', columns: ['resume', 'photo'], skyflowId: 'id1' },
    ]);
    const resp = await controller.deleteFiles(req);

    expect(resp).toBeInstanceOf(DeleteFilesResponse);
    expect(deleteFiles).toHaveBeenCalledTimes(1);
    const [genReq] = deleteFiles.mock.calls[0];
    expect(genReq.vaultID).toBe('vault123');
    expect(genReq.records[0]).toEqual({ tableName: 'onboarding', columns: ['resume', 'photo'], skyflowID: 'id1' });

    const record = resp.records[0];
    expect(record.skyflowId).toBe('id1');
    expect(record.tableName).toBe('onboarding');
    expect(record.httpCode).toBe(200);
    expect(record.error).toBeNull();
    expect(record.requestId).toBeUndefined();
    expect(record.columns).toEqual([
      { column: 'resume', status: 'DELETED' }, // object -> .status
      { column: 'photo', status: 'DELETED' }, // scalar -> value
    ]);
  });

  it('maps uniqueValues->{data} and omits skyflowID when absent', async () => {
    const deleteFiles = resourceMethod({ records: [] });
    const controller = new VaultController(makeFakeClient({ files: { deleteFiles } }));

    await controller.deleteFiles(
      new DeleteFilesRequest([
        { tableName: 't', columns: ['c'], uniqueValues: [{ email: 'a@b.com' }, { ssn: '111' }] },
      ]),
    );

    const [genReq] = deleteFiles.mock.calls[0];
    expect(genReq.records[0].skyflowID).toBeUndefined();
    expect(genReq.records[0].uniqueValues).toEqual([{ data: { email: 'a@b.com' } }, { data: { ssn: '111' } }]);
  });

  it('columns is null and requestId is set from header on a failed record (no data)', async () => {
    const deleteFiles = resourceMethod({
      records: [{ skyflowID: 'id1', tableName: 't', httpCode: 404, error: 'not found' }],
    });
    const controller = new VaultController(makeFakeClient({ files: { deleteFiles } }));

    const resp = await controller.deleteFiles(
      new DeleteFilesRequest([{ tableName: 't', columns: ['c'], skyflowId: 'id1' }]),
    );

    const record = resp.records[0];
    expect(record.columns).toBeNull();
    expect(record.error).toBe('not found');
    expect(record.requestId).toBe(REQUEST_ID);
  });

  it('parses a null column value as a null status', async () => {
    const deleteFiles = resourceMethod({
      records: [{ skyflowID: 'id1', tableName: 't', data: { resume: null }, httpCode: 200 }],
    });
    const controller = new VaultController(makeFakeClient({ files: { deleteFiles } }));
    const resp = await controller.deleteFiles(
      new DeleteFilesRequest([{ tableName: 't', columns: ['resume'], skyflowId: 'id1' }]),
    );
    expect(resp.records[0].columns).toEqual([{ column: 'resume', status: null }]);
  });

  it('rejects when the generated method throws', async () => {
    const deleteFiles = rejectingMethod(new Error('boom-delete-files'));
    const controller = new VaultController(makeFakeClient({ files: { deleteFiles } }));
    await expect(
      controller.deleteFiles(new DeleteFilesRequest([{ tableName: 't', columns: ['c'], skyflowId: 'id1' }])),
    ).rejects.toThrow('boom-delete-files');
  });
});
