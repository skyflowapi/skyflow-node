// =============================================================================
// Skyflow Detect V2 public types shared by the skyvault and flowvault SDKs.
// Mirrors the Java SDK's `com.skyflow.detect` package: the enums carry the exact
// wire values, and the configuration objects are plain interfaces so an inline
// configuration can be written as an object literal.
// =============================================================================
import { RedactionType } from "../utils";

// --- Enums -------------------------------------------------------------------

/** Entity types Skyflow Detect can identify. `ALL` matches every type. */
export enum EntityType {
    NONE = "NONE",
    ACCOUNT_NUMBER = "ACCOUNT_NUMBER",
    AGE = "AGE",
    ALL = "ALL",
    BANK_ACCOUNT = "BANK_ACCOUNT",
    BLOOD_TYPE = "BLOOD_TYPE",
    CONDITION = "CONDITION",
    CORPORATE_ACTION = "CORPORATE_ACTION",
    CREDIT_CARD = "CREDIT_CARD",
    CREDIT_CARD_EXPIRATION = "CREDIT_CARD_EXPIRATION",
    CVV = "CVV",
    DATE = "DATE",
    DATE_INTERVAL = "DATE_INTERVAL",
    DAY = "DAY",
    DOB = "DOB",
    DOSE = "DOSE",
    DRIVER_LICENSE = "DRIVER_LICENSE",
    DRUG = "DRUG",
    DURATION = "DURATION",
    EFFECT = "EFFECT",
    EMAIL_ADDRESS = "EMAIL_ADDRESS",
    EVENT = "EVENT",
    FILENAME = "FILENAME",
    FINANCIAL_METRIC = "FINANCIAL_METRIC",
    GENDER = "GENDER",
    HEALTHCARE_NUMBER = "HEALTHCARE_NUMBER",
    INJURY = "INJURY",
    IP_ADDRESS = "IP_ADDRESS",
    LANGUAGE = "LANGUAGE",
    LOCATION = "LOCATION",
    LOCATION_ADDRESS = "LOCATION_ADDRESS",
    LOCATION_ADDRESS_STREET = "LOCATION_ADDRESS_STREET",
    LOCATION_CITY = "LOCATION_CITY",
    LOCATION_COORDINATE = "LOCATION_COORDINATE",
    LOCATION_COUNTRY = "LOCATION_COUNTRY",
    LOCATION_STATE = "LOCATION_STATE",
    LOCATION_ZIP = "LOCATION_ZIP",
    MARITAL_STATUS = "MARITAL_STATUS",
    MEDICAL_CODE = "MEDICAL_CODE",
    MEDICAL_PROCESS = "MEDICAL_PROCESS",
    MONEY = "MONEY",
    MONTH = "MONTH",
    NAME = "NAME",
    NAME_FAMILY = "NAME_FAMILY",
    NAME_GIVEN = "NAME_GIVEN",
    NAME_MEDICAL_PROFESSIONAL = "NAME_MEDICAL_PROFESSIONAL",
    NUMERICAL_PII = "NUMERICAL_PII",
    OCCUPATION = "OCCUPATION",
    ORGANIZATION = "ORGANIZATION",
    ORGANIZATION_ID = "ORGANIZATION_ID",
    ORGANIZATION_MEDICAL_FACILITY = "ORGANIZATION_MEDICAL_FACILITY",
    ORIGIN = "ORIGIN",
    PASSPORT_NUMBER = "PASSPORT_NUMBER",
    PASSWORD = "PASSWORD",
    PHONE_NUMBER = "PHONE_NUMBER",
    PHYSICAL_ATTRIBUTE = "PHYSICAL_ATTRIBUTE",
    POLITICAL_AFFILIATION = "POLITICAL_AFFILIATION",
    PRODUCT = "PRODUCT",
    PROJECT = "PROJECT",
    RELIGION = "RELIGION",
    ROUTING_NUMBER = "ROUTING_NUMBER",
    SEXUALITY = "SEXUALITY",
    SSN = "SSN",
    STATISTICS = "STATISTICS",
    TIME = "TIME",
    TREND = "TREND",
    URL = "URL",
    USERNAME = "USERNAME",
    VEHICLE_ID = "VEHICLE_ID",
    YEAR = "YEAR",
    ZODIAC_SIGN = "ZODIAC_SIGN",
}

/** How a detected entity's value is replaced. */
export enum DeidentificationType {
    UNKNOWN = "UNKNOWN",
    ENTITY_UNIQUE_COUNTER = "ENTITY_UNIQUE_COUNTER",
    ENTITY_ONLY = "ENTITY_ONLY",
    VAULT_TOKEN = "VAULT_TOKEN",
    MASK = "MASK",
}

/**
 * Contract for the source of a `deidentifyFile` input and the delivery of a run's outputs.
 * Each SDK exposes its own `DeidentifySourceType` enum with the values its vault supports
 * (`BASE64` and `PRESIGNED_URL` on flowvault, plus `SKYFLOW_ID` on skyvault); a request takes
 * that enum and a response's `outputType` is resolved to it, so an output type the SDK does
 * not know comes back as `null`.
 */
