import * as fs from 'fs';
import {
    Credentials,
    Env,
    LogLevel,
    Skyflow,
    SkyflowConfig,
    VaultConfig,
    SkyflowError,
    ReidentifyFileRequest,
    ReidentifyFileResponse,
    ReidentifySourceType,
    FileDataFormat,
    DetectRunStatus,
    EntityType,
    RedactionType,
} from 'skyflow-node';

/**
 * Skyflow Detect: re-identify a file
 *
 * reidentifyFile is synchronous: the re-identified file comes back in the response. This
 * example demonstrates how to:
 * 1. Configure credentials and a vault
 * 2. Send a tokenized local file as base64 with optional redaction rules
 * 3. Decode the re-identified output
 * 4. Handle errors
 */
async function performReidentifyFile() {
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

        // Step 4: Read the tokenized file and send it as BASE64. dataFormat is limited to the
        // formats that support VAULT_TOKEN: TXT, CSV, JSON, JSONL, XML, DOCX, XLSX and PPTX.
        const content = fs.readFileSync('<TOKENIZED_FILE_PATH>').toString('base64');
        const request = new ReidentifyFileRequest(ReidentifySourceType.BASE64, content, {
            dataFormat: FileDataFormat.TXT,
            redactionLevel: [
                { entityName: EntityType.SSN, redactionType: RedactionType.MASKED },
            ],
        });
        const response: ReidentifyFileResponse = await skyflowClient
            .detect(primaryVaultConfig.vaultId)
            .reidentifyFile(request);

        // Step 5: Decode the output. processedFile is base64 or a presigned URL, per outputType.
        if (response.status === DetectRunStatus.SUCCESS) {
            for (const output of response.output) {
                if (output.processedFile) {
                    const bytes = Buffer.from(output.processedFile, 'base64');
                    fs.writeFileSync(`reidentified.${output.processedFileExtension?.toLowerCase()}`, bytes);
                    console.log(`Wrote ${output.processedFileType} (${bytes.length} bytes)`);
                }
            }
            console.log('Metrics:', response.metrics);
        } else {
            console.error('Re-identification did not succeed:', response.status);
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

// Invoke the re-identify file function
performReidentifyFile();
