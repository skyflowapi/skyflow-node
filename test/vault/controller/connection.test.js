import {
    fillUrlWithPathAndQueryParams,
    generateSDKMetrics,
    getBearerToken,
    LogLevel,
    RequestMethod,
    SDK_METRICS_HEADER_KEY,
    SKYFLOW_AUTH_HEADER_KEY,
} from "../../../src/utils";
import { validateInvokeConnectionRequest } from "../../../src/utils/validations";
import VaultClient from "../../../src/vault/client";
import ConnectionController from "../../../src/vault/controller/connections";

jest.mock("../../../src/utils");
jest.mock("../../../src/utils/validations");

describe("ConnectionController Tests", () => {
    let mockClient;
    let connectionController;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useRealTimers();
        mockClient = new VaultClient();
        connectionController = new ConnectionController(mockClient);
    });

    it("should invoke a connection successfully", async () => {
        const token = { key: "bearer_token" };
    
        // Mocking methods
        mockClient.getLogLevel = jest.fn().mockReturnValue(LogLevel.INFO);
        mockClient.getCredentials = jest.fn().mockReturnValue({ username: "user", password: "pass" });
        getBearerToken.mockImplementation(jest.fn().mockResolvedValue(token));
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(jest.fn());
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            statusText: "OK",
            json: jest.fn().mockResolvedValue({ data: { success: true } }),
            headers: {
                get: jest.fn().mockImplementation((key) => {
                    if (key === "x-request-id") return "request_id";
                    return null;
                }),
            },
        });
    
        const request = {
            pathParams: { id: "123" },
            queryParams: { search: "test" },
            body: { data: "sample" },
            method: RequestMethod.POST,
            headers: { "Content-Type": "application/json", "Custom-Header": "value" },
        };
    
        const expectedResult = {
            data: { success: true },
            metadata: { requestId: "request_id" },
            errors: undefined,
        };
    
        const result = await connectionController.invoke(request);
    
        expect(fetch).toHaveBeenCalledWith("https://api.example.com/resource", {
            method: RequestMethod.POST,
            body: JSON.stringify(request.body),
            headers: {
                ...request.headers,
                [SKYFLOW_AUTH_HEADER_KEY]: token.key,
                [SDK_METRICS_HEADER_KEY]: JSON.stringify(generateSDKMetrics()),
            },
        });
    });

    it("should handle errors in fetch call", async () => {
        const token = { key: "bearer_token" };
    
        mockClient.getLogLevel = jest.fn().mockReturnValue(LogLevel.INFO);
        mockClient.getCredentials = jest.fn().mockReturnValue({ username: "user", password: "pass" });
        getBearerToken.mockImplementation(jest.fn().mockResolvedValue(token));
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(jest.fn());
        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
            status: 500,
            statusText: "Internal Server Error",
            json: jest.fn().mockResolvedValue({ error: "Something went wrong" }),
            headers: {
                get: jest.fn().mockImplementation(() => null),
            },
        });
    
        const request = {
            pathParams: { id: "123" },
            queryParams: { search: "test" },
            body: { data: "sample" },
            method: RequestMethod.POST,
            headers: { "Content-Type": "application/json", "Custom-Header": "value" },
        };
    
        const expectedError = {
            body: { error: "Something went wrong" },
            statusCode: 500,
            message: "Internal Server Error",
            headers: expect.anything(),
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
});
