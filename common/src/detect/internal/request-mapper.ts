// Converts public SDK request models into generated V2 API requests. Internal to the SDK.
import * as fs from "fs";
import * as path from "path";
import {
    AudioV2,
    DeidentifyFileRequestV2,
    DeidentifyFileRequestV2DataFormat,
    DeidentifyFileRequestV2DataSource,
    DeidentifyStringRequestV2,
    Detect as DetectV2,
    DetectConfigV2,
    DetectCustomTypes,
    DetectCustomTypesIncludePrefix,
    DetectEntity,
    DetectEntityIncludePrefix,
    DetectGuardrailsRequestV2,
    DetectObjectEntity,
    DocumentV2,
    EntityTransformation,
    FileMapping as FileMappingV2,
    ImageV2,
    Media as MediaV2,
    RedactionLevel as RedactionLevelV2,
    ReidentifyFileRequestV2,
    ReidentifyFileRequestV2DataFormat,
    ReidentifyFileRequestV2DataSource,
    ReidentifyStringRequestV2,
} from "../../_generated_/rest/api";
import { ENCODING_TYPE, LogLevel, MessageType, parameterizedString, printLog } from "../../utils";
import logs from "../../utils/logs";
import SkyflowError from "../../error";
import SKYFLOW_ERROR_CODE from "../../error/codes";
import {
    Audio,
    BASE64_SOURCE,
    CustomType,
    Detect,
    DetectConfiguration,
    Document,
    Entity,
    FileDataFormat,
    FileMapping,
    Image,
    IncludePrefix,
    Media,
    ObjectEntity,
    RedactionRule,
    Transformation,
} from "../types";
import DeidentifyStringRequest from "../model/request/deidentify-string";
import DeidentifyFileRequest from "../model/request/deidentify-file";
import ReidentifyStringRequest from "../model/request/reidentify-string";
import ReidentifyFileRequest from "../model/request/reidentify-file";
import CheckGuardrailsRequest from "../model/request/check-guardrails";
import { DETECT_INTERFACE_NAME } from "./validations";

/**
 * The API needs either a configuration id or a configuration, and the vault id travels inside the
 * configuration. An inline configuration is always sent; with neither field set the SDK still sends a
 * configuration holding only the vault id, so the server applies the vault's defaults instead of
 * rejecting the request. When only an id is set nothing else is sent.
 * @internal
 */
export function sendsConfiguration(configurationId?: string, configuration?: DetectConfiguration): boolean {
    return configuration !== undefined || configurationId === undefined;
}

/** @internal */
export function toDeidentifyStringRequest(request: DeidentifyStringRequest, vaultId: string): DeidentifyStringRequestV2 {
    const apiRequest: DeidentifyStringRequestV2 = { text: request.text };
    if (request.configurationId !== undefined) {
        apiRequest.configurationId = request.configurationId;
    }
    if (sendsConfiguration(request.configurationId, request.configuration)) {
        apiRequest.configuration = toDetectConfig(request.configuration, vaultId);
    }
    return apiRequest;
}

/** The name of the local file a request was built from, or null for value-based requests. @internal */
export function localFileName(request: DeidentifyFileRequest): string | null {
    if (request.file) {
        const name = (request.file as { name?: unknown }).name;
        return typeof name === "string" && name.length > 0 ? path.basename(name) : "output";
    }
    if (request.filePath) {
        return path.basename(request.filePath);
    }
    return null;
}

async function encodeLocalFile(request: DeidentifyFileRequest, logLevel: LogLevel): Promise<string> {
    try {
        if (request.file) {
            const bytes = await request.file.arrayBuffer();
            return Buffer.from(bytes).toString(ENCODING_TYPE.BASE64);
        }
        const bytes = await fs.promises.readFile(request.filePath as string);
        return bytes.toString(ENCODING_TYPE.BASE64);
    } catch (_e) {
        printLog(
            parameterizedString(logs.errorLogs.FAILED_TO_ENCODE_FILE_IN_DEIDENTIFY_FILE, DETECT_INTERFACE_NAME),
            MessageType.ERROR,
            logLevel,
        );
        throw new SkyflowError(SKYFLOW_ERROR_CODE.FAILED_TO_ENCODE_FILE);
    }
}

