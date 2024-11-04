import { LogLevel } from "../../utils";
import ConnectionConfig from "../config/connection";
import VaultConfig from "../config/vault"
import Credentials from "../config/credentials";
import VaultController from "../controller/vault";
import ConnectionController from "../controller/connections";
import VaultClient from "../client";

export interface SkyflowConfig {
    vaultConfigs: VaultConfig[];
    connectionConfigs?: ConnectionConfig[];
    skyflowCredentials?: Credentials;
    logLevel?: LogLevel;
}

export interface ClientConfig {
    config: VaultConfig | ConnectionConfig;
    controller: VaultController | ConnectionController;
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

export interface tokenizeRequestType {
    columnGroup: string;
    value: string;
}
export interface SuccessDetokenizeResponse {
    token: string;
    value: string;
    type: string;
}

export interface ErrorDetokenizeResponse {
    token: string;
    error: string;
}

export interface ParsedDetokenizeResponse {
    success: SuccessDetokenizeResponse[];
    errors: ErrorDetokenizeResponse[];
}

export interface ErrorInsertBatchResponse {
    requestIndex: number;
    error: string;
}

export interface ParsedInsertBatchResponse {
    success: insertResponseType[];
    errors: ErrorInsertBatchResponse[];
}