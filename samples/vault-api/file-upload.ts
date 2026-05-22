// Please use Node version 20 & above to run file upload
import { 
    Credentials, 
    Env, 
    FileUploadRequest, 
    LogLevel, 
    Skyflow, 
    SkyflowConfig, 
    VaultConfig, 
    SkyflowError, 
    FileUploadResponse,
    FileUploadOptions
} from 'skyflow-node';
import * as fs from 'fs';

/**
 * Skyflow File Upload Example
 * 
 * This example demonstrates how to:
 * 1. Configure credentials
 * 2. Set up vault configuration
 * 3. Create a file upload request
 * 4. Handle response and errors
 * 
 * Note: File upload requires Node version 20 or above.
 */
async function performFileUpload() {
    try {
        // Step 1: Configure Credentials
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
            logLevel: LogLevel.ERROR,               // Logging verbosity
        };

        // Initialize Skyflow Client
        const skyflowClient: Skyflow = new Skyflow(skyflowConfig);

        // Step 4: Prepare File Upload Data
        const tableName: string = 'table-name';      // Table name
        const skyflowId: string = 'skyflow-id';      // Skyflow ID of the record
        const columnName: string = 'column-name';    // Column name to store file
        const filePath: string = 'file-path';        // Path to the file for upload

        // Step 5: Create File Upload Request (SK-2812: 2-arg constructor, skyflowId moved to options)
        const uploadReq: FileUploadRequest = new FileUploadRequest(
            tableName,
            columnName,
        );

        // Step 6: Configure FileUpload Options
        const uploadOptions: FileUploadOptions = new FileUploadOptions();
        uploadOptions.setSkyflowId(skyflowId); // SK-2812: new API
        uploadOptions.setFilePath(filePath);

        // Step 6: Perform File Upload
        const response: FileUploadResponse = await skyflowClient
            .vault(primaryVaultConfig.vaultId)
            .uploadFile(uploadReq, uploadOptions);

        // Handle Successful Response
        console.log('File upload successful:', response);

    } catch (error) {
        // Comprehensive Error Handling
        if (error instanceof SkyflowError) {
            console.error('Skyflow Specific Error:', {
                httpCode: error.error?.httpCode,
                grpcCode: error.error?.grpcCode,
                httpStatus: error.error?.httpStatus,
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
