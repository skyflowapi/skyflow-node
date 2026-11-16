// Client-side validation for Detect V2 requests. Internal to the SDK.
import * as fs from "fs";
import { LogLevel, MessageType, parameterizedString, printLog } from "../../utils";
import logs from "../../utils/logs";
import SkyflowError from "../../error";
import SKYFLOW_ERROR_CODE from "../../error/codes";
import { POLL_OPTIONS, PollOptions } from "../types";
import DeidentifyStringRequest from "../model/request/deidentify-string";
import DeidentifyFileRequest from "../model/request/deidentify-file";
import ReidentifyStringRequest from "../model/request/reidentify-string";
import ReidentifyFileRequest from "../model/request/reidentify-file";
import GetRunRequest from "../model/request/get-run";
import CheckGuardrailsRequest from "../model/request/check-guardrails";

/** @internal */
export const DETECT_INTERFACE_NAME = "detect";

function isBlank(value: unknown): boolean {
    return typeof value !== "string" || value.trim().length === 0;
}

/** Looks like a web `File`: something that can be read as an ArrayBuffer. Callers pass a non-null value. */
function isFileLike(value: unknown): boolean {
    const candidate = value as { arrayBuffer?: unknown };
    return candidate.arrayBuffer instanceof Function;
}

function invalid(log: string, code: { httpCode: number; message: string }, logLevel: LogLevel): SkyflowError {
    printLog(parameterizedString(log, DETECT_INTERFACE_NAME), MessageType.ERROR, logLevel);
    return new SkyflowError(code);
}

/** @internal */
export function validateDeidentifyStringRequest(request: DeidentifyStringRequest, logLevel: LogLevel = LogLevel.ERROR): void {
    if (!request) {
        throw invalid(logs.errorLogs.DEIDENTIFY_STRING_REQUEST_NULL, SKYFLOW_ERROR_CODE.INVALID_DEIDENTIFY_STRING_REQUEST, logLevel);
    }
    if (isBlank(request.text)) {
        throw invalid(logs.errorLogs.INVALID_TEXT_IN_DEIDENTIFY_STRING, SKYFLOW_ERROR_CODE.INVALID_TEXT_IN_DEIDENTIFY_STRING, logLevel);
    }
    // configurationId and configuration are both optional on the API and are passed through as given;
    // with neither set the mapper sends a configuration carrying only the vault id.
}

/** @internal */
export function validateDeidentifyFileRequest(request: DeidentifyFileRequest, logLevel: LogLevel = LogLevel.ERROR): void {
    if (!request) {
        throw invalid(logs.errorLogs.DEIDENTIFY_FILE_REQUEST_NULL, SKYFLOW_ERROR_CODE.INVALID_DEIDENTIFY_FILE_REQUEST, logLevel);
    }
    // The file comes from exactly one of filePath, file or value; dataSource belongs to value only.
    const hasFile = request.file !== undefined && request.file !== null;
    const hasFilePath = request.filePath !== undefined && request.filePath !== null;
    const hasValue = request.value !== undefined && request.value !== null;
    const sources = [hasFile, hasFilePath, hasValue].filter(Boolean).length;
    if (sources === 0) {
        throw invalid(logs.errorLogs.MISSING_FILE_SOURCE_IN_DEIDENTIFY_FILE, SKYFLOW_ERROR_CODE.MISSING_FILE_SOURCE_IN_DEIDENTIFY_FILE, logLevel);
    }
    if (sources > 1) {
        throw invalid(logs.errorLogs.MULTIPLE_FILE_SOURCES_IN_DEIDENTIFY_FILE, SKYFLOW_ERROR_CODE.MULTIPLE_FILE_SOURCES_IN_DEIDENTIFY_FILE, logLevel);
    }
    if (hasFile) {
        if (!isFileLike(request.file)) {
            throw invalid(logs.errorLogs.INVALID_FILE_IN_DEIDENTIFY_FILE, SKYFLOW_ERROR_CODE.INVALID_FILE_IN_DEIDENTIFY_FILE, logLevel);
        }
    } else if (hasFilePath) {
        let isFile = false;
        try {
            isFile = fs.statSync(request.filePath as string).isFile();
        } catch (_e) {
            isFile = false;
        }
        if (!isFile) {
            throw invalid(logs.errorLogs.FILE_NOT_FOUND_IN_DEIDENTIFY_FILE, SKYFLOW_ERROR_CODE.FILE_NOT_FOUND_IN_DEIDENTIFY_FILE, logLevel);
        }
    } else {
        if (!request.dataSource) {
            throw invalid(logs.errorLogs.INVALID_DATA_SOURCE_IN_DEIDENTIFY_FILE, SKYFLOW_ERROR_CODE.INVALID_DATA_SOURCE_IN_DEIDENTIFY_FILE, logLevel);
        }
        if (isBlank(request.value)) {
            throw invalid(logs.errorLogs.INVALID_VALUE_IN_DEIDENTIFY_FILE, SKYFLOW_ERROR_CODE.INVALID_VALUE_IN_DEIDENTIFY_FILE, logLevel);
        }
    }
    // configurationId and configuration are both optional on the API and are passed through as given.
    validatePollOptions(request.pollOptions, logLevel);
    if (!request.pollOptions && !isBlank(request.outputDirectory)) {
        throw invalid(logs.errorLogs.OUTPUT_DIRECTORY_WITHOUT_POLL_OPTIONS, SKYFLOW_ERROR_CODE.OUTPUT_DIRECTORY_WITHOUT_POLL_OPTIONS, logLevel);
    }
}

