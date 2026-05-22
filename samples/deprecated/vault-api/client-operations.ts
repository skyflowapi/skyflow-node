import {
    Credentials,
    DeleteRequest,
    Env,
    InsertRequest,
    InsertOptions,
    LogLevel,
    Skyflow,
    VaultConfig,
    SkyflowConfig,
    SkyflowError,
    DeleteResponse,
} from 'skyflow-node';

// v1 nomenclature: skyflow_id on insert response, deletedIds null-guard
async function performSecureDataDeletion() {
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
            logLevel: LogLevel.ERROR,
        };

        const skyflowClient: Skyflow = new Skyflow(skyflowConfig);

        // Config management — unchanged between v1 and v2
        const secondaryVaultConfig: VaultConfig = {
            vaultId: 'secondary-vault-id-placeholder',
            clusterId: '<CLUSTER_ID>',
            env: Env.DEV,
            credentials: credentials,
        };
        skyflowClient.addVaultConfig(secondaryVaultConfig);
        console.log('addVaultConfig: ok');

        skyflowClient.updateVaultConfig({
            vaultId: '<VAULT_ID>',
            clusterId: '<CLUSTER_ID>',
            credentials: credentials,
        });
        console.log('updateVaultConfig: ok');

        skyflowClient.removeVaultConfig('secondary-vault-id-placeholder');
        console.log('removeVaultConfig: ok');

        // Insert then delete (v1: access skyflow_id on insert response)
        const insertReq = new InsertRequest('table1', [{ card_number: '4111111111111112' }]);
        const insertOpts = new InsertOptions();
        insertOpts.setReturnTokens(false);
        const insertResp = await skyflowClient.vault(primaryVaultConfig.vaultId).insert(insertReq, insertOpts);

        // v1: null-guard + skyflow_id (deprecated getter)
        if (insertResp.insertedFields != null && insertResp.insertedFields.length > 0) {
            const v1Id = (insertResp.insertedFields[0] as any).skyflow_id;
            console.log('v1 inserted skyflow_id:', v1Id);

            const deleteRequest: DeleteRequest = new DeleteRequest('table1', [v1Id]);
            const response: DeleteResponse = await skyflowClient
                .vault(primaryVaultConfig.vaultId)
                .delete(deleteRequest);

            // v1: deletedIds null-guard
            if (response.deletedIds != null) {
                console.log('v1 deletedIds:', response.deletedIds);
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

performSecureDataDeletion();
