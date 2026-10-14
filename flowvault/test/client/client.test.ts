// Mock only getBearerToken from skyflow-common; everything else stays real so
// failureResponse / getCredentials / isExpired behave as in production.
jest.mock('skyflow-common', () => {
  const actual = jest.requireActual('skyflow-common');
  return { ...actual, getBearerToken: jest.fn() };
});

import {
  AuthType,
  LogLevel,
  SkyflowError,
  SKYFLOW_ERROR_CODE,
  errorMessages,
  getBearerToken,
} from '../../src';
import VaultClient from '../../src/client';
import { makeJwt, silenceConsole } from '../helpers';

silenceConsole();

const getBearerTokenMock = getBearerToken as unknown as jest.Mock;

const URL = 'https://abc-cluster.vault.skyflowapis.com';

function newClient(individual?: unknown, common?: unknown): VaultClient {
  return new VaultClient(URL, 'vault123', individual as never, common as never, LogLevel.ERROR);
}

describe('VaultClient.failureResponse', () => {
  it('normalizes a snake_case v2 error envelope; httpCode from statusCode, requestId from header', () => {
    const client = newClient({ apiKey: 'sky-x' });
    const err = {
      statusCode: 404,
      body: { error: { grpc_code: 5, http_code: 404, http_status: 'Not Found', message: 'not found', details: ['d1'] } },
      rawResponse: { headers: new Map([['x-request-id', 'req-xyz']]) },
    };

    const result = client.failureResponse(err);

    expect(result).toBeInstanceOf(SkyflowError);
    expect(result.error?.httpCode).toBe(404); // from statusCode (takes priority)
    expect(result.error?.grpcCode).toBe(5);
    expect(result.error?.httpStatus).toBe('Not Found');
    expect(result.error?.message).toBe('not found');
    expect(result.error?.details).toEqual(['d1']);
    expect(result.error?.requestId).toBe('req-xyz'); // from header (no body requestId)
  });

  it('normalizes a camelCase variant; requestId comes from the body when present', () => {
    const client = newClient({ apiKey: 'sky-x' });
    const err = {
      statusCode: 400,
      body: { error: { grpcCode: 3, httpCode: 400, httpStatus: 'Bad Request', message: 'bad', details: [], requestId: 'rid-1' } },
    };

    const result = client.failureResponse(err);

    expect(result.error?.httpCode).toBe(400);
    expect(result.error?.grpcCode).toBe(3);
    expect(result.error?.httpStatus).toBe('Bad Request');
    expect(result.error?.message).toBe('bad');
    expect(result.error?.requestId).toBe('rid-1');
  });

  it('falls back to err.message and defaults when there is no body', () => {
    const client = newClient({ apiKey: 'sky-x' });
    const result = client.failureResponse({ message: 'boom' });

    expect(result.error?.message).toBe('boom');
    expect(result.error?.httpCode).toBe(400); // HTTP_STATUS_CODE.BAD_REQUEST default
    expect(result.error?.grpcCode).toBeNull();
    expect(result.error?.httpStatus).toBe('Bad Request');
    expect(result.error?.requestId).toBeNull();
    expect(result.error?.details).toEqual([]);
  });

  it('uses the generic ERROR_OCCURRED message when nothing else is present', () => {
    const client = newClient({ apiKey: 'sky-x' });
    const result = client.failureResponse({});
    expect(result.error?.message).toBe(errorMessages.ERROR_OCCURRED);
  });

  it('passes an existing SkyflowError straight through', () => {
    const client = newClient({ apiKey: 'sky-x' });
    const original = new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_QUERY);
    expect(client.failureResponse(original)).toBe(original);
  });
});

describe('VaultClient.getToken', () => {
  beforeEach(() => getBearerTokenMock.mockReset());

  it('resolves a token via getBearerToken and wires the resource clients to token/baseUrl suppliers', async () => {
    getBearerTokenMock.mockResolvedValue({ key: 'tok', type: AuthType.TOKEN });
    const client = newClient({ apiKey: 'sky-x' });

    await client.getToken();

    expect(getBearerTokenMock).toHaveBeenCalledTimes(1);
    // Each generated resource client gets baseUrl + token suppliers.
    for (const api of [client.records, client.tokens, client.files, client.query]) {
      const opts = (api as unknown as { _options: { baseUrl: () => string; token: () => string } })._options;
      expect(opts.baseUrl()).toBe(URL);
      expect(opts.token()).toBe('tok');
    }
  });
});

