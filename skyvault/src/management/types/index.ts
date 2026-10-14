import { LogLevel } from "skyflow-common";
import ManagementConfig from "../config/management";

export interface SkyflowConfig {
    managementConfig: ManagementConfig[],
    logLevel?: LogLevel,
}