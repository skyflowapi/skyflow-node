// =============================================================================
// BaseDetectController — the shared implementation of the Skyflow Detect V2 API,
// analogous to Java's `common` BaseDetectController. Each SDK's DetectController
// extends it and supplies only its own VaultClient, which already knows the
// vault URL, the vault id, the log level, how to resolve a bearer token, and any
// per-vault timeout / retry overrides.
// =============================================================================
import { StringsV2 } from "../../_generated_/rest/api/resources/stringsV2/client/Client";
import { FilesV2 } from "../../_generated_/rest/api/resources/filesV2/client/Client";
import { GuardrailsV2 } from "../../_generated_/rest/api/resources/guardrailsV2/client/Client";
import { GetRunV2Request } from "../../_generated_/rest/api";
import { LogLevel, MessageType, SDK, generateSDKMetrics, parameterizedString, printLog } from "../../utils";
import logs from "../../utils/logs";
import DeidentifyStringRequest from "../model/request/deidentify-string";
import DeidentifyFileRequest from "../model/request/deidentify-file";
import ReidentifyStringRequest from "../model/request/reidentify-string";
import ReidentifyFileRequest from "../model/request/reidentify-file";
import GetRunRequest from "../model/request/get-run";
import CheckGuardrailsRequest from "../model/request/check-guardrails";
import DeidentifyStringResponse from "../model/response/deidentify-string";
import DeidentifyFileResponse from "../model/response/deidentify-file";
import ReidentifyStringResponse from "../model/response/reidentify-string";
import ReidentifyFileResponse from "../model/response/reidentify-file";
import GetRunResponse from "../model/response/get-run";
import CheckGuardrailsResponse from "../model/response/check-guardrails";
import {
    validateCheckGuardrailsRequest,
    validateDeidentifyFileRequest,
    validateDeidentifyStringRequest,
    validateGetRunRequest,
    validateReidentifyFileRequest,
    validateReidentifyStringRequest,
} from "../internal/validations";
import {
    toCheckGuardrailsRequest,
    toDeidentifyFileRequest,
    toDeidentifyStringRequest,
    toReidentifyFileRequest,
    toReidentifyStringRequest,
} from "../internal/request-mapper";
import {
    enumOrDefault,
    toCheckGuardrailsResponse,
    toDeidentifyStringResponse,
    toGetRunResponse,
    toReidentifyFileResponse,
    toReidentifyStringResponse,
} from "../internal/response-mapper";
import { DeidentifyFileSource, ReidentifyFileSource } from "../types";
import { completeDeidentifyFile } from "../internal/deidentify-file-flow";
import { toSkyflowError } from "../internal/errors";

/** The slice of a layer's VaultClient the shared Detect controller depends on. */
export interface DetectClientLike {
    /** The vault every request is scoped to. */
    readonly vaultId: string;
    /** The vault base URL requests are sent to, for example `https://<cluster>.vault.skyflowapis.com`. */
    readonly url: string;
    getLogLevel(): LogLevel;
    /** Resolves the bearer token or API key for the next call, refreshing it when expired. */
    resolveAuthToken(): Promise<string>;
    /** Overall per-call timeout in seconds; undefined for the transport default. */
    readonly timeout?: number;
    /** Retries on retryable HTTP statuses; undefined for the transport default. */
    readonly maxRetries?: number;
}

/** Per-call options accepted by every generated Detect V2 resource client. */
type DetectRequestOptions = StringsV2.RequestOptions;

export abstract class BaseDetectController<TClient extends DetectClientLike = DetectClientLike> {
    protected readonly client: TClient;

    private currentToken = "";

    private stringsApi?: StringsV2;

    private filesApi?: FilesV2;

    private guardrailsApi?: GuardrailsV2;

    constructor(client: TClient) {
        this.client = client;
        printLog(
            parameterizedString(logs.infoLogs.DETECT_CONTROLLER_INITIALIZED, client.vaultId),
            MessageType.LOG,
            client.getLogLevel(),
        );
    }

    protected get logLevel(): LogLevel {
        return this.client.getLogLevel();
    }

