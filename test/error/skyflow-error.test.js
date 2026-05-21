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

describe('SkyflowError new camelCase fields', () => {
  test('httpCode is set from httpCode input', () => {
    const err = new SkyflowError({ httpCode: 404, message: 'not found' });
    expect(err.error.httpCode).toBe(404);
  });

  test('httpStatus is set from httpStatus input', () => {
    const err = new SkyflowError({ httpCode: 200, message: 'ok', httpStatus: 'OK' });
    expect(err.error.httpStatus).toBe('OK');
  });

  test('grpcCode is set from grpcCode input', () => {
    const err = new SkyflowError({ httpCode: 400, message: 'invalid', grpcCode: 3 });
    expect(err.error.grpcCode).toBe(3);
  });

  test('httpCode input falls back to http_code', () => {
    const err = new SkyflowError({ http_code: 400, message: 'test' });
    expect(err.error.httpCode).toBe(400);
  });

  test('grpcCode input falls back to grpc_code', () => {
    const err = new SkyflowError({ httpCode: 400, message: 'test', grpc_code: 13 });
    expect(err.error.grpcCode).toBe(13);
  });

  test('httpStatus input falls back to http_status', () => {
    const err = new SkyflowError({ httpCode: 400, message: 'test', http_status: 'Custom Status' });
    expect(err.error.httpStatus).toBe('Custom Status');
  });
});

describe('SkyflowError deprecated http_code alias', () => {
  let warnSpy;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  test('http_code returns same value as httpCode', () => {
    const err = new SkyflowError({ httpCode: 400, message: 'test' });
    expect(err.error.http_code).toBe(400);
    expect(err.error.http_code).toBe(err.error.httpCode);
  });

  test('http_code logs deprecation warning', () => {
    const err = new SkyflowError({ httpCode: 400, message: 'test' });
    void err.error.http_code;
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('http_code'));
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('httpCode'));
  });

  test('http_code is enumerable', () => {
    const err = new SkyflowError({ httpCode: 400, message: 'test' });
    expect(Object.keys(err.error)).toContain('http_code');
  });
});

describe('SkyflowError deprecated http_status alias', () => {
  let warnSpy;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  test('http_status returns same value as httpStatus', () => {
    const err = new SkyflowError({ httpCode: 400, message: 'test', httpStatus: 'Bad Request' });
    expect(err.error.http_status).toBe('Bad Request');
    expect(err.error.http_status).toBe(err.error.httpStatus);
  });

  test('http_status logs deprecation warning', () => {
    const err = new SkyflowError({ httpCode: 400, message: 'test' });
    void err.error.http_status;
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('http_status'));
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('httpStatus'));
  });

  test('http_status is enumerable', () => {
    const err = new SkyflowError({ httpCode: 400, message: 'test' });
    expect(Object.keys(err.error)).toContain('http_status');
  });
});

describe('SkyflowError deprecated grpc_code alias', () => {
  let warnSpy;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  test('grpc_code returns same value as grpcCode', () => {
    const err = new SkyflowError({ httpCode: 400, message: 'test', grpcCode: 3 });
    expect(err.error.grpc_code).toBe(3);
    expect(err.error.grpc_code).toBe(err.error.grpcCode);
  });

  test('grpc_code returns null when grpcCode not set', () => {
    const err = new SkyflowError({ httpCode: 400, message: 'test' });
    expect(err.error.grpc_code).toBeNull();
  });

  test('grpc_code logs deprecation warning', () => {
    const err = new SkyflowError({ httpCode: 400, message: 'test', grpcCode: 5 });
    void err.error.grpc_code;
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('grpc_code'));
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('grpcCode'));
  });

  test('grpc_code is enumerable', () => {
    const err = new SkyflowError({ httpCode: 400, message: 'test', grpcCode: 5 });
    expect(Object.keys(err.error)).toContain('grpc_code');
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

    test('request_ID is enumerable', () => {
        const err = new SkyflowError({
            http_code: 400,
            message: 'test',
            requestId: 'req-xyz',
        });
        expect(Object.keys(err.error)).toContain('request_ID');
    });
});
