import {
    Credentials,
    Env,
    GetOptions,
    GetRequest,
    LogLevel,
    Skyflow,
    VaultConfig,
    SkyflowConfig,
    SkyflowError,
    GetResponse,
} from 'skyflow-node';

// v1 nomenclature: setDownloadURL (uppercase) + skyflow_id on data
async function performSecureDataRetrieval() {
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

        const getOptions: GetOptions = new GetOptions();
        getOptions.setReturnTokens(true);

        // v1: setDownloadURL (uppercase — deprecated, still works, emits WARN)
        (getOptions as any).setDownloadURL(false);
        // v1: getDownloadURL (uppercase — deprecated getter, still works, emits WARN)
        console.log('v1 getDownloadURL:', (getOptions as any).getDownloadURL());

        const skyflowClient: Skyflow = new Skyflow(skyflowConfig);

        const getRequest: GetRequest = new GetRequest('table1', [
            '<SKYFLOW_ID>',
            '<SKYFLOW_ID_2>',
        ]);

        const response: GetResponse = await skyflowClient
            .vault(primaryVaultConfig.vaultId)
            .get(getRequest, getOptions);

        console.log('Get response:', response);

        if (response.data != null) {
            for (const record of response.data) {
                // v1: access skyflow_id (deprecated getter)
                console.log('v1 skyflow_id:', (record as any).skyflow_id);
                console.log('v1 record:', record);
            }
        }

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

performSecureDataRetrieval();
