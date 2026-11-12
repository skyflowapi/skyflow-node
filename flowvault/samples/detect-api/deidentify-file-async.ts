import * as fs from 'fs';
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
    DetectRunStatus,
    DetectConfiguration,
    EntityType,
    DeidentificationType,
    MaskingMethod,
    PdfProcessingMode,
} from 'skyflow-flowvault-node';

/**
 * Skyflow Detect: de-identify a file and poll the run to completion
 *
 * This example demonstrates how to:
 * 1. Configure credentials and a vault
 * 2. Submit a local file with pollOptions so the SDK polls the run for you
 * 3. Write the processed outputs to an output directory on success
 * 4. Submit an in-memory File object (Node.js 20+) with an inline configuration
 * 5. Handle a run that is still in progress when the polling budget runs out
 */
async function performDeidentifyFileAndPoll() {
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

        // Step 4: Submit and poll. The SDK polls with exponential backoff (1, 2, 4, 8, 16, then
        // 32 seconds between lookups) until the run is SUCCESS, FAILED or UNKNOWN, or until
        // waitTime (default 60 s, max 300) or maxAttempts (default 23) is used up.
        const request = new DeidentifyFileRequest({
            filePath: '<FILE_PATH>',                 // e.g. /data/intake/patient-notes.pdf
            configurationId: '<CONFIGURATION_ID>',
            pollOptions: { waitTime: 120, maxAttempts: 10 },
            outputDirectory: '<OUTPUT_DIRECTORY>',   // optional; created if missing, default: working directory
        });
        const response: DeidentifyFileResponse = await skyflowClient
            .detect(primaryVaultConfig.vaultId)
            .deidentifyFile(request);

        handleRun(response);

        // Step 5 (alternative): an in-memory File with an inline configuration
        const buffer = fs.readFileSync('<FILE_PATH>');
        const file = new File([new Uint8Array(buffer)], 'patient-notes.pdf');
        const configuration: DetectConfiguration = {
            detect: {
                entities: [
                    { entityType: EntityType.NAME, deidentificationType: DeidentificationType.ENTITY_UNIQUE_COUNTER },
                    { entityType: EntityType.ALL },
                ],
            },
            media: {
                image: { maskingMethod: MaskingMethod.BLUR, outputOcrText: true },
                document: { pdf: { processingMode: PdfProcessingMode.OCR } },
            },
        };
        const fileObjectResponse = await skyflowClient
            .detect(primaryVaultConfig.vaultId)
            .deidentifyFile(new DeidentifyFileRequest({ file, configuration, pollOptions: {} }));

        handleRun(fileObjectResponse);
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

function handleRun(response: DeidentifyFileResponse) {
    switch (response.status) {
        case DetectRunStatus.SUCCESS:
            // For local-file requests the outputs are already on disk as
            // processed-<name>.<ext> and processed-entities-<name>.json.
            console.log('Run succeeded:', response.runId);
            for (const output of response.output) {
                console.log(`${output.processedFileType} (${output.processedFileExtension})`);
            }
            console.log('Metrics:', response.metrics);
            break;
        case DetectRunStatus.FAILED:
            console.error('Run failed:', response.message);
            break;
        default:
            // IN_PROGRESS or QUEUED: the polling budget ran out. Resume with getRun(runId).
            console.log(`Run ${response.runId} is still ${response.status}; poll it with getRun.`);
            break;
    }
}

// Invoke the de-identify and poll function
performDeidentifyFileAndPoll();
