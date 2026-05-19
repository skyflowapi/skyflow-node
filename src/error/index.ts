import { BAD_REQUEST, ISkyflowError, LogLevel, MessageType, parameterizedString, printLog } from "../utils";

class SkyflowError extends Error {

    error?: ISkyflowError;

    constructor(errorCode: ISkyflowError, args: Array<string | number> = []) {
        const formattedError: any = {
            http_status: errorCode.http_status || BAD_REQUEST,
            details: errorCode.details || [],
            requestId: errorCode.requestId || null,
            grpc_code: errorCode.grpc_code || null,
            http_code: errorCode.http_code,
            message: args?.length > 0
                ? parameterizedString(errorCode.message, ...args)
                : errorCode.message,
        };

        // Deprecated alias — remove after v3
        Object.defineProperty(formattedError, 'request_ID', {
            get() {
                printLog(logs.warnLogs.DEPRECATED_REQUEST_ID_PROPERTY, MessageType.WARN, LogLevel.WARN);
                return this.requestId;
            },
            enumerable: true,
            configurable: true,
        });

        super(formattedError.message);
        this.error = formattedError;
    }

}

export default SkyflowError;