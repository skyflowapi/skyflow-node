import { LogLevel } from "../../utils";
import ManagementConfig from "../config/management";

export interface SkyflowConfig {
    managementConfig: ManagementConfig[],
    logLevel?: LogLevel,
}