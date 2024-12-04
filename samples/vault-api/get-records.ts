import { 
    Credentials, 
    Env, 
    GetOptions, 
    GetRequest, 
    LogLevel, 
    Skyflow, 
    VaultConfig, 
    SkyflowConfig, 
    SkyflowError, 
    GetResponse
} from 'skyflow-node';

/**
 * Skyflow Secure Data Retrieval Example
 * 
 * This example demonstrates how to:
 * 1. Configure Skyflow client credentials
 * 2. Set up vault configuration
 * 3. Create a get request
 * 4. Handle response and errors
 */
async function performSecureDataRetrieval() {
    try {
        // Step 1: Configure Credentials
        const cred: object = {
            clientID: '<your-client-id>',       // Client identifier
            clientName: '<your-client-name>',   // Client name
            keyID: '<your-key-id>',             // Key identifier
            tokenURI: '<your-token-uri>',       // Token URI
            privateKey: '<your-pem-private-key>' // Private key for authentication
        };

        const skyflowCredentials: Credentials = {
            credentialsString: JSON.stringify(cred), // Token credentials
        };

        const credentials: Credentials = {
            path: 'path-to-credentials-json', // Path to credentials file
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
            skyflowCredentials: skyflowCredentials, // Used if no individual credentials are passed
            logLevel: LogLevel.ERROR,               // Logging verbosity
        };

        // Initialize Skyflow Client
        const skyflowClient: Skyflow = new Skyflow(skyflowConfig);

        // Step 4: Prepare Retrieval Data
        const getIds: Array<string> = [
            'skyflow-id1',
            'skyflow-id2',
        ];

        // Step 5: Create Get Request
        const getRequest: GetRequest = new GetRequest(
            'sensitive_data_table',  // Replace with your actual table name
            getIds
        );

        // Step 6: Configure Get Options
        const getOptions: GetOptions = new GetOptions();
        getOptions.setReturnTokens(true); // Optional: Get tokens for retrieved data

        // Step 7: Perform Secure Retrieval
        const response: GetResponse = await skyflowClient
            .vault(primaryVaultConfig.vaultId)
            .get(getRequest, getOptions);

        // Handle Successful Response
        console.log('Data retrieval successful:', response);

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

// Invoke the secure data retrieval function
performSecureDataRetrieval();
