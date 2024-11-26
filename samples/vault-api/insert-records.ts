import { 
    Credentials, 
    Env, 
    InsertOptions, 
    InsertRequest, 
    LogLevel, 
    Skyflow, 
    VaultConfig, 
    SkyflowConfig,
    SkyflowError 
} from 'skyflow-node';

/**
 * Skyflow Secure Data Insertion Example
 * 
 * This example demonstrates how to:
 * 1. Configure Skyflow client credentials
 * 2. Set up vault configuration
 * 3. Create an insert request
 * 4. Handle response and errors
 */
async function performSecureDataInsertion() {
    try {
        // Step 1: Configure Credentials
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
            logLevel: LogLevel.INFO            // Logging verbosity
        };

        // Initialize Skyflow Client
        const skyflowClient = new Skyflow(skyflowConfig);

        // Step 4: Prepare Insertion Data
        const insertData = [
            { card_number: '4111111111111112' }  // Example sensitive data
        ];

        // Step 5: Create Insert Request
        const insertReq = new InsertRequest(
            'sensitive_data_table',  // Replace with your actual table name
            insertData
        );

        // Step 6: Configure Insertion Options
        const insertOptions = new InsertOptions();
        insertOptions.setReturnTokens(true);  // Optional: Get tokens for inserted data
        // insertOptions.setContinueOnError(true);  // Optional: Continue on partial errors

        // Step 7: Perform Secure Insertion
        const response = await skyflowClient
            .vault(primaryVaultConfig.vaultId)
            .insert(insertReq, insertOptions);
        
        // Handle Successful Response
        console.log('Insertion successful:', response);

    } catch (error) {
        // Comprehensive Error Handling
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
performSecureDataInsertion();
