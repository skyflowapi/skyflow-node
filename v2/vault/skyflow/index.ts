import { LogLevel } from "../../utils/common";
import ConnectionConfig from "../model/config/connection";
import VaultConfig from "../model/config/vault";
import { SkyflowConfig } from "../types";

class Skyflow {

    constructor(config: SkyflowConfig) {

    }

    public addVaultConfig(config: VaultConfig) {

    }

    public removeVaultConfig(id: string) {

    }

    public updateVaultConfig(config: VaultConfig) {

    }

    public addConnectionConfig(config: ConnectionConfig) {

    }

    public removeConnectionConfig(id: string) {

    }

    public updateConnectionConfig(config: ConnectionConfig) {

    }

    public update_log_level(level: LogLevel) {

    }

    public vault(vaultId: string) {
        //(cache) - store the vault object in a list, don't create object if object already exits
        //return vault Object using static func
    }

    public connection(connectionId: string) {
        //(cache) - store the connection object in a list, don't create object if object already exits
        //return connection Object static func
    }

}

export default Skyflow;
