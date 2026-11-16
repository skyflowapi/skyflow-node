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
    FileUploadOptions,
} from 'skyflow-node';

// v1 nomenclature: 3-arg FileUploadRequest constructor (table, skyflowId, columnName)
async function performFileUpload() {
    try {
        const credentials: Credentials = {
            token: 'BEARER_TOKEN',
        };

        const primaryVaultConfig: VaultConfig = {
            vaultId: '<VAULT_ID>',
            clusterId: '<CLUSTER_ID>',
            env: Env.DEV,
            credentials: credentials,
        };

        const skyflowConfig: SkyflowConfig = {
            vaultConfigs: [primaryVaultConfig],
            logLevel: LogLevel.WARN,
        };

        // v1: 3-arg constructor (table, skyflowId, columnName) — deprecated, emits WARN, still works
        const uploadReq: FileUploadRequest = new FileUploadRequest(
            'table1',
            '<SKYFLOW_ID>',  // skyflowId as 2nd arg (old API)
            'file',
        );

        // v1: .skyflowId getter on FileUploadRequest — deprecated, emits WARN
        console.log('v1 skyflowId getter:', (uploadReq as any).skyflowId);

        const skyflowClient: Skyflow = new Skyflow(skyflowConfig);

        const uploadOptions: FileUploadOptions = new FileUploadOptions();
        uploadOptions.setFilePath('<FILE_PATH>');
        // v1: NO setSkyflowId() call — ID is in the constructor

        const response: FileUploadResponse = await skyflowClient
            .vault(primaryVaultConfig.vaultId)
            .uploadFile(uploadReq, uploadOptions);

        console.log('File upload successful:', response);

    } catch (error) {
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

performFileUpload();
