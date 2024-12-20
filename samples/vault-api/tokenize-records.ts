import { 
    Credentials, 
    Env, 
    LogLevel, 
    Skyflow, 
    SkyflowConfig, 
    TokenizeRequest, 
    VaultConfig, 
    TokenizeRequestType, 
    TokenizeResponse, 
    SkyflowError 
} from 'skyflow-node';

/**
 * Skyflow Tokenization Example
 * 
 * This example demonstrates how to:
 * 1. Configure credentials
 * 2. Set up vault configuration
 * 3. Tokenize sensitive data
 * 4. Handle response and errors
 */
async function executeTokenization() {
    try {
        // Step 1: Configure Credentials
        const credentials: Credentials = {
            apiKey: '<your-api-key>', // API key for authentication
        };

        // Step 2: Configure Vault
        const primaryVaultConfig: VaultConfig = {
            vaultId: '<your-vault-id>',          // Unique vault identifier
            clusterId: '<your-cluster-id>',      // From vault URL
            env: Env.PROD,                       // Deployment environment
            credentials: credentials             // Authentication method
        };

        // Step 3: Configure Skyflow Client
        const skyflowConfig: SkyflowConfig = {
            vaultConfigs: [primaryVaultConfig],
            logLevel: LogLevel.ERROR,               // Logging verbosity
        };

        // Initialize Skyflow Client
        const skyflowClient: Skyflow = new Skyflow(skyflowConfig);

        // Step 4: Prepare Tokenization Data
        const tokenizeValues: Array<TokenizeRequestType> = [
            { value: '4111111111111111', columnGroup: 'card_number_cg' },
            { value: '4242424242424242', columnGroup: 'card_number_cg' }
        ];

        const tokenReq: TokenizeRequest = new TokenizeRequest(tokenizeValues);

        // Step 5: Execute Tokenization
        const response: TokenizeResponse = await skyflowClient
            .vault(primaryVaultConfig.vaultId)
            .tokenize(tokenReq);

        // Handle Successful Response
        console.log('Tokenization Result:', response);

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

// Invoke the tokenization function
executeTokenization();
