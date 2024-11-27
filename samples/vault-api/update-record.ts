import { 
    Credentials, 
    Env, 
    LogLevel, 
    Skyflow, 
    VaultConfig, 
    SkyflowConfig, 
    UpdateRequest, 
    UpdateOptions, 
    UpdateResponse, 
    SkyflowError 
} from 'skyflow-node';

/**
 * Skyflow Secure Data Update Example
 * 
 * This example demonstrates how to:
 * 1. Configure Skyflow client credentials
 * 2. Set up vault configuration
 * 3. Create an update request
 * 4. Handle response and errors
 */
async function performSecureDataUpdate() {
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

        // Step 4: Prepare Update Data
        const updateData = {
            skyflowId: 'your-skyflow-id',          // Skyflow ID of the record to update
            card_number: '1234567890123456'        // Updated sensitive data
        };

        // Step 5: Create Update Request
        const updateReq = new UpdateRequest(
            'sensitive_data_table',               // Replace with your actual table name
            updateData
        );

        // Step 6: Configure Update Options
        const updateOptions = new UpdateOptions();
        updateOptions.setReturnTokens(true);      // Optional: Get tokens for updated data

        // Step 7: Perform Secure Update
        const response: UpdateResponse = await skyflowClient
            .vault(primaryVaultConfig.vaultId)
            .update(updateReq, updateOptions);

        // Handle Successful Response
        console.log('Update successful:', response);

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

// Invoke the secure data update function
performSecureDataUpdate();
