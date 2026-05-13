/* eslint-disable camelcase */
import errorMessages from "../../../src/error/messages";
import { Env, getConnectionBaseURL, getVaultURL, validateToken, isValidURL, fillUrlWithPathAndQueryParams, generateSDKMetrics, printLog, getToken, getBearerToken, getBaseUrl, removeSDKVersion, parameterizedString, MessageType, LogLevel } from "../../../src/utils";
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
            .toThrowError(new Error(errorMessages.TOKEN_EXPIRED));
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
        expect(() => validateToken("")).toThrowError(new Error(errorMessages.TOKEN_EXPIRED));
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
        expect(result).toBe('/api/resource/books/456');
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

    test('should generate token from StringCredentials', async () => {
        const credentials = {
            credentialsString: 'someCredentials',
            roles: ['role1', 'role2'],
            context: 'someContext'
        };
        const mockToken = { accessToken: 'token123' };

        generateBearerTokenFromCreds.mockResolvedValue(mockToken);

        const result = await getToken(credentials, logLevel);

        expect(result).toEqual(mockToken);
        expect(generateBearerTokenFromCreds).toHaveBeenCalledWith('someCredentials', {
            roleIds: credentials.roles,
            ctx: credentials.context,
            logLevel,
        });
    });

    test('should generate token from PathCredentials', async () => {
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
            roleIds: credentials.roles,
            ctx: credentials.context,
            logLevel,
        });
    });

    test('should throw error for TokenCredentials', async () => {
        const credentials = {
            token: 'someToken'
        };

        await expect(getToken(credentials, logLevel))
            .rejects
            .toThrow();
    });

    test('should throw error for ApiKeyCredentials', async () => {
        const credentials = {
            apiKey: 'sky-api-key'
        };

        await expect(getToken(credentials, logLevel))
            .rejects
            .toThrow();
    });
});

