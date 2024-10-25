import { CONNECTION_ID, CREDENTIALS, Env, getVaultURL, ISkyflowError, LOGLEVEL, LogLevel, MessageType, parameterizedString, printLog, VAULT_ID } from "../../utils";
import ConnectionConfig from "../config/connection";
import VaultConfig from "../config/vault";
import { SkyflowConfig, ClientObj } from "../types";
import VaultController from "../controller/vault";
import ConnectionController from "../controller/connections";
import VaultClient from "../client";
import Credentials from "../config/credentials";
import SkyflowError from "../../error";
import logs from "../../utils/logs";
import { isLogLevel, validateConnectionConfig, validateSkyflowConfig, validateSkyflowCredentials, validateUpdateConnectionConfig, validateUpdateVaultConfig, validateVaultConfig } from "../../utils/validations";
import SKYFLOW_ERROR_CODE from "../../error/codes";

class Skyflow {

    private vaultClients: ClientObj = {};

    private connectionClients: ClientObj = {};

    private commonCredentials?: Credentials;

    private logLevel: LogLevel = LogLevel.ERROR;

    constructor(config: SkyflowConfig) {
        validateSkyflowConfig(config);
        printLog(logs.infoLogs.INITIALIZE_CLIENT, MessageType.LOG, this.logLevel);
        if (config?.logLevel  && !isLogLevel(config?.logLevel))
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_LOG_LEVEL);

        this.logLevel = config.logLevel || LogLevel.ERROR;
        printLog(parameterizedString(logs.infoLogs.CURRENT_LOG_LEVEL,[this.logLevel]), MessageType.LOG, this.logLevel);

        if (config?.skyflowCredentials)
            validateSkyflowCredentials(config.skyflowCredentials)

