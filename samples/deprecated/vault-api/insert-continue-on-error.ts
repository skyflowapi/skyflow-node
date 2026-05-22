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
    SkyflowRecordError,
} from 'skyflow-node';

// v1 nomenclature: access request_ID on SkyflowRecordError (deprecated getter)
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
            { card_number: '4242424242424242', nonexistent_col: 'bad' },
        ]);

        const insertOptions: InsertOptions = new InsertOptions();
        insertOptions.setReturnTokens(true);
        insertOptions.setContinueOnError(true);

        const response: InsertResponse = await skyflowClient
            .vault(primaryVaultConfig.vaultId)
            .insert(insertReq, insertOptions);

        if (response.insertedFields != null && response.insertedFields.length > 0) {
            console.log('Inserted Fields:', response.insertedFields);
            // v1: access skyflow_id on inserted fields
            for (const field of response.insertedFields) {
                console.log('v1 skyflow_id:', (field as any).skyflow_id);
            }
        }

        if (response.errors != null) {
            for (const recordError of response.errors as SkyflowRecordError[]) {
                // v1: access request_ID (deprecated getter)
                console.log('v1 request_ID:', (recordError as any).request_ID);
                console.log('v1 error:', recordError);
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
