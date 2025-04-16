import {
    Credentials,
    DetokenizeOptions,
    DetokenizeRequest,
    DetokenizeResponse,
    Env,
    LogLevel,
    RedactionType,
    Skyflow,
    SkyflowError,
    VaultConfig,
    SkyflowConfig
} from 'skyflow-node';

/**
* This example demonstrates how to configure and use the Skyflow SDK
* to detokenize sensitive data stored in a Skyflow vault.
* It includes setting up credentials, configuring the vault, and
* making a detokenization request. The code also implements a retry
* mechanism to handle unauthorized access errors (HTTP 401).
*/
async function detokenizeData(skyflowClient: Skyflow, vaultId: string) {
    try {
        // Creating a list of tokens to be detokenized
        const detokenizeData: Array<string> = ['<YOUR_TOKEN_VALUE_1>', '<YOUR_TOKEN_VALUE_2>'];

        // Building a detokenization request
        const detokenizeRequest: DetokenizeRequest = new DetokenizeRequest(
            detokenizeData,
            RedactionType.PLAIN_TEXT // Redaction type (e.g., PLAIN_TEXT)
        );

        // Configuring detokenization options
        const detokenizeOptions: DetokenizeOptions = new DetokenizeOptions();
        detokenizeOptions.setContinueOnError(false); // Stop on error
        detokenizeOptions.setDownloadURL(false);    // Disable download URL generation

        // Sending the detokenization request and receiving the response
        const response: DetokenizeResponse = await skyflowClient
            .vault(vaultId)
            .detokenize(detokenizeRequest, detokenizeOptions);

        // Printing the detokenized response
        console.log('Detokenization successful:', response);
    } catch (err) {
        throw err;
    }
}

async function main() {
    try {
        // Setting up credentials for accessing the Skyflow vault
        const credentials: Credentials = {
            credentialsString: '<YOUR_CREDENTIALS_STRING>', // Credentials string for authentication
        };

        // Configuring the Skyflow vault with necessary details
        const primaryVaultConfig: VaultConfig = {
            vaultId: '<YOUR_VAULT_ID>',          // Vault ID
            clusterId: '<YOUR_CLUSTER_ID>',      // Cluster ID
            env: Env.PROD,                       // Environment set to PROD
            credentials: credentials             // Setting credentials
        };

        // Creating a Skyflow client instance with the configured vault
        const skyflowConfig: SkyflowConfig = {
            vaultConfigs: [primaryVaultConfig],
            logLevel: LogLevel.ERROR,            // Setting log level to ERROR
        };

        const skyflowClient: Skyflow = new Skyflow(skyflowConfig);

        // Attempting to detokenize data using the Skyflow client
        try {
            await detokenizeData(skyflowClient, primaryVaultConfig.vaultId);
        } catch (err) {
            // Retry detokenization if the error is due to unauthorized access (HTTP 401)
            if (err instanceof SkyflowError && err.error?.http_code === 401) {
                console.warn('Unauthorized access detected. Retrying...');
                await detokenizeData(skyflowClient, primaryVaultConfig.vaultId);
            } else {
                // Rethrow the exception for other error codes
                throw err;
            }
        }
    } catch (err) {
        // Handling any exceptions that occur during the process
        console.error('An error occurred:', err);
    }
}

// Invoke the main function
main();
