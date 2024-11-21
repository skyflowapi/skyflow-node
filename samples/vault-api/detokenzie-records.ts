import { Credentials, DetokenizeOptions, DetokenizeRequest, DetokenizeResponse, Env, LogLevel, RedactionType, Skyflow, SkyflowError, VaultConfig, SkyflowConfig } from 'skyflow-node';

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
        token: 'TOKEN', // bearer token 
    };

    const primaryVaultConfig: VaultConfig = {
        vaultId: 'VAULT_ID',      // primary vault
        clusterId: 'CLUSTER_ID',  // ID from your vault URL Eg https://{clusterId}.vault.skyflowapis.com
        env: Env.PROD,  // Env by default it is set to PROD
        credentials: credentials,  // individual credentials
    };

    const skyflowConfig: SkyflowConfig = {
        vaultConfigs: [
            primaryVaultConfig,
        ],
        skyflowCredentials: skyflowCredentials, // skyflow credentials will be used if no individual credentials are passed
        logLevel: LogLevel.ERROR,  // set log level by default it is set to PROD
    };

    const skyflowClient: Skyflow = new Skyflow(skyflowConfig);

    const detokenizeData: Array<string> = [
        'TOKEN1',
        'TOKEN2',
        'TOKEN3',
    ];

    const redactionType: RedactionType = RedactionType.REDACTED;

    const detokenizeRequest: DetokenizeRequest = new DetokenizeRequest(
        detokenizeData,
        redactionType,
    );

    const detokenizeOptions: DetokenizeOptions = new DetokenizeOptions();
    // options can be set using setters
    detokenizeOptions.setContinueOnError(true);

    detokenizeOptions.setDownloadURL(false);

    skyflowClient.vault('VAULT_ID').detokenize(
        detokenizeRequest,
        detokenizeOptions
    ).then((response: DetokenizeResponse) => {
        console.log(response);
    }).catch((error: SkyflowError) => {
        console.log(JSON.stringify(error));
    });

} catch (err) {
    console.log(JSON.stringify(err));
}