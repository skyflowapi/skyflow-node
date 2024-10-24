import { Env, GetOptions, GetRequest, LogLevel, Skyflow } from "skyflow-node";

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
    path: "PATH_TO_CREDENTIALS_JSON", // bearer token 
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
    logLevel:LogLevel.ERROR   // set loglevel by deault it is set to PROD
});

const getIds = [
    'SKYFLOW_ID1',
    'SKYFLOW_ID2',
]

const getRequest = new GetRequest(
    "TABLE_NAME",
    getIds
)

const getOptions = new GetOptions()
//use setters of setting options refer to skyflow docs for more options
getOptions.setReturnTokens(true);

skyflow_client.vault("VAULT_ID").get(
    getRequest,
    getOptions
).then(response => {
    console.log(response);
}).catch(error => {
    console.log(JSON.stringify(error));
});
