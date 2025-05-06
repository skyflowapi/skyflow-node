//imports
import { fillUrlWithPathAndQueryParams, generateSDKMetrics, getBearerToken, LogLevel, MessageType, RequestMethod, parameterizedString, printLog, SDK_METRICS_HEADER_KEY, SKYFLOW_AUTH_HEADER_KEY, REQUEST_ID_KEY, TYPES } from "../../../utils";
import InvokeConnectionRequest from "../../model/request/inkove";
import logs from "../../../utils/logs";
import { validateInvokeConnectionRequest } from "../../../utils/validations";
import VaultClient from "../../client";
import InvokeConnectionResponse from "../../model/response/invoke/invoke";

class ConnectionController {

    private client: VaultClient;

    private logLevel: LogLevel;

    constructor(client: VaultClient) {
        this.client = client;
        this.logLevel = client.getLogLevel();
    }

    private buildInvokeConnectionBody(invokeRequest: InvokeConnectionRequest){
        let requestBody;
        const contentType = invokeRequest.headers?.['Content-Type'] || 'application/json';
        if (contentType === 'application/json') {
            requestBody = JSON.stringify(invokeRequest.body);
        } else if (contentType === 'application/x-www-form-urlencoded') {
            const urlSearchParams = new URLSearchParams();
            Object.entries(invokeRequest.body || {}).forEach(([key, value]) => {
                if (typeof value === 'object' && value !== null) {
                    Object.entries(value).forEach(([nestedKey, nestedValue]) => {
                        urlSearchParams.append(`${key}[${nestedKey}]`, nestedValue as string);
                    });
                } else {
                    urlSearchParams.append(key, value as string);
                }
            });
            requestBody = urlSearchParams.toString();
        } else {
            requestBody = invokeRequest.body;
        }

        return requestBody;
    }

    invoke(invokeRequest: InvokeConnectionRequest): Promise<InvokeConnectionResponse> {
        return new Promise((resolve, reject) => {
            try {
                printLog(logs.infoLogs.INVOKE_CONNECTION_TRIGGERED, MessageType.LOG, this.logLevel);
                printLog(logs.infoLogs.VALIDATE_CONNECTION_CONFIG, MessageType.LOG, this.logLevel);
                // validations checks
                validateInvokeConnectionRequest(invokeRequest);
                const filledUrl = fillUrlWithPathAndQueryParams(this.client.url, invokeRequest.pathParams, invokeRequest.queryParams);
                getBearerToken(this.client.getCredentials(), this.logLevel).then((token) => {
                    printLog(parameterizedString(logs.infoLogs.EMIT_REQUEST, TYPES.INVOKE_CONNECTION), MessageType.LOG, this.logLevel);
                    const sdkHeaders = {};
                    sdkHeaders[SKYFLOW_AUTH_HEADER_KEY] = token.key;
                    sdkHeaders[SDK_METRICS_HEADER_KEY] = JSON.stringify(generateSDKMetrics());
                    
                    fetch(filledUrl, {
                        method: invokeRequest.method || RequestMethod.POST,
                        body: this.buildInvokeConnectionBody(invokeRequest),
                        headers: { ...invokeRequest.headers, ...sdkHeaders },
                    })
                        .then(async (response) => {
                            if(!response.ok){
                                const errorBody = await response.json().catch(() => null);

                                const error = {
                                    body: errorBody,
                                    statusCode: response.status,
                                    message: response.statusText,
                                    headers: response.headers
                                };
                                throw error;
                            }
                            const headers = response.headers;
                            return response.json().then((body) => ({ headers, body }));
                        })
                        .then(({headers, body}) => {
                            printLog(logs.infoLogs.INVOKE_CONNECTION_REQUEST_RESOLVED, MessageType.LOG, this.logLevel);
                            const requestId = headers?.get(REQUEST_ID_KEY) || '';
                            const invokeConnectionResponse = new InvokeConnectionResponse({
                                data: body,
                                metadata: { requestId }
                            });
                            resolve(invokeConnectionResponse);
                        }).catch((err) => {
                            printLog(logs.errorLogs.INVOKE_CONNECTION_REQUEST_REJECTED, MessageType.LOG, this.logLevel);
                            this.client.failureResponse(err).catch((err) => reject(err))
                        });
                }).catch(err => {
                    reject(err);
                })
            } catch (e) {
                if (e instanceof Error)
                    printLog(e.message, MessageType.ERROR, this.logLevel);
                reject(e);
            }
        });
    }

}

export default ConnectionController;
