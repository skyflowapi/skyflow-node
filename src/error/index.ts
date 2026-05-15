import { BAD_REQUEST, ISkyflowError, parameterizedString } from "../utils";
import { warnOnce } from "../utils/warn-once";

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
                warnOnce('SkyflowError.error.request_ID is deprecated, use requestId');
                return this.requestId;
            },
            enumerable: false,
            configurable: true,
        });

        super(formattedError.message);
        this.error = formattedError;
    }

}

export default SkyflowError;