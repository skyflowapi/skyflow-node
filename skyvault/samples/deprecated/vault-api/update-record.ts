import {
    Credentials,
    Env,
    LogLevel,
    Skyflow,
    VaultConfig,
    SkyflowConfig,
    UpdateRequest,
    UpdateOptions,
    UpdateResponse,
    SkyflowError,
} from 'skyflow-node';

// v1 nomenclature: skyflow_id key in request data + skyflow_id on response
async function performSecureDataUpdate() {
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

        const skyflowClient: Skyflow = new Skyflow(skyflowConfig);

        // v1: use skyflow_id (snake_case) as the record identifier key
        const updateData: Record<string, unknown> = {
            skyflow_id: '<SKYFLOW_ID>',
            card_number: '4111111111111111',
        };

        const updateReq: UpdateRequest = new UpdateRequest('table1', updateData);

        const updateOptions: UpdateOptions = new UpdateOptions();
        updateOptions.setReturnTokens(true);

        const response: UpdateResponse = await skyflowClient
            .vault(primaryVaultConfig.vaultId)
            .update(updateReq, updateOptions);

        // v1: access skyflow_id on response (deprecated getter)
        console.log('Update response:', response);
        if (response.updatedField != null) {
            console.log('v1 skyflow_id:', (response.updatedField as any).skyflow_id);
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

performSecureDataUpdate();
