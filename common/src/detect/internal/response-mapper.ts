// Converts generated V2 API responses into public SDK response models. Internal to the SDK.
import {
    DeidentifyStringResponseV2,
    DeidentifyStringResponseV2DetectedEntity,
    DeidentifyStringResponseV2EntityLocation,
    DetectGuardrailsResponseV2,
    DetectRunsResponseV2,
    FileOutput as FileOutputV2,
    Metrics as MetricsV2,
    ReidentifyFileResponseV2,
    ReidentifyStringResponseV2,
} from "../../_generated_/rest/api";
import {
    DeidentifyFileSource,
    DetectRunStatus,
    DeidentifyFileDataFormat,
    DetectedEntity,
    EntityLocation,
    FileOutput,
    GuardrailsValidation,
    Metrics,
    ReidentifyFileDataFormat,
    ReidentifyFileOutput,
    ReidentifyFileSource,
} from "../types";
import DeidentifyStringResponse from "../model/response/deidentify-string";
import ReidentifyStringResponse from "../model/response/reidentify-string";
import DeidentifyFileResponse from "../model/response/deidentify-file";
import ReidentifyFileResponse from "../model/response/reidentify-file";
import GetRunResponse from "../model/response/get-run";
import CheckGuardrailsResponse from "../model/response/check-guardrails";

function orNull<T>(value: T | undefined | null): T | null {
    return value === undefined || value === null ? null : value;
}

/**
 * Resolves a wire output type onto the SDK's own source enum; `null` for a value the SDK does not
 * know. Each SDK's DetectController supplies one per source enum. @internal
 */
export type SourceResolver<S extends string> = (value: string | null | undefined) => S | null;

/** Maps a wire value onto a public enum, tolerating values this SDK version does not know. @internal */
export function enumOrDefault<E extends string>(
    values: Record<string, E>,
    value: unknown,
    fallback: E | null,
): E | null {
    if (value === undefined || value === null) {
        return fallback;
    }
    const match = Object.values(values).find((v) => v === String(value));
    return match === undefined ? fallback : match;
}

/** @internal */
export function toMetrics(metrics: MetricsV2 | undefined | null): Metrics | null {
    if (!metrics) {
        return null;
    }
    return {
        size: orNull(metrics.size),
        wordCount: orNull(metrics.wordCount),
        characterCount: orNull(metrics.characterCount),
        slides: orNull(metrics.slides),
        pages: orNull(metrics.pages),
        duration: orNull(metrics.duration),
    };
}

function toEntityLocation(location: DeidentifyStringResponseV2EntityLocation | undefined | null): EntityLocation | null {
    if (!location) {
        return null;
    }
    return {
        startIndex: orNull(location.startIndex),
        endIndex: orNull(location.endIndex),
        startIndexProcessed: orNull(location.startIndexProcessed),
        endIndexProcessed: orNull(location.endIndexProcessed),
    };
}

function toDetectedEntity(entity: DeidentifyStringResponseV2DetectedEntity): DetectedEntity {
    return {
        token: orNull(entity.token),
        value: orNull(entity.value),
        location: toEntityLocation(entity.location),
        entityType: orNull(entity.entityType),
        entityScores: entity.entityScores ? { ...entity.entityScores } : {},
    };
}

/** @internal */
export function toDeidentifyStringResponse(response: DeidentifyStringResponseV2): DeidentifyStringResponse {
    const entities = (response.entities ?? []).filter((e) => e != null).map(toDetectedEntity);
    return new DeidentifyStringResponse({
        processedText: orNull(response.processedText),
        entities,
        metrics: toMetrics(response.metrics),
    });
}

/** @internal */
export function toReidentifyStringResponse(response: ReidentifyStringResponseV2): ReidentifyStringResponse {
    return new ReidentifyStringResponse({
        processedText: orNull(response.processedText),
        metrics: toMetrics(response.metrics),
    });
}

/** @internal */
export function toFileOutput(output: FileOutputV2): FileOutput {
    return {
        processedFile: orNull(output.processedFile),
        processedFileType: output.processedFileType === undefined || output.processedFileType === null ? null : String(output.processedFileType),
        processedFileExtension: enumOrDefault(
            DeidentifyFileDataFormat,
            output.processedFileExtension === undefined || output.processedFileExtension === null
                ? undefined
                : String(output.processedFileExtension).toUpperCase(),
            null,
        ),
    };
}

function toFileOutputs(outputs: FileOutputV2[] | undefined | null): FileOutput[] {
    return (outputs ?? []).filter((o) => o != null).map(toFileOutput);
}

/** The re-identify counterpart of `toFileOutput`: the extension is a `ReidentifyFileDataFormat`. @internal */
export function toReidentifyFileOutput(output: FileOutputV2): ReidentifyFileOutput {
    return {
        processedFile: orNull(output.processedFile),
        processedFileType: output.processedFileType === undefined || output.processedFileType === null ? null : String(output.processedFileType),
        processedFileExtension: enumOrDefault(
            ReidentifyFileDataFormat,
            output.processedFileExtension === undefined || output.processedFileExtension === null
                ? undefined
                : String(output.processedFileExtension).toUpperCase(),
            null,
        ),
    };
}

function toReidentifyFileOutputs(outputs: FileOutputV2[] | undefined | null): ReidentifyFileOutput[] {
    return (outputs ?? []).filter((o) => o != null).map(toReidentifyFileOutput);
}

/** @internal */
export function toGetRunResponse(
    runId: string,
    response: DetectRunsResponseV2,
    resolveSource: SourceResolver<DeidentifyFileSource>,
): GetRunResponse {
    return new GetRunResponse({
        runId,
        status: enumOrDefault(DetectRunStatus, response.status, DetectRunStatus.UNKNOWN) as DetectRunStatus,
        outputType: resolveSource(response.outputType === undefined || response.outputType === null ? null : String(response.outputType)),
        output: toFileOutputs(response.output),
        metrics: toMetrics(response.metrics),
        message: orNull(response.message),
    });
}

/** Response for a submit-only call: run id and nothing else. @internal */
export function submittedDeidentifyFileResponse(runId: string | null): DeidentifyFileResponse {
    return new DeidentifyFileResponse({ runId, status: null, outputType: null, output: [], metrics: null, message: null });
}

/** Merges the submit's run id with the polled run. @internal */
export function toDeidentifyFileResponse(runId: string, run: GetRunResponse): DeidentifyFileResponse {
    return new DeidentifyFileResponse({
        runId,
        status: run.status,
        outputType: run.outputType,
        output: run.output,
        metrics: run.metrics,
        message: run.message,
    });
}

/** @internal */
export function toReidentifyFileResponse(
    response: ReidentifyFileResponseV2,
    resolveSource: SourceResolver<ReidentifyFileSource>,
): ReidentifyFileResponse {
    return new ReidentifyFileResponse({
        status: enumOrDefault(DetectRunStatus, response.status, DetectRunStatus.UNKNOWN) as DetectRunStatus,
        outputType: resolveSource(response.outputType === undefined || response.outputType === null ? null : String(response.outputType)),
        output: toReidentifyFileOutputs(response.output),
        metrics: toMetrics(response.metrics),
    });
}

/** @internal */
export function toCheckGuardrailsResponse(response: DetectGuardrailsResponseV2): CheckGuardrailsResponse {
    return new CheckGuardrailsResponse({
        text: orNull(response.text),
        validation: enumOrDefault(GuardrailsValidation, response.validation, GuardrailsValidation.UNKNOWN) as GuardrailsValidation,
        toxic: orNull(response.toxic),
        deniedTopic: orNull(response.deniedTopic),
    });
}