describe('getBearerToken', () => {
    const logLevel = LogLevel.INFO;
    const originalEnv = process.env;

    beforeEach(() => {
        jest.clearAllMocks();
        process.env = { ...originalEnv };
        delete process.env.SKYFLOW_CREDENTIALS;
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    test('should throw error if no credentials and no env variable', async () => {
        await expect(getBearerToken(undefined, logLevel))
            .rejects
            .toThrow(errorMessages.CREDENTIALS_REQUIRED);
    });

    test('should use environment variable when credentials not provided', async () => {
        process.env.SKYFLOW_CREDENTIALS = 'someEnvCredentials';
        const mockToken = { accessToken: 'token456' };
        generateBearerTokenFromCreds.mockResolvedValue(mockToken);

        const result = await getBearerToken(undefined, logLevel);

        expect(result).toEqual({"key": "token456", "type": "TOKEN"});
    });

    test('should handle ApiKeyCredentials correctly', async () => {
        const credentials = {
            apiKey: 'sky-valid-api-key'
        };

        const result = await getBearerToken(credentials, logLevel);

        expect(result).toEqual({"key": "sky-valid-api-key", "type": "API_KEY"});
    });

    test('should handle TokenCredentials correctly', async () => {
        const credentials = {
            token: 'validToken'
        };
        jwt_decode.mockReturnValue({ exp: Date.now() / 1000 + 3600 }); // Valid for 1 hour

        const result = await getBearerToken(credentials, logLevel);

        expect(result).toEqual({"key": "validToken", "type": "TOKEN"});
    });

    test('should handle StringCredentials correctly', async () => {
        const credentials = {
            credentialsString: 'validCredString',
            roles: ['role1'],
            context: 'test'
        };
        const mockToken = { accessToken: 'generatedToken' };
        generateBearerTokenFromCreds.mockResolvedValue(mockToken);

        const result = await getBearerToken(credentials, logLevel);

        expect(result).toEqual({"key": "generatedToken", "type": "TOKEN"});
    });

    test('should handle PathCredentials correctly', async () => {
        const credentials = {
            path: '/valid/path',
            roles: ['role1'],
            context: 'test'
        };
        const mockToken = { accessToken: 'generatedToken' };
        generateBearerToken.mockResolvedValue(mockToken);

        const result = await getBearerToken(credentials, logLevel);

        expect(result).toEqual({"key": "generatedToken", "type": "TOKEN"});
    });

    test('should throw error for invalid API key (does not start with sky-)', async () => {
        const credentials = {
            apiKey: 'invalid-api-key'
        };

        await expect(getBearerToken(credentials, logLevel))
            .rejects
            .toThrow();
    });
});

describe('getBaseUrl', () => {
    test('should return base URL for valid https URL', () => {
        expect(getBaseUrl('https://example.skyflowapis.com/vault/v1/vaults')).toBe('https://example.skyflowapis.com');
    });

    test('should return empty string for invalid URL', () => {
        expect(getBaseUrl('not-a-valid-url')).toBe('');
    });
});

describe('removeSDKVersion', () => {
    test('should strip SDK version from message', () => {
        const msg = 'Skyflow Node SDK v2.0.4 some error occurred';
        expect(removeSDKVersion(msg)).toBe('some error occurred');
    });

    test('should return unchanged message when no SDK version present', () => {
        const msg = 'plain error message';
        expect(removeSDKVersion(msg)).toBe('plain error message');
    });
});

describe('parameterizedString', () => {
    test('returns empty string when message is falsy', () => {
        expect(parameterizedString('')).toBe('');
        expect(parameterizedString(null)).toBe('');
    });

    test('replaces %sN placeholders with args', () => {
        expect(parameterizedString('value at %s1 is %s2', 'index0', 'hello')).toBe('value at index0 is hello');
    });
});

describe('printLog version fallback', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('uses empty version when sdkDetails.version is undefined', () => {
        const origDescriptor = Object.getOwnPropertyDescriptor(sdkDetails, 'version');
        Object.defineProperty(sdkDetails, 'version', { value: undefined, writable: true, configurable: true });
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        printLog('test msg', MessageType.LOG, LogLevel.DEBUG);
        expect(consoleSpy).toHaveBeenCalledWith('DEBUG: [Skyflow Node SDK ] test msg');
        Object.defineProperty(sdkDetails, 'version', origDescriptor);
    });
});

describe('generateSDKMetrics branch coverage', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('uses empty strings when sdkDetails name and version are falsy', () => {
        const origName = Object.getOwnPropertyDescriptor(sdkDetails, 'name');
        const origVersion = Object.getOwnPropertyDescriptor(sdkDetails, 'version');
        Object.defineProperty(sdkDetails, 'name', { value: '', writable: true, configurable: true });
        Object.defineProperty(sdkDetails, 'version', { value: '', writable: true, configurable: true });
        const metrics = generateSDKMetrics();
        expect(metrics.sdk_name_version).toBe('');
        Object.defineProperty(sdkDetails, 'name', origName);
        Object.defineProperty(sdkDetails, 'version', origVersion);
    });

    test('uses empty string for clientDeviceModel when process.platform is undefined', () => {
        const origPlatform = Object.getOwnPropertyDescriptor(process, 'platform');
        const origArch = Object.getOwnPropertyDescriptor(process, 'arch');
        Object.defineProperty(process, 'platform', { value: undefined, writable: true, configurable: true });
        Object.defineProperty(process, 'arch', { value: undefined, writable: true, configurable: true });
        jest.spyOn(os, 'release').mockReturnValue('5.4.0');
        jest.spyOn(os, 'platform').mockReturnValue('linux');
        const metrics = generateSDKMetrics();
        expect(metrics.sdk_client_device_model).toBe(' ');
        Object.defineProperty(process, 'platform', origPlatform);
        Object.defineProperty(process, 'arch', origArch);
    });

    test('uses empty string for clientOSDetails when os.platform returns empty', () => {
        jest.spyOn(os, 'release').mockReturnValue('5.4.0');
        jest.spyOn(os, 'platform').mockReturnValue('');
        const metrics = generateSDKMetrics();
        expect(metrics.sdk_client_os_details).toBe('');
    });
});

