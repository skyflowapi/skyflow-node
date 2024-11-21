import { Env, Skyflow, InvokeConnectionRequest, RequestMethod, LogLevel, Credentials, SkyflowConfig, VaultConfig, ConnectionConfig, InvokeConnectionResponse, SkyflowError } from 'skyflow-node';

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
    const credentials: Credentials  = {
        apiKey: 'API_KEY', // API Key 
    };

    const primaryVaultConfig: VaultConfig = {
        vaultId: 'VAULT_ID',      // primary vault ( NOTE : One vault is necessary)
        clusterId: 'CLUSTER_ID',  // ID from your vault URL Eg https://{clusterId}.vault.skyflowapis.com
        env: Env.PROD,  // Env by default it is set to PROD
        credentials: credentials,   // individual credentials
    };

    const primaryConnectionConfig: ConnectionConfig = {
        connectionId: 'CONNECTION_ID', // get connection ID from https://${clusterId}.gateway.skyflowapis.dev/v1/gateway/inboundRoutes/${connectionId}/${connection_name}
        connectionUrl: 'CONNECTION_URL', // the whole URL https://${clusterId}.gateway.skyflowapis.dev/v1/gateway/inboundRoutes/${connectionId}/${connection_name}
        credentials: credentials
    };

    const skyflowConfig: SkyflowConfig = {
        vaultConfigs: [
            primaryVaultConfig,
        ],
        connectionConfigs: [
            primaryConnectionConfig,
        ],
        skyflowCredentials: skyflowCredentials, // skyflow credentials will be used if no individual credentials are passed
        logLevel: LogLevel.ERROR   // set log level by default it is set to PROD
    };

    const skyflowClient: Skyflow = new Skyflow(skyflowConfig);

    const body = {
        'KEY1': 'VALUE1',
        'KEY2': 'VALUE2',
    };

    const headers = {
        'Content-Type': 'application/json',
    };

    const method: RequestMethod = RequestMethod.POST;

    const invokeReq: InvokeConnectionRequest = new InvokeConnectionRequest(
        method,
        body,
        headers,
    );

    //will return the first connection
    skyflowClient.connection().invoke(
        invokeReq,
    ).then((resp: InvokeConnectionResponse) => {
        console.log(resp);
    }).catch((err: SkyflowError) => {
        console.log(JSON.stringify(err));
    });
} catch (err) {
    console.log(JSON.stringify(err));
}