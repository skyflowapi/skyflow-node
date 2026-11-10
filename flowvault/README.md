# Skyflow FlowVault Node SDK

The FlowVault (v2) Node.js SDK for Skyflow's data privacy vault — a unary, strongly-typed client
for the v2 vault data plane. With it you can securely insert, retrieve, update, delete, query,
detokenize, tokenize, and attach files to records in a Flow DB vault, and de-identify and
re-identify sensitive data in text and files with Skyflow Detect.

> This is a **separate product** from `skyflow-node` (the [SkyVault SDK](../skyvault/README.md), for Privacy DB vaults). Install exactly one:
> `npm i skyflow-flowvault-node` **or** `npm i skyflow-node`. A lower `flowvault` version number
> does not mean it is older — the two products version independently.

## Table of contents

- [Overview](#overview)
- [Install](#install)
- [Quickstart](#quickstart)
- [Authenticate](#authenticate)
- [Initialize the client](#initialize-the-client)
- [Vault operations](#vault-operations)
- [Detect](#detect)
- [Custom request headers](#custom-request-headers)
- [Error handling](#error-handling)
- [Samples](#samples)
- [License](#license)

## Overview

- **Unary interfaces only.** Every method is a single request → single response; there are no bulk
  or async variants.
- **Unified responses.** Each response carries a single `records` list, with per-record `httpCode`,
  `error`, and `requestId`. Whole-call failures throw a `SkyflowError`.
- **Multi-vault.** One client can hold several vault configs; pick one per call with `vault(vaultId)`
  or `detect(vaultId)`.
- **Detect.** The same Detect API as the SkyVault SDK, scoped to a Flow DB vault — see
  [Detect](#detect).

## Install

```bash
npm install skyflow-flowvault-node
```

**Requirements:** Node.js 20+ (the `File` API used by `uploadFiles` requires v20+).

## Quickstart

```typescript
import { Skyflow, InsertRequest, Env, LogLevel, SkyflowError } from 'skyflow-flowvault-node';

const skyflowClient = new Skyflow({
  vaultConfigs: [{
    vaultId: 'your-vault-id',
    clusterId: 'your-cluster-id',   // from the vault URL: https://{clusterId}.vault.skyflowapis.com
    env: Env.PROD,                  // DEV, STAGE, SANDBOX, or PROD
    credentials: { token: 'your-bearer-token' },
  }],
  logLevel: LogLevel.ERROR,
});

try {
  const req = new InsertRequest('cards', [
    { data: { card_number: '4111111111111111', cardholder_name: 'Jane Doe' } },
  ]);
  const res = await skyflowClient.vault('your-vault-id').insert(req);
  console.log(res.records);
} catch (error) {
  if (error instanceof SkyflowError) console.error(error.error?.httpCode, error.message);
}
```

## Authenticate

### Credential types

Pass exactly one credential type in a vault config's `credentials`:

```typescript
// API key
const credentials = { apiKey: 'your-api-key' };

// Bearer token you generated yourself
const credentials = { token: 'your-bearer-token' };

// Service-account credentials file — the SDK generates and refreshes the token
const credentials = { path: '/path/to/credentials.json' };

// Service-account credentials as a JSON string
const credentials = { credentialsString: JSON.stringify(serviceAccountCreds) };
```

If no `credentials` are set on a vault config, the SDK reads the `SKYFLOW_CREDENTIALS` environment
variable.

### Generate tokens yourself

The service-account helpers are re-exported from this package:

```typescript
import {
  generateBearerToken,
  generateBearerTokenFromCreds,
  generateSignedDataTokens,
  isExpired,
} from 'skyflow-flowvault-node';

// From a credentials file path (reuse until it expires):
if (isExpired(bearerToken)) {
  const { accessToken } = await generateBearerToken('/path/to/credentials.json');
  bearerToken = accessToken;
}

// Scoped token (restrict to roles):
const { accessToken } = await generateBearerToken('/path/to/credentials.json', {
  roleIds: ['roleId1', 'roleId2'],
});
```

See [`samples/service-account/`](samples/service-account) for scoped and signed-token examples.

## Initialize the client

```typescript
import { Skyflow, Env, LogLevel } from 'skyflow-flowvault-node';

const skyflowClient = new Skyflow({
  vaultConfigs: [
    {
      vaultId: 'vault-id',       // required
      clusterId: 'cluster-id',   // required — from the vault URL
      env: Env.PROD,             // optional — DEV | STAGE | SANDBOX | PROD (default PROD)
      credentials: { token: 'bearer-token' }, // optional — falls back to SKYFLOW_CREDENTIALS
    },
  ],
  logLevel: LogLevel.ERROR,      // optional — DEBUG | INFO | WARN | ERROR (default) | OFF
});

const vault = skyflowClient.vault('vault-id'); // omit the id to use the first configured vault
```

## Vault operations

All nine operations are unary and return a single `records` list (query returns `fields`). The
snippets below are abbreviated — see [`samples/vault-api/`](samples/vault-api) for complete,
runnable files.

### Insert

```typescript
import { InsertRequest, InsertOptions } from 'skyflow-flowvault-node';

const req = new InsertRequest('cards', [
  { data: { card_number: '4111111111111111' } },
  // Per-record table + upsert — insert across tables in one call. When any record
  // sets its own upsert, the request-level upsert below is ignored:
  // { data: { email: 'jane@example.com' }, table: 'contacts',
  //   upsert: { updateType: 'UPDATE', uniqueColumns: ['email'] } },
]);

// Request-level upsert (applies to all records unless a record sets its own):
const options = new InsertOptions();
// options.setUpsert({ updateType: 'UPDATE', uniqueColumns: ['email'] });

const res = await vault.insert(req, options);
// res.records[i]: { tableName, skyflowId, tokens, data, hashedData, httpCode, error, requestId }
// tokens is keyed by column: Record<column, Token[]>, where Token is
// { token, tokenGroupName, path? } — same shape as the Java/Python SDKs.
```

### Get

```typescript
import { GetRequest, GetOptions } from 'skyflow-flowvault-node';

// single-table — table + ids, with optional columns / redactions / unique values / limit / offset
const req = new GetRequest('cards', ['skyflow-id-1', 'skyflow-id-2']);
const options = new GetOptions();
// options.setFields(['card_number']);
// options.setColumnRedactions([{ columnName: 'card_number', redaction: 'MASKED' }]);
// options.setUniqueValues([{ email: 'jane@example.com' }]);
const res = await vault.get(req, options);

// multi-table batch — each record carries its own table + lookup/column fields:
// const res = await vault.get(new GetRequest('', [], [
//   { tableName: 'cards', ids: ['skyflow-id-1'], columns: ['card_number'] },
//   { tableName: 'contacts', ids: [], uniqueValues: [{ email: 'jane@example.com' }] },
// ]));
```

### Update

```typescript
import { UpdateRequest } from 'skyflow-flowvault-node';

// updateType (optional, request-level): 'UPDATE' (merge columns) or 'REPLACE' (overwrite record).
const req = new UpdateRequest('cards', [
  { skyflowId: 'skyflow-id', data: { cardholder_name: 'Jane Doe' } },
], 'UPDATE');
const res = await vault.update(req);
```

### Delete

```typescript
import { DeleteRequest } from 'skyflow-flowvault-node';

const req = new DeleteRequest('cards', ['skyflow-id-1']);
// Or by unique values: new DeleteRequest('cards', [], [{ email: 'john@example.com' }]);
const res = await vault.delete(req);
```

### Query

```typescript
import { QueryRequest } from 'skyflow-flowvault-node';

// SELECT only; at most 25 rows per call — page with OFFSET.
const req = new QueryRequest("SELECT name, email FROM cards LIMIT 25");
const res = await vault.query(req);
// res.fields (rows), res.metadata.columns, res.requestId
```

### Detokenize

```typescript
import { DetokenizeRequest } from 'skyflow-flowvault-node';

const req = new DetokenizeRequest(['token-1', 'token-2']);
// Optional group redactions: new DetokenizeRequest(tokens, [{ tokenGroupName: 'g', redaction: 'PLAIN_TEXT' }]);
const res = await vault.detokenize(req);
```

### Get tokens

```typescript
import { GetTokensRequest } from 'skyflow-flowvault-node';

// Deterministic token groups only.
const req = new GetTokensRequest([{ value: 'john@example.com', tokenGroupName: 'group' }]);
const res = await vault.getTokens(req);
```

### Upload files

```typescript
import { UploadFilesRequest } from 'skyflow-flowvault-node';

// Each column takes exactly ONE of filePath / base64 (needs fileName) / file.
const req = new UploadFilesRequest([
  { tableName: 'onboarding', skyflowId: 'skyflow-id', columns: [{ column: 'resume', filePath: '/tmp/resume.pdf' }] },
]);
const res = await vault.uploadFiles(req);
// each column result: { column, fileName, uploadStatus: 'UPLOADED'|'FAILED'|'SKIPPED', error }
```

### Delete files

```typescript
import { DeleteFilesRequest } from 'skyflow-flowvault-node';

// Each record sets exactly ONE of skyflowId or uniqueValues.
const req = new DeleteFilesRequest([
  { tableName: 'onboarding', columns: ['resume'], skyflowId: 'skyflow-id' },
]);
const res = await vault.deleteFiles(req);
```

## Detect

Skyflow Detect finds and de-identifies sensitive data in strings and files (documents, spreadsheets, images and audio), re-identifies vault tokens on demand, and screens text against guardrails for toxicity and denied topics. The SDK exposes it through `DetectController`, returned by `skyflowClient.detect()` and `skyflowClient.detect(vaultId)`. Every request is scoped to that vault, and the controller honours the same credentials, [timeouts and retries](#timeouts-and-retries) as `vault()`.

Detect configurations are created in Studio or through the management API. The SDK does not create, update or delete them.

| Method | Request | Response | Description |
|--------|---------|----------|-------------|
| `deidentifyString(request)` | [`DeidentifyStringRequest`](../docs/api_reference.md#deidentifystringrequest) | [`DeidentifyStringResponse`](../docs/api_reference.md#deidentifystringresponse) | Detect and replace sensitive data in a string |
| `deidentifyFile(request)` | [`DeidentifyFileRequest`](../docs/api_reference.md#deidentifyfilerequest) | [`DeidentifyFileResponse`](../docs/api_reference.md#deidentifyfileresponse) | Submit a file for de-identification, optionally polling the run to completion |
| `reidentifyString(request)` | [`ReidentifyStringRequest`](../docs/api_reference.md#reidentifystringrequest) | [`ReidentifyStringResponse`](../docs/api_reference.md#reidentifystringresponse) | Replace tokens in a string with their original or redacted values |
| `reidentifyFile(request)` | [`ReidentifyFileRequest`](../docs/api_reference.md#reidentifyfilerequest) | [`ReidentifyFileResponse`](../docs/api_reference.md#reidentifyfileresponse) | Replace tokens in a file with their original or redacted values |
| `getRun(request)` | [`GetRunRequest`](../docs/api_reference.md#getrunrequest) | [`GetRunResponse`](../docs/api_reference.md#getrunresponse) | Retrieve the status and outputs of a Detect file run |
| `checkGuardrails(request)` | [`CheckGuardrailsRequest`](../docs/api_reference.md#checkguardrailsrequest) | [`CheckGuardrailsResponse`](../docs/api_reference.md#checkguardrailsresponse) | Screen text for toxicity and denied topics |

**Before you start**

- **Role.** The service account needs the Detect Invoker, Detect Manager or Vault Owner role on the vault. Re-identifying values stored as `VAULT_TOKEN` is governed like detokenization: the caller also needs a policy that grants the Detokenization action on the destination, unless it is a Vault Owner.
- **Configuration.** `configurationId` is the id of a Detect configuration created through the management API. The alternative is an inline `DetectConfiguration` passed as `configuration` (see [Detect configuration](#detect-configuration)). Both are optional: with neither set the SDK sends only the vault id and the run uses the vault's default Detect settings. Sending both is rejected by the API with HTTP 400.
- **Destination for vault tokens.** An entity de-identified with `VAULT_TOKEN` stores its value in the token group named by `destination`. That token group must already exist in the vault; Detect writes into it but does not create it.
- **Where the values come from.**
  - `<CONFIGURATION_ID>`: open the configuration in Studio under your vault's Detect settings and copy its id, or take the `id` returned when you create one through the management API.
  - `<TOKEN_GROUP_NAME>`: a token group defined in the vault schema (Studio: vault > **Schema**). Each token group names the tokenization settings that `VAULT_TOKEN` values are stored with.
  - `<REDACTION_PATTERN>`: a redaction pattern configured on the vault (Studio: vault > **Settings**), referenced by name in a `RedactionLevel`.
  - If you do not have a vault yet, start at [Try Skyflow](https://skyflow.com/try-skyflow); the [Skyflow docs](https://docs.skyflow.com) cover Studio, token groups and redaction patterns.
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
} from 'skyflow-flowvault-node';

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
        destination: '<TOKEN_GROUP_NAME>', // token group that stores the value
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
} from 'skyflow-flowvault-node';

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
> **`deidentifyFile` does not wait for the result unless you set `pollOptions`.** Without it the call resolves with only the run id: `status` is `null`, `output` is empty and nothing is written to disk. Code that reads the outputs straight after the call runs without error, and the missing files only show up downstream. Set `pollOptions` to wait for the run, or keep the run id and call [`getRun`](#get-run-getrunrequest).

- **Submit only** (default): one call, returns `runId`. `status` is `null` and nothing is written to disk. Retrieve the result later with [`getRun`](#get-run-getrunrequest).
- **Submit and poll**: set `pollOptions`. The SDK polls the run with exponential backoff (1, 2, 4, 8, 16, then 32 seconds between lookups) until it is `SUCCESS`, `FAILED` or `UNKNOWN`, or until `waitTime` (default 60 s, max 300) or `maxAttempts` (default 23, max 23) is used up. If the budget runs out the response carries the run id with `IN_PROGRESS` or `QUEUED` so you can resume with `getRun`.

The file is supplied in one of three ways: a `dataSource` plus `value` (`DeidentifySourceType.BASE64` content or a `DeidentifySourceType.PRESIGNED_URL`; flowvault vaults do not take a skyflow id as a source), a `file` (a web `File`, Node.js 20+), or a `filePath`. A local file is read, base64-encoded, and its `dataFormat` inferred from the extension. Supply exactly one of `value`, `file` or `filePath`. `configurationId` and `configuration` follow the same rules as for strings.

`dataFormat` accepts every `FileDataFormat`: `BMP`, `CSV`, `DCM`, `DOC`, `DOCX`, `GIF`, `JPEG`, `JPG`, `JSON`, `JSONL`, `MP3`, `PDF`, `PNG`, `PPT`, `PPTX`, `TIF`, `TIFF`, `TXT`, `WAV`, `XLS`, `XLSX`, `XML` and `ZIP`. The `VAULT_TOKEN` de-identification type is supported only for `TXT`, `CSV`, `JSON`, `JSONL`, `XML`, `DOCX`, `XLSX` and `PPTX`.

`outputDirectory` is meaningful only when polling. Setting it without `pollOptions` fails client-side validation before any request is sent.

```typescript
import { DeidentifyFileRequest, DeidentifyFileResponse, DetectRunStatus } from 'skyflow-flowvault-node';

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

Outputs are written only when polling reached `SUCCESS`, the request was built from a local file, and the run delivered them as base64. A request built from a `PRESIGNED_URL` has no local name to derive from, and presigned-URL outputs are not fetched, so in those cases read `output` and write the files yourself. Files are named `processed-<input name>.<extension>`, with the entities output as `processed-entities-<input name>.json`; `outputDirectory` is created if missing and defaults to the working directory. Writing outputs needs the Node.js file system and is not supported in Cloudflare Workers.

> [!TIP]
> See the full examples in the samples directory: [deidentify-file.ts](samples/detect-api/deidentify-file.ts) and [deidentify-file-async.ts](samples/detect-api/deidentify-file-async.ts)

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

### Re-identify a string: `.reidentifyString(request)`

Re-identification looks tokens up in the vault, so it applies to values that were de-identified with `VAULT_TOKEN`. Placeholders produced by `ENTITY_UNIQUE_COUNTER`, `ENTITY_ONLY` or `MASK` are not stored anywhere and cannot be re-identified.

`ReidentifyStringRequest` takes the tokenized text and an optional list of `RedactionLevel` rules. For flowvault vaults each rule targets a `tokenGroupName` and applies a named `redactionPattern` configured in the vault. Without rules every token is replaced by its original value.

The text to re-identify is the `processedText` of a de-identification that used `VAULT_TOKEN`. A vault token looks like `[NAME_QUo9AjT]`, not like the `[NAME_1]` counter placeholder, so the round trip looks like this:

```typescript
import {
  DeidentifyStringRequest,
  ReidentifyStringRequest,
  ReidentifyStringResponse,
  EntityType,
  DeidentificationType,
} from 'skyflow-flowvault-node';

// 1. De-identify with VAULT_TOKEN: each value is stored in its token group and replaced by its vault token.
const deidentified = await skyflowClient.detect().deidentifyString(
  new DeidentifyStringRequest('My name is John Doe and my email is johndoe@acme.com.', {
    configuration: {
      detect: {
        entities: [
          { entityType: EntityType.NAME, deidentificationType: DeidentificationType.VAULT_TOKEN, destination: '<TOKEN_GROUP_NAME>' },
          { entityType: EntityType.EMAIL_ADDRESS, deidentificationType: DeidentificationType.VAULT_TOKEN, destination: '<TOKEN_GROUP_NAME>' },
        ],
      },
    },
  }),
);
const tokenized = deidentified.processedText ?? '';
// My name is [NAME_QUo9AjT] and my email is [EMAIL_ADDRESS_x7Fp2Kd].

// 2. Re-identify: every vault token is replaced by its original value.
const original: ReidentifyStringResponse = await skyflowClient.detect().reidentifyString(
  new ReidentifyStringRequest(tokenized),
);
console.log(original.processedText);
// My name is John Doe and my email is johndoe@acme.com.

// 3. Or apply a redaction pattern to one token group.
const rendered = await skyflowClient.detect().reidentifyString(
  new ReidentifyStringRequest(tokenized, {
    redactionLevel: [{ tokenGroupName: '<TOKEN_GROUP_NAME>', redactionPattern: '<REDACTION_PATTERN>' }],
  }),
);
console.log(rendered.processedText);
// My name is J**n D*e and my email is johndoe@acme.com.
```

`ReidentifyStringResponse` carries `processedText` and `metrics`. As JSON:

```json
{
  "processedText": "My name is J**n D*e and my email is johndoe@acme.com.",
  "metrics": { "wordCount": 10, "characterCount": 53, "size": null, "pages": null, "slides": null, "duration": null }
}
```

`RedactionLevel` is the flowvault SDK's own type and has only `tokenGroupName` and `redactionPattern`; the `entityName` and `redactionType` rules of the skyvault SDK do not exist here. Both fields are optional on the API, so the SDK passes the list through as given and the server rejects invalid combinations.

> [!TIP]
> See the full example in the samples directory: [reidentify-string.ts](samples/detect-api/reidentify-string.ts)

### Re-identify a file: `.reidentifyFile(request)`

`reidentifyFile` is synchronous: the re-identified file comes back in the response, not through a run id. `ReidentifyFileRequest` takes a `dataSource` (`ReidentifySourceType.BASE64` or `PRESIGNED_URL`), the matching `value`, an optional `dataFormat` and the same optional `RedactionLevel` rules as `reidentifyString`. `dataFormat` is limited to the formats that support `VAULT_TOKEN`: `TXT`, `CSV`, `JSON`, `JSONL`, `XML`, `DOCX`, `XLSX` and `PPTX`.

```typescript
import * as fs from 'fs';
import { ReidentifyFileRequest, ReidentifySourceType, FileDataFormat, DetectRunStatus } from 'skyflow-flowvault-node';

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
import { GetRunRequest, GetRunResponse, DetectRunStatus, DeidentifySourceType } from 'skyflow-flowvault-node';

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
import { CheckGuardrailsRequest, GuardrailsValidation } from 'skyflow-flowvault-node';

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

All Detect methods throw `SkyflowError` as described in [Error handling](#error-handling); `error.httpCode`, `message` and `error.requestId` identify the failure, and the request id is what Skyflow support asks for. Client-side validation fails before any network call with HTTP code 400 and no request id. Server-side failures carry the API's message, for example a `checkGuardrails` call with neither `checkToxicity` nor `denyTopics`:

```typescript
import { CheckGuardrailsRequest, SkyflowError } from 'skyflow-flowvault-node';

try {
  await skyflowClient.detect().checkGuardrails(new CheckGuardrailsRequest(userPrompt));
} catch (err) {
  if (err instanceof SkyflowError) {
    console.error(`Error during checkGuardrails: [${err.error?.httpCode}] ${err.message} (requestId=${err.error?.requestId})`);
  }
}
```

```json
{
  "error": {
    "grpc_code": 3,
    "http_code": 400,
    "message": "Guardrails are not provided. Please provide 'check_toxicity' or 'deny_topics' in the request body.",
    "http_status": "Bad Request",
    "details": []
  }
}
```

A `deidentifyFile` run that was accepted but failed while processing does not throw: `status` is `FAILED` and `message` carries the detail.

## Custom request headers

The SDK supports a fixed set of custom headers, listed on the `CustomHeaderKey`
enum. Attach them per call by registering an interceptor on the `*Options`
object — it runs once per request and receives a `RequestContext`:

| `CustomHeaderKey`      | Header sent            |
| ---------------------- | ---------------------- |
| `SKYFLOW_ACCOUNT_ID`   | `x-skyflow-account-id` |
| `SKYFLOW_ACCOUNT_NAME` | `x-skyflow-account-name` |
| `REQUEST_ID_HEADER`    | `x-request-id`         |

```typescript
import { InsertOptions, CustomHeaderKey } from 'skyflow-flowvault-node';
import { randomUUID } from 'crypto';

const options = new InsertOptions();
options.setInterceptor((ctx) => {
  // ctx.operation names the call ('INSERT', 'GET', ...), so headers can vary per operation.
  ctx.addHeader(CustomHeaderKey.REQUEST_ID_HEADER, randomUUID());
});

await vault.insert(req, options);
```

Only the keys above are accepted; arbitrary header names are not supported.

## Timeouts and retries

Configure per-vault timeout and retry behaviour on the vault config:

```typescript
const skyflowClient = new Skyflow({
  vaultConfigs: [{
    vaultId: 'vault-id',
    clusterId: 'cluster-id',
    credentials: { token: 'bearer-token' },
    timeout: 30,        // overall per-call timeout in seconds (incl. retries). Default 60.
    maxRetries: 2,      // retry attempts after the first failure (408/429/5xx). Default off.
    vaultUrl: 'https://cluster-id.skyvault.skyflowapis.com', // optional — override the derived URL
  }],
});
```

Retries use exponential backoff with jitter. The connect/read/write timeouts and the backoff
delays are fixed in the SDK's request layer and are not individually configurable.

## Error handling

There are two layers:

- **Per-record** — an individual record can fail while the call succeeds. Each response record has
  `httpCode` and `error` (plus `requestId` when it failed). Inspect them per record.
- **Whole-call** — auth, networking, or request-shape failures throw a `SkyflowError`.

```typescript
import { SkyflowError } from 'skyflow-flowvault-node';

try {
  const res = await vault.insert(req);
  for (const record of res.records) {
    if (record.error != null) {
      console.error(`record failed (${record.httpCode}): ${record.error} [${record.requestId}]`);
    }
  }
} catch (error) {
  if (error instanceof SkyflowError) {
    console.error({
      httpCode: error.error?.httpCode,
      grpcCode: error.error?.grpcCode,
      httpStatus: error.error?.httpStatus,
      message: error.message,
      details: error.error?.details,
      requestId: error.error?.requestId,
    });
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Samples

Runnable, one-file-per-operation examples live in [`samples/`](samples) — see
[`samples/README.md`](samples/README.md).

## License

This SDK is licensed under the MIT License.
