import {
    generateBearerToken,
    generateBearerTokenFromCreds,
    getToken,
    successResponse,
    failureResponse,
    getRolesForScopedToken,
    generateSignedDataTokens,
    generateSignedDataTokensFromCreds,
} from "../../src/service-account";
import SKYFLOW_ERROR_CODE from '../../src/error/codes';
import SkyflowError from '../../src/error';
import errorMessages from '../../src/error/messages';
import jwt from 'jsonwebtoken';
import { LogLevel } from "../../src/utils";

const validCredentials = {
    clientID: "test-client-id",
    keyID: "test-key-id",
    tokenURI: "https://test-token-uri.com",
    privateKey: "KEY",
    data: "DATA",
};

jest.mock('../../src/service-account/client', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      authApi: {
        authenticationServiceGetAuthToken: jest.fn(() => ({
          withRawResponse: jest.fn().mockResolvedValueOnce({
            data: {
              accessToken: 'mocked_access_token',
              tokenType: 'Bearer',
            },
            rawResponse: { headers: { get: jest.fn().mockReturnValue('request-id-123') } }
          })
        }))
      }
    }))
  };
});

describe("File Validity Tests", () => {
    const testCases = [
        { description: "invalid JSON", filePath: "test/demo-credentials/invalidJson.json" },
        { description: "empty JSON", filePath: "test/demo-credentials/empty.json" },
        { description: "no client ID", filePath: "test/demo-credentials/noClientId.json" },
        { description: "no key ID", filePath: "test/demo-credentials/noKeyId.json" },
        { description: "no private key", method: generateBearerToken, filePath: "test/demo-credentials/noPrivateKey.json" },
        { description: "no token URI key", filePath: "test/demo-credentials/noTokenURI.json" },
        { description: "generateBearerTokenFromCreds test", method: generateBearerTokenFromCreds, filePath: "{}" },
        { description: "file does not exist", method: generateBearerToken, filePath: 'invalid-file-path.json' },
        { description: "get token with non-string credentials", method: getToken, credentials: { credentials: "non-string" } }
    ];

    testCases.forEach(({ description, method = generateBearerToken, filePath, credentials }) => {
        test(description, async () => {
            await expect(method(filePath || credentials)).rejects.toBeDefined();
        });
    });

    test("Success response processing", async () => {
        const success = await successResponse({
            data: {
                accessToken: "access token",
                tokenType: "Bearer"
            }
        });
        expect(success).toBeDefined();
    });

    const errorCases = [
        {
            description: "failure response processing JSON",
            errorData: {
                response: {
                    headers: {
                        'x-request-id': 'RID',
                        'content-type': 'application/json'
                    },
                    data: {
                        error: {
                            message: "Internal Server Error"
                        }
                    }
                }
            }
        },
        {
            description: "failure response processing Plain text",
            errorData: {
                response: {
                    headers: {
                        'x-request-id': 'RID',
                        'content-type': 'text/plain'
                    },
                    data: {
                        error: {
                            message: "Internal Server Error"
                        }
                    }
                }
            }
        },
        {
            description: "failure response processing Unknown format",
            errorData: {
                response: {
                    headers: {
                        'x-request-id': 'RID',
                        'content-type': 'invalid-type'
                    },
                    data: {
                        error: {
                            message: "Internal Server Error"
                        }
                    }
                }
            }
        }
    ];

    errorCases.forEach(({ description, errorData }) => {
        test(description, async () => {
            await expect(failureResponse(errorData)).rejects.toBeDefined();
        });
    });
});

describe("Context and Scoped Token Options Tests", () => {
    const credsWithoutContext = process.env.SA_WITHOUT_CONTEXT || JSON.stringify(validCredentials);

    const credentials = {
        clientID: "test-client-id",
        keyID: "test-key-id",
        tokenURI: "https://test-token-uri.com",
        privateKey: null,
        data: "no-data",
    };


    test("Empty roleID array passed to generate scoped token", async () => {
        const expectedError = new SkyflowError({
            http_code: 400,
            message: errorMessages.INVALID_CREDENTIALS_STRING,
        });
        try {
            await generateBearerTokenFromCreds(credentials, { roleIds: [] });
        } catch (err) {
            expect(err.message).toBe(expectedError.message);
        }
    });

    test("Invalid type passed to generate scoped token", async () => {
        const expectedError = new SkyflowError({
            http_code: 400,
            message: errorMessages.INVALID_CREDENTIALS_STRING,
        });
        try {
            await generateBearerTokenFromCreds(credentials, { roleIds: true });
        } catch (err) {
            expect(err.message).toBe(expectedError.message);
        }
    });

    test("Empty roleID array passed to generate scoped token (without context)", async () => {
        const options = { roleIds: [] };
        try {
            await generateBearerTokenFromCreds(credsWithoutContext, options);
        } catch (err) {
            expect(err.message).toBe(errorMessages.EMPTY_ROLES);
        }
    });

    test("Invalid type passed to generate scoped token (without context)", async () => {
        const options = { roleIds: true };
        try {
            await generateBearerTokenFromCreds(credsWithoutContext, options);
        } catch (err) {
            expect(err.message).toBe(errorMessages.INVALID_ROLES_KEY_TYPE);
        }
    });

    test("String array passed as roleIDs", () => {
        const response = getRolesForScopedToken(["roleID1"]);
        expect(response).toStrictEqual("role:roleID1 ");
    });

    test("Empty array passed as roleIDs", () => {
        const roles = getRolesForScopedToken([]);
        expect(roles).toBeDefined();
    });

    test("Invalid type passed as roleIDs", () => {
        const roles = getRolesForScopedToken(undefined);
        expect(roles).toBeDefined();
    });
});

