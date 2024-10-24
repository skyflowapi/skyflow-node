import { DeleteRequest, Env, LogLevel, Skyflow } from "skyflow-node";

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
    token: "BEARER_TOKEN", // bearer token 
}

const skyflow_client = new Skyflow({
    vaultConfigs: [
        {
            vaultId: "VAULT_ID1",      // primary vault
            clusterId: "CLUSTER_ID1",  // ID from your vault URL Eg https://{clusterId}.vault.skyflowapis.com
            env: Env.PROD,  // Env by deault it is set to PROD
            credentials: credentials   // indiviudal credentails
        }
    ],
    skyflowCredentials: skyflowCredentials, // skyflow credentials will be used if no individual creds are passed
    logLevel:LogLevel.ERROR   // set loglevel by deault it is set to PROD
});

//add vault config on the go
skyflow_client.addVaultConfig(
    {
        vaultId: "VAULT_ID2",      // secondary vault
        clusterId: "CLUSTER_ID2",  // ID from your vault URL Eg https://{clusterId}.vault.skyflowapis.com
        env: Env.PROD,  // Env by deault it is set to PROD
        // if you dont specify individual creds, skyflow creds will be used
    }
);

//add vault config on the go
skyflow_client.updateVaultConfig(
    {
        vaultId: "VAULT_ID2",      // vault Id and cluster id is unique
        clusterId: "CLUSTER_ID2",  // ID from your vault URL Eg https://{clusterId}.vault.skyflowapis.com
        credentials: credentials, //update credentials 
    }
);

//perform operations 
const deleteIds = [
    "SKYLFOW_ID1",
    "SKYLFOW_ID1"
]

const deleteRequest = new DeleteRequest(
    "TABLE_NAME",
    deleteIds
);

//perform delete call if you dont specify valut() it will return the first valid vault
skyflow_client.vault("VALUT_ID2").delete(deleteRequest);

skyflow_client.removeVaultConfig("VAULT_ID");