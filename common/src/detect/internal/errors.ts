// Normalizes a failure from the generated Detect V2 client into the SDK's SkyflowError.
// The wire envelope is `{ error: { grpc_code, http_code, http_status, message, details } }`,
// reached through the generated error's `body`; the request id travels in the `x-request-id`
// response header.
import { HTTP_HEADER, HTTP_STATUS_CODE, LogLevel, MessageType, printLog } from "../../utils";
import errorMessages from "../../error/messages";
import SkyflowError from "../../error";

interface GeneratedErrorLike {
    statusCode?: number;
    body?: unknown;
    rawResponse?: { headers?: { get?: (name: string) => string | null | undefined } };
    message?: string;
}

/** @internal */
export function toSkyflowError(err: unknown, errorLog: string, logLevel: LogLevel = LogLevel.ERROR): SkyflowError {
    printLog(errorLog, MessageType.ERROR, logLevel);
    if (err instanceof SkyflowError) {
        return err;
    }
    const e = (err ?? {}) as GeneratedErrorLike;
    const headers = e.rawResponse?.headers;
    const headerRequestId = headers && headers.get ? headers.get(HTTP_HEADER.X_REQUEST_ID) ?? "" : "";

    const body = e.body;
    const errorData =
        ((body && typeof body === "object" ? (body as { error?: unknown }).error : undefined) ?? {}) as Record<string, unknown>;

    const message = String(errorData.message ?? e.message ?? errorMessages.ERROR_OCCURRED);
    const httpCode =
        (e.statusCode as number | undefined) ??
        (errorData.httpCode as number | string | undefined) ??
        (errorData.http_code as number | string | undefined) ??
        HTTP_STATUS_CODE.BAD_REQUEST;
    const grpcCode = (errorData.grpcCode ?? errorData.grpc_code) as number | string | undefined;
    const httpStatus = (errorData.httpStatus ?? errorData.http_status) as string | undefined;
    const details = (errorData.details ?? []) as Array<string>;
    const requestId = (errorData.requestId as string | undefined) ?? headerRequestId;

    printLog(message, MessageType.ERROR, logLevel);
    return new SkyflowError({ httpCode, message, requestId, grpcCode, httpStatus, details }, []);
}