describe('Signed Data Token Generation Test', () => {
    const dataTokenCreds = "SIGNED_TOKEN_SA";
    const credentials = {
        clientID: "test-client-id",
        keyID: "test-key-id",
        tokenURI: "https://skyflow-test.com",
        privateKey: "KEY",
        data: "DATA",
    };
    const defaultOptions = { dataTokens: ['datatoken1'] };
    const invalidJSONFormat = "not in valid JSON format.";
    const credFileNotFound = "Credential file not found";

    test("Missing private key in credentials", async () => {
        try {
            await generateSignedDataTokens("test/demo-credentials/noPrivateKey.json", defaultOptions);
        } catch (err) {
            expect(err).toBeDefined();
        }
    });

    test("Missing token URI in credentials", async () => {
        try {
            await generateSignedDataTokens("test/demo-credentials/noTokenURI.json", defaultOptions);
        } catch (err) {
            expect(err).toBeDefined();
        }
    });

    test("Empty file path passed to generateSignedDataTokens", async () => {
        const emptyFilePath = 'test/demo-credentials/empty.json';
        try {
            await generateSignedDataTokens(emptyFilePath, defaultOptions);
        } catch (err) {
            expect(err.message).toContain(invalidJSONFormat);
        }
    });

    test("No file path passed to generateSignedDataTokens", async () => {
        try {
            await generateSignedDataTokens("", defaultOptions);
        } catch (err) {
            expect(err.message).toContain(credFileNotFound);
        }
    });

    test("Empty data token array passed", async () => {
        const options = { dataTokens: [] };
        try {
            await generateSignedDataTokensFromCreds(dataTokenCreds, options);
        } catch (err) {
            expect(err.message).toBe(errorMessages.EMPTY_DATA_TOKENS);
        }
    });

    test("Undefined data token array passed", async () => {
        const options = { dataTokens: undefined };
        try {
            await generateSignedDataTokensFromCreds(dataTokenCreds, options);
        } catch (err) {
            expect(err.message).toBe(errorMessages.EMPTY_DATA_TOKENS);
        }
    });

    test("Invalid data token type passed (string instead of array)", async () => {
        const options = { dataTokens: 'string' };  // Incorrect type
        try {
            await generateSignedDataTokensFromCreds(dataTokenCreds, options);
        } catch (err) {
            expect(err.message).toBe(errorMessages.DATA_TOKEN_KEY_TYPE);
        }
    });

    test("Invalid timeToLive type provided", async () => {
        const options = {
            dataTokens: ['token'],
            timeToLive: 'string'  // Invalid type
        };
        try {
            await generateSignedDataTokensFromCreds(dataTokenCreds, options);
        } catch (err) {
            expect(err.message).toBe(errorMessages.TIME_TO_LIVE_KET_TYPE);
        }
    });

    test("valid timeToLive type provided", async () => {
        const options = {
            dataTokens: ['token'],
            timeToLive: 10000  // valid type
        };
        jest.spyOn(jwt, 'sign').mockReturnValue('mocked_token');
        try {
            await generateSignedDataTokensFromCreds(JSON.stringify(credentials), options);
        } catch (err) {
            expect(err.message).toBe(errorMessages.TIME_TO_LIVE_KET_TYPE);
        }
    });

    test("Invalid credentials type provided", async () => {
        const options = { dataTokens: ['token'] };
        try {
            await generateSignedDataTokensFromCreds(true, options);  // Invalid type for credentials
        } catch (err) {
            expect(err.message).toBe(errorMessages.INVALID_CREDENTIALS_STRING);
        }
    });

    test("Missing Token URI in credentials file", async () => {
        const filePath = 'test/demo-credentials/noTokenURI.json';
        try {
            await generateSignedDataTokens(filePath, defaultOptions);
        } catch (err) {
            expect(err.message).toBe(errorMessages.MISSING_TOKEN_URI);
        }
    });

    test("Valid credentials file", async () => {
        const filePath = 'test/demo-credentials/valid.json';
        jest.spyOn(jwt, 'sign').mockReturnValue('mocked_token');
        const result = await generateSignedDataTokens(filePath, defaultOptions);
        expect(result).toHaveLength(1);
        expect(result[0].token).toBe('datatoken1');
        expect(result[0].signedToken).toContain('signed_token_');
    });

    test("File does not exist", async () => {
        const invalidFilePath = 'invalid-file-path.json';
        try {
            await generateSignedDataTokensFromCreds(invalidFilePath, defaultOptions);
        } catch (err) {
            expect(err.message).toContain(invalidJSONFormat);
        }
    });

    test("Empty credentials string passed to generateBearerTokenFromCreds", async () => {
        try {
            await generateBearerTokenFromCreds("{}", defaultOptions);
        } catch (err) {
            expect(err).toBeDefined();
        }
    });
});

