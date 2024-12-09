import { BAD_REQUEST, ISkyflowError, parameterizedString } from "../utils";

class SkyflowError extends Error {

    error?: ISkyflowError;

    constructor(errorCode: ISkyflowError, args: any[] = []) {
        const formattedError = {
            http_status: errorCode?.http_status || BAD_REQUEST,
            details: errorCode?.details || [],
            request_ID: errorCode?.request_ID || null,
            grpc_code: errorCode?.grpc_code || null,
            http_code: errorCode.http_code,
            message: args?.length > 0
                ? parameterizedString(errorCode.message, ...args)
                : errorCode.message,
        };
        super(formattedError.message);
        this.error = formattedError;
    }

}

export default SkyflowError;