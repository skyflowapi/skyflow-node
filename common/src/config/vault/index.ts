// imports
import { Env } from "../../utils";
import Credentials from "../credentials";

interface VaultConfig {
    vaultId: string;
    clusterId: string;
    env?: Env;
    credentials?: Credentials;
    /** Overall per-call timeout in seconds (includes retries). Default 60. */
    timeout?: number;
    /** Retry attempts after the first failure (408/429/5xx). Default 0 (off). */
    maxRetries?: number;
    /** Override the vault URL derived from clusterId/env. */
    vaultUrl?: string;
}

export default VaultConfig;
