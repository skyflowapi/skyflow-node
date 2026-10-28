import { QueryRequest, QueryResponse } from '../../src';
import VaultController from '../../src/controller/vault';
import {
  makeFakeClient,
  resourceMethod,
  rejectingMethod,
  rawResponseNoId,
  REQUEST_ID,
  silenceConsole,
} from '../helpers';

silenceConsole();

describe('VaultController.query', () => {
  it('maps records->fields, metadata.columns and the call-level requestId', async () => {
    const executeQuery = resourceMethod({
      records: [{ data: { name: 'alice' } }, { data: { name: 'bob' } }],
      metadata: { columns: ['name'] },
    });
    const controller = new VaultController(makeFakeClient({ query: { executeQuery } }));

    const resp = await controller.query(new QueryRequest('SELECT name FROM cards'));

    expect(resp).toBeInstanceOf(QueryResponse);
    expect(executeQuery).toHaveBeenCalledTimes(1);
    const [genReq] = executeQuery.mock.calls[0];
    expect(genReq.vaultID).toBe('vault123');
    expect(genReq.query).toBe('SELECT name FROM cards');

    expect(resp.fields).toEqual([{ name: 'alice' }, { name: 'bob' }]);
    expect(resp.metadata.columns).toEqual(['name']);
    expect(resp.errors).toBeNull();
    expect(resp.requestId).toBe(REQUEST_ID);
  });

  it('normalizes the data plane skyflowID key to skyflowId in rows and columns', async () => {
    const executeQuery = resourceMethod({
      records: [{ data: { skyflowID: 'id-1', name: 'alice' } }],
      metadata: { columns: ['skyflowID', 'name'] },
    });
    const controller = new VaultController(makeFakeClient({ query: { executeQuery } }));

    const resp = await controller.query(new QueryRequest('SELECT * FROM cards'));

    expect(resp.fields).toEqual([{ skyflowId: 'id-1', name: 'alice' }]);
    expect(resp.metadata.columns).toEqual(['skyflowId', 'name']);
  });

  it('defaults fields to {} and columns to [] when absent; requestId falls back to ""', async () => {
    const executeQuery = resourceMethod({ records: [{}, { data: null }] }, rawResponseNoId);
    const controller = new VaultController(makeFakeClient({ query: { executeQuery } }));

    const resp = await controller.query(new QueryRequest('SELECT 1'));

    expect(resp.fields).toEqual([{}, {}]);
    expect(resp.metadata.columns).toEqual([]);
    expect(resp.requestId).toBe('');
  });

  it('returns empty fields when the response has no records', async () => {
    const executeQuery = resourceMethod({ metadata: { columns: [] } });
    const controller = new VaultController(makeFakeClient({ query: { executeQuery } }));
    const resp = await controller.query(new QueryRequest('SELECT 1'));
    expect(resp.fields).toEqual([]);
  });

  it('rejects when the generated method throws', async () => {
    const executeQuery = rejectingMethod(new Error('boom-query'));
    const controller = new VaultController(makeFakeClient({ query: { executeQuery } }));
    await expect(controller.query(new QueryRequest('SELECT 1'))).rejects.toThrow('boom-query');
  });
});
