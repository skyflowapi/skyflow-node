import { LogLevel } from "../../utils/common";
import ConnectionConfig from "../model/config/connection";
import VaultConfig from "../model/config/vault"

export interface SkyflowConfig {
    vaultConfig: VaultConfig[],
    connectionConfig?: ConnectionConfig[],
    skyflowCredentials: Credential,
    logLevel?: LogLevel,
}