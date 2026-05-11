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
