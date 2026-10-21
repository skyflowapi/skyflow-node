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
  CustomHeaderKey,
} from '../../src';
import VaultController from '../../src/controller/vault';
import { makeFakeClient, resourceMethod, silenceConsole } from '../helpers';

silenceConsole();

describe('VaultController request options (timeout / retries / custom headers)', () => {
  it('runs the interceptor to attach supported custom headers and includes timeout + maxRetries', async () => {
    const insertRecords = resourceMethod({ records: [] });
    const controller = new VaultController(
      makeFakeClient({ records: { insertRecords }, timeout: 30, maxRetries: 2 }),
    );

    const options = new InsertOptions();
    options.setInterceptor((ctx) => {
      ctx.addHeader(CustomHeaderKey.REQUEST_ID_HEADER, 'req-123');
    });

    await controller.insert(new InsertRequest('cards', [{ data: { a: 1 } }]), options);

    const [, reqOpts] = insertRecords.mock.calls[0];
    expect(reqOpts.headers['x-request-id']).toBe('req-123');
    expect(reqOpts.timeoutInSeconds).toBe(30);
    expect(reqOpts.maxRetries).toBe(2);
  });

  it('passes the operation name to the interceptor context', async () => {
    const insertRecords = resourceMethod({ records: [] });
    const controller = new VaultController(makeFakeClient({ records: { insertRecords } }));

    let seenOperation: string | undefined;
    const options = new InsertOptions();
    options.setInterceptor((ctx) => {
      seenOperation = ctx.operation;
      ctx.addHeader(CustomHeaderKey.SKYFLOW_ACCOUNT_ID, 'acct-1');
    });

    await controller.insert(new InsertRequest('cards', [{ data: { a: 1 } }]), options);

    expect(seenOperation).toBe('INSERT');
    expect(insertRecords.mock.calls[0][1].headers['x-skyflow-account-id']).toBe('acct-1');
  });

  it('omits timeout/maxRetries and custom headers when none are configured', async () => {
    const insertRecords = resourceMethod({ records: [] });
    const controller = new VaultController(makeFakeClient({ records: { insertRecords } }));

    await controller.insert(new InsertRequest('cards', [{ data: { a: 1 } }]));

    const [, reqOpts] = insertRecords.mock.calls[0];
    expect(reqOpts.timeoutInSeconds).toBeUndefined();
    expect(reqOpts.maxRetries).toBeUndefined();
    // the SDK metrics header is always present even without custom headers
    expect(Object.keys(reqOpts.headers).length).toBeGreaterThan(0);
    expect(reqOpts.headers['x-request-id']).toBeUndefined();
  });

  it('wires the interceptor through delete / query / getTokens / uploadFiles / deleteFiles options', async () => {
    const attach = (ctx: { addHeader: (k: CustomHeaderKey, v: string) => void }) => {
      ctx.addHeader(CustomHeaderKey.REQUEST_ID_HEADER, 'r1');
    };

    const deleteRecords = resourceMethod({ records: [] });
    const dOpts = new DeleteOptions();
    dOpts.setInterceptor(attach);
    await new VaultController(makeFakeClient({ records: { deleteRecords } }))
      .delete(new DeleteRequest('cards', ['id1']), dOpts);
    expect(deleteRecords.mock.calls[0][1].headers['x-request-id']).toBe('r1');

    const executeQuery = resourceMethod({ records: [], metadata: { columns: [] } });
    const qOpts = new QueryOptions();
    qOpts.setInterceptor(attach);
    await new VaultController(makeFakeClient({ query: { executeQuery } }))
      .query(new QueryRequest('SELECT 1'), qOpts);
    expect(executeQuery.mock.calls[0][1].headers['x-request-id']).toBe('r1');

    const getTokens = resourceMethod({ records: [] });
    const gtOpts = new GetTokensOptions();
    gtOpts.setInterceptor(attach);
    await new VaultController(makeFakeClient({ tokens: { getTokens } }))
      .getTokens(new GetTokensRequest([{ value: 'v', tokenGroupName: 'g' }]), gtOpts);
    expect(getTokens.mock.calls[0][1].headers['x-request-id']).toBe('r1');

    const uploadFiles = resourceMethod({ records: [] });
    const ufOpts = new UploadFilesOptions();
    ufOpts.setInterceptor(attach);
    await new VaultController(makeFakeClient({ files: { uploadFiles } }))
      .uploadFiles(new UploadFilesRequest([
        { tableName: 't', columns: [{ column: 'c', base64: 'aGk=', fileName: 'f.pdf' }] },
      ]), ufOpts);
    expect(uploadFiles.mock.calls[0][1].headers['x-request-id']).toBe('r1');

    const deleteFiles = resourceMethod({ records: [] });
    const dfOpts = new DeleteFilesOptions();
    dfOpts.setInterceptor(attach);
    await new VaultController(makeFakeClient({ files: { deleteFiles } }))
      .deleteFiles(new DeleteFilesRequest([{ tableName: 't', columns: ['c'], skyflowId: 'id1' }]), dfOpts);
    expect(deleteFiles.mock.calls[0][1].headers['x-request-id']).toBe('r1');
  });
});
