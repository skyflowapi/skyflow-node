import { 
    Env, 
    GetOptions, 
    LogLevel, 
    Skyflow, 
    GetColumnRequest, 
    Credentials, 
    SkyflowConfig, 
    VaultConfig, 
    SkyflowError 
} from 'skyflow-node';

/**
 * Skyflow Secure Column-Based Retrieval Example
 * 
 * This example demonstrates how to:
 * 1. Configure Skyflow client credentials
 * 2. Set up vault configuration
 * 3. Create a column-based get request
 * 4. Handle response and errors
 */
async function performSecureColumnRetrieval() {
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
        const skyflowClient = new Skyflow(skyflowConfig);

        // Step 4: Prepare Column-Based Retrieval Data
        const columnValues: string[] = [
            'value1', // Example Unique Column value 1
            'value2', // Example Unique Column value 2
        ];
        const tableName = 'table-name';          // Replace with your actual table name
        const columnName = 'column-name';       // Column name configured as unique in the schema

        // Step 5: Create Get Column Request
        const getRequest = new GetColumnRequest(
            tableName,
            columnName,
            columnValues // Column values of the records to return
        );

        // Step 6: Configure Get Options
        const getOptions = new GetOptions();
        getOptions.setReturnTokens(true); // Optional: Get tokens for retrieved data

        // Step 7: Perform Secure Retrieval
        const response = await skyflowClient
            .vault(primaryVaultConfig.vaultId)
            .get(getRequest, getOptions);

        // Handle Successful Response
        console.log('Column-based retrieval successful:', response);

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

// Invoke the secure column retrieval function
performSecureColumnRetrieval();
