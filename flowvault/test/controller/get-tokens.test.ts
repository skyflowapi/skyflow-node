import { GetTokensRequest, GetTokensResponse } from '../../src';
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

describe('VaultController.getTokens', () => {
  it('builds value/tokenGroupName records and maps the response', async () => {
    const getTokens = resourceMethod({
      records: [{ value: '4111', tokenGroupName: 'cards', token: 'tok_1', httpCode: 200 }],
    });
    const controller = new VaultController(makeFakeClient({ tokens: { getTokens } }));

    const resp = await controller.getTokens(
      new GetTokensRequest([{ value: '4111', tokenGroupName: 'cards' }]),
    );

    expect(resp).toBeInstanceOf(GetTokensResponse);
    expect(getTokens).toHaveBeenCalledTimes(1);
    const [genReq] = getTokens.mock.calls[0];
    expect(genReq.vaultID).toBe('vault123');
    expect(genReq.records).toEqual([{ value: '4111', tokenGroupName: 'cards' }]);

    const record = resp.records[0];
    expect(record.value).toBe('4111');
    expect(record.tokenGroupName).toBe('cards');
    expect(record.token).toBe('tok_1');
    expect(record.httpCode).toBe(200);
    expect(record.error).toBeNull();
    expect(record.requestId).toBeUndefined();
  });

  it('defaults token to null and httpCode to 200 when absent', async () => {
    const getTokens = resourceMethod({ records: [{ value: '4111', tokenGroupName: 'cards' }] });
    const controller = new VaultController(makeFakeClient({ tokens: { getTokens } }));
    const resp = await controller.getTokens(new GetTokensRequest([{ value: '4111', tokenGroupName: 'cards' }]));
    expect(resp.records[0].token).toBeNull();
    expect(resp.records[0].httpCode).toBe(200);
  });

  it('per-record error gets requestId from the header', async () => {
    const getTokens = resourceMethod({
      records: [{ value: '4111', tokenGroupName: 'cards', httpCode: 400, error: 'tokenize failed' }],
    });
    const controller = new VaultController(makeFakeClient({ tokens: { getTokens } }));
    const resp = await controller.getTokens(new GetTokensRequest([{ value: '4111', tokenGroupName: 'cards' }]));
    expect(resp.records[0].error).toBe('tokenize failed');
    expect(resp.records[0].requestId).toBe(REQUEST_ID);
  });

  it('returns an empty records array when the response has none', async () => {
    const getTokens = resourceMethod({});
    const controller = new VaultController(makeFakeClient({ tokens: { getTokens } }));
    const resp = await controller.getTokens(new GetTokensRequest([{ value: '4111', tokenGroupName: 'cards' }]));
    expect(resp.records).toEqual([]);
  });

  it('sets requestId to null on an errored record when the raw response has no headers', async () => {
    const getTokens = resourceMethod(
      { records: [{ value: '4111', tokenGroupName: 'cards', httpCode: 400, error: 'tokenize failed' }] },
      rawResponseNoHeaders,
    );
    const controller = new VaultController(makeFakeClient({ tokens: { getTokens } }));
    const resp = await controller.getTokens(new GetTokensRequest([{ value: '4111', tokenGroupName: 'cards' }]));
    expect(resp.records[0].error).toBe('tokenize failed');
    expect(resp.records[0].requestId).toBeNull();
  });

  it('rejects when the generated method throws', async () => {
    const getTokens = rejectingMethod(new Error('boom-tokens'));
    const controller = new VaultController(makeFakeClient({ tokens: { getTokens } }));
    await expect(
      controller.getTokens(new GetTokensRequest([{ value: '4111', tokenGroupName: 'cards' }])),
    ).rejects.toThrow('boom-tokens');
  });
});
