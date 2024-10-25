import { DetokenizeOptions, DetokenizeRequest, Env, LogLevel, RedactionType, Skyflow } from "skyflow-node";

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
        credentialsString: JSON.stringify(cred)
    }

    // please pass one of apiKey, token, credentialsString & path
    const credentials = {
        token: "TOKEN", // bearer token 
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

    const detokenizeData = [
        'TOKEN1',
        'TOKEN2',
        'TOKEN3'
    ]

    const detokenizeRequest = new DetokenizeRequest(
        detokenizeData,
        RedactionType.REDACTED
    )

    const detokenizeOptions = new DetokenizeOptions()
    // options can be set using setters
    detokenizeOptions.setContinueOnError(true);

    detokenizeOptions.setDownloadURL(false);

    skyflow_client.vault("VAULT_ID").detokenize(
        detokenizeRequest,
        detokenizeOptions
    ).then(response => {
        console.log(response);
    }).catch(error => {
        console.log(JSON.stringify(error));
    })

} catch (err) {
    console.log(JSON.stringify(err));
}