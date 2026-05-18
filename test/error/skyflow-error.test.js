jest.mock('../../src/service-account/client', () => ({
    __esModule: true,
    default: jest.fn(),
}));

import SkyflowError from '../../src/error';

describe('SkyflowError', () => {
  test('uses defaults when optional fields absent', () => {
    const err = new SkyflowError({ http_code: 400, message: 'test error' });
    expect(err).toBeInstanceOf(Error);
    expect(err.error.http_code).toBe(400);
    expect(err.error.http_status).toBe('Bad Request');
    expect(err.error.details).toEqual([]);
    expect(err.error.requestId).toBeNull();
    expect(err.error.grpc_code).toBeNull();
    expect(err.message).toBe('test error');
  });

  test('uses provided http_status, details, requestId, grpc_code', () => {
    const err = new SkyflowError({
      http_code: 500,
      message: 'server error',
      http_status: 'Internal Server Error',
      details: [{ issue: 'db down' }],
      requestId: 'req-abc-123',
      grpc_code: 13,
    });
    expect(err.error.http_status).toBe('Internal Server Error');
    expect(err.error.details).toEqual([{ issue: 'db down' }]);
    expect(err.error.requestId).toBe('req-abc-123');
    expect(err.error.grpc_code).toBe(13);
  });

  test('formats message with args', () => {
    const err = new SkyflowError(
      { http_code: 400, message: 'invalid record at index %s1' },
      [2]
    );
    expect(err.message).toBe('invalid record at index 2');
    expect(err.error.message).toBe('invalid record at index 2');
  });

  test('uses message directly when no args', () => {
    const err = new SkyflowError({ http_code: 400, message: 'plain message' }, []);
    expect(err.message).toBe('plain message');
  });

  test('uses message directly when args is null', () => {
    const err = new SkyflowError({ http_code: 400, message: 'null args message' }, null);
    expect(err.message).toBe('null args message');
  });
});

describe('SkyflowError deprecated request_ID alias', () => {
    let warnSpy;

    beforeEach(() => {
        warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
        warnSpy.mockRestore();
    });

    test('request_ID returns same value as requestId', () => {
        const err = new SkyflowError({
            http_code: 400,
            message: 'test',
            requestId: 'req-abc-123',
        });
        expect(err.error.request_ID).toBe('req-abc-123');
        expect(err.error.request_ID).toBe(err.error.requestId);
    });

    test('request_ID returns null when requestId not set', () => {
        const err = new SkyflowError({ http_code: 400, message: 'test' });
        expect(err.error.request_ID).toBeNull();
    });

    test('request_ID logs deprecation warning', () => {
        const err = new SkyflowError({
            http_code: 400,
            message: 'test',
            requestId: 'req-xyz',
        });
        void err.error.request_ID;
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('request_ID'));
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('requestId'));
    });

    test('request_ID is not enumerable', () => {
        const err = new SkyflowError({
            http_code: 400,
            message: 'test',
            requestId: 'req-xyz',
        });
        expect(Object.keys(err.error)).not.toContain('request_ID');
    });
});
