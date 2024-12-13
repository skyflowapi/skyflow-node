import { 
    Credentials, 
    DeleteRequest, 
    DeleteResponse, 
    Env, 
    LogLevel, 
    Skyflow, 
    SkyflowConfig, 
    VaultConfig, 
    SkyflowError 
} from 'skyflow-node';

/**
 * Skyflow Delete Records Example
 * 
 * This example demonstrates how to:
 * 1. Configure credentials
 * 2. Set up vault configuration
 * 3. Create a delete request
 * 4. Handle response and errors
 */
async function performDeletion() {
    try {
        // Step 1: Configure Credentials
        const credentials: Credentials = {
            apiKey: 'your-skyflow-api-key', // API key for authentication
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

        // Step 4: Prepare Delete Data
        const deleteIds: Array<string> = ['skyflow_id1', 'skyflow_id2', 'skyflow_id3']; // Record IDs to delete
        const tableName: string = 'sensitive_data_table'; // Table name in the vault schema

        // Create Delete Request
        const deleteRequest: DeleteRequest = new DeleteRequest(
            tableName,
            deleteIds
        );

        // Step 5: Perform Deletion
        const response: DeleteResponse = await skyflowClient
            .vault(primaryVaultConfig.vaultId)
            .delete(deleteRequest);

        // Handle Successful Response
        console.log('Deletion successful:', response);

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

// Invoke the deletion function
performDeletion();
