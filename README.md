# Skyflow Node.js SDK

The Skyflow SDK for Node.js, Deno, Bun, and Cloudflare Workers.

[![CI](https://img.shields.io/static/v1?label=CI&message=passing&color=green?style=plastic&logo=github)](https://github.com/skyflowapi/skyflow-node/actions)
[![GitHub release](https://badge.fury.io/js/skyflow-node.svg)](https://www.npmjs.com/package/skyflow-node)
[![License](https://img.shields.io/github/license/skyflowapi/skyflow-node)](https://github.com/skyflowapi/skyflow-node/blob/main/LICENSE)

## Table of contents

- [Skyflow Node.js SDK](#skyflow-nodejs-sdk)
  - [Table of contents](#table-of-contents)
  - [Overview](#overview)
  - [Installation](#installation)
    - [Require](#require)
    - [ES modules](#es-modules)
    - [All imports](#all-imports)
  - [Quickstart](#quickstart)
    - [Authenticate](#authenticate)
    - [Initialize the client](#initialize-the-client)
    - [Insert data into the vault](#insert-data-into-the-vault)
  - [Vault](#vault)
    - [Insert and tokenize data](#insert-and-tokenize-data)
      - [Construct an insert request](#construct-an-insert-request)
      - [Insert example with `continueOnError` option](#insert-example-with-continueonerror-option)
    - [Detokenize](#detokenize)
      - [Construct a detokenize request](#construct-a-detokenize-request)
      - [An example of a detokenize call](#an-example-of-a-detokenize-call)
      - [An example of a detokenize call with `continueOnError` option:](#an-example-of-a-detokenize-call-with-continueonerror-option)
    - [Tokenize](#tokenize)
      - [Construct a tokenize request](#construct-a-tokenize-request)
      - [An example of Tokenize call](#an-example-of-tokenize-call)
    - [Get](#get)
      - [Construct a get request](#construct-a-get-request)
      - [Get by skyflow IDs](#get-by-skyflow-ids)
      - [Get tokens for records](#get-tokens-for-records)
      - [An example of get call to retrieve tokens using Skyflow IDs:](#an-example-of-get-call-to-retrieve-tokens-using-skyflow-ids)
      - [Get by column name and column values](#get-by-column-name-and-column-values)
      - [An example of get call to retrieve data using column name and column values:](#an-example-of-get-call-to-retrieve-data-using-column-name-and-column-values)
      - [Redaction Types](#redaction-types)
    - [Update](#update)
      - [Construct an update request](#construct-an-update-request)
      - [An example of update call](#an-example-of-update-call)
    - [Delete](#delete)
      - [Construct a delete request](#construct-a-delete-request)
      - [An example of delete call](#an-example-of-delete-call)
    - [Query](#query)
      - [Construct a query request](#construct-a-query-request)
      - [An example of query call](#an-example-of-query-call)
    - [Upload File](#upload-file)
    - [An example of file upload call](#an-example-of-file-upload-call)
  - [Detect](#detect)
    - [Deidentify Text `deidentifyText()`](#deidentify-text-deidentifytext)
      - [An example of a deidentify text call](#an-example-of-a-deidentify-text-call)
    - [Reidentify Text](#reidentify-text)
      - [An example of a reidentify text call](#an-example-of-a-reidentify-text-call)
    - [Deidentify File](#deidentify-file)
      - [An example of a deidentify file](#an-example-of-a-deidentify-file)
    - [Get run](#get-run)
      - [An example of a get run function](#an-example-of-a-get-run-function)
  - [Connections](#connections)
    - [Invoke a connection](#invoke-a-connection)
      - [Construct an invoke connection request](#construct-an-invoke-connection-request)
  - [Governance, identity, and access control](#governance-identity-and-access-control)
    - [Generate bearer tokens for authentication \& authorization](#generate-bearer-tokens-for-authentication--authorization)
      - [Generate a bearer token](#generate-a-bearer-token)
        - [`generateBearerToken(filepath)`](#generatebearertokenfilepath)
        - [`generateBearerTokenFromCreds(credentials)`](#generatebearertokenfromcredscredentials)
      - [Generate bearer tokens with context](#generate-bearer-tokens-with-context)
      - [Generate scoped bearer tokens](#generate-scoped-bearer-tokens)
      - [Generate signed data tokens](#generate-signed-data-tokens)
  - [Logging \& error handling](#logging--error-handling)
    - [Example `skyflowConfig.logLevel: LogLevel.INFO`](#example-skyflowconfigloglevel-loglevelinfo)
      - [Bearer token expiration edge cases](#bearer-token-expiration-edge-cases)
  - [Security](#security)
    - [Reporting a Vulnerability](#reporting-a-vulnerability)

## Overview

The Skyflow SDK enables you to connect to your Skyflow Vault(s) to securely handle sensitive data at rest, in-transit, and in-use.

> [!IMPORTANT]  
> This readme covers version 2 of the SDK.  
> For version 1 see the [v1.14.2 README](https://github.com/skyflowapi/skyflow-node/tree/1.14.2).  
> For more information on how to migrate see [MIGRATE_TO_V2.md](docs/migrate_to_v2.md).

## Installation

Requires Node v12.22.12 and above.

```sh
npm install skyflow-node
```

Depending on your project setup, you may use either the `require` method (common in Node.js projects) or the `import` statement (common in projects using ES modules).

### Require

```typescript
const { Skyflow } = require("skyflow-node");
```

### ES modules

```typescript
import { Skyflow } from "skyflow-node";
```

### All imports

```typescript
import {
  Skyflow, // Vault client
  isExpired, // JWT auth helpers
  LogLevel, // logging options
} from "skyflow-node";
```

## Quickstart

Get started quickly with the essential steps: authenticate, initialize the client, and perform a basic vault operation. This section provides a minimal setup to help you integrate the SDK efficiently.

### Authenticate

You can use an API key to authenticate and authorize requests to an API. For authenticating via bearer tokens and different supported bearer token types, refer to the [Authenticate with bearer tokens](#authenticate-with-bearer-tokens) section.

```javascript
// create a new credentials object
const credentials = { apiKey: "<YOUR_API_KEY>" }; //add your API key in credentials
```

### Initialize the client

To get started, you must first initialize the skyflow client. While initializing the skyflow client, you can specify different types of credentials.

1. **API keys**  
   A unique identifier used to authenticate and authorize requests to an API.

2. **Bearer tokens**  
   A temporary access token used to authenticate API requests, typically included in the
   Authorization header.

3. **Service account credentials file path**  
   The file path pointing to a JSON file containing credentials for a service account, used
   for secure API access.

4. **Service account credentials string**  
   JSON-formatted string containing service account credentials, often used as an alternative to a file for programmatic authentication.

Note: Only one type of credential can be used at a time. If multiple credentials are provided, the last one added will take precedence.

```javascript
import { Skyflow, SkyflowConfig, VaultConfig, Env, LogLevel } from 'skyflow-node';

// Configure credentials
const skyflowCredentials = {
    clientID: '<YOUR_CLIENT_ID>',
    clientName: '<YOUR_CLIENT_NAME>',
    tokenURI: '<YOUR_TOKEN_URI>',
    keyID: '<YOUR_KEY_ID>',
    privateKey: '<YOUR_PRIVATE_KEY>'
};

// Configure vault
const vaultConfig: VaultConfig = {
    vaultId: '<VAULT_ID>',
    clusterId: '<CLUSTER_ID>',
    env: Env.PROD
};

// Initialize Skyflow client
const skyflowConfig: SkyflowConfig = {
    vaultConfigs: [vaultConfig],
    skyflowCredentials: skyflowCredentials,
    logLevel: LogLevel.ERROR
};

const skyflowClient: Skyflow = new Skyflow(skyflowConfig);
```

For advanced initialization examples including multiple vaults and different credential types, see [docs/advanced_initialization.md](docs/advanced_initialization.md).

Notes

- If both Skyflow common credentials and individual credentials at the configuration level are specified, the individual credentials at the configuration level will take precedence.
- If neither Skyflow common credentials nor individual configuration-level credentials are provided, the SDK attempts to retrieve credentials from the `SKYFLOW_CREDENTIALS` environment variable.
- All Vault operations require a client instance.

### Insert data into the vault

To insert data into your vault, use the `insert` method. The `InsertRequest` class creates an insert request, which includes the values to be inserted as a list of records. Below is a simple example to get started. For advanced options, check out [Insert data into the vault](#insert-data-into-the-vault-1) section.

```javascript
import { InsertRequest, InsertOptions } from 'skyflow-node';

// Insert sensitive data into the vault
const insertData = [{ card_number: '4111111111111112', cardholder_name: 'John Doe' }];
const insertReq = new InsertRequest('table1', insertData);

const insertOptions = new InsertOptions();
insertOptions.setReturnTokens(true);

const insertResponse = await skyflowClient
  .vault(vaultId)
  .insert(insertReq, insertOptions);

console.log('Insert response:', insertResponse);
```

## Vault

The [Vault](https://docs.skyflow.com/docs/vaults) performs operations on the vault such as inserting records, detokenizing tokens, retrieving tokens for list of `skyflow_id`'s and to invoke the Connection.

### Insert and tokenize data

Apart from using the `insert` method to insert data into your vault covered in [Quickstart](#quickstart), you can also pass options to `insert` method to enable additional functionality such as returning tokenized data, upserting records, or allowing bulk operations to continue despite errors.

#### Construct an insert request

```typescript
import {
    InsertOptions,
    InsertRequest,
    SkyflowError,
    InsertResponse
} from 'skyflow-node';

// Example program to demonstrate inserting data into a Skyflow vault,
// along with corresponding InsertRequest schema.

try {
  // Initialize Skyflow client
  // Step 1: Prepare the data to be inserted into the Skyflow vault
  const insertData: Record<string, unknown>[] = [
    {
        <FIELD_NAME_1>: '<VALUE_1>',  // Replace with actual field name and value
        <FIELD_NAME_2>: '<VALUE_2>',  // Replace with actual field name and value
    },
    {
        <FIELD_NAME_1>: '<VALUE_1>',  // Replace with actual field name and value
        <FIELD_NAME_2>: '<VALUE_2>',  // Replace with actual field name and value
    },
  ]

  // Step 2: Build an InsertRequest object with the table name and the data to insert
  const insertReq: InsertRequest = new InsertRequest(
      'table1',  // Specify the table in the vault where the data will be inserted
      insertData,  // Attach the data (records) to be inserted
  );

  // Step 3: Perform the insert operation using the Skyflow client
  const insertResponse: InsertResponse = await skyflowClient
          .vault('<VAULT_ID>')
          .insert(insertReq, insertOptions);
  // Replace <VAULT_ID> with your actual vault ID

  // Step 4: Print the response from the insert operation
  console.log('Insert response: ', insertResponse);
} catch(error) {
  // Step 5: Comprehensive Error Handling
  if (error instanceof SkyflowError) {
      console.error('Skyflow Specific Error:', {
          code: error.error?.http_code,
          message: error.message,
          details: error.error?.details
      });
  } else {
      console.error('Unexpected Error:', error);
  }
}
```

#### Insert example with `continueOnError` option

The `continueOnError` flag is a boolean that determines whether insert operation should proceed despite encountering partial errors. Set to `true` to allow the process to continue even if some errors occur.

> [!TIP]
> See the full example in the samples directory: [insert-continue-on-error.ts](samples/vault-api/insert-continue-on-error.ts)

**Insert call example with `upsert` option**  
An upsert operation checks for a record based on a unique column's value. If a match exists, the record is updated; otherwise, a new record is inserted.

```typescript
import {
  InsertOptions,
  InsertRequest,
  SkyflowError,
  InsertResponse,
} from "skyflow-node";

/*
This example demonstrates how to insert sensitive data (e.g., card information) into a Skyflow vault using the Skyflow client.

1. Initializes the Skyflow client.
2. Prepares a record with sensitive data (e.g., card number and cardholder name).
3. Creates an insert request for inserting the data into the Skyflow vault.
4. Specifies the field (cardholder_name) for upsert operations.
5. Prints the response of the insert operation.
*/

try {
  // Initialize Skyflow client
  // Step 1: Initialize a list to hold the data records for the insert/upsert operation
  const insertData: Record<string, unknown>[] = [
    // Step 2: Create a record with the field 'cardholder_name' to insert or upsert
    {
      cardholder_name: "John Doe", // Replace with actual cardholder name
    },
  ];

  // Step 3: Create Insert Request
  const insertReq: InsertRequest = new InsertRequest(
    "table1", // Specify the table in the vault where the data will be inserted
    insertData, // Attach the data (records) to be inserted
  );

  // Step 4: Set upsert column by configuring the insertion options
  const insertOptions: InsertOptions = new InsertOptions();
  insertOptions.setReturnTokens(true); // Optional: Specify if tokens should be returned upon successful insertion
  insertOptions.setUpsertColumn("cardholder_name");

  // Step 5: Perform the insert/upsert operation using the Skyflow client
  const insertResponse: InsertResponse = await skyflowClient
    .vault(primaryVaultConfig.vaultId)
    .insert(insertReq, insertOptions);

  // Step 6: Print the response from the insert operation
  console.log("Insert response: ", insertResponse);
} catch (error) {
  // Step 7: Comprehensive Error Handling
  if (error instanceof SkyflowError) {
    console.error("Skyflow Specific Error:", {
      code: error.error?.http_code,
      message: error.message,
      details: error.error?.details,
    });
  } else {
    console.error("Unexpected Error:", error);
  }
}
```

Skyflow returns tokens, with `upsert` support, for the record you just inserted.

```typescript
InsertResponse {
  insertedFields: [
    {
      skyflowId: "9fac9201-7b8a-4446-93f8-5244e1213bd1",
      cardholder_name: "73ce45ce-20fd-490e-9310-c1d4f603ee83"
    }
  ],
  errors: null
}
```

### Detokenize

To retrieve tokens from your vault, use the `detokenize` method. The `DetokenizeRequest` class requires a list of detokenization data as input. Additionally, you can provide optional parameters, such as the redaction type and the option to continue on error.

#### Construct a detokenize request

```typescript
import {
  DetokenizeOptions,
  DetokenizeRequest,
  DetokenizeResponse,
  DetokenizeData,
  SkyflowError,
} from "skyflow-node";

/*
This example demonstrates how to detokenize sensitive data from tokens stored in a Skyflow vault, along with corresponding DetokenizeRequest schema. 
*/

try {
  // Step 1: Prepare Detokenization Data
  const detokenizeData: DetokenizeData[] = [
    {
      token: "token1", // Token to be detokenized
      redactionType: RedactionType.PLAIN_TEXT, // Redaction type
    },
    {
      token: "token2", // Token to be detokenized
      redactionType: RedactionType.PLAIN_TEXT, // Redaction type
    },
  ];

  // Step 2: Create the DetokenizeRequest object with the tokens data
  const detokenizeRequest: DetokenizeRequest = new DetokenizeRequest(
    detokenizeData,
  );

  // Step 3: Configure Detokenize Options
  const detokenizeOptions: DetokenizeOptions = new DetokenizeOptions();
  detokenizeOptions.setContinueOnError(true); // Continue processing on errors
  detokenizeOptions.setDownloadURL(false); // Disable download URL generation

  // Step 4: Perform Detokenization
  const response: DetokenizeResponse = await skyflowClient
    .vault(primaryVaultConfig.vaultId)
    .detokenize(detokenizeRequest, detokenizeOptions);

  // Handle Successful Response
  console.log("Detokenization response:", response);
} catch (error) {
  // Comprehensive Error Handling
  if (error instanceof SkyflowError) {
    console.error("Skyflow Specific Error:", {
      code: error.error?.http_code,
      message: error.message,
      details: error.error?.details,
    });
  } else {
    console.error("Unexpected Error:", error);
  }
}
```

Notes:

- `redactionType` defaults to `RedactionType.PLAIN_TEXT`.
- `continueOnError` default value is `False`.

#### An [example](https://github.com/skyflowapi/skyflow-node/blob/v2/samples/vault-api/detokenzie-records.ts) of a detokenize call

```typescript
import {
  DetokenizeOptions,
  DetokenizeRequest,
  DetokenizeResponse,
  DetokenizeData,
  SkyflowError,
} from "skyflow-node";

/*
1. Initializes the Skyflow client.
2. Creates a list of tokens (e.g., credit card tokens) that represent the sensitive data.
3. Builds a detokenization request using the provided tokens and specifies how the redacted data should be returned.
4. Calls the Skyflow vault to detokenize the tokens and retrieves the detokenized data.
5. Prints the detokenization response, which contains the detokenized values or errors.
*/

try {
  // Step 1: Prepare Detokenization Data
  const detokenizeData: DetokenizeData[] = [
    {
      token: "9738-1683-0486-1480", // Replace with your actual token value
      redactionType: RedactionType.PLAIN_TEXT, // Redaction type
    },
    {
      token: "6184-6357-8409-6668", // Replace with your actual token value
      redactionType: RedactionType.PLAIN_TEXT, // Redaction type
    },
  ];

  // Step 2: Create the DetokenizeRequest object with the tokens data
  const detokenizeRequest: DetokenizeRequest = new DetokenizeRequest(
    detokenizeData,
  );

  // Step 3: Configure Detokenize Options
  const detokenizeOptions: DetokenizeOptions = new DetokenizeOptions();
  detokenizeOptions.setContinueOnError(false); // Stop the process if any token cannot be detokenized

  // Step 4: Perform Detokenization
  const response: DetokenizeResponse = await skyflowClient
    .vault(primaryVaultConfig.vaultId)
    .detokenize(detokenizeRequest, detokenizeOptions);

  // Handle Successful Response
  console.log("Detokenization response:", response);
} catch (error) {
  // Comprehensive Error Handling
  if (error instanceof SkyflowError) {
    console.error("Skyflow Specific Error:", {
      code: error.error?.http_code,
      message: error.message,
      details: error.error?.details,
    });
  } else {
    console.error("Unexpected Error:", error);
  }
}
```

Sample response:

```typescript
DetokenizeResponse {
  detokenizedFields: [
    {token: '9738-1683-0486-1480', value: '4111111111111115', type: 'STRING'},
    {token: '6184-6357-8409-6668', value: '4111111111111119', type: 'STRING'},
  ],
  errors: null
}
```

#### An example of a detokenize call with `continueOnError` option:

```typescript
import {
  DetokenizeOptions,
  DetokenizeRequest,
  DetokenizeResponse,
  DetokenizeData,
  SkyflowError,
} from "skyflow-node";

/*
1. Initializes the Skyflow client.
2. Creates a list of tokens (e.g., credit card tokens) that represent the sensitive data.
3. Builds a detokenization request using the provided tokens and specifies how the redacted data should be returned.
4. Calls the Skyflow vault to detokenize the tokens and retrieves the detokenized data.
5. Prints the detokenization response, which contains the detokenized values or errors.
*/

try {
  // Step 1: Prepare Detokenization Data
  const detokenizeData: DetokenizeData[] = [
    {
      token: "9738-1683-0486-1480", // Replace with your actual token value
      redactionType: RedactionType.PLAIN_TEXT, // Redaction type
    },
    {
      token: "6184-6357-8409-6668", // Replace with your actual token value
      redactionType: RedactionType.PLAIN_TEXT, // Redaction type
    },
    {
      token: "4914-9088-2814-3840", // Replace with your actual token value
      redactionType: RedactionType.PLAIN_TEXT, // Redaction type
    },
  ];

  // Step 2: Create the DetokenizeRequest object with the tokens and redaction type
  const detokenizeRequest: DetokenizeRequest = new DetokenizeRequest(
    detokenizeData,
    redactionType,
  );

  // Step 3: Configure Detokenize Options
  const detokenizeOptions: DetokenizeOptions = new DetokenizeOptions();
  detokenizeOptions.setContinueOnError(true); // Continue even if some tokens cannot be detokenized

  // Step 5: Perform Detokenization
  const response: DetokenizeResponse = await skyflowClient
    .vault(primaryVaultConfig.vaultId)
    .detokenize(detokenizeRequest, detokenizeOptions);

  // Handle Successful Response
  console.log("Detokenization response:", response);
} catch (error) {
  // Comprehensive Error Handling
  if (error instanceof SkyflowError) {
    console.error("Skyflow Specific Error:", {
      code: error.error?.http_code,
      message: error.message,
      details: error.error?.details,
    });
  } else {
    console.error("Unexpected Error:", error);
  }
}
```

Sample response:

```typescript
DetokenizeResponse {
  detokenizedFields: [
    {token: '9738-1683-0486-1480', value: '4111111111111115', type: 'STRING'},
    {token: '6184-6357-8409-6668', value: '4111111111111119', type: 'STRING'}
  ],
  errors: [
    {
      token: '4914-9088-2814-3840',
      error: 'Token Not Found'
    }
  ]
}
```

### Tokenize

Tokenization replaces sensitive data with unique identifier tokens. This approach protects sensitive information by securely storing the original data while allowing the use of tokens within your application.

To tokenize data, use the `tokenize` method. The `TokenizeRequest` class creates a tokenize request. In this request, you specify the values parameter, which is a list of column values objects. Each column value contains two properties: `value` and `columnGroup`.

#### Construct a tokenize request

```typescript
import {
  TokenizeRequest,
  TokenizeResponse,
  SkyflowError,
  TokenizeRequestType,
} from "skyflow-node";

try {
  // Initialize Skyflow Client
  // Step 1: Prepare Tokenization Data
  const columnValues: Array<TokenizeRequestType> = [
    { value: "<VALUE_1>", columnGroup: "<COLUMN_GROUP_1>" }, // Replace <VALUE_1> and <COLUMN_GROUP_1> with actual data
    { value: "<VALUE_2>", columnGroup: "<COLUMN_GROUP_2>" }, // Replace <VALUE_2> and <COLUMN_GROUP_2> with actual data
  ];

  // Step 2: Build the TokenizeRequest with the column values
  const tokenReq: TokenizeRequest = new TokenizeRequest(columnValues);

  // Step 3: Call the Skyflow vault to tokenize the sensitive data
  const response: TokenizeResponse = await skyflowClient
    .vault("<VAULT_ID>")
    .tokenize(tokenReq);
  // Replace <VAULT_ID> with your actual Skyflow vault ID

  // Step 4: Print the tokenization response, which contains the generated tokens or errors
  console.log("Tokenization Result:", response);
} catch (error) {
  // Step 5: Handle any errors that occur during the tokenization process
  if (error instanceof SkyflowError) {
    console.error("Skyflow Specific Error:", {
      code: error.error?.http_code,
      message: error.message,
      details: error.error?.details,
    });
  } else {
    console.error("Unexpected Error:", error);
  }
}
```

#### An [example](https://github.com/skyflowapi/skyflow-node/blob/v2/samples/vault-api/tokenize-records.ts) of Tokenize call

```typescript
import {
  TokenizeRequest,
  TokenizeResponse,
  SkyflowError,
  TokenizeRequestType,
} from "skyflow-node";

/*
This example demonstrates how to tokenize sensitive data (e.g., credit card information) using the Skyflow client.

1. Initializes the Skyflow client.
2. Creates a column value for sensitive data (e.g., credit card number).
3. Builds a tokenize request with the column value to be tokenized.
4. Sends the request to the Skyflow vault for tokenization.
5. Prints the tokenization response, which includes the token or errors.
*/

try {
  // Initialize Skyflow Client
  // Step 1: Prepare Tokenization Data
  const columnValues: Array<TokenizeRequestType> = [
    { value: "4111111111111111", columnGroup: "card_number_cg" },
  ];

  // Step 2: Build the TokenizeRequest with the column values
  const tokenReq: TokenizeRequest = new TokenizeRequest(columnValues);

  // Step 3: Call the Skyflow vault to tokenize the sensitive data
  const response: TokenizeResponse = await skyflowClient
    .vault(primaryVaultConfig.vaultId)
    .tokenize(tokenReq);
  // Replace primaryVaultConfig.vaultId with your actual Skyflow vault ID

  // Step 4: Print the tokenization response, which contains the generated tokens or errors
  console.log("Tokenization Result:", response);
} catch (error) {
  if (error instanceof SkyflowError) {
    console.error("Skyflow Specific Error:", {
      code: error.error?.http_code,
      message: error.message,
      details: error.error?.details,
    });
  } else {
    console.error("Unexpected Error:", error);
  }
}
```

Sample response:

```typescript
TokenizeResponse {
  tokens: [
    {
      token: '5479-4229-4622-1393'
    }
  ],
  errors: null
}
```

### Get

To retrieve data using Skyflow IDs or unique column values, use the get method. The `GetRequest` class creates a get request, where you specify parameters such as the table name, redaction type, Skyflow IDs, column names, column values. If you specify Skyflow IDs, you can't use column names and column values, and the inverse is true—if you specify column names and column values, you can't use Skyflow IDs. And `GetOptions` class creates a get options object through which you specify whether to return tokens or not.

#### Construct a get request

```typescript
import {
  GetOptions,
  GetRequest,
  GetColumnRequest,
  SkyflowError,
  GetResponse,
} from "skyflow-node";

try {
  // Initialize Skyflow client
  // Step 1: Initialize a list of Skyflow IDs to retrieve records (replace with actual Skyflow IDs)
  const getIds: Array<string> = ["<SKYFLOW_ID1>", "<SKYFLOW_ID1>"];

  // Step 2: Create a GetRequest to retrieve records by Skyflow ID
  const getRequest: GetRequest = new GetRequest(
    "table1", // Replace with your actual table name
    getIds,
  );

  // Step 3: Configure Get Options and specify not to return tokens
  const getOptions: GetOptions = new GetOptions();
  getOptions.setReturnTokens(false); // Optional: Set to false to avoid returning tokens

  // Step 4: Send the request to the Skyflow vault and retrieve the records
  const getResponse: GetResponse = await skyflowClient
    .vault("<VAULT_ID>")
    .get(getRequest, getOptions);
  // Replace <VAULT_ID> with your actual Skyflow vault ID

  console.log("Data retrieval successful:", getResponse);

  // Step 5: Create another GetRequest to retrieve records by Skyflow ID with tokenized values
  const getTokensRequest: GetRequest = new GetRequest(
    "table1", // Replace with your actual table name
    getIds,
  );

  // Step 6: Configure Get Options and specify to return tokens
  const getOptions: GetOptions = new GetOptions();
  getOptions.setReturnTokens(true); // Optional: Set to True to return tokenized values

  // Step 7: Send the request to the Skyflow vault and retrieve the tokenized records
  const getTokensResponse: GetResponse = await skyflowClient
    .vault("<VAULT_ID>")
    .get(getRequest, getOptions);
  // Replace <VAULT_ID> with your actual Skyflow vault ID

  console.log("Data retrieval successful:", getTokensResponse);

  // Prepare Column-Based Retrieval Data
  const columnValues: Array<string> = [
    "<COLUMN_VALUE_1>", // Example Unique Column value 1
    "<COLUMN_VALUE_2>", // Example Unique Column value 2
  ];
  const tableName: string = "table-name"; // Replace with your actual table name
  const columnName: string = "column-name"; // Column name configured as unique in the schema

  const getRequest: GetColumnRequest = new GetColumnRequest(
    tableName,
    columnName,
    columnValues, // Column values of the records to return
  );

  // Step 8: Configure Get Options and specify to return tokens
  const getOptions: GetOptions = new GetOptions();
  getOptions.setReturnTokens(true); // Optional: Set to True to return tokenized values

  // Send the request to the Skyflow vault and retrieve the filtered records
  const response: GetResponse = await skyflowClient
    .vault(primaryVaultConfig.vaultId)
    .get(getRequest, getOptions);

  console.log("Column-based retrieval successful:", response);
} catch (error) {
  // Handle any errors that occur during the retrieval process
  if (error instanceof SkyflowError) {
    console.error("Skyflow Specific Error:", {
      code: error.error?.http_code,
      message: error.message,
      details: error.error?.details,
    });
  } else {
    console.error("Unexpected Error:", error);
  }
}
```

#### Get by skyflow IDs

Retrieve specific records using skyflow `ids`. Ideal for fetching exact records when IDs are known.

```typescript
import {
  GetOptions,
  GetRequest,
  SkyflowError,
  GetResponse,
  RedactionType,
} from "skyflow-node";

/*
This example demonstrates how to retrieve data from the Skyflow vault using a list of Skyflow IDs.

1. Initializes the Skyflow client with a given vault ID.
2. Creates a request to retrieve records based on Skyflow IDs.
3. Specifies that the response should not return tokens.
4. Uses plain text redaction type for the retrieved records.
5. Prints the response to display the retrieved records.
*/

try {
  // Initialize Skyflow client
  // Step 1: Initialize a list of Skyflow IDs to retrieve records (replace with actual Skyflow IDs)
  const getIds: Array<string> = [
    "a581d205-1969-4350-acbe-a2a13eb871a6",
    "5ff887c3-b334-4294-9acc-70e78ae5164a",
  ];

  // Step 2: Create a GetRequest to retrieve records by Skyflow ID
  const getRequest: GetRequest = new GetRequest(
    "table1", // Replace with your actual table name
    getIds,
  );

  // Step 3: Configure Get Options and specify not to return tokens and redaction type
  const getOptions: GetOptions = new GetOptions();
  getOptions.setReturnTokens(false); // Optional: Set to false to avoid returning tokens
  getOptions.setRedactionType(RedactionType.PLAIN_TEXT);

  // Step 4: Send the request to the Skyflow vault and retrieve the records
  const getResponse: GetResponse = await skyflowClient
    .vault(primaryVaultConfig.vaultId)
    .get(getRequest, getOptions);
  // Replace <VAULT_ID> with your actual Skyflow vault ID

  console.log("Data retrieval successful:", getResponse);
} catch (error) {
  // Step 5: Handle any errors that occur during the retrieval process
  if (error instanceof SkyflowError) {
    console.error("Skyflow Specific Error:", {
      code: error.error?.http_code,
      message: error.message,
      details: error.error?.details,
    });
  } else {
    console.error("Unexpected Error:", error);
  }
}
```

Sample response:

```typescript
GetResponse {
  data: [
    {
      card_number: '4555555555555553',
      email: 'john.doe@gmail.com',
      name: 'john doe',
      skyflow_id: 'a581d205-1969-4350-acbe-a2a13eb871a6'
    },
    {
      card_number: '4555555555555559',
      email: 'jane.doe@gmail.com',
      name: 'jane doe',
      skyflow_id: '5ff887c3-b334-4294-9acc-70e78ae5164a'
    }
  ],
  errors: null
}
```

#### Get tokens for records

Return tokens for records. Ideal for securely processing sensitive data while maintaining data privacy.

#### An [example](https://github.com/skyflowapi/skyflow-node/blob/v2/samples/vault-api/get-records.ts) of get call to retrieve tokens using Skyflow IDs:

```typescript
import {
  GetOptions,
  GetRequest,
  SkyflowError,
  GetResponse,
  RedactionType,
} from "skyflow-node";

try {
  // Assemble your IDs
  const getIds: Array<string> = [
    "a581d205-1969-4350-acbe-a2a13eb871a6",
    "5ff887c3-b334-4294-9acc-70e78ae5164a",
  ];

  // Create a GetRequest to retrieve records by table name and Skyflow IDs
  const getRequest: GetRequest = new GetRequest(
    "table1", // Table name
    getIds, // Array of ID strings
  );

  // Create a GetOptions and request tokens
  const getOptions: GetOptions = new GetOptions();
  getOptions.setReturnTokens(true); // Optional: Set to true to get tokens

  // Send the request to the Skyflow vault and retrieve the records
  const getResponse: GetResponse = await skyflowClient
    .vault(primaryVaultConfig.vaultId)
    .get(getRequest, getOptions);

  console.log("Data retrieval successful:", getResponse);
} catch (error) {
  // Handle any errors that occur during the retrieval process
  if (error instanceof SkyflowError) {
    console.error("Skyflow Specific Error:", {
      code: error.error?.http_code,
      message: error.message,
      details: error.error?.details,
    });
  } else {
    console.error("Unexpected Error:", error);
  }
}
```

Sample response:

```typescript
GetResponse {
  data: [
    {
      card_number: '3998-2139-0328-0697',
      email: 'c9a6c9555060@82c092e7.bd52',
      name: '82c092e7-74c0-4e60-bd52-c9a6c9555060',
      skyflow_id: 'a581d205-1969-4350-acbe-a2a13eb871a6'
    },
    {
      card_number: '3562-0140-8820-7499',
      email: '6174366e2bc6@59f82e89.93fc',
      name: '59f82e89-138e-4f9b-93fc-6174366e2bc6',
      skyflow_id: '5ff887c3-b334-4294-9acc-70e78ae5164a'
    }
  ],
  errors: null
}
```

#### Get by column name and column values

Retrieve records by unique column values. Ideal for querying data without knowing Skyflow IDs, using alternate unique identifiers.

#### An [example](https://github.com/skyflowapi/skyflow-node/blob/v2/samples/vault-api/get-column-values.ts) of get call to retrieve data using column name and column values:

```typescript
import {
  GetOptions,
  GetRequest,
  SkyflowError,
  GetResponse,
  RedactionType,
  GetColumnRequest,
} from "skyflow-node";

/*
This example demonstrates how to retrieve data from the Skyflow vault based on column values.

1. Initializes the Skyflow client with a given vault ID.
2. Creates a request to retrieve records based on specific column values (e.g., email addresses).
3. Prints the response to display the retrieved records after redacting sensitive data based on the specified redaction type.
*/

try {
  // Initialize Skyflow client
  // Step 1: Initialize a list of column values (email addresses in this case)
  const columnValues: Array<string> = [
    "john.doe@gmail.com", // Example email address
    "jane.doe@gmail.com", // Example email address
  ];
  const tableName: string = "table1"; // Replace with your actual table name
  const columnName: string = "email"; // Column name configured as unique in the schema

  // Step 2: Create a GetRequest to retrieve records based on column values
  const getRequest: GetColumnRequest = new GetColumnRequest(
    tableName,
    columnName,
    columnValues, // Column values of the records to return
  );

  // Step 3: Configure Get Options and specify redaction type
  const getOptions: GetOptions = new GetOptions();
  getOptions.setRedactionType(RedactionType.PLAIN_TEXT); // Optional:  Set the redaction type (e.g., PLAIN_TEXT)

  // Step 4: Send the request to the Skyflow vault and retrieve the filtered records
  const response: GetResponse = await skyflowClient
    .vault(primaryVaultConfig.vaultId)
    .get(getRequest, getOptions);

  console.log("Column-based retrieval successful:", response);
} catch (error) {
  // Step 5: Handle any errors that occur during the retrieval process
  if (error instanceof SkyflowError) {
    console.error("Skyflow Specific Error:", {
      code: error.error?.http_code,
      message: error.message,
      details: error.error?.details,
    });
  } else {
    console.error("Unexpected Error:", error);
  }
}
```

Sample response:

```typescript
GetResponse {
  data: [
    {
      card_number: '4555555555555553',
      email: 'john.doe@gmail.com',
      name: 'john doe',
      skyflow_id: 'a581d205-1969-4350-acbe-a2a13eb871a6'
    },
    {
      card_number: '4555555555555559',
      email: 'jane.doe@gmail.com',
      name: 'jane doe',
      skyflow_id: '5ff887c3-b334-4294-9acc-70e78ae5164a'
    }
  ],
  errors: null
}
```

#### Redaction Types

Redaction types determine how sensitive data is displayed when retrieved from the vault.

**Available Redaction Types**

- `DEFAULT`: Applies the vault-configured default redaction setting.
- `REDACTED`: Completely removes sensitive data from view.
- `MASKED`: Partially obscures sensitive information.
- `PLAIN_TEXT`: Displays the full, unmasked data.

**Choosing the Right Redaction Type**

- Use `REDACTED` for scenarios requiring maximum data protection to prevent exposure of sensitive information.
- Use `MASKED` to provide partial visibility of sensitive data for less critical use cases.
- Use `PLAIN_TEXT` for internal, authorized access where full data visibility is necessary.

### Update

To update data in your vault, use the `update` method. The `UpdateRequest` class is used to create an update request, where you specify parameters such as the table name, data (as a dictionary). The `UpdateOptions` class is used to configure update options to returnTokens, tokens, and tokenMode. If `returnTokens` is set to True, Skyflow returns tokens for the updated records. If `returnTokens` is set to False, Skyflow returns IDs for the updated records.

#### Construct an update request

```typescript
import {
    UpdateRequest,
    UpdateOptions,
    UpdateResponse,
    SkyflowError,
    TokenMode
} from 'skyflow-node';

// This example demonstrates how to update records in the Skyflow vault by providing new data and/or tokenized values, along with the corresponding UpdateRequest schema.

try {
  // Initialize Skyflow client
  // Step 1: Prepare the data to update in the vault
  // Use a dictionary to store the data that will be updated in the specified table
  const updateData: Record<string, unknown> = {
      skyflowId: 'your-skyflow-id',   // Skyflow ID for identifying the record to update
      COLUMN_NAME1: '<COLUMN_VALUE_1>'    //Example of a column name and its value to update
      COLUMN_NAME2: '<COLUMN_VALUE_2>'// Another example of a column name and its value to update
  };

  // Step 2: Prepare the tokens (if necessary) for certain columns that require tokenization
  const tokens: Record<string, unknown> = {
    COLUMN_NAME_2: '<TOKEN_VALUE_2>'    // Example of a column name that should be tokenized
  }

  // Step 3: Create an UpdateRequest to specify the update operation
  const updateReq: UpdateRequest = new UpdateRequest(
      'sensitive_data_table',               // Replace with your actual table name
      updateData
  );

  // Step 4: Configure Update Options
  const updateOptions: UpdateOptions = new UpdateOptions();
  updateOptions.setReturnTokens(true);      // Specify whether to return tokens in the response
  updateOptions.setTokens(tokens);   // The tokens associated with specific columns
  updateOptions.setTokenMode(TokenMode.ENABLE); // Specifies the tokenization mode (ENABLE means tokenization is applied)

  // Step 5: Send the request to the Skyflow vault and update the record
  const response: UpdateResponse = await skyflowClient
      .vault(primaryVaultConfig.vaultId)
      .update(updateReq, updateOptions);

  // Step 6: Print the response to confirm the update result
  console.log('Update successful:', response);
} catch(error) {
  // Step 7: Handle any errors that occur during the update operation
  if (error instanceof SkyflowError) {
      console.error('Skyflow Specific Error:', {
          code: error.error?.http_code,
          message: error.message,
          details: error.error?.details
      });
  } else {
      console.error('Unexpected Error:', error);
  }
}
```

#### An [example](https://github.com/skyflowapi/skyflow-node/blob/v2/samples/vault-api/update-record.ts) of update call

```typescript
import {
    UpdateRequest,
    UpdateOptions,
    UpdateResponse,
    SkyflowError,
    TokenMode
} from 'skyflow-node';

/*
This example demonstrates how to update a record in the Skyflow vault with specified data and tokens.

1. Initializes the Skyflow client with a given vault ID.
2. Constructs an update request with data to modify and tokens to include.
3. Sends the request to update the record in the vault.
4. Prints the response to confirm the success or failure of the update operation.
*/

try {
  // Initialize Skyflow client
  // Step 1: Prepare the data to update in the vault
  // Use a dictionary to store the data that will be updated in the specified table
  const updateData: Record<string, unknown> = {
      skyflowId: '5b699e2c-4301-4f9f-bcff-0a8fd3057413',   // Skyflow ID for identifying the record to update
      name: 'john doe'    //Example of a column name and its value to update
      card_number: '4111111111111115'// Another example of a column name and its value to update
  };

  // Step 2: Prepare the tokens (if necessary) for certain columns that require tokenization
  const tokens: Record<string, unknown> = {
    name: '72b8ffe3-c8d3-4b4f-8052-38b2a7405b5a'    // Example of a column name that should be tokenized
  }

  // Step 3: Create an UpdateRequest to specify the update operation
  const updateReq: UpdateRequest = new UpdateRequest(
      'table1',               // Replace with your actual table name
      updateData
  );

  // Step 4: Configure Update Options
  const updateOptions: UpdateOptions = new UpdateOptions();
  updateOptions.setTokens(tokens);   // The tokens associated with specific columns
  updateOptions.setTokenMode(TokenMode.ENABLE); // Specifies the tokenization mode (ENABLE means tokenization is applied)

  // Step 5: Send the request to the Skyflow vault and update the record
  const response: UpdateResponse = await skyflowClient
      .vault(primaryVaultConfig.vaultId)
      .update(updateReq, updateOptions);

  // Step 6: Print the response to confirm the update result
  console.log('Update successful:', response);
} catch(error) {
  // Step 7: Handle any errors that occur during the update operation
  if (error instanceof SkyflowError) {
      console.error('Skyflow Specific Error:', {
          code: error.error?.http_code,
          message: error.message,
          details: error.error?.details
      });
  } else {
      console.error('Unexpected Error:', error);
  }
}
```

Sample response:

- When `returnTokens` is set to `True`

```typescript
UpdateResponse {
  updatedField: {
    skyflowId: '5b699e2c-4301-4f9f-bcff-0a8fd3057413',
    name: '72b8ffe3-c8d3-4b4f-8052-38b2a7405b5a',
    card_number: '4131-1751-0217-8491'
  },
  errors: null
}
```

- When `returnTokens` is set to `False`

```typescript
UpdateResponse {
  updatedField: {
    skyflowId: '5b699e2c-4301-4f9f-bcff-0a8fd3057413',
  },
  errors: null
}
```

### Delete

To delete records using Skyflow IDs, use the `delete` method. The `DeleteRequest` class accepts a list of Skyflow IDs that you want to delete, as shown below:

#### Construct a delete request

```typescript
import { DeleteRequest, DeleteResponse, SkyflowError } from "skyflow-node";

/*
This example demonstrates how to delete records from a Skyflow vault using specified Skyflow IDs, along with corresponding DeleteRequest schema.
*/

try {
  // Initialize Skyflow client
  // Step 1: Prepare a list of Skyflow IDs for the records to delete
  // The list stores the Skyflow IDs of the records that need to be deleted from the vault
  const deleteIds: Array<string> = [
    "<SKYFLOW_ID1>",
    "<SKYFLOW_ID2>",
    "<SKYFLOW_ID3>",
  ]; // Replace with actual Skyflow IDs
  const tableName: string = "<TABLE_NAME>"; // Replace with the actual table name from which to delete

  // Step 2: Create a DeleteRequest to define the delete operation
  const deleteRequest: DeleteRequest = new DeleteRequest(tableName, deleteIds);

  // Step 3: Send the delete request to the Skyflow vault
  const response: DeleteResponse = await skyflowClient
    .vault(primaryVaultConfig.vaultId)
    .delete(deleteRequest);

  // Print the response to confirm the delete result
  console.log("Deletion successful:", response);
} catch (error) {
  // Step 4: Handle any exceptions that occur during the delete operation
  if (error instanceof SkyflowError) {
    console.error("Skyflow Specific Error:", {
      code: error.error?.http_code,
      message: error.message,
      details: error.error?.details,
    });
  } else {
    console.error("Unexpected Error:", error);
  }
}
```

#### An [example](https://github.com/skyflowapi/skyflow-node/blob/v2/samples/vault-api/delete-records.ts) of delete call

```typescript
import { DeleteRequest, DeleteResponse, SkyflowError } from "skyflow-node";

/*
This example demonstrates how to delete records from a Skyflow vault using specified Skyflow IDs.

1. Initializes the Skyflow client with a given Vault ID.
2. Constructs a delete request by specifying the IDs of the records to delete.
3. Sends the delete request to the Skyflow vault to delete the specified records.
4. Prints the response to confirm the success or failure of the delete operation.
*/

try {
  // Initialize Skyflow client
  // Step 1: Prepare a list of Skyflow IDs for the records to delete
  // The list stores the Skyflow IDs of the records that need to be deleted from the vault
  const deleteIds: Array<string> = [
    "9cbf66df-6357-48f3-b77b-0f1acbb69280",
    "ea74bef4-f27e-46fe-b6a0-a28e91b4477b",
    "47700796-6d3b-4b54-9153-3973e281cafb",
  ]; // Replace with actual Skyflow IDs
  const tableName: string = "table1"; // Replace with the actual table name from which to delete

  // Step 2: Create a DeleteRequest to define the delete operation
  const deleteRequest: DeleteRequest = new DeleteRequest(tableName, deleteIds);

  // Step 3: Send the delete request to the Skyflow vault
  const response: DeleteResponse = await skyflowClient
    .vault(primaryVaultConfig.vaultId)
    .delete(deleteRequest);

  // Print the response to confirm the delete result
  console.log("Deletion successful:", response);
} catch (error) {
  // Step 4: Handle any exceptions that occur during the delete operation
  if (error instanceof SkyflowError) {
    console.error("Skyflow Specific Error:", {
      code: error.error?.http_code,
      message: error.message,
      details: error.error?.details,
    });
  } else {
    console.error("Unexpected Error:", error);
  }
}
```

Sample response:

```typescript
DeleteResponse {
  deletedIds: [
    '9cbf66df-6357-48f3-b77b-0f1acbb69280',
    'ea74bef4-f27e-46fe-b6a0-a28e91b4477b',
    '47700796-6d3b-4b54-9153-3973e281cafb'
  ],
  errors: null
}
```

### Query

To retrieve data with SQL queries, use the `query` method. `QueryRequest` is class that takes the `query` parameter as follows:

#### Construct a query request

Refer to [Query your data](https://docs.skyflow.com/query-data/) and [Execute Query](https://docs.skyflow.com/record/#QueryService_ExecuteQuery) for guidelines and restrictions on supported SQL statements, operators, and keywords.

```typescript
import { QueryRequest, QueryResponse, SkyflowError } from "skyflow-node";

/*
This example demonstrates how to execute a custom SQL query on a Skyflow vault, along with QueryRequest schema.
*/

try {
  // Initialize Skyflow client
  // Step 1: Define the SQL query to execute on the Skyflow vault
  // Replace "<YOUR_SQL_QUERY>" with the actual SQL query you want to run
  const query: string = "<YOUR_SQL_QUERY>"; //  Example: "SELECT * FROM table1 WHERE column1 = 'value'"

  // Step 2: Create a QueryRequest with the specified SQL query
  const queryRequest: QueryRequest = new QueryRequest(query);

  // Step 3: Execute the query request on the specified Skyflow vault
  const response: QueryResponse = await skyflowClient
    .vault("<VAULT_ID>") // Replace <VAULT_ID> with your actual Vault ID
    .query(queryRequest);

  // Step 4: Print the response containing the query results
  console.log("Query Result:", response);
} catch (error) {
  // Step 5: Handle any exceptions that occur during the query execution
  if (error instanceof SkyflowError) {
    console.error("Skyflow Specific Error:", {
      code: error.error?.http_code,
      message: error.message,
      details: error.error?.details,
    });
  } else {
    console.error("Unexpected Error:", error);
  }
}
```

#### An [example](https://github.com/skyflowapi/skyflow-node/blob/v2/samples/vault-api/query-records.ts) of query call

```typescript
import { QueryRequest, QueryResponse, SkyflowError } from "skyflow-node";

/*
This example demonstrates how to execute a SQL query on a Skyflow vault to retrieve data.

1. Initializes the Skyflow client with the Vault ID.
2. Constructs a query request with a specified SQL query.
3. Executes the query against the Skyflow vault.
4. Prints the response from the query execution.
*/

try {
  // Initialize Skyflow client
  // Step 1: Define the SQL query to execute on the Skyflow vault
  // Example query: Retrieve all records from the "cards" table with a specific skyflow_id
  const query: string =
    "SELECT * FROM cards WHERE skyflow_id='3ea3861-x107-40w8-la98-106sp08ea83f'";

  // Step 2: Create a QueryRequest with the specified SQL query
  const queryRequest: QueryRequest = new QueryRequest(query);

  // Step 3: Execute the query request on the specified Skyflow vault
  const response: QueryResponse = await skyflowClient
    .vault(primaryVaultConfig.vaultId) // Replace with actual Vault ID
    .query(queryRequest);

  // Step 4: Print the response containing the query results
  console.log("Query Result:", response);
} catch (error) {
  // Step 5: Handle any exceptions that occur during the query execution
  if (error instanceof SkyflowError) {
    console.error("Skyflow Specific Error:", {
      code: error.error?.http_code,
      message: error.message,
      details: error.error?.details,
    });
  } else {
    console.error("Unexpected Error:", error);
  }
}
```

Sample Response:

```typescript
QueryResponse {
  fields: [
    {
      card_number: 'XXXXXXXXXXXX1112',
      name: 'S***ar',
      skyflow_id: '3ea3861-x107-40w8-la98-106sp08ea83f',
      tokenizedData: {}
    }
  ],
  errors: null,
}
```

### Upload File

To upload files to a Skyflow vault, use the `uploadFile` method. The `FileUploadRequest` class accepts parameters such as the table name, column name and skyflow ID. And `FileUploadOptions` class accepts the file object as shown below:

```typescript
// Please use Node version 20 & above to run file upload
import {
  FileUploadRequest,
  FileUploadResponse,
  FileUploadOptions,
  SkyflowError,
} from "skyflow-node";
import * as fs from "fs";

/*
This example demonstrates how to upload file to Skyflow vault with FileUploadRequest and FileUploadOptions schema.
*/

try {
  // Initialize Skyflow client
  // Step 1: Prepare File Upload Data
  const tableName: string = "table-name"; // Table name
  const skyflowId: string = "skyflow-id"; // Skyflow ID of the record
  const columnName: string = "column-name"; // Column name to store file
  const filePath: string = "file-path"; // Path to the file for upload

  // Step 2: Create File Upload Request
  const uploadReq: FileUploadRequest = new FileUploadRequest(
    tableName,
    skyflowId,
    columnName,
  );

  // Step 3: Configure FileUpload Options
  const uploadOptions: FileUploadOptions = new FileUploadOptions();
  // Set any one of FilePath, Base64 or FileObject in FileUploadOptions

  const buffer = fs.readFileSync(filePath);
  uploadOptions.setFileObject(new File([buffer], filePath)); // Set a File object

  // Step 4: Perform File Upload
  const response: FileUploadResponse = await skyflowClient
    .vault(primaryVaultConfig.vaultId)
    .uploadFile(uploadReq, uploadOptions);

  // Handle Successful Response
  console.log("File upload successful:", response);
} catch (error) {
  // Step 5: Handle any exceptions that occur during the query execution
  if (error instanceof SkyflowError) {
    console.error("Skyflow Specific Error:", {
      code: error.error?.http_code,
      message: error.message,
      details: error.error?.details,
    });
  } else {
    console.error("Unexpected Error:", error);
  }
}
```

### An [example](https://github.com/skyflowapi/skyflow-node/blob/main/samples/vault-api/file-upload.ts) of file upload call

```typescript
// Please use Node version 20 & above to run file upload
import {
  FileUploadRequest,
  FileUploadResponse,
  FileUploadOptions,
  SkyflowError,
} from "skyflow-node";
import * as fs from "fs";

/*
This example demonstrates how to upload file to Skyflow vault with FileUploadRequest and FileUploadOptions schema.

1. Initializes the Skyflow client with the Vault ID.
2. Constructs a file upload request and file upload options with specified filepath or file object
3. Uploads the file to the Skyflow vault.
4. Prints the response from the file upload operation
*/

try {
  // Initialize Skyflow client
  // Step 1: Prepare File Upload Data
  const tableName: string = "cards";
  const skyflowId: string = "c9312531-2087-439a-bd26-74c41f24db83"; // Skyflow ID of the record
  const columnName: string = "license"; // Column name to store file
  const filePath: string = "/images/license.png"; // Path to the file for upload

  // Step 2: Create File Upload Request
  const uploadReq: FileUploadRequest = new FileUploadRequest(
    tableName,
    skyflowId,
    columnName,
  );

  // Step 3: Configure FileUpload Options
  const uploadOptions: FileUploadOptions = new FileUploadOptions();
  // Set any one of FilePath, Base64 or FileObject in FileUploadOptions

  const buffer = fs.readFileSync(filePath);
  uploadOptions.setFileObject(new File([buffer], filePath)); // Set a File object

  // Step 4: Perform File Upload
  const response: FileUploadResponse = await skyflowClient
    .vault(primaryVaultConfig.vaultId)
    .uploadFile(uploadReq, uploadOptions);

  // Handle Successful Response
  console.log("File upload successful:", response);
} catch (error) {
  // Step 5: Handle any exceptions that occur during the query execution
  if (error instanceof SkyflowError) {
    console.error("Skyflow Specific Error:", {
      code: error.error?.http_code,
      message: error.message,
      details: error.error?.details,
    });
  } else {
    console.error("Unexpected Error:", error);
  }
}
```

Sample Response:

```typescript
FileUploadResponse {
  skyflowId: 'c9312531-2087-439a-bd26-74c41f24db83',
  errors: null
}
```

## Detect

Skyflow Detect enables you to deidentify and reidentify sensitive data in text and files, supporting advanced privacy-preserving workflows.

### Deidentify Text `deidentifyText()`

To deidentify text, use the `deidentifyText` method. The `DeidentifyTextRequest` class creates a deidentify text request, which includes the text to be deidentified. Additionally, you can provide optional parameters using the `DeidentifyTextOptions` class.

```typescript
import {
  DeidentifyTextRequest,
  DeidentifyTextOptions,
  SkyflowError,
  TokenFormat,
  TokenType,
  Transformations,
  DetectEntities,
} from "skyflow-node";

try {
  // Step 1: Prepare the text to be deidentified
  const deidentifyTextRequest = new DeidentifyTextRequest(
    "<TEXT_TO_BE_DEIDENTIFIED>",
  );

  // Step 2: Configure DeidentifyTextOptions
  const options = new DeidentifyTextOptions();
  options.setEntities([DetectEntities.ACCOUNT_NUMBER, DetectEntities.SSN]); // Entities to deidentify
  options.setAllowRegexList(["<YOUR_REGEX_PATTERN>"]); // Allowlist regex patterns
  options.setRestrictRegexList(["<YOUR_REGEX_PATTERN>"]); // Restrict regex patterns

  const tokenFormat = new TokenFormat(); // Specify the token format for deidentified entities
  tokenFormat.setDefault(TokenType.VAULT_TOKEN);
  optionsText.setTokenFormat(tokenFormat);

  const transformations = new Transformations(); // Specify custom transformations for entities
  transformations.setShiftDays({
    max: 30, // Maximum shift days
    min: 30, // Minimum shift days
    entities: [DetectEntities.ACCOUNT_NUMBER, DetectEntities.SSN], // Entities to apply the shift
  });
  optionsText.setTransformations(transformations);

  // Step 3: Call deidentifyText
  const response = await skyflowClient
    .detect(primaryVaultConfig.vaultId)
    .deidentifyText(deidentifyTextRequest, options);

  console.log("Deidentify Text Response:", response);
} catch (error) {
  if (error instanceof SkyflowError) {
    console.error("Skyflow Error:", error.message);
  } else {
    console.error("Unexpected Error:", JSON.stringify(error));
  }
}
```

#### An example of a deidentify text call

```typescript
import {
  SkyflowError,
  DeidentifyTextRequest,
  DeidentifyTextOptions,
  TokenFormat,
  TokenType,
  Transformations,
  DetectEntities,
  DeidentifyTextResponse,
} from "skyflow-node";

/**
 * Skyflow Deidentify Text Example
 *
 * This example demonstrates how to:
 * 1. Configure credentials
 * 2. Set up vault configuration
 * 3. Create a deidentify text request
 * 4. Use all available options for de-identification
 * 5. Handle response and errors
 */

async function performDeidentifyText() {
  try {
    // Step 1: Prepare Deidentify Text Request
    const textReq = new DeidentifyTextRequest(
      "My SSN is 123-45-6789 and my card is 4111 1111 1111 1111.", // Text to be deidentified
    );

    // Step 2: Configure DeidentifyTextOptions
    const optionsText = new DeidentifyTextOptions();

    // setEntities: Specify which entities to deidentify
    optionsText.setEntities([
      DetectEntities.SSN,
      DetectEntities.CREDIT_CARD_NUMBER,
    ]);

    // setTokenFormat: Specify the token format for deidentified entities
    const tokenFormat = new TokenFormat();
    tokenFormat.setDefault(TokenType.VAULT_TOKEN);
    optionsText.setTokenFormat(tokenFormat);

    // setTransformations: Specify custom transformations for entities
    const transformations = new Transformations();
    transformations.setShiftDays({
      max: 30, // Maximum shift days
      min: 30, // Minimum shift days
      entities: [DetectEntities.DOB], // Entities to apply the shift
    });
    optionsText.setTransformations(transformations);

    // Step 3: Call deidentifyText API
    const response: DeidentifyTextResponse = await skyflowClient
      .detect(primaryVaultConfig.vaultId)
      .deidentifyText(textReq, optionsText);

    // Handle Successful Response
    console.log("Deidentify Text Response:", response);
  } catch (error) {
    // Comprehensive Error Handling
    if (error instanceof SkyflowError) {
      console.error("Skyflow Specific Error:", {
        code: error.error?.http_code,
        message: error.message,
        details: error.error?.details,
      });
    } else {
      console.error("Unexpected Error:", JSON.stringify(error));
    }
  }
}

// Invoke the deidentify text function
performDeidentifyText();
```

Sample Response:

```typescript
{
  "processedText": "My SSN is [SSN_0ykQWPA] and my card is [CREDIT_CARD_N92QAVa].",
  "entities": [
    {
      "token": "SSN_0ykQWPA",
      "value": "123-45-6789",
      "textIndex": {
        "start": 10,
        "end": 21
      },
      "processedIndex": {
        "start": 10,
        "end": 23
      },
      "entity": "SSN",
      "scores": {
        "SSN": 0.9383999705314636
      }
    },
    {
      "token": "CREDIT_CARD_N92QAVa",
      "value": "4111 1111 1111 1111",
      "textIndex": {
        "start": 37,
        "end": 56
      },
      "processedIndex": {
        "start": 39,
        "end": 60
      },
      "entity": "CREDIT_CARD",
      "scores": {
        "CREDIT_CARD": 0.9050999879837
      }
    }
  ],
  "wordCount": 9,
  "charCount": 57
}
```

### Reidentify Text

To reidentify text, use the `reidentifyText` method. The `ReidentifyTextRequest` class creates a reidentify text request, which includes the redacted or de-identified text to be re-identified. Additionally, you can provide optional parameters using the `ReidentifyTextOptions` class to control how specific entities are returned (as redacted, masked, or plain text).

```typescript
import {
  ReidentifyTextRequest,
  ReidentifyTextOptions,
  SkyflowError,
  DetectEntities,
  ReidentifyTextResponse,
} from "skyflow-node";

try {
  // Step 1: Prepare the redacted text to be re-identified
  const textReq = new ReidentifyTextRequest("<REDACTED_TEXT_TO_REIDENTIFY>");

  // Step 2: Configure ReidentifyTextOptions
  const options = new ReidentifyTextOptions();
  options.setRedactedEntities([DetectEntities.SSN]); // Entities to keep redacted
  options.setMaskedEntities([DetectEntities.CREDIT_CARD_NUMBER]); // Entities to mask
  options.setPlainTextEntities([DetectEntities.NAME]); // Entities to return as plain text

  // Step 3: Call reidentifyText
  const response: ReidentifyTextResponse = await skyflowClient
    .detect(primaryVaultConfig.vaultId)
    .reidentifyText(textReq, options);

  console.log("Reidentify Text Response:", response);
} catch (error) {
  // Comprehensive Error Handling
  if (error instanceof SkyflowError) {
    console.error("Skyflow Specific Error:", {
      code: error.error?.http_code,
      message: error.message,
      details: error.error?.details,
    });
  } else {
    console.error("Unexpected Error:", JSON.stringify(error));
  }
}
```

#### An example of a reidentify text call

```typescript
import {
  ReidentifyTextRequest,
  ReidentifyTextOptions,
  DetectEntities,
  ReidentifyTextResponse,
} from "skyflow-node";

/**
 * Skyflow Reidentify Text Example
 *
 * This example demonstrates how to:
 * 1. Configure credentials
 * 2. Set up vault configuration
 * 3. Create a reidentify text request
 * 4. Use all available options for re-identification
 * 5. Handle response and errors
 */

async function performReidentifyText() {
  try {
    // Step 1: Prepare Reidentify Text Request
    const reidentifyTextRequest = new ReidentifyTextRequest(
      "My SSN is [SSN_0ykQWPA] and my card is [CREDIT_CARD_N92QAVa].", // The redacted text to reidentify
    );

    // Step 2: Configure ReidentifyTextOptions
    const options = new ReidentifyTextOptions();

    // Specify which entities to reidentify as redacted, masked, or plain text
    options.setPlainTextEntities([
      DetectEntities.CREDIT_CARD,
      DetectEntities.SSN,
    ]);

    // Step 4: Call reidentifyText
    const response: ReidentifyTextResponse = await skyflowClient
      .detect(primaryVaultConfig.vaultId)
      .reidentifyText(reidentifyTextRequest, options);

    // Step 5: Handle response
    console.log("Re-identified Text Response:", response);
  } catch (error) {
    // Comprehensive Error Handling
    if (error instanceof SkyflowError) {
      console.error("Skyflow Specific Error:", {
        code: error.error?.http_code,
        message: error.message,
        details: error.error?.details,
      });
    } else {
      console.error("Unexpected Error:", JSON.stringify(error));
    }
  }
}

// Invoke the reidentify text function
performReidentifyText();
```

Sample Response:

```typescript
{
  processedText: "My SSN is 123-45-6789 and my card is 4111 1111 1111 1111.";
}
```

### Deidentify File

To deidentify files, use the `deidentifyFile` method. The `DeidentifyFileRequest` class creates a deidentify file request, which includes the file to be deidentified (such as images, PDFs, audio, documents, spreadsheets, or presentations). Additionally, you can provide optional parameters using the `DeidentifyFileOptions` class to control how entities are detected and deidentified, as well as how the output is generated for different file types.

**Note:** File de-identification requires Node.js version 20 or above.

```typescript
import {
  DeidentifyFileRequest,
  DeidentifyFileOptions,
  DeidentifyFileResponse
  SkyflowError,
  DetectEntities,
  MaskingMethod,
  DetectOutputTranscription,
  Bleep
} from 'skyflow-node';

try {
  // Step 1: Prepare the file to be deidentified
  const filePath: string = '<FILE_PATH>';
  const buffer = fs.readFileSync(filePath);
  const file = new File([buffer], filePath);

  //Step 2: Construct the file input by providing either file or filePath but not both
  const fileInput: FileInput = { file: file }
  // const fileInput: FileInput = { filePath: filePath }
  const fileReq = new DeidentifyFileRequest(fileInput);

  // Step 3: Configure DeidentifyFileOptions
  const options = new DeidentifyFileOptions();
  options.setEntities([DetectEntities.SSN, DetectEntities.ACCOUNT_NUMBER]);
  options.setAllowRegexList(['<YOUR_REGEX_PATTERN>']);
  options.setRestrictRegexList(['<YOUR_REGEX_PATTERN>']);

  const tokenFormat = new TokenFormat();           // Token format for deidentified entities
  tokenFormat.setDefault(TokenType.ENTITY_ONLY);
  options.setTokenFormat(tokenFormat);

  const transformations = new Transformations();   // transformations for entities
  transformations.setShiftDays({
    max: 30,
    min: 10,
    entities: [DetectEntities.SSN],
  });
  options.setTransformations(transformations);

  options.setOutputDirectory('<OUTPUT_DIRECTORY_PATH>');  // Output directory for saving the deidentified file. This is not supported in Cloudflare workers

  options.setWaitTime(15);   // Wait time for response (max 64 seconds; throws error if more)

  // ===== Image Options (apply when file is an image) =====

  // options.setOutputProcessedImage(true);        // Include processed image in output

  // options.setOutputOcrText(true);               // Include OCR text in response

  // options.setMaskingMethod(MaskingMethod.Blackbox);  // Masking method for image entities

  // ===== PDF Options (apply when file is a PDF) =====

  // options.setPixelDensity(300);    // Pixel density for PDF processing

  // options.setMaxResolution(2000);  // Max resolution for PDF

  // ===== Audio Options (apply when file is audio) =====

  // options.setOutputProcessedAudio(true);  // Include processed audio in output

  // options.setOutputTranscription(DetectOutputTranscription.PLAINTEXT_TRANSCRIPTION);  // Type of transcription

  // const bleep = new Bleep();  // Bleep audio configuration
  // bleep.setGain(5);           // Relative loudness in dB
  // bleep.setFrequency(1000);   // Pitch in Hz
  // bleep.setStartPadding(0.1); // Padding at start in seconds
  // bleep.setStopPadding(0.2);  // Padding at end in seconds
  // options.setBleep(bleep);

  // Step 4: Call deidentifyFile
  const response: DeidentifyFileResponse = await skyflowClient
    .detect(primaryVaultConfig.vaultId)
    .deidentifyFile(fileReq, options);

  console.log('Deidentify File Response:', response);

} catch (error) {
  // Comprehensive Error Handling
  if (error instanceof SkyflowError) {
      console.error('Skyflow Specific Error:', {
          code: error.error?.http_code,
          message: error.message,
          details: error.error?.details,
      });
  } else {
      console.error('Unexpected Error:', JSON.stringify(error));
  }
}
```

#### An example of a deidentify file

```typescript
import {
  SkyflowError,
  DeidentifyFileRequest,
  DeidentifyFileOptions,
  DetectEntities,
  TokenFormat,
  TokenType,
  Transformations,
  DeidentifyFileResponse,
} from "skyflow-node";
import fs from "fs";

/**
 * Skyflow Deidentify File Example
 *
 * This sample demonstrates how to use all available options for de-identifying files.
 * Supported file types: images (jpg, png, etc.), pdf, audio (mp3, wav), documents, spreadsheets, presentations, structured text.
 */

async function performDeidentifyFile() {
  try {
    // Step 1: Prepare Deidentify File Request
    // Replace with your file object (e.g., from fs.readFileSync or browser File API)
    const filePath: string = "/detect/sample.txt";
    const buffer = fs.readFileSync(filePath);
    const file = new File([buffer], filePath);

    //Step 2: Construct the file input by providing either file or filePath but not both
    const fileInput: FileInput = { file: file };
    // const fileInput: FileInput = { filePath: filePath }

    const fileReq = new DeidentifyFileRequest(fileInput);

    // Step 3: Configure DeidentifyFileOptions
    const options = new DeidentifyFileOptions();

    // Entities to detect and deidentify
    options.setEntities([DetectEntities.SSN, DetectEntities.ACCOUNT_NUMBER]);

    // Token format for deidentified entities
    const tokenFormat = new TokenFormat();
    tokenFormat.setDefault(TokenType.ENTITY_ONLY);
    options.setTokenFormat(tokenFormat);

    // Custom transformations for entities
    const transformations = new Transformations();
    transformations.setShiftDays({
      max: 30,
      min: 10,
      entities: [DetectEntities.SSN],
    });
    options.setTransformations(transformations);

    // Output directory for saving the deidentified file
    options.setOutputDirectory("/home/user/output"); // Replace with your desired output directory. This is not supported in Cloudflare workers

    // Wait time for response (max 64 seconds)
    options.setWaitTime(15);

    // Step 4: Call deidentifyFile API
    const response: DeidentifyFileResponse = await skyflowClient
      .detect(primaryVaultConfig.vaultId)
      .deidentifyFile(fileReq, options);

    // Handle Successful Response
    console.log("Deidentify File Response:", response);
  } catch (error) {
    // Comprehensive Error Handling
    if (error instanceof SkyflowError) {
      console.error("Skyflow Specific Error:", {
        code: error.error?.http_code,
        message: error.message,
        details: error.error?.details,
      });
    } else {
      console.error("Unexpected Error:", JSON.stringify(error));
    }
  }
}

// Invoke the deidentify file function
performDeidentifyFile();
```

Sample Response:

```typescript
{
  entities: [
    {
      file: '0X2xhYmVsIjoiQ1JFRElUX0NB==',
      extension: 'json'
    }
  ],
  fileBase64: 'TXkgU1NOIGlzIFtTU0==',
  file: File {
    size: 15075,
    type: '',
    name: 'deidentified.jpeg',
    lastModified: 1750791985426
  },
  type: 'redacted_file',
  extension: 'txt',
  wordCount: 12,
  charCount: 58,
  sizeInKb: 0.06,
  durationInSeconds: 0,
  pageCount: 0,
  slideCount: 0,
  runId: undefined,
  status: 'SUCCESS'
}
```

**Supported file types:**

- Documents: `doc`, `docx`, `pdf`
- PDFs: `pdf`
- Images: `bmp`, `jpeg`, `jpg`, `png`, `tif`, `tiff`
- Structured text: `json`, `xml`
- Spreadsheets: `csv`, `xls`, `xlsx`
- Presentations: `ppt`, `pptx`
- Audio: `mp3`, `wav`

**Note:**

- Transformations cannot be applied to Documents, Images, or PDFs file formats.

- The `waitTime` option must be ≤ 64 seconds; otherwise, an error is thrown.

- If the API takes more than 64 seconds to process the file, it will return only the run ID in the response.

Sample response (when the API takes more than 64 seconds):

```typescript

{
  entities: undefined,
  file: undefined,
  type: undefined,
  extension: undefined,
  wordCount: undefined,
  charCount: undefined,
  sizeInKb: undefined,
  durationInSeconds: undefined,
  pageCount: undefined,
  slideCount: undefined,
  runId: '1ad6dc12-8405-46cf-1c13-db1123f9f4c5',
  status: 'IN_PROGRESS'
}
```

### Get run

To retrieve the results of a previously started file de-identification operation, use the `getDetectRun` method.
The `GetDetectRunRequest` class is initialized with the `runId` returned from a prior `deidentifyFile` call.
This method allows you to fetch the final results of the file processing operation once they are available.

```typescript
import {
  GetDetectRunRequest,
  DeidentifyFileResponse,
  DeidentifyFileResponse
  SkyflowError
} from 'skyflow-node';

try {
  // Step 1: Prepare the GetDetectRunRequest with the runId from a previous deidentifyFile call
  const getDetectRunRequest = new GetDetectRunRequest({
    runId: '<RUN_ID_FROM_DEIDENTIFY_FILE>', // Replace with the runId you received earlier
  });

  // Step 2: Call getDetectRun
  const response: DeidentifyFileResponse = await skyflowClient
    .detect(primaryVaultConfig.vaultId)
    .getDetectRun(getDetectRunRequest);

  // Step 3: Handle the response
  console.log('Get Detect Run Response:', response);

} catch (error) {
  if (error instanceof SkyflowError) {
    console.error('Skyflow Error:', error.message);
  } else {
    console.error('Unexpected Error:', error);
  }
}
```

#### An example of a get run function

```typescript
import {
  Credentials,
  Env,
  LogLevel,
  Skyflow,
  SkyflowConfig,
  VaultConfig,
  SkyflowError,
  GetDetectRunRequest,
  DeidentifyFileResponse,
} from "skyflow-node";

/**
 * Skyflow Get Detect Run Example
 *
 * This example demonstrates how to:
 * 1. Configure credentials
 * 2. Set up vault configuration
 * 3. Create a get detect run request
 * 4. Call getDetectRun to poll for file processing results
 * 5. Handle response and errors
 */

async function performGetDetectRun() {
  try {
    // Step 1: Configure Credentials
    const credentials: Credentials = {
      token: "<YOUR_BEARER_TOKEN>", // Replace with your BEARER token
    };

    // Step 2: Configure Vault
    const primaryVaultConfig: VaultConfig = {
      vaultId: "<VAULT_ID>", // Unique vault identifier
      clusterId: "<CLUSTER_ID>", // From vault URL
      env: Env.PROD, // Deployment environment
      credentials: credentials, // Authentication method
    };

    // Step 3: Configure Skyflow Client
    const skyflowConfig: SkyflowConfig = {
      vaultConfigs: [primaryVaultConfig],
      logLevel: LogLevel.INFO, // Recommended to use LogLevel.ERROR in production environment.
    };

    // Initialize Skyflow Client
    const skyflowClient: Skyflow = new Skyflow(skyflowConfig);

    // Step 4: Prepare GetDetectRunRequest
    const getDetectRunRequest = new GetDetectRunRequest({
      runId: "<RUN_ID_FROM_DEIDENTIFY_FILE>", // Replace with the runId from a previous deidentifyFile call
    });

    // Step 5: Call getDetectRun API
    const response: DeidentifyFileResponse = await skyflowClient
      .detect(primaryVaultConfig.vaultId)
      .getDetectRun(getDetectRunRequest);

    // Handle Successful Response
    console.log("Get Detect Run Response:", response);
  } catch (error) {
    // Comprehensive Error Handling
    if (error instanceof SkyflowError) {
      console.error("Skyflow Specific Error:", {
        code: error.error?.http_code,
        message: error.message,
        details: error.error?.details,
      });
    } else {
      console.error("Unexpected Error:", error);
    }
  }
}

// Invoke the get detect run function
performGetDetectRun();
```

Sample Response

```typescript
{
  entities: [
    {
      file: '0X2xhYmVsIjoiQ1JFRElUX0NB==',
      extension: 'json'
    }
  ],
  file: 'TXkgU1NOIGlzIFtTU0==',
  type: 'redacted_file',
  extension: 'txt',
  wordCount: 12,
  charCount: 58,
  sizeInKb: 0.06,
  durationInSeconds: 0,
  pageCount: 0,
  slideCount: 0,
  status: 'SUCCESS'
}
```

## Connections

Skyflow Connections is a gateway service that uses tokenization to securely send and receive data between your systems and first- or third-party services. The [connections](https://github.com/skyflowapi/skyflow-node/tree/v2/src/vault/controller/connections) module invokes both inbound and/or outbound connections.

- **Inbound connections**: Act as intermediaries between your client and server, tokenizing sensitive data before it reaches your backend, ensuring downstream services handle only tokenized data.
- **Outbound connections**: Enable secure extraction of data from the vault and transfer it to third-party services via your backend server, such as processing checkout or card issuance flows.

### Invoke a connection

To invoke a connection, use the `invoke` method of the Skyflow client.

#### Construct an invoke connection request

```typescript
import {
  InvokeConnectionRequest,
  RequestMethod,
  ConnectionConfig,
  SkyflowError,
  InvokeConnectionResponse,
} from "skyflow-node";

/*
This example demonstrates how to invoke an external connection using the Skyflow SDK, along with corresponding InvokeConnectionRequest schema.
*/

try {
  // Initialize Skyflow client
  // Step 1: Define the request body parameters
  // These are the values you want to send in the request body
  const requestBody = {
    COLUMN_NAME_1: "<COLUMN_VALUE_1>", // Replace with actual key-value pairs
    COLUMN_NAME_2: "<COLUMN_VALUE_2>",
  };

  // Step 2: Define the request headers
  // Add any required headers that need to be sent with the request
  const requestHeaders = {
    HEADER_NAME_1: "<HEADER_VALUE_1>",
    HEADER_NAME_2: "<HEADER_VALUE_2>",
  };

  // Step 3: Define the path parameters
  // Path parameters are part of the URL and typically used in RESTful APIs
  const pathParams = {
    YOUR_PATH_PARAM_KEY_1: "<YOUR_PATH_PARAM_VALUE_1>",
    YOUR_PATH_PARAM_KEY_2: "<YOUR_PATH_PARAM_VALUE_2>",
  };

  // Step 4: Define the query parameters
  // Query parameters are included in the URL after a '?' and are used to filter or modify the response
  const queryParams = {
    YOUR_QUERY_PARAM_KEY_1: "<YOUR_QUERY_PARAM_VALUE_1>",
    YOUR_QUERY_PARAM_KEY_2: "<YOUR_QUERY_PARAM_VALUE_2>",
  };

  // Step 5: Define the request method
  const requestMethod: RequestMethod = RequestMethod.POST;

  // Step 6: Build the InvokeConnectionRequest using the provided parameters
  const invokeReq: InvokeConnectionRequest = new InvokeConnectionRequest(
    requestMethod,
    requestBody,
    requestHeaders,
    pathParams,
    queryParams,
  );

  // Step 7: Invoke the connection using the request
  const response: InvokeConnectionResponse = await skyflowClient
    .connection()
    .invoke(invokeReq);

  // Step 8: Print the response from the invoked connection
  console.log("Connection invocation successful:", response);
} catch (error) {
  // Step 9: Handle any exceptions that occur during the connection invocation
  if (error instanceof SkyflowError) {
    console.error("Skyflow Specific Error:", {
      code: error.error?.http_code,
      message: error.message,
      details: error.error?.details,
    });
  } else {
    console.error("Unexpected Error:", error);
  }
}
```

`method` supports the following methods:

- GET
- POST
- PUT
- PATCH
- DELETE

**pathParams, queryParams, header, body** are the JSON objects represented as dictionaries that will be sent through the connection integration url.

> [!TIP]
> See the full example in the samples directory: [scoped-token-generation-example.ts](samples/vault-api/invoke-connection.ts)  
> See [docs.skyflow.com](https://docs.skyflow.com) for more details on integrations with Connections, Functions, and Pipelines.

## Governance, identity, and access control

### Generate bearer tokens for authentication & authorization

This section covers methods for generating and managing bearer tokens to authenticate API calls:

- **Generate a bearer token:**  
  Enable the creation of bearer tokens using service account credentials. These tokens, valid for 60 minutes, provide secure access to Vault services and management APIs based on the service account's permissions. Use this for general API calls when you only need basic authentication without additional context or role-based restrictions. See: [token-generation-example.ts](http://github.com/skyflowapi/skyflow-node/blob/v2/samples/service-account/token-generation-example.ts)
- **Generate a bearer token with context:**  
  Support embedding context values into bearer tokens, enabling dynamic access control and the ability to track end-user identity. These tokens include context claims and allow flexible authorization for Vault services. Use this when policies depend on specific contextual attributes or when tracking end-user identity is required.
- **Generate a scoped bearer token:**  
  Facilitate the creation of bearer tokens with role-specific access, ensuring permissions are limited to the operations allowed by the designated role. This is particularly useful for service accounts with multiple roles. Use this to enforce fine-grained role-based access control, ensuring tokens only grant permissions for a specific role.
- **Generate signed data tokens:**  
  Add an extra layer of security by digitally signing data tokens with the service account's private key. These signed tokens can be securely detokenized, provided the necessary bearer token and permissions are available. Use this to add cryptographic protection to sensitive data, enabling secure detokenization with verified integrity and authenticity.

#### Generate a bearer token

The [Service Account](https://github.com/skyflowapi/skyflow-node/tree/v2/src/service-account) Node package generates service account tokens using a service account credentials file, which is provided when a service account is created. The tokens generated by this module are valid for 60 minutes and can be used to make API calls to the [Data](https://docs.skyflow.com/record/) and [Management](https://docs.skyflow.com/management/) APIs, depending on the permissions assigned to the service account.

##### `generateBearerToken(filepath)`

The `generateBearerToken(filepath)` function takes the `credentials.json` file path for token generation.

```js
let bearerToken: string = '';
generateBearerToken('path/to/credentials.json')
  .then(response => {
    bearerToken = response.accessToken;
    // Resolve the generated Bearer Token
    resolve(bearerToken);
  })
  .catch(error => {
    // Handle any errors that occur during the generation process
    reject(error);
  });
```

##### `generateBearerTokenFromCreds(credentials)`

Alternatively, you can also send the entire credentials as string by using `generateBearerTokenFromCreds(credentials)`.

```js
let bearerToken: string = '';
generateBearerTokenFromCreds(credentialsString)
  .then(response => {
    bearerToken = response.accessToken;
    // Resolve the generated Bearer Token
    resolve(bearerToken);
  })
  .catch(error => {
    // Handle any errors that occur during the generation process
    reject(error);
  });
```

> [!TIP]
> See the full example in the samples directory: [token-generation-example.ts](http://github.com/skyflowapi/skyflow-node/blob/v2/samples/service-account/token-generation-example.ts)

#### Generate bearer tokens with context

**Context-aware authorization** embeds context values into a bearer token during its generation and so you can reference those values in your policies. This enables more flexible access controls, such as helping you track end-user identity when making API calls using service accounts, and facilitates using signed data tokens during detokenization.

A service account with the context_id identifier generates bearer tokens containing context information, represented as a JWT claim in a Skyflow-generated bearer token. Tokens generated from such service accounts include a context_identifier claim, are valid for 60 minutes, and can be used to make API calls to the Data and Management APIs, depending on the service account's permissions.

```ts
generateBearerTokenFromCreds(JSON.stringify({
  clientID: '<YOUR_CLIENT_ID>',
  clientName: '<YOUR_CLIENT_NAME>',
  keyID: '<YOUR_KEY_ID>',
  tokenURI: '<YOUR_TOKEN_URI>',
  privateKey: '<YOUR_PEM_PRIVATE_KEY>',
}), {
  ctx: 'context_id', // the user's context identifier
})
```

> [!TIP]
> See the full example in the samples directory: [token-generation-with-context-example.ts](samples/service-account/token-generation-with-context-example.ts)  
> See [docs.skyflow.com](https://docs.skyflow.com) for more details on authentication, access control, and governance for Skyflow.

#### Generate scoped bearer tokens

A service account with multiple roles can generate bearer tokens with access limited to a specific role by specifying the appropriate roleID. This can be used to limit access to specific roles for services with multiple responsibilities, such as segregating access for billing and analytics. The generated bearer tokens are valid for 60 minutes and can only execute operations permitted by the permissions associated with the designated role.

> [!TIP]
> See the full example in the samples directory: [scoped-token-generation-example.ts](samples/service-account/scoped-token-generation-example.ts)  
> See [docs.skyflow.com](https://docs.skyflow.com) for more details on authentication, access control, and governance for Skyflow.

#### Generate signed data tokens

Skyflow generates data tokens when sensitive data is inserted into the vault. These data tokens can be digitally signed with a service account's private key, adding an extra layer of protection. Signed tokens can only be detokenized by providing the signed data token along with a bearer token generated from the service account's credentials. The service account must have the necessary permissions and context to successfully detokenize the signed data tokens.

- `generateSignedDataTokens(filepath, options);`
- `generateSignedDataTokensFromCreds(credentialsString, options)`

> [!TIP]
> See the full example in the samples directory: [signed-token-generation-example.ts](samples/service-account/signed-token-generation-example.ts)  
> See [docs.skyflow.com](https://docs.skyflow.com) for more details on authentication, access control, and governance for Skyflow.

## Logging & error handling

The SDK provides useful logging. By default the logging level of the SDK is set to `LogLevel.ERROR`. This can be changed by setting the `logLevel` in Skyflow Config while creating the Skyflow Client as shown below:

Currently, the following five log levels are supported:

- `DEBUG`:  
  When `LogLevel.DEBUG` is passed, logs at all levels will be printed (DEBUG, INFO, WARN, ERROR).
- `INFO`:  
  When `LogLevel.INFO` is passed, INFO logs for every event that occurs during SDK flow execution will be printed, along with WARN and ERROR logs.
- `WARN`:  
  When `LogLevel.WARN` is passed, only WARN and ERROR logs will be printed.
- `ERROR`:  
  When `LogLevel.ERROR` is passed, only ERROR logs will be printed.
- `OFF`:  
  `LogLevel.OFF` can be used to turn off all logging from the Skyflow Python SDK.

**Note:** The ranking of logging levels is as follows: `DEBUG` < `INFO` < `WARN` < `ERROR` < `OFF`.

### Example `skyflowConfig.logLevel: LogLevel.INFO`

```ts
  const skyflowConfig: SkyflowConfig = {
    vaultConfigs: [vaultConfig], // Add the Vault configuration
    skyflowCredentials: skyflowCredentials, // Use Skyflow credentials if no token is passed
    logLevel: LogLevel.INFO, // Recommended to use LogLevel.ERROR in production environment.
  };

  const skyflowClient: Skyflow = new Skyflow(skyflowConfig);
```

#### Bearer token expiration edge cases

When you use bearer tokens for authentication and API requests in SDKs, there's the potential for a token to expire after the token is verified as valid but before the actual API call is made, causing the request to fail unexpectedly due to the token's expiration. An error from this edge case would look something like this:

```txt
message: Authentication failed. Bearer token is expired. Use a valid bearer token. See https://docs.skyflow.com/api-authentication/
```

If you encounter this kind of error, retry the request. During the retry the SDK detects that the previous bearer token has expired and generates a new one for the current and subsequent requests.

> [!TIP]
> See the full example in the samples directory: [bearer-token-expiry-example.ts](samples/service-account/bearer-token-expiry-example.ts)  
> See [docs.skyflow.com](https://docs.skyflow.com) for more details on authentication, access control, and governance for Skyflow.

## Security

### Reporting a Vulnerability

If you discover a potential security issue in this project, please reach out to us at **security@skyflow.com**. Please do not create public GitHub issues or Pull Requests, as malicious actors could potentially view them.
