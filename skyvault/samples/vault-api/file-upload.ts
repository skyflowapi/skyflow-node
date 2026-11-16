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
 * This example demonstrates how to upload a file to a Skyflow vault using three
 * different file source options — pick exactly one per upload:
 *   Option A: setFilePath()   — read a file from disk by path (simplest for server-side Node.js)
 *   Option B: setBase64()     — supply file content as a base64-encoded string
 *   Option C: setFileObject() — supply an in-memory File object directly
 *
 * Note: File upload requires Node.js v20 or above.
 */
async function performFileUpload() {
    try {
        // Step 1: Configure credentials
        const credentials: Credentials = {
            path: '<YOUR_CREDENTIALS_FILE_PATH>',
        };

        // Step 2: Configure vault
        const primaryVaultConfig: VaultConfig = {
            vaultId: '<VAULT_ID>',
            clusterId: '<CLUSTER_ID>',
            env: Env.PROD,
            credentials: credentials,
        };

        // Step 3: Initialize Skyflow client
        const skyflowConfig: SkyflowConfig = {
            vaultConfigs: [primaryVaultConfig],
            logLevel: LogLevel.ERROR,
        };
        const skyflowClient: Skyflow = new Skyflow(skyflowConfig);

        // Step 4: Create a file upload request (table + column only; Skyflow ID goes in options)
        const uploadReq: FileUploadRequest = new FileUploadRequest(
            '<TABLE_NAME>',
            '<COLUMN_NAME>',
        );

        // Step 5: Configure upload options — set Skyflow ID, then choose one file source

        const uploadOptions: FileUploadOptions = new FileUploadOptions();

        // Required: the Skyflow ID of the record to attach this file to
        uploadOptions.setSkyflowId('<SKYFLOW_ID>');

        // --- Option A: File path (SDK reads the file from disk) ---
        uploadOptions.setFilePath('<FILE_PATH>');

        // --- Option B: Base64-encoded content ---
        // const base64Content = fs.readFileSync('<FILE_PATH>').toString('base64');
        // uploadOptions.setBase64(base64Content);
        // uploadOptions.setFileName('document.pdf'); // required when using setBase64

        // --- Option C: In-memory File object ---
        // const buffer = fs.readFileSync('<FILE_PATH>');
        // uploadOptions.setFileObject(new File([buffer], 'document.pdf'));

        // Step 6: Upload the file
        const response: FileUploadResponse = await skyflowClient
            .vault(primaryVaultConfig.vaultId)
            .uploadFile(uploadReq, uploadOptions);

        console.log('File upload successful:', response);
        console.log('Skyflow ID:', response.skyflowId);

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