/** @internal */
export function validatePollOptions(options: PollOptions | undefined, logLevel: LogLevel = LogLevel.ERROR): void {
    if (!options) {
        return;
    }
    const { waitTime, maxAttempts } = options;
    if (
        waitTime !== undefined &&
        (typeof waitTime !== "number" || !Number.isFinite(waitTime) || waitTime < 1 || waitTime > POLL_OPTIONS.MAX_WAIT_TIME_SECONDS)
    ) {
        throw invalid(logs.errorLogs.INVALID_WAIT_TIME_IN_POLL_OPTIONS, SKYFLOW_ERROR_CODE.INVALID_WAIT_TIME_IN_POLL_OPTIONS, logLevel);
    }
    if (
        maxAttempts !== undefined &&
        (typeof maxAttempts !== "number" || !Number.isFinite(maxAttempts) || maxAttempts < 1 || maxAttempts > POLL_OPTIONS.MAX_MAX_ATTEMPTS)
    ) {
        throw invalid(logs.errorLogs.INVALID_MAX_ATTEMPTS_IN_POLL_OPTIONS, SKYFLOW_ERROR_CODE.INVALID_MAX_ATTEMPTS_IN_POLL_OPTIONS, logLevel);
    }
}

function validateRedactionLevel(redactionLevel: unknown, logLevel: LogLevel): void {
    if (redactionLevel !== undefined && redactionLevel !== null && !Array.isArray(redactionLevel)) {
        throw invalid(logs.errorLogs.INVALID_REDACTION_LEVEL, SKYFLOW_ERROR_CODE.INVALID_REDACTION_LEVEL, logLevel);
    }
}

/** @internal */
export function validateReidentifyStringRequest(request: ReidentifyStringRequest, logLevel: LogLevel = LogLevel.ERROR): void {
    if (!request) {
        throw invalid(logs.errorLogs.REIDENTIFY_STRING_REQUEST_NULL, SKYFLOW_ERROR_CODE.INVALID_REIDENTIFY_STRING_REQUEST, logLevel);
    }
    if (isBlank(request.text)) {
        throw invalid(logs.errorLogs.INVALID_TEXT_IN_REIDENTIFY_STRING, SKYFLOW_ERROR_CODE.INVALID_TEXT_IN_REIDENTIFY_STRING, logLevel);
    }
    // redactionLevel entries are optional on the API and are passed through as given.
    validateRedactionLevel(request.redactionLevel, logLevel);
}

/** @internal */
export function validateReidentifyFileRequest(request: ReidentifyFileRequest, logLevel: LogLevel = LogLevel.ERROR): void {
    if (!request) {
        throw invalid(logs.errorLogs.REIDENTIFY_FILE_REQUEST_NULL, SKYFLOW_ERROR_CODE.INVALID_REIDENTIFY_FILE_REQUEST, logLevel);
    }
    if (!request.dataSource) {
        throw invalid(logs.errorLogs.INVALID_DATA_SOURCE_IN_REIDENTIFY_FILE, SKYFLOW_ERROR_CODE.INVALID_DATA_SOURCE_IN_REIDENTIFY_FILE, logLevel);
    }
    if (isBlank(request.value)) {
        throw invalid(logs.errorLogs.INVALID_VALUE_IN_REIDENTIFY_FILE, SKYFLOW_ERROR_CODE.INVALID_VALUE_IN_REIDENTIFY_FILE, logLevel);
    }
    validateRedactionLevel(request.redactionLevel, logLevel);
}

/** @internal */
export function validateGetRunRequest(request: GetRunRequest, logLevel: LogLevel = LogLevel.ERROR): void {
    if (!request) {
        throw invalid(logs.errorLogs.GET_RUN_REQUEST_NULL, SKYFLOW_ERROR_CODE.INVALID_GET_RUN_REQUEST, logLevel);
    }
    if (isBlank(request.runId)) {
        throw invalid(logs.errorLogs.INVALID_RUN_ID_IN_GET_RUN, SKYFLOW_ERROR_CODE.INVALID_RUN_ID_IN_GET_RUN, logLevel);
    }
}

/** @internal */
export function validateCheckGuardrailsRequest(request: CheckGuardrailsRequest, logLevel: LogLevel = LogLevel.ERROR): void {
    if (!request) {
        throw invalid(logs.errorLogs.CHECK_GUARDRAILS_REQUEST_NULL, SKYFLOW_ERROR_CODE.INVALID_CHECK_GUARDRAILS_REQUEST, logLevel);
    }
    if (isBlank(request.text)) {
        throw invalid(logs.errorLogs.INVALID_TEXT_IN_CHECK_GUARDRAILS, SKYFLOW_ERROR_CODE.INVALID_TEXT_IN_CHECK_GUARDRAILS, logLevel);
    }
    const topics = request.denyTopics;
    if (topics !== undefined && topics !== null && (!Array.isArray(topics) || topics.some((t) => typeof t !== "string"))) {
        throw invalid(logs.errorLogs.INVALID_DENY_TOPICS_IN_CHECK_GUARDRAILS, SKYFLOW_ERROR_CODE.INVALID_DENY_TOPICS_IN_CHECK_GUARDRAILS, logLevel);
    }
    // checkToxicity is optional on the API and is passed through as given.
}
