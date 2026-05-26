# Migrate from V1 to V2

This guide outlines the steps required to migrate the Skyflow Node SDK from version 1 (V1) to version 2 (V2).

## Authentication

In V2, multiple authentication options have been introduced. You can now provide credentials in the following ways:

- **API Key**
- **Environment Variable** (`SKYFLOW_CREDENTIALS`) (**Recommended**)
- **Path to Credentials JSON File**
- **Stringified JSON of Credentials**
- **Bearer Token**

These options allow you to choose the authentication method that best suits your use case.

### v1 Authentication: Pass the auth function below as a parameter to the getBearerToken key

```typescript
// sample function to retrieve a bearer token from an environment variable
// customize this according to your environment and security posture
const auth = function () {
  return new Promise((resolve, reject) => {
    resolve(process.env.VAULT_BEARER_TOKEN);
  });
};
```

#### v2 Authentication: Credentials object

```typescript
import { Credentials } from 'skyflow-node';

const credentials: Credentials = { 
    apiKey: "<YOUR_SKYFLOW_API_KEY>"
};
```

// Option 2: Environment Variables (Recommended)
// Set SKYFLOW_CREDENTIALS in your environment

// Option 3: Credentials File

```typescript
const credentials: Credentials = { path: "<YOUR_CREDENTIALS_FILE_PATH>" };
```

// Option 4: Stringified JSON

```typescript
const credentials: Credentials = {
  credentialsString: JSON.stringify(process.env.SKYFLOW_CREDENTIALS),
};
```

// Option 5: Bearer Token

```typescript
const credentials: Credentials = { token: "<YOUR_BEARER_TOKEN>" };
```

## Initializing the client

V2 introduces TypeScript support and multi-vault support, allowing you to configure multiple vaults during client initialization.

In V2, the log level is tied to each individual client instance.

During client initialization, you can pass the following parameters:

- **`vaultId`** and **`clusterId`**: These values are derived from the vault ID & vault URL.
- **`env`**: Specify the environment (e.g., SANDBOX or PROD).
- **`credentials`**: The necessary authentication credentials.

#### V1 (Old)

```javascript
// Initialize the Skyflow Vault client

const vault = Skyflow.init({
  // Id of the vault that the client should connect to.
  vaultID: "string",
  // URL of the vault that the client should connect to.
  vaultURL: "string",
  // Helper function generates a Skyflow bearer token.
  getBearerToken: auth,
});
```

#### V2 (New)

```typescript
import { Credentials, VaultConfig, SkyflowConfig, Env, LogLevel, Skyflow } from 'skyflow-node';

// Step 1: Configure API Key Credentials
const credentials: Credentials = { apiKey: '<YOUR_API_KEY>' };

// Step 2: Configure Vault
const primaryVaultConfig: VaultConfig = {
   vaultId: '<YOUR_VAULT>',     // Primary vault
   clusterId: '<YOUR_CLUSTER>', // ID from your vault URL e.g., https://{clusterId}.vault.skyflowapis.com
   env: Env.PROD,               // Deployment environment (PROD by default)
   credentials: credentials,    // Authentication method
};

// Step 3: Configure Skyflow Client
const skyflowConfig: SkyflowConfig = {
    vaultConfigs: [primaryVaultConfig],
    skyflowCredentials: credentials, // Skyflow credentials will be used if no individual credentials are passed
    logLevel: LogLevel.INFO,        // Recommended to use LogLevel.ERROR in production environment.
};

// Initialize Skyflow Client
const skyflowClient: Skyflow = new Skyflow(skyflowConfig);
```

### Key Changes:

- `vaultURL` replaced with `clusterId`.
- Added environment specification (`env`).
- Instance-specific log levels.
- TypeScript support with type definitions

---

### Request and Response Structure

In v2, with the introduction of TypeScript support, you can now pass an **InsertRequest** of type **InsertRequest**. This request requires:

- **`tableName`**: The name of the table.
- **`insertData`**: An array of objects containing the data to be inserted

The response will be of type InsertResponse, which contains insertedFields and errors.

**Note:** Similar patterns apply to other operations like Get, Update, Delete. See the [README](../README.md) for complete examples.

#### V1 (Old) - Request Building

```javascript
const result = skyflow.insert({
  records: [
    {
      fields: {
        card_number: "411111111111111",
        expiry_date: "11/22",
        fullname: "firstNameTest",
      },
      table: "cards",
    },
  ],
});
```

#### V2 (New) - Request Building

```typescript
// Prepare Insertion Data
const insertData: Record<string, unknown>[] = [
  { card_number: "4111111111111112" }, // Example sensitive data
];

// Create Insert Request
const insertReq: InsertRequest = new InsertRequest(
  "<SENSITIVE_DATA_TABLE>", // Replace with your actual table name
  insertData,
);

// Perform Secure Insertion
const response: InsertResponse = await skyflowClient
  .vault("<VAULT_ID>")
  .insert(insertReq);
```

#### V1 (Old) - Response Structure

```json
{
  "records": [
    {
      "table": "cards",
      "fields": {
        "card_number": "f37186-e7e2-466f-91e5-48e2bcbc1",
        "expiry_date": "1989cb56-63a-4482-adf-1f74cd1a5"
      }
    }
  ]
}
```

#### V2 (New) - Response Structure

```javascript
InsertResponse(
   insertedFields : [
       {
           skyflowId : "ID1",
           "<FIELD_NAME1>": "<TOKEN1>", // removed tokens key
           "<FIELD_NAME2>": "<TOKEN2>"
       },
       {
           skyflowId : "ID2",
           "<FIELD_NAME3>": "<TOKEN3>",
           "<FIELD_NAME4>": "<TOKEN4>"
       }
   ],
   errors: null
);
```

---

### Request Options

In V2, we have introduced inbuilt **InsertOptions** classes. These allow you to use setters to configure options instead of passing a plain object with key-value pairs.

#### V1 (Old)

```javascript
const options = {
  tokens: true,
  // other options
};
```

#### V2 (New)

```typescript
import { InsertOptions } from 'skyflow-node';

const insertOptions: InsertOptions = new InsertOptions();
insertOptions.setReturnTokens(true); // Optional: Get tokens for inserted data
insertOptions.setContinueOnError(true); // Optional: Continue on partial errors
```

---

### Error Structure

In V2, we have enriched the error details to provide better debugging capabilities.
The error response now includes:

- **`httpStatus`**: The HTTP status text (e.g. `"Bad Request"`).
- **`grpcCode`**: The gRPC code associated with the error.
- **`httpCode`**: The HTTP status code number.
- **`details & message`**: A detailed description of the error.
- **`requestId`**: A unique request identifier for easier debugging.

> **Deprecated names** — `http_status`, `grpc_code`, `http_code`, and `request_ID` still work but will log a deprecation warning and will be removed in v3. Use the camelCase names above.

#### V1 (Old) - Error Structure

```javascript
{
  code: string | number,
  description: string
}
```

#### V2 (New) - Error Structure

```typescript
{
    httpStatus?: string | number | null,
    grpcCode?: string | number | null,
    httpCode?: string | number | null,
    message: string,
    requestId?: string | null,
    details?: Array<string> | null,
}
```
