import {
    generateBearerToken,
    generateBearerTokenFromCreds,
    generateToken,
    getToken,
    successResponse,
    failureResponse,
    getRolesForScopedToken,
    generateSignedDataTokens,
    generateSignedDataTokensFromCreds,
} from "../../src/service-account";
import SkyflowError from '../../src/error';
import errorMessages from '../../src/error/messages';
import jwt from 'jsonwebtoken';
import { LogLevel } from "../../src";

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
    const credsWithoutContext = process.env.SA_WITHOUT_CONTEXT;

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
        try {
            await generateSignedDataTokens(filePath, defaultOptions);
        } catch (err) {
            expect(err.message).toBe(errorMessages.MISSING_TOKEN_URI);
        }
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
    const validCredentials = {
        clientID: "test-client-id",
        keyID: "test-key-id",
        tokenURI: "https://test-token-uri.com",
        privateKey: "KEY",
        data: "DATA",
    };
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
});
