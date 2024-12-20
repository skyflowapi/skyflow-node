//imports
import axios from "axios";
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
                    axios({
                        url: filledUrl,
                        method: invokeRequest.method || RequestMethod.POST,
                        data: invokeRequest.body,
                        headers: { ...invokeRequest.headers, ...sdkHeaders }
                    }).then((response: any) => {
                        printLog(logs.infoLogs.INVOKE_CONNECTION_REQUEST_RESOLVED, MessageType.LOG, this.logLevel);
                        let requestId = response.headers[REQUEST_ID_KEY]
                        const invokeConnectionResponse = new InvokeConnectionResponse({
                            data: response.data,
                            metadata: {requestId}
                        });
                        resolve(invokeConnectionResponse);
                    }).catch((err) => {
                        printLog(logs.errorLogs.INVOKE_CONNECTION_REQUEST_REJECTED, MessageType.LOG, this.logLevel);
                        this.client.failureResponse(err).catch((err)=>reject(err))
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
