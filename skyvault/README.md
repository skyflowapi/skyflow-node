# Skyflow Node.js SDK

> **This is the current, recommended version of the Skyflow SDK.** V2.1.0 brings flexible auth, multi-vault support, builder patterns, native data types, and rich error diagnostics.
>
> Meant for **Privacy DB** vaults. Working with a Flow DB vault? Use the [FlowVault SDK](../flowvault/README.md) (`skyflow-flowvault-node`) instead.
>
> Migrating from v1? See the **[Migration Guide](../docs/migrate_to_v2.md)** for step-by-step instructions. V1 is in maintenance mode and reached End of Life on October 31, 2026.
>
> Using the Detect methods that this SDK replaced (`deidentifyText`, `reidentifyText`, `getDetectRun`)? See **[Migrate to the new Detect methods](../docs/migrate_detect.md)**.

Securely handle sensitive data at rest, in-transit, and in-use with the Skyflow SDK for Node.js, Deno, Bun, and Cloudflare Workers.

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
    - [Before you begin](#before-you-begin)
    - [Authenticate](#authenticate)
    - [API Key](#api-key)
    - [Bearer Token (static)](#bearer-token-static)
    - [Initialize the client](#initialize-the-client)
    - [Insert data into the vault, get tokens back](#insert-data-into-the-vault-get-tokens-back)
  - [Upgrade from v1 to v2](#upgrade-from-v1-to-v2)
  - [Vault](#vault)
    - [Insert and tokenize data: `.insert(request)`](#insert-and-tokenize-data-insertrequest)
      - [Insert example with `continueOnError` option](#insert-example-with-continueonerror-option)
      - [Upsert request](#upsert-request)
    - [Detokenize: `.detokenize(request, options)`](#detokenize-detokenizerequest-options)
      - [Construct a detokenize request](#construct-a-detokenize-request)
    - [Get Record(s): `.get(request, options)`](#get-records-getrequest-options)
      - [Construct a get request](#construct-a-get-request)
      - [Get by Skyflow IDs](#get-by-skyflow-ids)
      - [Get tokens for records](#get-tokens-for-records)
      - [Get by column name and column values](#get-by-column-name-and-column-values)
      - [Redaction Types](#redaction-types)
    - [Update Records](#update-records)
      - [Construct an update request](#construct-an-update-request)
    - [Delete Records](#delete-records)
    - [Query](#query)
    - [Upload File](#upload-file)
    - [Retrieve Existing Tokens: `.tokenize(request)`](#retrieve-existing-tokens-tokenizerequest)
      - [Construct a `.tokenize()` request](#construct-a-tokenize-request)
  - [Detect](#detect)
    - [De-identify a string: `.deidentifyString(request)`](#de-identify-a-string-deidentifystringrequest)
    - [Detect configuration](#detect-configuration)
    - [De-identify a file: `.deidentifyFile(request)`](#de-identify-a-file-deidentifyfilerequest)
    - [Re-identify a string: `.reidentifyString(request)`](#re-identify-a-string-reidentifystringrequest)
    - [Re-identify a file: `.reidentifyFile(request)`](#re-identify-a-file-reidentifyfilerequest)
    - [Get run: `.getRun(request)`](#get-run-getrunrequest)
    - [Check guardrails: `.checkGuardrails(request)`](#check-guardrails-checkguardrailsrequest)
    - [Detect errors](#detect-errors)
  - [Connections](#connections)
    - [Configure a connection](#configure-a-connection)
    - [Invoke a connection](#invoke-a-connection)
      - [Construct an invoke connection request](#construct-an-invoke-connection-request)
  - [Authentication \& authorization](#authentication--authorization)
    - [Types of `credentials`](#types-of-credentials)
    - [Generate bearer tokens for authentication \& authorization](#generate-bearer-tokens-for-authentication--authorization)
      - [Generate a bearer token](#generate-a-bearer-token)
        - [`generateBearerToken(filepath)`](#generatebearertokenfilepath)
        - [`generateBearerTokenFromCreds(credentialsString)`](#generatebearertokenfromcredscredentialsstring)
      - [Generate bearer tokens scoped to certain roles](#generate-bearer-tokens-scoped-to-certain-roles)
      - [Generate bearer tokens with `ctx` for context-aware authorization](#generate-bearer-tokens-with-ctx-for-context-aware-authorization)
      - [Generate signed data tokens](#generate-signed-data-tokens)
  - [Client management](#client-management)
  - [Using the client in production](#using-the-client-in-production)
  - [Logging](#logging)
    - [Example `skyflowConfig.logLevel: LogLevel.INFO`](#example-skyflowconfigloglevel-loglevelinfo)
  - [Error handling](#error-handling)
    - [Catching `SkyflowError` instances](#catching-skyflowerror-instances)
    - [Per-record errors (`SkyflowRecordError`)](#per-record-errors-skyflowrecorderror)
    - [Bearer token expiration edge cases](#bearer-token-expiration-edge-cases)
  - [Troubleshooting](#troubleshooting)
  - [TypeScript types reference](#typescript-types-reference)
  - [Security](#security)
    - [Reporting a Vulnerability](#reporting-a-vulnerability)

## Overview

The Skyflow SDK enables you to connect to your Skyflow Vault(s) to securely handle sensitive data at rest, in-transit, and in-use.

> [!TIP]
> Looking for the full list of request parameters, options setters, response fields, enums, and Detect helper classes? See the **[API Reference](../docs/api_reference.md)**.

> [!IMPORTANT]  
> This readme documents SDK version 2.  
> For version 1 see the [v1.14.2 README](https://github.com/skyflowapi/skyflow-node/tree/1.14.2).  
> For more information on how to migrate see [MIGRATE_TO_V2.md](../docs/migrate_to_v2.md).  
> For the Detect methods replaced in 2.2.0 see [migrate_detect.md](../docs/migrate_detect.md).

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

Get started quickly with the essential steps: authenticate, initialize the client, and perform a basic vault operation. This section shows you a minimal working example.

### Before you begin

You need a Skyflow account and a few values from Skyflow Studio. If you don't have an account, [request a demo](https://www.skyflow.com/get-demo).

| Value | Where to find it |
|---|---|
| `vaultId` | Your vault's details page in Skyflow Studio. |
| `clusterId` | The first segment of your vault URL: `https://{clusterId}.vault.skyflowapis.com`. |
| `env` | The environment your vault runs in — `Env.PROD`, `Env.SANDBOX`, `Env.DEV`, or `Env.STAGE` (defaults to `PROD`). |
| Credentials | Create a **service account** in Studio. Choose **API key** during creation for the simplest setup, or download the `credentials.json` file for token-based auth. See [Authentication & authorization](#authentication--authorization). |

The quickstart below assumes a table named `table1` with `card_number` and `cardholder_name` columns. Adjust the table and column names to match your vault schema. See the [Skyflow docs](https://docs.skyflow.com/) for creating vaults, tables, and service accounts.

### Authenticate

You can use an API key or a personal bearer token to directly authenticate and authorize requests with the SDK. Use API keys for long-term service authentication. Use bearer tokens for optimal security.

### API Key

```typescript
import { Credentials } from 'skyflow-node';

const credentials: Credentials = {
  apiKey: "<API_KEY>",
};
```

### Bearer Token (static)

```typescript
import { Credentials } from 'skyflow-node';

const credentials: Credentials = {
  token: "<BEARER_TOKEN>",
};
```

For authenticating via generated bearer tokens including support for scoped tokens, context-aware access tokens, and more, refer to the [Authentication & Authorization](#authentication--authorization) section.

### Initialize the client

Initialize the Skyflow client first. You can specify different credential types during initialization.

```javascript
import { Skyflow, SkyflowConfig, VaultConfig, Env, LogLevel } from 'skyflow-node';

// Create a credentials object. We'll use an API key.
const skyflowCredentials = {
    apiKey: "<SKYFLOW_API_KEY>"
};

// Configure vault
const vaultConfig: VaultConfig = {
    vaultId: '<VAULT_ID>',       // required: vault identifier
    clusterId: '<CLUSTER_ID>',   // required: from vault URL
    env: Env.PROD,               // optional: PROD (default), SANDBOX, DEV, STAGE
    // credentials: vaultCredentials  // optional: per-vault credentials; overrides skyflowCredentials
};

// Initialize Skyflow client
const skyflowConfig: SkyflowConfig = {
    vaultConfigs: [vaultConfig],
    skyflowCredentials: skyflowCredentials,
    logLevel: LogLevel.ERROR
};

const skyflowClient: Skyflow = new Skyflow(skyflowConfig);
```

See [docs/advanced_initialization.md](../docs/advanced_initialization.md) for advanced initialization examples including multiple vaults and different credential types.

### Insert data into the vault, get tokens back

Insert data into your vault using the `insert` method. Set `insertOptions.setReturnTokens(true)` to ensure values are tokenized in the response.

Create an insert request with the [`InsertRequest`](../docs/api_reference.md#insertrequest) class, which includes the values to be inserted as a list of records. 

Below is a simple example to get started. See the [Insert and tokenize data](#insert-and-tokenize-data-insertrequest) section for advanced options.

```javascript
import { InsertRequest, InsertOptions } from "skyflow-node";

// Insert sensitive data into the vault
const insertData = [
  { card_number: "4111111111111112", cardholder_name: "John Doe" },
];
const insertReq = new InsertRequest("table1", insertData);

const insertOptions = new InsertOptions();
insertOptions.setReturnTokens(true);

const insertResponse = await skyflowClient
  .vault(vaultId)
  .insert(insertReq, insertOptions);

console.log("Insert response:", insertResponse);
```

Returns an [`InsertResponse`](../docs/api_reference.md#insertresponse) (`insertedFields`, `errors`). With `setReturnTokens(true)`, each entry includes the `skyflowId` and a token per column:

```text
Insert response: { insertedFields: [{ skyflowId: 'a8f0c2e1-7b3d-4f9a-8c21-1d2e3f4a5b6c', card_number: '5391-4629-3722-7102', cardholder_name: '0f6b8a2c-90ab-4cde-9def-567890abcdef' }], errors: null }
```

## Upgrade from v1 to v2

Upgrade from `skyflow-node` v1 using the dedicated guide in [docs/migrate_to_v2.md](../docs/migrate_to_v2.md).

Already on v2 and using `deidentifyText`, `reidentifyText`, `deidentifyFile` or `getDetectRun`? Those are replaced by the [Detect](#detect) methods in 2.2.0; see **[Migrate to the new Detect methods](../docs/migrate_detect.md)**.

## Vault

The [Vault](https://docs.skyflow.com/docs/vaults) performs operations on the vault such as inserting records, detokenizing tokens, retrieving tokens for list of `skyflowId`s and to invoke the Connection.

### Insert and tokenize data: `.insert(request)`

Pass options to the `insert` method to enable additional functionality such as returning tokenized data, upserting records, or allowing bulk operations to continue despite errors. See [Quickstart](#quickstart) for a basic example.

```typescript
import { InsertRequest, InsertResponse } from 'skyflow-node';

const insertRequest = new InsertRequest('table1', [
  {
    <FIELD_NAME_1>: '<VALUE_1>',
    <FIELD_NAME_2>: '<VALUE_2>',
  },
  {
    <FIELD_NAME_1>: '<VALUE_1>',
    <FIELD_NAME_2>: '<VALUE_2>',
  },
]);

const response: InsertResponse = await skyflowClient
  .vault('<VAULT_ID>')
  .insert(insertRequest);

console.log('Insert response:', response);
```

Returns an [`InsertResponse`](../docs/api_reference.md#insertresponse) (`insertedFields`, `errors`). With `setContinueOnError(true)`, `insertedFields` contains successful records and `errors` contains per-record failures:

```text
Insert response: { insertedFields: [{ skyflowId: 'a8f0c2e1-7b3d-4f9a-8c21-1d2e3f4a5b6c', '<FIELD_NAME_1>': '<TOKEN_1>', '<FIELD_NAME_2>': '<TOKEN_2>' }], errors: null }
```

> **Note:** The response key is `skyflowId`. The legacy `skyflow_id` key is deprecated and will be removed in an upcoming release.

#### Insert example with `continueOnError` option

Set the `continueOnError` flag to `true` to allow insert operations to proceed despite encountering partial errors.

> [!TIP]
> See the full example in the samples directory: [insert-continue-on-error.ts](samples/vault-api/insert-continue-on-error.ts)

#### Upsert request

Turn an insert into an 'update-or-insert' operation using the upsert option. The vault checks for an existing record with the same value in the specified column. If a match exists, the record updates; otherwise, a new record inserts.

```typescript
// Specify the column to use as the index for the upsert.
// Note: The column must have the `unique` constraint configured in the vault.
insertOptions.setUpsertColumn("cardholder_name");
```

For all `InsertOptions` setters and `TokenMode` values, see [InsertOptions](../docs/api_reference.md#insertoptions) in the API reference.

### Detokenize: `.detokenize(request, options)`

Convert tokens back into plaintext values (or masked values) using the `.detokenize()` method. Detokenization accepts tokens and returns values.

Create a detokenization request with the [`DetokenizeRequest`](../docs/api_reference.md#detokenizerequest) class, which requires a list of tokens and column groups as input.

Provide optional parameters such as the redaction type and the option to continue on error.

#### Construct a detokenize request

```typescript
import {
  DetokenizeOptions,
  DetokenizeRequest,
  DetokenizeResponse,
} from "skyflow-node";

const detokenizeRequest = new DetokenizeRequest([
  { token: "token1", redactionType: RedactionType.PLAIN_TEXT },
  { token: "token2", redactionType: RedactionType.PLAIN_TEXT },
]);

const detokenizeOptions = new DetokenizeOptions();
detokenizeOptions.setContinueOnError(true);
detokenizeOptions.setDownloadUrl(false);

const response: DetokenizeResponse = await skyflowClient
  .vault(primaryVaultConfig.vaultId)
  .detokenize(detokenizeRequest, detokenizeOptions);

console.log("Detokenization response:", response);
```

Returns a [`DetokenizeResponse`](../docs/api_reference.md#detokenizeresponse) (`detokenizedFields`, `errors`):

```text
Detokenization response: { detokenizedFields: [{ token: '5391-4629-3722-7102', value: '4111111111111112', type: 'STRING' }], errors: null }
```

> [!TIP]
> See the full example in the samples directory: [detokenzie-records.ts](samples/vault-api/detokenzie-records.ts)

### Get Record(s): `.get(request, options)`

Retrieve data using Skyflow IDs or unique column values with the get method. Create a get request with the [`GetRequest`](../docs/api_reference.md#getrequest) class, specifying parameters such as the table name, redaction type, Skyflow IDs, column names, and column values. 

> [!NOTE]
> You can't use both Skyflow IDs and column name/value pairs in the same request. Use the `GetOptions` class to specify whether to return tokens.

#### Construct a get request

```typescript
import { GetRequest, GetOptions, GetResponse } from "skyflow-node";

const getRequest = new GetRequest("table1", ["<SKYFLOW_ID1>", "<SKYFLOW_ID2>"]);

const getOptions = new GetOptions();
getOptions.setReturnTokens(false);

const response: GetResponse = await skyflowClient
  .vault("<VAULT_ID>")
  .get(getRequest, getOptions);

console.log("Get response:", response);
```

Returns a [`GetResponse`](../docs/api_reference.md#getresponse) (`data`, `errors`):

```text
Get response: { data: [{ skyflowId: 'a8f0c2e1-7b3d-4f9a-8c21-1d2e3f4a5b6c', card_number: '4111111111111112', cardholder_name: 'John Doe' }], errors: null }
```

> **Note:** The response key is `skyflowId`. The legacy `skyflow_id` key is deprecated and will be removed in an upcoming release.

#### Get by Skyflow IDs

Retrieve specific records using Skyflow IDs. Use this method when you know the exact record IDs.

```typescript
import {
  GetOptions,
  GetRequest,
  SkyflowError,
  GetResponse,
  RedactionType,
} from "skyflow-node";

// Initialize a list of Skyflow IDs to retrieve records (replace with actual Skyflow IDs)
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
```

#### Get tokens for records

Return tokens for records to securely process sensitive data while maintaining data privacy.

```ts
getOptions.setReturnTokens(true); // Set to `true` to get tokens
```

> [!TIP]
> See the full example in the samples directory: [get-records.ts](samples/vault-api/get-records.ts)

#### Get by column name and column values

Retrieve records by unique column values when you don't know the Skyflow IDs. Use this method to query data with alternate unique identifiers.

```ts
const getRequest: GetColumnRequest = new GetColumnRequest(
  tableName,
  columnName,
  columnValues, // Column values of the records to return
);
```

> [!TIP]
> See the full example in the samples directory: [get-column-values.ts](samples/vault-api/get-column-values.ts)

#### Redaction Types

Use redaction types to control how sensitive data displays when retrieved from the vault.

**Available Redaction Types**

- `DEFAULT`: Applies the vault-configured default redaction setting.
- `REDACTED`: Completely removes sensitive data from view.
- `MASKED`: Partially obscures sensitive information.
- `PLAIN_TEXT`: Displays the full, unmasked data.

**Choosing the Right Redaction Type**

- Use `REDACTED` for scenarios requiring maximum data protection to prevent exposure of sensitive information.
- Use `MASKED` to provide partial visibility of sensitive data for less critical use cases.
- Use `PLAIN_TEXT` for internal, authorized access where full data visibility is necessary.

For all `GetOptions` setters and `OrderByEnum` values, see [GetOptions](../docs/api_reference.md#getoptions) in the API reference.

### Update Records

Update data in your vault using the `update` method. Create an update request with the [`UpdateRequest`](../docs/api_reference.md#updaterequest) class, specifying parameters such as the table name and data (as a dictionary). 

Configure update options using the `UpdateOptions` class to control returnTokens, tokens, and tokenMode. When `returnTokens` is `true`, Skyflow returns tokens for the updated records. When `false`, Skyflow returns IDs for the updated records.

#### Construct an update request

```typescript
import { UpdateRequest, UpdateOptions, UpdateResponse, TokenMode } from 'skyflow-node';

const updateRequest = new UpdateRequest('table1', {
  skyflowId: '<SKYFLOW_ID>',
  <COLUMN_NAME_1>: '<COLUMN_VALUE_1>',
  <COLUMN_NAME_2>: '<COLUMN_VALUE_2>'
});

const updateOptions = new UpdateOptions();
updateOptions.setReturnTokens(true); // return tokens for updated fields

const response: UpdateResponse = await skyflowClient
  .vault('<VAULT_ID>')
  .update(updateRequest, updateOptions);

console.log('Update response:', response);
```

Returns an [`UpdateResponse`](../docs/api_reference.md#updateresponse) (`updatedField`, `errors`). With the default `setReturnTokens(false)`, `updatedField` contains only `skyflowId`:

```text
Update response: { updatedField: { skyflowId: 'a8f0c2e1-7b3d-4f9a-8c21-1d2e3f4a5b6c' }, errors: null }
```

> **Note:** The response key is `skyflowId`. The legacy `skyflow_id` key is deprecated and will be removed in an upcoming release.

For all `UpdateOptions` setters and `TokenMode` values, see [UpdateOptions](../docs/api_reference.md#updateoptions) in the API reference.

> [!TIP]
> See the full example in the samples directory: [update-record.ts](samples/vault-api/update-record.ts)

### Delete Records

Delete records using Skyflow IDs with the `delete` method. Create a delete request with the [`DeleteRequest`](../docs/api_reference.md#deleterequest) class, which accepts a list of Skyflow IDs:

```typescript
import { DeleteRequest, DeleteResponse } from "skyflow-node";

const deleteRequest = new DeleteRequest("table1", [
  "<SKYFLOW_ID1>",
  "<SKYFLOW_ID2>",
  "<SKYFLOW_ID3>",
]);

const response: DeleteResponse = await skyflowClient
  .vault("<VAULT_ID>")
  .delete(deleteRequest);

console.log("Delete response:", response);
```

Returns a [`DeleteResponse`](../docs/api_reference.md#deleteresponse) (`deletedIds`, `errors`):

```text
Delete response: { deletedIds: ['a8f0c2e1-7b3d-4f9a-8c21-1d2e3f4a5b6c'], errors: null }
```

> [!TIP]
> See the full example in the samples directory: [delete-records.ts](samples/vault-api/delete-records.ts)

### Query

Retrieve data with SQL queries using the `query` method. Create a query request with the [`QueryRequest`](../docs/api_reference.md#queryrequest) class, which takes the `query` parameter as follows:



```typescript
import { QueryRequest, QueryResponse } from "skyflow-node";

const queryRequest = new QueryRequest(
  "SELECT * FROM table1 WHERE column1 = 'value'",
);

const response: QueryResponse = await skyflowClient
  .vault("<VAULT_ID>")
  .query(queryRequest);

console.log("Query response:", response);
```

Returns a [`QueryResponse`](../docs/api_reference.md#queryresponse) (`fields`, `errors`). Each record also includes a `tokenizedData` map:

```text
Query response: { fields: [{ skyflowId: 'a8f0c2e1-7b3d-4f9a-8c21-1d2e3f4a5b6c', card_number: '4111111111111112', tokenizedData: { card_number: '5391-4629-3722-7102' } }], errors: null }
```

> [!TIP]
> See the full example in the samples directory: [query-records.ts](samples/vault-api/query-records.ts)

Refer to [Query your data](https://docs.skyflow.com/query-data/) and [Execute Query](https://docs.skyflow.com/record/#QueryService_ExecuteQuery) for guidelines and restrictions on supported SQL statements, operators, and keywords.

### Upload File

Upload files to a Skyflow vault using the `uploadFile` method. Requires Node.js v20 or above. Create a [`FileUploadRequest`](../docs/api_reference.md#fileuploadrequest) with the table name and column name, then configure a `FileUploadOptions` with the file source and optionally a Skyflow ID.

**Attach a file to an existing record:**

```typescript
import { FileUploadRequest, FileUploadResponse, FileUploadOptions } from "skyflow-node";

const uploadReq = new FileUploadRequest("<TABLE_NAME>", "<COLUMN_NAME>");

const uploadOptions = new FileUploadOptions();
uploadOptions.setSkyflowId("<SKYFLOW_ID>"); // attach to this record
uploadOptions.setFilePath("path/to/file.pdf");

const response: FileUploadResponse = await skyflowClient
  .vault("<VAULT_ID>")
  .uploadFile(uploadReq, uploadOptions);

console.log("File upload:", response);
```

**Upload a file and create a new record (omit `setSkyflowId`):**

```typescript
const uploadReq = new FileUploadRequest("documents", "attachment");

const uploadOptions = new FileUploadOptions();
uploadOptions.setFilePath("path/to/file.pdf"); // no setSkyflowId — creates a new record

const response: FileUploadResponse = await skyflowClient
  .vault("<VAULT_ID>")
  .uploadFile(uploadReq, uploadOptions);

console.log("File upload:", response);
```

Both forms return a [`FileUploadResponse`](../docs/api_reference.md#fileuploadresponse) (`skyflowId`, `errors`):

```text
File upload: { skyflowId: 'a8f0c2e1-7b3d-4f9a-8c21-1d2e3f4a5b6c', errors: null }
```

For all `FileUploadOptions` setters, see [FileUploadOptions](../docs/api_reference.md#fileuploadoptions) in the API reference.

> [!TIP]
> See the full example in the samples directory: [file-upload.ts](samples/vault-api/file-upload.ts)

### Retrieve Existing Tokens: `.tokenize(request)`

Retrieve tokens for values that already exist in the vault using the `.tokenize()` method. This method returns existing tokens only and does not generate new tokens. Build the request with the [`TokenizeRequest`](../docs/api_reference.md#tokenizerequest) class.

#### Construct a `.tokenize()` request

```typescript
import { TokenizeRequest, TokenizeResponse } from "skyflow-node";

const tokenizeRequest = new TokenizeRequest([
  { value: "<VALUE_1>", columnGroup: "<COLUMN_GROUP_1>" },
  { value: "<VALUE_2>", columnGroup: "<COLUMN_GROUP_2>" },
]);

const response: TokenizeResponse = await skyflowClient
  .vault("<VAULT_ID>")
  .tokenize(tokenizeRequest);

console.log("Tokenization Result:", response);
```

Returns a [`TokenizeResponse`](../docs/api_reference.md#tokenizeresponse) (`tokens`, `errors`):

```text
Tokenization Result: { tokens: ['5391-4629-3722-7102', '0f6b8a2c-90ab-4cde-9def-567890abcdef'], errors: null }
```

> [!TIP]
> See the full example in the samples directory: [tokenize-records.ts](samples/vault-api/tokenize-records.ts)

## Detect

Skyflow Detect finds and de-identifies sensitive data in strings and files (documents, spreadsheets, images and audio), re-identifies vault tokens on demand, and screens text against guardrails for toxicity and denied topics. The SDK exposes it through `DetectController`, returned by `skyflowClient.detect()` and `skyflowClient.detect(vaultId)`. Every request is scoped to that vault and uses the vault's credentials and log level.

Detect configurations are created in Studio or through the management API. The SDK does not create, update or delete them. These methods replace `deidentifyText`, `reidentifyText`, `deidentifyFile` (old shape) and `getDetectRun`; see [Migrate to the new Detect methods](../docs/migrate_detect.md) if you call those.

| Method | Request | Response | Description |
|--------|---------|----------|-------------|
| `deidentifyString(request)` | [`DeidentifyStringRequest`](../docs/api_reference.md#deidentifystringrequest) | [`DeidentifyStringResponse`](../docs/api_reference.md#deidentifystringresponse) | Detect and replace sensitive data in a string |
| `deidentifyFile(request)` | [`DeidentifyFileRequest`](../docs/api_reference.md#deidentifyfilerequest) | [`DeidentifyFileResponse`](../docs/api_reference.md#deidentifyfileresponse) | Submit a file for de-identification, optionally polling the run to completion |
| `reidentifyString(request)` | [`ReidentifyStringRequest`](../docs/api_reference.md#reidentifystringrequest) | [`ReidentifyStringResponse`](../docs/api_reference.md#reidentifystringresponse) | Replace tokens in a string with their original or redacted values |
| `reidentifyFile(request)` | [`ReidentifyFileRequest`](../docs/api_reference.md#reidentifyfilerequest) | [`ReidentifyFileResponse`](../docs/api_reference.md#reidentifyfileresponse) | Replace tokens in a file with their original or redacted values |
| `getRun(request)` | [`GetRunRequest`](../docs/api_reference.md#getrunrequest) | [`GetRunResponse`](../docs/api_reference.md#getrunresponse) | Retrieve the status and outputs of a Detect file run |
| `checkGuardrails(request)` | [`CheckGuardrailsRequest`](../docs/api_reference.md#checkguardrailsrequest) | [`CheckGuardrailsResponse`](../docs/api_reference.md#checkguardrailsresponse) | Screen text for toxicity and denied topics |

**Before you start**

- **Role.** The service account needs the Detect Invoker, Detect Manager or Vault Owner role on the vault. Re-identifying values stored as `VAULT_TOKEN` is governed like detokenization: the caller also needs a policy that grants the Detokenization action on the destination table and columns, unless it is a Vault Owner.
- **Configuration.** `configurationId` is the id of a Detect configuration created through the management API. The alternative is an inline `DetectConfiguration` passed as `configuration` (see [Detect configuration](#detect-configuration)). Both are optional: with neither set the SDK sends only the vault id and the run uses the vault's default Detect settings. Sending both is rejected by the API with HTTP 400.
- **Destination for vault tokens.** An entity de-identified with `VAULT_TOKEN` stores its value in the `table.column` named by `destination`. That table and column must already exist in the vault.
- **Where the values come from.**
  - `<CONFIGURATION_ID>`: open the configuration in Studio under your vault's Detect settings and copy its id, or take the `id` returned when you create one through the management API.
  - `<TABLE>.<COLUMN>`: a table and column of the vault schema (Studio: vault > **Schema**) with tokenization enabled; `VAULT_TOKEN` values are stored there and re-identified from there.
  - `RedactionType`: `PLAIN_TEXT`, `MASKED` or `REDACTED`, the same values `get` and `detokenize` use. The Detect API does not accept `DEFAULT` here.
  - If you do not have a vault yet, start at [Try Skyflow](https://skyflow.com/try-skyflow); the [Skyflow docs](https://docs.skyflow.com) cover Studio, schemas and tokenization.
- **API reference.** Every Detect request, response and configuration type is listed in the [API reference](../docs/api_reference.md#detect-api). Errors are described under [Detect errors](#detect-errors).

### De-identify a string: `.deidentifyString(request)`

`DeidentifyStringRequest` takes the text plus, optionally, `configurationId` (a stored Detect configuration) or `configuration` (an inline `DetectConfiguration`). The SDK fills the vault id into the configuration from the controller.

```typescript
import {
  DeidentifyStringRequest,
  DeidentifyStringResponse,
  DetectConfiguration,
  EntityType,
  DeidentificationType,
  ReturnEntitiesType,
  SkyflowError,
} from 'skyflow-node';

// Stored configuration
const stored = new DeidentifyStringRequest(
  'My name is John Doe, and my email is johndoe@acme.com.',
  { configurationId: '<CONFIGURATION_ID>' },
);
const response: DeidentifyStringResponse = await skyflowClient.detect().deidentifyString(stored);
console.log(response.processedText);
// My name is [NAME_1], and my email is [EMAIL_ADDRESS_1].

// Inline configuration
const configuration: DetectConfiguration = {
  detect: {
    entities: [
      {
        entityType: EntityType.NAME,
        deidentificationType: DeidentificationType.VAULT_TOKEN,
        destination: '<TABLE>.<COLUMN>', // table.column that stores the value
      },
      { entityType: EntityType.ALL, deidentificationType: DeidentificationType.ENTITY_UNIQUE_COUNTER },
    ],
    skip: ['Skyflow'],
    returnEntities: ReturnEntitiesType.EXCLUDE_SENSITIVE_DATA,
  },
};
const inline = new DeidentifyStringRequest(
  'My name is John Doe, and my email is johndoe@acme.com.',
  { configuration },
);
const inlineResponse = await skyflowClient.detect().deidentifyString(inline);
for (const entity of inlineResponse.entities) {
  console.log(entity.entityType, entity.token, entity.location?.startIndex, entity.location?.endIndex);
}
console.log(inlineResponse.metrics?.wordCount);
```

`DeidentifyStringResponse` carries `processedText`, `entities` (a `DetectedEntity[]` with token, entity type, location and confidence scores; never `null`) and `metrics`. As JSON:

```json
{
  "processedText": "My name is [NAME_1], and my email is [EMAIL_ADDRESS_1].",
  "entities": [
    {
      "token": "[NAME_1]",
      "value": "",
      "location": { "startIndex": 11, "endIndex": 19, "startIndexProcessed": 11, "endIndexProcessed": 19 },
      "entityType": "NAME",
      "entityScores": { "NAME": 0.99 }
    },
    {
      "token": "[EMAIL_ADDRESS_1]",
      "value": "",
      "location": { "startIndex": 37, "endIndex": 53, "startIndexProcessed": 37, "endIndexProcessed": 54 },
      "entityType": "EMAIL_ADDRESS",
      "entityScores": { "EMAIL_ADDRESS": 0.99 }
    }
  ],
  "metrics": { "wordCount": 11, "characterCount": 55, "size": null, "pages": null, "slides": null, "duration": null }
}
```

`value` is populated only when the configuration sets `returnEntities` to `ALL`.

> [!TIP]
> See the full example in the samples directory: [deidentify-string.ts](samples/detect-api/deidentify-string.ts)

### Detect configuration

`DetectConfiguration` is the inline form of a stored configuration and accepts the same options. `detect` applies to string and file inputs; `fileMapping` and `media` apply to file inputs only. All of these are plain TypeScript interfaces, so write them as object literals.

| Type | Fields | Notes |
|------|--------|-------|
| `Detect` | `entities`, `objectEntities`, `restrict`, `skip`, `customTypes`, `returnEntities` | `restrict` and `skip` are regexes that are always, respectively never, treated as sensitive. `returnEntities` is `EXCLUDE_SENSITIVE_DATA` (server default), `ALL` or `NONE`. |
| `Entity` | `entityType`, `deidentificationType`, `destination`, `transformation`, `includePrefix`, `prefixOverride` | `entityType` defaults to `ALL`. `deidentificationType` is `ENTITY_UNIQUE_COUNTER` (server default), `ENTITY_ONLY`, `MASK` or `VAULT_TOKEN`. `destination`, `includePrefix` and `prefixOverride` apply only with `VAULT_TOKEN`: `includePrefix` is `YES` (server default), `NO` (raw token, cannot be re-identified) or `INCLUDE_PREFIX_UNSPECIFIED` (field omitted); `prefixOverride` replaces the entity-type prefix in the token and is not valid with `includePrefix` `NO`. |
| `Transformation` / `ShiftDates` | `shiftDates`; `minDays`, `maxDays` | Shifts detected dates by a random number of days within the range. |
| `CustomType` | `label`, `match`, `deidentificationType`, `destination`, `includePrefix`, `prefixOverride` | A regex-defined entity type. `label` is reported as the entity type of its matches and is the default token prefix. The remaining fields work as on `Entity`; `destination` is required with `VAULT_TOKEN`. |
| `ObjectEntity` | `entityType`, `deidentificationType` | Visual objects in images: `FACE`, `LICENSE_PLATE`, `LOGO`, `SIGNATURE` or `ALL`, handled with `REDACT` or `UNREDACT`. File inputs only. |
| `FileMapping` | `source`, `destination`, `outputFileNameSuffix`, `entitiesDestination`, `objectEntitiesDestination` | Where the processed file and the entity files are written. File inputs only. |
| `Media` | `audio`, `document`, `image` | Media-type options. File inputs only. |
| `Audio` / `Bleep` | `outputProcessedAudio`, `outputTranscription`, `bleep`; `startPadding`, `stopPadding`, `frequency`, `gain` | `outputTranscription` is an `OutputTranscriptionType`. `Bleep` is the tone laid over detected speech; paddings are in seconds, frequency in Hz. |
| `Document` / `Pdf` | `pdf`; `processingMode`, `density`, `maxResolution` | `processingMode` is a `PdfProcessingMode` (`NONE`, `OCR` or `TEXT_LAYER`). `density` is the rendering DPI. |
| `Image` | `outputProcessedImage`, `outputOcrText`, `maskingMethod` | `maskingMethod` is a `MaskingMethod` (`NONE`, `BLUR` or `BLACKBOX`). |

```typescript
import {
  DetectConfiguration,
  EntityType,
  DeidentificationType,
  ObjectEntityType,
  ObjectDeidentificationType,
  MaskingMethod,
  PdfProcessingMode,
  OutputTranscriptionType,
} from 'skyflow-node';

const configuration: DetectConfiguration = {
  detect: {
    entities: [
      {
        entityType: EntityType.DOB,
        deidentificationType: DeidentificationType.ENTITY_UNIQUE_COUNTER,
        transformation: { shiftDates: { minDays: 10, maxDays: 30 } },
      },
      { entityType: EntityType.ALL },
    ],
    objectEntities: [{ entityType: ObjectEntityType.FACE, deidentificationType: ObjectDeidentificationType.REDACT }],
    customTypes: [{ label: 'EMPLOYEE_ID', match: ['EMP-[0-9]{6}'] }],
    restrict: ['[0-9]{3}-[0-9]{2}-[0-9]{4}'],
  },
  media: {
    image: { maskingMethod: MaskingMethod.BLUR, outputOcrText: true },
    document: { pdf: { processingMode: PdfProcessingMode.OCR } },
    audio: {
      outputTranscription: OutputTranscriptionType.TRANSCRIPTION,
      bleep: { startPadding: 0.5, stopPadding: 0.5 },
    },
  },
};
```

### De-identify a file: `.deidentifyFile(request)`

File de-identification is asynchronous on the API: the submit call returns a run id and the result is retrieved from the run. `deidentifyFile` exposes both modes.

> [!WARNING]
> **`deidentifyFile` does not wait for the result unless you set `pollOptions`.** Without it the call resolves with only the run id: `status` is `null`, `output` is empty and nothing is written to disk. Code that reads the outputs straight after the call runs without error, and the missing files only show up downstream. Set `pollOptions` to wait for the run, or keep the run id and call [`getRun`](#get-run-getrunrequest). If you are migrating from `deidentifyText`-era code that always waited, see [Migrate to the new Detect methods](../docs/migrate_detect.md#step-4-deidentifyfile-new-request-and-response).

- **Submit only** (default): one call, returns `runId`. `status` is `null` and nothing is written to disk. Retrieve the result later with [`getRun`](#get-run-getrunrequest).
- **Submit and poll**: set `pollOptions`. The SDK polls the run with exponential backoff (1, 2, 4, 8, 16, then 32 seconds between lookups) until it is `SUCCESS`, `FAILED` or `UNKNOWN`, or until `waitTime` (default 60 s, max 300) or `maxAttempts` (default 23, max 23) is used up. If the budget runs out the response carries the run id with `IN_PROGRESS` or `QUEUED` so you can resume with `getRun`.

The file is supplied in one of three ways: a `dataSource` plus `value` (`BASE64` content, a `SKYFLOW_ID`, or a `PRESIGNED_URL`), a `file` (a web `File`, Node.js 20+), or a `filePath`. A local file is read, base64-encoded, and its `dataFormat` inferred from the extension. Supply exactly one of `value`, `file` or `filePath`. `configurationId` and `configuration` follow the same rules as for strings.

`dataFormat` accepts every `FileDataFormat`: `BMP`, `CSV`, `DCM`, `DOC`, `DOCX`, `GIF`, `JPEG`, `JPG`, `JSON`, `JSONL`, `MP3`, `PDF`, `PNG`, `PPT`, `PPTX`, `TIF`, `TIFF`, `TXT`, `WAV`, `XLS`, `XLSX`, `XML` and `ZIP`. The `VAULT_TOKEN` de-identification type is supported only for `TXT`, `CSV`, `JSON`, `JSONL`, `XML`, `DOCX`, `XLSX` and `PPTX`.

`outputDirectory` is meaningful only when polling. Setting it without `pollOptions` fails client-side validation before any request is sent.

```typescript
import { DeidentifyFileRequest, DeidentifyFileResponse, DetectRunStatus } from 'skyflow-node';

// Submit only
const submitted: DeidentifyFileResponse = await skyflowClient.detect().deidentifyFile(
  new DeidentifyFileRequest({
    filePath: '/data/intake/patient-notes.pdf', // sent as BASE64, format inferred as PDF
    configurationId: '<CONFIGURATION_ID>',
  }),
);
const runId = submitted.runId;

// Submit and poll
const response = await skyflowClient.detect().deidentifyFile(
  new DeidentifyFileRequest({
    filePath: '/data/intake/patient-notes.pdf',
    configurationId: '<CONFIGURATION_ID>',
    pollOptions: { waitTime: 120 },
    outputDirectory: '/data/processed', // optional
  }),
);

switch (response.status) {
  case DetectRunStatus.SUCCESS:
    // For local-file requests the outputs are already on disk:
    //   /data/processed/processed-patient-notes.pdf            the redacted file
    //   /data/processed/processed-entities-patient-notes.json  the detected entities
    // response.output and response.metrics carry the same data.
    break;
  case DetectRunStatus.FAILED:
    console.error(response.message);
    break;
  default: // IN_PROGRESS or QUEUED: budget ran out, resume with getRun(runId)
    break;
}
```

Outputs are written only when polling reached `SUCCESS`, the request was built from a local file, and the run delivered them as base64. A request built from a `SKYFLOW_ID` or `PRESIGNED_URL` has no local name to derive from, and presigned-URL outputs are not fetched, so in those cases read `output` and write the files yourself. Files are named `processed-<input name>.<extension>`, with the entities output as `processed-entities-<input name>.json`; `outputDirectory` is created if missing and defaults to the working directory. Writing outputs needs the Node.js file system and is not supported in Cloudflare Workers.

The submit-only response and a polled response that reached `SUCCESS`, as JSON:

```json
{ "runId": "48f7613c-b4c4-478a-a42f-dde537f54b6c", "status": null, "outputType": null, "output": [], "metrics": null, "message": null }
```

```json
{
  "runId": "48f7613c-b4c4-478a-a42f-dde537f54b6c",
  "status": "SUCCESS",
  "outputType": "BASE64",
  "output": [
    { "processedFile": "JVBERi0xLjcK...", "processedFileType": "REDACTED_FILE", "processedFileExtension": "PDF" },
    { "processedFile": "eyJlbnRpdGllcyI6W3...", "processedFileType": "ENTITIES", "processedFileExtension": "JSON" }
  ],
  "metrics": { "pages": 3, "wordCount": 842, "characterCount": 5120, "size": 118.4, "slides": null, "duration": null },
  "message": null
}
```

For audio, `outputTranscription` cannot be combined with `outputProcessedAudio`: the API rejects the pair with HTTP 400. Set `outputProcessedAudio: false` in the audio configuration when you want a transcription.

> [!TIP]
> See the full examples in the samples directory: [deidentify-file.ts](samples/detect-api/deidentify-file.ts) and [deidentify-file-async.ts](samples/detect-api/deidentify-file-async.ts)

### Re-identify a string: `.reidentifyString(request)`

Re-identification looks tokens up in the vault, so it applies to values that were de-identified with `VAULT_TOKEN`. Placeholders produced by `ENTITY_UNIQUE_COUNTER`, `ENTITY_ONLY` or `MASK` are not stored anywhere and cannot be re-identified.

`ReidentifyStringRequest` takes the tokenized text and an optional list of `RedactionLevel` rules. For skyvault vaults each rule names an `entityName` and the `redactionType` to render it with: `PLAIN_TEXT` reveals the original value, `MASKED` masks it and `REDACTED` keeps it hidden. Without rules every token is replaced by its original value.

The text to re-identify is the `processedText` of a de-identification that used `VAULT_TOKEN`. A vault token carries the token of the value stored in the `table.column` destination, for example `[NAME_daa78453-9ca9-4ba5-a3ef-91934c11196c]`, not the `[NAME_1]` counter placeholder, so the round trip looks like this:

```typescript
import {
  DeidentifyStringRequest,
  ReidentifyStringRequest,
  ReidentifyStringResponse,
  EntityType,
  DeidentificationType,
  RedactionType,
} from 'skyflow-node';

// 1. De-identify with VAULT_TOKEN: each value is stored in <TABLE>.<COLUMN> and replaced by its vault token.
const deidentified = await skyflowClient.detect().deidentifyString(
  new DeidentifyStringRequest('My name is John Doe and my email is johndoe@acme.com.', {
    configuration: {
      detect: {
        entities: [
          { entityType: EntityType.NAME, deidentificationType: DeidentificationType.VAULT_TOKEN, destination: '<TABLE>.<COLUMN>' },
          { entityType: EntityType.EMAIL_ADDRESS, deidentificationType: DeidentificationType.VAULT_TOKEN, destination: '<TABLE>.<COLUMN>' },
        ],
      },
    },
  }),
);
const tokenized = deidentified.processedText ?? '';
// My name is [NAME_daa78453-9ca9-4ba5-a3ef-91934c11196c] and my email is [EMAIL_ADDRESS_3f0c…].

// 2. Re-identify: every vault token is replaced by its original value.
const original: ReidentifyStringResponse = await skyflowClient.detect().reidentifyString(
  new ReidentifyStringRequest(tokenized),
);
console.log(original.processedText);
// My name is John Doe and my email is johndoe@acme.com.

// 3. Or choose how each entity type is rendered.
const rendered = await skyflowClient.detect().reidentifyString(
  new ReidentifyStringRequest(tokenized, {
    redactionLevel: [
      { entityName: EntityType.NAME, redactionType: RedactionType.PLAIN_TEXT },
      { entityName: EntityType.EMAIL_ADDRESS, redactionType: RedactionType.MASKED },
    ],
  }),
);
console.log(rendered.processedText);
// My name is John Doe and my email is j*******@acme.com.
```

`ReidentifyStringResponse` carries `processedText` and `metrics`. As JSON:

```json
{
  "processedText": "My name is John Doe and my email is j*******@acme.com.",
  "metrics": { "wordCount": 10, "characterCount": 54, "size": null, "pages": null, "slides": null, "duration": null }
}
```

`RedactionLevel` is the skyvault SDK's own type and has only `entityName` and `redactionType`; the `tokenGroupName` and `redactionPattern` rules of the flowvault SDK do not exist here. Both fields are optional on the API, so the SDK passes the list through as given and the server rejects invalid combinations.

> [!TIP]
> See the full example in the samples directory: [reidentify-string.ts](samples/detect-api/reidentify-string.ts)

### Re-identify a file: `.reidentifyFile(request)`

`reidentifyFile` is synchronous: the re-identified file comes back in the response, not through a run id. `ReidentifyFileRequest` takes a `dataSource` (`ReidentifySourceType.BASE64` or `PRESIGNED_URL`), the matching `value`, an optional `dataFormat` and the same optional `RedactionLevel` rules as `reidentifyString`. `dataFormat` is limited to the formats that support `VAULT_TOKEN`: `TXT`, `CSV`, `JSON`, `JSONL`, `XML`, `DOCX`, `XLSX` and `PPTX`.

```typescript
import * as fs from 'fs';
import { ReidentifyFileRequest, ReidentifySourceType, FileDataFormat, DetectRunStatus } from 'skyflow-node';

const content = fs.readFileSync('tokenized.txt').toString('base64');

const response = await skyflowClient.detect().reidentifyFile(
  new ReidentifyFileRequest(ReidentifySourceType.BASE64, content, { dataFormat: FileDataFormat.TXT }),
);

if (response.status === DetectRunStatus.SUCCESS) {
  for (const output of response.output) {
    if (response.outputType === ReidentifySourceType.BASE64) {
      const processed = Buffer.from(output.processedFile ?? '', 'base64');
      fs.writeFileSync(`reidentified.${output.processedFileExtension?.toLowerCase()}`, processed);
    } else {
      // PRESIGNED_URL: output.processedFile is a URL to download; do not log it.
    }
  }
}
```

`ReidentifyFileResponse` carries `status`, `outputType`, `output` (never `null`) and `metrics`. As JSON:

```json
{
  "status": "SUCCESS",
  "outputType": "BASE64",
  "output": [
    { "processedFile": "TXkgbmFtZSBpcyBKb2huIERvZS4=", "processedFileType": "REIDENTIFIED_FILE", "processedFileExtension": "TXT" }
  ],
  "metrics": { "wordCount": 5, "characterCount": 20, "size": 0.02, "pages": null, "slides": null, "duration": null }
}
```

> [!TIP]
> See the full example in the samples directory: [reidentify-file.ts](samples/detect-api/reidentify-file.ts)

### Get run: `.getRun(request)`

File de-identification is asynchronous: the submit call returns a run id, and `getRun` retrieves the run's status and, once it has succeeded, its outputs. `output` is empty and `outputType` and `metrics` are `null` until the run completes.

```typescript
import * as fs from 'fs';
import { GetRunRequest, GetRunResponse, DetectRunStatus, DeidentifySourceType } from 'skyflow-node';

const run: GetRunResponse = await skyflowClient.detect().getRun(new GetRunRequest('<RUN_ID>'));

switch (run.status) {
  case DetectRunStatus.SUCCESS:
    for (const output of run.output) {
      // output.processedFileType is e.g. REDACTED_FILE or ENTITIES
      // output.processedFileExtension is a FileDataFormat such as PDF
      if (run.outputType === DeidentifySourceType.BASE64) {
        const bytes = Buffer.from(output.processedFile ?? '', 'base64');
        fs.writeFileSync(`processed-${output.processedFileType}.${output.processedFileExtension?.toLowerCase()}`, bytes);
      } else {
        // PRESIGNED_URL: output.processedFile is a URL to download; do not log it.
      }
    }
    break;
  case DetectRunStatus.FAILED:
    console.error(run.message);
    break;
  default: // QUEUED, IN_PROGRESS, UNKNOWN: poll again later
    break;
}
```

`GetRunResponse` has the same fields as `DeidentifyFileResponse` (`runId`, `status`, `outputType`, `output`, `metrics`, `message`); see the JSON under [De-identify a file](#de-identify-a-file-deidentifyfilerequest). `getRun` never writes to disk.

> [!TIP]
> See the full example in the samples directory: [get-run.ts](samples/detect-api/get-run.ts)

### Check guardrails: `.checkGuardrails(request)`

`checkGuardrails` screens text for toxicity and for a list of denied topics, which makes it a natural pre-LLM check. `checkToxicity` and `denyTopics` are optional: the SDK sends each one only when you set it. The server evaluates toxicity only when `checkToxicity: true` is sent; with `denyTopics` alone, `toxic` is `false` even for toxic text, so set `checkToxicity: true` explicitly whenever you want that check. A request with neither field is rejected with HTTP 400. The response is passed through as returned, so `toxic`, `deniedTopic` and `validation` carry exactly what the API sent back.

```typescript
import { CheckGuardrailsRequest, GuardrailsValidation } from 'skyflow-node';

const response = await skyflowClient.detect().checkGuardrails(
  new CheckGuardrailsRequest(userPrompt, { checkToxicity: true, denyTopics: ['politics', 'medical advice'] }),
);

if (response.validation === GuardrailsValidation.FAILED) {
  throw new Error(`blocked: toxic=${response.toxic} deniedTopic=${response.deniedTopic}`);
}
```

`CheckGuardrailsResponse` as JSON:

```json
{ "text": "<the text that was checked>", "toxic": true, "deniedTopic": false, "validation": "FAILED" }
```

> [!TIP]
> See the full example in the samples directory: [check-guardrails.ts](samples/detect-api/check-guardrails.ts)

### Detect errors

All Detect methods throw `SkyflowError` as described in [Error handling](#error-handling); `error.httpCode`, `message` and `error.requestId` identify the failure, and the request id is what Skyflow support asks for. Client-side validation fails before any network call with HTTP code 400 and no request id. Server-side failures carry the API's message, for example a `RedactionLevel` that uses `RedactionType.DEFAULT`:

```typescript
import { ReidentifyStringRequest, EntityType, RedactionType, SkyflowError } from 'skyflow-node';

try {
  await skyflowClient.detect().reidentifyString(
    new ReidentifyStringRequest(tokenized, {
      redactionLevel: [{ entityName: EntityType.NAME, redactionType: RedactionType.DEFAULT }],
    }),
  );
} catch (err) {
  if (err instanceof SkyflowError) {
    console.error(`Error during reidentifyString: [${err.error?.httpCode}] ${err.message} (requestId=${err.error?.requestId})`);
  }
}
```

```json
{
  "error": {
    "grpc_code": 3,
    "http_code": 400,
    "message": "ReidentifyStringRequestV2 failed. redaction_type in redaction_level[0] must be REDACTED, MASKED, or PLAIN_TEXT",
    "http_status": "Bad Request",
    "details": []
  }
}
```

A `deidentifyFile` run that was accepted but failed while processing does not throw: `status` is `FAILED` and `message` carries the detail.

## Connections

Securely send and receive data between your systems and first- or third-party services using Skyflow Connections, a gateway service that uses tokenization. The [connections](https://github.com/skyflowapi/skyflow-node/tree/v2/src/vault/controller/connections) module invokes both inbound and outbound connections.

- **Inbound connections**: Act as intermediaries between your client and server, tokenizing sensitive data before it reaches your backend, ensuring downstream services handle only tokenized data.
- **Outbound connections**: Enable secure extraction of data from the vault and transfer it to third-party services via your backend server, such as processing checkout or card issuance flows.

### Configure a connection

Add a `ConnectionConfig` to `SkyflowConfig.connectionConfigs` during initialization, or call `addConnectionConfig()` at runtime:

```typescript
import { ConnectionConfig, Credentials } from 'skyflow-node';

const connectionConfig: ConnectionConfig = {
  connectionId: '<CONNECTION_ID>',     // required: unique connection identifier
  connectionUrl: '<CONNECTION_URL>',   // required: gateway URL for this connection
  // credentials: connectionCredentials // optional: per-connection credentials; overrides skyflowCredentials
};
```

### Invoke a connection

Invoke a connection using the `invoke` method of the Skyflow client. Build the request with the [`InvokeConnectionRequest`](../docs/api_reference.md#invokeconnectionrequest) class.

#### Construct an invoke connection request

```typescript
import {
  InvokeConnectionRequest,
  RequestMethod,
  InvokeConnectionResponse,
} from "skyflow-node";

const invokeRequest = new InvokeConnectionRequest(
  RequestMethod.POST,
  { <COLUMN_NAME_1>: "<COLUMN_VALUE_1>" },
  { <HEADER_NAME_1>: "<HEADER_VALUE_1>" },
  { <PATH_PARAM_KEY_1>: "<PATH_PARAM_VALUE_1>" },
  { <QUERY_PARAM_KEY_1>: "<QUERY_PARAM_VALUE_1>" }
);

const response: InvokeConnectionResponse = await skyflowClient
  .connection()
  .invoke(invokeRequest);

console.log("Invoke connection response:", response);
```

Returns an [`InvokeConnectionResponse`](../docs/api_reference.md#invokeconnectionresponse) (`data`, `metadata`, `errors`):

```text
Invoke connection response: { data: { status: 'success', transaction_id: 'txn_abc123' }, metadata: { requestId: 'req-xyz-456' }, errors: null }
```

`method` supports the following methods (see [`RequestMethod`](../docs/api_reference.md#requestmethod)):

- `GET`
- `POST`
- `PUT`
- `PATCH`

**pathParams, queryParams, header, body** are the JSON objects represented as dictionaries that will be sent through the connection integration url.

> [!TIP]
> See the full example in the samples directory: [scoped-token-generation-example.ts](samples/vault-api/invoke-connection.ts)  
> See [docs.skyflow.com](https://docs.skyflow.com) for more details on integrations with Connections, Functions, and Pipelines.

## Authentication & authorization

### Types of `credentials`

The SDK accepts one of several types of credentials object.

1. **API keys**
   A unique identifier used to authenticate and authorize requests to an API. Use for long-term service authentication. To create an API key, first create a 'Service Account' in Skyflow and choose the 'API key' option during creation.

   ```ts
   const credentials: Credentials = {
     apiKey: "<YOUR_API_KEY>"
   };
   ```

2. **Bearer tokens**
   A temporary access token used to authenticate API requests.  Use for optimal security. As a developer with the right access, you can generate a temporary personal bearer token in Skyflow in the user menu.

   ```ts
   const credentials: Credentials = {
     token: "<YOUR_BEARER_TOKEN>"
   };
   ```

3. **Service account credentials file path**
   The file path pointing to a JSON file containing credentials for a service account. Use when credentials are managed externally or stored in secure file systems.

   ```ts
   const credentials: Credentials = {
     path: "<YOUR_CREDENTIALS_FILE_PATH>"
   };
   ```

4. **Service account credentials string**
   JSON-formatted string containing service account credentials. Use when integrating with secret management systems or when credentials are passed programmatically.

   ```ts
   const credentials: Credentials = {
     credentialsString: JSON.stringify(process.env.SKYFLOW_CREDENTIALS)
   };
   ```

5. **Environment variables**
   If no credentials are explicitly provided, the SDK automatically looks for the SKYFLOW_CREDENTIALS environment variable. Use to avoid hardcoding credentials in source code. This variable must return an object like one of the examples above.

> [!NOTE]
> Only one type of credential can be used at a time. If multiple credentials are provided, the last one added will take precedence.

### Generate bearer tokens for authentication & authorization

Generate and manage bearer tokens to authenticate API calls. This section covers options for scoping to certain roles, passing context, and signing data tokens.

#### Generate a bearer token

Generate service account tokens using the [Service Account](https://github.com/skyflowapi/skyflow-node/tree/v2/src/service-account) Node package with a service account credentials file provided when a service account is created. Tokens generated by this module are valid for 60 minutes and can be used to make API calls to the [Data](https://docs.skyflow.com/record/) and [Management](https://docs.skyflow.com/management/) APIs, depending on the permissions assigned to the service account.

##### `generateBearerToken(filepath)`

The `generateBearerToken(filepath)` function takes the `credentials.json` file path for token generation.

```ts
import { generateBearerToken, BearerTokenOptions } from 'skyflow-node';

const options: BearerTokenOptions = {
  roleIds: ['roleId1'],   // optional: scope to specific roles
  ctx: 'user_12345',      // optional: embed context
  logLevel: LogLevel.ERROR,
};

generateBearerToken('path/to/credentials.json', options)
  .then(response => {
    const bearerToken = response.accessToken;
  })
  .catch(error => { /* handle error */ });
```

##### `generateBearerTokenFromCreds(credentialsString)`

Use `generateBearerTokenFromCreds` when your credentials JSON is available as a string (e.g. from a secret manager) rather than a file on disk. It accepts the same `BearerTokenOptions` as `generateBearerToken`.

```ts
import { generateBearerTokenFromCreds, BearerTokenOptions } from 'skyflow-node';

const credentialsString = JSON.stringify(require('./credentials.json'));
const options: BearerTokenOptions = { roleIds: ['roleId1'] };

const response = await generateBearerTokenFromCreds(credentialsString, options);
const bearerToken = response.accessToken;
```

**`BearerTokenOptions` type:**

```ts
type BearerTokenOptions = {
  roleIds?: string[];                  // Scope the token to specific service-account roles
  ctx?: string | Record<string, any>; // Context value(s) embedded in the token
  logLevel?: LogLevel;                 // Override SDK log level for this call
  tokenUri?: string;                   // Override the token endpoint URL from the credentials file
};
```


**Checking whether a token has expired — `isExpired`:**

```ts
import { isExpired } from 'skyflow-node';

// Returns true if the JWT bearer token is expired or will expire within the threshold
const expired: boolean = isExpired(bearerToken);
if (expired) {
  // regenerate before making API calls
  const { accessToken } = await generateBearerToken('path/to/credentials.json');
}
```

> [!TIP]
> See the full example in the samples directory: [token-generation-example.ts](http://github.com/skyflowapi/skyflow-node/blob/v2/samples/service-account/token-generation-example.ts)

#### Generate bearer tokens scoped to certain roles

Generate bearer tokens with access limited to a specific role by specifying the appropriate `roleIds` when using a service account with multiple roles. Use this to limit access for services with multiple responsibilities, such as segregating access for billing and analytics. Generated bearer tokens are valid for 60 minutes and can only execute operations permitted by the permissions associated with the designated role.

```ts
const options: BearerTokenOptions = {
  roleIds: ['roleId1', 'roleId2'],
};
```

> [!TIP]
> See the full example in the samples directory: [scoped-token-generation-example.ts](samples/service-account/scoped-token-generation-example.ts)  
> See [docs.skyflow.com](https://docs.skyflow.com) for more details on authentication, access control, and governance for Skyflow.

#### Generate bearer tokens with `ctx` for context-aware authorization

Embed context values into a bearer token during generation so you can reference those values in your policies. This enables more flexible access controls, such as tracking end-user identity when making API calls using service accounts, and facilitates using signed data tokens during detokenization.

Generate bearer tokens containing context information using a service account with the `context_id` identifier. Context information is represented as a JWT claim in a Skyflow-generated bearer token. Tokens generated from such service accounts include a `context_identifier` claim, are valid for 60 minutes, and can be used to make API calls to the Data and Management APIs, depending on the service account's permissions.

The `ctx` parameter accepts either a **string** or a **JSON object**:

**String context** — use when your policy references a single context value:

```typescript
const options = {
  ctx: 'user_12345',
};
const response = await generateBearerToken(filepath, options);
```

**JSON object context** — use when your policy needs multiple context values for conditional data access. Each key in the `ctx` object maps to a Skyflow CEL policy variable under `request.context.*`:

```typescript
const options = {
  ctx: {
    role: 'admin',
    department: 'finance',
    user_id: 'user_12345',
  },
};
const response = await generateBearerToken(filepath, options);
```

With the object above, your Skyflow policies can reference `request.context.role`, `request.context.department`, and `request.context.user_id` to make conditional access decisions.

You can also set the `context` field on credentials for automatic token generation:

```typescript
// String context on credentials
const credentials: PathCredentials = {
  path: 'path/to/credentials.json',
  context: 'user_12345',
};

// JSON object context on credentials
const credentials: PathCredentials = {
  path: 'path/to/credentials.json',
  context: {
    role: 'admin',
    department: 'finance',
  },
};
```

> [!TIP]
> See the full example in the samples directory: [token-generation-with-context-example.ts](samples/service-account/token-generation-with-context-example.ts)
> See Skyflow's [context-aware authorization](https://docs.skyflow.com) and [conditional data access](https://docs.skyflow.com) docs for policy variable syntax like `request.context.*`.

#### Generate signed data tokens

Digitally sign data tokens with a service account's private key to add an extra layer of protection. Skyflow generates data tokens when sensitive data is inserted into the vault. Detokenize signed tokens only by providing the signed data token along with a bearer token generated from the service account's credentials. The service account must have the necessary permissions and context to successfully detokenize the signed data tokens.

Two variants are available — choose based on how you supply credentials:

```ts
import {
  generateSignedDataTokens,
  generateSignedDataTokensFromCreds,
  SignedDataTokensOptions,
} from 'skyflow-node';

const options: SignedDataTokensOptions = {
  dataTokens: ['dataToken1', 'dataToken2'], // required: tokens to sign
  timeToLive: 90,                           // optional: seconds until expiry (default 60)
  ctx: 'user_12345',                        // optional: context embedded in token
};

// From a credentials file on disk:
const response = await generateSignedDataTokens('path/to/credentials.json', options);

// From a credentials JSON string (e.g. from a secret manager):
const credentialsString = JSON.stringify(require('./credentials.json'));
const response = await generateSignedDataTokensFromCreds(credentialsString, options);

response.forEach(({ token, signedToken }) => {
  console.log('Original token:', token);
  console.log('Signed token:', signedToken);
});
```

The `ctx` parameter also accepts a JSON object for multi-value context:

```typescript
const options: SignedDataTokensOptions = {
  dataTokens: ['dataToken1'],
  ctx: { role: 'analyst', department: 'research' },
};
```

**`SignedDataTokensOptions` type:**

```ts
type SignedDataTokensOptions = {
  dataTokens: string[];                     // Data tokens to sign (required)
  timeToLive?: number;                      // Seconds until token expiry (default 60)
  ctx?: string | Record<string, any>;       // Context value(s) embedded in the token
  logLevel?: LogLevel;                      // Override SDK log level for this call
  tokenUri?: string;                        // Override the token endpoint URL from credentials
};
```

> [!TIP]
> See the full example in the samples directory: [signed-token-generation-example.ts](samples/service-account/signed-token-generation-example.ts)
> See [docs.skyflow.com](https://docs.skyflow.com) for more details on authentication, access control, and governance for Skyflow.

## Client management

After initializing the `Skyflow` client, you can add, update, retrieve, and remove vault and connection configurations at any time without recreating the client. For the full list of methods, see [Client management methods](../docs/api_reference.md#client-management-methods) in the API reference.

## Using the client in production

**Initialize once and reuse.** `new Skyflow(config)` returns a long-lived client that caches tokens per vault. Construct it once at startup (e.g. as a module-level singleton) and reuse it across requests. Recreating the client on every call discards these caches and forces unnecessary token regeneration.

```ts
// At application startup
const skyflowClient = new Skyflow(skyflowConfig);

// Reuse `skyflowClient` for the lifetime of the process
```

**Bearer token refresh is automatic.** When you authenticate with a service-account credentials file/string (or API key), the SDK caches the generated bearer token and regenerates it automatically once it expires. You don't need to manage token lifecycle yourself. (For the rare expire-mid-request case, see [Bearer token expiration edge cases](#bearer-token-expiration-edge-cases).)

**Runtime configuration changes are not concurrency-safe.** Methods that mutate client state at runtime — `addVaultConfig`, `updateVaultConfig`, `removeVaultConfig`, the `*ConnectionConfig` methods, and `updateSkyflowCredentials` — should be called during setup, not concurrently with in-flight requests. Once configured, the client is safe to reuse across concurrent calls.

**Timeouts and retries.** The SDK does not currently expose request timeout or automatic-retry configuration. Wrap your SDK calls with your own timeout/retry logic at the application layer if needed.

## Logging

The SDK provides useful logging. By default, the logging level is set to `LogLevel.ERROR`. Change this by setting the `logLevel` in Skyflow Config while creating the Skyflow Client as shown below:

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
  `LogLevel.OFF` can be used to turn off all logging from the Skyflow Node SDK.

> [!NOTE]
> The ranking of logging levels is as follows: `DEBUG` < `INFO` < `WARN` < `ERROR` < `OFF`.

### Example `skyflowConfig.logLevel: LogLevel.INFO`

```ts
const skyflowConfig: SkyflowConfig = {
  vaultConfigs: [vaultConfig], // Add the Vault configuration
  skyflowCredentials: skyflowCredentials, // Use Skyflow credentials if no token is passed
  logLevel: LogLevel.INFO, // Recommended to use LogLevel.ERROR in production environment.
};

const skyflowClient: Skyflow = new Skyflow(skyflowConfig);
```

## Error handling

### Catching `SkyflowError` instances

Wrap your calls to the Skyflow SDK in try/catch blocks as a best practice. Use the `SkyflowError` type to identify errors coming from Skyflow versus general request/response errors.

```ts
try {
  // ...call the Skyflow SDK
} catch (error) {
  // catch an error, identify if it is a SkyflowError
  if (error instanceof SkyflowError) {
    console.error("Skyflow Specific Error:", {
      code: error.error?.httpCode,
      message: error.message,
      requestId: error.error?.requestId,
      details: error.error?.details,
    });
  } else {
    console.error("Unexpected Error:", JSON.stringify(error));
  }
}
```

### Per-record errors (`SkyflowRecordError`)

Some operations — such as `insert` with `continueOnError: true` and `detokenize` — can partially succeed. In these cases the response object contains an `errors` array alongside the successful results. Each entry in `errors` is a `SkyflowRecordError`:

```ts
import { InsertResponse, SkyflowRecordError } from 'skyflow-node';

const response: InsertResponse = await skyflowClient.vault(vaultId).insert(request, options);

if (response.errors && response.errors.length > 0) {
  response.errors.forEach((err: SkyflowRecordError) => {
    console.error({
      requestId: err.requestId,   // x-request-id from the server response
      httpCode: err.httpCode,     // HTTP status code for this record
      requestIndex: err.requestIndex, // Index of the failed record in the input array
      error: err.error,           // Error description string
      token: err.token,           // Token (detokenize errors only)
    });
  });
}
```

`SkyflowRecordError` shape:

```ts
interface SkyflowRecordError {
  error: string;
  requestId: string | null;
  httpCode?: string | number | null;
  requestIndex?: number | null;
  token?: string | null;         // present on detokenize errors
}
```

### Bearer token expiration edge cases

When using bearer tokens for authentication and API requests, a token may expire after verification but before the actual API call completes. This causes the request to fail unexpectedly. An error from this edge case looks like this:

```txt
message: Authentication failed. Bearer token is expired. Use a valid bearer token. See https://docs.skyflow.com/api-authentication/
```

If you encounter this kind of error, retry the request. During the retry the SDK detects that the previous bearer token has expired and generates a new one for the current and subsequent requests.

> [!TIP]
> See the full example in the samples directory: [bearer-token-expiry-example.ts](samples/service-account/bearer-token-expiry-example.ts)  
> See [docs.skyflow.com](https://docs.skyflow.com) for more details on authentication, access control, and governance for Skyflow.

## Troubleshooting

Most first-run problems come from configuration mismatches. Every error thrown by the SDK is a `SkyflowError` exposing `httpCode`, `message`, and `details` — inspect these first (see [Error handling](#error-handling)).

| Symptom | Likely cause | Fix |
|---|---|---|
| `npm install skyflow-node` fails | Unsupported Node version | Requires Node v12.22.12 or above. |
| Connection/DNS failures, or 404 on every call | Wrong `clusterId` | `clusterId` is the first segment of your vault URL: `https://{clusterId}.vault.skyflowapis.com`. |
| Requests hit the wrong host / unexpected auth failures | Wrong `env` | Match `env` to where your vault runs (`Env.PROD`, `Env.SANDBOX`, `Env.DEV`, `Env.STAGE`). |
| `401 Unauthorized` | Invalid or expired credentials | Verify your API key or service-account credentials. Regenerate if needed. |
| `403 Forbidden` | Service account lacks permission | Grant the service account a role with the required permissions, or use a [scoped token](#generate-bearer-tokens-scoped-to-certain-roles). |
| `404` referencing a table or column | Name mismatch | Confirm table and column names match your vault schema exactly (case-sensitive). |
| Vault not found / 404 with a valid `clusterId` | Wrong `vaultId` | Copy `vaultId` from the vault's details page in Skyflow Studio. |
| `Authentication failed. Bearer token is expired.` | Token expired mid-request | Retry the request; the SDK regenerates the token. See [Bearer token expiration edge cases](#bearer-token-expiration-edge-cases). |
| Unexpected credential is used | Multiple credential types provided | Only one credential type is used at a time; the last one added takes precedence. |

If you're stuck, set `logLevel: LogLevel.DEBUG` during development for detailed SDK logs (see [Logging](#logging)).

## TypeScript types reference

For the full reference of all exported types, interfaces, enums, request/response fields, and options setters, see the **[API Reference](../docs/api_reference.md)**.

The most commonly imported TypeScript types are:

```ts
import {
  // Credential sub-types (for stricter typing)
  ApiKeyCredentials,
  TokenCredentials,
  PathCredentials,       // supports optional tokenUri
  StringCredentials,     // supports optional tokenUri

  // Request item shapes
  DetokenizeData,        // { token: string; redactionType?: RedactionType }
  TokenizeRequestType,   // { value: string; columnGroup: string }

  // Detect configuration and rule shapes
  DetectConfiguration,   // inline Detect configuration: { detect?, fileMapping?, media? }
  RedactionLevel,        // { entityName?, redactionType? } (skyvault); the flowvault SDK has { tokenGroupName?, redactionPattern? }
  PollOptions,           // { waitTime?: number; maxAttempts?: number }

  // Response record shapes
  InsertResponseType,    // { skyflowId: string; [field: string]: unknown }
  GetResponseData,       // { [field: string]: unknown }
  QueryResponseType,     // { [field: string]: unknown }
  SkyflowRecordError,    // shape of entries in response.errors[]
} from 'skyflow-node';
```

## Security
### Reporting a Vulnerability

If you discover a potential security issue in this project, reach out to us at [security@skyflow.com](mailto:security@skyflow.com). 

Don't create public GitHub issues or Pull Requests, as malicious actors could potentially view them.
