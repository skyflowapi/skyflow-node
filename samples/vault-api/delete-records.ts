import { Credentials, DeleteRequest, DeleteResponse, Env, LogLevel, Skyflow, SkyflowConfig, VaultConfig, SkyflowError } from 'skyflow-node';

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
        apiKey: 'API_KEY', // API Key 
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
        logLevel: LogLevel.ERROR,  // set log level by default it is set to PROD
    };

    const skyflowClient: Skyflow = new Skyflow(skyflowConfig);

    const deleteIds: Array<string> = [
        'SKYFLOW_ID1',
        'SKYFLOW_ID2',
        'SKYFLOW_ID3',
    ];

    const tableName: string = 'TABLE_NAME';   // TABLE_NAME 

    const deleteRequest: DeleteRequest = new DeleteRequest(
        tableName,
        deleteIds,
    );

    // will return first Vault ID
    skyflowClient.vault().delete(
        deleteRequest,
    ).then((resp: DeleteResponse) => {
        console.log(resp);
    }).catch((err: SkyflowError) => {
        console.log(JSON.stringify(err));
    });
} catch (err) {
    console.log(JSON.stringify(err));
}