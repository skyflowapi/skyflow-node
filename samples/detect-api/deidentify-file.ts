import {
    Credentials,
    Env,
    LogLevel,
    Skyflow,
    SkyflowConfig,
    VaultConfig,
    SkyflowError,
    DeidentifyFileRequest,
    DeidentifyFileResponse,
    DeidentifySourceType,
    FileDataFormat,
} from 'skyflow-node';

/**
 * Skyflow Detect: de-identify a file (submit only)
 *
 * File de-identification is asynchronous on the API. This example demonstrates how to:
 * 1. Configure credentials and a vault
 * 2. Submit a local file for de-identification and receive a run id
 * 3. Submit a file by skyflow id or presigned URL instead of a local file
 * 4. Handle errors
 *
 * Retrieve the result later with getRun (see get-run.ts), or let the SDK poll for you
 * (see deidentify-file-async.ts).
 */
async function performDeidentifyFile() {
    try {
        // Step 1: Configure credentials
        const credentials: Credentials = {
            path: 'path-to-credentials-json', // Path to credentials file
        };

        // Step 2: Configure the vault
        const primaryVaultConfig: VaultConfig = {
            vaultId: '<VAULT_ID>',      // Unique vault identifier
            clusterId: '<CLUSTER_ID>',  // From the vault URL
            env: Env.PROD,              // Deployment environment
            credentials: credentials,   // Authentication method
        };

        // Step 3: Configure and initialize the Skyflow client
        const skyflowConfig: SkyflowConfig = {
            vaultConfigs: [primaryVaultConfig],
            logLevel: LogLevel.INFO,    // Recommended to use LogLevel.ERROR in production
        };
        const skyflowClient: Skyflow = new Skyflow(skyflowConfig);

        // Step 4: Submit a local file. It is read, base64-encoded and sent as BASE64;
        // dataFormat is inferred from the extension unless you set it.
        const localFileRequest = new DeidentifyFileRequest({
            filePath: '<FILE_PATH>',                 // e.g. /data/intake/patient-notes.pdf
            configurationId: '<CONFIGURATION_ID>',   // or configuration: { ... } for an inline configuration
        });
        const submitted: DeidentifyFileResponse = await skyflowClient
            .detect(primaryVaultConfig.vaultId)
            .deidentifyFile(localFileRequest);

        console.log('Run id:', submitted.runId);     // status, output and metrics are null until polled
        // Pass submitted.runId to getRun (see get-run.ts) to retrieve the result.

        // Step 5 (alternative): submit a file the vault already holds, or one at a presigned URL
        const remoteFileRequest = new DeidentifyFileRequest({
            dataSource: DeidentifySourceType.SKYFLOW_ID, // or DeidentifySourceType.PRESIGNED_URL
            value: '<SKYFLOW_ID>',                       // or the presigned URL
            dataFormat: FileDataFormat.PDF,
            configurationId: '<CONFIGURATION_ID>',
        });
        const remoteSubmitted = await skyflowClient
            .detect(primaryVaultConfig.vaultId)
            .deidentifyFile(remoteFileRequest);
        console.log('Run id (remote file):', remoteSubmitted.runId);
    } catch (error) {
        // Comprehensive error handling
        if (error instanceof SkyflowError) {
            console.error('Skyflow Specific Error:', {
                httpCode: error.error?.httpCode,
                grpcCode: error.error?.grpcCode,
                httpStatus: error.error?.httpStatus,
                message: error.message,
                details: error.error?.details,
                requestId: error.error?.requestId,
            });
        } else {
            console.error('Unexpected Error:', error);
        }
    }
}

// Invoke the de-identify file function
performDeidentifyFile();
