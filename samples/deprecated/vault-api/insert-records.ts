import {
    Credentials,
    Env,
    InsertOptions,
    InsertRequest,
    LogLevel,
    Skyflow,
    VaultConfig,
    SkyflowConfig,
    SkyflowError,
    InsertResponse,
} from 'skyflow-node';

// v1 nomenclature: accesses skyflow_id (deprecated getter) + null-guards insertedFields
async function performSecureDataInsertion() {
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

        const insertReq: InsertRequest = new InsertRequest('table1', [
            { card_number: '4111111111111112' },
        ]);

        const insertOptions: InsertOptions = new InsertOptions();
        insertOptions.setReturnTokens(true);

        const response: InsertResponse = await skyflowClient
            .vault(primaryVaultConfig.vaultId)
            .insert(insertReq, insertOptions);

        // v1: null-guard insertedFields (was nullable before SK-2812)
        if (response.insertedFields != null) {
            for (const field of response.insertedFields) {
                // v1: access skyflow_id (deprecated getter, now warns but still works)
                console.log('v1 skyflow_id:', (field as any).skyflow_id);
                console.log('v1 field:', field);
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

performSecureDataInsertion();