export type DeidentifyFileSource = string;

/**
 * Contract for the source of a `reidentifyFile` input and the delivery of its outputs. Each
 * SDK exposes its own `ReidentifySourceType` enum (`BASE64` and `PRESIGNED_URL` on both
 * vaults); a response's `outputType` is resolved to it, so an unknown value comes back as `null`.
 */
export type ReidentifyFileSource = string;

/** The wire value every SDK uses for a base64 input or output. @internal */
export const BASE64_SOURCE = "BASE64";

/** File formats Skyflow Detect accepts and produces. */
export enum FileDataFormat {
    BMP = "BMP",
    CSV = "CSV",
    DCM = "DCM",
    DOC = "DOC",
    DOCX = "DOCX",
    GIF = "GIF",
    JPEG = "JPEG",
    JPG = "JPG",
    JSON = "JSON",
    JSONL = "JSONL",
    MP3 = "MP3",
    PDF = "PDF",
    PNG = "PNG",
    PPT = "PPT",
    PPTX = "PPTX",
    TIF = "TIF",
    TIFF = "TIFF",
    TXT = "TXT",
    WAV = "WAV",
    XLS = "XLS",
    XLSX = "XLSX",
    XML = "XML",
    ZIP = "ZIP",
}

/** Status of a Detect file run. `SUCCESS`, `FAILED` and `UNKNOWN` are terminal. */
export enum DetectRunStatus {
    UNKNOWN = "UNKNOWN",
    QUEUED = "QUEUED",
    IN_PROGRESS = "IN_PROGRESS",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
}

/** Whether raw entity values are returned on a de-identify response. */
export enum ReturnEntitiesType {
    EXCLUDE_SENSITIVE_DATA = "EXCLUDE_SENSITIVE_DATA",
    ALL = "ALL",
    NONE = "NONE",
}

/** How detected regions of an image are masked. */
export enum MaskingMethod {
    NONE = "NONE",
    BLUR = "BLUR",
    BLACKBOX = "BLACKBOX",
}

/** Transcription produced for an audio file. */
export enum OutputTranscriptionType {
    NONE = "NONE",
    TRANSCRIPTION = "TRANSCRIPTION",
    MEDICAL_TRANSCRIPTION = "MEDICAL_TRANSCRIPTION",
    DIARIZED_TRANSCRIPTION = "DIARIZED_TRANSCRIPTION",
    MEDICAL_DIARIZED_TRANSCRIPTION = "MEDICAL_DIARIZED_TRANSCRIPTION",
}

/** How a PDF is read before detection. */
export enum PdfProcessingMode {
    NONE = "NONE",
    OCR = "OCR",
    TEXT_LAYER = "TEXT_LAYER",
}

/** Visual objects Skyflow Detect can find in images. */
export enum ObjectEntityType {
    NONE = "NONE",
    FACE = "FACE",
    LICENSE_PLATE = "LICENSE_PLATE",
    LOGO = "LOGO",
    SIGNATURE = "SIGNATURE",
    ALL = "ALL",
}

/** How a detected visual object is handled. */
export enum ObjectDeidentificationType {
    UNKNOWN = "UNKNOWN",
    REDACT = "REDACT",
    UNREDACT = "UNREDACT",
}

/** Overall outcome of a `checkGuardrails` call. */
export enum GuardrailsValidation {
    PASSED = "PASSED",
    FAILED = "FAILED",
    UNKNOWN = "UNKNOWN",
}

// --- Inline Detect configuration --------------------------------------------

/** Shift detected dates by a random number of days within the range. */
export interface ShiftDates {
    minDays?: number;
    maxDays?: number;
}

/** Transformations applied to a detected entity before it is replaced. */
export interface Transformation {
    shiftDates?: ShiftDates;
}

/** One entity type to detect and how to de-identify it. */
export interface Entity {
    /** Defaults to `ALL` on the server. */
    entityType?: EntityType;
    /** Defaults to `ENTITY_UNIQUE_COUNTER` on the server. */
    deidentificationType?: DeidentificationType;
    /**
     * Used only with `VAULT_TOKEN`: where the value is stored. A `table.column`
     * on skyvault vaults, a token group name on flowvault vaults. Must exist.
     */
    destination?: string;
    transformation?: Transformation;
}

/** A regex-defined entity type. `label` is reported as the entity type of its matches. */
export interface CustomType {
    label?: string;
    match?: string[];
}

/** A visual object type to detect in images and how to handle it. */
export interface ObjectEntity {
    entityType?: ObjectEntityType;
    deidentificationType?: ObjectDeidentificationType;
}

/** What to detect and how to de-identify it. Applies to string and file inputs. */
export interface Detect {
    entities?: Entity[];
    /** File inputs only. */
    objectEntities?: ObjectEntity[];
    /** Regexes whose matches are always treated as sensitive. */
    restrict?: string[];
    /** Regexes whose matches are never treated as sensitive. */
    skip?: string[];
    customTypes?: CustomType[];
    /** Defaults to `EXCLUDE_SENSITIVE_DATA` on the server. */
    returnEntities?: ReturnEntitiesType;
}

