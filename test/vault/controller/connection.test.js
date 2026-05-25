import {
    fillUrlWithPathAndQueryParams,
    generateSDKMetrics,
    getBearerToken,
    LogLevel,
    RequestMethod,
    SDK,
    SKYFLOW,
    REQUEST,
    HTTP_HEADER,
    CONTENT_TYPE,
    objectToXML,
} from "../../../src/utils";
import { validateInvokeConnectionRequest } from "../../../src/utils/validations";
import VaultClient from "../../../src/vault/client";
import ConnectionController from "../../../src/vault/controller/connections";
import SkyflowError from "../../../src/error";
import SKYFLOW_ERROR_CODE from "../../../src/error/codes";

jest.mock("../../../src/utils", () => ({
    fillUrlWithPathAndQueryParams: jest.fn(),
    generateSDKMetrics: jest.fn(),
    getBearerToken: jest.fn(),
    LogLevel: { WARN: 'WARN', INFO: 'INFO', DEBUG: 'DEBUG', ERROR: 'ERROR', OFF: 'OFF' },
    MessageType: { LOG: 'LOG', WARN: 'WARN', ERROR: 'ERROR' },
    RequestMethod: { POST: 'POST', GET: 'GET', PUT: 'PUT', PATCH: 'PATCH' },
    parameterizedString: jest.fn((...args) => args.join(' ')),
    printLog: jest.fn(),
    SDK: { METRICS_HEADER_KEY: 'sky-metadata' },
    SKYFLOW: { ID: 'skyflowId', LEGACY_ID: 'skyflow_id', AUTH_HEADER_KEY: 'x-skyflow-authorization' },
    REQUEST: { ID_KEY: 'x-request-id' },
    TYPES: {
        INSERT: 'INSERT', INSERT_BATCH: 'INSERT_BATCH', DETOKENIZE: 'DETOKENIZE', TOKENIZE: 'TOKENIZE',
        DELETE: 'DELETE', UPDATE: 'UPDATE', GET: 'GET', FILE_UPLOAD: 'FILE_UPLOAD', QUERY: 'QUERY',
        DETECT: 'DETECT', INVOKE_CONNECTION: 'INVOKE_CONNECTION', DEIDENTIFY_TEXT: 'DEIDENTIFY_TEXT',
        REIDENTIFY_TEXT: 'REIDENTIFY_TEXT', DEIDENTIFY_FILE: 'DEIDENTIFY_FILE', DETECT_RUN: 'DETECT_RUN',
    },
    HTTP_HEADER: { CONTENT_TYPE: 'Content-Type', CONTENT_TYPE_LOWER: 'content-type', X_REQUEST_ID: 'x-request-id', ERROR_FROM_CLIENT: 'error-from-client' },
    CONTENT_TYPE: {
        APPLICATION_JSON: 'application/json',
        APPLICATION_X_WWW_FORM_URLENCODED: 'application/x-www-form-urlencoded',
        TEXT_PLAIN: 'text/plain',
        MULTIPART_FORM_DATA: 'multipart/form-data',
        TEXT_XML: 'text/xml',
        APPLICATION_XML: 'application/xml',
        TEXT_HTML: 'text/html',
    },
    objectToXML: jest.fn((obj, root) => `<${root}>${JSON.stringify(obj)}</${root}>`),
}));
jest.mock("../../../src/utils/logs", () => ({
    __esModule: true,
    default: {
        infoLogs: {
            INVOKE_CONNECTION_TRIGGERED: 'invoke connection triggered',
            VALIDATE_CONNECTION_CONFIG: 'validate connection config',
            EMIT_REQUEST: 'emit request %s',
            INVOKE_CONNECTION_REQUEST_RESOLVED: 'invoke connection request resolved',
        },
        errorLogs: {
            INVOKE_CONNECTION_REQUEST_REJECTED: 'invoke connection request rejected',
        },
        warnLogs: {
            DEPRECATED_REQUEST_ID_PROPERTY: 'deprecated request_ID property',
        },
    },
}));
jest.mock("../../../src/utils/validations");
jest.mock("../../../src/vault/client", () => {
    return jest.fn().mockImplementation(() => ({}));
});

if (typeof global.FormData === 'undefined') {
    global.FormData = class {
        constructor() { this._data = {}; }
        append(key, value) { this._data[key] = value; }
        has(key) { return key in this._data; }
        get(key) { return this._data[key]; }
    };
}
if (typeof global.File === 'undefined') {
    global.File = class File {
        constructor(parts, name, options = {}) {
            this.name = name;
            this.type = options.type || '';
            this._content = parts;
        }
    };
}
if (typeof global.Blob === 'undefined') {
    global.Blob = class Blob {
        constructor(parts, options = {}) {
            this.type = options.type || '';
            this._content = parts;
        }
    };
}

