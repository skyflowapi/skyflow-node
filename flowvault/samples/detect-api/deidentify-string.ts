import {
    Credentials,
    Env,
    LogLevel,
    Skyflow,
    SkyflowConfig,
    VaultConfig,
    SkyflowError,
    DeidentifyStringRequest,
    DeidentifyStringResponse,
    DetectConfiguration,
    EntityType,
    DeidentificationType,
    ReturnEntitiesType,
} from 'skyflow-flowvault-node';

/**
 * Skyflow Detect: de-identify a string
 *
 * This example demonstrates how to:
 * 1. Configure credentials and a vault
 * 2. De-identify text with a stored Detect configuration
 * 3. De-identify text with an inline Detect configuration
 * 4. Read the processed text, detected entities and metrics
 * 5. Handle errors
 */
async function performDeidentifyString() {
    try {
        // Step 1: Configure credentials
        const credentials: Credentials = {
            path: 'path-to-credentials-json', // Path to credentials file
        };

        // Step 2: Configure the vault
        const primaryVaultConfig: VaultConfig = {
            vaultId: '<VAULT_ID>',      // Unique vault identifier
            clusterId: '<CLUSTER_ID>',  // From the vault URL
            env: Env.PROD,              // Deployment environment
            credentials: credentials,   // Authentication method
        };

        // Step 3: Configure and initialize the Skyflow client
        const skyflowConfig: SkyflowConfig = {
            vaultConfigs: [primaryVaultConfig],
            logLevel: LogLevel.INFO,    // Recommended to use LogLevel.ERROR in production
        };
        const skyflowClient: Skyflow = new Skyflow(skyflowConfig);

        const text = 'My name is John Doe, and my email is johndoe@acme.com.';

        // Step 4: De-identify with a stored configuration (created through the management API)
        const storedRequest = new DeidentifyStringRequest(text, {
            configurationId: '<CONFIGURATION_ID>',
        });
        const storedResponse: DeidentifyStringResponse = await skyflowClient
            .detect(primaryVaultConfig.vaultId)
            .deidentifyString(storedRequest);
        console.log('Processed text (stored configuration):', storedResponse.processedText);
        // My name is [NAME_1], and my email is [EMAIL_ADDRESS_1].

        // Step 5: De-identify with an inline configuration
        const configuration: DetectConfiguration = {
            detect: {
                entities: [
                    {
                        entityType: EntityType.NAME,
                        deidentificationType: DeidentificationType.VAULT_TOKEN,
                        destination: '<TOKEN_GROUP_NAME>', // token group that stores the value; must exist
                    },
                    {
                        entityType: EntityType.ALL,
                        deidentificationType: DeidentificationType.ENTITY_UNIQUE_COUNTER,
                    },
                ],
                skip: ['Skyflow'],                                   // never treat these matches as sensitive
                returnEntities: ReturnEntitiesType.EXCLUDE_SENSITIVE_DATA,
            },
        };
        const inlineRequest = new DeidentifyStringRequest(text, { configuration });
        const inlineResponse = await skyflowClient
            .detect(primaryVaultConfig.vaultId)
            .deidentifyString(inlineRequest);

        console.log('Processed text (inline configuration):', inlineResponse.processedText);
        for (const entity of inlineResponse.entities) {
            console.log(
                `${entity.entityType} -> ${entity.token} [${entity.location?.startIndex}, ${entity.location?.endIndex}]`,
            );
        }
        console.log('Word count:', inlineResponse.metrics?.wordCount);
    } catch (error) {
        // Comprehensive error handling
        if (error instanceof SkyflowError) {
            console.error('Skyflow Specific Error:', {
                httpCode: error.error?.httpCode,
                grpcCode: error.error?.grpcCode,
                httpStatus: error.error?.httpStatus,
                message: error.message,
                details: error.error?.details,
                requestId: error.error?.requestId,
            });
        } else {
            console.error('Unexpected Error:', error);
        }
    }
}

// Invoke the de-identify string function
performDeidentifyString();
