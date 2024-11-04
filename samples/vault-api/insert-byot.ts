import { BYOT, Env, InsertOptions, InsertRequest, LogLevel, Skyflow } from "skyflow-node";

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
        token: "BEARER", // token 
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
        logLevel: LogLevel.INFO   // set log level by default it is set to PROD
    });

    //sample data
    const insertData = [
        { card_number: 'CARD_NUMBER1', card_cvv: 'CVV1' },
        { card_number: 'CARD_NUMBER2', card_cvv: 'CVV2' },
    ]

    const insertReq = new InsertRequest(
        "TABLE_NAME",
        insertData,
    )

    const insertOptions = new InsertOptions()
    //use setters for setting options
    insertOptions.setReturnTokens(true);
    insertOptions.setTokenMode(BYOT.ENABLE);
    insertOptions.setTokens([
        { card_number: 'TOKEN1', card_cvv: 'TOKEN2' },
        { card_number: 'TOKEN3', card_cvv: 'TOKEN4' }
    ]);
    // insertOptions.setContinueOnError(true); // if continue on error is set true we will return requestIndex for errors 

    skyflowClient.vault("VAULT_ID").insert(
        insertReq,
        insertOptions
    ).then(resp => {
        console.log(resp);
    }).catch(err => {
        console.log(JSON.stringify(err));
    });
} catch (err) {
    console.log(JSON.stringify(err));
}