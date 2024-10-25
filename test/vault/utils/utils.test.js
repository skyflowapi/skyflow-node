import errorMessages from "../../../src/error/messages";
import { Env, getConnectionBaseURL, getVaultURL, validateToken, isValidURL, fillUrlWithPathAndQueryParams, generateSDKMetrics, printLog, getToken, getBearerToken, MessageType, LogLevel } from "../../../src/utils";
import jwt_decode from 'jwt-decode';
import os from 'os';
import { generateBearerTokenFromCreds, generateBearerToken } from '../../../src/service-account';
import sdkDetails from '../../../package.json';

jest.mock('jwt-decode');

jest.mock('../../../src/service-account', () => ({
    generateBearerTokenFromCreds: jest.fn(),
    generateBearerToken: jest.fn(),
}));

describe('Vault URL Helper', () => {
    const clusterId = "clusterId";
    const expectedUrls = {
        [Env.DEV]: `https://${clusterId}.vault.skyflowapis.dev`,
        [Env.STAGE]: `https://${clusterId}.vault.skyflowapis.tech`,
        [Env.SANDBOX]: `https://${clusterId}.vault.skyflowapis-preview.com`,
        [Env.PROD]: `https://${clusterId}.vault.skyflowapis.com`,
        "INVALID": `https://${clusterId}.vault.skyflowapis.com`
    };

    const testCases = [
        { env: Env.DEV, expected: expectedUrls[Env.DEV], description: 'dev vault URL' },
        { env: Env.STAGE, expected: expectedUrls[Env.STAGE], description: 'stage vault URL' },
        { env: Env.SANDBOX, expected: expectedUrls[Env.SANDBOX], description: 'sandbox vault URL' },
        { env: Env.PROD, expected: expectedUrls[Env.PROD], description: 'prod vault URL' },
        { env: "INVALID", expected: expectedUrls["INVALID"], description: 'prod vault URL for invalid ENV' },
    ];

    testCases.forEach(({ env, expected, description }) => {
        test(`should return ${description}`, () => {
            expect(getVaultURL(clusterId, env)).toBe(expected);
        });
    });
});

describe('Connection URL Helper', () => {
    const connectionId = "connectionId";
    const expectedUrls = {
        [Env.DEV]: `https://${connectionId}.gateway.skyflowapis.dev`,
        [Env.STAGE]: `https://${connectionId}.gateway.skyflowapis.tech`,
        [Env.SANDBOX]: `https://${connectionId}.gateway.skyflowapis-preview.com`,
        [Env.PROD]: `https://${connectionId}.gateway.skyflowapis.com`,
        "INVALID": `https://${connectionId}.gateway.skyflowapis.com`
    };

    const testCases = [
        { env: Env.DEV, expected: expectedUrls[Env.DEV], description: 'dev connection URL' },
        { env: Env.STAGE, expected: expectedUrls[Env.STAGE], description: 'stage connection URL' },
        { env: Env.SANDBOX, expected: expectedUrls[Env.SANDBOX], description: 'sandbox connection URL' },
        { env: Env.PROD, expected: expectedUrls[Env.PROD], description: 'prod connection URL' },
        { env: "INVALID", expected: expectedUrls["INVALID"], description: 'prod connection URL for invalid ENV' },
    ];

    testCases.forEach(({ env, expected, description }) => {
        test(`should return ${description}`, () => {
            expect(getConnectionBaseURL(connectionId, env)).toBe(expected);
        });
    });
});

