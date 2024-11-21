import { Env, Skyflow, UpdateRequest, UpdateOptions, LogLevel, Credentials, VaultConfig, SkyflowConfig, UpdateResponse, SkyflowError } from 'skyflow-node';

try {
    // To generate Bearer Token from credentials string.
    const cred: Object = {
        clientID: '<YOUR_CLIENT_ID>',
        clientName: '<YOUR_CLIENT_NAME>',
        keyID: '<YOUR_KEY_ID>',
        tokenURI: '<YOUR_TOKEN_URI>',
        privateKey: '<YOUR_PEM_PRIVATE_KEY>',
    };

    // please pass one of apiKey, token, credentialsString & path as credentials
    const skyflowCredentials: Credentials = {
        credentialsString: JSON.stringify(cred),
    };

    // please pass one of apiKey, token, credentialsString & path as credentials
    const credentials: Credentials = {
        apiKey: 'API_KEY', // API key 
    };

    const primaryVaultConfig: VaultConfig = {
        vaultId: 'VAULT_ID',      // primary vault
        clusterId: 'CLUSTER_ID',  // ID from your vault URL Eg https://{clusterId}.vault.skyflowapis.com
        env: Env.PROD,  // Env by default it is set to PROD
        credentials: credentials,   // individual credentials
    };

    const skyflowConfig: SkyflowConfig = {
        vaultConfigs: [
            primaryVaultConfig,
        ],
        skyflowCredentials: skyflowCredentials, // skyflow credentials will be used if no individual credentials are passed
        logLevel: LogLevel.ERROR,   // set log level by default it is set to PROD
    };

    const skyflowClient: Skyflow = new Skyflow(skyflowConfig);

    const skyflowId: string = 'SKYFLOW_ID';

    // sample data
    const updateData: Object = { skyflowId, card_number: '12333333333333444444' };

    const tableName: string = 'TABLE_NAME';

    const updateReq: UpdateRequest = new UpdateRequest(
        tableName,
        updateData,
    );

    const updateOptions: UpdateOptions = new UpdateOptions();

    updateOptions.setReturnTokens(true);

    skyflowClient.vault('VAULT_ID').update(
        updateReq,
        updateOptions,
    ).then((resp: UpdateResponse) => {
        console.log(resp);
    }).catch((err: SkyflowError) => {
        console.log(JSON.stringify(err));
    });
} catch (err) {
    console.log(JSON.stringify(err));
}