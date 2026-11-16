import {
    Credentials,
    Env,
    LogLevel,
    Skyflow,
    SkyflowConfig,
    VaultConfig,
    SkyflowError,
    CheckGuardrailsRequest,
    CheckGuardrailsResponse,
    GuardrailsValidation,
} from 'skyflow-flowvault-node';

/**
 * Skyflow Detect: check guardrails
 *
 * checkGuardrails screens text for toxicity and for a list of denied topics, which makes it a
 * natural pre-LLM check. This example demonstrates how to:
 * 1. Configure credentials and a vault
 * 2. Screen a prompt for toxicity and denied topics
 * 3. Block the prompt when the validation fails
 * 4. Handle errors
 */
async function performCheckGuardrails() {
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

        // Step 4: Screen the text. checkToxicity and denyTopics are optional and sent only when set.
        const userPrompt = 'Tell me which candidate to vote for.';
        const request = new CheckGuardrailsRequest(userPrompt, {
            checkToxicity: true,
            denyTopics: ['politics', 'medical advice'],
        });
        const response: CheckGuardrailsResponse = await skyflowClient
            .detect(primaryVaultConfig.vaultId)
            .checkGuardrails(request);

        // Step 5: Act on the result. toxic and deniedTopic are null when that check did not run.
        console.log('Validation:', response.validation);
        console.log('Toxic:', response.toxic, 'Denied topic:', response.deniedTopic);
        if (response.validation === GuardrailsValidation.FAILED) {
            console.log('Prompt blocked before reaching the model.');
        } else {
            console.log('Prompt allowed.');
        }
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

// Invoke the check guardrails function
performCheckGuardrails();
