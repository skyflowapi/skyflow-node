import {
    Credentials,
    Env,
    LogLevel,
    Skyflow,
    SkyflowConfig,
    VaultConfig,
    SkyflowError,
    GetRunRequest,
    GetRunResponse,
    DetectRunStatus,
} from 'skyflow-flowvault-node';

/**
 * Skyflow Detect: get a file run
 *
 * File de-identification is asynchronous: deidentifyFile returns a run id, and getRun retrieves
 * the run's status and, once it has succeeded, its outputs. This example demonstrates how to:
 * 1. Configure credentials and a vault
 * 2. Look up a run by id
 * 3. Act on the run status and read its outputs
 * 4. Handle errors
 */
async function performGetRun() {
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

        // Step 4: Look up the run returned by a prior deidentifyFile call
        const request = new GetRunRequest('<RUN_ID>');
        const run: GetRunResponse = await skyflowClient
            .detect(primaryVaultConfig.vaultId)
            .getRun(request);

        // Step 5: Act on the status
        switch (run.status) {
            case DetectRunStatus.SUCCESS:
                for (const output of run.output) {
                    // output.processedFile is base64 or a presigned URL, per run.outputType
                    // output.processedFileType is e.g. REDACTED_FILE or ENTITIES
                    // output.processedFileExtension is a FileDataFormat such as PDF
                    console.log(`${output.processedFileType} (${output.processedFileExtension})`);
                }
                console.log('Output type:', run.outputType);
                console.log('Metrics:', run.metrics);
                break;
            case DetectRunStatus.FAILED:
                console.error('Run failed:', run.message);
                break;
            default:
                // QUEUED, IN_PROGRESS, UNKNOWN: poll again later
                console.log(`Run ${run.runId} is ${run.status}; try again later.`);
                break;
        }
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

// Invoke the get run function
performGetRun();
