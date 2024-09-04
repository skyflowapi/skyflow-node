import { LogLevel } from "../../utils/common";
import ManagementConfig from "../model/config/management";

export interface SkyflowConfig {
    managementConfig: ManagementConfig[],
    logLevel?: LogLevel,
}