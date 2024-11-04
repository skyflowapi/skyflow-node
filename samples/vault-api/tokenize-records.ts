import { Env, LogLevel, Skyflow, TokenizeRequest } from "skyflow-node";
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
                credentials: credentials   // individual credentails
            }
        ],
        skyflowCredentials: skyflowCredentials, // skyflow credentials will be used if no individual credentials are passed
        logLevel: LogLevel.ERROR   // set log level by default it is set to PROD
    });

    // tokenize only supports value and columngroup
    // sample data
    const tokenizeValues = [
        { value: '4111111111111111', columnGroup: 'card_number_cg' },
        { value: '42424242424242424', columnGroup: 'card_number_cg' }
    ];

    const tokenReq = new TokenizeRequest(
        tokenizeValues
    );

    skyflowClient.vault("VAULT_ID").tokenize(
        tokenReq,
    ).then(resp => {
        console.log(resp);
    }).catch(err => {
        console.log(JSON.stringify(err));
    });
} catch (err) {
    console.log(JSON.stringify(err));
}