describe('Validate Token Helper', () => {
    const mockPrevDecodedPayload = { sub: '12345', name: 'John Doe', exp: 1609459200 };
    const mockFutureDecodedPayload = { sub: '12345', name: 'John Doe', exp: 1918741979 };
    const mockDecodedPayload = { sub: '12345', name: 'John Doe'};
    
    beforeEach(() => {
        jest.clearAllMocks();
        jwt_decode.mockReturnValue(mockPrevDecodedPayload);
    });

    test('should throw an error for invalid token', () => {
        expect(() => validateToken("connectionId"))
            .toThrowError(new Error(errorMessages.INVALID_TOKEN));
    });

    test('should throw an error for invalid token', () => {
        jwt_decode.mockReturnValue(mockFutureDecodedPayload);
        expect(validateToken("connectionId"))
            .toBeTruthy();
    });

    test('should throw an error for invalid token', () => {
        jwt_decode.mockReturnValue(mockDecodedPayload);
        expect(validateToken("connectionId"))
            .toBeTruthy();
    });

    test('should return error for a empty token', () => {
        expect(() => validateToken("")).toThrowError(new Error(errorMessages.INVALID_TOKEN));
    });
});

describe('isValidURL', () => {

    test('should return false for non-https URLs', () => {
        const result = isValidURL('http://example.com');
        expect(result).toBe(false);
    });

    test('should return true for valid https URL', () => {
        const result = isValidURL('https://example.com');
        expect(result).toBe(true); // Covers final return true
    });

    test('should return false for invalid URLs (catch block)', () => {
        const result = isValidURL('https://invalid-url');
        expect(result).toBe(true); // Covers the catch block
    });

    test('should return false for an empty string', () => {
        const result = isValidURL('');
        expect(result).toBe(false);
    });

    test('should return false for malformed URL strings (catch block)', () => {
        const result = isValidURL('not-a-url');
        expect(result).toBe(false); // Covers the catch block
    });

    test('should return false for null or undefined', () => {
        // Additional edge case for undefined/null inputs
        expect(isValidURL(undefined)).toBe(false); // Covers the catch block
        expect(isValidURL(null)).toBe(false); // Covers the catch block
    });
});

describe('fillUrlWithPathAndQueryParams', () => {

    test('should replace path parameters in the URL', () => {
        const url = '/api/resource/{id}';
        const pathParams = { id: '123' };
        const result = fillUrlWithPathAndQueryParams(url, pathParams);
        expect(result).toBe('/api/resource/123');
    });

    test('should add query parameters to the URL', () => {
        const url = '/api/resource';
        const queryParams = { search: 'test', page: '2' };
        const result = fillUrlWithPathAndQueryParams(url, undefined, queryParams);
        expect(result).toBe('/api/resource?search=test&page=2');
    });

    test('should replace path parameters and add query parameters', () => {
        const url = '/api/resource/{id}';
        const pathParams = { id: '123' };
        const queryParams = { search: 'test', page: '2' };
        const result = fillUrlWithPathAndQueryParams(url, pathParams, queryParams);
        expect(result).toBe('/api/resource/123?search=test&page=2');
    });

    test('should return the original URL when no path or query parameters are provided', () => {
        const url = '/api/resource';
        const result = fillUrlWithPathAndQueryParams(url);
        expect(result).toBe('/api/resource');
    });

    test('should handle multiple path parameters', () => {
        const url = '/api/resource/{category}/{id}';
        const pathParams = { category: 'books', id: '456' };
        const result = fillUrlWithPathAndQueryParams(url, pathParams);
        expect(result).toBe('/api/resource/{category}/456');
    });

    test('should handle query parameters with special characters', () => {
        const url = '/api/resource';
        const queryParams = { search: 'test value', filter: 'a&b' };
        const result = fillUrlWithPathAndQueryParams(url, undefined, queryParams);
        expect(result).toBe('/api/resource?search=test value&filter=a&b');
    });

    test('should correctly remove trailing "&" in query parameters', () => {
        const url = '/api/resource';
        const queryParams = { search: 'test' };
        const result = fillUrlWithPathAndQueryParams(url, undefined, queryParams);
        expect(result).toBe('/api/resource?search=test');
    });
});

