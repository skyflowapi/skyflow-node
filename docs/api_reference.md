# API Reference

A reference for the public Skyflow Node SDK surface: client-management methods, request classes, options classes, response classes, enums, Detect helper classes, and service-account functions. For task-oriented usage and examples, see the [README](../README.md).

All properties, setters, and enum values below are taken directly from the SDK source.

## Table of Contents

- [Client management methods](#client-management-methods)
- [Request classes](#request-classes)
- [Options classes](#options-classes)
- [Response classes](#response-classes)
- [Enums](#enums)
- [Detect helper classes](#detect-helper-classes)
- [Service account functions](#service-account-functions)

---

## Client management methods

The `Skyflow` client exposes the following methods to manage configuration at runtime, in addition to the vault/detect/connection accessors.

| Method | Description |
|--------|-------------|
| `vault(vaultId?)` | Return a `VaultController` for the given vault ID. Defaults to the first configured vault. |
| `detect(vaultId?)` | Return a `DetectController` for the given vault ID. |
| `connection(connectionId?)` | Return a `ConnectionController` for the given connection ID. |
| `addVaultConfig(config)` | Add a vault configuration after initialization. Throws if the vault ID already exists. |
| `updateVaultConfig(config)` | Update an existing vault configuration. |
| `getVaultConfig(vaultId)` | Return the `VaultConfig` for the given vault ID. |
| `removeVaultConfig(vaultId)` | Remove a vault configuration. |
| `addConnectionConfig(config)` | Add a connection configuration. Throws if the connection ID already exists. |
| `updateConnectionConfig(config)` | Update an existing connection configuration. |
| `getConnectionConfig(connectionId)` | Return the `ConnectionConfig` for the given connection ID. |
| `removeConnectionConfig(connectionId)` | Remove a connection configuration. |
| `updateSkyflowCredentials(credentials)` | Replace the shared credentials used by all vaults/connections. |
| `getSkyflowCredentials()` | Return the current shared credentials. |
| `setLogLevel(logLevel)` | Change the log level at runtime. |
| `updateLogLevel(logLevel)` | Change the log level and return `this` for chaining. |
| `getLogLevel()` | Return the current log level. |

```ts
// Example: manage configuration after initialization
skyflowClient.addVaultConfig(anotherVaultConfig);
skyflowClient.updateLogLevel(LogLevel.DEBUG);
const level = skyflowClient.getLogLevel();
```

---

## Request classes

All request classes are importable from `'skyflow-node'`.

### `InsertRequest`

Passed to `vault().insert()`.

| Constructor argument | Type | Description |
|---|---|---|
| `table` | `string` | Target table name. |
| `data` | `Record<string, unknown>[]` | Records to insert. Each is a `{ column: value }` object. |

Configure additional behavior with [`InsertOptions`](#insertoptions).

### `UpdateRequest`

Passed to `vault().update()`.

| Constructor argument | Type | Description |
|---|---|---|
| `table` | `string` | Target table name. |
| `data` | `Record<string, unknown>` | Object containing `skyflowId` and the columns to update. |

Configure additional behavior with [`UpdateOptions`](#updateoptions).

### `GetRequest`

Passed to `vault().get()` for retrieval by Skyflow IDs.

| Constructor argument | Type | Description |
|---|---|---|
| `table` | `string` | Target table name. |
| `ids` | `string[]` | Skyflow IDs to retrieve. Mutually exclusive with column-based options. |

Configure additional behavior with [`GetOptions`](#getoptions).

### `GetColumnRequest`

Passed to `vault().get()` for retrieval by a unique column value.

| Constructor argument | Type | Description |
|---|---|---|
| `table` | `string` | Target table name. |
| `columnName` | `string` | Unique column to look up by (must have a `unique` constraint). |
| `columnValues` | `string[]` | Values to match in the column. |

Configure additional behavior with [`GetOptions`](#getoptions).

### `DetokenizeRequest`

Passed to `vault().detokenize()`.

| Constructor argument | Type | Description |
|---|---|---|
| `data` | `DetokenizeData[]` | Tokens to detokenize. Each item: `{ token: string; redactionType?: RedactionType }`. |

Configure additional behavior with [`DetokenizeOptions`](#detokenizeoptions).

### `TokenizeRequest`

Passed to `vault().tokenize()`.

| Constructor argument | Type | Description |
|---|---|---|
| `values` | `TokenizeRequestType[]` | Values to tokenize. Each item: `{ value: string; columnGroup: string }`. |

### `DeleteRequest`

Passed to `vault().delete()`.

| Constructor argument | Type | Description |
|---|---|---|
| `table` | `string` | Target table name. |
| `ids` | `string[]` | Skyflow IDs to delete. |

### `QueryRequest`

Passed to `vault().query()`.

| Constructor argument | Type | Description |
|---|---|---|
| `query` | `string` | SQL query string to execute. |

### `FileUploadRequest`

Passed to `vault().uploadFile()`. Use [`FileUploadOptions`](#fileuploadoptions) to supply the file and Skyflow ID.

| Constructor argument | Type | Description |
|---|---|---|
| `table` | `string` | Target table name. |
| `columnName` | `string` | File column name. |

### `DeidentifyTextRequest`

Passed to `detect().deidentifyText()`.

| Constructor argument | Type | Description |
|---|---|---|
| `text` | `string` | Text to de-identify. |

Configure additional behavior with [`DeidentifyTextOptions`](#deidentifytextoptions).

### `ReidentifyTextRequest`

Passed to `detect().reidentifyText()`.

| Constructor argument | Type | Description |
|---|---|---|
| `text` | `string` | The redacted/de-identified text to re-identify. |

Configure additional behavior with [`ReidentifyTextOptions`](#reidentifytextoptions).

### `FileInput`

Passed as the constructor argument to `DeidentifyFileRequest`. Provide **exactly one** source.

| Variant | Shape | Description |
|---|---|---|
| `FileObject` | `{ file: File }` | An in-memory `File` object. |
| `Filepath` | `{ filePath: string }` | Path to a file on disk. |

### `DeidentifyFileRequest`

Passed to `detect().deidentifyFile()`. Provide either a `File` object or a file path — not both.

| Constructor argument | Type | Description |
|---|---|---|
| `fileInput` | [`FileInput`](#fileinput) | `{ file: File }` or `{ filePath: string }`. |

Configure additional behavior with [`DeidentifyFileOptions`](#deidentifyfileoptions).

### `GetDetectRunRequest`

Passed to `detect().getDetectRun()`.

| Constructor argument | Type | Description |
|---|---|---|
| `options` | `{ runId: string }` | The `runId` returned by a prior `deidentifyFile` call. |

### `InvokeConnectionRequest`

Passed to `connection().invoke()`.

| Constructor argument | Type | Description |
|---|---|---|
| `method` | `RequestMethod` | HTTP method. See [`RequestMethod`](#requestmethod). |
| `body` | `StringKeyValueMapType \| null` | Request body. |
| `headers` | `StringKeyValueMapType \| null` | Request headers. |
| `pathParams` | `StringKeyValueMapType \| null` | Path parameters. |
| `queryParams` | `StringKeyValueMapType \| null` | Query parameters. |

---

## Options classes

All options classes are importable from `'skyflow-node'`. Construct an options object, call setters to configure, then pass it as the second argument to the corresponding operation.

### `InsertOptions`

| Setter | Type | Default | Description |
|---|---|---|---|
| `setReturnTokens(bool)` | `boolean` | `false` | Return tokens for inserted fields. |
| `setContinueOnError(bool)` | `boolean` | `false` | Continue the batch despite per-record errors. |
| `setUpsertColumn(column)` | `string` | — | Column to use as the upsert index (must have `unique` constraint). |
| `setHomogeneous(bool)` | `boolean` | `false` | Treat all records as the same schema. |
| `setTokens(tokens)` | `Record<string, unknown>[]` | — | BYOT values, aligned with the insert data (used with `setTokenMode`). |
| `setTokenMode(mode)` | `TokenMode` | `DISABLE` | BYOT mode. See [`TokenMode`](#tokenmode). |

### `UpdateOptions`

| Setter | Type | Default | Description |
|---|---|---|---|
| `setReturnTokens(bool)` | `boolean` | `false` | Return tokens for updated fields. When `false`, only `skyflowId` is returned. |
| `setTokens(tokens)` | `Record<string, unknown>` | — | BYOT values for the updated columns. |
| `setTokenMode(mode)` | `TokenMode` | `DISABLE` | BYOT mode. See [`TokenMode`](#tokenmode). |

### `GetOptions`

| Setter | Type | Default | Description |
|---|---|---|---|
| `setReturnTokens(bool)` | `boolean` | `false` | Return tokens instead of plain-text values. |
| `setRedactionType(type)` | `RedactionType` | — | Control how values are redacted. See [`RedactionType`](#redactiontype). |
| `setFields(fields)` | `string[]` | — | Limit the response to specific field names. |
| `setOffset(offset)` | `string` | — | Pagination offset (records to skip). |
| `setLimit(limit)` | `string` | — | Maximum records to return. |
| `setDownloadUrl(bool)` | `boolean` | — | Return a pre-signed download URL for file fields. |
| `setColumnName(name)` | `string` | — | Column to filter by (use with `setColumnValues`). |
| `setColumnValues(values)` | `string[]` | — | Values to match in the column set by `setColumnName`. |
| `setOrderBy(order)` | `OrderByEnum` | — | Sort order. See [`OrderByEnum`](#orderbyenum). |

### `DetokenizeOptions`

| Setter | Type | Default | Description |
|---|---|---|---|
| `setContinueOnError(bool)` | `boolean` | `false` | Continue despite per-token errors. |
| `setDownloadUrl(bool)` | `boolean` | — | Return pre-signed download URLs for file tokens. |

### `FileUploadOptions`

Provide **exactly one** file source: `setFileObject`, `setFilePath`, or `setBase64`.

| Setter | Type | Description |
|---|---|---|
| `setSkyflowId(id)` | `string` | **Required.** Skyflow ID of the record to attach the file to. |
| `setFileObject(file)` | `File` | In-memory `File` object. |
| `setFilePath(path)` | `string` | Path to a file on disk. Requires Node.js v20+. |
| `setBase64(data)` | `string` | Base64-encoded file content. Use with `setFileName`. |
| `setFileName(name)` | `string` | Filename for base64 uploads (e.g. `"document.pdf"`). |

### `DeidentifyTextOptions`

| Setter | Type | Description |
|---|---|---|
| `setEntities(entities)` | `DetectEntities[]` | Entity types to detect and de-identify. |
| `setAllowRegexList(patterns)` | `string[]` | Regex patterns that always match as entities. |
| `setRestrictRegexList(patterns)` | `string[]` | Regex patterns that never match as entities. |
| `setTokenFormat(format)` | `TokenFormat` | Token format per entity type. See [`TokenFormat`](#tokenformat). |
| `setTransformations(t)` | `Transformations` | Custom transformations. See [`Transformations`](#transformations). |

### `ReidentifyTextOptions`

| Setter | Type | Description |
|---|---|---|
| `setRedactedEntities(entities)` | `DetectEntities[]` | Entity types to keep redacted. |
| `setMaskedEntities(entities)` | `DetectEntities[]` | Entity types to mask. |
| `setPlainTextEntities(entities)` | `DetectEntities[]` | Entity types to reveal as plain text. |

### `DeidentifyFileOptions`

| Setter | Type | Description |
|---|---|---|
| `setEntities(entities)` | `DetectEntities[]` | Entity types to detect. |
| `setAllowRegexList(patterns)` | `string[]` | Regex patterns to always treat as detectable. |
| `setRestrictRegexList(patterns)` | `string[]` | Regex patterns to exclude from detection. |
| `setTokenFormat(format)` | `TokenFormat` | Token format per entity type. |
| `setTransformations(t)` | `Transformations` | Custom transformations (not supported for Documents, Images, or PDFs). |
| `setOutputDirectory(path)` | `string` | Directory to write the processed file. Not supported in Cloudflare Workers. |
| `setWaitTime(seconds)` | `number` | Max seconds to poll (≤ 64). Returns `runId` + `status` if exceeded. |
| `setOutputProcessedImage(bool)` | `boolean` | Include the processed image in the response. Images only. |
| `setOutputOcrText(bool)` | `boolean` | Include OCR-extracted text. Images only. |
| `setMaskingMethod(method)` | `MaskingMethod` | Masking method for image entities. See [`MaskingMethod`](#maskingmethod). |
| `setPixelDensity(dpi)` | `number` | DPI for image rendering. Images/PDFs only. |
| `setMaxResolution(px)` | `number` | Maximum pixel dimension of the output. Images/PDFs only. |
| `setOutputProcessedAudio(bool)` | `boolean` | Include processed audio in the response. Audio only. |
| `setOutputTranscription(format)` | `DetectOutputTranscription` | Transcription format. See [`DetectOutputTranscription`](#detectoutputtranscription). Audio only. |
| `setBleep(bleep)` | `Bleep` | Bleep tone config for redacted audio spans. See [`Bleep`](#bleep). Audio only. |

---

## Response classes

Every operation returns a typed response class. All response classes are importable from `'skyflow-node'`.

> **The `errors` field** is present on most responses as `SkyflowRecordError[] | null`. It is populated only on partial failure (for example when `setContinueOnError(true)` is used); it is `null` when there are no errors. See [`SkyflowRecordError`](#skyflowrecorderror).

### `InsertResponse`

Returned by `vault().insert()`.

| Field | Type | Description |
|---|---|---|
| `insertedFields` | `InsertResponseType[]` | Inserted records. Each has `skyflowId`; with `setReturnTokens(true)`, also a token per column; with `setContinueOnError(true)`, also a `requestIndex`. |
| `errors` | `SkyflowRecordError[] \| null` | See note above. |

### `GetResponse`

Returned by `vault().get()`.

| Field | Type | Description |
|---|---|---|
| `data` | `GetResponseData[]` | Retrieved records as `{ field: value }` objects. Tokens instead of values when `setReturnTokens(true)`. |
| `errors` | `SkyflowRecordError[] \| null` | See note above. |

### `UpdateResponse`

Returned by `vault().update()`.

| Field | Type | Description |
|---|---|---|
| `updatedField` | `InsertResponseType` | The updated record: `skyflowId`, plus tokens per column when `setReturnTokens(true)`. |
| `errors` | `SkyflowRecordError[] \| null` | See note above. |

### `DeleteResponse`

Returned by `vault().delete()`.

| Field | Type | Description |
|---|---|---|
| `deletedIds` | `string[]` | Skyflow IDs of the deleted records. |
| `errors` | `SkyflowRecordError[] \| null` | See note above. |

### `DetokenizeResponse`

Returned by `vault().detokenize()`.

| Field | Type | Description |
|---|---|---|
| `detokenizedFields` | `Array<{token: string; value: string; type: string}> \| null` | One entry per token with the original `token`, the decoded `value`, and its `type`. |
| `errors` | `SkyflowRecordError[] \| null` | See note above. |

### `TokenizeResponse`

Returned by `vault().tokenize()`.

| Field | Type | Description |
|---|---|---|
| `tokens` | `string[]` | One token per input value, in the same order as the request. |
| `errors` | `SkyflowRecordError[] \| null` | See note above. |

### `QueryResponse`

Returned by `vault().query()`.

| Field | Type | Description |
|---|---|---|
| `fields` | `QueryResponseType[]` | Matching records. Each includes a `tokenizedData` map alongside the field values. |
| `errors` | `SkyflowRecordError[] \| null` | See note above. |

### `FileUploadResponse`

Returned by `vault().uploadFile()`.

| Field | Type | Description |
|---|---|---|
| `skyflowId` | `string` | ID of the record the file was attached to. |
| `errors` | `SkyflowRecordError[] \| null` | See note above. |

### `InvokeConnectionResponse`

Returned by `connection().invoke()`.

| Field | Type | Description |
|---|---|---|
| `data` | `object \| undefined` | The connection's response body. |
| `metadata` | `{ requestId: string } \| undefined` | Response metadata including the server-side `requestId`. |
| `errors` | `SkyflowRecordError[] \| null` | See note above. |

### `DeidentifyTextResponse`

Returned by `detect().deidentifyText()`.

| Field | Type | Description |
|---|---|---|
| `processedText` | `string` | The de-identified text. |
| `entities` | `Array<{token, value, textIndex: IndexRange, processedIndex: IndexRange, entity, scores}>` | Detected entities. |
| `wordCount` | `number` | Word count of the input text. |
| `charCount` | `number` | Character count of the input text. |
| `errors` | `SkyflowRecordError[] \| null` | See note above. |

### `ReidentifyTextResponse`

Returned by `detect().reidentifyText()`.

| Field | Type | Description |
|---|---|---|
| `processedText` | `string` | The re-identified text. |

### `DeidentifyFileResponse`

Returned by `detect().deidentifyFile()` and `detect().getDetectRun()`. All fields are optional — populated based on file type and processing status. When processing exceeds `setWaitTime`, only `runId` and `status` are set; poll with `getDetectRun`.

| Field | Type | Description |
|---|---|---|
| `fileBase64` | `string \| undefined` | The processed file as a base64 string. |
| `file` | `File \| undefined` | The processed `File` object. |
| `type` | `string \| undefined` | MIME type of the processed file. |
| `extension` | `string \| undefined` | File extension of the processed file. |
| `wordCount` | `number \| undefined` | Word count (text-bearing files). |
| `charCount` | `number \| undefined` | Character count (text-bearing files). |
| `sizeInKb` | `number \| undefined` | Size of the processed file in KB. |
| `durationInSeconds` | `number \| undefined` | Duration in seconds (audio files). |
| `pageCount` | `number \| undefined` | Page count (PDF/document files). |
| `slideCount` | `number \| undefined` | Slide count (presentation files). |
| `entities` | `Array<{file: string; extension: string}>` | Detected entity files. Defaults to `[]`. |
| `runId` | `string \| undefined` | Run identifier; pass to `getDetectRun` to poll. |
| `status` | `string \| undefined` | Processing status (`IN_PROGRESS`, `SUCCESS`, `FAILED`). |
| `errors` | `SkyflowRecordError[] \| null` | See note above. |

### `SkyflowRecordError`

The shape of each entry in a response's `errors` array.

| Field | Type | Description |
|---|---|---|
| `error` | `string` | Error description. |
| `requestId` | `string \| null` | Server-side `x-request-id` header value. |
| `httpCode` | `string \| number \| null` | HTTP status code for this record. |
| `requestIndex` | `number \| null` | Index of the failed record in the input array. |
| `token` | `string \| null` | Token (present on detokenize errors only). |

---

## Enums

All enums are importable from `'skyflow-node'`.

### `Env`

Deployment environment.

| Value | Vault host |
|---|---|
| `Env.PROD` | `vault.skyflowapis.com` (default) |
| `Env.SANDBOX` | `vault.skyflowapis-preview.com` |
| `Env.DEV` | `vault.skyflowapis.dev` |
| `Env.STAGE` | `vault.skyflowapis.tech` |

### `LogLevel`

`DEBUG` < `INFO` < `WARN` < `ERROR` < `OFF`. Default is `ERROR`. See [Logging](../README.md#logging).

### `RedactionType`

Controls how retrieved data is displayed.

| Value | Description |
|---|---|
| `RedactionType.DEFAULT` | Vault-configured default. |
| `RedactionType.PLAIN_TEXT` | Full, unmasked value. |
| `RedactionType.MASKED` | Partially obscured. |
| `RedactionType.REDACTED` | Fully removed. |

### `TokenMode`

BYOT mode for `InsertOptions` and `UpdateOptions`.

| Value | Description |
|---|---|
| `TokenMode.DISABLE` | Vault generates tokens (default). |
| `TokenMode.ENABLE` | Caller-supplied tokens accepted as-is. |
| `TokenMode.ENABLE_STRICT` | Caller-supplied tokens validated before accepting. |

### `TokenType`

Token format used in `TokenFormat.setDefault()`.

| Value | Description |
|---|---|
| `TokenType.VAULT_TOKEN` | Standard vault token. |
| `TokenType.ENTITY_UNIQUE_COUNTER` | Entity-unique counter token. |
| `TokenType.ENTITY_ONLY` | Entity label only (no token value). |

### `OrderByEnum`

Sort order for `GetOptions.setOrderBy()`.

| Value | Description |
|---|---|
| `OrderByEnum.ASCENDING` | Ascending order. |
| `OrderByEnum.DESCENDING` | Descending order. |
| `OrderByEnum.NONE` | No explicit sort (server default). |

### `RequestMethod`

HTTP method for `InvokeConnectionRequest`.

Values: `GET`, `POST`, `PUT`, `PATCH`.

### `MaskingMethod`

Image masking method for `DeidentifyFileOptions.setMaskingMethod()`.

Values: `Blackbox`, `Blur`.

### `DetectOutputTranscription`

Audio transcription format for `DeidentifyFileOptions.setOutputTranscription()`.

Values: `DIARIZED_TRANSCRIPTION`, `MEDICAL_DIARIZED_TRANSCRIPTION`, `MEDICAL_TRANSCRIPTION`, `TRANSCRIPTION`, `PLAINTEXT_TRANSCRIPTION`.

### `DetectEntities`

Entity types Skyflow Detect can identify — e.g. `SSN`, `CREDIT_CARD`, `NAME`, `DOB`, `PHONE_NUMBER`, `EMAIL`, `ACCOUNT_NUMBER`, and more. Import from `'skyflow-node'`.

---

## Detect helper classes

All importable from `'skyflow-node'`.

### `TokenFormat`

Controls the token representation per entity type in de-identification. Pass to `DeidentifyTextOptions.setTokenFormat()` or `DeidentifyFileOptions.setTokenFormat()`.

| Setter | Type | Description |
|---|---|---|
| `setDefault(type)` | `TokenType` | Default token format for all detected entities. |
| `setVaultToken(entities)` | `DetectEntities[]` | Use vault tokens for these specific entity types. |
| `setEntityUniqueCounter(entities)` | `DetectEntities[]` | Use entity-unique counter tokens for these types. |
| `setEntityOnly(entities)` | `DetectEntities[]` | Use entity-only (no token) for these types. |

### `Transformations`

Specifies custom transformations applied to detected entities during de-identification. Pass to `DeidentifyTextOptions.setTransformations()`.

| Setter | Type | Description |
|---|---|---|
| `setShiftDays(config)` | `{ max: number; min: number; entities: DetectEntities[] }` | Shift date entities by a random number of days within `[min, max]`. |

### `Bleep`

Audio bleep tone configuration. Pass to `DeidentifyFileOptions.setBleep()`.

| Setter | Type | Description |
|---|---|---|
| `setGain(value)` | `number` | Volume of the bleep tone (0.0 – 1.0). |
| `setFrequency(hz)` | `number` | Frequency in hertz. |
| `setStartPadding(seconds)` | `number` | Silence padding before the bleep. |
| `setStopPadding(seconds)` | `number` | Silence padding after the bleep. |

### `IndexRange`

Character position range within text. Used in `DeidentifyTextResponse.entities[].textIndex` and `.processedIndex`.

| Field | Type | Description |
|---|---|---|
| `start` | `number \| undefined` | Start offset. |
| `end` | `number \| undefined` | End offset. |

---

## Service account functions

All importable from `'skyflow-node'`. See [Authentication & authorization](../README.md#authentication--authorization) for full usage of `generateBearerToken`, `generateBearerTokenFromCreds`, and `generateSignedDataTokens`.

### `isExpired(token)`

Returns `true` if the given JWT bearer token is expired. Use to cache tokens and only regenerate when needed.

```ts
import { generateBearerToken, isExpired } from 'skyflow-node';

if (!cachedToken || isExpired(cachedToken)) {
    const { accessToken } = await generateBearerToken('path/to/credentials.json');
    cachedToken = accessToken;
}
```

### `generateSignedDataTokensFromCreds(credentialsString, options)`

The credentials-string counterpart to `generateSignedDataTokens(filepath, options)`. Accepts a JSON credentials string instead of a file path. `options` is the same `SignedDataTokensOptions` type.

```ts
import { generateSignedDataTokensFromCreds } from 'skyflow-node';

const response = await generateSignedDataTokensFromCreds(
    process.env.SKYFLOW_CREDENTIALS!,
    {
        dataTokens: ['dataToken1', 'dataToken2'],
        timeToLive: 90,
        ctx: 'user_12345',
    }
);
```

### `BearerTokenOptions`

```ts
type BearerTokenOptions = {
    roleIds?: string[];                  // Scope to specific service-account roles
    ctx?: string | Record<string, any>; // Context embedded in the token
    logLevel?: LogLevel;                 // Override log level for this call
    tokenUri?: string;                   // Override the token endpoint URL
};
```

### `SignedDataTokensOptions`

```ts
type SignedDataTokensOptions = {
    dataTokens: string[];                // Data tokens to sign (required)
    timeToLive?: number;                 // Seconds until expiry (default 60)
    ctx?: string | Record<string, any>; // Context embedded in the token
    logLevel?: LogLevel;
    tokenUri?: string;
};
```

### `GenerateTokenOptions`

```ts
type GenerateTokenOptions = {
    logLevel?: LogLevel;
};
```
