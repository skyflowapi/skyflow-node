import { LogLevel } from "../utils";
import ConnectionConfig from "../config/connection";
import VaultConfig from "../config/vault";
import Credentials from "../config/credentials";

export interface SkyflowConfig {
    vaultConfigs?: VaultConfig[];
    connectionConfigs?: ConnectionConfig[];
    skyflowCredentials?: Credentials;
    logLevel?: LogLevel;
}

export type FileInput =
    | Filepath
    | FileObject

export interface Filepath {
    filePath: string;
}

export interface FileObject {
    file: File;
}

export interface InsertResponseType {
    skyflowId: string;
    /** @deprecated Renamed to skyflowId. Will be removed in v3. */
    skyflow_id?: string;
    [key: string]: unknown;
}

export interface GetResponseData {
    [key: string]: unknown;
}

export interface QueryResponseType {
    [key: string]: unknown;
}

export interface StringKeyValueMapType {
    [key: string]: object | string;
}

export interface TokenizeRequestType {
    columnGroup: string;
    value: string;
}

export interface IndexRange {
    start?: number;
    end?: number;
}

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
