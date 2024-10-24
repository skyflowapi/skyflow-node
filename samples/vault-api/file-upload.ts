import { Env, FileUploadRequest, LogLevel, Skyflow } from "skyflow-node";

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

const uploadReq = new FileUploadRequest(
    "TABLE_NAME",
    "SKYFLOW_ID",
    "COLUMN_NAME",
    "FILE_PATH"
);

skyflow_client.vault("VAULT_ID").uploadFile(
    uploadReq
).then(response=>{
    console.log(response);
}).catch(error=>{
    console.log(JSON.stringify(error));
});