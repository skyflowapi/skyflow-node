import { LogLevel } from "../../utils";
import ConnectionConfig from "../config/connection";
import VaultConfig from "../config/vault"

export interface SkyflowConfig {
    vaultConfig: VaultConfig[],
    connectionConfig?: ConnectionConfig[],
    skyflowCredentials: Credential,
    logLevel?: LogLevel,
}