        this.commonCredentials = config?.skyflowCredentials;
        printLog(logs.infoLogs.VALIDATING_VAULT_CONFIG, MessageType.LOG, this.logLevel);
        config.vaultConfigs.map(vaultConfig => {
            this.addVaultConfig(vaultConfig);
        });
        printLog(logs.infoLogs.VALIDATING_CONNECTION_CONFIG, MessageType.LOG, this.logLevel);
        config.connectionConfigs?.map(connectionConfig => {
            this.addConnectionConfig(connectionConfig);
        });
        printLog(logs.infoLogs.CLIENT_INITIALIZED, MessageType.LOG, this.logLevel);
    }

    private addVaultClient(config: VaultConfig, clients: ClientObj) {
        const env = config.env || Env.PROD;
        const vaultUrl = getVaultURL(config.clusterId, env);
        const client = new VaultClient(vaultUrl, config.vaultId, config?.credentials, this.commonCredentials, this.logLevel);
        const controller = new VaultController(client);
        printLog(parameterizedString(logs.infoLogs.VAULT_CONTROLLER_INITIALIZED, [config.vaultId]), MessageType.LOG, this.logLevel);
        clients[config.vaultId] = { config, client, controller };
    }

    private addConnectionClient(config: ConnectionConfig, clients: ClientObj) {
        const client = new VaultClient(config.connectionUrl, '', config?.credentials, this.commonCredentials, this.logLevel);
        const controller = new ConnectionController(client);
        printLog(parameterizedString(logs.infoLogs.CONNECTION_CONTROLLER_INITIALIZED, [config.connectionId]), MessageType.LOG, this.logLevel);
        clients[config.connectionId] = { config, client, controller };
    }

    addVaultConfig(config: VaultConfig) {
        validateVaultConfig(config);
        this.throwErrorIfIdExits(config?.vaultId, this.vaultClients, VAULT_ID);
        this.addVaultClient(config, this.vaultClients);
    }

    addConnectionConfig(config: ConnectionConfig) {
        validateConnectionConfig(config);
        this.throwErrorIfIdExits(config?.connectionId, this.connectionClients, CONNECTION_ID);
        this.addConnectionClient(config, this.connectionClients);
    }

    private updateVaultClient(config: VaultConfig, clients: ClientObj, idKey: string) {
        const existingClient = clients[config[idKey]];
        if (existingClient) {
            const updatedConfig = { ...existingClient.config, ...config };
            const vaultUrl = getVaultURL(updatedConfig.clusterId, updatedConfig.env || Env.PROD);
            existingClient.config = updatedConfig;
            existingClient.client.updateClientConfig(vaultUrl, updatedConfig.vaultId, updatedConfig.credentials, this.commonCredentials, this.logLevel);
        } else {
            this.throwErrorForUnknownId(config[idKey], idKey)
        }
    }

    private updateConnectionClient(config: ConnectionConfig, clients: ClientObj, idKey: string) {
        const existingClient = clients[config[idKey]];
        if (existingClient) {
            const updatedConfig = { ...existingClient.config, ...config };
            existingClient.config = updatedConfig;
            existingClient.client.updateClientConfig(updatedConfig.connectionUrl, '', updatedConfig.credentials, this.commonCredentials, this.logLevel);
        } else {
            this.throwErrorForUnknownId(config[idKey], idKey)
        }
    }

    updateVaultConfig(config: VaultConfig) {
        validateUpdateVaultConfig(config);
        this.updateVaultClient(config, this.vaultClients, VAULT_ID);
    }

    updateConnectionConfig(config: ConnectionConfig) {
        validateUpdateConnectionConfig(config);
        this.updateConnectionClient(config, this.connectionClients, CONNECTION_ID);
    }

    getVaultConfig(vaultId: string) {
        return this.getConfig(vaultId, this.vaultClients, VAULT_ID);
    }

    removeVaultConfig(vaultId: string) {
        this.removeConfig(vaultId, this.vaultClients, VAULT_ID);
    }

    getConnectionConfig(connectionId: string) {
        return this.getConfig(connectionId, this.connectionClients, CONNECTION_ID);
    }

    removeConnectionConfig(connectionId: string) {
        this.removeConfig(connectionId, this.connectionClients, CONNECTION_ID);
    }

    private throwSkyflowError(idKey: string, errorMapping: { [key: string]: ISkyflowError }, params?: string[]) {
        const errorCode = errorMapping[idKey];
        if (errorCode) {
            throw new SkyflowError(errorCode, params);
        }
    }

    private throwErrorIfIdExits(id: string, clients: ClientObj, idKey: string) {
        const errorMapping = {
            [VAULT_ID]: SKYFLOW_ERROR_CODE.VAULT_ID_EXITS_IN_CONFIG_LIST,
            [CONNECTION_ID]: SKYFLOW_ERROR_CODE.CONNECTION_ID_EXITS_IN_CONFIG_LIST,
        };
        if(Object.keys(clients).includes(id)){
            printLog(parameterizedString(logs.infoLogs[`${idKey}_CONFIG_EXISTS`], [id]), MessageType.LOG, this.logLevel);
            this.throwSkyflowError(idKey, errorMapping, [id]);
        }
    }

    private throwErrorForUnknownId(id: string, idKey: string) {
        const errorMapping = {
            [VAULT_ID]: SKYFLOW_ERROR_CODE.VAULT_ID_NOT_IN_CONFIG_LIST,
            [CONNECTION_ID]: SKYFLOW_ERROR_CODE.CONNECTION_ID_NOT_IN_CONFIG_LIST,
        };
        printLog(parameterizedString(logs.infoLogs[`${idKey}_CONFIG_DOES_NOT_EXIST`], [id]), MessageType.LOG, this.logLevel);
        this.throwSkyflowError(idKey, errorMapping, [id]);
    }
    
    private throwErrorForEmptyClients(idKey: string) {
        const errorMapping = {
            [VAULT_ID]: SKYFLOW_ERROR_CODE.EMPTY_VAULT_CLIENTS,
            [CONNECTION_ID]: SKYFLOW_ERROR_CODE.EMPTY_CONNECTION_CLIENTS,
        };
        this.throwSkyflowError(idKey, errorMapping);
    }
    
    private throwErrorForEmptyId(idKey: string) {
        const errorMapping = {
            [VAULT_ID]: SKYFLOW_ERROR_CODE.EMPTY_VAULT_ID_VALIDATION,
            [CONNECTION_ID]: SKYFLOW_ERROR_CODE.EMPTY_CONNECTION_ID_VALIDATION,
        };
        this.throwSkyflowError(idKey, errorMapping);
    }    

    private removeConfig(id: string, clients: ClientObj, idKey: string) {
        if (!clients[id]) this.throwErrorForUnknownId(id, idKey);
        delete clients[id];
    }

    private getConfig(id: string, clients: ClientObj, idKey: string) {
        if(!id) this.throwErrorForEmptyId(idKey);
        if (!clients[id]) this.throwErrorForUnknownId(id, idKey);
        return clients[id].config;
    }

    updateLogLevel(logLevel: LogLevel) {
        if (logLevel && !isLogLevel(logLevel)) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_LOG_LEVEL);
        }
        this.logLevel = logLevel;
        this.updateClients(LOGLEVEL);
    }

    getLogLevel() {
        return this.logLevel;
    }

    updateSkyflowCredentials(credentials: Credentials) {
        if (!credentials)
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_CREDENTIALS);
        validateSkyflowCredentials(credentials);
        this.commonCredentials = credentials;
        this.updateClients(CREDENTIALS);
    }

    getSkyflowCredentials() {
        return this.commonCredentials;
    }

    vault(vaultId?: string) {
        return this.getClient(vaultId, this.vaultClients, VAULT_ID) as VaultController;
    }

    connection(connectionId?: string) {
        return this.getClient(connectionId, this.connectionClients, CONNECTION_ID) as ConnectionController;
    }

    private getClient(id: string | undefined, clients: ClientObj, idKey: string) {
        if(Object.keys(clients).length === 0) this.throwErrorForEmptyClients(idKey)
        const clientId = id || Object.keys(clients)[0];
        if (clientId && clients[clientId]?.controller) {
            return clients[clientId].controller;
        }
        if (clientId) this.throwErrorForUnknownId(clientId, idKey)
    }

    private updateClients(updateType: string) {
        this.updateClient(updateType, this.vaultClients);
        this.updateClient(updateType, this.connectionClients);
    }

    private updateClient(updateType: string, list: ClientObj) {
        Object.values(list).forEach(clientConfig => {
            if (updateType === LOGLEVEL) {
                clientConfig.client.updateLogLevel(this.logLevel);
            } else if (updateType === CREDENTIALS) {
                clientConfig.client.updateSkyflowCredentials(this.commonCredentials);
            }
        });
    }

}

export default Skyflow;
