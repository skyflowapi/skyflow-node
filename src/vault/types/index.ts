import { LogLevel, RedactionType } from "../../utils";
import ConnectionConfig from "../config/connection";
import VaultConfig from "../config/vault"
import Credentials from "../config/credentials";
import VaultController from "../controller/vault";
import ConnectionController from "../controller/connections";
import VaultClient from "../client";
import DetectController from "../controller/detect";
import SkyflowError from "../../error";

export interface SkyflowConfig {
    vaultConfigs?: VaultConfig[];
    connectionConfigs?: ConnectionConfig[];
    skyflowCredentials?: Credentials;
    logLevel?: LogLevel;
}

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

export interface insertResponseType {
    skyflowId: string;
    [key: string]: string;
}

export interface queryResponseType {
    skyflowId: string;
    tokenizedData: insertResponseType;
    [key: string]: string | insertResponseType;
}

export interface StringKeyValueMapType {
    [key: string]: object | string;
}

export interface TokenizeRequestType {
    columnGroup: string;
    value: string;
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
    errors: ErrorDetokenizeResponse[];
}

export interface ErrorInsertBatchResponse {
    requestId: string;
    requestIndex: number;
    error: string;
}

export interface ParsedInsertBatchResponse {
    success: insertResponseType[];
    errors: ErrorInsertBatchResponse[];
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

export type ServiceAccountResponseError = {
  rawResponse?: {
    headers?: {
      get: (header: string) => string | undefined;
    };
  };
  body: any;
  response?: {
    status?: number | string;
  };
  message: string;
  [key: string]: any;
};