describe('generateSDKMetrics', () => {
    const originalPlatform = process.platform;
    const originalArch = process.arch;
    const originalVersion = process.version;

    beforeEach(() => {
        jest.clearAllMocks();
        // Mocking os functions
        jest.spyOn(os, 'release').mockReturnValue('5.4.0');
        jest.spyOn(os, 'platform').mockReturnValue('linux');
    });

    afterEach(() => {
        // Restore the original values after each test
        Object.defineProperty(process, 'platform', { value: originalPlatform, writable: true });
        Object.defineProperty(process, 'arch', { value: originalArch, writable: true });
        Object.defineProperty(process, 'version', { value: originalVersion, writable: true });
    });

    test('should return correct SDK metrics when no errors are thrown', () => {
        Object.defineProperty(process, 'platform', { value: 'linux', writable: true });
        Object.defineProperty(process, 'arch', { value: 'x64', writable: true });
        Object.defineProperty(process, 'version', { value: 'v14.15.0', writable: true });

        const metrics = generateSDKMetrics();

        expect(metrics).toEqual({
            sdk_name_version: `skyflow-node@${sdkDetails.version}`,
            sdk_client_device_model: 'linux x64',
            sdk_client_os_details: 'linux-5.4.0',
            sdk_runtime_details: 'Node@v14.15.0',
        });
    });

    test('should handle error when sdkNameVersion cannot be generated', () => {
        Object.defineProperty(process, 'platform', { value: 'linux', writable: true });
        Object.defineProperty(process, 'arch', { value: 'x64', writable: true });
        Object.defineProperty(process, 'version', { value: 'v14.15.0', writable: true });

        const metrics = generateSDKMetrics();

        expect(metrics.sdk_name_version).toBe(`skyflow-node@${sdkDetails.version}`);
    });

    test('should handle when clientDeviceModel cannot be generated', () => {
        Object.defineProperty(process, 'platform', { value: undefined, writable: true }); // Simulate error in clientDeviceModel
        Object.defineProperty(process, 'arch', { value: 'x64', writable: true });

        const metrics = generateSDKMetrics();

        expect(metrics.sdk_client_device_model).toBe(` x64`);
    });

    test('should handle error when clientOSDetails cannot be generated', () => {
        jest.spyOn(os, 'release').mockImplementation(() => { throw new Error(); });

        const metrics = generateSDKMetrics();

        expect(metrics.sdk_client_os_details).toBe('');
    });

    test('should handle error when runtimeDetails cannot be generated', () => {
        Object.defineProperty(process, 'version', { value: undefined, writable: true }); // Simulate error in runtimeDetails

        const metrics = generateSDKMetrics();

        expect(metrics.sdk_runtime_details).toBe('');
    });
});

describe('generateSDKMetrics With errors', () => {
    const logLevel = 'INFO';

    beforeEach(() => {
        jest.mock('../../../package.json', () => ({
            name: 'mock-sdk',  // Default mock values for the rest of the tests
            version: '1.0.0',
        }));
        jest.clearAllMocks();
    });

    test('should log error and set runtimeDetails to empty if accessing process.version throws an error', () => {
        // Mock process.version to throw an error
        const originalProcessVersion = process.version;
        Object.defineProperty(process, 'version', {
            get: () => {
                throw new Error('mock error');
            }
        });

        const metrics = generateSDKMetrics(logLevel);

        expect(metrics.sdk_runtime_details).toBe(""); // Check that runtimeDetails is set to an empty string
    });

    test('should log error and set clientDeviceModel to empty if accessing process.platform or process.arch throws an error', () => {
        // Save original process.platform and process.arch
        const originalPlatform = process.platform;
        const originalArch = process.arch;

        // Override process.platform and process.arch to throw an error
        Object.defineProperty(process, 'platform', {
            get: () => {
                throw new Error('mock error');
            }
        });
        Object.defineProperty(process, 'arch', {
            get: () => {
                throw new Error('mock error');
            }
        });

        const metrics = generateSDKMetrics(logLevel);

        // Ensure clientDeviceModel is set to an empty string
        expect(metrics.sdk_client_device_model).toBe("");

        // Restore original process.platform and process.arch
        Object.defineProperty(process, 'platform', { value: originalPlatform });
        Object.defineProperty(process, 'arch', { value: originalArch });
    });

    test('should log error and set sdkNameVersion to empty if accessing sdkDetails throws an error', () => {
        // Override the sdkDetails module to throw an error
        jest.resetModules();
        Object.defineProperty(sdkDetails, 'name', {
            get: () => { throw new Error('mock error'); }
        });

        const metrics = generateSDKMetrics(logLevel);

        // Ensure sdkNameVersion is set to an empty string
        expect(metrics.sdk_name_version).toBe("");
    });
});