    // ------------------------------------------------------------------
    // Vault-specific types
    // ------------------------------------------------------------------

    /**
     * Resolves the `outputType` of a de-identification run onto this SDK's `DeidentifySourceType`.
     * Returns `null` for a wire value that enum does not contain, so a vault never surfaces a source
     * the SDK does not offer.
     */
    protected abstract toDeidentifySource(value: string | null | undefined): DeidentifyFileSource | null;

    /** Resolves the `outputType` of a re-identification onto this SDK's `ReidentifySourceType`; `null` when unknown. */
    protected abstract toReidentifySource(value: string | null | undefined): ReidentifyFileSource | null;

    /** Maps a wire value onto one of `values`' members, or `null` when it is not one of them. */
    protected static enumOrNull<E extends string>(values: Record<string, E>, value: string | null | undefined): E | null {
        return enumOrDefault(values, value, null);
    }

    // ------------------------------------------------------------------
    // Detect V2 operations
    // ------------------------------------------------------------------

    /**
     * Detects and de-identifies sensitive data in a string. Synchronous.
     *
     * @param request text plus, optionally, a stored configuration id or an inline configuration
     * @returns processed text, detected entities and metrics
     * @throws SkyflowError on validation failure, credential failure or an API error
     */
    async deidentifyString(request: DeidentifyStringRequest): Promise<DeidentifyStringResponse> {
        printLog(logs.infoLogs.DEIDENTIFY_STRING_TRIGGERED, MessageType.LOG, this.logLevel);
        printLog(logs.infoLogs.VALIDATE_DEIDENTIFY_STRING_REQUEST, MessageType.LOG, this.logLevel);
        validateDeidentifyStringRequest(request, this.logLevel);
        const options = await this.prepareCall();
        const apiRequest = toDeidentifyStringRequest(request, this.client.vaultId);
        try {
            const apiResponse = await this.strings().deidentifyStringV2(apiRequest, options);
            printLog(logs.infoLogs.DEIDENTIFY_STRING_REQUEST_RESOLVED, MessageType.LOG, this.logLevel);
            const response = toDeidentifyStringResponse(apiResponse);
            printLog(logs.infoLogs.DEIDENTIFY_STRING_SUCCESS, MessageType.LOG, this.logLevel);
            return response;
        } catch (err) {
            throw toSkyflowError(err, logs.errorLogs.DEIDENTIFY_STRING_REQUEST_REJECTED, this.logLevel);
        }
    }

    /**
     * Replaces tokens in a string with their original values or a redacted rendering. Synchronous.
     *
     * @param request text containing tokens plus optional per-group redaction rules
     * @returns re-identified text and metrics
     * @throws SkyflowError on validation failure, credential failure or an API error
     */
    async reidentifyString(request: ReidentifyStringRequest): Promise<ReidentifyStringResponse> {
        printLog(logs.infoLogs.REIDENTIFY_STRING_TRIGGERED, MessageType.LOG, this.logLevel);
        printLog(logs.infoLogs.VALIDATE_REIDENTIFY_STRING_REQUEST, MessageType.LOG, this.logLevel);
        validateReidentifyStringRequest(request, this.logLevel);
        const options = await this.prepareCall();
        const apiRequest = toReidentifyStringRequest(request, this.client.vaultId);
        try {
            const apiResponse = await this.strings().reidentifyStringV2(apiRequest, options);
            printLog(logs.infoLogs.REIDENTIFY_STRING_REQUEST_RESOLVED, MessageType.LOG, this.logLevel);
            const response = toReidentifyStringResponse(apiResponse);
            printLog(logs.infoLogs.REIDENTIFY_STRING_SUCCESS, MessageType.LOG, this.logLevel);
            return response;
        } catch (err) {
            throw toSkyflowError(err, logs.errorLogs.REIDENTIFY_STRING_REQUEST_REJECTED, this.logLevel);
        }
    }

