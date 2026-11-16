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
    ReidentifyStringRequest,
    ReidentifyStringResponse,
    EntityType,
    DeidentificationType,
    RedactionType,
} from 'skyflow-node';

/**
 * Skyflow Detect: the de-identify / re-identify round trip
 *
 * Re-identification looks tokens up in the vault, so it applies only to values that were
 * de-identified with VAULT_TOKEN. Such a token looks like [NAME_daa78453-9ca9-4ba5-a3ef-91934c11196c];
 * counter placeholders such as [NAME_1] are never stored and cannot be re-identified.
 * This example demonstrates how to:
 * 1. Configure credentials and a vault
 * 2. De-identify text with VAULT_TOKEN so the values are stored in a table.column
 * 3. Re-identify the tokenized text, restoring the original values
 * 4. Apply redaction rules so some entities come back masked
 * 5. Handle errors
 */
async function performReidentifyString() {
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

        // Step 4: De-identify with VAULT_TOKEN. Each value is stored in <TABLE>.<COLUMN> (a column with
        // tokenization enabled) and replaced by its vault token.
        const deidentifyRequest = new DeidentifyStringRequest(
            'My name is John Doe and my email is johndoe@acme.com.',
            {
                configuration: {
                    detect: {
                        entities: [
                            {
                                entityType: EntityType.NAME,
                                deidentificationType: DeidentificationType.VAULT_TOKEN,
                                destination: '<TABLE>.<COLUMN>', // Replace with table.column
                            },
                            {
                                entityType: EntityType.EMAIL_ADDRESS,
                                deidentificationType: DeidentificationType.VAULT_TOKEN,
                                destination: '<TABLE>.<COLUMN>', // Replace with table.column
                            },
                        ],
                    },
                },
            },
        );
        const deidentified: DeidentifyStringResponse = await skyflowClient
            .detect(primaryVaultConfig.vaultId)
            .deidentifyString(deidentifyRequest);
        const tokenizedText = deidentified.processedText ?? '';
        console.log('De-identified text:', tokenizedText);
        // My name is [NAME_daa78453-9ca9-4ba5-a3ef-91934c11196c] and my email is [EMAIL_ADDRESS_3f0c...].

        // Step 5: Without rules every vault token is replaced by its original value
        const plainRequest = new ReidentifyStringRequest(tokenizedText);
        const plainResponse: ReidentifyStringResponse = await skyflowClient
            .detect(primaryVaultConfig.vaultId)
            .reidentifyString(plainRequest);
        console.log('Re-identified text:', plainResponse.processedText);

        // Step 6: Redaction rules. Each rule names an entity type and how to render it
        // (PLAIN_TEXT, MASKED or REDACTED).
        const redactedRequest = new ReidentifyStringRequest(tokenizedText, {
            redactionLevel: [
                { entityName: EntityType.NAME, redactionType: RedactionType.PLAIN_TEXT },
                { entityName: EntityType.EMAIL_ADDRESS, redactionType: RedactionType.MASKED },
            ],
        });
        const redactedResponse = await skyflowClient
            .detect(primaryVaultConfig.vaultId)
            .reidentifyString(redactedRequest);
        console.log('Re-identified text with redaction rules:', redactedResponse.processedText);
        // My name is John Doe and my email is j*******@acme.com.
        console.log('Character count:', redactedResponse.metrics?.characterCount);
    } catch (error) {
        // Comprehensive error handling. Quote the request id when contacting Skyflow support.
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

// Invoke the round trip
performReidentifyString();