/** The format matching the file extension, or undefined when unknown so the server infers it. @internal */
export function inferFormat(fileName: string | null): FileDataFormat | undefined {
    if (!fileName) {
        return undefined;
    }
    const ext = path.extname(fileName).replace(/^\./, "").toUpperCase();
    return ext && Object.prototype.hasOwnProperty.call(FileDataFormat, ext)
        ? (FileDataFormat as Record<string, FileDataFormat>)[ext]
        : undefined;
}

/**
 * Builds the submit request. For local files this reads and base64-encodes the file and infers the
 * format from its name when none was given.
 * @internal
 */
export async function toDeidentifyFileRequest(
    request: DeidentifyFileRequest,
    vaultId: string,
    logLevel: LogLevel = LogLevel.ERROR,
): Promise<DeidentifyFileRequestV2> {
    const isLocal = !!request.file || !!request.filePath;
    let value = request.value as string;
    let format = request.dataFormat;
    if (isLocal) {
        value = await encodeLocalFile(request, logLevel);
        if (!format) {
            format = inferFormat(localFileName(request));
        }
    }
    // A local file is always sent as BASE64, whatever dataSource the request was left with.
    const dataSource = isLocal ? BASE64_SOURCE : (request.dataSource as string);
    const apiRequest: DeidentifyFileRequestV2 = {
        dataSource: dataSource as DeidentifyFileRequestV2DataSource,
        value,
    };
    if (format) {
        // The wire value for a file format is the lower-case extension.
        apiRequest.dataFormat = format.toLowerCase() as DeidentifyFileRequestV2DataFormat;
    }
    if (request.configurationId !== undefined) {
        apiRequest.configurationId = request.configurationId;
    }
    if (sendsConfiguration(request.configurationId, request.configuration)) {
        apiRequest.configuration = toDetectConfig(request.configuration, vaultId);
    }
    return apiRequest;
}

/** @internal */
export function toReidentifyStringRequest(request: ReidentifyStringRequest, vaultId: string): ReidentifyStringRequestV2 {
    const apiRequest: ReidentifyStringRequestV2 = { vaultId, text: request.text };
    if (request.redactionLevel) {
        apiRequest.redactionLevel = toRedactionLevels(request.redactionLevel);
    }
    return apiRequest;
}

/** @internal */
export function toReidentifyFileRequest(request: ReidentifyFileRequest, vaultId: string): ReidentifyFileRequestV2 {
    const apiRequest: ReidentifyFileRequestV2 = {
        dataSource: request.dataSource as ReidentifyFileRequestV2DataSource,
        value: request.value,
        vaultId,
    };
    if (request.dataFormat) {
        // The wire value for a file format is the lower-case extension.
        apiRequest.dataFormat = request.dataFormat.toLowerCase() as ReidentifyFileRequestV2DataFormat;
    }
    if (request.redactionLevel) {
        apiRequest.redactionLevel = toRedactionLevels(request.redactionLevel);
    }
    return apiRequest;
}

/** @internal */
export function toCheckGuardrailsRequest(request: CheckGuardrailsRequest, vaultId: string): DetectGuardrailsRequestV2 {
    const apiRequest: DetectGuardrailsRequestV2 = { text: request.text, vaultId };
    if (request.checkToxicity !== undefined) {
        apiRequest.checkToxicity = request.checkToxicity;
    }
    if (request.denyTopics !== undefined) {
        apiRequest.denyTopics = request.denyTopics;
    }
    return apiRequest;
}

/**
 * @param configuration the inline configuration, or undefined to send a configuration that carries
 *                      only the vault id
 * @internal
 */
export function toDetectConfig(configuration: DetectConfiguration | undefined, vaultId: string): DetectConfigV2 {
    const config: DetectConfigV2 = { vaultId };
    if (!configuration) {
        return config;
    }
    if (configuration.name !== undefined) {
        config.name = configuration.name;
    }
    if (configuration.description !== undefined) {
        config.description = configuration.description;
    }
    if (configuration.detect) {
        config.detect = toDetect(configuration.detect);
    }
    if (configuration.fileMapping) {
        config.fileMapping = toFileMappings(configuration.fileMapping);
    }
    if (configuration.media) {
        config.media = toMedia(configuration.media);
    }
    return config;
}

function compact<T extends object>(value: T): T {
    // Drop undefined keys so the wire body only carries what the caller set.
    const out = {} as T;
    Object.keys(value).forEach((key) => {
        const v = (value as Record<string, unknown>)[key];
        if (v !== undefined) {
            (out as Record<string, unknown>)[key] = v;
        }
    });
    return out;
}

