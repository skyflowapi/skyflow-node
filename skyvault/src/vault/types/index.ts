import { RedactionType, SkyflowRecordError } from "skyflow-common";
import { ConnectionConfig } from "skyflow-common";
import { VaultConfig } from "skyflow-common";
import VaultController from "../controller/vault";
import ConnectionController from "../controller/connections";
import VaultClient from "../client";
import DetectController from "../controller/detect";
import { SkyflowError } from "skyflow-common";
import { InsertResponseType } from "skyflow-common";

// Re-export the contract-agnostic types that now live in skyflow-common, so the
// public API surface of skyflow-node continues to expose them from here.
export type {
    SkyflowConfig,
    FileInput,
    Filepath,
    FileObject,
    InsertResponseType,
    GetResponseData,
    QueryResponseType,
    StringKeyValueMapType,
    TokenizeRequestType,
    IndexRange,
    ServiceAccountResponseError,
} from "skyflow-common";

export interface ClientConfig {
    config: VaultConfig | ConnectionConfig;
    vaultController?: VaultController;
    connectionController?: ConnectionController;
    detectController?: DetectController;
    client: VaultClient;
}

export interface ClientObj {
    [vaultId: string]: ClientConfig;
}

export interface SuccessDetokenizeResponse {
    token: string;
    value: string;
    type: string;
}

export interface ErrorDetokenizeResponse {
    requestId: string;
    token: string;
    error: string;
}

export interface ParsedDetokenizeResponse {
    success: SuccessDetokenizeResponse[];
    errors: SkyflowRecordError[];
}

export interface ErrorInsertBatchResponse {
    requestId: string;
    requestIndex: number;
    error: string;
}

export interface ParsedInsertBatchResponse {
    success: InsertResponseType[];
    errors: SkyflowRecordError[];
}

export interface DetokenizeData {
    token: string;
    redactionType?: RedactionType;
}

export interface SkyflowApiErrorNewFormat {
  rawResponse: {
    headers: { get(key: string): string | undefined };
  };
  body: {
    error: {
      message: string;
      http_code?: number;
      grpc_code?: number | string;
      details?: any[];
      http_status?: string;
      rawBody?: string;
    };
  };
  statusCode?: number;
  message?: string;
}

export interface SkyflowApiErrorLegacyBody {
  error: {
    message: string;
    http_code?: number;
    grpc_code?: number | string;
    details?: any[];
    rawBody?: string;
    http_status?: string;
  };
}

export interface SkyflowApiErrorLegacy {
  headers: { get(key: string): string | undefined };
  body?: SkyflowApiErrorLegacyBody;
  statusCode?: number;
  message?: string;
}

export type SkyflowAllError =
  | SkyflowApiErrorNewFormat
  | SkyflowApiErrorLegacy
  | SkyflowError
  | Error;

export type SkyflowErrorData =
  | SkyflowApiErrorNewFormat['body']['error']
  | SkyflowApiErrorLegacyBody['error']
  | undefined;

export interface RecordsResponse<T = Record<string, unknown>> {
  records: T[];
  requestId: string;
}

export interface DetectTextResponse<T = unknown> {
  records: T;
  requestId: string;
}

export interface DetectFileResponse<T = unknown> {
  data: T;
  requestId: string;
}
export interface SkyflowIdResponse {
  skyflowId: string;
  /** @deprecated Renamed to skyflowId. Will be removed in v3. */
  skyflow_id?: string;
}

export interface TokensResponse extends SkyflowIdResponse {
  tokens?: Record<string, unknown>;
}

export type DeidentifyFileOutputProcessedFileType =
    | "entities"
    | "plaintext_transcription"
    | "redacted_audio"
    | "redacted_diarized_transcription"
    | "redacted_file"
    | "redacted_image"
    | "redacted_medical_diarized_transcription"
    | "redacted_medical_transcription"
    | "redacted_text"
    | "redacted_transcription";

export interface DeidentifyFileOutput {
    processedFile?: string;
    processedFileType?: DeidentifyFileOutputProcessedFileType;
    processedFileExtension?: string;
}

export type DeidentifyStatusResponseOutputType = "BASE64" | "UNKNOWN";
export type WordCharacterCount = {
    wordCount?: number;
    characterCount?: number;
}

export interface DeidentifyFileDetectRunResponse {
    status: "FAILED" | "IN_PROGRESS" | "SUCCESS" | "UNKNOWN";
    output: DeidentifyFileOutput[];
    outputType: DeidentifyStatusResponseOutputType;
    message: string;
    wordCharacterCount?: WordCharacterCount;
    size?: number;
    duration?: number;
    pages?: number;
    slides?: number;
    runId?: string;
}
