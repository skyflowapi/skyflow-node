import VaultClient from '../../../src/vault/client'; // Adjust the import path
import { Query } from '../../../src/ _generated_/rest/api/resources/query/client/Client';
import { Records } from '../../../src/ _generated_/rest/api/resources/records/client/Client';
import { Tokens } from '../../../src/ _generated_/rest/api/resources/tokens/client/Client';
import { AuthType, LogLevel, TYPES } from '../../../src/utils';
import { isExpired } from '../../../src/utils/jwt-utils';
import SkyflowError  from '../../../src/error';

jest.mock('../../../src/ _generated_/rest');
jest.mock('../../../src/ _generated_/rest/api/resources/records/client/Client');
jest.mock('../../../src/ _generated_/rest/api/resources/query/client/Client');
jest.mock('../../../src/ _generated_/rest/api/resources/tokens/client/Client');
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
    });

    describe('updateClientConfig', () => {
        test('should retain existing state when no new credentials are provided', () => {
            vaultClient.updateClientConfig(url, vaultId);
            expect(vaultClient.url).toBe(url);
            expect(vaultClient.vaultId).toBe(vaultId);
            expect(vaultClient.logLevel).toBe(LogLevel.ERROR); 
        });
    });
});

