import { Env, GetRequest, GetResponse, InsertRequest, LogLevel, Skyflow } from "skyflow-node";

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

//add vault config from Sandbox env
skyflow_client.addVaultConfig(
    {
        vaultId: "VAULT_ID2",      // secondary vault
        clusterId: "CLUSTER_ID2",  // ID from your vault URL Eg https://{clusterId}.vault.skyflowapis.com
        env: Env.SANDBOX,  // Env by deault it is set to PROD
        // if you dont specify individual creds, skyflow creds will be used
    }
);

//perform operations 
const getIds = [
    "SKYLFOW_ID1",
    "SKYLFOW_ID1"
]

const getRequest = new GetRequest(
    "TABLE_NAME",
    getIds
);

//perform delete call if you dont specify valut() it will return the first valid vault
skyflow_client.vault("VALUT_ID1").get(getRequest)
.then(response=>{
    //
    const getResponse: GetResponse = response as GetResponse;
    console.log(getResponse.data);

    //get data from prod vault and insert data to SANDBOX vault
    const insertRequest = new InsertRequest(
        "TABLE_NAME",
        getResponse.data!,
    );
    skyflow_client.vault("VAULT_ID2").insert(
        insertRequest
    ).then(resp=>{
        console.log(resp);
    }).catch(err=>{
        console.log(JSON.stringify(err));
    });
})
.catch(err=>{
    console.log(JSON.stringify(err));
});