describe("ConnectionController Tests", () => {
    let mockClient;
    let connectionController;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useRealTimers();
        mockClient = {
            getLogLevel: jest.fn().mockReturnValue(LogLevel.ERROR),
            getCredentials: jest.fn().mockReturnValue({ apiKey: "test-key" }),
            url: "https://api.example.com",
            failureResponse: jest.fn().mockRejectedValue(new Error("Failure"))
        };
        connectionController = new ConnectionController(mockClient);
    });

    // Test buildInvokeConnectionBody - JSON content type
    it("should build request body for JSON content type", async () => {
        const token = { key: "bearer_token" };
        getBearerToken.mockResolvedValue(token);
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(jest.fn());
        
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            headers: {
                get: jest.fn().mockImplementation((key) => {
                    if (key === "x-request-id") return "request_id";
                    if (key === "content-type") return "application/json";
                    return null;
                }),
            },
            json: jest.fn().mockResolvedValue({ success: true }),
        });

        const request = {
            body: { data: "sample" },
            method: RequestMethod.POST,
            headers: { "Content-Type": "application/json" },
        };

        await connectionController.invoke(request);

        expect(fetch).toHaveBeenCalledWith(
            "https://api.example.com/resource",
            expect.objectContaining({
                method: RequestMethod.POST,
                body: JSON.stringify(request.body),
            })
        );
    });

    // Test buildInvokeConnectionBody - URL encoded content type
    it("should build request body for URL encoded content type", async () => {
        const token = { key: "bearer_token" };
        getBearerToken.mockResolvedValue(token);
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(jest.fn());
        
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            headers: {
                get: jest.fn().mockImplementation((key) => {
                    if (key === "x-request-id") return "request_id";
                    if (key === "content-type") return "application/x-www-form-urlencoded";
                    return null;
                }),
            },
            text: jest.fn().mockResolvedValue("key=value"),
        });

        const request = {
            body: { key: "value", nested: { field: "data" } },
            method: RequestMethod.POST,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        };

        await connectionController.invoke(request);

        const expectedBody = new URLSearchParams();
        expectedBody.append("key", "value");
        expectedBody.append("nested[field]", "data");

        expect(fetch).toHaveBeenCalledWith(
            "https://api.example.com/resource",
            expect.objectContaining({
                method: RequestMethod.POST,
                body: expectedBody.toString(),
            })
        );
    });

    it("should handle arrays in URL encoded request body", async () => {
        const token = { key: "bearer_token" };
        getBearerToken.mockResolvedValue(token);
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(jest.fn());
        
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            headers: {
                get: jest.fn().mockImplementation((key) => {
                    if (key === "x-request-id") return "request_id";
                    if (key === "content-type") return "text/plain";
                    return null;
                }),
            },
            text: jest.fn().mockResolvedValue("success"),
        });

        const request = {
            body: { 
                tags: ["tag1", "tag2", "tag3"],
                name: "test" 
            },
            method: RequestMethod.POST,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        };

        await connectionController.invoke(request);

        const fetchCall = global.fetch.mock.calls[0][1];
        const bodyString = fetchCall.body;
        
        expect(bodyString).toContain("tags=tag1");
        expect(bodyString).toContain("tags=tag2");
        expect(bodyString).toContain("tags=tag3");
        expect(bodyString).toContain("name=test");
    });

    // Test buildInvokeConnectionBody - multipart/form-data
    it("should build request body for multipart/form-data and remove content-type header", async () => {
        const token = { key: "bearer_token" };
        getBearerToken.mockResolvedValue(token);
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(jest.fn());
        
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            headers: {
                get: jest.fn().mockImplementation((key) => {
                    if (key === "x-request-id") return "request_id";
                    if (key === "content-type") return "multipart/form-data";
                    return null;
                }),
            },
            text: jest.fn().mockResolvedValue("response"),
        });

        const request = {
            body: { key: "value" },
            method: RequestMethod.POST,
            headers: { "Content-Type": "multipart/form-data" },
        };

        await connectionController.invoke(request);

        const callArgs = fetch.mock.calls[0][1];
        expect(callArgs.body).toBeInstanceOf(FormData);
        // Content-Type should be removed for multipart
        expect(callArgs.headers["Content-Type"]).toBeUndefined();
    });

    // Test buildInvokeConnectionBody - multipart/form-data with File/Blob
    it("should handle File and Blob objects in multipart/form-data", async () => {
        const token = { key: "bearer_token" };
        getBearerToken.mockResolvedValue(token);
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(jest.fn());
        
        // Create mock File and Blob
        const mockFile = new File(["file content"], "test.txt", { type: "text/plain" });
        const mockBlob = new Blob(["blob content"], { type: "application/octet-stream" });
        
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            headers: {
                get: jest.fn().mockImplementation((key) => {
                    if (key === "x-request-id") return "request_id";
                    if (key === "content-type") return "text/plain";
                    return null;
                }),
            },
            text: jest.fn().mockResolvedValue("success"),
        });

        const request = {
            body: { 
                file: mockFile,
                data: mockBlob,
                name: "test" 
            },
            method: RequestMethod.POST,
            headers: { "Content-Type": "multipart/form-data" },
        };

        await connectionController.invoke(request);

        const callArgs = fetch.mock.calls[0][1];
        expect(callArgs.body).toBeInstanceOf(FormData);
        
        // Verify FormData was created and File/Blob were appended (covers lines 97-98)
        const formData = callArgs.body;
        expect(formData.has('file')).toBe(true);
        expect(formData.has('data')).toBe(true);
        expect(formData.has('name')).toBe(true);
    });

    // Test buildInvokeConnectionBody - XML content type
    it("should build request body for XML content type from object", async () => {
        const token = { key: "bearer_token" };
        getBearerToken.mockResolvedValue(token);
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(jest.fn());
        objectToXML.mockReturnValue('<?xml version="1.0"?><request><data>sample</data></request>');
        
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            headers: {
                get: jest.fn().mockImplementation((key) => {
                    if (key === "x-request-id") return "request_id";
                    if (key === "content-type") return "application/xml";
                    return null;
                }),
            },
            text: jest.fn().mockResolvedValue("<response/>"),
        });

        const request = {
            body: { data: "sample" },
            method: RequestMethod.POST,
            headers: { "Content-Type": "application/xml" },
        };

        await connectionController.invoke(request);

        expect(objectToXML).toHaveBeenCalledWith(request.body, "request");
        expect(fetch).toHaveBeenCalledWith(
            "https://api.example.com/resource",
            expect.objectContaining({
                body: '<?xml version="1.0"?><request><data>sample</data></request>',
            })
        );
    });

    // Test buildInvokeConnectionBody - XML as string
    it("should build request body for XML content type from string", async () => {
        const token = { key: "bearer_token" };
        getBearerToken.mockResolvedValue(token);
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(jest.fn());
        
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            headers: {
                get: jest.fn().mockImplementation((key) => {
                    if (key === "x-request-id") return "request_id";
                    if (key === "content-type") return "application/xml";
                    return null;
                }),
            },
            text: jest.fn().mockResolvedValue("<response/>"),
        });

        const xmlString = '<?xml version="1.0"?><request><data>sample</data></request>';
        const request = {
            body: xmlString,
            method: RequestMethod.POST,
            headers: { "Content-Type": "application/xml" },
        };

        await connectionController.invoke(request);

        expect(fetch).toHaveBeenCalledWith(
            "https://api.example.com/resource",
            expect.objectContaining({
                body: xmlString,
            })
        );
    });

    // Test buildInvokeConnectionBody - text/plain
    it("should build request body for text/plain content type", async () => {
        const token = { key: "bearer_token" };
        getBearerToken.mockResolvedValue(token);
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(jest.fn());
        
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            headers: {
                get: jest.fn().mockImplementation((key) => {
                    if (key === "x-request-id") return "request_id";
                    if (key === "content-type") return "text/plain";
                    return null;
                }),
            },
            text: jest.fn().mockResolvedValue("response"),
        });

        const request = {
            body: "plain text content",
            method: RequestMethod.POST,
            headers: { "Content-Type": "text/plain" },
        };

        await connectionController.invoke(request);

        expect(fetch).toHaveBeenCalledWith(
            "https://api.example.com/resource",
            expect.objectContaining({
                body: "plain text content",
            })
        );
    });

    // Test buildInvokeConnectionBody - no content type with object
    it("should default to JSON when no content type is provided with object body", async () => {
        const token = { key: "bearer_token" };
        getBearerToken.mockResolvedValue(token);
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(jest.fn());
        
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            headers: {
                get: jest.fn().mockImplementation((key) => {
                    if (key === "x-request-id") return "request_id";
                    if (key === "content-type") return "application/json";
                    return null;
                }),
            },
            json: jest.fn().mockResolvedValue({ success: true }),
        });

        const request = {
            body: { data: "sample" },
            method: RequestMethod.POST,
            headers: {},
        };

        await connectionController.invoke(request);

        expect(fetch).toHaveBeenCalledWith(
            "https://api.example.com/resource",
            expect.objectContaining({
                body: JSON.stringify(request.body),
            })
        );
    });

    // Test parseResponseBody - JSON response
    it("should parse JSON response correctly", async () => {
        const token = { key: "bearer_token" };
        getBearerToken.mockResolvedValue(token);
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(jest.fn());
        
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            headers: {
                get: jest.fn().mockImplementation((key) => {
                    if (key === "x-request-id") return "request_id";
                    if (key === "content-type") return "application/json";
                    return null;
                }),
            },
            json: jest.fn().mockResolvedValue({ success: true }),
        });

        const request = {
            body: { data: "sample" },
            method: RequestMethod.POST,
            headers: { "Content-Type": "application/json" },
        };

        const result = await connectionController.invoke(request);

        expect(result.data).toEqual({ success: true });
    });

    // Test parseResponseBody - XML response
    it("should parse XML response as text", async () => {
        const token = { key: "bearer_token" };
        getBearerToken.mockResolvedValue(token);
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(jest.fn());
        
        const xmlResponse = '<?xml version="1.0"?><response><success>true</success></response>';
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            headers: {
                get: jest.fn().mockImplementation((key) => {
                    if (key === "x-request-id") return "request_id";
                    if (key === "content-type") return "application/xml";
                    return null;
                }),
            },
            text: jest.fn().mockResolvedValue(xmlResponse),
        });

        const request = {
            body: { data: "sample" },
            method: RequestMethod.POST,
            headers: { "Content-Type": "application/json" },
        };

        const result = await connectionController.invoke(request);

        expect(result.data).toEqual(xmlResponse);
    });

    // Test parseResponseBody - URL encoded response
    it("should parse URL encoded response correctly", async () => {
        const token = { key: "bearer_token" };
        getBearerToken.mockResolvedValue(token);
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(jest.fn());
        
        const responseText = "key1=value1&key2=value2";
        let textCalled = false;
        
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            headers: {
                get: jest.fn().mockImplementation((key) => {
                    const lowerKey = key?.toLowerCase();
                    if (lowerKey === "x-request-id") return "request_id";
                    if (lowerKey === "content-type") return "application/x-www-form-urlencoded";
                    return null;
                }),
            },
            text: jest.fn().mockImplementation(() => {
                if (textCalled) {
                    return Promise.reject(new Error("Body already read"));
                }
                textCalled = true;
                return Promise.resolve(responseText);
            }),
        });

        const request = {
            body: { data: "sample" },
            method: RequestMethod.POST,
            headers: { "Content-Type": "application/json" },
        };

        const result = await connectionController.invoke(request);

        // URL encoded response is parsed as object
        expect(result.data).toEqual({ key1: "value1", key2: "value2" });
    });

    // Test parseResponseBody - HTML response
    it("should parse HTML response as text", async () => {
        const token = { key: "bearer_token" };
        getBearerToken.mockResolvedValue(token);
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(jest.fn());
        
        const htmlResponse = "<html><body>Success</body></html>";
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            headers: {
                get: jest.fn().mockImplementation((key) => {
                    if (key === "x-request-id") return "request_id";
                    if (key === "content-type") return "text/html";
                    return null;
                }),
            },
            text: jest.fn().mockResolvedValue(htmlResponse),
        });

        const request = {
            body: { data: "sample" },
            method: RequestMethod.POST,
            headers: { "Content-Type": "application/json" },
        };

        const result = await connectionController.invoke(request);

        expect(result.data).toEqual(htmlResponse);
    });

    // Test parseResponseBody - plain text response
    it("should parse plain text response", async () => {
        const token = { key: "bearer_token" };
        getBearerToken.mockResolvedValue(token);
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(jest.fn());
        
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            headers: {
                get: jest.fn().mockImplementation((key) => {
                    if (key === "x-request-id") return "request_id";
                    if (key === "content-type") return "text/plain";
                    return null;
                }),
            },
            text: jest.fn().mockResolvedValue("Plain text response"),
        });

        const request = {
            body: { data: "sample" },
            method: RequestMethod.POST,
            headers: { "Content-Type": "application/json" },
        };

        const result = await connectionController.invoke(request);

        expect(result.data).toEqual("Plain text response");
    });

    // Test parseResponseBody - unknown content type fallback to JSON
    it("should fallback to JSON parsing for unknown content type", async () => {
        const token = { key: "bearer_token" };
        getBearerToken.mockResolvedValue(token);
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(jest.fn());
        
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            headers: {
                get: jest.fn().mockImplementation((key) => {
                    if (key === "x-request-id") return "request_id";
                    if (key === "content-type") return "application/custom";
                    return null;
                }),
            },
            json: jest.fn().mockResolvedValue({ success: true }),
        });

        const request = {
            body: { data: "sample" },
            method: RequestMethod.POST,
            headers: { "Content-Type": "application/json" },
        };

        const result = await connectionController.invoke(request);

        expect(result.data).toEqual({ success: true });
    });

    // Test parseResponseBody - fallback to text when JSON fails
    it("should fallback to text parsing when JSON parsing fails", async () => {
        const token = { key: "bearer_token" };
        getBearerToken.mockResolvedValue(token);
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(jest.fn());
        
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            headers: {
                get: jest.fn().mockImplementation((key) => {
                    if (key === "x-request-id") return "request_id";
                    if (key === "content-type") return "";
                    return null;
                }),
            },
            json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
            text: jest.fn().mockResolvedValue("Plain text"),
        });

        const request = {
            body: { data: "sample" },
            method: RequestMethod.POST,
            headers: { "Content-Type": "application/json" },
        };

        const result = await connectionController.invoke(request);

        expect(result.data).toEqual("Plain text");
    });

    // Test error handling with JSON error response
    it("should handle errors with JSON error response", async () => {
        const token = { key: "bearer_token" };
        getBearerToken.mockResolvedValue(token);
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(jest.fn());
        mockClient.failureResponse = jest.fn().mockRejectedValue(new Error("API Error"));
        
        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
            status: 500,
            statusText: "Internal Server Error",
            headers: {
                get: jest.fn().mockImplementation((key) => {
                    if (key === "content-type") return "application/json";
                    return null;
                }),
            },
            json: jest.fn().mockResolvedValue({ error: "Something went wrong" }),
        });

        const request = {
            body: { data: "sample" },
            method: RequestMethod.POST,
            headers: { "Content-Type": "application/json" },
        };

        await expect(connectionController.invoke(request)).rejects.toThrow();
    });

    // Test error handling with HTML error response
    it("should handle errors with HTML error response", async () => {
        const token = { key: "bearer_token" };
        getBearerToken.mockResolvedValue(token);
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(jest.fn());
        mockClient.failureResponse = jest.fn().mockRejectedValue(new Error("API Error"));
        
        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
            status: 500,
            statusText: "Internal Server Error",
            headers: {
                get: jest.fn().mockImplementation((key) => {
                    if (key === "content-type") return "text/html";
                    return null;
                }),
            },
            text: jest.fn().mockResolvedValue("<html>Error</html>"),
        });

        const request = {
            body: { data: "sample" },
            method: RequestMethod.POST,
            headers: { "Content-Type": "application/json" },
        };

        await expect(connectionController.invoke(request)).rejects.toThrow();
    });

    it("should handle errors in getBearerToken", async () => {
        const tokenError = new Error("Token Error");
    
        mockClient.getLogLevel = jest.fn().mockReturnValue(LogLevel.INFO);
        mockClient.getCredentials = jest.fn().mockReturnValue({ username: "user", password: "pass" });
        getBearerToken.mockImplementation(jest.fn().mockRejectedValue(tokenError));
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(jest.fn());
    
        const request = {
            pathParams: { id: "123" },
            queryParams: { search: "test" },
            body: { data: "sample" },
            method: RequestMethod.POST,
            headers: { "Content-Type": "application/json", "Custom-Header": "value" },
        };
    
        await expect(connectionController.invoke(request)).rejects.toThrow();
    });

    it("should handle synchronous validation errors", async () => {
        const validationError = new Error("Validation Error");
    
        mockClient.getLogLevel = jest.fn().mockReturnValue(LogLevel.INFO);
        mockClient.getCredentials = jest.fn().mockReturnValue({ username: "user", password: "pass" });
        getBearerToken.mockImplementation(jest.fn().mockResolvedValue({ key: "bearer_token" }));
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(() => {
            throw validationError;
        });
    
        const request = {
            pathParams: { id: "123" },
            queryParams: { search: "test" },
            body: { data: "sample" },
            method: RequestMethod.POST,
            headers: { "Content-Type": "application/json", "Custom-Header": "value" },
        };
    
        await expect(connectionController.invoke(request)).rejects.toThrow();
    });

    // Test buildInvokeConnectionBody - XML request with object body
    it("should convert object to XML when content-type is application/xml", async () => {
        const token = { key: "bearer_token" };
        getBearerToken.mockResolvedValue(token);
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(jest.fn());
        
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            headers: {
                get: jest.fn().mockImplementation((key) => {
                    if (key === "x-request-id") return "request_id";
                    if (key === "content-type") return "application/json";
                    return null;
                }),
            },
            json: jest.fn().mockResolvedValue({ success: true }),
        });

        const request = {
            body: { root: { child: "value" } },
            method: RequestMethod.POST,
            headers: { "Content-Type": "application/xml" },
        };

        await connectionController.invoke(request);

        // Object is converted to XML with <request> as root
        expect(global.fetch).toHaveBeenCalledWith(
            "https://api.example.com/resource",
            expect.objectContaining({
                body: expect.stringContaining("<request>"),
            })
        );
    });

    // Test buildInvokeConnectionBody - XML request with string body
    it("should keep string body as-is when content-type is application/xml", async () => {
        const token = { key: "bearer_token" };
        getBearerToken.mockResolvedValue(token);
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(jest.fn());
        
        const xmlString = '<?xml version="1.0"?><root><child>value</child></root>';
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            headers: {
                get: jest.fn().mockImplementation((key) => {
                    if (key === "x-request-id") return "request_id";
                    if (key === "content-type") return "application/json";
                    return null;
                }),
            },
            json: jest.fn().mockResolvedValue({ success: true }),
        });

        const request = {
            body: xmlString,
            method: RequestMethod.POST,
            headers: { "Content-Type": "text/xml" },
        };

        await connectionController.invoke(request);

        expect(global.fetch).toHaveBeenCalledWith(
            "https://api.example.com/resource",
            expect.objectContaining({
                body: xmlString,
            })
        );
    });

    // Test buildInvokeConnectionBody - URL encoded request
    it("should convert body to URLSearchParams for application/x-www-form-urlencoded", async () => {
        const token = { key: "bearer_token" };
        getBearerToken.mockResolvedValue(token);
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(jest.fn());
        
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            headers: {
                get: jest.fn().mockImplementation((key) => {
                    if (key === "x-request-id") return "request_id";
                    if (key === "content-type") return "application/json";
                    return null;
                }),
            },
            json: jest.fn().mockResolvedValue({ success: true }),
        });

        const request = {
            body: { key1: "value1", key2: "value2" },
            method: RequestMethod.POST,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        };

        await connectionController.invoke(request);

        // URLSearchParams is converted to string by fetch
        expect(global.fetch).toHaveBeenCalledWith(
            "https://api.example.com/resource",
            expect.objectContaining({
                body: "key1=value1&key2=value2",
            })
        );
    });

    // Test buildInvokeConnectionBody - FormData request
    it("should convert body to FormData for multipart/form-data and remove content-type", async () => {
        const token = { key: "bearer_token" };
        getBearerToken.mockResolvedValue(token);
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(jest.fn());
        
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            headers: {
                get: jest.fn().mockImplementation((key) => {
                    if (key === "x-request-id") return "request_id";
                    if (key === "content-type") return "application/json";
                    return null;
                }),
            },
            json: jest.fn().mockResolvedValue({ success: true }),
        });

        const request = {
            body: { field1: "value1", field2: "value2" },
            method: RequestMethod.POST,
            headers: { "Content-Type": "multipart/form-data" },
        };

        await connectionController.invoke(request);

        const fetchCall = global.fetch.mock.calls[0][1];
        expect(fetchCall.body).toBeInstanceOf(FormData);
        // Content-Type should be removed so fetch can set boundary
        expect(fetchCall.headers["Content-Type"]).toBeUndefined();
    });

    // Test buildInvokeConnectionBody - JSON request
    it("should stringify body for application/json", async () => {
        const token = { key: "bearer_token" };
        getBearerToken.mockResolvedValue(token);
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(jest.fn());
        
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            headers: {
                get: jest.fn().mockImplementation((key) => {
                    if (key === "x-request-id") return "request_id";
                    if (key === "content-type") return "application/json";
                    return null;
                }),
            },
            json: jest.fn().mockResolvedValue({ success: true }),
        });

        const requestBody = { data: "sample", nested: { key: "value" } };
        const request = {
            body: requestBody,
            method: RequestMethod.POST,
            headers: { "Content-Type": "application/json" },
        };

        await connectionController.invoke(request);

        expect(global.fetch).toHaveBeenCalledWith(
            "https://api.example.com/resource",
            expect.objectContaining({
                body: JSON.stringify(requestBody),
            })
        );
    });

    // Test buildInvokeConnectionBody - plain text request
    it("should keep body as-is for text/plain", async () => {
        const token = { key: "bearer_token" };
        getBearerToken.mockResolvedValue(token);
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(jest.fn());
        
        const textBody = "Plain text content";
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            headers: {
                get: jest.fn().mockImplementation((key) => {
                    if (key === "x-request-id") return "request_id";
                    if (key === "content-type") return "application/json";
                    return null;
                }),
            },
            json: jest.fn().mockResolvedValue({ success: true }),
        });

        const request = {
            body: textBody,
            method: RequestMethod.POST,
            headers: { "Content-Type": "text/plain" },
        };

        await connectionController.invoke(request);

        expect(global.fetch).toHaveBeenCalledWith(
            "https://api.example.com/resource",
            expect.objectContaining({
                body: textBody,
            })
        );
    });

    // Test buildInvokeConnectionBody - HTML request
    it("should keep body as-is for text/html", async () => {
        const token = { key: "bearer_token" };
        getBearerToken.mockResolvedValue(token);
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(jest.fn());
        
        const htmlBody = "<html><body>Content</body></html>";
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            headers: {
                get: jest.fn().mockImplementation((key) => {
                    if (key === "x-request-id") return "request_id";
                    if (key === "content-type") return "application/json";
                    return null;
                }),
            },
            json: jest.fn().mockResolvedValue({ success: true }),
        });

        const request = {
            body: htmlBody,
            method: RequestMethod.POST,
            headers: { "Content-Type": "text/html" },
        };

        await connectionController.invoke(request);

        expect(global.fetch).toHaveBeenCalledWith(
            "https://api.example.com/resource",
            expect.objectContaining({
                body: htmlBody,
            })
        );
    });

    // Test buildInvokeConnectionBody - default to JSON
    it("should default to JSON stringification for unknown content types", async () => {
        const token = { key: "bearer_token" };
        getBearerToken.mockResolvedValue(token);
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(jest.fn());
        
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            headers: {
                get: jest.fn().mockImplementation((key) => {
                    if (key === "x-request-id") return "request_id";
                    if (key === "content-type") return "application/json";
                    return null;
                }),
            },
            json: jest.fn().mockResolvedValue({ success: true }),
        });

        const requestBody = { data: "sample" };
        const request = {
            body: requestBody,
            method: RequestMethod.POST,
            headers: { "Content-Type": "application/custom" },
        };

        await connectionController.invoke(request);

        expect(global.fetch).toHaveBeenCalledWith(
            "https://api.example.com/resource",
            expect.objectContaining({
                body: JSON.stringify(requestBody),
            })
        );
    });

    // Test request without body
    it("should handle requests without body (GET requests)", async () => {
        const token = { key: "bearer_token" };
        getBearerToken.mockResolvedValue(token);
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(jest.fn());
        
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            headers: {
                get: jest.fn().mockImplementation((key) => {
                    if (key === "x-request-id") return "request_id";
                    if (key === "content-type") return "application/json";
                    return null;
                }),
            },
            json: jest.fn().mockResolvedValue({ success: true }),
        });

        const request = {
            method: RequestMethod.GET,
            headers: {},
        };

        await connectionController.invoke(request);

        expect(global.fetch).toHaveBeenCalledWith(
            "https://api.example.com/resource",
            expect.objectContaining({
                method: "GET",
            })
        );
    });

    // Test custom headers preservation
    it("should preserve custom headers and override Authorization", async () => {
        const token = { key: "bearer_token" };
        getBearerToken.mockResolvedValue(token);
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(jest.fn());
        
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            headers: {
                get: jest.fn().mockImplementation((key) => {
                    if (key === "x-request-id") return "request_id";
                    if (key === "content-type") return "application/json";
                    return null;
                }),
            },
            json: jest.fn().mockResolvedValue({ success: true }),
        });

        const request = {
            body: { data: "sample" },
            method: RequestMethod.POST,
            headers: { 
                "Content-Type": "application/json",
                "X-Custom-Header": "custom-value",
                "x-skyflow-authorization": "should-be-overridden"
            },
        };

        await connectionController.invoke(request);

        const fetchCall = global.fetch.mock.calls[0][1];
        expect(fetchCall.headers["X-Custom-Header"]).toBe("custom-value");
        // The auth header is always set by the SDK
        expect(fetchCall.headers["x-skyflow-authorization"]).toBe("bearer_token");
    });

    // Line 93: FormData instance passed directly as body
    it("should use FormData instance directly as body for multipart/form-data", async () => {
        const token = { key: "bearer_token" };
        getBearerToken.mockResolvedValue(token);
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(jest.fn());

        const formData = new FormData();
        formData.append("key", "value");

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            headers: {
                get: jest.fn().mockImplementation((key) => {
                    if (key === "x-request-id") return "request_id";
                    return null;
                }),
            },
            json: jest.fn().mockResolvedValue({ success: true }),
        });

        const request = {
            body: formData,
            method: RequestMethod.POST,
            headers: { "Content-Type": "multipart/form-data" },
        };

        await connectionController.invoke(request);

        const fetchCall = global.fetch.mock.calls[0][1];
        expect(fetchCall.body).toBe(formData);
    });

    // Line 100: nested object value in multipart body → JSON.stringify in FormData
    it("should JSON.stringify nested object values when building FormData body", async () => {
        const token = { key: "bearer_token" };
        getBearerToken.mockResolvedValue(token);
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(jest.fn());

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            headers: {
                get: jest.fn().mockImplementation((key) => {
                    if (key === "x-request-id") return "request_id";
                    return null;
                }),
            },
            json: jest.fn().mockResolvedValue({ success: true }),
        });

        const request = {
            body: {
                simpleKey: "simpleValue",
                nestedObject: { innerKey: "innerValue" },
            },
            method: RequestMethod.POST,
            headers: { "Content-Type": "multipart/form-data" },
        };

        await connectionController.invoke(request);

        const fetchCall = global.fetch.mock.calls[0][1];
        expect(fetchCall.body).toBeInstanceOf(FormData);
    });

    // Line 116: non-string non-object body with XML content type → SkyflowError
    it("should throw SkyflowError when XML content type has a numeric body", async () => {
        const token = { key: "bearer_token" };
        getBearerToken.mockResolvedValue(token);
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(jest.fn());

        const request = {
            body: 12345,
            method: RequestMethod.POST,
            headers: { "Content-Type": "application/xml" },
        };

        await expect(connectionController.invoke(request)).rejects.toBeInstanceOf(SkyflowError);
    });

    // Line 130: string body with unknown content type passthrough
    it("should pass string body through for unknown content type", async () => {
        const token = { key: "bearer_token" };
        getBearerToken.mockResolvedValue(token);
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(jest.fn());

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            headers: {
                get: jest.fn().mockImplementation((key) => {
                    if (key === "x-request-id") return "request_id";
                    return null;
                }),
            },
            json: jest.fn().mockResolvedValue({ success: true }),
        });

        const request = {
            body: "raw binary string",
            method: RequestMethod.POST,
            headers: { "Content-Type": "application/octet-stream" },
        };

        await connectionController.invoke(request);

        const fetchCall = global.fetch.mock.calls[0][1];
        expect(fetchCall.body).toBe("raw binary string");
    });

    // Line 150: parseResponseBody JSON branch (case-insensitive Content-Type header)
    it("should parse JSON response body via Content-Type header match", async () => {
        const token = { key: "bearer_token" };
        getBearerToken.mockResolvedValue(token);
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(jest.fn());

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            headers: {
                get: jest.fn().mockImplementation((key) => {
                    if (key === "x-request-id") return "request_id";
                    if (key?.toLowerCase() === "content-type") return "application/json";
                    return null;
                }),
            },
            json: jest.fn().mockResolvedValue({ parsed: "json_data" }),
        });

        const request = {
            body: { data: "sample" },
            method: RequestMethod.POST,
            headers: { "Content-Type": "application/json" },
        };

        const result = await connectionController.invoke(request);
        expect(result.data).toEqual({ parsed: "json_data" });
    });

    // Line 155: parseResponseBody XML response branch
    it("should parse XML response body as text via Content-Type header", async () => {
        const token = { key: "bearer_token" };
        getBearerToken.mockResolvedValue(token);
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(jest.fn());

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            headers: {
                get: jest.fn().mockImplementation((key) => {
                    if (key === "x-request-id") return "request_id";
                    if (key?.toLowerCase() === "content-type") return "application/xml";
                    return null;
                }),
            },
            text: jest.fn().mockResolvedValue("<response><data>value</data></response>"),
        });

        const request = {
            body: "<request><data>sample</data></request>",
            method: RequestMethod.POST,
            headers: { "Content-Type": "application/xml" },
        };

        const result = await connectionController.invoke(request);
        expect(result.data).toBe("<response><data>value</data></response>");
    });

    // Line 160: parseResponseBody text/html response branch
    it("should parse text/html response body as text via Content-Type header", async () => {
        const token = { key: "bearer_token" };
        getBearerToken.mockResolvedValue(token);
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(jest.fn());

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            headers: {
                get: jest.fn().mockImplementation((key) => {
                    if (key === "x-request-id") return "request_id";
                    if (key?.toLowerCase() === "content-type") return "text/html";
                    return null;
                }),
            },
            text: jest.fn().mockResolvedValue("<html><body>response</body></html>"),
        });

        const request = {
            body: { data: "sample" },
            method: RequestMethod.POST,
            headers: { "Content-Type": "application/json" },
        };

        const result = await connectionController.invoke(request);
        expect(result.data).toBe("<html><body>response</body></html>");
    });

    // Line 167: parseResponseBody multipart/form-data response branch
    it("should parse multipart/form-data response body as text via Content-Type header", async () => {
        const token = { key: "bearer_token" };
        getBearerToken.mockResolvedValue(token);
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(jest.fn());

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            headers: {
                get: jest.fn().mockImplementation((key) => {
                    if (key === "x-request-id") return "request_id";
                    if (key?.toLowerCase() === "content-type") return "multipart/form-data; boundary=boundary123";
                    return null;
                }),
            },
            text: jest.fn().mockResolvedValue("--boundary123\r\npart data\r\n--boundary123--"),
        });

        const request = {
            body: { data: "sample" },
            method: RequestMethod.POST,
            headers: { "Content-Type": "application/json" },
        };

        const result = await connectionController.invoke(request);
        expect(typeof result.data).toBe("string");
    });

    // Lines 176-178: parseResponseBody outer catch — json() fails, text() returns value
    it("should return { message: text } when json() rejects and text() resolves in parseResponseBody", async () => {
        const token = { key: "bearer_token" };
        getBearerToken.mockResolvedValue(token);
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(jest.fn());

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            headers: {
                get: jest.fn().mockImplementation((key) => {
                    if (key === "x-request-id") return "request_id";
                    if (key?.toLowerCase() === "content-type") return "application/json";
                    return null;
                }),
            },
            json: jest.fn().mockRejectedValue(new Error("JSON parse error")),
            text: jest.fn().mockResolvedValue("error occurred"),
        });

        const request = {
            body: { data: "sample" },
            method: RequestMethod.POST,
            headers: { "Content-Type": "application/json" },
        };

        const result = await connectionController.invoke(request);
        expect(result.data).toEqual({ message: "error occurred" });
    });

    // Lines 179-181: parseResponseBody outer catch — both json() and text() reject
    it("should return null when both json() and text() reject in parseResponseBody", async () => {
        const token = { key: "bearer_token" };
        getBearerToken.mockResolvedValue(token);
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(jest.fn());

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            headers: {
                get: jest.fn().mockImplementation((key) => {
                    if (key === "x-request-id") return "request_id";
                    if (key?.toLowerCase() === "content-type") return "application/json";
                    return null;
                }),
            },
            json: jest.fn().mockRejectedValue(new Error("JSON parse error")),
            text: jest.fn().mockRejectedValue(new Error("Text parse error")),
            body: { cancel: jest.fn().mockResolvedValue(undefined) },
        });

        const request = {
            body: { data: "sample" },
            method: RequestMethod.POST,
            headers: { "Content-Type": "application/json" },
        };

        const result = await connectionController.invoke(request);
        expect(result.data).toBeNull();
    });

    // Line 270: deprecated request_ID getter on metadata
    it("should trigger deprecation warning when accessing request_ID property on metadata", async () => {
        const token = { key: "bearer_token" };
        getBearerToken.mockResolvedValue(token);
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(jest.fn());

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            headers: {
                get: jest.fn().mockImplementation((key) => {
                    if (key === "x-request-id") return "test-request-id";
                    if (key?.toLowerCase() === "content-type") return "application/json";
                    return null;
                }),
            },
            json: jest.fn().mockResolvedValue({ success: true }),
        });

        const request = {
            body: { data: "sample" },
            method: RequestMethod.POST,
            headers: { "Content-Type": "application/json" },
        };

        const result = await connectionController.invoke(request);
        // Access deprecated getter — triggers printLog warning at line 270
        const deprecatedValue = result.metadata.request_ID;
        expect(deprecatedValue).toBeDefined();
        expect(result.metadata.requestId).toBeDefined();
    });
});
