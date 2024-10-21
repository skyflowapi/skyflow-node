//imports
import axios from "axios";
import { fillUrlWithPathAndQueryParams, generateSDKMetrics, getBearerToken, LogLevel, MessageType, METHOD, parameterizedString, printLog, SDK_METRICS_HEADER_KEY, TYPES } from "../../../utils";
import InvokeConnectionRequest from "../../model/request/inkove";
import logs from "../../../utils/logs";
import { validateInvokeConnectionRequest } from "../../../utils/validations";
import VaultClient from "../../client";

class ConnectionController {

    private client: VaultClient;

    private logLevel: LogLevel;

    constructor(client: VaultClient) {
        this.client = client;
        this.logLevel = client.getLogLevel();
    }

    invoke(invokeRequest: InvokeConnectionRequest) {
        return new Promise((resolve, reject) => {
            try {
                printLog(logs.infoLogs.INVOKE_CONNECTION_TRIGGERED, MessageType.LOG, this.logLevel);
                printLog(logs.infoLogs.VALIDATE_CONNECTION_CONFIG, MessageType.LOG, this.logLevel);
                // validations checks
                validateInvokeConnectionRequest(invokeRequest);
                const filledUrl = fillUrlWithPathAndQueryParams(invokeRequest.url, invokeRequest.pathParams, invokeRequest.queryParams);
                getBearerToken(this.client.getCredentials(), this.logLevel).then((res) => {
                    printLog(parameterizedString(logs.infoLogs.EMIT_REQUEST, TYPES.INVOKE_CONNECTION), MessageType.LOG, this.logLevel);
                    const sdkHeaders = {};
                    sdkHeaders[SDK_METRICS_HEADER_KEY] = JSON.stringify(generateSDKMetrics());
                    axios({
                        url: filledUrl,
                        method: invokeRequest.method || METHOD.POST,
                        data: invokeRequest.body,
                        headers: { ...invokeRequest.headers, ...sdkHeaders }
                    }).then((response: any) => {
                        printLog(logs.infoLogs.INVOKE_CONNECTION_REQUEST_RESOLVED, MessageType.LOG, this.logLevel);
                        resolve(response.data);
                    }).catch((err) => {
                        printLog(logs.errorLogs.INVOKE_CONNECTION_REQUEST_REJECTED, MessageType.LOG, this.logLevel);
                        reject({ errors: [err] });
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
