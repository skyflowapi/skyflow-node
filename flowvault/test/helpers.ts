// Shared test helpers for the FlowVault hand-written layer.
// NOTE: this file is intentionally NOT a *.test.ts, so Jest does not run it as
// a suite; it only provides the mocking seam the controller/client tests reuse.
import { LogLevel, SkyflowError, SKYFLOW_ERROR_CODE } from '../src';

/** A rawResponse stub whose headers carry an x-request-id (matches smoke test). */
export const REQUEST_ID = 'req-abc-123';
export const rawResponse = { headers: new Map([['x-request-id', REQUEST_ID]]) };

/** A rawResponse stub carrying NO x-request-id header. */
export const rawResponseNoId = { headers: new Map<string, string>() };

/** A rawResponse stub with no usable headers object at all. */
export const rawResponseNoHeaders = {};

/**
 * Builds a fake VaultClient exposing only what the controller touches. Any
 * resource client (records/tokens/files/query) is supplied via `overrides`.
 */
export function makeFakeClient(overrides: Record<string, unknown>): any {
  return {
    vaultId: 'vault123',
    getLogLevel: () => LogLevel.ERROR,
    getToken: jest.fn().mockResolvedValue(undefined),
    // Pass through real Errors; otherwise wrap. The real normalizer is covered
    // by the client tests.
    failureResponse: (e: unknown) =>
      e instanceof Error ? e : new SkyflowError(SKYFLOW_ERROR_CODE.INTERNAL_SERVER_ERROR),
    ...overrides,
  };
}

/**
 * A generated-resource-method stub. Returns an object with `withRawResponse()`
 * resolving to `{ data, rawResponse }`, matching the generated client contract.
 */
export function resourceMethod(data: unknown, rr: unknown = rawResponse): jest.Mock {
  return jest.fn().mockReturnValue({
    withRawResponse: () => Promise.resolve({ data, rawResponse: rr }),
  });
}

/** A generated-resource-method stub whose `withRawResponse()` rejects. */
export function rejectingMethod(err: unknown): jest.Mock {
  return jest.fn().mockReturnValue({
    withRawResponse: () => Promise.reject(err),
  });
}

/** Build a decodable (unsigned) JWT whose `exp` is `secondsFromNow` out. */
export function makeJwt(secondsFromNow: number): string {
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
  const exp = Math.floor(Date.now() / 1000) + secondsFromNow;
  const payload = Buffer.from(JSON.stringify({ exp })).toString('base64url');
  return `${header}.${payload}.sig`;
}

/** Silence console noise from negative-path printLog() calls for a test file. */
export function silenceConsole(): void {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
}