describe('VaultClient.getCredentials', () => {
  it('reuses an API key from authInfo without re-reading credentials', () => {
    const client = newClient({ apiKey: 'sky-individual' });
    (client as unknown as { authInfo: unknown }).authInfo = { key: 'sky-cached', type: AuthType.API_KEY };
    expect(client.getCredentials()).toEqual({ apiKey: 'sky-cached' });
  });

  it('reuses a non-expired bearer token from authInfo', () => {
    const client = newClient({ apiKey: 'sky-individual' });
    const validJwt = makeJwt(3600);
    (client as unknown as { authInfo: unknown }).authInfo = { key: validJwt, type: AuthType.TOKEN };
    expect(client.getCredentials()).toEqual({ token: validJwt });
  });

  it('falls back to individual credentials when the cached bearer token is expired', () => {
    const client = newClient({ apiKey: 'sky-individual' });
    const expiredJwt = makeJwt(-3600);
    (client as unknown as { authInfo: unknown }).authInfo = { key: expiredJwt, type: AuthType.TOKEN };
    expect(client.getCredentials()).toEqual({ apiKey: 'sky-individual' });
  });

  it('returns individual over common when there is no cached authInfo', () => {
    const client = newClient({ apiKey: 'sky-individual' }, { apiKey: 'sky-common' });
    expect(client.getCredentials()).toEqual({ apiKey: 'sky-individual' });
  });

  it('returns common credentials when no individual credentials are set', () => {
    const client = newClient(undefined, { apiKey: 'sky-common' });
    expect(client.getCredentials()).toEqual({ apiKey: 'sky-common' });
  });

  it('falls through to stored credentials for an unrecognized cached auth type', () => {
    // Defensive: an authInfo.type the switch does not handle hits the `default`
    // arm and falls back to the configured credentials.
    const client = newClient({ apiKey: 'sky-individual' });
    (client as unknown as { authInfo: unknown }).authInfo = { key: 'sky-cached', type: 'MYSTERY' as never };
    expect(client.getCredentials()).toEqual({ apiKey: 'sky-individual' });
  });

  it('skips reuse right after updateSkyflowCredentials (updateTriggered), then resumes', () => {
    const client = newClient({ apiKey: 'sky-individual' });
    (client as unknown as { authInfo: unknown }).authInfo = { key: 'sky-cached', type: AuthType.API_KEY };
    client.updateSkyflowCredentials({ apiKey: 'sky-common' } as never);
    // updateTriggered -> ignore cached authInfo, return individual ?? common.
    expect(client.getCredentials()).toEqual({ apiKey: 'sky-individual' });
    // Subsequent call reuses the cached key again (updateTriggered reset).
    expect(client.getCredentials()).toEqual({ apiKey: 'sky-cached' });
  });
});

describe('VaultClient config updates', () => {
  it('updateClientConfig rebuilds resource clients against the new URL', async () => {
    getBearerTokenMock.mockResolvedValue({ key: 'tok', type: AuthType.TOKEN });
    const client = newClient({ apiKey: 'sky-x' });
    await client.getToken();
    const before = client.records;

    const newUrl = 'https://new-cluster.vault.skyflowapis.com';
    client.updateClientConfig(newUrl, 'vault123', { apiKey: 'sky-y' } as never, undefined, LogLevel.DEBUG);

    const after = client.records;
    expect(after).not.toBe(before); // rebuilt
    expect(client.getLogLevel()).toBe(LogLevel.DEBUG);
    const opts = (after as unknown as { _options: { baseUrl: () => string } })._options;
    expect(opts.baseUrl()).toBe(newUrl);
  });

  it('setLogLevel updates the stored level', () => {
    const client = newClient({ apiKey: 'sky-x' });
    client.setLogLevel(LogLevel.WARN);
    expect(client.getLogLevel()).toBe(LogLevel.WARN);
  });

  it('defaults the log level to ERROR when the constructor gets none', () => {
    const client = new VaultClient(URL, 'vault123', { apiKey: 'sky-x' } as never);
    expect(client.getLogLevel()).toBe(LogLevel.ERROR);
  });

  it('updateClientConfig defaults the log level to ERROR when none is provided', () => {
    const client = newClient({ apiKey: 'sky-x' });
    client.updateClientConfig(URL, 'vault123', { apiKey: 'sky-y' } as never, undefined, undefined);
    expect(client.getLogLevel()).toBe(LogLevel.ERROR);
  });
});
