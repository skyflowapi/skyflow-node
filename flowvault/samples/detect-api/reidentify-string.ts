import {
    Credentials,
    Env,
    LogLevel,
    Skyflow,
    SkyflowConfig,
    VaultConfig,
    SkyflowError,
    ReidentifyStringRequest,
    ReidentifyStringResponse,
} from 'skyflow-flowvault-node';

/**
 * Skyflow Detect: re-identify a string
 *
 * Re-identification looks tokens up in the vault, so it applies to values that were
 * de-identified with VAULT_TOKEN. This example demonstrates how to:
 * 1. Configure credentials and a vault
 * 2. Re-identify tokenized text, restoring the original values
 * 3. Apply redaction rules so some entities come back masked or redacted
 * 4. Handle errors
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

        const tokenizedText = 'My name is [NAME_1], and my SSN is [SSN_1].';

        // Step 4: Without rules every token is replaced by its original value
        const plainRequest = new ReidentifyStringRequest(tokenizedText);
        const plainResponse: ReidentifyStringResponse = await skyflowClient
            .detect(primaryVaultConfig.vaultId)
            .reidentifyString(plainRequest);
        console.log('Re-identified text:', plainResponse.processedText);

        // Step 5: Redaction rules. Each rule targets a token group and applies a redaction pattern configured in the vault.
        const redactedRequest = new ReidentifyStringRequest(tokenizedText, {
            redactionLevel: [
                { tokenGroupName: '<TOKEN_GROUP_NAME>', redactionPattern: '<REDACTION_PATTERN>' },
                { tokenGroupName: '<OTHER_TOKEN_GROUP_NAME>', redactionPattern: '<OTHER_REDACTION_PATTERN>' },
            ],
        });
        const redactedResponse = await skyflowClient
            .detect(primaryVaultConfig.vaultId)
            .reidentifyString(redactedRequest);
        console.log('Re-identified text with redaction rules:', redactedResponse.processedText);
        console.log('Character count:', redactedResponse.metrics?.characterCount);
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

// Invoke the re-identify string function
performReidentifyString();
