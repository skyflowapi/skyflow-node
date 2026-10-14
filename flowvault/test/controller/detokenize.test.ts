import { DetokenizeRequest, DetokenizeResponse } from '../../src';
import VaultController from '../../src/controller/vault';
import { makeFakeClient, resourceMethod, rejectingMethod, REQUEST_ID, silenceConsole } from '../helpers';

silenceConsole();

describe('VaultController.detokenize', () => {
  it('reads the generated `response` array and maps records (metadata skyflowID->skyflowId)', async () => {
    const detokenize = resourceMethod({
      response: [
        {
          token: 'tok1',
          value: '4111',
          tokenGroupName: 'cards',
          httpCode: 200,
          metadata: { skyflowID: 'id1', tableName: 'cards' },
        },
      ],
    });
    const controller = new VaultController(makeFakeClient({ tokens: { detokenize } }));

    const req = new DetokenizeRequest(['tok1'], [{ tokenGroupName: 'cards', redaction: 'PLAIN_TEXT' }]);
    const resp = await controller.detokenize(req);

    expect(resp).toBeInstanceOf(DetokenizeResponse);
    expect(detokenize).toHaveBeenCalledTimes(1);
    const [genReq] = detokenize.mock.calls[0];
    expect(genReq.vaultID).toBe('vault123');
    expect(genReq.tokens).toEqual(['tok1']);
    expect(genReq.tokenGroupRedactions).toEqual([{ tokenGroupName: 'cards', redaction: 'PLAIN_TEXT' }]);

    const record = resp.records[0];
    expect(record.token).toBe('tok1');
    expect(record.value).toBe('4111');
    expect(record.tokenGroupName).toBe('cards');
    expect(record.metadata).toEqual({ skyflowId: 'id1', tableName: 'cards' });
    expect(record.httpCode).toBe(200);
    expect(record.error).toBeNull();
    expect(record.requestId).toBeUndefined();
  });

  it('defaults httpCode to 200, metadata to null, and omits redactions when absent', async () => {
    const detokenize = resourceMethod({
      response: [{ token: 'tok1', value: '4111' }],
    });
    const controller = new VaultController(makeFakeClient({ tokens: { detokenize } }));

    const resp = await controller.detokenize(new DetokenizeRequest(['tok1']));

    const [genReq] = detokenize.mock.calls[0];
    expect(genReq.tokenGroupRedactions).toBeUndefined();

    const record = resp.records[0];
    expect(record.httpCode).toBe(200);
    expect(record.metadata).toBeNull();
    expect(record.tokenGroupName).toBeNull();
  });

  it('accepts camelCase metadata.skyflowId as well', async () => {
    const detokenize = resourceMethod({
      response: [{ token: 'tok1', value: 'v', metadata: { skyflowId: 'id9' } }],
    });
    const controller = new VaultController(makeFakeClient({ tokens: { detokenize } }));
    const resp = await controller.detokenize(new DetokenizeRequest(['tok1']));
    expect(resp.records[0].metadata).toEqual({ skyflowId: 'id9', tableName: null });
  });

  it('per-record error gets requestId from the header', async () => {
    const detokenize = resourceMethod({
      response: [{ token: 'tok1', httpCode: 404, error: 'token not found' }],
    });
    const controller = new VaultController(makeFakeClient({ tokens: { detokenize } }));
    const resp = await controller.detokenize(new DetokenizeRequest(['tok1']));
    expect(resp.records[0].error).toBe('token not found');
    expect(resp.records[0].requestId).toBe(REQUEST_ID);
  });

  it('rejects when the generated method throws', async () => {
    const detokenize = rejectingMethod(new Error('boom-detok'));
    const controller = new VaultController(makeFakeClient({ tokens: { detokenize } }));
    await expect(controller.detokenize(new DetokenizeRequest(['tok1']))).rejects.toThrow('boom-detok');
  });
});
