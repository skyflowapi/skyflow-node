import {
  DeleteRequest,
  DeleteResponse,
  GetRequest,
  DeleteFilesRequest,
  InsertRequest,
  UpdateRequest,
  DetokenizeRequest,
  GetTokensRequest,
  SkyflowError,
} from '../../src';
import VaultController from '../../src/controller/vault';
import { makeFakeClient, rejectingMethod, rawResponse, silenceConsole } from '../helpers';

silenceConsole();

describe('VaultController per-record error extraction (4xx body carrying records)', () => {
  it('delete: surfaces a per-record 404 from the error body instead of throwing', async () => {
    const err = {
      statusCode: 404,
      body: { records: [{ skyflowID: 'id1', httpCode: 404, error: 'not a valid Skyflow ID' }] },
      rawResponse,
    };
    const controller = new VaultController(makeFakeClient({ records: { deleteRecords: rejectingMethod(err) } }));

    const resp = await controller.delete(new DeleteRequest('cards', ['id1']));

    expect(resp).toBeInstanceOf(DeleteResponse);
    expect(resp.records[0].skyflowId).toBe('id1');
    expect(resp.records[0].httpCode).toBe(404);
    expect(resp.records[0].error).toBe('not a valid Skyflow ID');
  });

  it('get: surfaces per-record errors from the error body', async () => {
    const err = {
      statusCode: 404,
      body: { records: [{ skyflowID: 'id1', httpCode: 404, error: 'not found' }] },
      rawResponse,
    };
    const controller = new VaultController(makeFakeClient({ records: { getRecords: rejectingMethod(err) } }));

    const resp = await controller.get(new GetRequest('cards', ['id1']));
    expect(resp.records[0].httpCode).toBe(404);
    expect(resp.records[0].error).toBe('not found');
  });

  it('deleteFiles: surfaces per-record errors (columns null) from the error body', async () => {
    const err = {
      statusCode: 404,
      body: { records: [{ skyflowID: 'id1', tableName: 't', httpCode: 404, error: 'not found' }] },
      rawResponse,
    };
    const controller = new VaultController(makeFakeClient({ files: { deleteFiles: rejectingMethod(err) } }));

    const resp = await controller.deleteFiles(
      new DeleteFilesRequest([{ tableName: 't', columns: ['c'], skyflowId: 'id1' }]),
    );
    expect(resp.records[0].httpCode).toBe(404);
    expect(resp.records[0].columns).toBeNull();
  });

  it('insert: surfaces per-record errors from the error body', async () => {
    const err = {
      statusCode: 400,
      body: { records: [{ tableName: '', skyflowID: null, httpCode: 400, error: 'bad record' }] },
      rawResponse,
    };
    const controller = new VaultController(makeFakeClient({ records: { insertRecords: rejectingMethod(err) } }));

    const resp = await controller.insert(new InsertRequest('cards', [{ data: { a: 1 } }]));
    expect(resp.records[0].httpCode).toBe(400);
    expect(resp.records[0].error).toBe('bad record');
  });

  it('update: surfaces per-record errors from the error body', async () => {
    const err = {
      statusCode: 404,
      body: { records: [{ skyflowID: null, httpCode: 404, error: 'not found' }] },
      rawResponse,
    };
    const controller = new VaultController(makeFakeClient({ records: { updateRecords: rejectingMethod(err) } }));

    const resp = await controller.update(new UpdateRequest('cards', [{ skyflowId: 'id1', data: { x: 1 } }]));
    expect(resp.records[0].httpCode).toBe(404);
  });

  it('detokenize: surfaces per-record errors from the error body `response` array', async () => {
    const err = {
      statusCode: 404,
      body: { response: [{ token: 't1', httpCode: 404, error: 'invalid token' }] },
      rawResponse,
    };
    const controller = new VaultController(makeFakeClient({ tokens: { detokenize: rejectingMethod(err) } }));

    const resp = await controller.detokenize(new DetokenizeRequest(['t1']));
    expect(resp.records[0].httpCode).toBe(404);
    expect(resp.records[0].error).toBe('invalid token');
  });

  it('getTokens: surfaces per-record errors from the error body', async () => {
    const err = {
      statusCode: 404,
      body: { records: [{ value: 'v', tokenGroupName: 'g', token: '', httpCode: 404, error: 'not found' }] },
      rawResponse,
    };
    const controller = new VaultController(makeFakeClient({ tokens: { getTokens: rejectingMethod(err) } }));

    const resp = await controller.getTokens(new GetTokensRequest([{ value: 'v', tokenGroupName: 'g' }]));
    expect(resp.records[0].httpCode).toBe(404);
  });

  it('still throws a whole-call error when the body has no records (e.g. invalid vault)', async () => {
    const err = {
      statusCode: 404,
      body: { error: { httpCode: 404, message: 'Vault not found' } },
      rawResponse,
    };
    const controller = new VaultController(makeFakeClient({ records: { deleteRecords: rejectingMethod(err) } }));

    await expect(controller.delete(new DeleteRequest('cards', ['id1']))).rejects.toBeInstanceOf(SkyflowError);
  });
});
