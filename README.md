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
    - [Insert data into the vault, get tokens back](#insert-data-into-the-vault-get-tokens-back)
  - [Vault](#vault)
    - [Insert and tokenize data](#insert-and-tokenize-data)
      - [Construct an insert request](#construct-an-insert-request)
      - [Insert example with `continueOnError` option](#insert-example-with-continueonerror-option)
    - [Detokenize](#detokenize)
      - [Construct a detokenize request](#construct-a-detokenize-request)
    - [Get Record(s)](#get-records)
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
    - [Get Tokens by Values: `.tokenize(request)`](#get-tokens-by-values-tokenizerequest)
      - [Construct a `.tokenize()` request](#construct-a-tokenize-request)
  - [Detect](#detect)
    - [De-identify Text: `.deidentifyText(request, options)`](#de-identify-text-deidentifytextrequest-options)
    - [Re-identify Text: `.reidentifyText(request, options)`](#re-identify-text-reidentifytextrequest-options)
    - [Deidentify File: `.deidentifyFile(fileReq, options)`](#deidentify-file-deidentifyfilefilereq-options)
    - [Get Run: `.getDetectRun(request)`](#get-run-getdetectrunrequest)
  - [Connections](#connections)
    - [Invoke a connection](#invoke-a-connection)
      - [Construct an invoke connection request](#construct-an-invoke-connection-request)
  - [Authentication \& authorization](#authentication--authorization)
    - [Types of `credentials`](#types-of-credentials)
    - [Generate bearer tokens for authentication \& authorization](#generate-bearer-tokens-for-authentication--authorization)
      - [Generate a bearer token](#generate-a-bearer-token)
        - [`generateBearerToken(filepath)`](#generatebearertokenfilepath)
        - [`generateBearerTokenFromCreds(credentials)`](#generatebearertokenfromcredscredentials)
      - [Generate bearer tokens scoped to certain roles](#generate-bearer-tokens-scoped-to-certain-roles)
      - [Generate a bearer tokens with `ctx`](#generate-a-bearer-tokens-with-ctx)
      - [Generate signed data tokens: `generateSignedDataTokens(filepath, options)`](#generate-signed-data-tokens-generatesigneddatatokensfilepath-options)
  - [Logging](#logging)
    - [Example `skyflowConfig.logLevel: LogLevel.INFO`](#example-skyflowconfigloglevel-loglevelinfo)
  - [Error handling](#error-handling)
    - [Catching `SkyflowError` instances](#catching-skyflowerror-instances)
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

```javascript
import { Skyflow, SkyflowConfig, VaultConfig, Env, LogLevel } from 'skyflow-node';

// Create a credentials object. We'll use an API key.
const skyflowCredentials = {
    apiKey: "<SKYFLOW_API_KEY>"
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

### Insert data into the vault, get tokens back

To insert data into your vault use the `insert` method. Make sure to set `insertOptions.setReturnTokens(true)` to ensure values are tokenized in the response.

The `InsertRequest` class creates an insert request, which includes the values to be inserted as a list of records. 

Below is a simple example to get started. For advanced options, check out [Insert data into the vault](#insert-data-into-the-vault-1) section.

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

## Vault

The [Vault](https://docs.skyflow.com/docs/vaults) performs operations on the vault such as inserting records, detokenizing tokens, retrieving tokens for list of `skyflow_id`'s and to invoke the Connection.

### Insert and tokenize data

Apart from using the `insert` method to insert data into your vault covered in [Quickstart](#quickstart), you can also pass options to `insert` method to enable additional functionality such as returning tokenized data, upserting records, or allowing bulk operations to continue despite errors.

#### Construct an insert request

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

const insertData: Record<string, unknown>[] = [
  {
    cardholder_name: "John Doe",
  },
];

const insertReq: InsertRequest = new InsertRequest(
  "table1", // Specify the table in the vault where the data will be inserted
  insertData, // Attach the data (records) to be inserted
);

const insertOptions: InsertOptions = new InsertOptions();
insertOptions.setReturnTokens(true); // Optional: Specify if tokens should be returned upon successful insertion
insertOptions.setUpsertColumn("cardholder_name");

const insertResponse: InsertResponse = await skyflowClient
  .vault(primaryVaultConfig.vaultId)
  .insert(insertReq, insertOptions);

console.log("Insert response: ", insertResponse);
```

### Detokenize

To convert tokens back into the plaintext values (or masked values), use the `.detokenize()` method. Detokenization accepts tokens and returns values.

The `DetokenizeRequest` class requires a list of tokens and column groups as input.

Additionally, you can provide optional parameters, such as the redaction type and the option to continue on error.

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
detokenizeOptions.setDownloadURL(false);

const response: DetokenizeResponse = await skyflowClient
  .vault(primaryVaultConfig.vaultId)
  .detokenize(detokenizeRequest, detokenizeOptions);

console.log("Detokenization response:", response);
```

> [!TIP]
> See the full example in the samples directory: [detokenzie-records.ts](samples/vault-api/detokenzie-records.ts)

### Get Record(s)

To retrieve data using Skyflow IDs or unique column values, use the get method. The `GetRequest` class creates a get request, where you specify parameters such as the table name, redaction type, Skyflow IDs, column names, column values. If you specify Skyflow IDs, you can't use column names and column values, and the inverse is true—if you specify column names and column values, you can't use Skyflow IDs. And `GetOptions` class creates a get options object through which you specify whether to return tokens or not.

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

#### Get by Skyflow IDs

Retrieve specific records using skyflow `ids`. Ideal for fetching exact records when IDs are known.

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

Return tokens for records. Ideal for securely processing sensitive data while maintaining data privacy.

```ts
getOptions.setReturnTokens(true); // Optional: Set to true to get tokens
```

> [!TIP]
> See the full example in the samples directory: [get-records.ts](samples/vault-api/get-records.ts)

#### Get by column name and column values

Retrieve records by unique column values. Ideal for querying data without knowing Skyflow IDs, using alternate unique identifiers.

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

### Update Records

To update data in your vault, use the `update` method. The `UpdateRequest` class is used to create an update request, where you specify parameters such as the table name, data (as a dictionary). The `UpdateOptions` class is used to configure update options to returnTokens, tokens, and tokenMode. If `returnTokens` is set to True, Skyflow returns tokens for the updated records. If `returnTokens` is set to False, Skyflow returns IDs for the updated records.

#### Construct an update request

```typescript
import { UpdateRequest, UpdateResponse } from 'skyflow-node';

const updateRequest = new UpdateRequest('table1', {
  skyflowId: '<SKYFLOW_ID>',
  <COLUMN_NAME_1>: '<COLUMN_VALUE_1>',
  <COLUMN_NAME_2>: '<COLUMN_VALUE_2>'
});

const response: UpdateResponse = await skyflowClient
  .vault('<VAULT_ID>')
  .update(updateRequest);

console.log('Update response:', response);
```

> [!TIP]
> See the full example in the samples directory: [update-record.ts](samples/vault-api/update-record.ts)

### Delete Records

To delete records using Skyflow IDs, use the `delete` method. The `DeleteRequest` class accepts a list of Skyflow IDs that you want to delete, as shown below:

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

To retrieve data with SQL queries, use the `query` method. `QueryRequest` is class that takes the `query` parameter as follows:

Refer to [Query your data](https://docs.skyflow.com/query-data/) and [Execute Query](https://docs.skyflow.com/record/#QueryService_ExecuteQuery) for guidelines and restrictions on supported SQL statements, operators, and keywords.

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

// Prepare File Upload Data
const tableName: string = "table-name"; // Table name
const skyflowId: string = "skyflow-id"; // Skyflow ID of the record
const columnName: string = "column-name"; // Column name to store file
const filePath: string = "file-path"; // Path to the file for upload

// Create File Upload Request
const uploadReq: FileUploadRequest = new FileUploadRequest(
  tableName,
  skyflowId,
  columnName,
);

// Configure FileUpload Options
const uploadOptions: FileUploadOptions = new FileUploadOptions();
const buffer = fs.readFileSync(filePath);
// Set any one of FilePath, Base64 or FileObject in FileUploadOptions
uploadOptions.setFileObject(new File([buffer], filePath)); // Set a File object

// Perform File Upload
const response: FileUploadResponse = await skyflowClient
  .vault(primaryVaultConfig.vaultId)
  .uploadFile(uploadReq, uploadOptions);

console.log("File upload:", response);
```

> [!TIP]
> See the full example in the samples directory: [file-upload.ts](samples/vault-api/file-upload.ts)

### Get Tokens by Values: `.tokenize(request)`

The `.tokenize()` method is used to retrieve tokens for values which already exist in the vault. Think of it as a "Get Tokens by Value" action.

This method does not generate new tokens, only returns existing tokens from the vault.

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

Skyflow Detect enables you to deidentify and reidentify sensitive data in text and files, supporting advanced privacy-preserving workflows.

### De-identify Text: `.deidentifyText(request, options)`

To de-identify or _anonymize_ text, use the `deidentifyText` method. 

The `DeidentifyTextRequest` class creates a deidentify text request, which includes the text to be deidentified. Additionally, you can provide optional parameters using the `DeidentifyTextOptions` class.

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

// Call deidentifyText
const response = await skyflowClient
  .detect(primaryVaultConfig.vaultId)
  .deidentifyText(deidentifyTextRequest, options);

console.log("Deidentify Text Response:", response);
```

> [!TIP]
> See the full example in the samples directory: [deidentify-text.ts](samples/detect-api/deidentify-text.ts)

### Re-identify Text: `.reidentifyText(request, options)`

To reidentify text, use the `reidentifyText` method. The `ReidentifyTextRequest` class creates a reidentify text request, which includes the redacted or de-identified text to be re-identified. Additionally, you can provide optional parameters using the `ReidentifyTextOptions` class to control how specific entities are returned (as redacted, masked, or plain text).

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

### Deidentify File: `.deidentifyFile(fileReq, options)`

To deidentify files, use the `deidentifyFile` method. The `DeidentifyFileRequest` class creates a deidentify file request, which includes the file to be deidentified (such as images, PDFs, audio, documents, spreadsheets, or presentations). Additionally, you can provide optional parameters using the `DeidentifyFileOptions` class to control how entities are detected and deidentified, as well as how the output is generated for different file types.

**Note:** File de-identification requires Node.js v20.x or above.

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

options.setOutputDirectory('<OUTPUT_DIRECTORY_PATH>');  // Output directory for saving the deidentified file. This is not supported in Cloudflare workers

options.setWaitTime(64);   // Wait time for response (max 64 seconds; throws error if more)

// Call deidentifyFile
const response: DeidentifyFileResponse = await skyflowClient
  .detect(primaryVaultConfig.vaultId)
  .deidentifyFile(fileReq, options);

console.log('Deidentify File Response:', response);
```

**Supported file types:**

- Documents: `doc`, `docx`, `pdf`
- PDFs: `pdf`
- Images: `bmp`, `jpeg`, `jpg`, `png`, `tif`, `tiff`
- Structured text: `json`, `xml`
- Spreadsheets: `csv`, `xls`, `xlsx`
- Presentations: `ppt`, `pptx`
- Audio: `mp3`, `wav`

**Notes:**

- Transformations cannot be applied to Documents, Images, or PDFs file formats.
- The `waitTime` option must be ≤ 64 seconds; otherwise, an error is thrown.
- If the API takes more than 64 seconds to process the file, it will return only the `runId` and `status` in the response.

> [!TIP]
> See the full example in the samples directory: [deidentify-file.ts](samples/detect-api/deidentify-file.ts)

### Get Run: `.getDetectRun(request)`

To retrieve the results of a previously started file de-identification operation - or 'run' - use the `getDetectRun(...)` method.
The `GetDetectRunRequest` class is initialized with the `runId` returned from a prior `.deidentifyFile(fileReq, options)` call.
This method allows you to fetch the final results of the file de-identification operation once they are available.

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
- `DELETE`

**pathParams, queryParams, header, body** are the JSON objects represented as dictionaries that will be sent through the connection integration url.

> [!TIP]
> See the full example in the samples directory: [scoped-token-generation-example.ts](samples/vault-api/invoke-connection.ts)  
> See [docs.skyflow.com](https://docs.skyflow.com) for more details on integrations with Connections, Functions, and Pipelines.

## Authentication & authorization


### Types of `credentials`
Skyflow allows four different kinds of authentication and authorization through the API and SDKs:

1. **API keys**  
   A unique identifier used to authenticate and authorize requests to an API.

2. **Bearer tokens**  
   A temporary access token used to authenticate API requests, typically included in the
   Authorization header. This can be generated with a signed JWT for production use (see below) or passed in directly. 
   Developers can also copy a personal bearer token from the Skyflow Studio UI to get started quickly.

3. **Service account credentials file path**  
   The file path pointing to a JSON file containing credentials for a service account, used
   for secure API access by generating bearer tokens on-demand.

4. **Service account credentials string**  
   JSON-formatted string containing service account credentials, often used as an alternative to a file for secure API access by generating bearer tokens on-demand.

**Note: Only one type of credential can be used at a time. If multiple credentials are provided, the last one added will take precedence.**

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

Alternatively, you can also send the entire credentials as string by using `generateBearerTokenFromCreds(string)`.

> [!TIP]
> See the full example in the samples directory: [token-generation-example.ts](http://github.com/skyflowapi/skyflow-node/blob/v2/samples/service-account/token-generation-example.ts)

#### Generate bearer tokens scoped to certain roles

A service account with multiple roles can generate bearer tokens with access limited to a specific role by specifying the appropriate roleID. This can be used to limit access to specific roles for services with multiple responsibilities, such as segregating access for billing and analytics. The generated bearer tokens are valid for 60 minutes and can only execute operations permitted by the permissions associated with the designated role.

```ts
const options = {
  roleIDs: ['roleID1', 'roleID2'],
};
```

> [!TIP]
> See the full example in the samples directory: [scoped-token-generation-example.ts](samples/service-account/scoped-token-generation-example.ts)  
> See [docs.skyflow.com](https://docs.skyflow.com) for more details on authentication, access control, and governance for Skyflow.

#### Generate a bearer tokens with `ctx`

**Context-aware authorization** embeds context values into a bearer token during its generation and so you can reference those values in your policies. This enables more flexible access controls, such as helping you track end-user identity when making API calls using service accounts, and facilitates using signed data tokens during detokenization.

A service account with the context_id identifier generates bearer tokens containing context information, represented as a JWT claim in a Skyflow-generated bearer token. Tokens generated from such service accounts include a context_identifier claim, are valid for 60 minutes, and can be used to make API calls to the Data and Management APIs, depending on the service account's permissions.

```ts
generateBearerTokenFromCreds(
  JSON.stringify({
    clientID: "<YOUR_CLIENT_ID>",
    clientName: "<YOUR_CLIENT_NAME>",
    keyID: "<YOUR_KEY_ID>",
    tokenURI: "<YOUR_TOKEN_URI>",
    privateKey: "<YOUR_PEM_PRIVATE_KEY>",
  }),
  {
    ctx: "context_id", // the user's context identifier
  },
);
```

> [!TIP]
> See the full example in the samples directory: [token-generation-with-context-example.ts](samples/service-account/token-generation-with-context-example.ts)  
> See [docs.skyflow.com](https://docs.skyflow.com) for more details on authentication, access control, and governance for Skyflow.

#### Generate signed data tokens: `generateSignedDataTokens(filepath, options)`

Skyflow generates data tokens when sensitive data is inserted into the vault. These data tokens can be digitally signed with a service account's private key, adding an extra layer of protection. Signed tokens can only be detokenized by providing the signed data token along with a bearer token generated from the service account's credentials. The service account must have the necessary permissions and context to successfully detokenize the signed data tokens.

> [!TIP]
> See the full example in the samples directory: [signed-token-generation-example.ts](samples/service-account/signed-token-generation-example.ts)  
> See [docs.skyflow.com](https://docs.skyflow.com) for more details on authentication, access control, and governance for Skyflow.

## Logging

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

## Error handling

### Catching `SkyflowError` instances

As a best practice always wrap your calls to the Skyflow SDK in try / catch blocks. The SDK provides the `SkyflowError` type which can be used to identify errors coming from Skyflow versus general request / response errors.

```ts
try {
  // ...call the Skyflow SDK
} catch (error) {
  // catch an error, identify if it is a SkyflowError
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

### Bearer token expiration edge cases

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

If you discover a potential security issue in this project, please reach out to us at [mailto:security@skyflow.com](security@skyflow.com). Please do not create public GitHub issues or Pull Requests, as malicious actors could potentially view them.