describe('objectToXML', () => {
    const { objectToXML } = require('../../../src/utils');

    test('should convert simple object to XML with default root', () => {
        const obj = { name: 'John', age: 30 };
        const result = objectToXML(obj);
        
        expect(result).toBe('<?xml version="1.0" encoding="UTF-8"?><root><name>John</name><age>30</age></root>');
    });

    test('should convert simple object to XML with custom root name', () => {
        const obj = { name: 'John', age: 30 };
        const result = objectToXML(obj, 'person');
        
        expect(result).toBe('<?xml version="1.0" encoding="UTF-8"?><person><name>John</name><age>30</age></person>');
    });

    test('should convert nested object to XML', () => {
        const obj = { 
            user: { 
                name: 'John', 
                details: { 
                    age: 30, 
                    city: 'New York' 
                } 
            } 
        };
        const result = objectToXML(obj);
        
        expect(result).toContain('<user>');
        expect(result).toContain('<name>John</name>');
        expect(result).toContain('<details>');
        expect(result).toContain('<age>30</age>');
        expect(result).toContain('<city>New York</city>');
        expect(result).toContain('</details>');
        expect(result).toContain('</user>');
    });

    test('should convert array to XML with repeated elements', () => {
        const obj = { 
            items: ['apple', 'banana', 'cherry'] 
        };
        const result = objectToXML(obj);
        
        expect(result).toContain('<items>apple</items>');
        expect(result).toContain('<items>banana</items>');
        expect(result).toContain('<items>cherry</items>');
    });

    test('should handle null values', () => {
        const obj = { name: 'John', middleName: null };
        const result = objectToXML(obj);
        
        expect(result).toContain('<name>John</name>');
        expect(result).toContain('<middleName/>');
    });

    test('should handle undefined values', () => {
        const obj = { name: 'John', middleName: undefined };
        const result = objectToXML(obj);
        
        expect(result).toContain('<name>John</name>');
        expect(result).toContain('<middleName/>');
    });

    test('should escape special XML characters', () => {
        const obj = { 
            text: 'This & that < > " \' are special' 
        };
        const result = objectToXML(obj);
        
        expect(result).toContain('&amp;');
        expect(result).toContain('&lt;');
        expect(result).toContain('&gt;');
        expect(result).toContain('&quot;');
        expect(result).toContain('&apos;');
    });

    test('should handle ampersand character', () => {
        const obj = { company: 'AT&T' };
        const result = objectToXML(obj);
        
        expect(result).toContain('<company>AT&amp;T</company>');
    });

    test('should handle less than and greater than characters', () => {
        const obj = { expression: '5 < 10 > 3' };
        const result = objectToXML(obj);
        
        expect(result).toContain('<expression>5 &lt; 10 &gt; 3</expression>');
    });

    test('should handle quotes and apostrophes', () => {
        const obj = { text: 'He said "Hello" and it\'s true' };
        const result = objectToXML(obj);
        
        expect(result).toContain('&quot;');
        expect(result).toContain('&apos;');
    });

    test('should handle boolean values', () => {
        const obj = { isActive: true, isDeleted: false };
        const result = objectToXML(obj);
        
        expect(result).toContain('<isActive>true</isActive>');
        expect(result).toContain('<isDeleted>false</isDeleted>');
    });

    test('should handle numeric values', () => {
        const obj = { age: 30, price: 99.99, negative: -5 };
        const result = objectToXML(obj);
        
        expect(result).toContain('<age>30</age>');
        expect(result).toContain('<price>99.99</price>');
        expect(result).toContain('<negative>-5</negative>');
    });

    test('should handle empty object', () => {
        const obj = {};
        const result = objectToXML(obj);
        
        expect(result).toBe('<?xml version="1.0" encoding="UTF-8"?><root></root>');
    });

    test('should handle empty string values', () => {
        const obj = { name: '' };
        const result = objectToXML(obj);
        
        expect(result).toContain('<name></name>');
    });

    test('should handle complex nested structure', () => {
        const obj = {
            order: {
                id: 123,
                customer: {
                    name: 'John Doe',
                    email: 'john@example.com'
                },
                items: ['item1', 'item2'],
                total: 99.99
            }
        };
        const result = objectToXML(obj);
        
        expect(result).toContain('<order>');
        expect(result).toContain('<id>123</id>');
        expect(result).toContain('<customer>');
        expect(result).toContain('<name>John Doe</name>');
        expect(result).toContain('<email>john@example.com</email>');
        expect(result).toContain('</customer>');
        expect(result).toContain('<items>item1</items>');
        expect(result).toContain('<items>item2</items>');
        expect(result).toContain('<total>99.99</total>');
        expect(result).toContain('</order>');
    });

    test('should handle array of objects', () => {
        const obj = {
            users: [
                { name: 'John', age: 30 },
                { name: 'Jane', age: 25 }
            ]
        };
        const result = objectToXML(obj);
        
        expect(result).toContain('<users>');
        expect(result).toContain('<name>John</name>');
        expect(result).toContain('<age>30</age>');
        expect(result).toContain('<name>Jane</name>');
        expect(result).toContain('<age>25</age>');
        expect(result).toContain('</users>');
    });

    test('should handle mixed types in nested structure', () => {
        const obj = {
            data: {
                string: 'text',
                number: 42,
                boolean: true,
                null: null,
                array: [1, 2, 3]
            }
        };
        const result = objectToXML(obj);
        
        expect(result).toContain('<string>text</string>');
        expect(result).toContain('<number>42</number>');
        expect(result).toContain('<boolean>true</boolean>');
        expect(result).toContain('<null/>');
        expect(result).toContain('<array>1</array>');
        expect(result).toContain('<array>2</array>');
        expect(result).toContain('<array>3</array>');
    });

    test('should include XML declaration', () => {
        const obj = { test: 'value' };
        const result = objectToXML(obj);
        
        expect(result.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    });

    test('should handle objects with multiple root-level keys', () => {
        const obj = {
            firstName: 'John',
            lastName: 'Doe',
            age: 30
        };
        const result = objectToXML(obj, 'person');
        
        expect(result).toContain('<person>');
        expect(result).toContain('<firstName>John</firstName>');
        expect(result).toContain('<lastName>Doe</lastName>');
        expect(result).toContain('<age>30</age>');
        expect(result).toContain('</person>');
    });

    test('should handle deeply nested objects', () => {
        const obj = {
            level1: {
                level2: {
                    level3: {
                        level4: {
                            value: 'deep'
                        }
                    }
                }
            }
        };
        const result = objectToXML(obj);
        
        expect(result).toContain('<level1>');
        expect(result).toContain('<level2>');
        expect(result).toContain('<level3>');
        expect(result).toContain('<level4>');
        expect(result).toContain('<value>deep</value>');
        expect(result).toContain('</level4>');
        expect(result).toContain('</level3>');
        expect(result).toContain('</level2>');
        expect(result).toContain('</level1>');
    });

    test('should handle empty arrays', () => {
        const obj = { items: [] };
        const result = objectToXML(obj);
        
        // Empty array should not produce any items elements
        expect(result).toBe('<?xml version="1.0" encoding="UTF-8"?><root></root>');
    });

    test('should convert numbers to strings', () => {
        const obj = { zero: 0, negative: -100, float: 3.14159 };
        const result = objectToXML(obj);
        
        expect(result).toContain('<zero>0</zero>');
        expect(result).toContain('<negative>-100</negative>');
        expect(result).toContain('<float>3.14159</float>');
    });

    test('should handle special characters in keys and values', () => {
        const obj = {
            'data-id': 'test-123',
            value: 'special & chars < >'
        };
        const result = objectToXML(obj);
        
        expect(result).toContain('<data-id>test-123</data-id>');
        expect(result).toContain('special &amp; chars &lt; &gt;');
    });
});