function toDetect(detect: Detect): DetectV2 {
    return compact<DetectV2>({
        entities: detect.entities?.filter((e) => e != null).map(toEntity),
        objectEntities: detect.objectEntities?.filter((e) => e != null).map(toObjectEntity),
        restrict: detect.restrict,
        skip: detect.skip,
        customTypes: detect.customTypes?.filter((c) => c != null).map(toCustomType),
        returnEntities: detect.returnEntities,
    });
}

/**
 * The REST enum has only YES and NO. INCLUDE_PREFIX_UNSPECIFIED (or an unset field) is omitted from the
 * request so the server applies its default, which is YES.
 */
function toIncludePrefix(includePrefix?: IncludePrefix): DetectEntityIncludePrefix | undefined {
    return includePrefix === undefined || includePrefix === IncludePrefix.INCLUDE_PREFIX_UNSPECIFIED
        ? undefined
        : (includePrefix as string as DetectEntityIncludePrefix);
}

function toEntity(entity: Entity): DetectEntity {
    return compact<DetectEntity>({
        entityType: entity.entityType,
        deidentificationType: entity.deidentificationType,
        destination: entity.destination,
        transformation: entity.transformation ? toTransformation(entity.transformation) : undefined,
        includePrefix: toIncludePrefix(entity.includePrefix),
        prefixOverride: entity.prefixOverride,
    });
}

function toTransformation(transformation: Transformation): EntityTransformation {
    const shiftDates = transformation.shiftDates;
    return compact<EntityTransformation>({
        shiftDates: shiftDates ? compact({ minDays: shiftDates.minDays, maxDays: shiftDates.maxDays }) : undefined,
    });
}

function toCustomType(customType: CustomType): DetectCustomTypes {
    return compact<DetectCustomTypes>({
        label: customType.label,
        match: customType.match,
        deidentificationType: customType.deidentificationType,
        destination: customType.destination,
        includePrefix: toIncludePrefix(customType.includePrefix) as DetectCustomTypesIncludePrefix | undefined,
        prefixOverride: customType.prefixOverride,
    });
}

function toObjectEntity(objectEntity: ObjectEntity): DetectObjectEntity {
    return compact<DetectObjectEntity>({
        entityType: objectEntity.entityType,
        deidentificationType: objectEntity.deidentificationType,
    });
}

function toFileMappings(mappings: FileMapping[]): FileMappingV2[] {
    return mappings
        .filter((m) => m != null)
        .map((m) =>
            compact<FileMappingV2>({
                source: m.source,
                destination: m.destination,
                outputFileNameSuffix: m.outputFileNameSuffix,
                entitiesDestination: m.entitiesDestination,
                objectEntitiesDestination: m.objectEntitiesDestination,
            }),
        );
}

function toMedia(media: Media): MediaV2 {
    return compact<MediaV2>({
        audio: media.audio ? toAudio(media.audio) : undefined,
        document: media.document ? toDocument(media.document) : undefined,
        image: media.image ? toImage(media.image) : undefined,
    });
}

function toAudio(audio: Audio): AudioV2 {
    const bleep = audio.bleep;
    return compact<AudioV2>({
        outputProcessedAudio: audio.outputProcessedAudio,
        outputTranscription: audio.outputTranscription,
        bleep: bleep
            ? compact({
                  startPadding: bleep.startPadding,
                  stopPadding: bleep.stopPadding,
                  frequency: bleep.frequency,
                  gain: bleep.gain,
              })
            : undefined,
    });
}

function toDocument(document: Document): DocumentV2 {
    const pdf = document.pdf;
    return compact<DocumentV2>({
        pdf: pdf
            ? compact({ processingMode: pdf.processingMode, density: pdf.density, maxResolution: pdf.maxResolution })
            : undefined,
    });
}

function toImage(image: Image): ImageV2 {
    return compact<ImageV2>({
        outputProcessedImage: image.outputProcessedImage,
        outputOcrText: image.outputOcrText,
        maskingMethod: image.maskingMethod,
    });
}

/** @internal */
export function toRedactionLevels(levels: RedactionRule[]): RedactionLevelV2[] {
    return levels
        .filter((l) => l != null)
        .map((l) =>
            compact<RedactionLevelV2>({
                entityName: l.entityName,
                redactionType: l.redactionType,
                tokenGroupName: l.tokenGroupName,
                redactionPattern: l.redactionPattern,
            }),
        );
}
