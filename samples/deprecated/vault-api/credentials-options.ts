import {
    Credentials,
    DeleteRequest,
    Env,
    InsertOptions,
    InsertRequest,
    LogLevel,
    Skyflow,
    VaultConfig,
    SkyflowConfig,
    SkyflowError,
    DeleteResponse,
    StringCredentials
} from 'skyflow-node';

/**
 * Skyflow Secure Data Deletion Example
 * 
 * This example demonstrates how to:
 * 1. Configure Skyflow client credentials
 * 2. Set up vault configurations
 * 3. Create and perform delete requests
 * 4. Handle response and errors
 */
const VAULT_ID    = '<VAULT_ID>';
const CLUSTER_ID  = '<CLUSTER_ID>';
const SETUP_TOKEN = 'BEARER_TOKEN';

async function setup(): Promise<[string, string]> {
    const setupClient = new Skyflow({
        vaultConfigs: [{ vaultId: VAULT_ID, clusterId: CLUSTER_ID, env: Env.DEV,
            credentials: { token: SETUP_TOKEN } }],
        logLevel: LogLevel.WARN,
    });
    const insertOpts = new InsertOptions(); insertOpts.setReturnTokens(false);
    const insertResp = await setupClient.vault(VAULT_ID).insert(
        new InsertRequest('table1', [
            { card_number: '4111111111111112' },
            { card_number: '4111111111111112' },
        ]), insertOpts
    );
    const idV1 = insertResp.insertedFields![0].skyflowId!;
    const idV2 = insertResp.insertedFields![1].skyflowId!;
    console.log('Setup: inserted IDs:', idV1, idV2);
    return [idV1, idV2];
}

async function performSecureDataDeletion() {
    const [insertedIdV1, insertedIdV2] = await setup();

    try {
        // Step 1: Configure Skyflow client Credentials
        const cred: Record<string, string> = {
            clientID: '<YOUR_CLIENT_ID>',    // Client identifier
            clientName: '<YOUR_CLIENT_NAME>',                          // Client name
            keyID: '<YOUR_KEY_ID>',        // Key identifier
            tokenURI: '<YOUR_TOKEN_URI>', // Token URI
            privateKey: '<YOUR_PRIVATE_KEY>',
        };

        // v1 credentialsString — old field names (clientID, keyID, tokenURI)
        const stringCredentials: StringCredentials = {
            credentialsString: JSON.stringify(cred),
        };
        const skyflowCredentials: Credentials = stringCredentials;

        // v2 credentialsString — new canonical field names (clientId, keyId, tokenUri)
        const credV2: Record<string, string> = {
            clientId: cred.clientID,
            clientName: cred.clientName,
            keyId: cred.keyID,
            tokenUri: cred.tokenURI,
            privateKey: cred.privateKey,
        };
        const stringCredentialsV2: StringCredentials = {
            credentialsString: JSON.stringify(credV2),
        };
        const skyflowCredentialsV2: Credentials = stringCredentialsV2;

        // Step 2: Configure Vaults
        // Individual vault credentials take priority over skyflowCredentials
        const primaryVaultConfig: VaultConfig = {
            vaultId: VAULT_ID,
            clusterId: CLUSTER_ID,
            env: Env.DEV,
            credentials: { token: SETUP_TOKEN }, // per-vault credential overrides skyflowCredentials
        };

        // Step 3: Configure Skyflow Client
        const skyflowConfig: SkyflowConfig = {
            vaultConfigs: [primaryVaultConfig],
            skyflowCredentials: skyflowCredentials, // Used if no individual credentials are passed
            logLevel: LogLevel.WARN,
        };

        // Initialize Skyflow Client
        const skyflowClient: Skyflow = new Skyflow(skyflowConfig);

        // Step 4: Prepare Delete Request for Primary Vault (uses v1 skyflowCredentials)
        const primaryDeleteIds: Array<string> = [insertedIdV1];

        const primaryTableName: string = 'table1';

        const primaryDeleteRequest: DeleteRequest = new DeleteRequest(
            primaryTableName,
            primaryDeleteIds,
        );

        // Perform Delete Operation for Primary Vault
        const primaryDeleteResponse: DeleteResponse = await skyflowClient
            .vault(VAULT_ID)
            .delete(primaryDeleteRequest);

        console.log('Primary Vault Deletion Successful (v1 credentialsString):', primaryDeleteResponse);

        // Step 5: v2 credentialsString (clientId/keyId/tokenUri — new canonical names)
        const skyflowConfigV2: SkyflowConfig = {
            vaultConfigs: [{
                vaultId: VAULT_ID,
                clusterId: CLUSTER_ID,
                env: Env.DEV,
                credentials: { token: SETUP_TOKEN },
            }],
            skyflowCredentials: skyflowCredentialsV2, // v2 field names
            logLevel: LogLevel.WARN,
        };
        const skyflowClientV2: Skyflow = new Skyflow(skyflowConfigV2);

        const secondaryDeleteResponse: DeleteResponse = await skyflowClientV2
            .vault(VAULT_ID)
            .delete(new DeleteRequest('table1', [insertedIdV2]));

        console.log('Secondary Vault Deletion Successful (v2 credentialsString):', secondaryDeleteResponse);

    } catch (error) {
        // Comprehensive Error Handling
        if (error instanceof SkyflowError) {
            console.error('Skyflow Specific Error:', {
                code: error.error?.http_code,
                message: error.message,
                details: error.error?.details
            });
        } else {
            console.error('Unexpected Error:', error);
        }
    }
}

// Invoke the secure data deletion function
performSecureDataDeletion();
