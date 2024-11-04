import { Env, GetOptions, LogLevel, Skyflow, GetColumnRequest } from "skyflow-node";

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
        path: "PATH_TO_CREDENTIALS_JSON", // path to credentials file 
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

    const columnValues = [
        'VALUE1',
        'VALUE2',
    ]

    const getRequest = new GetColumnRequest(
        "TABLE_NAME",
        "COLUMN_NAME", //Name of the column. It must be configured as unique in the schema.
        columnValues //Column values of the records to return
    )

    const getOptions = new GetOptions()
    //use setters of setting options refer to skyflow docs for more options
    getOptions.setReturnTokens(true);

    skyflowClient.vault("VAULT_ID").get(
        getRequest,
        getOptions
    ).then(response => {
        console.log(response);
    }).catch(error => {
        console.log(JSON.stringify(error));
    });
} catch (err) {
    console.log(JSON.stringify(err));
}