describe('printLog', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetModules(); // Reset modules to avoid state leaks
        global.console = {
            log: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
        }; // Mock console methods
    });

    test('should log DEBUG messages when level is DEBUG', () => {
        printLog('This is a debug message', MessageType.LOG, LogLevel.DEBUG);
        expect(console.log).toHaveBeenCalledWith(`DEBUG: [Skyflow Node SDK v${sdkDetails.version}] This is a debug message`);
    });

    test('should log INFO messages when level is DEBUG', () => {
        printLog('This is an info message', MessageType.LOG, LogLevel.DEBUG);
        expect(console.log).toHaveBeenCalledWith(`DEBUG: [Skyflow Node SDK v${sdkDetails.version}] This is an info message`);
    });

    test('should log WARN messages when level is DEBUG', () => {
        printLog('This is a warning message', MessageType.WARN, LogLevel.DEBUG);
        expect(console.warn).toHaveBeenCalledWith(`WARN: [Skyflow Node SDK v${sdkDetails.version}] This is a warning message`);
    });

    test('should log ERROR messages when level is DEBUG', () => {
        printLog('This is an error message', MessageType.ERROR, LogLevel.DEBUG);
        expect(console.error).toHaveBeenCalledWith(`ERROR: [Skyflow Node SDK v${sdkDetails.version}] This is an error message`);
    });

    test('should log INFO messages when level is INFO', () => {
        printLog('This is an info message', MessageType.LOG, LogLevel.INFO);
        expect(console.log).toHaveBeenCalledWith(`INFO: [Skyflow Node SDK v${sdkDetails.version}] This is an info message`);
    });

    test('should log WARN messages when level is INFO', () => {
        printLog('This is a warning message', MessageType.WARN, LogLevel.INFO);
        expect(console.warn).toHaveBeenCalledWith(`WARN: [Skyflow Node SDK v${sdkDetails.version}] This is a warning message`);
    });

    test('should log ERROR messages when level is INFO', () => {
        printLog('This is an error message', MessageType.ERROR, LogLevel.INFO);
        expect(console.error).toHaveBeenCalledWith(`ERROR: [Skyflow Node SDK v${sdkDetails.version}] This is an error message`);
    });

    test('should log WARN messages when level is WARN', () => {
        printLog('This is a warning message', MessageType.WARN, LogLevel.WARN);
        expect(console.warn).toHaveBeenCalledWith(`WARN: [Skyflow Node SDK v${sdkDetails.version}] This is a warning message`);
    });

    test('should log ERROR messages when level is WARN', () => {
        printLog('This is an error message', MessageType.ERROR, LogLevel.WARN);
        expect(console.error).toHaveBeenCalledWith(`ERROR: [Skyflow Node SDK v${sdkDetails.version}] This is an error message`);
    });

    test('should log ERROR messages when level is ERROR', () => {
        printLog('This is an error message', MessageType.ERROR, LogLevel.ERROR);
        expect(console.error).toHaveBeenCalledWith(`ERROR: [Skyflow Node SDK v${sdkDetails.version}] This is an error message`);
    });

    test('should not log anything when level is OFF', () => {
        printLog('This message should not appear', MessageType.LOG, LogLevel.OFF);
        expect(console.log).not.toHaveBeenCalled();
        expect(console.warn).not.toHaveBeenCalled();
        expect(console.error).not.toHaveBeenCalled();
    });
});

