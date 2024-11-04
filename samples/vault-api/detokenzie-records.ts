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

    // please pass one of apiKey, token, credentialsString & path as credentials
    const skyflowCredentials = {
        credentialsString: JSON.stringify(cred)
    }

    // please pass one of apiKey, token, credentialsString & path as credentials
    const credentials = {
        token: "TOKEN", // bearer token 
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

    skyflowClient.vault("VAULT_ID").detokenize(
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