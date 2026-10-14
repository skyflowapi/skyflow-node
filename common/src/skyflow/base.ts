// =============================================================================
// BaseSkyflow — the contract-agnostic facade base shared by every Skyflow SDK
// (skyvault / flowvault), analogous to Java's `common` BaseSkyflow.
//
// It owns the vault-client registry, common credentials, log level, and the
// vault-config / credential / log-level management methods. Each layer extends
// it, implements `buildVaultEntry` to construct its own VaultClient + the
// controllers it exposes, and adds its layer-specific accessors (vault(),
// and for skyvault also detect()/connection()).
// =============================================================================
import {
  CONFIG,
  Env,
  LogLevel,
  MessageType,
  parameterizedString,
  printLog,
  getVaultURL,
} from "../utils";
import {
  isLogLevel,
  validateSkyflowConfig,
  validateVaultConfig,
  validateUpdateVaultConfig,
  validateSkyflowCredentials,
} from "../validations";
import SkyflowError from "../error";
import SKYFLOW_ERROR_CODE from "../error/codes";
import logs from "../utils/logs";
import type Credentials from "../config/credentials";
import type VaultConfig from "../config/vault";
import type { SkyflowConfig } from "../types";

/** Minimal surface each layer's VaultClient must expose for base management. */
export interface BaseVaultClientLike {
  setLogLevel(logLevel: LogLevel): void;
  updateSkyflowCredentials(credentials?: Credentials): void;
  updateClientConfig(
    url: string,
    vaultId: string,
    individualCredentials?: Credentials,
    skyflowCredentials?: Credentials,
    logLevel?: LogLevel,
  ): void;
}

/** A registry entry for one configured vault: its config, client and controllers. */
export interface BaseVaultEntry<TClient extends BaseVaultClientLike = BaseVaultClientLike> {
  config: VaultConfig;
  client: TClient;
}

export abstract class BaseSkyflow<TEntry extends BaseVaultEntry> {
  protected vaultClients: { [vaultId: string]: TEntry } = {};

  protected commonCredentials?: Credentials;

  protected logLevel: LogLevel = LogLevel.ERROR;

  /**
   * Build the layer-specific entry (VaultClient + the controllers that layer
   * exposes). Implementations may read `this.commonCredentials` / `this.logLevel`.
   */
  protected abstract buildVaultEntry(config: VaultConfig): TEntry;

  /**
   * Common initialization: validate config, set log level + credentials, and
   * register the provided vault configs. Call from the subclass constructor
   * (after super()). Connection configs, if any, are handled by the subclass.
   */
  protected initializeSkyflow(config: SkyflowConfig): void {
    validateSkyflowConfig(config, this.logLevel);
    printLog(logs.infoLogs.INITIALIZE_CLIENT, MessageType.LOG, this.logLevel);

    if (config?.logLevel && !isLogLevel(config.logLevel)) {
      throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_LOG_LEVEL);
    }
    this.logLevel = config.logLevel || LogLevel.ERROR;
    printLog(
      parameterizedString(logs.infoLogs.CURRENT_LOG_LEVEL, [this.logLevel]),
      MessageType.LOG,
      this.logLevel,
    );

    if (config?.skyflowCredentials) {
      validateSkyflowCredentials(config.skyflowCredentials);
    }
    this.commonCredentials = config?.skyflowCredentials;

