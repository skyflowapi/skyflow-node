import { Credentials, DeleteRequest, Env, LogLevel, Skyflow, VaultConfig, SkyflowConfig } from 'skyflow-node';

try {
    // To generate Bearer Token from credentials string.
    const cred: Object = {
        clientID: '<YOUR_CLIENT_ID>',
        clientName: '<YOUR_CLIENT_NAME>',
        keyID: '<YOUR_KEY_ID>',
        tokenURI: '<YOUR_TOKEN_URI>',
        privateKey: '<YOUR_PEM_PRIVATE_KEY>',
    };

    // please pass one of apiKey, token, credentialsString & path as credentials
    const skyflowCredentials: Credentials = {
        credentialsString: JSON.stringify(cred),
    };

    // please pass one of apiKey, token, credentialsString & path as credentials
    const credentials: Credentials = {
        token: 'BEARER_TOKEN', // bearer token 
    };

    const primaryVaultConfig: VaultConfig = {
        vaultId: 'VAULT_ID1',      // primary vault
        clusterId: 'CLUSTER_ID1',  // ID from your vault URL Eg https://{clusterId}.vault.skyflowapis.com
        env: Env.PROD,  // Env by default it is set to PROD
        credentials: credentials,   // individual credentials
    };

    // skyflow config
    const skyflowConfig: SkyflowConfig = {
        // pass array vault configs
        vaultConfigs: [
            primaryVaultConfig,
        ],
        skyflowCredentials: skyflowCredentials, // skyflow credentials will be used if no individual credentials are passed
        logLevel: LogLevel.ERROR,   // set log level by default it is set to PROD
    };

    // initialize skyflow client
    const skyflowClient: Skyflow = new Skyflow(skyflowConfig);

    const vaultConfig: VaultConfig = {
        vaultId: 'VAULT_ID2',      // secondary vault
        clusterId: 'CLUSTER_ID2',  // ID from your vault URL Eg https://{clusterId}.vault.skyflowapis.com
        env: Env.PROD,  // Env by default it is set to PROD
        // if you don't specify individual credentials, skyflow credentials will be used
    };

    //add vault config on the fly
    skyflowClient.addVaultConfig(vaultConfig);

    const updatedVaultConfig: VaultConfig = {
        vaultId: 'VAULT_ID2',      // vault Id and cluster Id is unique
        clusterId: 'CLUSTER_ID2',  // ID from your vault URL Eg https://{clusterId}.vault.skyflowapis.com
        credentials: credentials, //update credentials 
    };
    //update vault config on the fly
    skyflowClient.updateVaultConfig(updatedVaultConfig);

    //perform operations 
    const deleteIds: Array<string> = [
        'SKYLFOW_ID1',
        'SKYLFOW_ID2',
    ]

    const tableName: string = 'TABLE_NAME';

    const deleteRequest: DeleteRequest = new DeleteRequest(
        tableName,
        deleteIds,
    );

    //perform delete call if you don't specify vault() it will return the first valid vault
    skyflowClient.vault('VAULT_ID2').delete(deleteRequest);

    //remove vault on the fly
    skyflowClient.removeVaultConfig('VAULT_ID');
} catch (err) {
    console.log(JSON.stringify(err));
}