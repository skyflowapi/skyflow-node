import { 
    TokenMode, 
    Credentials, 
    Env, 
    InsertOptions, 
    InsertRequest, 
    LogLevel, 
    Skyflow, 
    VaultConfig, 
    SkyflowConfig, 
    InsertResponse, 
    SkyflowError 
} from 'skyflow-node';

/**
 * Skyflow Insert with BYOT Example
 * 
 * This example demonstrates:
 * 1. Configuring credentials
 * 2. Setting up vault configuration
 * 3. Utilizing Bring Your Own Token (BYOT) during insertion
 * 4. Handling responses and errors
 */
async function performSecureDataInsertionWithBYOT() {
    try {
        // Step 1: Configure Credentials
        const credentials: Credentials = {
            token: 'bearer', // Bearer token authentication
        };

        // Step 2: Configure Vault
        const primaryVaultConfig: VaultConfig = {
            vaultId: 'your-vault-id',               // Unique vault identifier
            clusterId: 'your-cluster-id',           // Cluster ID from vault URL
            env: Env.PROD,                          // Deployment environment
            credentials: credentials                // Authentication method
        };

        // Step 3: Configure Skyflow Client
        const skyflowConfig: SkyflowConfig = {
            vaultConfigs: [primaryVaultConfig],
            logLevel: LogLevel.INFO                 // Logging verbosity
        };

        // Initialize Skyflow Client
        const skyflowClient = new Skyflow(skyflowConfig);

        // Step 4: Prepare Insertion Data
        const insertData: Array<object> = [
            { card_number: 'skyflow_id1', card_cvv: 'skyflow_id2' },
        ];

        const tableName: string = 'your-table-name';
        const insertReq: InsertRequest = new InsertRequest(tableName, insertData);

        // Step 5: BYOT Configuration
        const tokens: Array<object> = [
            { card_number: 'token1', card_cvv: 'token2' },
        ];

        const insertOptions: InsertOptions = new InsertOptions();
        insertOptions.setReturnTokens(true);        // Optionally get tokens for inserted data
        insertOptions.setTokenMode(TokenMode.ENABLE);    // Enable Bring Your Own Token (BYOT)
        insertOptions.setTokens(tokens);           // Specify tokens to use for BYOT
        // insertOptions.setContinueOnError(true); // Optionally continue on partial errors

        // Step 6: Perform Secure Insertion
        const response: InsertResponse = await skyflowClient
            .vault(primaryVaultConfig.vaultId)
            .insert(insertReq, insertOptions);

        // Handle Successful Response
        console.log('Insertion Successful:', response);

    } catch (error) {
        // Step 7: Comprehensive Error Handling
        if (error instanceof SkyflowError) {
            console.error('Skyflow Specific Error:', {
                code: error.error?.http_code,
                message: error.message,
                details: error.error?.details
            });
        } else {
            console.error('Unexpected Error:', error);
        }
    }
}

// Invoke the secure data insertion function
performSecureDataInsertionWithBYOT();
