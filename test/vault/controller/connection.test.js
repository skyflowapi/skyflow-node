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

    const scenarios = [
        {
            name: "should invoke a connection successfully",
            request: {
                pathParams: { id: "123" },
                queryParams: { search: "test" },
                body: { data: "sample" },
                method: RequestMethod.POST,
                headers: { "Custom-Header": "value" },
            },
            mockFetch: jest.fn().mockResolvedValue({
                json: jest.fn().mockResolvedValue({ data: { success: true } }),
                headers: {
                    get: jest.fn().mockImplementation((key) => {
                        if (key === "x-request-id") return "request_id";
                        return null;
                    }),
                },
            }),
            expectedResult: {
                data: { success: true },
                metadata: { requestId: '' },
                errors: undefined
            },
            expectError: false,
        },
        {
            name: "should handle errors in fetch call",
            request: {
                pathParams: { id: "123" },
                queryParams: { search: "test" },
                body: { data: "sample" },
                method: RequestMethod.POST,
                headers: { "Custom-Header": "value" },
            },
            mockFetch: jest.fn().mockRejectedValue(new Error("Internal Server Error")),
            expectedError: "Internal Server Error",
            expectError: true,
        },
        {
            name: "should handle errors in getBearerToken",
            request: {
                pathParams: { id: "123" },
                queryParams: { search: "test" },
                body: { data: "sample" },
                method: RequestMethod.POST,
                headers: { "Custom-Header": "value" },
            },
            mockFetch: jest.fn(), // Fetch won't be reached
            mockGetBearerToken: jest.fn().mockRejectedValue(new Error("Token Error")),
            expectedError: "Token Error",
            expectError: true,
        },
        {
            name: "should handle synchronous validation errors",
            request: {
                pathParams: { id: "123" },
                queryParams: { search: "test" },
                body: { data: "sample" },
                method: RequestMethod.POST,
                headers: { "Custom-Header": "value" },
            },
            mockFetch: jest.fn(), // Fetch won't be reached
            mockValidation: jest.fn().mockImplementation(() => {
                throw new Error("Validation Error");
            }),
            expectedError: "Validation Error",
            expectError: true,
        },
    ];

    scenarios.forEach(({ name, request, mockFetch, mockGetBearerToken, mockValidation, expectedResult, expectedError, expectError }) => {
        it(name, async () => {
            const token = { key: "bearer_token" };

            // Mocking methods
            mockClient.getLogLevel = jest.fn().mockReturnValue(LogLevel.INFO);
            mockClient.getCredentials = jest.fn().mockReturnValue({ username: "user", password: "pass" });
            (getBearerToken).mockImplementation(mockGetBearerToken || jest.fn().mockResolvedValue(token));
            (fillUrlWithPathAndQueryParams).mockReturnValue("https://api.example.com/resource");
            (generateSDKMetrics).mockReturnValue({ metric: "value" });
            (validateInvokeConnectionRequest).mockImplementation(mockValidation || jest.fn());
            global.fetch = mockFetch; // Mock `fetch`

            if (expectError) {
                await expect(connectionController.invoke(request)).rejects.toThrow(expectedError);
            } else {
                const result = await connectionController.invoke(request);
                expect(result).toEqual(expectedResult);
            }

            if (!mockValidation) {
                expect(validateInvokeConnectionRequest).toHaveBeenCalledWith(request);
            }

            if (!expectError || name === "should invoke a connection successfully") {
                expect(fetch).toHaveBeenCalledWith("https://api.example.com/resource", {
                    method: RequestMethod.POST,
                    body: JSON.stringify(request.body),
                    headers: {
                        ...request.headers,
                        [SKYFLOW_AUTH_HEADER_KEY]: token.key,
                        [SDK_METRICS_HEADER_KEY]: JSON.stringify(generateSDKMetrics()),
                    },
                });
            }
        });
    });
});
