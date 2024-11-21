import { Credentials, Env, InsertOptions, InsertRequest, LogLevel, Skyflow, VaultConfig, SkyflowConfig, InsertResponse, SkyflowError } from 'skyflow-node';

try {
    // please pass one of apiKey, token, credentialsString & path as credentials
    const credentials: Credentials = {
        apiKey: 'API_KEY', // API Key 
    };

    const logLevel: LogLevel = LogLevel.INFO;

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
        logLevel: logLevel,  // set log level by default it is set to PROD
    };

    const skyflowClient: Skyflow = new Skyflow(skyflowConfig);

    //sample data
    const insertData: Array<Object> = [
        { card_number: '4111111111111111', card_cvv: '1234' },
        { card_number: '42424242424242424', card_cvv: '321' },
    ];

    const tableName: string = 'TABLE_NAME';

    const insertReq: InsertRequest = new InsertRequest(
        tableName,
        insertData,
    );

    const insertOptions: InsertOptions = new InsertOptions();
    //use setters for setting options
    insertOptions.setReturnTokens(true);
    // insertOptions.setContinueOnError(true); // if continue on error is set true we will return requestIndex for errors 

    skyflowClient.vault('VAULT_ID').insert(
        insertReq,
        insertOptions
    ).then((resp: InsertResponse) => {
        console.log(resp);
    }).catch((err: SkyflowError) => {
        console.log(JSON.stringify(err));
    });
} catch (err) {
    console.log(JSON.stringify(err));
}