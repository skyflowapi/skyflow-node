import VaultClient from '../../../src/vault/client'; // Adjust the import path
import { Configuration, QueryApi, RecordsApi, TokensApi } from '../../../src/ _generated_/rest';
import { AuthType, LogLevel, TYPES } from '../../../src/utils';
import { isExpired } from '../../../src/utils/jwt-utils';

jest.mock('../../../src/ _generated_/rest');
jest.mock('../../../src/utils/jwt-utils');

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
            expect(RecordsApi).toHaveBeenCalledWith(expect.any(Configuration));
        });

        test('should initialize RecordsApi for FILE_UPLOAD', () => {
            vaultClient.initAPI(authInfo, TYPES.FILE_UPLOAD);
            expect(RecordsApi).toHaveBeenCalledWith(expect.any(Configuration));
        });

        test('should initialize RecordsApi for GET', () => {
            vaultClient.initAPI(authInfo, TYPES.GET);
            expect(RecordsApi).toHaveBeenCalledWith(expect.any(Configuration));
        });

        test('should initialize RecordsApi for INSERT', () => {
            vaultClient.initAPI(authInfo, TYPES.INSERT);
            expect(RecordsApi).toHaveBeenCalledWith(expect.any(Configuration));
        });

        test('should initialize RecordsApi for INSERT_BATCH', () => {
            vaultClient.initAPI(authInfo, TYPES.INSERT_BATCH);
            expect(RecordsApi).toHaveBeenCalledWith(expect.any(Configuration));
        });

        test('should initialize RecordsApi for UPDATE', () => {
            vaultClient.initAPI(authInfo, TYPES.UPDATE);
            expect(RecordsApi).toHaveBeenCalledWith(expect.any(Configuration));
        });

        test('should initialize TokensApi for DETOKENIZE', () => {
            vaultClient.initAPI(authInfo, TYPES.DETOKENIZE);
            expect(TokensApi).toHaveBeenCalledWith(expect.any(Configuration));
        });

        test('should initialize TokensApi for TOKENIZE', () => {
            vaultClient.initAPI(authInfo, TYPES.TOKENIZE);
            expect(TokensApi).toHaveBeenCalledWith(expect.any(Configuration));
        });

        test('should initialize QueryApi for QUERY', () => {
            vaultClient.initAPI(authInfo, TYPES.QUERY);
            expect(QueryApi).toHaveBeenCalledWith(expect.any(Configuration));
        });

        test('should not initialize API for unsupported type', () => {
            vaultClient.initAPI(authInfo, 'UNSUPPORTED_TYPE');
            expect(RecordsApi).not.toHaveBeenCalled();
            expect(TokensApi).not.toHaveBeenCalled();
            expect(QueryApi).not.toHaveBeenCalled();
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
            expect(RecordsApi).toHaveBeenCalledWith(expect.any(Configuration));
        });

        test('should initialize TokensApi for TOKENIZE', () => {
            vaultClient.initAPI(authInfo, TYPES.TOKENIZE);
            expect(TokensApi).toHaveBeenCalledWith(expect.any(Configuration));
        });

        test('should initialize QueryApi for QUERY', () => {
            vaultClient.initAPI(authInfo, TYPES.QUERY);
            expect(QueryApi).toHaveBeenCalledWith(expect.any(Configuration));
        });

        test('should not initialize API for unsupported type', () => {
            vaultClient.initAPI(authInfo, 'UNSUPPORTED');
            expect(RecordsApi).not.toHaveBeenCalled();
            expect(TokensApi).not.toHaveBeenCalled();
            expect(QueryApi).not.toHaveBeenCalled();
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

    describe('getLogLevel and updateLogLevel', () => {
        test('should return current log level', () => {
            expect(vaultClient.getLogLevel()).toBe(LogLevel.INFO);
        });

        test('should update the log level', () => {
            vaultClient.updateLogLevel(LogLevel.DEBUG);
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
});

