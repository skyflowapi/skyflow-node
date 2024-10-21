// imports
import { Env } from "../../../utils";
import Credentials from "../credentials";

interface VaultConfig {
    vaultId: string;
    clusterId: string;
    env?: Env;
    credentials?: Credentials;
}

export default VaultConfig;
