// Please use Node.js version 18 & above to run file upload
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

        // Step 5: Create File Upload Request
        const uploadReq: FileUploadRequest = new FileUploadRequest(
            tableName,
            skyflowId,
            columnName,
        );

        // Step 6: Configure FileUpload Options
        const uploadOptions: FileUploadOptions = new FileUploadOptions();
        // Set any one of FilePath, Base64 or FileObject in FileUploadOptions

        // uploadOptions.setFilePath(filePath);      // Set the file path
        // uploadOptions.setBase64('base64-string'); // Set base64 string
        // uploadOptions.setFileName('file-name');   // Set the file name when using base64
        const buffer = fs.readFileSync(filePath);
        uploadOptions.setFileObject(new File([buffer], filePath)); // Set a File object

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
