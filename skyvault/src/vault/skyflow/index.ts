import {
  BaseSkyflow,
  BaseVaultEntry,
  CONFIG,
  Env,
  getVaultURL,
  LogLevel,
  MessageType,
  parameterizedString,
  printLog,
  logs,
  SkyflowError,
  SKYFLOW_ERROR_CODE,
  Credentials,
  VaultConfig,
  ConnectionConfig,
  validateConnectionConfig,
  validateUpdateConnectionConfig,
  setSdkIdentity,
} from "skyflow-common";
import { SkyflowConfig } from "../types";
import VaultController from "../controller/vault";
import ConnectionController from "../controller/connections";
import VaultClient from "../client";
import DetectController from "../controller/detect";
import { SDK_NAME, SDK_VERSION } from "../../version";

// Stamp the SDK identity so error text + telemetry self-report this product.
setSdkIdentity({ name: SDK_NAME, version: SDK_VERSION });

/** A configured vault: the client plus the controllers skyvault exposes. */
interface VaultEntry extends BaseVaultEntry<VaultClient> {
  vaultController: VaultController;
  detectController: DetectController;
}

/** A configured connection: the client plus its connection controller. */
interface ConnectionEntry {
  config: ConnectionConfig;
  client: VaultClient;
  connectionController: ConnectionController;
}

/**
 * Skyflow is the SkyVault (`skyflow-node`) SDK facade. The vault-config /
 * credential / log-level management is inherited from the shared `BaseSkyflow`
 * in `common`; this layer adds the SkyVault-only surfaces: the detect
 * controller on each vault, and the connection registry + `connection()`.
 */
class Skyflow extends BaseSkyflow<VaultEntry> {
  private connectionClients: { [connectionId: string]: ConnectionEntry } = {};

  constructor(config: SkyflowConfig) {
    super();
    // Common vault + credential + log-level setup (validates config, logs,
    // registers vaultConfigs via buildVaultEntry).
    this.initializeSkyflow(config);

    printLog(logs.infoLogs.VALIDATING_CONNECTION_CONFIG, MessageType.LOG, this.logLevel);
    config.connectionConfigs?.map((connectionConfig) => {
      this.addConnectionConfig(connectionConfig);
    });
    printLog(logs.infoLogs.CLIENT_INITIALIZED, MessageType.LOG, this.logLevel);
  }

  // --- layer-specific vault entry (vault + detect controllers) ---------------
  protected buildVaultEntry(config: VaultConfig): VaultEntry {
    const env = config.env || Env.PROD;
    const vaultUrl = getVaultURL(config.clusterId, env);
    const client = new VaultClient(
      vaultUrl,
      config.vaultId,
      config?.credentials,
      this.commonCredentials,
      this.logLevel,
    );
    const vaultController = new VaultController(client);
    const detectController = new DetectController(client);
    return { config, client, vaultController, detectController };
  }

  // --- log level / credentials also propagate to connection clients ----------
  protected applyLogLevel(): void {
    super.applyLogLevel();
    Object.values(this.connectionClients).forEach((entry) => entry.client.setLogLevel(this.logLevel));
  }

  protected applyCredentials(): void {
    super.applyCredentials();
    Object.values(this.connectionClients).forEach((entry) =>
      entry.client.updateSkyflowCredentials(this.commonCredentials),
    );
  }

  // --- connections (SkyVault only) -------------------------------------------
  private addConnectionClient(config: ConnectionConfig): void {
    const client = new VaultClient(
      config.connectionUrl,
      "",
      config?.credentials,
      this.commonCredentials,
      this.logLevel,
    );
    const connectionController = new ConnectionController(client);
    printLog(
      parameterizedString(logs.infoLogs.CONNECTION_CONTROLLER_INITIALIZED, [config.connectionId]),
      MessageType.LOG,
      this.logLevel,
    );
    this.connectionClients[config.connectionId] = { config, client, connectionController };
  }

  addConnectionConfig(config: ConnectionConfig): void {
    validateConnectionConfig(config, this.logLevel);
    this.throwErrorIfConnectionIdExists(config?.connectionId);
    this.addConnectionClient(config);
  }

  updateConnectionConfig(config: ConnectionConfig): void {
    validateUpdateConnectionConfig(config, this.logLevel);
    const existing = this.connectionClients[config.connectionId];
    if (!existing) {
      this.throwErrorForUnknownConnectionId(config.connectionId);
      return;
    }
    const updatedConfig = { ...existing.config, ...config };
    existing.config = updatedConfig;
    existing.client.updateClientConfig(
      updatedConfig.connectionUrl,
      "",
      updatedConfig.credentials,
      this.commonCredentials,
      this.logLevel,
    );
  }

  getConnectionConfig(connectionId: string): ConnectionConfig {
    if (!connectionId) {
      throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_CONNECTION_ID_VALIDATION);
    }
    const existing = this.connectionClients[connectionId];
    if (!existing) {
      this.throwErrorForUnknownConnectionId(connectionId);
    }
    return existing.config;
  }

  removeConnectionConfig(connectionId: string): void {
    if (!this.connectionClients[connectionId]) {
      this.throwErrorForUnknownConnectionId(connectionId);
      return;
    }
    delete this.connectionClients[connectionId];
  }

  // --- controller accessors --------------------------------------------------
  vault(vaultId?: string): VaultController {
    return this.resolveVaultEntry(vaultId).vaultController;
  }

  detect(vaultId?: string): DetectController {
    return this.resolveVaultEntry(vaultId).detectController;
  }

  connection(connectionId?: string): ConnectionController {
    if (Object.keys(this.connectionClients).length === 0) {
      throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_CONNECTION_CLIENTS);
    }
    const clientId = connectionId || Object.keys(this.connectionClients)[0];
    const entry = this.connectionClients[clientId];
    if (entry?.connectionController) {
      return entry.connectionController;
    }
    this.throwErrorForUnknownConnectionId(clientId);
    // Unreachable: throwErrorForUnknownConnectionId always throws.
    throw new SkyflowError(SKYFLOW_ERROR_CODE.INTERNAL_SERVER_ERROR);
  }

  // --- connection error helpers ----------------------------------------------
  private throwErrorIfConnectionIdExists(id: string): void {
    if (Object.keys(this.connectionClients).includes(id)) {
      printLog(
        parameterizedString(logs.infoLogs[`${CONFIG.CONNECTION_ID}_CONFIG_EXISTS`], [id]),
        MessageType.ERROR,
        this.logLevel,
      );
      throw new SkyflowError(SKYFLOW_ERROR_CODE.CONNECTION_ID_EXITS_IN_CONFIG_LIST, [id]);
    }
  }

  private throwErrorForUnknownConnectionId(id: string): void {
    printLog(
      parameterizedString(logs.infoLogs[`${CONFIG.CONNECTION_ID}_CONFIG_DOES_NOT_EXIST`], [id]),
      MessageType.ERROR,
      this.logLevel,
    );
    throw new SkyflowError(SKYFLOW_ERROR_CODE.CONNECTION_ID_NOT_IN_CONFIG_LIST, [id]);
  }
}

export default Skyflow;