/** Per-column handling for structured files. File inputs only. */
export interface FileMapping {
    source?: string;
    destination?: string;
    outputFileNameSuffix?: string;
    entitiesDestination?: string;
    objectEntitiesDestination?: string;
}

/** The tone laid over detected speech. Paddings are in seconds, frequency in Hz. */
export interface Bleep {
    startPadding?: number;
    stopPadding?: number;
    frequency?: number;
    gain?: number;
}

/** Audio options for file inputs. */
export interface Audio {
    outputProcessedAudio?: boolean;
    outputTranscription?: OutputTranscriptionType;
    bleep?: Bleep;
}

/** PDF options for file inputs. `density` is the rendering DPI. */
export interface Pdf {
    processingMode?: PdfProcessingMode;
    density?: number;
    maxResolution?: number;
}

/** Document options for file inputs. */
export interface Document {
    pdf?: Pdf;
}

/** Image options for file inputs. */
export interface Image {
    outputProcessedImage?: boolean;
    outputOcrText?: boolean;
    maskingMethod?: MaskingMethod;
}

/** Media-type options. File inputs only. */
export interface Media {
    audio?: Audio;
    document?: Document;
    image?: Image;
}

/**
 * The inline form of a stored Detect configuration. `detect` applies to string
 * and file inputs; `fileMapping` and `media` apply to file inputs only. The SDK
 * fills in the vault id from the controller.
 */
export interface DetectConfiguration {
    name?: string;
    description?: string;
    detect?: Detect;
    fileMapping?: FileMapping[];
    media?: Media;
}

// --- Re-identification -------------------------------------------------------

/**
 * Contract for one redaction rule of `reidentifyString` and `reidentifyFile`. Each SDK
 * exposes its own `RedactionLevel` with the pair its vault understands: `entityName` plus
 * `redactionType` on skyvault, `tokenGroupName` plus `redactionPattern` on flowvault. Use
 * that type; the fields here are the union the API accepts, and the server rejects
 * combinations its vault does not support.
 */
export interface RedactionRule {
    /** Skyvault vaults: entity type the rule applies to. */
    entityName?: EntityType;
    /** Skyvault vaults: how the value is rendered. */
    redactionType?: RedactionType;
    /** Flowvault vaults: token group the rule applies to. */
    tokenGroupName?: string;
    /** Flowvault vaults: name of a redaction pattern configured in the vault. */
    redactionPattern?: string;
}

// --- Polling -----------------------------------------------------------------

/**
 * Opts `deidentifyFile` into submit-and-poll mode. The SDK polls with
 * exponential backoff (1, 2, 4, 8, 16, then 32 seconds between lookups).
 */
export interface PollOptions {
    /** Maximum total seconds to keep polling, 1 to 300. Default 60. */
    waitTime?: number;
    /** Maximum number of run lookups, 1 to 23. Default 23. */
    maxAttempts?: number;
}

/** Limits and defaults for {@link PollOptions}. */
export const POLL_OPTIONS = {
    DEFAULT_WAIT_TIME_SECONDS: 60,
    MAX_WAIT_TIME_SECONDS: 300,
    DEFAULT_MAX_ATTEMPTS: 23,
    MAX_MAX_ATTEMPTS: 23,
    /** Longest single pause between two lookups, in seconds. */
    MAX_DELAY_SECONDS: 32,
} as const;

// --- Response components -----------------------------------------------------

/** Offsets of a detected entity in the original and processed text. */
export interface EntityLocation {
    startIndex: number | null;
    endIndex: number | null;
    startIndexProcessed: number | null;
    endIndexProcessed: number | null;
}

/** One entity found by `deidentifyString`. */
export interface DetectedEntity {
    /** The token that replaced the value, for example `NAME_1`. */
    token: string | null;
    /** The original value; empty unless `returnEntities` is `ALL`. */
    value: string | null;
    location: EntityLocation | null;
    /** Entity type label, including custom type labels. */
    entityType: string | null;
    /** Confidence scores per entity type. */
    entityScores: Record<string, number>;
}

/** Size and count metrics reported for a request. */
export interface Metrics {
    /** Size in kilobytes. */
    size: number | null;
    wordCount: number | null;
    characterCount: number | null;
    /** Presentations only. */
    slides: number | null;
    /** Documents only. */
    pages: number | null;
    /** Audio only, in seconds. */
    duration: number | null;
}

/** One output of a file run. */
export interface FileOutput {
    /** Base64 content or a presigned URL, per the response's `outputType`. */
    processedFile: string | null;
    /** `REDACTED_FILE`, `ENTITIES`, `OBJECT_ENTITIES`, `REDACTED_TEXT`, and so on. */
    processedFileType: string | null;
    processedFileExtension: FileDataFormat | null;
}
