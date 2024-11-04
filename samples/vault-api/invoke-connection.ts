import { Env, Skyflow, InvokeConnectionRequest, Method, LogLevel } from "skyflow-node";

try {
    // To generate Bearer Token from credentials string.
    const cred = {
        clientID: '<YOUR_CLIENT_ID>',
        clientName: '<YOUR_CLIENT_NAME>',
        keyID: '<YOUR_KEY_ID>',
        tokenURI: '<YOUR_TOKEN_URI>',
        privateKey: '<YOUR_PEM_PRIVATE_KEY>',
    };

    // please pass one of apiKey, token, credentialsString & path as credentials
    const skyflowCredentials = {
        credentialsString: JSON.stringify(cred),
    }

    // please pass one of apiKey, token, credentialsString & path as credentials
    const credentials = {
        apiKey: "API_KEY", // API Key 
    }

    const skyflowClient = new Skyflow({
        vaultConfigs: [
            {
                vaultId: "VAULT_ID",      // primary vault ( NOTE : One vault is necessary)
                clusterId: "CLUSTER_ID",  // ID from your vault URL Eg https://{clusterId}.vault.skyflowapis.com
                env: Env.PROD,  // Env by default it is set to PROD
                credentials: credentials   // individual credentials
            }
        ],
        connectionConfigs: [
            {
                connectionId: "CONNECTION_ID", // get connection ID from https://${clusterId}.gateway.skyflowapis.dev/v1/gateway/inboundRoutes/${connectionId}/${connection_name}
                connectionUrl: "CONNECTION_URL", // the whole URL https://${clusterId}.gateway.skyflowapis.dev/v1/gateway/inboundRoutes/${connectionId}/${connection_name}
                credentials: credentials
            }
        ],
        skyflowCredentials: skyflowCredentials, // skyflow credentials will be used if no individual credentials are passed
        logLevel: LogLevel.ERROR   // set log level by default it is set to PROD
    });

    const body = {
        "KEY1": "VALUE1",
        "KEY2": "VALUE2",
    };

    const headers = {
        'Content-Type': 'application/json',
    };

    const invokeReq = new InvokeConnectionRequest(
        Method.POST,
        body,
        headers
    );

    //will return the first connection
    skyflowClient.connection().invoke(
        invokeReq
    ).then(resp => {
        console.log(resp);
    }).catch(err => {
        console.log(JSON.stringify(err));
    })
} catch (err) {
    console.log(JSON.stringify(err));
}