import {
    TokenMode,
    Credentials,
    Env,
    InsertOptions,
    InsertRequest,
    LogLevel,
    Skyflow,
    VaultConfig,
    SkyflowConfig,
    InsertResponse,
    SkyflowError,
} from 'skyflow-node';

// v1 nomenclature: skyflow_id on response (deprecated getter)
async function performSecureDataInsertionWithBYOT() {
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
            { card_number: '6011111111111117' },
        ]);

        const tokens: Record<string, unknown>[] = [
            { card_number: 'byot-v1-compat-test' },
        ];

        const insertOptions: InsertOptions = new InsertOptions();
        insertOptions.setReturnTokens(true);
        insertOptions.setTokenMode(TokenMode.ENABLE);
        insertOptions.setTokens(tokens);

        const response: InsertResponse = await skyflowClient
            .vault(primaryVaultConfig.vaultId)
            .insert(insertReq, insertOptions);

        // v1: null-guard + skyflow_id access
        if (response.insertedFields != null) {
            for (const field of response.insertedFields) {
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

performSecureDataInsertionWithBYOT();
