import axios from "axios";
import { fillUrlWithPathAndQueryParams, generateSDKMetrics, getBearerToken, LogLevel, MessageType, Method, parameterizedString, printLog, SDK_METRICS_HEADER_KEY, TYPES } from "../../../src/utils";
import logs from "../../../src/utils/logs";
import { validateInvokeConnectionRequest } from "../../../src/utils/validations";
import VaultClient from "../../../src/vault/client";
import ConnectionController from "../../../src/vault/controller/connections";

jest.mock("axios");
jest.mock("../../../src/utils");
jest.mock("../../../src/utils/validations");

describe("ConnectionController", () => {
    let mockClient;
    let connectionController;

    beforeEach(() => {
        mockClient = new VaultClient();
        connectionController = new ConnectionController(mockClient);
        jest.clearAllMocks(); // Clear previous mocks before each test
    });

    it("should invoke a connection successfully", async () => {
        const invokeRequest = {
            pathParams: { id: "123" },
            queryParams: { search: "test" },
            body: { data: "sample" },
            method: Method.POST,
            headers: { "Custom-Header": "value" },
        };

        const token = { key: "bearer_token" };
        const response = { data: { success: true }, headers: { 'x-request-id': 'request_id' } };

        // Mocking implementations
        mockClient.getLogLevel = jest.fn().mockReturnValue(LogLevel.INFO);
        mockClient.getCredentials = jest.fn().mockReturnValue({ username: "user", password: "pass" });
        getBearerToken.mockResolvedValue(token);
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        axios.mockResolvedValue(response);
        validateInvokeConnectionRequest.mockImplementation(() => {}); // No-op for validation

        const result = await connectionController.invoke(invokeRequest);

        expect(validateInvokeConnectionRequest).toHaveBeenCalledWith(invokeRequest);
        expect(getBearerToken).toHaveBeenCalledWith(mockClient.getCredentials(), LogLevel.ERROR);
        expect(axios).toHaveBeenCalledWith({
            url: "https://api.example.com/resource",
            method: Method.POST,
            data: invokeRequest.body,
            headers: {
                ...invokeRequest.headers,
                'x-skyflow-authorization': token.key,
                [SDK_METRICS_HEADER_KEY]: JSON.stringify(generateSDKMetrics()),
            },
        });
        expect(result).toEqual({ data: response.data, metadata: { requestId: 'request_id' } });
    });

    it("should handle errors in getBearerToken", async () => {
        const invokeRequest = {
            pathParams: { id: "123" },
            queryParams: { search: "test" },
            body: { data: "sample" },
            method: Method.POST,
            headers: { "Custom-Header": "value" },
        };

        // Mocking implementations
        mockClient.getLogLevel = jest.fn().mockReturnValue(LogLevel.INFO);
        mockClient.getCredentials = jest.fn().mockReturnValue({ username: "user", password: "pass" });
        getBearerToken.mockRejectedValue(new Error("Token error"));

        await expect(connectionController.invoke(invokeRequest)).rejects.toThrow("Token error");
    });

    it("should handle errors in axios call", async () => {
        const invokeRequest = {
            pathParams: { id: "123" },
            queryParams: { search: "test" },
            body: { data: "sample" },
            // method: Method.POST,
            headers: { "Custom-Header": "value" },
        };

        const token = { key: "bearer_token" };
        const errorResponse = {
            response: {
                status: 500,
                data: { message: "Internal Server Error" },
                headers: { 'x-request-id': 'request_id' },
            }
        };

        // Mocking implementations
        mockClient.getLogLevel = jest.fn().mockReturnValue(LogLevel.INFO);
        mockClient.getCredentials = jest.fn().mockReturnValue({ username: "user", password: "pass" });
        getBearerToken.mockResolvedValue(token);
        fillUrlWithPathAndQueryParams.mockReturnValue("https://api.example.com/resource");
        generateSDKMetrics.mockReturnValue({ metric: "value" });
        validateInvokeConnectionRequest.mockImplementation(() => {});
        axios.mockRejectedValue(errorResponse);
        mockClient.failureResponse = jest.fn().mockResolvedValue(undefined);

        connectionController.invoke(invokeRequest).catch(err=>{
            expect(err).toBeDefined();
        })

        expect(mockClient.failureResponse).not.toHaveBeenCalledWith(errorResponse);
    });

    it("should handle synchronous validation errors", async () => {
        const invokeRequest = {
            pathParams: { id: "123" },
            queryParams: { search: "test" },
            body: { data: "sample" },
            method: Method.POST,
            headers: { "Custom-Header": "value" },
        };

        const validationError = new Error("Validation error");
        validateInvokeConnectionRequest.mockImplementation(() => { throw validationError; });

        await expect(connectionController.invoke(invokeRequest)).rejects.toThrow(validationError);
    });
});
