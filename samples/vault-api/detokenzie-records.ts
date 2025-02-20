import { 
    Credentials, 
    DetokenizeOptions, 
    DetokenizeRequest, 
    DetokenizeResponse, 
    Env, 
    LogLevel, 
    RedactionType, 
    Skyflow, 
    SkyflowError, 
    VaultConfig, 
    SkyflowConfig, 
    DetokenizeData
} from 'skyflow-node';

/**
 * Skyflow Detokenization Example
 * 
 * This example demonstrates how to:
 * 1. Configure credentials
 * 2. Set up vault configuration
 * 3. Create a detokenization request
 * 4. Handle response and errors
 */
async function performDetokenization() {
    try {
        // Step 1: Configure Credentials
        const credentials: Credentials = {
            token: 'token', // Bearer token for authentication
        };

        // Step 2: Configure Vault
        const primaryVaultConfig: VaultConfig = {
            vaultId: 'your-vault-id',          // Unique vault identifier
            clusterId: 'your-cluster-id',      // From vault URL
            env: Env.PROD,                     // Deployment environment
            credentials: credentials           // Authentication method
        };

        // Step 3: Configure Skyflow Client
        const skyflowConfig: SkyflowConfig = {
            vaultConfigs: [primaryVaultConfig],
            logLevel: LogLevel.ERROR,               // Logging verbosity
        };

        // Initialize Skyflow Client
        const skyflowClient: Skyflow = new Skyflow(skyflowConfig);

        // Step 4: Prepare Detokenization Data
        const detokenizeData: DetokenizeData[] = [
            {
              token: "token1",                          // Token to be detokenized
              redactionType: RedactionType.PLAIN_TEXT,  // Redaction type
            },
            {
              token: "token2",                         // Token to be detokenized 
              redactionType: RedactionType.MASKED,     // Redaction type
            },
          ]; 

        // Create Detokenize Request
        const detokenizeRequest: DetokenizeRequest = new DetokenizeRequest(
            detokenizeData
        );

        // Configure Detokenize Options
        const detokenizeOptions: DetokenizeOptions = new DetokenizeOptions();
        detokenizeOptions.setContinueOnError(true); // Continue processing on errors
        detokenizeOptions.setDownloadURL(false);   // Disable download URL generation

        // Step 5: Perform Detokenization
        const response: DetokenizeResponse = await skyflowClient
            .vault(primaryVaultConfig.vaultId)
            .detokenize(detokenizeRequest, detokenizeOptions);

        // Handle Successful Response
        console.log('Detokenization successful:', response);

    } catch (error) {
        // Comprehensive Error Handling
        if (error instanceof SkyflowError) {
            console.error('Skyflow Specific Error:', {
                code: error.error?.http_code,
                message: error.message,
                details: error.error?.details,
            });
        } else {
            console.error('Unexpected Error:', error);
        }
    }
}

// Invoke the detokenization function
performDetokenization();
