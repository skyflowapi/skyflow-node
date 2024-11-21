import { Credentials, Env, GetRequest, GetResponse, InsertRequest, LogLevel, Skyflow, VaultConfig, SkyflowConfig, InsertResponse, SkyflowError } from 'skyflow-node';

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
        token: 'BEARER_TOKEN', // bearer token 
    };

    const primaryVaultConfig: VaultConfig = {
        vaultId: 'VAULT_ID1',      // primary vault
        clusterId: 'CLUSTER_ID1',  // ID from your vault URL Eg https://{clusterId}.vault.skyflowapis.com
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

    const secondaryVaultConfig: VaultConfig = {
        vaultId: 'VAULT_ID2',      // secondary vault
        clusterId: 'CLUSTER_ID2',  // ID from your vault URL Eg https://{clusterId}.vault.skyflowapis.com
        env: Env.PROD,  // Env by default it is set to PROD
        // if you dont specify individual credentials, skyflow credentials will be used
    };

    //add vault config from prod env
    skyflowClient.addVaultConfig(secondaryVaultConfig);

    //perform operations 
    const getIds: Array<string> = [
        'SKYLFOW_ID1',
        'SKYLFOW_ID2',
    ];

    const tableName: string = 'TABLE_NAME';

    const getRequest: GetRequest = new GetRequest(
        tableName,
        getIds,
    );

    //perform delete call if you dont specify vault() it will return the first valid vault
    skyflowClient.vault('VAULT_ID1').get(getRequest)
        .then(response => {
            // get response
            const getResponse: GetResponse = response as GetResponse;
            console.log(getResponse.data);
            const insertData: Array<Object> = getResponse.data!;

            const tableName: string = 'TABLE_NAME';
            //parse insertData to remove skyflow_id
            //get data from one vault and insert data to another vault
            const insertRequest: InsertRequest = new InsertRequest(
                tableName,
                insertData,
            );
            skyflowClient.vault('VAULT_ID2').insert(
                insertRequest
            ).then((resp: InsertResponse) => {
                console.log(resp);
            }).catch((err: SkyflowError) => {
                console.log(JSON.stringify(err));
            });
        })
        .catch((err: SkyflowError) => {
            console.log(JSON.stringify(err));
        });
} catch (err) {
    console.log(JSON.stringify(err));
}