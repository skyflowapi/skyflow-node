import VaultClient from '../../../src/vault/client'; // Adjust the import path
import { Query } from '../../../src/ _generated_/rest/api/resources/query/client/Client';
import { Records } from '../../../src/ _generated_/rest/api/resources/records/client/Client';
import { Tokens } from '../../../src/ _generated_/rest/api/resources/tokens/client/Client';
import { AuthType, LogLevel, TYPES } from '../../../src/utils';
import { isExpired } from '../../../src/utils/jwt-utils';
import SkyflowError  from '../../../src/error';
import { Strings } from '../../../src/ _generated_/rest/api/resources/strings/client/Client';
import { Files } from '../../../src/ _generated_/rest/api/resources/files/client/Client';

jest.mock('../../../src/ _generated_/rest');
jest.mock('../../../src/ _generated_/rest/api/resources/records/client/Client');
jest.mock('../../../src/ _generated_/rest/api/resources/query/client/Client');
jest.mock('../../../src/ _generated_/rest/api/resources/tokens/client/Client');
jest.mock('../../../src/ _generated_/rest/api/resources/strings/client/Client');
jest.mock('../../../src/ _generated_/rest/api/resources/files/client/Client');
jest.mock('../../../src/utils/jwt-utils');
jest.mock('../../../src/error');

