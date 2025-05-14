import { 
    Credentials, 
    Env, 
    LogLevel, 
    Skyflow, 
    SkyflowConfig, 
    VaultConfig, 
    SkyflowError, 
    GetDetectRunRequest,
    DeidentifyFileResponse
} from 'skyflow-node';

/**
 * Skyflow Get Detect Run Example
 * 
 * This example demonstrates how to:
 * 1. Configure credentials
 * 2. Set up vault configuration
 * 3. Create a get detect run request
 * 4. Call getDetectRun to poll for file processing results
 * 5. Handle response and errors
 */

async function performGetDetectRun() {
    try {
        // Step 1: Configure Credentials
        const credentials: Credentials = {
            path: 'path-to-credentials-json', // Path to credentials file
        };

        // Step 2: Configure Vault 
        const primaryVaultConfig: VaultConfig = {
            vaultId: '<VAULT_ID>',          // Unique vault identifier
            clusterId: '<CLUSTER_ID>',      // From vault URL
            env: Env.PROD,                   // Deployment environment
            credentials: credentials        // Authentication method
        };

        // Step 3: Configure Skyflow Client
        const skyflowConfig: SkyflowConfig = {
            vaultConfigs: [primaryVaultConfig],
            logLevel: LogLevel.INFO,        // Logging verbosity
        };

        // Initialize Skyflow Client
        const skyflowClient: Skyflow = new Skyflow(skyflowConfig);

        // Step 4: Prepare GetDetectRunRequest
        const getDetectRunRequest = new GetDetectRunRequest(
            '<RUN_ID_FROM_DEIDENTIFY_FILE>', // Replace with the runId from deidentifyFile call
        );

        // Step 5: Call getDetectRun API
        const response: DeidentifyFileResponse = await skyflowClient
            .detect(primaryVaultConfig.vaultId)
            .getDetectRun(getDetectRunRequest);

        // Handle Successful Response
        console.log('Get Detect Run Response:', response);

    } catch (error) {
        // Comprehensive Error Handling
        if (error instanceof SkyflowError) {
            console.error('Skyflow Specific Error:', {
                code: error.error?.http_code,
                message: error.message,
                details: error.error?.details,
            });
        } else {
            console.error('Unexpected Error:', JSON.stringify(error));
        }
    }
}

// Invoke the get detect run function
performGetDetectRun();