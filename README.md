# Skyflow Node.js SDK

> **This is the current, recommended version of the Skyflow SDK.** V2.1.0 brings flexible auth, multi-vault support, builder patterns, native data types, and rich error diagnostics.
>
> Migrating from v1? See the **[Migration Guide](docs/migrate_to_v2.md)** for step-by-step instructions. V1 is in maintenance mode and will reach End of Life on October 31, 2026.

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
    - [De-identify Text: `.deidentifyText(request, options)`](#de-identify-text-deidentifytextrequest-options)
    - [Re-identify Text: `.reidentifyText(request, options)`](#re-identify-text-reidentifytextrequest-options)
    - [De-identify File: `.deidentifyFile(fileReq, options)`](#de-identify-file-deidentifyfilefilereq-options)
    - [Get Run: `.getDetectRun(request)`](#get-run-getdetectrunrequest)
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
  - [Runtime client management](#runtime-client-management)
    - [Vault management](#vault-management)
    - [Connection management](#connection-management)
    - [Credentials and log level](#credentials-and-log-level)
    - [Skyflow class public methods reference](#skyflow-class-public-methods-reference)
  - [Logging](#logging)
    - [Example `skyflowConfig.logLevel: LogLevel.INFO`](#example-skyflowconfigloglevel-loglevelinfo)
  - [Error handling](#error-handling)
    - [Catching `SkyflowError` instances](#catching-skyflowerror-instances)
    - [Per-record errors (`SkyflowRecordError`)](#per-record-errors-skyflowrecorderror)
    - [Bearer token expiration edge cases](#bearer-token-expiration-edge-cases)
  - [TypeScript types reference](#typescript-types-reference)
    - [Credential sub-types](#credential-sub-types)
    - [Response record shapes](#response-record-shapes)
    - [Request item shapes](#request-item-shapes)
    - [File input type](#file-input-type)
  - [Security](#security)
    - [Reporting a Vulnerability](#reporting-a-vulnerability)

## Overview

The Skyflow SDK enables you to connect to your Skyflow Vault(s) to securely handle sensitive data at rest, in-transit, and in-use.

> [!IMPORTANT]  
> This readme documents SDK version 2.  
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

Get started quickly with the essential steps: authenticate, initialize the client, and perform a basic vault operation. This section shows you a minimal working example.

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

See [docs/advanced_initialization.md](docs/advanced_initialization.md) for advanced initialization examples including multiple vaults and different credential types.

### Insert data into the vault, get tokens back

Insert data into your vault using the `insert` method. Set `insertOptions.setReturnTokens(true)` to ensure values are tokenized in the response.

Create an insert request with the `InsertRequest` class, which includes the values to be inserted as a list of records. 

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

## Upgrade from v1 to v2

Upgrade from `skyflow-node` v1 using the dedicated guide in [docs/migrate_to_v2.md](docs/migrate_to_v2.md).

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

#### InsertOptions reference

`InsertOptions` accepts the following setters:

| Setter | Type | Description |
|---|---|---|
| `setReturnTokens(bool)` | `boolean` | Return tokens for inserted fields. Default `false`. |
| `setUpsertColumn(column)` | `string` | Column to use as the upsert key. Must have the `unique` constraint. |
| `setContinueOnError(bool)` | `boolean` | Allow the batch to proceed despite per-record errors. Default `false`. |
| `setTokens(tokens)` | `Array<Record<string, unknown>>` | Provide pre-existing tokens for BYOT (bring-your-own-token) inserts. |
| `setHomogeneous(bool)` | `boolean` | Treat all records as the same schema for a homogeneous bulk insert. |
| `setTokenMode(mode)` | `TokenMode` | Control tokenization mode for BYOT operations (see below). |

**`TokenMode` enum** — controls how the SDK handles bring-your-own-token inserts:

```typescript
import { TokenMode } from 'skyflow-node';

insertOptions.setTokenMode(TokenMode.ENABLE);
```

| Value | Description |
|---|---|
| `TokenMode.DISABLE` | Default. Vault generates all tokens. |
| `TokenMode.ENABLE` | Caller provides tokens; vault accepts them as-is. |
| `TokenMode.ENABLE_STRICT` | Caller provides tokens; vault validates them before accepting. |

### Detokenize: `.detokenize(request, options)`

Convert tokens back into plaintext values (or masked values) using the `.detokenize()` method. Detokenization accepts tokens and returns values.

Create a detokenization request with the `DetokenizeRequest` class, which requires a list of tokens and column groups as input.

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

> [!TIP]
> See the full example in the samples directory: [detokenzie-records.ts](samples/vault-api/detokenzie-records.ts)

### Get Record(s): `.get(request, options)`

Retrieve data using Skyflow IDs or unique column values with the get method. Create a get request with the `GetRequest` class, specifying parameters such as the table name, redaction type, Skyflow IDs, column names, and column values. 

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

#### GetOptions reference

`GetOptions` accepts the following setters:

| Setter | Type | Description |
|---|---|---|
| `setReturnTokens(bool)` | `boolean` | Return tokens instead of plain-text values. |
| `setRedactionType(type)` | `RedactionType` | Control how values are redacted in the response. |
| `setFields(fields)` | `Array<string>` | Limit the response to specific field names. |
| `setOffset(offset)` | `string` | Pagination offset (number of records to skip). |
| `setLimit(limit)` | `string` | Maximum number of records to return. |
| `setDownloadUrl(bool)` | `boolean` | Return a pre-signed download URL for file fields. |
| `setColumnName(name)` | `string` | Column to query by value (use with `setColumnValues`). |
| `setColumnValues(values)` | `Array<string>` | Values to match in the column specified by `setColumnName`. |
| `setOrderBy(order)` | `OrderByEnum` | Sort order for returned records (see below). |

**`OrderByEnum`** — controls sort order when retrieving records:

```typescript
import { OrderByEnum } from 'skyflow-node';

getOptions.setOrderBy(OrderByEnum.ASCENDING);
```

| Value | Description |
|---|---|
| `OrderByEnum.ASCENDING` | Sort records in ascending order. |
| `OrderByEnum.DESCENDING` | Sort records in descending order. |
| `OrderByEnum.NONE` | No explicit sort order (server default). |

### Update Records

Update data in your vault using the `update` method. Create an update request with the `UpdateRequest` class, specifying parameters such as the table name and data (as a dictionary). 

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

> **Note:** The response key is `skyflowId`. The legacy `skyflow_id` key is deprecated and will be removed in an upcoming release.

#### UpdateOptions reference

`UpdateOptions` accepts the following setters:

| Setter | Type | Description |
|---|---|---|
| `setReturnTokens(bool)` | `boolean` | When `true`, returns tokens for updated fields. When `false`, returns the Skyflow ID only. Default `false`. |
| `setTokens(tokens)` | `Record<string, unknown>` | Provide pre-existing tokens for a BYOT update. |
| `setTokenMode(mode)` | `TokenMode` | Control tokenization mode for BYOT operations. See [`TokenMode`](#insertOptions-reference). |

> [!TIP]
> See the full example in the samples directory: [update-record.ts](samples/vault-api/update-record.ts)

### Delete Records

Delete records using Skyflow IDs with the `delete` method. Create a delete request with the `DeleteRequest` class, which accepts a list of Skyflow IDs:

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

> [!TIP]
> See the full example in the samples directory: [delete-records.ts](samples/vault-api/delete-records.ts)

### Query

Retrieve data with SQL queries using the `query` method. Create a query request with the `QueryRequest` class, which takes the `query` parameter as follows:



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
> [!TIP]
> See the full example in the samples directory: [query-records.ts](samples/vault-api/query-records.ts)

Refer to [Query your data](https://docs.skyflow.com/query-data/) and [Execute Query](https://docs.skyflow.com/record/#QueryService_ExecuteQuery) for guidelines and restrictions on supported SQL statements, operators, and keywords.

### Upload File

Upload files to a Skyflow vault using the `uploadFile` method. Create a file upload request with the `FileUploadRequest` class, which accepts the table name and column name. Set the Skyflow ID via `FileUploadOptions.setSkyflowId()`. Configure upload options with the `FileUploadOptions` class, which accepts the file object as shown below:

```typescript
// Please use Node version 20 & above to run file upload
import {
  FileUploadRequest,
  FileUploadResponse,
  FileUploadOptions,
  SkyflowError,
} from "skyflow-node";
import * as fs from "fs";

// Prepare File Upload Data
const tableName: string = "table-name"; // Table name
const columnName: string = "column-name"; // Column name to store file
const skyflowId: string = "skyflow-id"; // Skyflow ID of the record
const filePath: string = "file-path"; // Path to the file for upload

// Create File Upload Request
const uploadReq: FileUploadRequest = new FileUploadRequest(
  tableName,
  columnName,
);

// Configure FileUpload Options
const uploadOptions: FileUploadOptions = new FileUploadOptions();
uploadOptions.setSkyflowId(skyflowId); // Set the Skyflow ID via options
const buffer = fs.readFileSync(filePath);
// Set any one of FilePath, Base64 or FileObject in FileUploadOptions
uploadOptions.setFileObject(new File([buffer], filePath)); // Set a File object

// Perform File Upload
const response: FileUploadResponse = await skyflowClient
  .vault(primaryVaultConfig.vaultId)
  .uploadFile(uploadReq, uploadOptions);

console.log("File upload:", response);
```

#### FileUploadOptions reference

`FileUploadOptions` accepts the following setters. Set **exactly one** file source (`setFileObject`, `setFilePath`, or `setBase64`):

| Setter | Type | Description |
|---|---|---|
| `setSkyflowId(id)` | `string` | **Required.** The Skyflow ID of the record to attach the file to. |
| `setFileObject(file)` | `File` | Provide an in-memory `File` object directly. |
| `setFilePath(path)` | `string` | Path to the file on disk. The SDK reads and uploads the file. Requires Node.js v20+. |
| `setBase64(data)` | `string` | Base64-encoded file content. Use `setFileName` to supply the filename when using this option. |
| `setFileName(name)` | `string` | Filename to use when uploading base64-encoded content (e.g. `"document.pdf"`). |

> [!TIP]
> See the full example in the samples directory: [file-upload.ts](samples/vault-api/file-upload.ts)

### Retrieve Existing Tokens: `.tokenize(request)`

Retrieve tokens for values that already exist in the vault using the `.tokenize()` method. This method returns existing tokens only and does not generate new tokens.

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

> [!TIP]
> See the full example in the samples directory: [tokenize-records.ts](samples/vault-api/tokenize-records.ts)

## Detect

De-identify and reidentify sensitive data in text and files using Skyflow Detect, which supports advanced privacy-preserving workflows.

### De-identify Text: `.deidentifyText(request, options)`

De-identify or anonymize text using the `deidentifyText` method. 

Create a de-identify text request with the `DeidentifyTextRequest` class, which includes the text to be deidentified. Provide optional parameters using the `DeidentifyTextOptions` class.

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

// Prepare the text to be deidentified
const deidentifyTextRequest = new DeidentifyTextRequest(
  "<TEXT_TO_BE_DEIDENTIFIED>",
);

// Configure DeidentifyTextOptions
const options = new DeidentifyTextOptions();
options.setEntities([DetectEntities.ACCOUNT_NUMBER, DetectEntities.SSN]); // Entities to de-identify
options.setAllowRegexList(["<YOUR_REGEX_PATTERN>"]); // Allowlist regex patterns
options.setRestrictRegexList(["<YOUR_REGEX_PATTERN>"]); // Restrict regex patterns

const tokenFormat = new TokenFormat();
tokenFormat.setDefault(TokenType.VAULT_TOKEN);       // default format for all entity types
// tokenFormat.setVaultToken([DetectEntities.SSN]);           // vault token for specific entities
// tokenFormat.setEntityUniqueCounter([DetectEntities.NAME]); // unique counter for specific entities
// tokenFormat.setEntityOnly([DetectEntities.CREDIT_CARD]);   // entity-only (no token) for specific entities
options.setTokenFormat(tokenFormat);

const transformations = new Transformations();
transformations.setShiftDays({
  max: 30,                                              // maximum days to shift
  min: 10,                                              // minimum days to shift
  entities: [DetectEntities.ACCOUNT_NUMBER, DetectEntities.SSN], // entity types to apply the shift
});
options.setTransformations(transformations);

// Call deidentifyText
const response = await skyflowClient
  .detect(primaryVaultConfig.vaultId)
  .deidentifyText(deidentifyTextRequest, options);

console.log("De-identify Text Response:", response);
```

> [!TIP]
> See the full example in the samples directory: [deidentify-text.ts](samples/detect-api/deidentify-text.ts)

### Re-identify Text: `.reidentifyText(request, options)`

Re-identify text using the `reidentifyText` method. Create a reidentify text request with the `ReidentifyTextRequest` class, which includes the redacted or de-identified text to be re-identified. Provide optional parameters using the `ReidentifyTextOptions` class to control how specific entities are returned (as redacted, masked, or plain text).

```typescript
import {
  ReidentifyTextRequest,
  ReidentifyTextOptions,
  SkyflowError,
  DetectEntities,
  ReidentifyTextResponse,
} from "skyflow-node";

// Prepare the redacted text to be re-identified
const request = new ReidentifyTextRequest("<REDACTED_TEXT_TO_REIDENTIFY>");

// Configure ReidentifyTextOptions
const options = new ReidentifyTextOptions();
options.setRedactedEntities([DetectEntities.SSN]); // Entities to keep redacted
options.setMaskedEntities([DetectEntities.CREDIT_CARD_NUMBER]); // Entities to mask
options.setPlainTextEntities([DetectEntities.NAME]); // Entities to return as plain text

// Call reidentifyText
const response: ReidentifyTextResponse = await skyflowClient
  .detect(primaryVaultConfig.vaultId)
  .reidentifyText(request, options);

console.log("Reidentify Text Response:", response);
```

> [!TIP]
> See the full example in the samples directory: [reidentify-text.ts](samples/detect-api/reidentify-text.ts)

### De-identify File: `.deidentifyFile(fileReq, options)`

De-identify files using the `deidentifyFile` method. Create a de-identify file request with the `DeidentifyFileRequest` class, which includes the file to be deidentified (such as images, PDFs, audio, documents, spreadsheets, or presentations). Provide optional parameters using the `DeidentifyFileOptions` class to control how entities are detected and deidentified, as well as how the output is generated for different file types.

> [!NOTE]
> File de-identification requires Node.js v20.x or above.

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

// Prepare the file to be deidentified
const filePath: string = '<FILE_PATH>';
const buffer = fs.readFileSync(filePath);
const file = new File([buffer], filePath);

// Construct the file input by providing either a file object or file path, but not both
const fileInput: FileInput = { file: file } // OR const fileInput: FileInput = { filePath: filePath }
const fileReq = new DeidentifyFileRequest(fileInput);

// Configure DeidentifyFileOptions
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

options.setOutputDirectory('<OUTPUT_DIRECTORY_PATH>');  // Output directory for saving the deidentified file. Not supported in Cloudflare workers.
options.setWaitTime(64);   // Wait time for polling (max 64 seconds; returns runId + status if exceeded)

// Image-specific options
options.setOutputProcessedImage(true);    // Include the deidentified image in the response
options.setOutputOcrText(true);           // Include OCR-extracted text in the response
options.setMaskingMethod(MaskingMethod.BLUR);  // How to mask detected entities in images
options.setPixelDensity(150);             // DPI for image rendering (higher = better quality)
options.setMaxResolution(1920);           // Maximum pixel dimension for output images

// Audio-specific options
options.setOutputProcessedAudio(true);    // Include the deidentified audio in the response
options.setOutputTranscription(DetectOutputTranscription.DIARIZED_TRANSCRIPTION); // Transcription format
const bleep = new Bleep();
bleep.setGain(1.0);          // Volume of the bleep tone (0.0–1.0)
bleep.setFrequency(1000);    // Frequency of the bleep tone in Hz
bleep.setStartPadding(0.1);  // Seconds of silence before the bleep
bleep.setStopPadding(0.1);   // Seconds of silence after the bleep
options.setBleep(bleep);     // Apply bleep settings to redacted audio spans

// Call deidentifyFile
const response: DeidentifyFileResponse = await skyflowClient
  .detect(primaryVaultConfig.vaultId)
  .deidentifyFile(fileReq, options);

console.log('De-identify File Response:', response);
```

**Supported file types:**

- Documents: `doc`, `docx`, `pdf`
- PDFs: `pdf`
- Images: `bmp`, `jpeg`, `jpg`, `png`, `tif`, `tiff`
- Structured text: `json`, `xml`
- Spreadsheets: `csv`, `xls`, `xlsx`
- Presentations: `ppt`, `pptx`
- Audio: `mp3`, `wav`

#### DeidentifyFileOptions reference

| Setter | Type | Description |
|---|---|---|
| `setEntities(entities)` | `DetectEntities[]` | Entity types to detect and de-identify. |
| `setAllowRegexList(patterns)` | `string[]` | Regex patterns that always match as entities (allowlist). |
| `setRestrictRegexList(patterns)` | `string[]` | Regex patterns that never match as entities (denylist). |
| `setTokenFormat(format)` | `TokenFormat` | Token format for de-identified entities. |
| `setTransformations(t)` | `Transformations` | Custom transformations per entity type. |
| `setOutputDirectory(path)` | `string` | Directory to write de-identified output files. Not supported in Cloudflare Workers. |
| `setWaitTime(seconds)` | `number` | Max seconds to poll before returning `runId`+`status`. Minimum 1; maximum 64. |
| `setOutputProcessedImage(bool)` | `boolean` | Include the de-identified image binary in the response. Images only. |
| `setOutputOcrText(bool)` | `boolean` | Include OCR-extracted text in the response. Images only. |
| `setMaskingMethod(method)` | `MaskingMethod` | How to mask entities in images (`BLUR`, `BLACKBOX`, etc.). Images only. |
| `setPixelDensity(dpi)` | `number` | DPI for image rendering. Higher values improve quality. Images only. |
| `setMaxResolution(px)` | `number` | Maximum pixel dimension of the output image. Images only. |
| `setOutputProcessedAudio(bool)` | `boolean` | Include the de-identified audio binary in the response. Audio only. |
| `setOutputTranscription(format)` | `DetectOutputTranscription` | Transcription format (`DIARIZED_TRANSCRIPTION`, `MEDICAL_DIARIZED_TRANSCRIPTION`, etc.). Audio only. |
| `setBleep(bleep)` | `Bleep` | Bleep tone settings for redacted audio spans. Audio only. See `Bleep` below. |

**`Bleep` class** — configures the bleep tone applied to redacted audio spans:

| Setter | Type | Description |
|---|---|---|
| `setGain(value)` | `number` | Volume of the bleep tone (0.0 – 1.0). |
| `setFrequency(hz)` | `number` | Frequency of the bleep in hertz. |
| `setStartPadding(seconds)` | `number` | Silence padding before the bleep starts. |
| `setStopPadding(seconds)` | `number` | Silence padding after the bleep ends. |

**Notes:**

- Transformations can't be applied to Documents, Images, or PDFs.
- If the API takes more than `waitTime` seconds to process, the response contains only `runId` and `status`. Use `.getDetectRun(request)` to poll for the final result.

> [!TIP]
> See the full example in the samples directory: [deidentify-file.ts](samples/detect-api/deidentify-file.ts)

### Get Run: `.getDetectRun(request)`

Retrieve the results of a previously started file de-identification operation (or 'run') using the `getDetectRun(...)` method. Initialize the `GetDetectRunRequest` class with the `runId` returned from a prior `.deidentifyFile(fileReq, options)` call. Fetch the final results of the file de-identification operation once they are available.

```typescript
import {
  GetDetectRunRequest,
  DeidentifyFileResponse,
  DeidentifyFileResponse
  SkyflowError
} from 'skyflow-node';

// Prepare the GetDetectRunRequest with the runId from a previous deidentifyFile call
const request = new GetDetectRunRequest({
  runId: '<RUN_ID_FROM_DEIDENTIFY_FILE>', // Replace with the runId you received earlier
});

// Step 2: Call getDetectRun
const response: DeidentifyFileResponse = await skyflowClient
  .detect(primaryVaultConfig.vaultId)
  .getDetectRun(request);

// Step 3: Handle the response
console.log('Get Detect Run Response:', response);
```

> [!TIP]
> See the full example in the samples directory: [get-detect-run.ts](samples/detect-api/get-detect-run.ts)

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

Invoke a connection using the `invoke` method of the Skyflow client.

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

The method of `RequestMethod.POST` must be one of:

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

**`GenerateTokenOptions` type** — used when logLevel override is the only option needed:

```ts
import { GenerateTokenOptions } from 'skyflow-node';

const options: GenerateTokenOptions = {
  logLevel: LogLevel.DEBUG,
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

## Runtime client management

After initializing the `Skyflow` client, you can add, update, retrieve, and remove vault and connection configurations at any time without recreating the client.

### Vault management

```ts
import { Skyflow, VaultConfig, Credentials, Env } from 'skyflow-node';

// Add a new vault after initialization
const newVault: VaultConfig = {
  vaultId: '<NEW_VAULT_ID>',
  clusterId: '<NEW_CLUSTER_ID>',
  env: Env.PROD,
};
skyflowClient.addVaultConfig(newVault);

// Update an existing vault's configuration (e.g. rotate credentials)
const rotatedCredentials: Credentials = { apiKey: '<NEW_API_KEY>' };
skyflowClient.updateVaultConfig({ ...newVault, credentials: rotatedCredentials });

// Retrieve a vault configuration by ID
const config = skyflowClient.getVaultConfig('<VAULT_ID>');

// Remove a vault configuration
skyflowClient.removeVaultConfig('<VAULT_ID>');
```

### Connection management

```ts
import { ConnectionConfig } from 'skyflow-node';

const newConnection: ConnectionConfig = {
  connectionId: '<CONNECTION_ID>',
  connectionUrl: '<CONNECTION_URL>',
};

// Add a new connection after initialization
skyflowClient.addConnectionConfig(newConnection);

// Update an existing connection (e.g. change the URL or credentials)
skyflowClient.updateConnectionConfig({ ...newConnection, connectionUrl: '<UPDATED_URL>' });

// Retrieve a connection configuration by ID
const connConfig = skyflowClient.getConnectionConfig('<CONNECTION_ID>');

// Remove a connection
skyflowClient.removeConnectionConfig('<CONNECTION_ID>');
```

### Credentials and log level

```ts
import { Credentials, LogLevel } from 'skyflow-node';

// Update shared credentials at runtime (applies to all vaults/connections
// that don't have their own individual credentials)
const newCredentials: Credentials = { apiKey: '<NEW_API_KEY>' };
skyflowClient.updateSkyflowCredentials(newCredentials);

// Read current shared credentials
const creds = skyflowClient.getSkyflowCredentials();

// Change log level at runtime
skyflowClient.setLogLevel(LogLevel.DEBUG);

// Read current log level
const level = skyflowClient.getLogLevel();
```

### Skyflow class public methods reference

| Method | Description |
|---|---|
| `vault(vaultId?)` | Return a `VaultController` for the given vault ID. Defaults to the first configured vault. |
| `detect(vaultId?)` | Return a `DetectController` for the given vault ID. |
| `connection(connectionId?)` | Return a `ConnectionController` for the given connection ID. |
| `addVaultConfig(config)` | Add a new vault configuration. Throws if the vault ID already exists. |
| `updateVaultConfig(config)` | Update an existing vault configuration. Throws if the vault ID is not found. |
| `getVaultConfig(vaultId)` | Return the `VaultConfig` for the given vault ID. |
| `removeVaultConfig(vaultId)` | Remove a vault configuration by ID. |
| `addConnectionConfig(config)` | Add a new connection configuration. Throws if the connection ID already exists. |
| `updateConnectionConfig(config)` | Update an existing connection configuration. |
| `getConnectionConfig(connectionId)` | Return the `ConnectionConfig` for the given connection ID. |
| `removeConnectionConfig(connectionId)` | Remove a connection configuration by ID. |
| `updateSkyflowCredentials(credentials)` | Replace the shared credentials used by all vaults/connections. |
| `getSkyflowCredentials()` | Return the current shared credentials. |
| `setLogLevel(logLevel)` | Change the SDK log level at runtime. |
| `getLogLevel()` | Return the current SDK log level. |

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
  `LogLevel.OFF` can be used to turn off all logging from the Skyflow Python SDK.

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

## TypeScript types reference

### Credential sub-types

When constructing a `Credentials` object, you can import the specific interface that matches your credential type for stricter TypeScript typing:

```ts
import {
  ApiKeyCredentials,
  TokenCredentials,
  PathCredentials,
  StringCredentials,
} from 'skyflow-node';

const apiKey: ApiKeyCredentials = { apiKey: '<KEY>' };
const token: TokenCredentials = { token: '<BEARER_TOKEN>' };
const path: PathCredentials = { path: '/path/to/creds.json', roles: ['roleId'], context: 'user_123' };
const str: StringCredentials = { credentialsString: JSON.stringify(creds), roles: ['roleId'] };
```

All four interfaces support an optional `tokenUri` field to override the token endpoint from the credentials file.

### Response record shapes

These interfaces describe individual records inside response objects:

| Interface | Used in | Shape |
|---|---|---|
| `InsertResponseType` | `InsertResponse.insertedFields[]`, `UpdateResponse.updatedField` | `{ skyflowId: string; [field: string]: unknown }` |
| `GetResponseData` | `GetResponse.data[]` | `{ [field: string]: unknown }` |
| `QueryResponseType` | `QueryResponse.fields[]` | `{ [field: string]: unknown }` |
| `IndexRange` | `DeidentifyTextResponse.entities[].textIndex` / `.processedIndex` | `{ start?: number; end?: number }` |
| `StringKeyValueMapType` | `InvokeConnectionRequest` body / headers / params | `{ [key: string]: string \| object }` |

### Request item shapes

These interfaces describe the shape of individual items inside request arrays:

| Interface | Used in | Shape |
|---|---|---|
| `TokenizeRequestType` | `TokenizeRequest` values | `{ value: string; columnGroup: string }` |
| `DetokenizeData` | `DetokenizeRequest` data | `{ token: string; redactionType?: RedactionType }` |

### File input type

`FileInput` is a discriminated union used in `DeidentifyFileRequest`. Provide either a file object or a file path, not both:

```ts
import { FileInput } from 'skyflow-node';

const byPath: FileInput = { filePath: '/path/to/document.pdf' };
const byObject: FileInput = { file: new File([buffer], 'document.pdf') };
```

## Security

### Reporting a Vulnerability

If you discover a potential security issue in this project, reach out to us at [security@skyflow.com](mailto:security@skyflow.com). 

Don't create public GitHub issues or Pull Requests, as malicious actors could potentially view them.
