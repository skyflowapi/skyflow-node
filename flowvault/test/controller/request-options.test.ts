import {
  InsertRequest,
  InsertOptions,
  DeleteRequest,
  DeleteOptions,
  QueryRequest,
  QueryOptions,
  GetTokensRequest,
  GetTokensOptions,
  UploadFilesRequest,
  UploadFilesOptions,
  DeleteFilesRequest,
  DeleteFilesOptions,
} from '../../src';
import VaultController from '../../src/controller/vault';
import { makeFakeClient, resourceMethod, silenceConsole } from '../helpers';

silenceConsole();

describe('VaultController request options (timeout / retries / custom headers)', () => {
  it('merges custom headers and includes timeoutInSeconds + maxRetries when the vault configures them', async () => {
    const insertRecords = resourceMethod({ records: [] });
    const controller = new VaultController(
      makeFakeClient({ records: { insertRecords }, timeout: 30, maxRetries: 2 }),
    );

    const options = new InsertOptions();
    options.setRequestHeaders({ 'x-request-id': 'req-123' });

    await controller.insert(new InsertRequest('cards', [{ data: { a: 1 } }]), options);

    const [, reqOpts] = insertRecords.mock.calls[0];
    expect(reqOpts.headers['x-request-id']).toBe('req-123');
    expect(reqOpts.timeoutInSeconds).toBe(30);
    expect(reqOpts.maxRetries).toBe(2);
  });

  it('omits timeout/maxRetries when the vault does not configure them', async () => {
    const insertRecords = resourceMethod({ records: [] });
    const controller = new VaultController(makeFakeClient({ records: { insertRecords } }));

    await controller.insert(new InsertRequest('cards', [{ data: { a: 1 } }]));

    const [, reqOpts] = insertRecords.mock.calls[0];
    expect(reqOpts.timeoutInSeconds).toBeUndefined();
    expect(reqOpts.maxRetries).toBeUndefined();
    // the SDK metrics header is always present even without custom headers
    expect(Object.keys(reqOpts.headers).length).toBeGreaterThan(0);
  });

  it('wires custom headers through delete / query / getTokens / uploadFiles / deleteFiles options', async () => {
    const hdr = { 'x-request-id': 'r1' };

    const deleteRecords = resourceMethod({ records: [] });
    const dOpts = new DeleteOptions();
    dOpts.setRequestHeaders(hdr);
    await new VaultController(makeFakeClient({ records: { deleteRecords } }))
      .delete(new DeleteRequest('cards', ['id1']), dOpts);
    expect(deleteRecords.mock.calls[0][1].headers['x-request-id']).toBe('r1');

    const executeQuery = resourceMethod({ records: [], metadata: { columns: [] } });
    const qOpts = new QueryOptions();
    qOpts.setRequestHeaders(hdr);
    await new VaultController(makeFakeClient({ query: { executeQuery } }))
      .query(new QueryRequest('SELECT 1'), qOpts);
    expect(executeQuery.mock.calls[0][1].headers['x-request-id']).toBe('r1');

    const getTokens = resourceMethod({ records: [] });
    const gtOpts = new GetTokensOptions();
    gtOpts.setRequestHeaders(hdr);
    await new VaultController(makeFakeClient({ tokens: { getTokens } }))
      .getTokens(new GetTokensRequest([{ value: 'v', tokenGroupName: 'g' }]), gtOpts);
    expect(getTokens.mock.calls[0][1].headers['x-request-id']).toBe('r1');

    const uploadFiles = resourceMethod({ records: [] });
    const ufOpts = new UploadFilesOptions();
    ufOpts.setRequestHeaders(hdr);
    await new VaultController(makeFakeClient({ files: { uploadFiles } }))
      .uploadFiles(new UploadFilesRequest([
        { tableName: 't', columns: [{ column: 'c', base64: 'aGk=', fileName: 'f.pdf' }] },
      ]), ufOpts);
    expect(uploadFiles.mock.calls[0][1].headers['x-request-id']).toBe('r1');

    const deleteFiles = resourceMethod({ records: [] });
    const dfOpts = new DeleteFilesOptions();
    dfOpts.setRequestHeaders(hdr);
    await new VaultController(makeFakeClient({ files: { deleteFiles } }))
      .deleteFiles(new DeleteFilesRequest([{ tableName: 't', columns: ['c'], skyflowId: 'id1' }]), dfOpts);
    expect(deleteFiles.mock.calls[0][1].headers['x-request-id']).toBe('r1');
  });
});
