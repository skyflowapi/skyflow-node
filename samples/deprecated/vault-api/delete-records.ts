import {
    Credentials,
    DeleteRequest,
    DeleteResponse,
    Env,
    InsertRequest,
    InsertOptions,
    LogLevel,
    Skyflow,
    SkyflowConfig,
    VaultConfig,
    SkyflowError,
} from 'skyflow-node';

// v1 nomenclature: null/undefined guard on deletedIds (was nullable before SK-2812)
async function performDeletion() {
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

        // Insert first so we have a valid ID to delete
        const insertReq = new InsertRequest('table1', [{ card_number: '4111111111111112' }]);
        const insertOpts = new InsertOptions();
        insertOpts.setReturnTokens(false);
        const insertResp = await skyflowClient.vault(primaryVaultConfig.vaultId).insert(insertReq, insertOpts);
        const idToDelete: string = insertResp.insertedFields[0].skyflowId;

        const deleteRequest: DeleteRequest = new DeleteRequest('table1', [idToDelete]);

        const response: DeleteResponse = await skyflowClient
            .vault(primaryVaultConfig.vaultId)
            .delete(deleteRequest);

        // v1: old null-guard pattern (deletedIds was string[] | undefined)
        if (response.deletedIds != null && response.deletedIds != undefined) {
            console.log('Deletion successful, deletedIds:', response.deletedIds);
            for (const id of response.deletedIds) {
                console.log('v1 deleted id:', id);
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

performDeletion();
