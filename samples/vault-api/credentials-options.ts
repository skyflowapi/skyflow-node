import { Credentials, DeleteRequest, Env, LogLevel, Skyflow, VaultConfig, SkyflowConfig, DeleteResponse, SkyflowError } from 'skyflow-node';

try {
    //NOTE : If you don't specify credentials at config level credentials or skyflow credentials, SDK will check SKYFLOW_CREDENTIALS key in your env
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

    const credentials: Credentials = {
        token: 'BEARER_TOKEN', // bearer token 
        // apiKey: 'API_KEY', //API_KEY
        // path: 'PATH', //path to credentials file
        // credentialsString: 'CREDENTIAL_STRING', // credentials as string
    };

    const primaryVaultConfig: VaultConfig = {
        vaultId: 'VAULT_ID1',      // primary vault
        clusterId: 'CLUSTER_ID1',  // ID from your vault URL Eg https://{clusterId}.vault.skyflowapis.com
        env: Env.PROD,  // Env by default it is set to PROD
    };

    const secondaryVaultConfig: VaultConfig = {
        vaultId: 'VAULT_ID2',      // secondary vault
        clusterId: 'CLUSTER_ID2',  // ID from your vault URL Eg https://{clusterId}.vault.skyflowapis.com
        env: Env.PROD,  // Env by default it is set to PROD
        credentials: credentials,
    };

    const skyflowConfig: SkyflowConfig = {
        vaultConfigs: [
            primaryVaultConfig,
            secondaryVaultConfig,
        ],
        skyflowCredentials: skyflowCredentials, // skyflow credentials will be used if no individual credentials are passed
        logLevel: LogLevel.ERROR,   // set log level by default it is set to PROD
    };

    const skyflowClient: Skyflow = new Skyflow(skyflowConfig);

    const primaryDeleteIds: Array<string> = [
        'SKYFLOW_ID1',
        'SKYFLOW_ID2',
        'SKYFLOW_ID3',
    ];

    const primaryTableName: string = 'TABLE_NAME1';   // TABLE_NAME 

    const primaryDeleteRequest: DeleteRequest = new DeleteRequest(
        primaryTableName,
        primaryDeleteIds,
    );

    // VAULT_ID1 will use skyflowCredentials if you don't specify individual credentials at config level
    skyflowClient.vault('VAULT_ID1').delete(
        primaryDeleteRequest,
    ).then((resp: DeleteResponse) => {
        console.log(resp);
    }).catch((err: SkyflowError) => {
        console.log(JSON.stringify(err));
    });

    const secondaryDeleteIds: Array<string> = [
        'SKYFLOW_ID4',
        'SKYFLOW_ID5',
        'SKYFLOW_ID6',
    ];

    const secondaryTableName: string = 'TABLE_NAME2'; // TABLE_NAME 

    const secondaryDeleteRequest: DeleteRequest = new DeleteRequest(
        secondaryTableName,
        secondaryDeleteIds,
    );

    // VAULT_ID1 will use individual credentials at config level
    skyflowClient.vault('VAULT_ID2').delete(
        secondaryDeleteRequest
    ).then((resp: DeleteResponse) => {
        console.log(resp);
    }).catch((err: SkyflowError) => {
        console.log(JSON.stringify(err));
    });
} catch (err) {
    console.log(JSON.stringify(err));
}