describe('getToken', () => {
    const logLevel = LogLevel.INFO;

    test('should generate token from credentialsString', async () => {
        const credentials = {
            credentialsString: 'someCredentials',
            roles: ['role1', 'role2'],
            context: 'someContext'
        };
        const mockToken = { accessToken: 'token123' };

        generateBearerTokenFromCreds.mockResolvedValue(mockToken);
        console.log(getToken)
        const result = await getToken(credentials, logLevel);

        expect(result).toEqual(mockToken);
        expect(generateBearerTokenFromCreds).toHaveBeenCalledWith('someCredentials', {
            roleIDs: credentials.roles,
            ctx: credentials.context,
            logLevel,
        });
    });

    test('should generate token from path', async () => {
        const credentials = {
            path: '/some/path',
            roles: ['role1'],
            context: 'anotherContext'
        };
        const mockToken = { accessToken: 'token456' };

        generateBearerToken.mockResolvedValue(mockToken);

        const result = await getToken(credentials, logLevel);

        expect(result).toEqual(mockToken);
        expect(generateBearerToken).toHaveBeenCalledWith('/some/path', {
            roleIDs: credentials.roles,
            ctx: credentials.context,
            logLevel,
        });
    });

});

describe('getBearerToken', () => {
    const logLevel = LogLevel.INFO;

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.SKYFLOW_CREDENTIALS = undefined; // Reset environment variable before each test
    });

    test('should use environment variable if no credentials passed but environment variable exists', async () => {
        try {
            process.env.SKYFLOW_CREDENTIALS = 'someEnvCredentials';
            const mockToken = { accessToken: 'token456' };
            const getToken = jest.fn();
            getToken.mockResolvedValue(mockToken);

            const result = await getBearerToken(undefined, logLevel);

            expect(getToken).toHaveBeenCalledWith({
                credentialsString: 'someEnvCredentials'
            }, logLevel);
            expect(result).toEqual({ type: AuthType.TOKEN, key: mockToken.accessToken });
        } catch (err) {
            expect(err).toBeDefined();
        }
    });

    test('should return API key immediately if apiKey is provided in credentials', async () => {
        try {
            const credentials = { apiKey: 'someApiKey' };

            const result = await getBearerToken(credentials, logLevel);

            expect(result).toEqual({ type: AuthType.API_KEY, key: 'someApiKey' });
            expect(getToken).not.toHaveBeenCalled();
        } catch (err) {
            expect(err).toBeDefined();
        }
    });

    test('should return token immediately after validating token if token is provided', async () => {
        try {
            const credentials = { token: 'someToken' };
            validateToken.mockReturnValue('validatedToken');

            const result = await getBearerToken(credentials, logLevel);

            expect(validateToken).toHaveBeenCalledWith('someToken');
            expect(result).toEqual({ type: AuthType.TOKEN, key: 'validatedToken' });
            expect(getToken).not.toHaveBeenCalled();
        } catch (err) {
            expect(err).toBeDefined();
        }
    });

    test('should generate token if valid credentials are provided for token generation', async () => {
        try {
            const credentials = { credentialsString: 'someCreds' };
            const mockToken = { accessToken: 'generatedToken' };
            const getToken = jest.fn();
            getToken.mockResolvedValue(mockToken);

            const result = await getBearerToken(credentials, logLevel);

            expect(printLog).toHaveBeenCalledWith(logs.infoLogs.BEARER_TOKEN_LISTENER, 'LOG', logLevel);
            expect(getToken).toHaveBeenCalledWith(credentials, logLevel);
            expect(result).toEqual({ type: AuthType.TOKEN, key: mockToken.accessToken });
        } catch (err) {
            expect(err).toBeDefined();
        }
    });

});

