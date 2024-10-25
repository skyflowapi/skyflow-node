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

    // please pass one of apiKey, token, credentialsString & path
    const skyflowCredentials = {
        credentialsString: JSON.stringify(cred),
    }

    // please pass one of apiKey, token, credentialsString & path
    const credentials = {
        apiKey: "API_KEY", // bearer token 
    }

    const skyflow_client = new Skyflow({
        vaultConfigs: [
            {
                vaultId: "VAULT_ID",      // primary vault
                clusterId: "CLUSTER_ID",  // ID from your vault URL Eg https://{clusterId}.vault.skyflowapis.com
                env: Env.PROD,  // Env by deault it is set to PROD
                credentials: credentials   // indiviudal credentails
            }
        ],
        skyflowCredentials: skyflowCredentials, // skyflow credentials will be used if no individual creds are passed
        logLevel: LogLevel.ERROR   // set loglevel by deault it is set to PROD
    });
    //sample query
    const query = "select * from TABLE_NAME limit 1";

    const queryReq = new QueryRequest(
        query
    );

    skyflow_client.vault("VAULT_ID").query(
        queryReq,
    ).then(resp => {
        console.log(resp);
    }).catch(err => {
        console.log(JSON.stringify(err));
    });
} catch (err) {
    console.log(JSON.stringify(err));
}