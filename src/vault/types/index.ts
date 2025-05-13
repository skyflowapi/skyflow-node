import { LogLevel, RedactionType } from "../../utils";
import ConnectionConfig from "../config/connection";
import VaultConfig from "../config/vault"
import Credentials from "../config/credentials";
import VaultController from "../controller/vault";
import ConnectionController from "../controller/connections";
import VaultClient from "../client";
import DetectController from "../controller/detect";

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