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
    InsertResponseType,
    GetResponseData,
    QueryResponseType,
    StringKeyValueMapType,
    TokenizeRequestType,
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

export interface SkyflowIdResponse {
  skyflowId: string;
  /** @deprecated Renamed to skyflowId. Will be removed in v3. */
  skyflow_id?: string;
}

export interface TokensResponse extends SkyflowIdResponse {
  tokens?: Record<string, unknown>;
}

