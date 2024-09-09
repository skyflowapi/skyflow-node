import { LogLevel } from "../../utils";
import ConnectionConfig from "../config/connection";
import VaultConfig from "../config/vault";
import { SkyflowConfig } from "../types";

class Skyflow {

    constructor(config: SkyflowConfig) {

    }

    addVaultConfig(config: VaultConfig) {

    }

    removeVaultConfig(id: string) {

    }

    updateVaultConfig(config: VaultConfig) {

    }

    addConnectionConfig(config: ConnectionConfig) {

    }

    removeConnectionConfig(id: string) {

    }

    updateConnectionConfig(config: ConnectionConfig) {

    }

    update_log_level(level: LogLevel) {

    }

    vault(vaultId: string) {
        //(cache) - store the vault object in a list, don't create object if object already exits
        //return vault Object using static func
    }

    connection(connectionId: string) {
        //(cache) - store the connection object in a list, don't create object if object already exits
        //return connection Object static func
    }

}

export default Skyflow;
