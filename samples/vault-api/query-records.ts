import { Env, LogLevel, QueryRequest, Skyflow } from "skyflow-node";
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
        apiKey: "API_KEY", // API key 
    }

    const skyflowClient = new Skyflow({
        vaultConfigs: [
            {
                vaultId: "VAULT_ID",      // primary vault
                clusterId: "CLUSTER_ID",  // ID from your vault URL Eg https://{clusterId}.vault.skyflowapis.com
                env: Env.PROD,  // Env by default it is set to PROD
                credentials: credentials   // individual credentials
            }
        ],
        skyflowCredentials: skyflowCredentials, // skyflow credentials will be used if no individual credentials are passed
        logLevel: LogLevel.ERROR   // set log level by default it is set to PROD
    });
    //sample query
    const query = "select * from TABLE_NAME limit 1";

    const queryReq = new QueryRequest(
        query
    );

    skyflowClient.vault("VAULT_ID").query(
        queryReq,
    ).then(resp => {
        console.log(resp);
    }).catch(err => {
        console.log(JSON.stringify(err));
    });
} catch (err) {
    console.log(JSON.stringify(err));
}