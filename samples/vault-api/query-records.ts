import { 
    Credentials, 
    Env, 
    LogLevel, 
    QueryRequest, 
    QueryResponse, 
    Skyflow, 
    SkyflowConfig, 
    SkyflowError, 
    VaultConfig 
} from 'skyflow-node';

/**
 * Skyflow Query Example
 * 
 * This example demonstrates how to:
 * 1. Configure Skyflow client credentials
 * 2. Set up vault configuration
 * 3. Execute a query on the vault
 * 4. Handle response and errors
 */
async function executeQuery() {
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
            // Using API Key authentication
            apiKey: 'your-skyflow-api-key',
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
        const skyflowClient = new Skyflow(skyflowConfig);

        // Step 4: Prepare Query
        const query = 'select * from table_name limit 1'; // Example query
        const queryRequest = new QueryRequest(query);

        // Step 5: Execute Query
        const response: QueryResponse = await skyflowClient
            .vault(primaryVaultConfig.vaultId)
            .query(queryRequest);

        // Handle Successful Response
        console.log('Query Result:', response);

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

// Invoke the query function
executeQuery();