    /**
     * Detects and de-identifies sensitive data in a file. The API is asynchronous: by default this
     * submits the run and returns its id for use with {@link getRun}. With `pollOptions` the SDK
     * polls the run with exponential backoff and returns the completed run, or the run id with a
     * non-terminal status if the budget runs out. On success, a request built from a local file
     * (`file` or `filePath`) has its outputs written to disk.
     *
     * @param request the file (base64, skyflow id, presigned URL, or a local file) plus a stored or inline configuration
     * @returns run id, and the run's status, outputs and metrics when polled
     * @throws SkyflowError on validation failure, credential failure, an API error or an output write failure
     */
    async deidentifyFile(request: DeidentifyFileRequest): Promise<DeidentifyFileResponse> {
        printLog(logs.infoLogs.DEIDENTIFY_FILE_TRIGGERED, MessageType.LOG, this.logLevel);
        printLog(logs.infoLogs.VALIDATE_DEIDENTIFY_FILE_REQUEST, MessageType.LOG, this.logLevel);
        validateDeidentifyFileRequest(request, this.logLevel);
        const options = await this.prepareCall();
        const apiRequest = await toDeidentifyFileRequest(request, this.client.vaultId, this.logLevel);
        let runId: string | null;
        try {
            const apiResponse = await this.files().deidentifyFileV2(apiRequest, options);
            printLog(logs.infoLogs.DEIDENTIFY_FILE_REQUEST_RESOLVED, MessageType.LOG, this.logLevel);
            runId = apiResponse.runId ?? null;
        } catch (err) {
            throw toSkyflowError(err, logs.errorLogs.DEIDENTIFY_FILE_REQUEST_REJECTED, this.logLevel);
        }
        const response = await completeDeidentifyFile(
            request,
            runId,
            (id) => this.getRun(new GetRunRequest(id)),
            this.logLevel,
            this.sleeper(),
        );
        printLog(logs.infoLogs.DEIDENTIFY_FILE_SUCCESS, MessageType.LOG, this.logLevel);
        return response;
    }

    /**
     * Replaces tokens in a file with their original values or a redacted rendering. Synchronous:
     * the re-identified file is returned in the response rather than through a run id.
     *
     * @param request the file (base64 or presigned URL) plus optional per-group redaction rules
     * @returns status, output files and metrics
     * @throws SkyflowError on validation failure, credential failure or an API error
     */
    async reidentifyFile(request: ReidentifyFileRequest): Promise<ReidentifyFileResponse> {
        printLog(logs.infoLogs.REIDENTIFY_FILE_TRIGGERED, MessageType.LOG, this.logLevel);
        printLog(logs.infoLogs.VALIDATE_REIDENTIFY_FILE_REQUEST, MessageType.LOG, this.logLevel);
        validateReidentifyFileRequest(request, this.logLevel);
        const options = await this.prepareCall();
        const apiRequest = toReidentifyFileRequest(request, this.client.vaultId);
        try {
            const apiResponse = await this.files().reidentifyFileV2(apiRequest, options);
            printLog(logs.infoLogs.REIDENTIFY_FILE_REQUEST_RESOLVED, MessageType.LOG, this.logLevel);
            const response = toReidentifyFileResponse(apiResponse, (value) => this.toReidentifySource(value));
            printLog(logs.infoLogs.REIDENTIFY_FILE_SUCCESS, MessageType.LOG, this.logLevel);
            return response;
        } catch (err) {
            throw toSkyflowError(err, logs.errorLogs.REIDENTIFY_FILE_REQUEST_REJECTED, this.logLevel);
        }
    }

