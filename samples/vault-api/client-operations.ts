import { 
    Credentials, 
    DeleteRequest, 
    Env, 
    LogLevel, 
    Skyflow, 
    VaultConfig, 
    SkyflowConfig, 
    SkyflowError, 
    DeleteResponse
} from 'skyflow-node';

/**
 * Skyflow Secure Data Deletion Example
 * 
 * This example demonstrates how to:
 * 1. Configure Bearer Token credentials
 * 2. Set up vault configuration
 * 3. Create a delete request
 * 4. Handle response and errors
 */
async function performSecureDataDeletion() {
    try {
        // Step 1: Configure Bearer Token Credentials
        const credentials: Credentials = {
            token: '<your_bearer_token>', // Bearer token
        };

        // Step 2: Configure Vault 
        const primaryVaultConfig: VaultConfig = {
            vaultId: '<your_vault_id1>',      // Primary vault
            clusterId: '<your_cluster_id1>',  // Cluster ID from your vault URL
            env: Env.PROD,                    // Deployment environment (PROD by default)
            credentials: credentials,         // Authentication method
        };

        // Step 3: Configure Skyflow Client
        const skyflowConfig: SkyflowConfig = {
            vaultConfigs: [primaryVaultConfig],
            logLevel: LogLevel.ERROR           // Logging verbosity
        };

        // Initialize Skyflow Client
        const skyflowClient : Skyflow = new Skyflow(skyflowConfig);

        // Step 4: Add Secondary Vault Configuration
        const secondaryVaultConfig: VaultConfig = {
            vaultId: '<your_vault_id2>',      // Secondary vault
            clusterId: '<your_cluster_id2>',  // Cluster ID from your vault URL
            env: Env.PROD,                    // Deployment environment
            // If credentials aren't specified, Skyflow credentials will be used
        };

        // Add secondary vault config on the fly
        skyflowClient.addVaultConfig(secondaryVaultConfig);

        // Step 5: Update Vault Configuration
        const updatedVaultConfig: VaultConfig = {
            vaultId: '<your_vault_id2>',      // Vault ID and cluster ID are unique
            clusterId: '<your_cluster_id2>',  // Cluster ID from your vault URL
            credentials: credentials,         // Update credentials
        };

        // Update vault config on the fly
        skyflowClient.updateVaultConfig(updatedVaultConfig);

        // Step 6: Prepare Delete Request
        const deleteIds: Array<string> = [
            'skyflow_id1',
            'skyflow_id2',
        ];

        const tableName: string = '<your_table_name>';  // Replace with actual table name

        const deleteRequest: DeleteRequest = new DeleteRequest(
            tableName,
            deleteIds,
        );

        // Step 7: Perform Secure Deletion on Secondary Vault
        const response: DeleteResponse = await skyflowClient
            .vault('<your_vault_id2>') // Specify vault ID
            .delete(deleteRequest);

        // Handle Successful Response
        console.log('Deletion successful:', response);

        // Step 8: Remove Secondary Vault Configuration
        skyflowClient.removeVaultConfig('<your_vault_id1>');  // Remove vault configuration

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

// Invoke the secure data deletion function
performSecureDataDeletion();
