// Please use Node.js version 18 & above to run file upload
import { 
    Credentials, 
    Env, 
    FileUploadRequest, 
    LogLevel, 
    Skyflow, 
    SkyflowConfig, 
    VaultConfig, 
    SkyflowError 
} from 'skyflow-node';

/**
 * Skyflow File Upload Example
 * 
 * This example demonstrates how to:
 * 1. Configure Skyflow client credentials
 * 2. Set up vault configuration
 * 3. Create a file upload request
 * 4. Handle response and errors
 */
async function performFileUpload() {
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

        // Step 4: Prepare File Upload Data
        const tableName = 'table-name';      // Table name
        const skyflowId = 'skyflow-id';      // Skyflow ID of the record
        const columnName = 'column-name';    // Column name to store file
        const filePath = 'file-path';        // Path to the file for upload

        // Step 5: Create File Upload Request
        const uploadReq = new FileUploadRequest(
            tableName,
            skyflowId,
            columnName,
            filePath
        );

        // Step 6: Perform File Upload
        const response = await skyflowClient
            .vault(primaryVaultConfig.vaultId)
            .uploadFile(uploadReq);

        // Handle Successful Response
        console.log('File upload successful:', response);

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

// Invoke the file upload function
performFileUpload();