    /**
     * Retrieves the status and, once complete, the outputs of a Detect file run.
     *
     * @param request the run id returned by `deidentifyFile`
     * @returns status, output files, metrics and failure message
     * @throws SkyflowError on validation failure, credential failure or an API error
     */
    async getRun(request: GetRunRequest): Promise<GetRunResponse> {
        printLog(logs.infoLogs.GET_RUN_TRIGGERED, MessageType.LOG, this.logLevel);
        printLog(logs.infoLogs.VALIDATE_GET_RUN_REQUEST, MessageType.LOG, this.logLevel);
        validateGetRunRequest(request, this.logLevel);
        const options = await this.prepareCall();
        const runId = request.runId.trim();
        const apiRequest: GetRunV2Request = { vaultId: this.client.vaultId };
        try {
            const apiResponse = await this.files().getRunV2(runId, apiRequest, options);
            printLog(logs.infoLogs.GET_RUN_REQUEST_RESOLVED, MessageType.LOG, this.logLevel);
            const response = toGetRunResponse(runId, apiResponse, (value) => this.toDeidentifySource(value));
            printLog(logs.infoLogs.GET_RUN_SUCCESS, MessageType.LOG, this.logLevel);
            return response;
        } catch (err) {
            throw toSkyflowError(err, logs.errorLogs.GET_RUN_REQUEST_REJECTED, this.logLevel);
        }
    }

    /**
     * Screens text for toxicity and denied topics. Synchronous.
     *
     * @param request text plus the checks to apply
     * @returns the overall validation result and the individual check outcomes
     * @throws SkyflowError on validation failure, credential failure or an API error
     */
    async checkGuardrails(request: CheckGuardrailsRequest): Promise<CheckGuardrailsResponse> {
        printLog(logs.infoLogs.CHECK_GUARDRAILS_TRIGGERED, MessageType.LOG, this.logLevel);
        printLog(logs.infoLogs.VALIDATE_CHECK_GUARDRAILS_REQUEST, MessageType.LOG, this.logLevel);
        validateCheckGuardrailsRequest(request, this.logLevel);
        const options = await this.prepareCall();
        const apiRequest = toCheckGuardrailsRequest(request, this.client.vaultId);
        try {
            const apiResponse = await this.guardrails().checkGuardrailsV2(apiRequest, options);
            printLog(logs.infoLogs.CHECK_GUARDRAILS_REQUEST_RESOLVED, MessageType.LOG, this.logLevel);
            const response = toCheckGuardrailsResponse(apiResponse);
            printLog(logs.infoLogs.CHECK_GUARDRAILS_SUCCESS, MessageType.LOG, this.logLevel);
            return response;
        } catch (err) {
            throw toSkyflowError(err, logs.errorLogs.CHECK_GUARDRAILS_REQUEST_REJECTED, this.logLevel);
        }
    }

    // ------------------------------------------------------------------
    // Transport plumbing
    // ------------------------------------------------------------------

    /** Resolves the token for the next call and builds its per-call options. */
    private async prepareCall(): Promise<DetectRequestOptions> {
        this.currentToken = await this.client.resolveAuthToken();
        const options: DetectRequestOptions = {
            headers: { [SDK.METRICS_HEADER_KEY]: JSON.stringify(generateSDKMetrics(this.logLevel)) },
        };
        if (this.client.timeout !== undefined) {
            options.timeoutInSeconds = this.client.timeout;
        }
        if (this.client.maxRetries !== undefined) {
            options.maxRetries = this.client.maxRetries;
        }
        return options;
    }

    /** Suppliers read the URL and token live, so a config update or token refresh needs no rebuild. */
    private supplierOptions(): StringsV2.Options {
        return {
            baseUrl: () => this.client.url,
            token: () => this.currentToken,
        };
    }

    /** The generated strings client, built on first use. */
    protected strings(): StringsV2 {
        if (!this.stringsApi) {
            this.stringsApi = new StringsV2(this.supplierOptions());
        }
        return this.stringsApi;
    }

    /** The generated files client, built on first use. */
    protected files(): FilesV2 {
        if (!this.filesApi) {
            this.filesApi = new FilesV2(this.supplierOptions());
        }
        return this.filesApi;
    }

    /** The generated guardrails client, built on first use. */
    protected guardrails(): GuardrailsV2 {
        if (!this.guardrailsApi) {
            this.guardrailsApi = new GuardrailsV2(this.supplierOptions());
        }
        return this.guardrailsApi;
    }

    /** The pause used between run lookups while polling; undefined selects the real timer. Test seam. */
    protected sleeper(): ((millis: number) => Promise<void>) | undefined {
        return undefined;
    }
}

export default BaseDetectController;
