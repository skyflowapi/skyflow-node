import {
    Credentials,
    DetokenizeOptions,
    DetokenizeRequest,
    DetokenizeResponse,
    Env,
    LogLevel,
    RedactionType,
    Skyflow,
    SkyflowError,
    VaultConfig,
    SkyflowConfig,
    DetokenizeData,
    SkyflowRecordError,
} from 'skyflow-node';

// v1 nomenclature: setDownloadURL (uppercase) on DetokenizeOptions
async function performDetokenization() {
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

        const detokenizeOptions: DetokenizeOptions = new DetokenizeOptions();
        detokenizeOptions.setContinueOnError(true);

        // v1: setDownloadURL uppercase — deprecated setter, still works
        (detokenizeOptions as any).setDownloadURL(false);
        // v1: getDownloadURL uppercase — deprecated getter, still works
        console.log('v1 getDownloadURL:', (detokenizeOptions as any).getDownloadURL());

        const skyflowClient: Skyflow = new Skyflow(skyflowConfig);

        const detokenizeData: DetokenizeData[] = [
            {
                token: '8561-9339-2309-3015',
                redactionType: RedactionType.PLAIN_TEXT,
            },
        ];

        const detokenizeRequest: DetokenizeRequest = new DetokenizeRequest(detokenizeData);

        const response: DetokenizeResponse = await skyflowClient
            .vault(primaryVaultConfig.vaultId)
            .detokenize(detokenizeRequest, detokenizeOptions);

        console.log('Detokenization successful:', response);

        if (response.errors != null) {
            response.errors.forEach((err: SkyflowRecordError) => {
                // v1: access request_ID (deprecated)
                console.log('v1 request_ID:', (err as any).request_ID);
            });
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

performDetokenization();
