import { LogLevel, Skyflow, Env } from '../../../src';

describe('Skyflow initialization', () => {
    const credentials = {
        apiKey: "sky-key"
    };
    const validSkyflowConfig = {
        vaultConfigs: [{
            vaultId: "vaultId",
            clusterId: "clusterId",
            credentials: credentials,
        }],
        connectionConfigs: [{
            connectionId: "CONN_ID",
            connectionUrl: "https://conurl.com",
            credentials: credentials,
        }],
        logLevel: LogLevel.INFO,
        skyflowCredentials: credentials,
    };

    const validSkyflowConfigWithoutCredentials = {
        vaultConfigs: [{
            vaultId: "vaultId",
            clusterId: "clusterId",
        }],
        connectionConfigs: [{
            connectionId: "CONN_ID",
            connectionUrl: "https://conurl.com",
        }],
        logLevel: LogLevel.INFO,
    };

    const emptyConfigError = "Skyflow config cannot be empty.";
    const invalidConfigError = "Invalid skyflow config.";
    const invalidVaultConfigError = "Invalid vault config.";
    const emptyVaultConfigError = "Vault config cannot be empty.";
    const invalidConnectionConfigError = "Invalid connection config.";

    test('should initialize the Skyflow object', () => {
        const skyflow = new Skyflow(validSkyflowConfig);
        expect(skyflow).toBeInstanceOf(Skyflow);
    });

    test('should initialize the Skyflow object without credentials', () => {
        const skyflow = new Skyflow(validSkyflowConfigWithoutCredentials);
        expect(skyflow).toBeInstanceOf(Skyflow);
    });

    test('should throw error when empty skyflowConfig is passed', () => {
        expect(() => new Skyflow()).toThrowError(emptyConfigError);
    });

    test('should throw error when invalid skyflowConfig is passed', () => {
        expect(() => new Skyflow({
            vaultConfig: {
                vaultId: "VAULT_ID",
                clusterId: true
            }
        })).toThrowError(invalidConfigError);
    });

    test('should throw error when invalid vaultConfig is passed', () => {
        expect(() => new Skyflow({
            vaultConfigs: {
                vaultId: "VAULT_ID",
                clusterId: true
            }
        })).toThrowError(invalidVaultConfigError);
    });

    test('should throw error when invalid connectionConfig is passed', () => {
        expect(() => new Skyflow({
            vaultConfigs: [{
                vaultId: "VAULT_ID",
                clusterId: "CLUSTER_ID"
            }],
            connectionConfigs: {
                vaultId: "VAULT_ID",
                clusterId: true
            }
        })).toThrowError(invalidConnectionConfigError);
    });


    describe('Detect Controller Tests', () => {
        const validVaultConfig = {
            vaultId: "VAULT_ID",
            clusterId: "CLUSTER_ID"
        };

        const noConfigFoundError = "No vault config found.";
        const missingVaultConfigError = "VAULT_ID is missing from the config.";

        test('should return detect controller', () => {
            const skyflow = new Skyflow({
                vaultConfigs: [validVaultConfig]
            });
            expect(skyflow.detect("VAULT_ID")).toBeTruthy();
        });

        test('should return detect controller when called without vault id', () => {
            const skyflow = new Skyflow({
                vaultConfigs: [validVaultConfig]
            });
            expect(skyflow.detect()).toBeTruthy();
        });

        test('should throw error for invalid vault id in detect method', () => {
            const skyflow = new Skyflow({
                vaultConfigs: [validVaultConfig],
            });
            skyflow.removeVaultConfig("VAULT_ID");
            expect(() => skyflow.detect("ID")).toThrowError(noConfigFoundError);
        });

        test('should throw error when no vault configs exist for detect method', () => {
            const skyflow = new Skyflow({
                vaultConfigs: [validVaultConfig],
            });
            skyflow.removeVaultConfig("VAULT_ID");
            expect(() => skyflow.detect("ID")).toThrowError(noConfigFoundError);
        });
    });

    describe('Update Clients Tests', () => {
        const validVaultConfig = {
            vaultId: "VAULT_ID",
            clusterId: "CLUSTER_ID"
        };

        const validConnectionConfig = {
            connectionId: "CONN_ID",
            connectionUrl: "https://connection-url.com"
        };

        test('should update log level for all clients', () => {
            const skyflow = new Skyflow({
                vaultConfigs: [validVaultConfig],
                connectionConfigs: [validConnectionConfig]
            });
            skyflow.setLogLevel(LogLevel.OFF);
            expect(skyflow.getLogLevel()).toBe(LogLevel.OFF);
        });

        test('should update credentials for all clients', () => {
            const skyflow = new Skyflow({
                vaultConfigs: [validVaultConfig],
                connectionConfigs: [validConnectionConfig],
                skyflowCredentials: {
                    apiKey: "sky-KEY"
                }
            });
            const newCredentials = { apiKey: "sky-VALID_KEY" };
            skyflow.updateSkyflowCredentials(newCredentials);
            expect(skyflow.getSkyflowCredentials()).toBe(newCredentials);
        });
    });

    describe('Log Level Tests', () => {
        const validVaultConfig = [{
            vaultId: "VAULT_ID",
            clusterId: "CLUSTER_ID"
        }];
    
        const invalidLogLevelError = "Invalid log level.";
    
        test('should throw error when invalid logLevel is passed during initialization', () => {
            expect(() => new Skyflow({
                vaultConfigs: validVaultConfig,
                logLevel: "LEVEL"
            })).toThrowError(invalidLogLevelError);
        });
    
        test('should update to valid logLevel', () => {
            const skyflow = new Skyflow({
                vaultConfigs: validVaultConfig,
                logLevel: LogLevel.ERROR
            });
            skyflow.setLogLevel(LogLevel.OFF);
            expect(skyflow.getLogLevel()).toBe(LogLevel.OFF);
        });
    
        test('should throw error when updating to invalid logLevel', () => {
            const skyflow = new Skyflow({
                vaultConfigs: validVaultConfig,
                logLevel: LogLevel.ERROR
            });
    
            expect(() => skyflow.setLogLevel("DUMMY"))
                .toThrowError(invalidLogLevelError);
        });
    });    

    describe('Skyflow Credentials Tests', () => {
        const validVaultConfig = [{
            vaultId: "VAULT_ID",
            clusterId: "CLUSTER_ID"
        }];
        
        const invalidCredentialsError = "Invalid credentials.";
        const multipleCredentialsError = "Multiple credentials provided.";
    
        test('should throw error for invalid skyflow credentials', () => {
            expect(() => new Skyflow({
                vaultConfigs: validVaultConfig,
                logLevel: LogLevel.OFF,
                skyflowCredentials: {}
            })).toThrowError(invalidCredentialsError);
        });
    
        test('should throw error when multiple credentials are passed', () => {
            expect(() => new Skyflow({
                vaultConfigs: validVaultConfig,
                logLevel: LogLevel.OFF,
                skyflowCredentials: {
                    token: "TOKEN",
                    apiKey: "sky-KEY"
                }
            })).toThrowError(multipleCredentialsError);
        });
    
        test('should update to valid skyflow credentials', () => {
            const skyflow = new Skyflow({
                vaultConfigs: validVaultConfig,
                logLevel: LogLevel.OFF,
                skyflowCredentials: {
                    apiKey: "sky-KEY"
                }
            });
            const newCredentials = { apiKey: "sky-VALID_KEY" };
            skyflow.updateSkyflowCredentials(newCredentials);
            expect(skyflow.getSkyflowCredentials()).toBe(newCredentials);
        });
    
        test('should throw error when updating with empty skyflow credentials', () => {
            const skyflow = new Skyflow({
                vaultConfigs: validVaultConfig,
                logLevel: LogLevel.OFF,
                skyflowCredentials: {
                    apiKey: "sky-KEY"
                }
            });
            expect(() => skyflow.updateSkyflowCredentials())
                .toThrowError(invalidCredentialsError);
        });
    
        test('should throw error when updating with multiple credentials', () => {
            const skyflow = new Skyflow({
                vaultConfigs: validVaultConfig,
                logLevel: LogLevel.OFF,
                skyflowCredentials: {
                    apiKey: "sky-KEY"
                }
            });
            expect(() => skyflow.updateSkyflowCredentials({
                token: "TOKEN",
                apiKey: "sky-KEY"
            })).toThrowError(multipleCredentialsError);
        });
    });    

    describe('Vault Config Tests', () => {
        const invalidVaultIdError = "Invalid vault ID.";
        const invalidClusterIdError = "Invalid cluster ID.";
        const invalidEnvError = "Invalid env.";
        const missingVaultConfigError = "VAULT_ID is missing from the config.";
        const missingIdConfigError = "ID is missing from the config.";
        const noConfigFound = "No vault config found.";
        const idExits = "already exists in the config list.";
    
        const validVaultConfig = {
            vaultId: "VAULT_ID",
            clusterId: "CLUSTER_ID",
            env: Env.DEV
        };
    
        test('should throw error for invalid vaultId in vaultConfig', () => {
            expect(() => new Skyflow({
                vaultConfigs: [{ vaultId: true }]
            })).toThrowError(invalidVaultIdError);
        });

        test('should throw error for invalid vaultId in vaultConfig', () => {
            expect(() => new Skyflow({
                vaultConfigs: [{ vaultId: true }]
            })).toThrowError(invalidVaultIdError);
        });
    
        test('should throw error for invalid clusterId in vaultConfig', () => {
            expect(() => new Skyflow({
                vaultConfigs: [{ vaultId: "VAULT_ID", clusterId: null }]
            })).toThrowError(invalidClusterIdError);
        });
    
        test('should throw error for invalid env in vaultConfig', () => {
            expect(() => new Skyflow({
                vaultConfigs: [{ vaultId: "VAULT_ID", clusterId: "CLUSTER_ID", env: "dummy" }]
            })).toThrowError(invalidEnvError);
        });
    
        test('should update vault config', () => {
            const skyflow = new Skyflow({
                vaultConfigs: [{
                    vaultId: "VAULT_ID",
                    clusterId: "CLUSTER_ID",
                }],
            });
            const updatedVaultConfig = {
                vaultId: "VAULT_ID",
                clusterId: "CLUSTER_ID"
            };
            skyflow.updateVaultConfig(updatedVaultConfig);
            expect(skyflow.getVaultConfig(updatedVaultConfig.vaultId)).toStrictEqual(updatedVaultConfig);
        });
    
        test('should remove vault config', () => {
            const skyflow = new Skyflow({
                vaultConfigs: [validVaultConfig],
            });
            skyflow.removeVaultConfig("VAULT_ID");
            expect(() => skyflow.getVaultConfig("VAULT_ID")).toThrowError(missingVaultConfigError);
        });

        test('should throw error when removing a non-existing vault config', () => {
            const skyflow = new Skyflow({
                vaultConfigs: [validVaultConfig],
            });
            expect(() => skyflow.removeVaultConfig("ID")).toThrowError(missingIdConfigError);
        });

        test('should throw error when calling a non-existing vault config', () => {
            const skyflow = new Skyflow({
                vaultConfigs: [validVaultConfig],
            });
            expect(() => skyflow.vault("ID")).toThrowError(missingIdConfigError);
        });

        test('should throw error when no vault configs exits', () => {
            const skyflow = new Skyflow({
                vaultConfigs: [validVaultConfig],
            });
            skyflow.removeVaultConfig("VAULT_ID");
            expect(() => skyflow.vault("ID")).toThrowError(noConfigFound);
        });

        test('should throw error when getting vault config with empty vaultID', () => {
            const skyflow = new Skyflow({
                vaultConfigs: [validVaultConfig],
            });
            expect(() => skyflow.getVaultConfig()).toThrowError(invalidVaultIdError);
        });

        test('should throw error when adding vault config', () => {
            const skyflow = new Skyflow({
                vaultConfigs: [validVaultConfig],
            });
            expect(() => skyflow.addVaultConfig(validVaultConfig)).toThrowError(idExits);
        });

        test('should throw error when updating a non-existing vault config', () => {
            const skyflow = new Skyflow({
                vaultConfigs: [validVaultConfig],
            });
            const updatedVaultConfig = {
                vaultId: "ID",
                clusterId: "CLUSTER_ID",
                env: Env.PROD
            };
            expect(() => skyflow.updateVaultConfig(updatedVaultConfig)).toThrowError("ID is missing from the config.");
        });
    
        test('should throw error when updating vault config with invalid id', () => {
            const skyflow = new Skyflow({
                vaultConfigs: [validVaultConfig],
            });
            const updatedVaultConfig = {
                clusterId: "CLUSTER_ID",
                env: Env.PROD
            };
            expect(() => skyflow.updateVaultConfig(updatedVaultConfig)).toThrowError("Invalid vault ID.");
        });

        test('should return vault controller', () => {
            const skyflow = new Skyflow({
                vaultConfigs: [validVaultConfig]
            });
            expect(skyflow.vault("VAULT_ID")).toBeTruthy();
        });

        test('should return vault controller when called without vault id', () => {
            const skyflow = new Skyflow({
                vaultConfigs: [validVaultConfig]
            });
            expect(skyflow.vault()).toBeTruthy();
        });

        test('should throw error for invalid vault id', () => {
            const skyflow = new Skyflow({
                vaultConfigs: [validVaultConfig],
            });
            skyflow.removeVaultConfig("VAULT_ID");
            expect(() => skyflow.vault("ID")).toThrowError(noConfigFound);
        });
    });

    describe('Connection Config Tests', () => {
        const validVaultConfig = {
            vaultId: "VAULT_ID",
            clusterId: "CLUSTER_ID"
        };
    
        const validConnectionConfig = {
            connectionId: "CONN_ID",
            connectionUrl: "https://connection-url.com"
        };
    
        test('should initialize with valid connection config', () => {
            const skyflow = new Skyflow({
                vaultConfigs: [validVaultConfig],
                connectionConfigs: [validConnectionConfig]
            });
            expect(skyflow.constructor).toBe(Skyflow);
        });
    
        test('should throw error for invalid connection id in connection config', () => {
            expect(() => new Skyflow({
                vaultConfigs: [validVaultConfig],
                connectionConfigs: [{ connectionId: true }]
            })).toThrowError("Invalid connection ID.");
        });
    
        test('should throw error for invalid connection url in connection config', () => {
            expect(() => new Skyflow({
                vaultConfigs: [validVaultConfig],
                connectionConfigs: [{ connectionId: "CONN_ID", connectionUrl: null }]
            })).toThrowError("Invalid connection URL.");
        });
    
        test('should throw error for empty connectionId in connection config', () => {
            expect(() => new Skyflow({
                vaultConfigs: [validVaultConfig],
                connectionConfigs: [{ connectionId: "" }]
            })).toThrowError("Invalid connection ID.");
        });
    
        test('should throw error for empty connection url in connection config', () => {
            expect(() => new Skyflow({
                vaultConfigs: [validVaultConfig],
                connectionConfigs: [{ connectionId: "CONN_ID", connectionUrl: "" }]
            })).toThrowError("Invalid connection URL.");
        });
    
        test('should update connection config', () => {
            const skyflow = new Skyflow({
                vaultConfigs: [validVaultConfig],
                connectionConfigs: [validConnectionConfig]
            });
            const updatedConnectionConfig = {
                connectionId: "CONN_ID",
                connectionUrl: "https://connection-two-url.com"
            };
            skyflow.updateConnectionConfig(updatedConnectionConfig);
            expect(skyflow.getConnectionConfig(updatedConnectionConfig.connectionId)).toStrictEqual(updatedConnectionConfig);
        });
    
        test('should throw error when updating a non-existing connection config', () => {
            const skyflow = new Skyflow({
                vaultConfigs: [validVaultConfig],
                connectionConfigs: [validConnectionConfig]
            });
            const updatedConnectionConfig = {
                connectionId: "CONN",
                connectionUrl: "https://connection-two-url.com"
            };
            expect(() => skyflow.updateConnectionConfig(updatedConnectionConfig)).toThrowError("CONN is missing from the config.");
        });
    
        test('should throw error when updating connection config with invalid id', () => {
            const skyflow = new Skyflow({
                vaultConfigs: [validVaultConfig],
                connectionConfigs: [validConnectionConfig]
            });
            const updatedConnectionConfig = {
                connectionUrl: "https://connection-two-url.com"
            };
            expect(() => skyflow.updateConnectionConfig(updatedConnectionConfig)).toThrowError("Invalid connection ID.");
        });
    
        test('should remove connection config', () => {
            const skyflow = new Skyflow({
                vaultConfigs: [validVaultConfig],
                connectionConfigs: [validConnectionConfig]
            });
            skyflow.removeConnectionConfig("CONN_ID");
            expect(() => skyflow.getConnectionConfig("CONN_ID")).toThrowError("CONN_ID is missing from the config.");
        });
    
        test('should return connection controller', () => {
            const skyflow = new Skyflow({
                vaultConfigs: [validVaultConfig],
                connectionConfigs: [validConnectionConfig]
            });
            expect(skyflow.connection("CONN_ID")).toBeTruthy();
        });
    });
    
});
