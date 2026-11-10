# API Reference

A reference for the public Skyflow Node SDK surface: client-management methods, request classes, options classes, response classes, enums, the Detect API (shared with the flowvault SDK), and service-account functions. For task-oriented usage and examples, see the [skyvault README](../skyvault/README.md).

All properties, setters, and enum values below are taken directly from the SDK source.

## Table of Contents

- [Client management methods](#client-management-methods)
- [Request classes](#request-classes)
- [Options classes](#options-classes)
- [Response classes](#response-classes)
- [Enums](#enums)
- [Detect API](#detect-api)
- [Service account functions](#service-account-functions)

---

## Client management methods

The `Skyflow` client exposes the following methods to manage configuration at runtime, in addition to the vault/detect/connection accessors.

| Method | Description |
|--------|-------------|
| `vault(vaultId?)` | Return a `VaultController` for the given vault ID. Defaults to the first configured vault. |
| `detect(vaultId?)` | Return a `DetectController` for the given vault ID. See [Detect API](#detect-api). |
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

`DEBUG` < `INFO` < `WARN` < `ERROR` < `OFF`. Default is `ERROR`. See [Logging](../skyvault/README.md#logging).

### `RedactionType`

Controls how retrieved data is displayed.

| Value | Description |
|---|---|
| `RedactionType.DEFAULT` | Vault-configured default. Valid for `get` and `detokenize`; the Detect API does not accept it in a `RedactionLevel`. |
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


---

## Detect API

Shared by the `skyflow-node` and `skyflow-flowvault-node` SDKs: every class, interface and enum below is importable from either package. `skyflowClient.detect()` and `skyflowClient.detect(vaultId)` return a `DetectController`. Usage and examples: [skyvault README](../skyvault/README.md#detect), [flowvault README](../flowvault/README.md#detect).

| Method | Request | Response |
|--------|---------|----------|
| `deidentifyString` | [`DeidentifyStringRequest`](#deidentifystringrequest) | [`DeidentifyStringResponse`](#deidentifystringresponse) |
| `deidentifyFile` | [`DeidentifyFileRequest`](#deidentifyfilerequest) | [`DeidentifyFileResponse`](#deidentifyfileresponse) |
| `reidentifyString` | [`ReidentifyStringRequest`](#reidentifystringrequest) | [`ReidentifyStringResponse`](#reidentifystringresponse) |
| `reidentifyFile` | [`ReidentifyFileRequest`](#reidentifyfilerequest) | [`ReidentifyFileResponse`](#reidentifyfileresponse) |
| `getRun` | [`GetRunRequest`](#getrunrequest) | [`GetRunResponse`](#getrunresponse) |
| `checkGuardrails` | [`CheckGuardrailsRequest`](#checkguardrailsrequest) | [`CheckGuardrailsResponse`](#checkguardrailsresponse) |

Configuration and helper types: [`DetectConfiguration`](#detectconfiguration), [`Detect`](#detect), [`Entity`](#entity), [`Transformation` and `ShiftDates`](#transformation-and-shiftdates), [`CustomType`](#customtype), [`ObjectEntity`](#objectentity), [`FileMapping`](#filemapping), [`Media`](#media) (with `Audio`, `Bleep`, `Document`, `Pdf`, `Image`), [`PollOptions`](#polloptions), [`RedactionLevel`](#redactionlevel), [`DetectedEntity`](#detectedentity), [`EntityLocation`](#entitylocation), [`Metrics`](#metrics), [`FileOutput`](#fileoutput). Enums: [Detect enums](#detect-enums).

Request classes take their required fields as constructor arguments and their optional fields in a trailing object; every field is also exposed as a settable property. Response classes are read-only data containers.

### `DeidentifyStringRequest`

`new DeidentifyStringRequest(text, fields?)` — passed to `detect().deidentifyString()`.

| Field | Type | Description |
|---|---|---|
| `text` | `string` | **Required.** Text to de-identify. |
| `configurationId` | `string` | Id of a Detect configuration created through the management API. Sending it together with `configuration` is rejected by the API. |
| `configuration` | [`DetectConfiguration`](#detectconfiguration) | Inline configuration. With neither this nor `configurationId` set, the SDK sends only the vault id and the server applies the vault's defaults. |

### `DeidentifyFileRequest`

`new DeidentifyFileRequest(fields)` — passed to `detect().deidentifyFile()`. Supply the file through exactly one of `value` (with a `dataSource`), `file` or `filePath`.

| Field | Type | Description |
|---|---|---|
| `dataSource` | [`DeidentifySourceType`](#detect-enums) | How `value` supplies the file, as your SDK's enum: `BASE64` or `PRESIGNED_URL`; the skyvault SDK also offers `SKYFLOW_ID`. |
| `value` | `string` | Base64 content, a skyflow id, or a presigned URL, per `dataSource`. |
| `file` | `File` | In-memory `File`; read and base64-encoded when sent, `dataSource` set to `BASE64`. Requires Node.js v20+. |
| `filePath` | `string` | Path to a local file; same handling as `file`. |
| `dataFormat` | [`FileDataFormat`](#detect-enums) | File format. Inferred from the file name's extension when omitted for a local file. |
| `configurationId` | `string` | Id of a stored Detect configuration. Sending it together with `configuration` is rejected by the API. |
| `configuration` | [`DetectConfiguration`](#detectconfiguration) | Inline configuration. With neither this nor `configurationId` set, the server applies the vault's defaults. |
| `pollOptions` | [`PollOptions`](#polloptions) | Poll the run after submitting. Omit to submit only and return the run id. |
| `outputDirectory` | `string` | Where outputs are written on success. Requires `pollOptions` and a local file; setting it without `pollOptions` fails client-side validation. Defaults to the working directory. |

### `ReidentifyStringRequest`

`new ReidentifyStringRequest(text, fields?)` — passed to `detect().reidentifyString()`.

| Field | Type | Description |
|---|---|---|
| `text` | `string` | **Required.** The de-identified text to re-identify. |
| `redactionLevel` | [`RedactionLevel[]`](#redactionlevel) | Per-entity redaction rules. Without rules every token is replaced by its original value. |

### `ReidentifyFileRequest`

`new ReidentifyFileRequest(dataSource, value, fields?)` — passed to `detect().reidentifyFile()`. Synchronous: the re-identified file comes back in the response.

| Field | Type | Description |
|---|---|---|
| `dataSource` | [`ReidentifySourceType`](#detect-enums) | **Required.** Your SDK's enum: `BASE64` or `PRESIGNED_URL`. Re-identification does not accept a skyflow id as the source. |
| `value` | `string` | **Required.** Base64 content or a presigned URL, per `dataSource`. |
| `dataFormat` | [`FileDataFormat`](#detect-enums) | Limited to the formats that support `VAULT_TOKEN`: `TXT`, `CSV`, `JSON`, `JSONL`, `XML`, `DOCX`, `XLSX` or `PPTX`. |
| `redactionLevel` | [`RedactionLevel[]`](#redactionlevel) | Redaction rules. |

### `GetRunRequest`

`new GetRunRequest(runId)` — passed to `detect().getRun()`.

| Field | Type | Description |
|---|---|---|
| `runId` | `string` | **Required.** The run id returned by a prior `deidentifyFile` call. |

### `CheckGuardrailsRequest`

`new CheckGuardrailsRequest(text, fields?)` — passed to `detect().checkGuardrails()`.

| Field | Type | Description |
|---|---|---|
| `text` | `string` | **Required.** Text to screen. |
| `checkToxicity` | `boolean` | Whether to check for toxicity. Sent only when set. |
| `denyTopics` | `string[]` | Topics to deny. Sent only when set. |

### `DeidentifyStringResponse`

Returned by `detect().deidentifyString()`.

| Field | Type | Description |
|---|---|---|
| `processedText` | `string \| null` | The de-identified text with entity values replaced by tokens. |
| `entities` | [`DetectedEntity[]`](#detectedentity) | Detected entities, never `null`. |
| `metrics` | [`Metrics`](#metrics)` \| null` | Word and character counts. |

### `ReidentifyStringResponse`

Returned by `detect().reidentifyString()`.

| Field | Type | Description |
|---|---|---|
| `processedText` | `string \| null` | The re-identified text. |
| `metrics` | [`Metrics`](#metrics)` \| null` | Word and character counts. |

### `DeidentifyFileResponse`

Returned by `detect().deidentifyFile()`. Without `pollOptions` only `runId` is set.

| Field | Type | Description |
|---|---|---|
| `runId` | `string \| null` | Run id, always present once the run was submitted. |
| `status` | [`DetectRunStatus`](#detect-enums)` \| null` | Run status when polled, `null` when submit only. |
| `outputType` | [`DeidentifySourceType`](#detect-enums)` \| null` | The run's output type resolved onto your SDK's enum; `null` until the run completes or when the value is not one the SDK offers. |
| `output` | [`FileOutput[]`](#fileoutput) | Every output of the run, empty until complete, never `null`. |
| `metrics` | [`Metrics`](#metrics)` \| null` | Size, counts, pages, slides, duration. `null` until complete. |
| `message` | `string \| null` | Failure detail when the status is `FAILED`. |

### `ReidentifyFileResponse`

Returned by `detect().reidentifyFile()`.

| Field | Type | Description |
|---|---|---|
| `status` | [`DetectRunStatus`](#detect-enums) | Status of the re-identification. |
| `outputType` | [`ReidentifySourceType`](#detect-enums)` \| null` | The output type resolved onto your SDK's enum; `null` when the value is not one the SDK offers. |
| `output` | [`FileOutput[]`](#fileoutput) | Re-identified file outputs, never `null`. |
| `metrics` | [`Metrics`](#metrics)` \| null` | Size and counts. |

### `GetRunResponse`

Returned by `detect().getRun()`. Same fields as [`DeidentifyFileResponse`](#deidentifyfileresponse).

### `CheckGuardrailsResponse`

Returned by `detect().checkGuardrails()`.

| Field | Type | Description |
|---|---|---|
| `text` | `string \| null` | The screened text. |
| `validation` | [`GuardrailsValidation`](#detect-enums) | `PASSED` or `FAILED`; `UNKNOWN` for a value this SDK version does not know. |
| `toxic` | `boolean \| null` | Whether the text was judged toxic, `null` when the check did not run. |
| `deniedTopic` | `boolean \| null` | Whether a denied topic was found, `null` when no topics were supplied. |

### `DetectConfiguration`

Inline Detect policy for `deidentifyString` and `deidentifyFile`. A plain interface: write it as an object literal.

| Field | Type | Description |
|---|---|---|
| `name` | `string` | Configuration name. |
| `description` | `string` | Configuration description. |
| `detect` | [`Detect`](#detect) | What to detect and how to de-identify it. |
| `fileMapping` | [`FileMapping[]`](#filemapping) | Per-column handling for structured files. File inputs only. |
| `media` | [`Media`](#media) | Audio, document and image options for file calls. File inputs only. |

### `Detect`

| Field | Type | Description |
|---|---|---|
| `entities` | [`Entity[]`](#entity) | Entities to detect, each with its own de-identification type. |
| `objectEntities` | [`ObjectEntity[]`](#objectentity) | Visual objects to detect in images. |
| `restrict` | `string[]` | Regexes to always treat as sensitive. |
| `skip` | `string[]` | Regexes to never treat as sensitive. |
| `customTypes` | [`CustomType[]`](#customtype) | Regex-defined entity types. |
| `returnEntities` | `ReturnEntitiesType` | Whether raw values come back in the response. Server default `EXCLUDE_SENSITIVE_DATA`. |

### `Entity`

| Field | Type | Description |
|---|---|---|
| `entityType` | `EntityType` | Entity type. Server default `ALL`. |
| `deidentificationType` | `DeidentificationType` | How the value is replaced. Server default `ENTITY_UNIQUE_COUNTER`. |
| `destination` | `string` | For `VAULT_TOKEN`: where the value is stored. A `table.column` on skyvault vaults, a token group name on flowvault vaults. Must already exist. |
| `transformation` | [`Transformation`](#transformation-and-shiftdates) | Date shifting. |
| `includePrefix` | `IncludePrefix` | For `VAULT_TOKEN`: whether the entity label prefixes the token (`[NAME_<token>]`). Server default `YES`. `NO` returns the raw vault token, which cannot be re-identified. `INCLUDE_PREFIX_UNSPECIFIED` leaves the field unset. |
| `prefixOverride` | `string` | For `VAULT_TOKEN`: replaces the entity-type prefix, for example `NAAM` gives `[NAAM_<token>]`. Not valid with `includePrefix: NO`. |

### `Transformation` and `ShiftDates`

`{ shiftDates?: { minDays?: number; maxDays?: number } }`. Dates are shifted by a random amount within the range.

### `CustomType`

| Field | Type | Description |
|---|---|---|
| `label` | `string` | Becomes the entity type on the response and the default token prefix. |
| `match` | `string[]` | Regexes that define the type. |
| `deidentificationType` | `DeidentificationType` | How matches are replaced. Server default `ENTITY_UNIQUE_COUNTER`. |
| `destination` | `string` | For `VAULT_TOKEN`: where matches are stored. A `table.column` on skyvault vaults, a token group name on flowvault vaults. Required with `VAULT_TOKEN`. |
| `includePrefix` | `IncludePrefix` | For `VAULT_TOKEN`: whether the label prefixes the token. Server default `YES`. `NO` returns the raw vault token, which cannot be re-identified. |
| `prefixOverride` | `string` | For `VAULT_TOKEN`: replaces the label as the token prefix. Not valid with `includePrefix: NO`. |

### `ObjectEntity`

| Field | Type | Description |
|---|---|---|
| `entityType` | `ObjectEntityType` | `FACE`, `LICENSE_PLATE`, `LOGO`, `SIGNATURE` or `ALL`. |
| `deidentificationType` | `ObjectDeidentificationType` | `REDACT` or `UNREDACT`. |

### `FileMapping`

| Field | Description |
|---|---|
| `source` | Source column. |
| `destination` | Destination column. |
| `outputFileNameSuffix` | Suffix added to the output file name. |
| `entitiesDestination` | Column that receives the detected entities. |
| `objectEntitiesDestination` | Column that receives the detected object entities. |

### `Media`

`{ audio?: Audio; document?: Document; image?: Image }`.

| Interface | Fields |
|-------|-----------------|
| `Audio` | `outputProcessedAudio?: boolean`, `outputTranscription?: OutputTranscriptionType`, `bleep?: Bleep` |
| `Bleep` | `startPadding?: number`, `stopPadding?: number`, `frequency?: number`, `gain?: number` |
| `Document` | `pdf?: Pdf` |
| `Pdf` | `processingMode?: PdfProcessingMode`, `density?: number`, `maxResolution?: number` |
| `Image` | `outputProcessedImage?: boolean`, `outputOcrText?: boolean`, `maskingMethod?: MaskingMethod` |

### `PollOptions`

Opts `deidentifyFile` into submit-and-poll mode. The SDK polls with exponential backoff (1, 2, 4, 8, 16, then 32 seconds). The limits are exported as `POLL_OPTIONS`.

| Field | Default | Description |
|---|---|---|
| `waitTime` | `60` | Maximum total seconds to keep polling, 1 to 300. |
| `maxAttempts` | `23` | Maximum number of run lookups, 1 to 23. |

### `RedactionLevel`

Element of `redactionLevel` on `ReidentifyStringRequest` and `ReidentifyFileRequest`. Each SDK ships its own `RedactionLevel` with the pair its vault understands; the shared request models accept it through the `RedactionRule` contract in `skyflow-common`. Every field is optional on the API; the server rejects invalid combinations.

skyvault SDK (`skyflow-node`):

| Field | Type | Description |
|---|---|---|
| `entityName` | `EntityType` | Entity type the rule applies to. |
| `redactionType` | [`RedactionType`](#redactiontype) | `PLAIN_TEXT`, `MASKED` or `REDACTED`. The Detect API rejects `DEFAULT` here with HTTP 400. |

flowvault SDK (`skyflow-flowvault-node`):

| Field | Type | Description |
|---|---|---|
| `tokenGroupName` | `string` | Token group the rule applies to. |
| `redactionPattern` | `string` | Name of a redaction pattern configured in the vault. |

### `DetectedEntity`

Element of `DeidentifyStringResponse.entities`.

| Field | Type | Description |
|---|---|---|
| `token` | `string \| null` | The token that replaced the value, e.g. `NAME_1`. |
| `value` | `string \| null` | The original value; empty unless `returnEntities` is `ALL`. |
| `location` | [`EntityLocation`](#entitylocation)` \| null` | Offsets in the original and processed text. |
| `entityType` | `string \| null` | Entity type label, including custom type labels. |
| `entityScores` | `Record<string, number>` | Confidence scores per entity type. |

### `EntityLocation`

| Field | Type | Description |
|---|---|---|
| `startIndex` / `endIndex` | `number \| null` | Offsets into the original text. |
| `startIndexProcessed` / `endIndexProcessed` | `number \| null` | Offsets into the processed text. |

### `Metrics`

| Field | Type | Description |
|---|---|---|
| `size` | `number \| null` | Size in kilobytes. |
| `wordCount` | `number \| null` | Word count. |
| `characterCount` | `number \| null` | Character count. |
| `pages` | `number \| null` | Page count, documents only. |
| `slides` | `number \| null` | Slide count, presentations only. |
| `duration` | `number \| null` | Duration in seconds, audio only. |

### `FileOutput`

Element of `output` on the file responses.

| Field | Type | Description |
|---|---|---|
| `processedFile` | `string \| null` | Base64 content or a presigned URL, per the response's `outputType`. |
| `processedFileType` | `string \| null` | `REDACTED_FILE`, `ENTITIES`, `OBJECT_ENTITIES`, `REDACTED_TEXT`, and so on. |
| `processedFileExtension` | `FileDataFormat \| null` | Extension of the output. |

### Detect enums

All string enums whose values match the wire values.

| Enum | Values |
|------|--------|
| `EntityType` | the 70 entity types (`NAME`, `EMAIL_ADDRESS`, `SSN`, `CREDIT_CARD`, `DOB`, ...), plus `ALL` and `NONE` |
| `DeidentificationType` | `ENTITY_UNIQUE_COUNTER` _(server default)_, `ENTITY_ONLY`, `VAULT_TOKEN`, `MASK`, `UNKNOWN` |
| `IncludePrefix` | `YES` _(server default)_, `NO`, `INCLUDE_PREFIX_UNSPECIFIED` _(field omitted)_. `VAULT_TOKEN` only. |
| `DeidentifySourceType` | Per SDK: skyvault `BASE64`, `SKYFLOW_ID`, `PRESIGNED_URL`; flowvault `BASE64`, `PRESIGNED_URL`. Input source for `deidentifyFile`, and the `outputType` of `DeidentifyFileResponse` and `GetRunResponse`. |
| `ReidentifySourceType` | Per SDK, `BASE64`, `PRESIGNED_URL` on both. Input source for `reidentifyFile` and the `outputType` of `ReidentifyFileResponse`. |
| `FileDataFormat` | `BMP`, `CSV`, `DCM`, `DOC`, `DOCX`, `GIF`, `JPEG`, `JPG`, `JSON`, `JSONL`, `MP3`, `PDF`, `PNG`, `PPT`, `PPTX`, `TIF`, `TIFF`, `TXT`, `WAV`, `XLS`, `XLSX`, `XML`, `ZIP` |
| `DetectRunStatus` | `QUEUED`, `IN_PROGRESS`, `SUCCESS`, `FAILED`, `UNKNOWN`. `SUCCESS`, `FAILED` and `UNKNOWN` end polling. |
| `ReturnEntitiesType` | `EXCLUDE_SENSITIVE_DATA` _(server default)_, `ALL`, `NONE` |
| `MaskingMethod` | `NONE`, `BLUR`, `BLACKBOX` |
| `OutputTranscriptionType` | `NONE`, `TRANSCRIPTION`, `MEDICAL_TRANSCRIPTION`, `DIARIZED_TRANSCRIPTION`, `MEDICAL_DIARIZED_TRANSCRIPTION` |
| `PdfProcessingMode` | `NONE`, `OCR`, `TEXT_LAYER` |
| `ObjectEntityType` | `NONE`, `FACE`, `LICENSE_PLATE`, `LOGO`, `SIGNATURE`, `ALL` |
| `ObjectDeidentificationType` | `UNKNOWN`, `REDACT`, `UNREDACT` |
| `GuardrailsValidation` | `PASSED`, `FAILED`, `UNKNOWN` |

---

## Service account functions

All importable from `'skyflow-node'`. See [Authentication & authorization](../skyvault/README.md#authentication--authorization) for full usage of `generateBearerToken`, `generateBearerTokenFromCreds`, and `generateSignedDataTokens`.

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