    printLog(logs.infoLogs.VALIDATING_VAULT_CONFIG, MessageType.LOG, this.logLevel);
    config.vaultConfigs?.forEach((vaultConfig) => this.addVaultConfig(vaultConfig));
  }

  addVaultConfig(config: VaultConfig): void {
    validateVaultConfig(config, this.logLevel);
    this.throwErrorIfVaultIdExists(config?.vaultId);
    this.vaultClients[config.vaultId] = this.buildVaultEntry(config);
    printLog(logs.infoLogs.CONTROLLER_INITIALIZED, MessageType.LOG, this.logLevel);
  }

  updateVaultConfig(config: VaultConfig): void {
    validateUpdateVaultConfig(config, this.logLevel);
    const existing = this.vaultClients[config.vaultId];
    if (!existing) {
      this.throwErrorForUnknownVaultId(config.vaultId);
      return;
    }
    const updatedConfig = { ...existing.config, ...config };
    const vaultUrl = getVaultURL(updatedConfig.clusterId, updatedConfig.env || Env.PROD);
    existing.config = updatedConfig;
    existing.client.updateClientConfig(
      vaultUrl,
      updatedConfig.vaultId,
      updatedConfig.credentials,
      this.commonCredentials,
      this.logLevel,
    );
  }

  getVaultConfig(vaultId: string): VaultConfig {
    if (!vaultId) {
      throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_VAULT_ID_VALIDATION);
    }
    const existing = this.vaultClients[vaultId];
    if (!existing) {
      this.throwErrorForUnknownVaultId(vaultId);
    }
    return existing.config;
  }

  removeVaultConfig(vaultId: string): void {
    if (!this.vaultClients[vaultId]) {
      this.throwErrorForUnknownVaultId(vaultId);
      return;
    }
    delete this.vaultClients[vaultId];
  }

  setLogLevel(logLevel: LogLevel): void {
    if (logLevel && !isLogLevel(logLevel)) {
      throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_LOG_LEVEL);
    }
    this.logLevel = logLevel;
    this.applyLogLevel();
  }

  /** Apply the current log level to all clients. Subclasses extend to cover
   * additional (e.g. connection) clients, then call super.applyLogLevel(). */
  protected applyLogLevel(): void {
    Object.values(this.vaultClients).forEach((entry) => entry.client.setLogLevel(this.logLevel));
  }

  updateLogLevel(logLevel: LogLevel): this {
    this.setLogLevel(logLevel);
    return this;
  }

  getLogLevel(): LogLevel {
    return this.logLevel;
  }

  updateSkyflowCredentials(credentials: Credentials): void {
    if (!credentials) {
      throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_CREDENTIALS);
    }
    validateSkyflowCredentials(credentials);
    this.commonCredentials = credentials;
    this.applyCredentials();
  }

  /** Apply the current common credentials to all clients. Subclasses extend. */
  protected applyCredentials(): void {
    Object.values(this.vaultClients).forEach((entry) =>
      entry.client.updateSkyflowCredentials(this.commonCredentials),
    );
  }

  getSkyflowCredentials(): Credentials | undefined {
    return this.commonCredentials;
  }

  /** Resolve a vault entry by id (or the first registered), with the common
   * empty-registry / unknown-id errors. Layer accessors (vault/detect) use this. */
  protected resolveVaultEntry(vaultId?: string): TEntry {
    if (Object.keys(this.vaultClients).length === 0) {
      throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_VAULT_CLIENTS);
    }
    const clientId = vaultId || Object.keys(this.vaultClients)[0];
    const entry = this.vaultClients[clientId];
    if (entry) {
      return entry;
    }
    this.throwErrorForUnknownVaultId(clientId);
    // Unreachable: throwErrorForUnknownVaultId always throws.
    throw new SkyflowError(SKYFLOW_ERROR_CODE.INTERNAL_SERVER_ERROR);
  }

  protected throwErrorIfVaultIdExists(id: string): void {
    if (Object.keys(this.vaultClients).includes(id)) {
      printLog(
        parameterizedString(logs.infoLogs[`${CONFIG.VAULT_ID}_CONFIG_EXISTS`], [id]),
        MessageType.ERROR,
        this.logLevel,
      );
      throw new SkyflowError(SKYFLOW_ERROR_CODE.VAULT_ID_EXITS_IN_CONFIG_LIST, [id]);
    }
  }

  protected throwErrorForUnknownVaultId(id: string): void {
    printLog(
      parameterizedString(logs.infoLogs[`${CONFIG.VAULT_ID}_CONFIG_DOES_NOT_EXIST`], [id]),
      MessageType.ERROR,
      this.logLevel,
    );
    throw new SkyflowError(SKYFLOW_ERROR_CODE.VAULT_ID_NOT_IN_CONFIG_LIST, [id]);
  }
}

export default BaseSkyflow;
