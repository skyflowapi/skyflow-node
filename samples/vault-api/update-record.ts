import { Env, Skyflow, UpdateRequest, UpdateOptions, LogLevel } from "skyflow-node";

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

    // sample data
    const updateData = { card_number: '12333333333333444444' };

    const skyflowId = "SKYFLOW_ID";

    const updateReq = new UpdateRequest(
        "TABLE_NAME",
        skyflowId,
        updateData
    )

    const updateOptions = new UpdateOptions()

    updateOptions.setReturnTokens(true);

    skyflow_client.vault("VAULT_ID").update(
        updateReq,
        updateOptions
    ).then(resp => {
        console.log(resp);
    }).catch(err => {
        console.log(JSON.stringify(err));
    });
} catch (err) {
    console.log(JSON.stringify(err));
}