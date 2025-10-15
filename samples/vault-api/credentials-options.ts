import { 
    Credentials, 
    DeleteRequest, 
    Env, 
    LogLevel, 
    Skyflow, 
    VaultConfig, 
    SkyflowConfig,
    SkyflowError, 
    DeleteResponse,
    StringCredentials
} from 'skyflow-node';

/**
 * Skyflow Secure Data Deletion Example
 * 
 * This example demonstrates how to:
 * 1. Configure Skyflow client credentials
 * 2. Set up vault configurations
 * 3. Create and perform delete requests
 * 4. Handle response and errors
 */
async function performSecureDataDeletion() {
    try {
        // Step 1: Configure Skyflow client Credentials
        const cred:  Record<string, string> = {
            clientID: '<your-client-id>',       // Client identifier
            clientName: '<your-client-name>',   // Client name
            keyID: '<your-key-id>',             // Key identifier
            tokenURI: '<your-token-uri>',       // Token URI
            privateKey: '<your-pem-private-key>' // Private key for authentication
        };

        const stringCredentials: StringCredentials = {
            credentialsString: JSON.stringify(cred), // Credentials string
        }

        const skyflowCredentials: Credentials = stringCredentials;

        const credentials: Credentials = {
            token: '<your_bearer_token>', // Bearer token
            // apiKey: '<your_api_key>', // Uncomment to use API key
            // path: 'path_to_credentials_json', // Path to credentials file
            // credentialsString: 'your_credentials_string', // Credentials as string
        };

        // Step 2: Configure Vaults
        const primaryVaultConfig: VaultConfig = {
            vaultId: '<your_vault_id>',      // Primary vault
            clusterId: '<your_cluster_id>',  // Cluster ID from your vault URL
            env: Env.PROD,                   // Deployment environment (PROD by default)
        };

        const secondaryVaultConfig: VaultConfig = {
            vaultId: '<your_secondary_vault_id>',      // Secondary vault
            clusterId: '<your_secondary_cluster_id>',  // Cluster ID from your vault URL
            env: Env.PROD,                           // Deployment environment
            credentials: credentials,                // Use credentials if specified
        };

        // Step 3: Configure Skyflow Client
        const skyflowConfig: SkyflowConfig = {
            vaultConfigs: [primaryVaultConfig, secondaryVaultConfig], // Vault configurations
            skyflowCredentials: skyflowCredentials, // Used if no individual credentials are passed
            logLevel: LogLevel.ERROR,   // Set log level (ERROR in this case)
        };

        // Initialize Skyflow Client
        const skyflowClient: Skyflow = new Skyflow(skyflowConfig);

        // Step 4: Prepare Delete Request for Primary Vault
        const primaryDeleteIds: Array<string> = [
            'skyflow_id1',
            'skyflow_id2',
            'skyflow_id3',
        ];

        const primaryTableName: string = '<primary_table_name>';   // Replace with actual table name

        const primaryDeleteRequest: DeleteRequest = new DeleteRequest(
            primaryTableName,
            primaryDeleteIds,
        );

        // Perform Delete Operation for Primary Vault
        const primaryDeleteResponse: DeleteResponse = await skyflowClient
            .vault('<your_vault_id>')  // Specify the primary vault ID
            .delete(primaryDeleteRequest);

        // Handle Successful Response
        console.log('Primary Vault Deletion Successful:', primaryDeleteResponse);

        // Step 5: Prepare Delete Request for Secondary Vault
        const secondaryDeleteIds: Array<string> = [
            'skyflow_id4',
            'skyflow_id5',
            'skyflow_id6',
        ];

        const secondaryTableName: string = '<secondary_table_name>'; // Replace with actual table name

        const secondaryDeleteRequest: DeleteRequest = new DeleteRequest(
            secondaryTableName,
            secondaryDeleteIds,
        );

        // Perform Delete Operation for Secondary Vault
        const secondaryDeleteResponse: DeleteResponse = await skyflowClient
            .vault('<your_secondary_vault_id>')  // Specify the secondary vault ID
            .delete(secondaryDeleteRequest);

        // Handle Successful Response
        console.log('Secondary Vault Deletion Successful:', secondaryDeleteResponse);

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
