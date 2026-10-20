import {
  BaseSkyflow,
  BaseVaultEntry,
  Env,
  MessageType,
  SkyflowConfig,
  VaultConfig,
  logs,
  printLog,
  setSdkIdentity,
} from 'skyflow-common';
import VaultClient from '../client';
import VaultController from '../controller/vault';
import { SDK_NAME, SDK_VERSION } from '../version';

// Stamp the SDK identity so telemetry and errors self-report FlowVault.
setSdkIdentity({ name: SDK_NAME, version: SDK_VERSION });

// FlowVault (v3) is hosted on the `skyvault.*` subdomain, a DIFFERENT host than
// the shared `getVaultURL` (`vault.*`, used by skyvault). All four confirmed.
function getFlowVaultURL(clusterId: string, env: Env): string {
  switch (env) {
    case Env.PROD:
      return `https://${clusterId}.skyvault.skyflowapis.com`;
    case Env.SANDBOX:
      return `https://${clusterId}.skyvault.skyflowapis-preview.com`;
    case Env.DEV:
      return `https://${clusterId}.skyvault.skyflowapis.dev`;
    case Env.STAGE:
      return `https://${clusterId}.skyvault.skyflowapis.tech`;
    default:
      return `https://${clusterId}.skyvault.skyflowapis.com`;
  }
}

interface ClientEntry extends BaseVaultEntry<VaultClient> {
  vaultController: VaultController;
}

/**
 * Skyflow is the FlowVault SDK facade. Vault-config / credential / log-level
 * management comes from the shared `BaseSkyflow` in `common`; this layer only
 * builds its own VaultClient + VaultController and exposes `vault(vaultId?)`.
 * (FlowVault has no connections or detect.)
 */
class Skyflow extends BaseSkyflow<ClientEntry> {
  constructor(config: SkyflowConfig) {
    super();
    this.initializeSkyflow(config);
    printLog(logs.infoLogs.CLIENT_INITIALIZED, MessageType.LOG, this.logLevel);
  }

  protected buildVaultEntry(config: VaultConfig): ClientEntry {
    const env = config.env || Env.PROD;
    const vaultUrl = config.vaultUrl || getFlowVaultURL(config.clusterId, env);
    const client = new VaultClient(
      vaultUrl,
      config.vaultId,
      config?.credentials,
      this.commonCredentials,
      this.logLevel,
      { timeout: config.timeout, maxRetries: config.maxRetries },
    );
    const vaultController = new VaultController(client);
    return { config, client, vaultController };
  }

  vault(vaultId?: string): VaultController {
    return this.resolveVaultEntry(vaultId).vaultController;
  }
}

export default Skyflow;
