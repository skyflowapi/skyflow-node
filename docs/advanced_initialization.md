# Advanced Skyflow Client Initialization

This guide demonstrates advanced initialization patterns for the Skyflow Node SDK, including multiple vault configurations and different credential types.

## Multiple Vault Configuration Example

```typescript
import {
  Credentials,
  Env,
  LogLevel,
  Skyflow,
  VaultConfig,
  SkyflowConfig,
} from "skyflow-node";

/*
Example program to initialize the Skyflow client with various configurations.
The Skyflow client facilitates secure interactions with the Skyflow vault,
such as securely managing sensitive data.
*/

// Step 1: Define the primary credentials for authentication.
// Note: Only one type of credential can be used at a time. You can choose between:
// - API key
// - Bearer token
// - A credentials string (JSON-formatted)
// - A file path to a credentials file.

// Initialize primary credentials using a Bearer token for authentication.
const primaryCredentials: Credentials = {
  token: "<BEARER_TOKEN>", // Replace <BEARER_TOKEN> with your actual authentication token.
};

// Step 2: Configure the primary vault details.
// VaultConfig stores all necessary details to connect to a specific Skyflow vault.

const primaryVaultConfig: VaultConfig = {
  vaultId: "<PRIMARY_VAULT_ID>", // Replace with your primary vault ID
  clusterId: "<CLUSTER_ID>", // Replace with the cluster ID (part of the vault URL, e.g., https://{clusterId}.vault.skyflowapis.com).
  env: Env.PROD, // Set the environment (PROD, SANDBOX, STAGE, DEV).
  credentials: primaryCredentials, // Attach the primary credentials to this vault configuration.
};

// Step 3: Create credentials as a JSON object (if a Bearer Token is not provided).
// Demonstrates an alternate approach to authenticate with Skyflow using a credentials object.
const skyflowCredentials: object = {
  clientID: "<YOUR_CLIENT_ID>", // Replace with your Client ID.
  clientName: "<YOUR_CLIENT_NAME>", // Replace with your Client Name.
  tokenURI: "<YOUR_TOKEN_URI>", // Replace with the Token URI.
  keyID: "<YOUR_KEY_ID>", // Replace with your Key ID.
  privateKey: "<YOUR_PRIVATE_KEY>", // Replace with your Private Key.
};

// Step 4: Convert the JSON object to a string and use it as credentials.
// This approach allows the use of dynamically generated or pre-configured credentials.
const credentialsString: string = JSON.stringify(skyflowCredentials); // Converts JSON object to string for use as credentials.

// Step 5: Define secondary credentials (API key-based authentication as an example).
// Demonstrates a different type of authentication mechanism for Skyflow vaults.
const secondaryCredentials: Credentials = {
  apiKey: "<API_KEY>", // Replace with your API Key for authentication.
};

// Step 6: Configure the secondary vault details.
// A secondary vault configuration can be used for operations involving multiple vaults.
const secondaryVaultConfig: VaultConfig = {
  vaultId: "<SECONDARY_VAULT_ID>", // Replace with your secondary vault's ID.
  clusterId: "<CLUSTER_ID>", // Replace with the corresponding cluster ID.
  env: Env.PROD, // Set the environment for this vault.
  credentials: secondaryCredentials, // Attach the secondary credentials to this configuration.
};

// Step 7: Define tertiary credentials using a path to a credentials JSON file.
// This method demonstrates an alternative authentication method.
const tertiaryCredentials: Credentials = {
  path: "<YOUR_CREDENTIALS_FILE_PATH>", // Replace with the path to your credentials file.
};

// Step 8: Configure the tertiary vault details.
const tertiaryVaultConfig: VaultConfig = {
  vaultId: "<TERTIARY_VAULT_ID>", // Replace with the tertiary vault ID.
  clusterId: "<CLUSTER_ID>", // Replace with the corresponding cluster ID.
  env: Env.PROD, // Set the environment for this vault.
  credentials: tertiaryCredentials, // Attach the tertiary credentials.
};

// Step 9: Build and initialize the Skyflow client after creating Skyflow Config
// Skyflow client is configured with multiple vaults and credentials.

const skyflowConfig: SkyflowConfig = {
  vaultConfigs: [primaryVaultConfig, secondaryVaultConfig, tertiaryVaultConfig], // Add the primary, secondary and tertiary vault configurations.
  skyflowCredentials: skyflowCredentials, // Add JSON-formatted credentials if applicable.
  logLevel: LogLevel.INFO, // Recommended to use LogLevel.ERROR in production environment.
};

// Step 10: Initialize Skyflow Client
const skyflowClient: Skyflow = new Skyflow(skyflowConfig);

// The Skyflow client is now fully initialized.
// Use the `skyflowClient` object to perform secure operations such as:
// - Inserting data
// - Retrieving data
// - Deleting data
// within the configured Skyflow vaults.
```