describe('getToken Tests', () => {
    let mockClient;
    const credentials = {
        clientID: "test-client-id",
        keyID: "test-key-id",
        tokenURI: "https://test-token-uri.com", //
        privateKey: "KEY",
        data: "DATA",
    };

    const credentialsWithInvalidUrl = {
        clientID: "test-client-id",
        keyID: "test-key-id",
        tokenURI: "https://test-token-uri.com",
        privateKey: "KEY",
        data: "DATA",
    };

    const credentialsWithNoneUrl = {
        clientID: "test-client-id",
        keyID: "test-key-id",
        tokenURI: "test-token",
        privateKey: "KEY",
        data: "DATA",
    };

    const mockTokenResponse = {
        accessToken: 'mocked_access_token',
        tokenType: 'Bearer',
    };

    beforeEach(() => {
        mockClient = {
            authApi: {
                authenticationServiceGetAuthToken: jest.fn(),
            },
        };
        jest.spyOn(jwt, 'sign').mockReturnValue('mocked_token');
        jest.spyOn(jwt, 'sign').mockReturnValue('mocked_token');
    });

    afterEach(() => {
        jest.restoreAllMocks();  // Restore original implementations after each test
    });

    // Helper function to simplify repetitive test logic
    const runTokenTest = async (creds, logLevel = LogLevel.OFF) => {
        const result = await getToken(JSON.stringify(creds), { logLevel });
        expect(result).toBeDefined();
        expect(result.accessToken).toBe('mocked_access_token');
        expect(result.tokenType).toBe('Bearer');
    };

    test("should get Bearer Token with valid credentials", async () => {
        const filePath = 'test/demo-credentials/valid.json';
        mockClient.authApi.authenticationServiceGetAuthToken.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValueOnce({
                data: mockTokenResponse,
                rawResponse: { headers: { get: jest.fn().mockReturnValue('request-id-123') } }
            })
        }));
        await generateBearerToken(filePath, { logLevel: LogLevel.OFF });
    });

    test("should get token with credentials having invalid URL", async () => {
        try {
            await runTokenTest(credentialsWithInvalidUrl);
        } catch (err) {
            expect(err).toBeDefined();
        }
    });

    test("should get token with credentials having None URL", async () => {
        try {
            await runTokenTest(credentialsWithNoneUrl);
        } catch (err) {
            expect(err).toBeDefined();
        }
    });

    test("should use tokenUri from options if provided and valid", async () => {
        const validCredsString = JSON.stringify(validCredentials);
        const validTokenOptions = { tokenUri: "https://override-token-uri.com" };
        const getBaseUrlSpy = jest.spyOn(require('../../src/utils'), 'getBaseUrl');
        await getToken(validCredsString, validTokenOptions);
        expect(getBaseUrlSpy).toHaveBeenCalledWith(validTokenOptions.tokenUri);
    });

    test("should throw error if tokenUri in options is invalid", async () => {
        const validCredsString = JSON.stringify(validCredentials);
        const invalidOptions = { tokenUri: "not-a-valid-url" };
        await expect(getToken(validCredsString, invalidOptions)).rejects.toThrow();
    });
});