describe('VaultClient', () => {
    const url = 'https://vault.skyflow.com';
    const vaultId = 'vault123';
    const apiKey = 'api_key_123';
    const token = 'token_123';
    const authInfo = { key: token, type: AuthType.TOKEN };

    let vaultClient;

    beforeEach(() => {
        vaultClient = new VaultClient(url, vaultId, { apiKey }, { token }, LogLevel.INFO);
    });

    describe('Constructor and Initialization', () => {
        test('should initialize the client with correct values and default log level', () => {
            expect(vaultClient.url).toBe(url);
            expect(vaultClient.vaultId).toBe(vaultId);
            expect(vaultClient.individualCredentials).toEqual({ apiKey });
            expect(vaultClient.skyflowCredentials).toEqual({ token });
            expect(vaultClient.logLevel).toBe(LogLevel.INFO); // Scenario 1: Specific log level provided
        });

        test('should set log level to ERROR if no log level is provided', () => {
            const clientWithoutLogLevel = new VaultClient(url, vaultId, { apiKey }, { token });
            expect(clientWithoutLogLevel.logLevel).toBe(LogLevel.ERROR); // Scenario 2: Default log level
        });
    });

    describe('initAPI', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        test('should initialize RecordsApi for DELETE', () => {
            vaultClient.initAPI(authInfo, TYPES.DELETE);
            expect(Records).toHaveBeenCalled();
        });

        test('should initialize RecordsApi for FILE_UPLOAD', () => {
            vaultClient.initAPI(authInfo, TYPES.FILE_UPLOAD);
            expect(Records).toHaveBeenCalled();
        });

        test('should initialize RecordsApi for GET', () => {
            vaultClient.initAPI(authInfo, TYPES.GET);
            expect(Records).toHaveBeenCalled();
        });

        test('should initialize RecordsApi for INSERT', () => {
            vaultClient.initAPI(authInfo, TYPES.INSERT);
            expect(Records).toHaveBeenCalled();
        });

        test('should initialize RecordsApi for INSERT_BATCH', () => {
            vaultClient.initAPI(authInfo, TYPES.INSERT_BATCH);
            expect(Records).toHaveBeenCalled();
        });

        test('should initialize RecordsApi for UPDATE', () => {
            vaultClient.initAPI(authInfo, TYPES.UPDATE);
            expect(Records).toHaveBeenCalled();
        });

        test('should initialize TokensApi for DETOKENIZE', () => {
            vaultClient.initAPI(authInfo, TYPES.DETOKENIZE);
            expect(Tokens).toHaveBeenCalled();
        });

        test('should initialize TokensApi for TOKENIZE', () => {
            vaultClient.initAPI(authInfo, TYPES.TOKENIZE);
            expect(Tokens).toHaveBeenCalled();
        });

        test('should initialize QueryApi for QUERY', () => {
            vaultClient.initAPI(authInfo, TYPES.QUERY);
            expect(Query).toHaveBeenCalled();
        });

        test('should initialize Strings for DETECT', () => {
            vaultClient.initAPI(authInfo, TYPES.DEIDENTIFY_TEXT);
            expect(Strings).toHaveBeenCalled();
        });

        test('should not initialize API for unsupported type', () => {
            vaultClient.initAPI(authInfo, 'UNSUPPORTED_TYPE');
            expect(Records).not.toHaveBeenCalled();
            expect(Tokens).not.toHaveBeenCalled();
            expect(Query).not.toHaveBeenCalled();
        });
    });

    describe('updateClientConfig', () => {
        test('should set updateTriggered flag and reinitialize client', () => {
            const newUrl = 'https://new-vault.com';
            const newVaultId = 'vault456';
            vaultClient.updateClientConfig(newUrl, newVaultId, { apiKey: 'newApiKey' }, { token: 'newToken' }, LogLevel.DEBUG);

            expect(vaultClient.url).toBe(newUrl);
            expect(vaultClient.vaultId).toBe(newVaultId);
            expect(vaultClient.individualCredentials).toEqual({ apiKey: 'newApiKey' });
            expect(vaultClient.skyflowCredentials).toEqual({ token: 'newToken' });
            expect(vaultClient.logLevel).toBe(LogLevel.DEBUG);
            expect(vaultClient.updateTriggered).toBe(true);
        });
    });

    describe('initAPI', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        test('should initialize RecordsApi for INSERT', () => {
            vaultClient.initAPI(authInfo, TYPES.INSERT);
            expect(Records).toHaveBeenCalled();
        });

        test('should initialize TokensApi for TOKENIZE', () => {
            vaultClient.initAPI(authInfo, TYPES.TOKENIZE);
            expect(Tokens).toHaveBeenCalled();
        });

        test('should initialize QueryApi for QUERY', () => {
            vaultClient.initAPI(authInfo, TYPES.QUERY);
            expect(Query).toHaveBeenCalled();
        });

        test('should not initialize API for unsupported type', () => {
            vaultClient.initAPI(authInfo, 'UNSUPPORTED');
            expect(Records).not.toHaveBeenCalled();
            expect(Tokens).not.toHaveBeenCalled();
            expect(Query).not.toHaveBeenCalled();
        });
    });

    describe('getCredentials', () => {
        test('should return API key if authInfo type is API_KEY', () => {
            vaultClient.authInfo = { key: apiKey, type: AuthType.API_KEY };
            const credentials = vaultClient.getCredentials();
            expect(credentials).toEqual({ apiKey });
        });

        test('should return token if authInfo type is TOKEN and token is not expired', () => {
            isExpired.mockReturnValue(false);
            vaultClient.authInfo = { key: token, type: AuthType.TOKEN };
            const credentials = vaultClient.getCredentials();
            expect(credentials).toEqual({ token });
        });

        test('should return individualCredentials if token is expired', () => {
            isExpired.mockReturnValue(true);
            vaultClient.authInfo = { key: token, type: AuthType.TOKEN };
            const credentials = vaultClient.getCredentials();
            expect(credentials).toEqual({ apiKey });
        });

        test('should return skyflowCredentials if no individualCredentials exist', () => {
            vaultClient.individualCredentials = undefined;
            const credentials = vaultClient.getCredentials();
            expect(credentials).toEqual({ token });
        });
    });

    describe('getLogLevel and setLogLevel', () => {
        test('should return current log level', () => {
            expect(vaultClient.getLogLevel()).toBe(LogLevel.INFO);
        });

        test('should update the log level', () => {
            vaultClient.setLogLevel(LogLevel.DEBUG);
            expect(vaultClient.getLogLevel()).toBe(LogLevel.DEBUG);
        });
    });

    describe('updateSkyflowCredentials', () => {
        test('should update skyflow credentials', () => {
            const newCredentials = { token: 'new_token_456' };
            vaultClient.updateSkyflowCredentials(newCredentials);
            expect(vaultClient.skyflowCredentials).toEqual(newCredentials);
        });
    });

    describe('getCredentials', () => {

        test('should return undefined if authInfo is undefined', () => {
            vaultClient.authInfo = undefined;
            const credentials = vaultClient.getCredentials();
            expect(credentials).toEqual({ apiKey }); // Should fall back to skyflowCredentials
        });

        test('should return individualCredentials if authInfo.key is undefined', () => {
            vaultClient.authInfo = { key: undefined, type: AuthType.API_KEY };
            const credentials = vaultClient.getCredentials();
            expect(credentials).toEqual({ apiKey }); // Should fall back to skyflowCredentials
        });

        test('should return individualCredentials if both credentials are undefined', () => {
            vaultClient.individualCredentials = undefined;
            vaultClient.skyflowCredentials = undefined;
            const credentials = vaultClient.getCredentials();
            expect(credentials).toBeUndefined(); // Should return undefined
        });
    });

    describe('failureResponse', () => {
        test('should handle JSON error responses with rawResponse correctly', async () => {
            const errorResponse = {
                rawResponse: {
                    headers: new Map([
                        ['content-type', 'application/json'],
                        ['x-request-id', 'abc-123'],
                    ]),
                },
                body: {
                    error: {
                        message: 'JSON error occurred',
                        http_code: 400,
                        grpc_code: 3,
                        details: [],
                    },
                },
                statusCode: 400,
            };
            try {
                await vaultClient.failureResponse(errorResponse);
            } catch (err) {
                expect(err).toBeInstanceOf(SkyflowError);
            }
        });

        test('should handle text error responses with rawResponse correctly', async () => {
            const errorResponse = {
                rawResponse: {
                    headers: new Map([
                        ['content-type', 'text/plain'],
                        ['x-request-id', 'abc-123'],
                    ]),
                },
                body: {
                    error: {
                        message: 'Text error occurred',
                    },
                },
                statusCode: 500,
            };

            try {
                await vaultClient.failureResponse(errorResponse);
            } catch (err) {
                expect(err).toBeInstanceOf(SkyflowError);
            }
        });

        test('should handle generic error responses with rawResponse correctly', async () => {
            const errorResponse = {
                rawResponse: {
                    headers: new Map([
                        ['x-request-id', 'abc-123'],
                    ]),
                },
                body: {
                    error: {
                        message: 'Generic error occurred',
                        grpc_code: 5,
                    },
                },
                statusCode: 500,
            };

            try {
                await vaultClient.failureResponse(errorResponse);
            } catch (err) {
                expect(err).toBeInstanceOf(SkyflowError);
            }
        });
        
        test('should handle rawResponse with error-from-client header correctly', async () => {
            const errorResponse = {
                rawResponse: {
                    headers: new Map([
                        ['content-type', 'application/json'],
                        ['x-request-id', 'abc-123'],
                        ['error-from-client', 'true'],
                    ]),
                },
                body: {
                    error: {
                        message: 'Client error occurred',
                        http_code: 403,
                        grpc_code: 7,
                        details: [],
                    },
                },
                statusCode: 403,
            };

            try {
                await vaultClient.failureResponse(errorResponse);
            } catch (err) {
                expect(err).toBeInstanceOf(SkyflowError);
            }
        });


        test('should handle JSON error responses without rawResponse correctly', async () => {
            const errorResponse = {
                    headers: new Map([
                        ['content-type', 'application/json'],
                        ['x-request-id', 'abc-123'],
                        ['error-from-client', 'true'],
                    ]),
                    data: {
                        error: {
                            message: 'JSON error occurred',
                            http_status: 400,
                            grpc_code: 3,
                            details: [{ field: 'field1', issue: 'issue1' }],
                        },
                    },
                    status: 400,
            };

            try {
                await vaultClient.failureResponse(errorResponse);
            } catch (err) {
                expect(err).toBeInstanceOf(SkyflowError);
            }
        });


        test('should handle text error responses without rawResponse correctly', async () => {
            const errorResponse = {
                    headers: new Map([
                        ['content-type', 'text/plain'],
                        ['x-request-id', 'abc-123'],
                    ]),
                    data: 'Text error occurred',
                    status: 500,
            };

            try {
                await vaultClient.failureResponse(errorResponse);
            } catch (err) {
                expect(err).toBeInstanceOf(SkyflowError);
            }
        });

        test('should handle generic error responses without rawResponse correctly', async () => {
            const errorResponse = {
                    headers: new Map([
                        ['x-request-id', 'abc-123'],
                    ]),
                    data: {
                        error: {
                            message: 'Generic error occurred',
                        },
                    },
                    status: 500,
            };

            try {
                await vaultClient.failureResponse(errorResponse);
            } catch (err) {
                expect(err).toBeInstanceOf(SkyflowError);
            }
        });

        test('should handle error responses without content-type correctly', async () => {
            const errorResponse = {
                    headers: new Map([
                        ['x-request-id', 'abc-123'],
                    ]),
                    data: {
                        error: {
                            message: 'Error without content-type',
                        },
                    },
                    status: 500,
            };

            try {
                await vaultClient.failureResponse(errorResponse);
            } catch (err) {
                expect(err).toBeInstanceOf(SkyflowError);
            }
        });

        test('should handle error responses with error-from-client header correctly', async () => {
            const errorResponse = {
                    headers: new Map([
                        ['content-type', 'application/json'],
                        ['x-request-id', 'abc-123'],
                        ['error-from-client', 'true'],
                    ]),
                    data: {
                        error: {
                            message: 'Client error occurred',
                            http_status: 403,
                            grpc_code: 7,
                            details: [],
                        },
                    },
                    status: 403,
            };

            try {
                await vaultClient.failureResponse(errorResponse);
            } catch (err) {
                expect(err).toBeInstanceOf(SkyflowError);
            }
        });

        test('should handle error response with non-JSON non-text content-type (rawResponse)', async () => {
            const errorResponse = {
                rawResponse: {
                    headers: new Map([
                        ['content-type', 'application/xml'],
                        ['x-request-id', 'abc-123'],
                    ]),
                },
                body: {
                    error: {
                        message: 'XML error occurred',
                        grpc_code: 2,
                    },
                },
                statusCode: 400,
            };
            try {
                await vaultClient.failureResponse(errorResponse);
            } catch (err) {
                expect(err).toBeInstanceOf(SkyflowError);
            }
        });

        test('should handle error response with non-JSON non-text content-type (legacy)', async () => {
            const errorResponse = {
                headers: new Map([
                    ['content-type', 'application/xml'],
                    ['x-request-id', 'abc-123'],
                ]),
                data: {
                    error: {
                        message: 'XML error occurred',
                    },
                },
                status: 400,
            };
            try {
                await vaultClient.failureResponse(errorResponse);
            } catch (err) {
                expect(err).toBeInstanceOf(SkyflowError);
            }
        });

        test('should handle text error response with error-from-client header (rawResponse)', async () => {
            const errorResponse = {
                rawResponse: {
                    headers: new Map([
                        ['content-type', 'text/plain'],
                        ['x-request-id', 'abc-123'],
                        ['error-from-client', 'true'],
                    ]),
                },
                body: {
                    error: {
                        message: 'Text error from client',
                    },
                },
                statusCode: 400,
            };
            try {
                await vaultClient.failureResponse(errorResponse);
            } catch (err) {
                expect(err).toBeInstanceOf(SkyflowError);
            }
        });

        test('should handle text error response with error-from-client header (legacy)', async () => {
            const errorResponse = {
                headers: new Map([
                    ['content-type', 'text/plain'],
                    ['x-request-id', 'abc-123'],
                    ['error-from-client', 'true'],
                ]),
                data: {
                    error: {
                        message: 'Text error from client',
                    },
                },
                status: 400,
            };
            try {
                await vaultClient.failureResponse(errorResponse);
            } catch (err) {
                expect(err).toBeInstanceOf(SkyflowError);
            }
        });

        test('should handle generic error response with error-from-client header (rawResponse)', async () => {
            const errorResponse = {
                rawResponse: {
                    headers: new Map([
                        ['x-request-id', 'abc-123'],
                        ['error-from-client', 'true'],
                    ]),
                },
                body: {
                    error: {
                        message: 'Generic error from client',
                        grpc_code: 3,
                    },
                },
                statusCode: 400,
            };
            try {
                await vaultClient.failureResponse(errorResponse);
            } catch (err) {
                expect(err).toBeInstanceOf(SkyflowError);
            }
        });

        test('should handle generic error response with error-from-client header (legacy)', async () => {
            const errorResponse = {
                headers: new Map([
                    ['x-request-id', 'abc-123'],
                    ['error-from-client', 'true'],
                ]),
                data: {
                    error: {
                        message: 'Generic error from client',
                    },
                },
                status: 400,
            };
            try {
                await vaultClient.failureResponse(errorResponse);
            } catch (err) {
                expect(err).toBeInstanceOf(SkyflowError);
            }
        });

        test('should handle JSON error with non-array details and error-from-client false (rawResponse)', async () => {
            const errorResponse = {
                rawResponse: {
                    headers: new Map([
                        ['content-type', 'application/json'],
                        ['x-request-id', 'req-1'],
                        ['error-from-client', 'false'],
                    ]),
                },
                body: {
                    error: {
                        message: 'JSON error',
                        http_code: 400,
                        grpc_code: 3,
                        details: { field: 'issue' },
                    },
                },
                statusCode: 400,
            };
            await expect(vaultClient.failureResponse(errorResponse)).rejects.toBeInstanceOf(SkyflowError);
        });

        test('should handle legacy JSON error without message using default description', async () => {
            const errorResponse = {
                headers: new Map([
                    ['content-type', 'application/json'],
                    ['x-request-id', 'req-legacy'],
                ]),
                body: {
                    error: {
                        http_code: 500,
                        grpc_code: 13,
                        details: [],
                    },
                },
                status: 500,
            };
            await expect(vaultClient.failureResponse(errorResponse)).rejects.toBeInstanceOf(SkyflowError);
        });

        test('should handle legacy JSON error with non-array details and error-from-client', async () => {
            const errorResponse = {
                headers: new Map([
                    ['content-type', 'application/json'],
                    ['x-request-id', 'req-legacy-2'],
                    ['error-from-client', 'true'],
                ]),
                body: {
                    error: {
                        message: 'Legacy JSON',
                        http_code: 403,
                        details: 'not-an-array',
                    },
                },
                status: 403,
            };
            await expect(vaultClient.failureResponse(errorResponse)).rejects.toBeInstanceOf(SkyflowError);
        });

        test('should handle new-format text error using rawBody when message is missing', async () => {
            const errorResponse = {
                rawResponse: {
                    headers: new Map([
                        ['content-type', 'text/plain'],
                        ['x-request-id', 'req-text'],
                    ]),
                },
                body: {
                    error: {},
                    rawBody: 'plain text failure',
                },
                statusCode: 500,
            };
            await expect(vaultClient.failureResponse(errorResponse)).rejects.toBeInstanceOf(SkyflowError);
        });

        test('should handle legacy text error without message in body', async () => {
            const errorResponse = {
                headers: new Map([
                    ['content-type', 'text/plain'],
                    ['x-request-id', 'req-text-legacy'],
                ]),
                body: {
                    error: {},
                },
                status: 500,
            };
            await expect(vaultClient.failureResponse(errorResponse)).rejects.toBeInstanceOf(SkyflowError);
        });

        test('should handle new-format generic error using top-level message', async () => {
            const errorResponse = {
                rawResponse: {
                    headers: new Map([
                        ['x-request-id', 'req-generic'],
                    ]),
                },
                message: 'Top-level API failure',
                body: {},
                statusCode: 502,
            };
            await expect(vaultClient.failureResponse(errorResponse)).rejects.toBeInstanceOf(SkyflowError);
        });

        test('should handle new-format generic error with undefined headers', async () => {
            const errorResponse = {
                rawResponse: {
                    headers: undefined,
                },
                body: {
                    error: {
                        message: 'No headers error',
                        grpc_code: 2,
                        details: [],
                    },
                },
                statusCode: 400,
            };
            await expect(vaultClient.failureResponse(errorResponse)).rejects.toBeInstanceOf(SkyflowError);
        });

        test('should handle legacy generic error with non-array details and error-from-client', async () => {
            const errorResponse = {
                headers: new Map([
                    ['x-request-id', 'req-gen-legacy'],
                    ['error-from-client', 'true'],
                ]),
                body: {
                    error: {
                        message: 'Legacy generic',
                        details: { code: 'X' },
                    },
                },
                status: 500,
            };
            await expect(vaultClient.failureResponse(errorResponse)).rejects.toBeInstanceOf(SkyflowError);
        });

        test('should handle new-format JSON error without error-from-client header', async () => {
            const errorResponse = {
                rawResponse: {
                    headers: new Map([
                        ['content-type', 'application/json'],
                        ['x-request-id', 'req-no-client-flag'],
                    ]),
                },
                body: {
                    error: {
                        message: 'Server error',
                        http_code: 500,
                        grpc_code: 13,
                        details: [],
                    },
                },
                statusCode: 500,
            };
            await expect(vaultClient.failureResponse(errorResponse)).rejects.toBeInstanceOf(SkyflowError);
        });

        test('should handle new-format JSON error without message in error body', async () => {
            const errorResponse = {
                rawResponse: {
                    headers: new Map([
                        ['content-type', 'application/json'],
                        ['x-request-id', 'req-no-msg'],
                    ]),
                },
                body: {
                    error: {
                        http_status: '400',
                        grpc_code: 3,
                        details: [],
                    },
                },
                statusCode: 400,
            };
            await expect(vaultClient.failureResponse(errorResponse)).rejects.toBeInstanceOf(SkyflowError);
        });

        test('should handle new-format JSON error with array details and error-from-client', async () => {
            const errorResponse = {
                rawResponse: {
                    headers: new Map([
                        ['content-type', 'application/json'],
                        ['x-request-id', 'req-arr-details'],
                        ['error-from-client', 'true'],
                    ]),
                },
                body: {
                    error: {
                        message: 'Validation failed',
                        http_code: 400,
                        grpc_code: 3,
                        details: [{ field: 'name' }],
                    },
                },
                statusCode: 400,
            };
            await expect(vaultClient.failureResponse(errorResponse)).rejects.toBeInstanceOf(SkyflowError);
        });

        test('should handle legacy JSON error without error-from-client header', async () => {
            const errorResponse = {
                headers: new Map([
                    ['content-type', 'application/json'],
                    ['x-request-id', 'req-legacy-no-flag'],
                ]),
                body: {
                    error: {
                        message: 'Legacy without flag',
                        http_code: 400,
                        details: [{ issue: 'bad' }],
                    },
                },
                status: 400,
            };
            await expect(vaultClient.failureResponse(errorResponse)).rejects.toBeInstanceOf(SkyflowError);
        });

        test('should handle new-format text error with message in body', async () => {
            const errorResponse = {
                rawResponse: {
                    headers: new Map([
                        ['content-type', 'text/plain'],
                        ['x-request-id', 'req-text-msg'],
                    ]),
                },
                body: {
                    error: {
                        message: 'Text error message',
                        http_code: 503,
                        grpc_code: 14,
                    },
                },
                statusCode: 503,
            };
            await expect(vaultClient.failureResponse(errorResponse)).rejects.toBeInstanceOf(SkyflowError);
        });

        test('should handle new-format generic error with body error message', async () => {
            const errorResponse = {
                rawResponse: {
                    headers: new Map([['x-request-id', 'req-gen-msg']]),
                },
                body: {
                    error: {
                        message: 'Structured generic error',
                        grpc_code: 4,
                        details: ['detail-a'],
                    },
                },
                statusCode: 502,
            };
            await expect(vaultClient.failureResponse(errorResponse)).rejects.toBeInstanceOf(SkyflowError);
        });

        test('should set errorFromClient to false when header is false (rawResponse)', async () => {
            const errorResponse = {
                rawResponse: {
                    headers: new Map([
                        ['content-type', 'application/json'],
                        ['x-request-id', 'req-false-flag'],
                        ['error-from-client', 'false'],
                    ]),
                },
                body: {
                    error: {
                        message: 'Client flagged false',
                        http_code: 400,
                        details: [],
                    },
                },
                statusCode: 400,
            };
            await expect(vaultClient.failureResponse(errorResponse)).rejects.toBeInstanceOf(SkyflowError);
        });

        test('should set errorFromClient to false when header is false (legacy)', async () => {
            const errorResponse = {
                headers: new Map([
                    ['content-type', 'application/json'],
                    ['x-request-id', 'req-legacy-false-flag'],
                    ['error-from-client', 'false'],
                ]),
                body: {
                    error: {
                        message: 'Legacy client flagged false',
                        http_code: 400,
                        details: [],
                    },
                },
                status: 400,
            };
            await expect(vaultClient.failureResponse(errorResponse)).rejects.toBeInstanceOf(SkyflowError);
        });

        test('should use statusCode on new-format error when body http_code is missing', async () => {
            const errorResponse = {
                rawResponse: {
                    headers: new Map([
                        ['content-type', 'application/json'],
                        ['x-request-id', 'req-status-only'],
                    ]),
                },
                body: {
                    error: {
                        message: 'Status only',
                        grpc_code: 3,
                    },
                },
                statusCode: 418,
            };
            await expect(vaultClient.failureResponse(errorResponse)).rejects.toBeInstanceOf(SkyflowError);
        });

        test('should use legacy http_code in logAndRejectError when isNewFormat is false', async () => {
            const errorResponse = {
                headers: new Map([
                    ['content-type', 'application/json'],
                    ['x-request-id', 'req-legacy-http'],
                ]),
                body: {
                    error: {
                        message: 'Legacy http code',
                        http_code: 422,
                        grpc_code: 9,
                    },
                },
                status: 422,
            };
            await expect(vaultClient.failureResponse(errorResponse)).rejects.toBeInstanceOf(SkyflowError);
        });
    });

    describe('error handler internals', () => {
        const reject = jest.fn();

        beforeEach(() => {
            reject.mockClear();
        });

        test('normalizeErrorMeta handles new and legacy header shapes', () => {
            const newMeta = vaultClient['normalizeErrorMeta']({
                rawResponse: {
                    headers: new Map([
                        ['content-type', 'application/json'],
                        ['x-request-id', 'req-1'],
                        ['error-from-client', 'false'],
                    ]),
                },
            });
            expect(newMeta.isNewFormat).toBe(true);
            expect(newMeta.requestId).toBe('req-1');
            expect(newMeta.errorFromClient).toBe(false);

            const legacyMeta = vaultClient['normalizeErrorMeta']({
                headers: new Map([['x-request-id', 'legacy-req']]),
            });
            expect(legacyMeta.isNewFormat).toBe(false);
            expect(legacyMeta.requestId).toBe('legacy-req');
            expect(legacyMeta.errorFromClient).toBeUndefined();
        });

        test('handleJsonError covers new and legacy branches', () => {
            vaultClient['handleJsonError']({
                rawResponse: { headers: new Map() },
                body: { error: { message: 'new', http_status: '400', details: [] } },
                statusCode: 400,
            }, { message: 'new' }, 'req', reject, true);

            vaultClient['handleJsonError']({
                headers: new Map([['content-type', 'application/json']]),
                body: { error: { http_code: 422, details: 'x' } },
            }, { http_code: 422 }, 'legacy-req', reject, false);

            expect(reject).toHaveBeenCalled();
        });

        test('handleTextError covers new and legacy branches', () => {
            vaultClient['handleTextError']({
                rawResponse: { headers: new Map() },
                body: { error: { message: 'text' }, rawBody: 'fallback' },
            }, { message: 'text' }, 'req', reject, true);

            vaultClient['handleTextError']({
                headers: new Map([['content-type', 'text/plain']]),
                body: { error: {} },
            }, {}, 'legacy-req', reject, false);

            expect(reject).toHaveBeenCalled();
        });

        test('handleGenericError covers message fallbacks', () => {
            vaultClient['handleGenericError']({
                rawResponse: { headers: new Map() },
                message: 'top-level',
                body: { error: { grpc_code: 1 } },
            }, 'req', reject, undefined);

            vaultClient['handleGenericError']({
                rawResponse: { headers: new Map() },
                body: {},
            }, 'req-no-body', reject, undefined);

            vaultClient['handleGenericError']({
                headers: new Map(),
                body: { error: { message: 'legacy generic' } },
            }, 'legacy-req', reject, true);

            expect(reject).toHaveBeenCalled();
        });

        test('handleJsonError uses non-array details when errorFromClient is set', () => {
            vaultClient['handleJsonError']({
                rawResponse: { headers: new Map() },
                body: { error: { message: 'err', details: { reason: 'x' } } },
            }, { message: 'err', details: { reason: 'x' } }, 'req', reject, true);
            expect(reject).toHaveBeenCalled();
        });

        test('handleTextError uses rawBody fallback for new-format errors', () => {
            vaultClient['handleTextError']({
                rawResponse: { headers: new Map() },
                body: { error: {}, rawBody: 'raw failure text' },
            }, { rawBody: 'raw failure text' }, 'req', reject, true);
            expect(reject).toHaveBeenCalled();
        });

        test('logAndRejectError uses new and legacy http codes', () => {
            vaultClient['logAndRejectError'](
                'desc',
                { statusCode: 418, body: { error: {} } },
                'req',
                reject,
                undefined,
                3,
                [],
                true
            );
            vaultClient['logAndRejectError'](
                'legacy desc',
                { body: { error: { http_code: 409 } } },
                'legacy-req',
                reject,
                409,
                7,
                [],
                false
            );
            expect(reject).toHaveBeenCalledTimes(2);
        });
    });

    describe('getCredentials with updateTriggered', () => {
        test('should skip token reuse when updateTriggered is true', () => {
            isExpired.mockReturnValue(false);
            vaultClient.authInfo = { key: token, type: AuthType.TOKEN };
            vaultClient.updateTriggered = true;
            const credentials = vaultClient.getCredentials();
            expect(credentials).toEqual({ apiKey });
            expect(vaultClient.updateTriggered).toBe(false);
        });
    });

    describe('updateClientConfig', () => {
        test('should retain existing state when no new credentials are provided', () => {
            vaultClient.updateClientConfig(url, vaultId);
            expect(vaultClient.url).toBe(url);
            expect(vaultClient.vaultId).toBe(vaultId);
            expect(vaultClient.logLevel).toBe(LogLevel.ERROR);
        });
    });

    // ─── Supplier-based client reuse (new behaviour) ───────────────────────────

    describe('initAPI - client created only once (supplier pattern)', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            // Fresh client so no API instances carry over between tests
            vaultClient = new VaultClient(url, vaultId, { apiKey }, { token }, LogLevel.INFO);
        });

        test('Records client is created only once across repeated INSERT calls', () => {
            vaultClient.initAPI(authInfo, TYPES.INSERT);
            vaultClient.initAPI(authInfo, TYPES.INSERT);
            vaultClient.initAPI(authInfo, TYPES.INSERT);
            expect(Records).toHaveBeenCalledTimes(1);
        });

        test('Records client is created only once across INSERT, GET, UPDATE, DELETE, INSERT_BATCH, FILE_UPLOAD calls', () => {
            vaultClient.initAPI(authInfo, TYPES.INSERT);
            vaultClient.initAPI(authInfo, TYPES.GET);
            vaultClient.initAPI(authInfo, TYPES.UPDATE);
            vaultClient.initAPI(authInfo, TYPES.DELETE);
            vaultClient.initAPI(authInfo, TYPES.INSERT_BATCH);
            vaultClient.initAPI(authInfo, TYPES.FILE_UPLOAD);
            expect(Records).toHaveBeenCalledTimes(1);
        });

        test('Tokens client is created only once across repeated DETOKENIZE calls', () => {
            vaultClient.initAPI(authInfo, TYPES.DETOKENIZE);
            vaultClient.initAPI(authInfo, TYPES.DETOKENIZE);
            expect(Tokens).toHaveBeenCalledTimes(1);
        });

        test('Tokens client is created only once across DETOKENIZE and TOKENIZE calls', () => {
            vaultClient.initAPI(authInfo, TYPES.DETOKENIZE);
            vaultClient.initAPI(authInfo, TYPES.TOKENIZE);
            expect(Tokens).toHaveBeenCalledTimes(1);
        });

        test('Query client is created only once across repeated QUERY calls', () => {
            vaultClient.initAPI(authInfo, TYPES.QUERY);
            vaultClient.initAPI(authInfo, TYPES.QUERY);
            expect(Query).toHaveBeenCalledTimes(1);
        });

        test('Strings client is created only once across DEIDENTIFY_TEXT and REIDENTIFY_TEXT calls', () => {
            vaultClient.initAPI(authInfo, TYPES.DEIDENTIFY_TEXT);
            vaultClient.initAPI(authInfo, TYPES.REIDENTIFY_TEXT);
            expect(Strings).toHaveBeenCalledTimes(1);
        });

        test('Files client is created only once across DEIDENTIFY_FILE and DETECT_RUN calls', () => {
            vaultClient.initAPI(authInfo, TYPES.DEIDENTIFY_FILE);
            vaultClient.initAPI(authInfo, TYPES.DETECT_RUN);
            expect(Files).toHaveBeenCalledTimes(1);
        });

        test('each API type gets its own client (INSERT + DETOKENIZE + QUERY each create once)', () => {
            vaultClient.initAPI(authInfo, TYPES.INSERT);
            vaultClient.initAPI(authInfo, TYPES.DETOKENIZE);
            vaultClient.initAPI(authInfo, TYPES.QUERY);
            expect(Records).toHaveBeenCalledTimes(1);
            expect(Tokens).toHaveBeenCalledTimes(1);
            expect(Query).toHaveBeenCalledTimes(1);
        });

        test('Records instance is the same object reference after repeated calls', () => {
            vaultClient.initAPI(authInfo, TYPES.INSERT);
            const firstInstance = vaultClient.vaultAPI;
            vaultClient.initAPI(authInfo, TYPES.INSERT);
            expect(vaultClient.vaultAPI).toBe(firstInstance);
        });
    });

    describe('initAPI - supplier functions carry live values', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            vaultClient = new VaultClient(url, vaultId, { apiKey }, { token }, LogLevel.INFO);
        });

        test('Records constructor receives a function for token (not a plain string)', () => {
            vaultClient.initAPI(authInfo, TYPES.INSERT);
            const opts = Records.mock.calls[0][0];
            expect(typeof opts.token).toBe('function');
        });

        test('Records constructor receives a function for baseUrl (not a plain string)', () => {
            vaultClient.initAPI(authInfo, TYPES.INSERT);
            const opts = Records.mock.calls[0][0];
            expect(typeof opts.baseUrl).toBe('function');
        });

        test('token supplier returns the token from authInfo at creation time', () => {
            vaultClient.initAPI(authInfo, TYPES.INSERT);
            const opts = Records.mock.calls[0][0];
            expect(opts.token()).toBe(token);
        });

        test('baseUrl supplier returns the url at creation time', () => {
            vaultClient.initAPI(authInfo, TYPES.INSERT);
            const opts = Records.mock.calls[0][0];
            expect(opts.baseUrl()).toBe(url);
        });

        test('token supplier reflects new token after second initAPI call — without recreating Records client', () => {
            vaultClient.initAPI(authInfo, TYPES.INSERT);
            const opts = Records.mock.calls[0][0];

            const newToken = 'refreshed_token_789';
            vaultClient.initAPI({ key: newToken, type: AuthType.TOKEN }, TYPES.INSERT);

            // Still only one Records instance
            expect(Records).toHaveBeenCalledTimes(1);
            // But supplier now returns the new token
            expect(opts.token()).toBe(newToken);
        });

        test('token supplier reflects expired-then-refreshed token without recreating Tokens client', () => {
            vaultClient.initAPI(authInfo, TYPES.DETOKENIZE);
            const opts = Tokens.mock.calls[0][0];

            const refreshedToken = 'token_after_expiry';
            vaultClient.initAPI({ key: refreshedToken, type: AuthType.TOKEN }, TYPES.DETOKENIZE);

            expect(Tokens).toHaveBeenCalledTimes(1);
            expect(opts.token()).toBe(refreshedToken);
        });

        test('baseUrl supplier reflects new url after updateClientConfig — without recreating Records client', () => {
            vaultClient.initAPI(authInfo, TYPES.INSERT);
            const opts = Records.mock.calls[0][0];

            const newUrl = 'https://updated-cluster.skyflow.com';
            vaultClient.updateClientConfig(newUrl, vaultId);

            // No second initAPI call needed — supplier reads this.url live
            expect(opts.baseUrl()).toBe(newUrl);
            // Client was never recreated
            expect(Records).toHaveBeenCalledTimes(1);
        });

        test('Records client is not recreated after updateClientConfig followed by initAPI', () => {
            vaultClient.initAPI(authInfo, TYPES.INSERT);
            vaultClient.updateClientConfig('https://new-cluster.skyflow.com', 'newVaultId');
            vaultClient.initAPI({ key: 'new_token', type: AuthType.TOKEN }, TYPES.INSERT);
            expect(Records).toHaveBeenCalledTimes(1);
        });

        test('Tokens constructor also receives supplier functions', () => {
            vaultClient.initAPI(authInfo, TYPES.DETOKENIZE);
            const opts = Tokens.mock.calls[0][0];
            expect(typeof opts.token).toBe('function');
            expect(typeof opts.baseUrl).toBe('function');
        });

        test('Query constructor also receives supplier functions', () => {
            vaultClient.initAPI(authInfo, TYPES.QUERY);
            const opts = Query.mock.calls[0][0];
            expect(typeof opts.token).toBe('function');
            expect(typeof opts.baseUrl).toBe('function');
        });

        test('Strings constructor also receives supplier functions', () => {
            vaultClient.initAPI(authInfo, TYPES.DEIDENTIFY_TEXT);
            const opts = Strings.mock.calls[0][0];
            expect(typeof opts.token).toBe('function');
            expect(typeof opts.baseUrl).toBe('function');
        });

        test('Files constructor also receives supplier functions', () => {
            vaultClient.initAPI(authInfo, TYPES.DEIDENTIFY_FILE);
            const opts = Files.mock.calls[0][0];
            expect(typeof opts.token).toBe('function');
            expect(typeof opts.baseUrl).toBe('function');
        });
    });
});

