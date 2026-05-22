import {
    Credentials,
    Env,
    LogLevel,
    QueryRequest,
    QueryResponse,
    Skyflow,
    SkyflowConfig,
    SkyflowError,
    VaultConfig,
} from 'skyflow-node';

// v1 nomenclature: access skyflow_id on query fields (deprecated getter)
async function executeQuery() {
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

        const queryRequest: QueryRequest = new QueryRequest('select * from table1 limit 2');

        const response: QueryResponse = await skyflowClient
            .vault(primaryVaultConfig.vaultId)
            .query(queryRequest);

        console.log('Query Result:', response);

        response.fields.forEach(record => {
            // v1: access skyflow_id (deprecated getter)
            console.log('v1 skyflow_id:', (record as any).skyflow_id);
            console.log('v1 record:', record);
        });

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

executeQuery();