describe('getToken and getSignedTokens tokenUri override tests', () => {
    const validCreds = {
        clientID: "test-client-id",
        keyID: "test-key-id",
        tokenURI: "https://original-token-uri.com",
        privateKey: "KEY",
        data: "DATA",
    };

    const validCredsString = JSON.stringify(validCreds);

    const validSignedTokenOptions = {
        dataTokens: ['datatoken1'],
        tokenUri: "https://override-token-uri.com"
    };

    const validTokenOptions = {
        tokenUri: "https://override-token-uri.com"
    };

    beforeEach(() => {
        jest.spyOn(jwt, 'sign').mockReturnValue('mocked_token');
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('getToken uses tokenUri from options if provided', async () => {
        const getBaseUrlSpy = jest.spyOn(require('../../src/utils'), 'getBaseUrl');
        await getToken(validCredsString, validTokenOptions);
        expect(getBaseUrlSpy).toHaveBeenCalledWith(validTokenOptions.tokenUri);
    });

    test('generateSignedDataTokensFromCreds uses tokenUri from options if provided', async () => {
        let capturedClaims = null;
        jest.spyOn(jwt, 'sign').mockImplementation((claims, key, opts) => {
            capturedClaims = claims;
            return 'mocked_token';
        });
        await generateSignedDataTokensFromCreds(validCredsString, validSignedTokenOptions);
        expect(capturedClaims.aud).toBe(validSignedTokenOptions.tokenUri);
    });

    test('getToken throws error if tokenUri in options is invalid', async () => {
        const invalidOptions = { tokenUri: "not-a-valid-url" };
        await expect(getToken(validCredsString, invalidOptions)).rejects.toThrow();
    });

    test('generateSignedDataTokensFromCreds throws error if tokenUri in options is invalid', async () => {
        const invalidOptions = { dataTokens: ['datatoken1'], tokenUri: "not-a-valid-url" };
        await expect(generateSignedDataTokensFromCreds(validCredsString, invalidOptions)).rejects.toThrow();
    });

    test("outer catch triggered when jwt.sign throws", async () => {
        jest.spyOn(jwt, 'sign').mockImplementationOnce(() => { throw new Error('jwt sign failed'); });
        const validCreds = JSON.stringify({
            clientID: 'test-client-id',
            keyID: 'test-key-id',
            tokenURI: 'https://test-token-uri.com',
            privateKey: 'some-key',
        });
        await expect(getToken(validCreds)).rejects.toBeDefined();
    });

    test("withRawResponse rejection triggers lines 152-154", async () => {
        const Client = jest.requireMock('../../src/service-account/client').default;
        Client.mockImplementationOnce(() => ({
            authApi: {
                authenticationServiceGetAuthToken: jest.fn(() => ({
                    withRawResponse: jest.fn().mockRejectedValueOnce(new Error('API rejection'))
                }))
            }
        }));
        const validCreds = JSON.stringify({
            clientID: 'test-client-id',
            keyID: 'test-key-id',
            tokenURI: 'https://test-token-uri.com',
            privateKey: 'some-key',
        });
        await expect(getToken(validCreds)).rejects.toBeDefined();
    });

    test("ctx option provided covers line 108 truthy branch", async () => {
        const Client = jest.requireMock('../../src/service-account/client').default;
        Client.mockImplementationOnce(() => ({
            authApi: {
                authenticationServiceGetAuthToken: jest.fn(() => ({
                    withRawResponse: jest.fn().mockResolvedValueOnce({
                        data: { accessToken: 'mocked_access_token', tokenType: 'Bearer' },
                        rawResponse: { headers: { get: jest.fn().mockReturnValue('req-id') } }
                    })
                }))
            }
        }));
        const validCreds = JSON.stringify({
            clientID: 'test-client-id',
            keyID: 'test-key-id',
            tokenURI: 'https://test-token-uri.com',
            privateKey: 'some-key',
        });
        const result = await getToken(validCreds, { logLevel: LogLevel.OFF, ctx: 'test-context' });
        expect(result).toBeDefined();
    });

    test("roleIds option provided covers line 130 binary-expr right side", async () => {
        const Client = jest.requireMock('../../src/service-account/client').default;
        Client.mockImplementationOnce(() => ({
            authApi: {
                authenticationServiceGetAuthToken: jest.fn(() => ({
                    withRawResponse: jest.fn().mockResolvedValueOnce({
                        data: { accessToken: 'mocked_access_token', tokenType: 'Bearer' },
                        rawResponse: { headers: { get: jest.fn().mockReturnValue('req-id') } }
                    })
                }))
            }
        }));
        const validCreds = JSON.stringify({
            clientID: 'test-client-id',
            keyID: 'test-key-id',
            tokenURI: 'https://test-token-uri.com',
            privateKey: 'some-key',
        });
        const result = await getToken(validCreds, { logLevel: LogLevel.OFF, roleIds: ['role1', 'role2'] });
        expect(result).toBeDefined();
    });
});

describe('failureResponse with rawResponse', () => {
    const makeHeaders = (contentType) => ({
        get: (key) => key === 'content-type' ? contentType : 'request-id-123'
    });

    test("handles application/json content type", async () => {
        const err = {
            rawResponse: { headers: makeHeaders('application/json') },
            body: { error: { message: 'Server Error', http_code: 500 } },
        };
        await expect(failureResponse(err)).rejects.toBeDefined();
    });

    test("handles application/json with null body (fallback to body)", async () => {
        const err = {
            rawResponse: { headers: makeHeaders('application/json') },
            body: 'raw body string',
        };
        await expect(failureResponse(err)).rejects.toBeDefined();
    });

    test("handles text/plain content type", async () => {
        const err = {
            rawResponse: { headers: makeHeaders('text/plain') },
            body: 'plain text error message',
        };
        await expect(failureResponse(err)).rejects.toBeDefined();
    });

    test("handles unknown content type", async () => {
        const err = {
            rawResponse: { headers: makeHeaders('application/xml') },
            response: { status: 503 },
        };
        await expect(failureResponse(err)).rejects.toBeDefined();
    });

    test("handles application/json with error http_code and no request id", async () => {
        const err = {
            rawResponse: {
                headers: {
                    get: (key) =>
                        key === 'content-type' ? 'application/json' : undefined,
                },
            },
            body: { error: { message: 'structured error', http_code: 422 } },
        };
        await expect(failureResponse(err)).rejects.toMatchObject({
            error: expect.objectContaining({
                httpCode: 422,
                message: 'structured error',
            }),
        });
    });

    test("handles application/json when body has no error.message", async () => {
        const err = {
            rawResponse: { headers: makeHeaders('application/json') },
            body: { code: 'ERR', detail: 'no nested message' },
        };
        await expect(failureResponse(err)).rejects.toMatchObject({
            error: expect.objectContaining({
                message: { code: 'ERR', detail: 'no nested message' },
            }),
        });
    });

    test("handles rawResponse without headers", async () => {
        const err = {
            rawResponse: {},
            body: { error: { message: 'no headers' } },
        };
        await expect(failureResponse(err)).rejects.toBeDefined();
    });

    test("should use tokenUri from options if provided and valid", async () => {
        const validCredsString = JSON.stringify(validCredentials);
        const validTokenOptions = { tokenUri: "https://override-token-uri.com" };
        const signSpy = jest.spyOn(jwt, 'sign').mockReturnValue('mocked_token');
        const getBaseUrlSpy = jest.spyOn(require('../../src/utils'), 'getBaseUrl');
        await getToken(validCredsString, validTokenOptions);
        expect(getBaseUrlSpy).toHaveBeenCalledWith(validTokenOptions.tokenUri);
        signSpy.mockRestore();
        getBaseUrlSpy.mockRestore();
    });

    test("should throw error if tokenUri in options is invalid", async () => {
        const validCredsString = JSON.stringify(validCredentials);
        const invalidOptions = { tokenUri: "not-a-valid-url" };
        await expect(getToken(validCredsString, invalidOptions)).rejects.toThrow();
    });
});


describe('getToken and getSignedTokens tokenUri override tests', () => {
    const validCreds = {
        clientID: "test-client-id",
        keyID: "test-key-id",
        tokenURI: "https://original-token-uri.com",
        privateKey: "KEY",
        data: "DATA",
    };

    const validCredsString = JSON.stringify(validCreds);

    const validSignedTokenOptions = {
        dataTokens: ['datatoken1'],
        tokenUri: "https://override-token-uri.com"
    };

    const validTokenOptions = {
        tokenUri: "https://override-token-uri.com"
    };

    beforeEach(() => {
        jest.spyOn(jwt, 'sign').mockReturnValue('mocked_token');
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('getToken uses tokenUri from options if provided', async () => {
        const getBaseUrlSpy = jest.spyOn(require('../../src/utils'), 'getBaseUrl');
        await getToken(validCredsString, validTokenOptions);
        expect(getBaseUrlSpy).toHaveBeenCalledWith(validTokenOptions.tokenUri);
    });

    test('generateSignedDataTokensFromCreds uses tokenUri from options if provided', async () => {
        let capturedClaims = null;
        jest.spyOn(jwt, 'sign').mockImplementation((claims, key, opts) => {
            capturedClaims = claims;
            return 'mocked_token';
        });
        await generateSignedDataTokensFromCreds(validCredsString, validSignedTokenOptions);
        expect(capturedClaims.aud).toBe(validSignedTokenOptions.tokenUri);
    });

    test('getToken throws error if tokenUri in options is invalid', async () => {
        const invalidOptions = { tokenUri: "not-a-valid-url" };
        await expect(getToken(validCredsString, invalidOptions)).rejects.toThrow();
    });

    test('generateSignedDataTokensFromCreds throws error if tokenUri in options is invalid', async () => {
        const invalidOptions = { dataTokens: ['datatoken1'], tokenUri: "not-a-valid-url" };
        await expect(generateSignedDataTokensFromCreds(validCredsString, invalidOptions)).rejects.toThrow();
    });
});

describe('deprecated BearerTokenOptions.roleIDs normalization', () => {
    let warnSpy;

    beforeEach(() => {
        warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
        jest.spyOn(jwt, 'sign').mockReturnValue('mocked_token');
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('roleIDs is normalized to roleIds and logs deprecation warning', async () => {
        const Client = jest.requireMock('../../src/service-account/client').default;
        Client.mockImplementationOnce(() => ({
            authApi: {
                authenticationServiceGetAuthToken: jest.fn(() => ({
                    withRawResponse: jest.fn().mockResolvedValueOnce({
                        data: { accessToken: 'mocked_access_token', tokenType: 'Bearer' },
                        rawResponse: {
                            headers: { get: jest.fn().mockReturnValue('req-id') },
                        },
                    }),
                })),
            },
        }));
        const validCreds = JSON.stringify({
            clientID: 'test-client-id',
            keyID: 'test-key-id',
            tokenURI: 'https://test-token-uri.com',
            privateKey: 'some-key',
        });
        const result = await getToken(validCreds, {
            logLevel: LogLevel.WARN,
            roleIDs: ['role1', 'role2'],
        });
        expect(result).toBeDefined();
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('roleIDs'));
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('roleIds'));
    });

    test('roleIDs is not normalized when roleIds is already set', async () => {
        const Client = jest.requireMock('../../src/service-account/client').default;
        Client.mockImplementationOnce(() => ({
            authApi: {
                authenticationServiceGetAuthToken: jest.fn(() => ({
                    withRawResponse: jest.fn().mockResolvedValueOnce({
                        data: { accessToken: 'mocked_access_token', tokenType: 'Bearer' },
                        rawResponse: {
                            headers: { get: jest.fn().mockReturnValue('req-id') },
                        },
                    }),
                })),
            },
        }));
        const validCreds = JSON.stringify({
            clientID: 'test-client-id',
            keyID: 'test-key-id',
            tokenURI: 'https://test-token-uri.com',
            privateKey: 'some-key',
        });
        const result = await getToken(validCreds, {
            logLevel: LogLevel.WARN,
            roleIDs: ['role1'],
            roleIds: ['role2'],
        });
        expect(result).toBeDefined();
        expect(warnSpy).not.toHaveBeenCalledWith(
            expect.stringContaining('roleIDs'),
        );
    });

    test('undefined options passes through without normalization', async () => {
        const Client = jest.requireMock('../../src/service-account/client').default;
        Client.mockImplementationOnce(() => ({
            authApi: {
                authenticationServiceGetAuthToken: jest.fn(() => ({
                    withRawResponse: jest.fn().mockResolvedValueOnce({
                        data: { accessToken: 'mocked_access_token', tokenType: 'Bearer' },
                        rawResponse: {
                            headers: { get: jest.fn().mockReturnValue('req-id') },
                        },
                    }),
                })),
            },
        }));
        const validCreds = JSON.stringify({
            clientID: 'test-client-id',
            keyID: 'test-key-id',
            tokenURI: 'https://test-token-uri.com',
            privateKey: 'some-key',
        });
        await getToken(validCreds);
        expect(warnSpy).not.toHaveBeenCalledWith(
            expect.stringContaining('roleIDs'),
        );
    });
});

describe('service-account branch and line coverage', () => {
    const fs = require('fs');
    const os = require('os');
    const path = require('path');

    const writeTempCredentialsFile = (content) => {
        const filePath = path.join(
            os.tmpdir(),
            `sa-creds-${Date.now()}-${Math.random()}.json`,
        );
        fs.writeFileSync(filePath, content, 'utf8');
        return filePath;
    };

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('generateBearerToken rejects credential file with invalid JSON syntax', async () => {
        const filePath = writeTempCredentialsFile('{not-valid-json');
        try {
            await expect(generateBearerToken(filePath)).rejects.toMatchObject({
                error: expect.objectContaining({
                    httpCode: SKYFLOW_ERROR_CODE.INVALID_JSON_FILE.httpCode,
                }),
            });
        } finally {
            fs.unlinkSync(filePath);
        }
    });

    test('generateBearerToken rejects empty credential file', async () => {
        const filePath = writeTempCredentialsFile('');
        try {
            await expect(generateBearerToken(filePath)).rejects.toMatchObject({
                error: expect.objectContaining({
                    httpCode: SKYFLOW_ERROR_CODE.INVALID_JSON_FILE.httpCode,
                }),
            });
        } finally {
            fs.unlinkSync(filePath);
        }
    });

    test('getToken rejects credentials that are not valid JSON', async () => {
        await expect(getToken('{not-valid-json')).rejects.toMatchObject({
            error: expect.objectContaining({
                httpCode: SKYFLOW_ERROR_CODE.INVALID_JSON_FORMAT.httpCode,
            }),
        });
    });

    test('generateSignedDataTokens rejects credential file with invalid JSON syntax', async () => {
        const filePath = writeTempCredentialsFile('{not-valid-json');
        try {
            await expect(
                generateSignedDataTokens(filePath, { dataTokens: ['token'] }),
            ).rejects.toMatchObject({
                error: expect.objectContaining({
                    httpCode: SKYFLOW_ERROR_CODE.INVALID_JSON_FILE.httpCode,
                }),
            });
        } finally {
            fs.unlinkSync(filePath);
        }
    });

    test('generateSignedDataTokensFromCreds rejects empty credentials string', async () => {
        await expect(
            generateSignedDataTokensFromCreds('', { dataTokens: ['token'] }),
        ).rejects.toMatchObject({
            error: expect.objectContaining({
                httpCode: SKYFLOW_ERROR_CODE.EMPTY_CREDENTIALS_STRING.httpCode,
            }),
        });
    });

    test('generateSignedDataTokensFromCreds rejects credentials missing key ID', async () => {
        const creds = JSON.stringify({
            clientID: 'test-client-id',
            tokenURI: 'https://test-token-uri.com',
            privateKey: 'KEY',
        });
        jest.spyOn(jwt, 'sign').mockReturnValue('mocked_token');
        await expect(
            generateSignedDataTokensFromCreds(creds, { dataTokens: ['token'] }),
        ).rejects.toMatchObject({
            error: expect.objectContaining({
                httpCode: SKYFLOW_ERROR_CODE.MISSING_KEY_ID.httpCode,
            }),
        });
    });

    test('generateSignedDataTokensFromCreds outer catch when jwt.sign throws', async () => {
        jest.spyOn(jwt, 'sign').mockImplementation(() => {
            throw new Error('jwt sign failed');
        });
        const creds = JSON.stringify(validCredentials);
        await expect(
            generateSignedDataTokensFromCreds(creds, { dataTokens: ['token'] }),
        ).rejects.toThrow('jwt sign failed');
    });

    test('generateSignedDataTokensFromCreds succeeds with multiple tokens, ctx, and default TTL', async () => {
        jest.spyOn(jwt, 'sign').mockReturnValue('mocked_token');
        const creds = JSON.stringify(validCredentials);
        const result = await generateSignedDataTokensFromCreds(creds, {
            dataTokens: ['token-a', 'token-b'],
            ctx: { scope: 'test' },
        });
        expect(result).toHaveLength(2);
        expect(result[0].token).toBe('token-a');
        expect(result[0].signedToken).toContain('signed_token_');
        expect(result[1].token).toBe('token-b');
    });

    test('failureResponse text/plain branch handles plain string body', async () => {
        const err = {
            rawResponse: {
                headers: {
                    get: (key) => (key === 'content-type' ? 'text/plain' : 'req-id'),
                },
            },
            body: 'plain error message',
        };
        await expect(failureResponse(err)).rejects.toBeDefined();
    });

    test('successResponse returns empty strings when token fields are missing', async () => {
        const result = await successResponse({});
        expect(result).toEqual({ accessToken: '', tokenType: '' });
    });

    test('generateBearerToken rejects missing credential file with logLevel', async () => {
        await expect(
            generateBearerToken('missing-credentials-file.json', {
                logLevel: LogLevel.ERROR,
            }),
        ).rejects.toBeDefined();
    });

    test('getToken rejects credentials missing clientId', async () => {
        const creds = JSON.stringify({
            keyID: 'test-key-id',
            tokenURI: 'https://test-token-uri.com',
            privateKey: 'KEY',
        });
        await expect(getToken(creds, { logLevel: LogLevel.ERROR })).rejects.toMatchObject({
            error: expect.objectContaining({
                httpCode: SKYFLOW_ERROR_CODE.MISSING_CLIENT_ID.httpCode,
            }),
        });
    });

    test('getToken rejects credentials missing keyId', async () => {
        const creds = JSON.stringify({
            clientID: 'test-client-id',
            tokenURI: 'https://test-token-uri.com',
            privateKey: 'KEY',
        });
        await expect(getToken(creds, { logLevel: LogLevel.ERROR })).rejects.toMatchObject({
            error: expect.objectContaining({
                httpCode: SKYFLOW_ERROR_CODE.MISSING_KEY_ID.httpCode,
            }),
        });
    });

    test('getToken rejects credentials missing tokenUri', async () => {
        const creds = JSON.stringify({
            clientID: 'test-client-id',
            keyID: 'test-key-id',
            privateKey: 'KEY',
        });
        await expect(getToken(creds, { logLevel: LogLevel.ERROR })).rejects.toMatchObject({
            error: expect.objectContaining({
                httpCode: SKYFLOW_ERROR_CODE.MISSING_TOKEN_URI.httpCode,
            }),
        });
    });

    test('getToken rejects credentials missing privateKey', async () => {
        const creds = JSON.stringify({
            clientID: 'test-client-id',
            keyID: 'test-key-id',
            tokenURI: 'https://test-token-uri.com',
        });
        await expect(getToken(creds, { logLevel: LogLevel.ERROR })).rejects.toMatchObject({
            error: expect.objectContaining({
                httpCode: SKYFLOW_ERROR_CODE.MISSING_PRIVATE_KEY.httpCode,
            }),
        });
    });

    test('getToken rejects when getBaseUrl returns empty string', async () => {
        jest.spyOn(require('../../src/utils'), 'getBaseUrl').mockReturnValue('');
        jest.spyOn(jwt, 'sign').mockReturnValue('mocked_token');
        await expect(getToken(JSON.stringify(validCredentials))).rejects.toMatchObject({
            error: expect.objectContaining({
                httpCode: SKYFLOW_ERROR_CODE.MISSING_TOKEN_URI.httpCode,
            }),
        });
    });

    test('getToken rejects options with tokenUri property explicitly undefined', async () => {
        await expect(
            getToken(JSON.stringify(validCredentials), { tokenUri: undefined }),
        ).rejects.toMatchObject({
            error: expect.objectContaining({
                httpCode: SKYFLOW_ERROR_CODE.INVALID_TOKEN_URI.httpCode,
            }),
        });
    });

    test('generateSignedDataTokens rejects missing file with logLevel', async () => {
        await expect(
            generateSignedDataTokens('missing-signed-creds.json', {
                dataTokens: ['token'],
                logLevel: LogLevel.ERROR,
            }),
        ).rejects.toBeDefined();
    });

    test('generateSignedDataTokens rejects empty credential file with logLevel', async () => {
        const filePath = writeTempCredentialsFile('');
        try {
            await expect(
                generateSignedDataTokens(filePath, {
                    dataTokens: ['token'],
                    logLevel: LogLevel.ERROR,
                }),
            ).rejects.toBeDefined();
        } finally {
            fs.unlinkSync(filePath);
        }
    });

    test('generateSignedDataTokensFromCreds uses custom timeToLive', async () => {
        jest.spyOn(jwt, 'sign').mockReturnValue('mocked_token');
        const result = await generateSignedDataTokensFromCreds(
            JSON.stringify(validCredentials),
            { dataTokens: ['token'], timeToLive: 120 },
        );
        expect(result).toHaveLength(1);
    });

    test('generateSignedDataTokensFromCreds rejects non-string credentials with logLevel', async () => {
        await expect(
            generateSignedDataTokensFromCreds(123, {
                dataTokens: ['token'],
                logLevel: LogLevel.ERROR,
            }),
        ).rejects.toBeDefined();
    });

    test('generateSignedDataTokensFromCreds rejects missing dataTokens with logLevel', async () => {
        await expect(
            generateSignedDataTokensFromCreds(JSON.stringify(validCredentials), {
                logLevel: LogLevel.ERROR,
            }),
        ).rejects.toBeDefined();
    });

    test('failureResponse text/plain uses http_code from nested error when present', async () => {
        const err = {
            rawResponse: {
                headers: {
                    get: (key) => (key === 'content-type' ? 'text/plain' : 'req-id'),
                },
            },
            body: { error: { http_code: 503 } },
        };
        await expect(failureResponse(err, { logLevel: LogLevel.ERROR })).rejects.toMatchObject({
            error: expect.objectContaining({ httpCode: 503 }),
        });
    });

    test('getToken accepts canonical clientId, keyId, and tokenUri credential fields', async () => {
        jest.spyOn(jwt, 'sign').mockReturnValue('mocked_token');
        const creds = JSON.stringify({
            clientId: 'canonical-client',
            keyId: 'canonical-key',
            tokenUri: 'https://canonical-token-uri.com',
            privateKey: 'KEY',
        });
        const result = await getToken(creds);
        expect(result.accessToken).toBe('mocked_access_token');
    });

    test('generateSignedDataTokensFromCreds with null timeToLive uses default expiry', async () => {
        jest.spyOn(jwt, 'sign').mockReturnValue('mocked_token');
        const result = await generateSignedDataTokensFromCreds(
            JSON.stringify(validCredentials),
            { dataTokens: ['token'], timeToLive: null },
        );
        expect(result).toHaveLength(1);
    });

    test('error paths with logLevel cover optional logging branches', async () => {
        const logOpts = { logLevel: LogLevel.DEBUG };
        const creds = JSON.stringify(validCredentials);

        await expect(generateBearerToken('missing.json', logOpts)).rejects.toBeDefined();
        await expect(getToken('{}', logOpts)).rejects.toBeDefined();
        await expect(getToken('not-json', logOpts)).rejects.toBeDefined();
        await expect(
            getToken(creds, { ...logOpts, roleIds: [] }),
        ).rejects.toBeDefined();
        await expect(
            getToken(creds, { ...logOpts, tokenUri: 'not-a-url' }),
        ).rejects.toBeDefined();
        await expect(
            generateSignedDataTokensFromCreds('', {
                dataTokens: ['token'],
                ...logOpts,
            }),
        ).rejects.toBeDefined();
        await expect(
            generateSignedDataTokens('missing.json', {
                dataTokens: ['token'],
                ...logOpts,
            }),
        ).rejects.toBeDefined();
        await expect(
            generateSignedDataTokensFromCreds(creds, {
                dataTokens: [],
                ...logOpts,
            }),
        ).rejects.toBeDefined();
        await expect(
            failureResponse({ message: 'network error' }, logOpts),
        ).rejects.toBeDefined();
    });
});
