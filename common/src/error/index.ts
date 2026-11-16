import { BAD_REQUEST, ISkyflowError, LogLevel, MessageType, parameterizedString, printLog } from "../utils";
import logs from "../utils/logs";

class SkyflowError extends Error {

    error?: ISkyflowError;

    constructor(errorCode: ISkyflowError, args: Array<string | number> = []) {
        const formattedError: any = {
            httpStatus: errorCode.httpStatus ?? errorCode.http_status ?? BAD_REQUEST,
            details: errorCode.details || [],
            requestId: errorCode.requestId || null,
            grpcCode: errorCode.grpcCode ?? errorCode.grpc_code ?? null,
            httpCode: errorCode.httpCode ?? errorCode.http_code,
            message: args?.length > 0
                ? parameterizedString(errorCode.message, ...args)
                : errorCode.message,
        };

        // Deprecated aliases — remove after v3
        Object.defineProperty(formattedError, 'request_ID', {
            get() {
                printLog(logs.warnLogs.DEPRECATED_REQUEST_ID_PROPERTY, MessageType.WARN, LogLevel.WARN);
                return this.requestId;
            },
            enumerable: true,
            configurable: true,
        });
        Object.defineProperty(formattedError, 'http_code', {
            get() {
                printLog(logs.warnLogs.DEPRECATED_HTTP_CODE_PROPERTY, MessageType.WARN, LogLevel.WARN);
                return this.httpCode;
            },
            enumerable: true,
            configurable: true,
        });
        Object.defineProperty(formattedError, 'http_status', {
            get() {
                printLog(logs.warnLogs.DEPRECATED_HTTP_STATUS_PROPERTY, MessageType.WARN, LogLevel.WARN);
                return this.httpStatus;
            },
            enumerable: true,
            configurable: true,
        });
        Object.defineProperty(formattedError, 'grpc_code', {
            get() {
                printLog(logs.warnLogs.DEPRECATED_GRPC_CODE_PROPERTY, MessageType.WARN, LogLevel.WARN);
                return this.grpcCode;
            },
            enumerable: true,
            configurable: true,
        });

        super(formattedError.message);
        this.error = formattedError;
    }

}

export default SkyflowError;