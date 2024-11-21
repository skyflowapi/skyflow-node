import { BYOT, Credentials, Env, InsertOptions, InsertRequest, LogLevel, Skyflow, VaultConfig, SkyflowConfig, InsertResponse, SkyflowError } from 'skyflow-node';

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
        token: "BEARER", // token 
    };

    const primaryVaultConfig: VaultConfig = {
            vaultId: "VAULT_ID",      // primary vault
            clusterId: "CLUSTER_ID",  // ID from your vault URL Eg https://{clusterId}.vault.skyflowapis.com
            env: Env.PROD,  // Env by default it is set to PROD
            credentials: credentials,   // individual credentials
    };

    const skyflowConfig: SkyflowConfig = {
        vaultConfigs: [
            primaryVaultConfig,
        ],
        skyflowCredentials: skyflowCredentials, // skyflow credentials will be used if no individual credentials are passed
        logLevel: LogLevel.INFO,   // set log level by default it is set to PROD
    };

    const skyflowClient: Skyflow = new Skyflow(skyflowConfig);

    //sample data
    const insertData: Array<Object> = [
        { card_number: 'CARD_NUMBER1', card_cvv: 'CVV1' },
        { card_number: 'CARD_NUMBER2', card_cvv: 'CVV2' },
    ];

    const tableName: string = 'TABLE_NAME';

    const insertReq: InsertRequest = new InsertRequest(
        tableName,
        insertData,
    );

    const tokens: Array<Object> = [
        { card_number: 'TOKEN1', card_cvv: 'TOKEN2' },
        { card_number: 'TOKEN3', card_cvv: 'TOKEN4' },
    ];

    const insertOptions: InsertOptions = new InsertOptions()
    //use setters for setting options
    insertOptions.setReturnTokens(true);
    insertOptions.setTokenMode(BYOT.ENABLE);
    insertOptions.setTokens(tokens);
    // insertOptions.setContinueOnError(true); // if continue on error is set true we will return requestIndex for errors 

    skyflowClient.vault('VAULT_ID').insert(
        insertReq,
        insertOptions,
    ).then((resp: InsertResponse) => {
        console.log(resp);
    }).catch((err: SkyflowError) => {
        console.log(JSON.stringify(err));
    });
} catch (err) {
    console.log(JSON.stringify(err));
}