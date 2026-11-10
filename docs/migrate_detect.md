# Migrate to the new Detect methods (skyflow-node 2.2)

This guide is for skyvault users of the Node.js SDK (`skyflow-node`) who call the Detect methods `deidentifyText`,
`reidentifyText`, `deidentifyFile` or `getDetectRun`. Those methods, their request, options and response classes
(`DeidentifyTextRequest`, `DeidentifyTextOptions`, `TokenFormat`, `Transformations`, `DeidentifyFileOptions`, `Bleep`,
`ReidentifyTextOptions`, `GetDetectRunRequest`, `DeidentifiedTextResponse`, `ReidentifyTextResponse`) and the enums
`DetectEntities`, `TokenType` and `DetectOutputTranscription` are removed in **skyflow-node 2.2.0** and replaced by the
Detect methods documented in the [skyvault README](../skyvault/README.md#detect). Projects that call the removed
methods stop compiling on upgrade, so pin the version explicitly and follow this guide rather than relying on a
version range.

```bash
npm install skyflow-node@2.2.0
```

Client creation and the `skyflowClient.detect()` / `skyflowClient.detect(vaultId)` accessors do not change.

> [!NOTE]
> Using a FlowVault vault? FlowVault Detect is new in `skyflow-flowvault-node` and has nothing to migrate: see
> [Detect in the flowvault README](../flowvault/README.md#detect).

> [!WARNING]
> **`deidentifyFile` keeps its name but no longer waits for the result by default.** It submits the file and
> resolves with only the run id; `status` is `null` and nothing is written to disk until you pass `pollOptions`.
> A quick port runs without error, and the missing outputs only show up downstream. See
> [Step 4](#step-4-deidentifyfile-new-request-and-response).

## Table of contents

- [What changed](#what-changed)
- [Method mapping](#method-mapping)
- [Step 1: move the detection policy into a configuration](#step-1-move-the-detection-policy-into-a-configuration)
- [Step 2: deidentifyText to deidentifyString](#step-2-deidentifytext-to-deidentifystring)
- [Step 3: reidentifyText to reidentifyString](#step-3-reidentifytext-to-reidentifystring)
- [Step 4: deidentifyFile, new request and response](#step-4-deidentifyfile-new-request-and-response)
- [Step 5: getDetectRun to getRun](#step-5-getdetectrun-to-getrun)
- [New methods and options](#new-methods-and-options)
- [Migration checklist](#migration-checklist)

## What changed

|  | Removed | Replacement |
|---|---|---|
| API | `/v1/detect/...`, one file endpoint per file type | `/v2/detect/...`, one file endpoint |
| Detection policy | an options object with setters on every call | a stored configuration id, or one inline `DetectConfiguration` object literal |
| Token type | `TokenFormat` with per-type lists | `deidentificationType` on each `Entity`; `VAULT_TOKEN` entities name their `table.column` |
| File input | `DeidentifyFileRequest(fileInput)` with a `File` or `Buffer` | `DeidentifyFileRequest({ filePath })`, `{ file }` (web `File`) or `{ dataSource, value }` |
| File polling | always, `waitTime` 1 to 64 s | opt in with `pollOptions`: `waitTime` 1 to 300 s and `maxAttempts` 1 to 23 |
| Responses | flat counts, first output only, `errors` array | `metrics`, an `output: FileOutput[]`, `location`, `DetectRunStatus` |
| New capabilities |  | re-identify a file, guardrails, custom types, object entities (faces, logos), file mapping, `SKYFLOW_ID` and presigned-URL inputs |

## Method mapping

| Removed | Replacement | Request | Response |
|---|---|---|---|
| `deidentifyText(request, options)` | `deidentifyString(request)` | `DeidentifyStringRequest` | `DeidentifyStringResponse` |
| `reidentifyText(request, options)` | `reidentifyString(request)` | `ReidentifyStringRequest` | `ReidentifyStringResponse` |
| `deidentifyFile(request, options)` | `deidentifyFile(request)`, same name, new types | `DeidentifyFileRequest` (new shape) | `DeidentifyFileResponse` (new shape) |
| `getDetectRun(request)` | `getRun(request)` | `GetRunRequest` | `GetRunResponse` |
| — | `reidentifyFile(request)` | `ReidentifyFileRequest` | `ReidentifyFileResponse` |
| — | `checkGuardrails(request)` | `CheckGuardrailsRequest` | `CheckGuardrailsResponse` |

The separate options argument is gone: everything is passed in the request. Every method is still reached through
`skyflowClient.detect()`, returns a promise of a response object and rejects with `SkyflowError`.

## Step 1: move the detection policy into a configuration

Previously every call carried the policy in an options object: `setEntities`, `setTokenFormat`, `setAllowRegexList`,
`setRestrictRegexList`, `setTransformations` and the media setters. Now the policy is a `DetectConfiguration`,
supplied in one of two ways:

- `configurationId`: a configuration created once in Studio or through the management API, then referenced by id.
  This is the recommended path.
- `configuration`: an inline `DetectConfiguration` object literal, for callers that need per-call control.

Both are optional and sent as given. With neither, the SDK sends a configuration holding only the vault id and the run
uses the vault's default Detect settings. Setting both is rejected by the API with HTTP 400. The SDK does not create,
update or delete stored configurations.

### Request field mapping

| Removed (`DeidentifyTextOptions` / `DeidentifyFileOptions`) | Replacement |
|---|---|
| `setEntities(DetectEntities[])` | `detect.entities`, one `Entity` per type with `entityType` |
| `tokenFormat.setDefault(TokenType)` | An `Entity` with `entityType: EntityType.ALL` and the chosen `deidentificationType`; it applies to every type without its own rule |
| `tokenFormat.setVaultToken([...])` | An `Entity` per type with `deidentificationType: VAULT_TOKEN` and `destination: '<TABLE>.<COLUMN>'` |
| `tokenFormat.setEntityUniqueCounter([...])` | An `Entity` per type with `deidentificationType: ENTITY_UNIQUE_COUNTER` |
| `tokenFormat.setEntityOnly([...])` | An `Entity` per type with `deidentificationType: ENTITY_ONLY`; `MASK` is new |
| `setAllowRegexList` | `detect.skip` |
| `setRestrictRegexList` | `detect.restrict` |
| `transformations.setShiftDays({ max, min, entities })` | `transformation: { shiftDates: { minDays, maxDays } }` on each listed `Entity`; the entity list is gone because the rule sits on the entity |
| `setPixelDensity`, `setMaxResolution` | `media.document.pdf.density`, `media.document.pdf.maxResolution` |
| `setOutputProcessedImage`, `setOutputOcrText`, `setMaskingMethod` | `media.image` with the same three names; `MaskingMethod` values are now `BLUR`, `BLACKBOX` and `NONE` |
| `setOutputProcessedAudio`, `setOutputTranscription(DetectOutputTranscription)` | `media.audio` with the same two names; the two cannot be combined, so set `outputProcessedAudio: false` when asking for a transcription. `PLAINTEXT_TRANSCRIPTION` has no equivalent; use `TRANSCRIPTION` |
| `setBleep(Bleep)` with setters | `media.audio.bleep: { startPadding, stopPadding, frequency, gain }` |
| `new DeidentifyFileRequest(fileInput)` | `new DeidentifyFileRequest({ filePath })`, `{ file }` or `{ dataSource, value }` |
| `setWaitTime(n)` | `pollOptions: { waitTime: n, maxAttempts: m }` |
| `setOutputDirectory` | `outputDirectory`, allowed only together with `pollOptions` |
| — | New: `customTypes`, `objectEntities`, `returnEntities`, `fileMapping`, per-entity `includePrefix` / `prefixOverride`, and `SKYFLOW_ID` / `PRESIGNED_URL` inputs |

### Enum renames

| Removed | Replacement |
|---|---|
| `DetectEntities` (`'name'`, `'email_address'`, ..., lower-case wire values) | `EntityType` (`NAME`, `EMAIL_ADDRESS`, ..., upper-case wire values, plus `NONE`) |
| `TokenType` (`VAULT_TOKEN`, `ENTITY_UNIQUE_COUNTER`, `ENTITY_ONLY`) | `DeidentificationType`, same names plus `MASK` and `UNKNOWN` |
| `DetectOutputTranscription` (five values) | `OutputTranscriptionType`: `NONE`, `TRANSCRIPTION`, `MEDICAL_TRANSCRIPTION`, `DIARIZED_TRANSCRIPTION`, `MEDICAL_DIARIZED_TRANSCRIPTION` |
| `MaskingMethod` (`Blackbox`, `Blur`) | `MaskingMethod` (`BLACKBOX`, `BLUR`, `NONE`) |
| `RedactionType` | Unchanged, still the `RedactionType` shared with `get` and `detokenize`. The Detect API does not accept `DEFAULT` in a `RedactionLevel`; use `PLAIN_TEXT`, `MASKED` or `REDACTED`. |

### Example: the same policy before and after

**Removed**

```typescript
import { DeidentifyTextRequest, DeidentifyTextOptions, TokenFormat, Transformations, DetectEntities, TokenType } from 'skyflow-node';

const request = new DeidentifyTextRequest('My name is John Doe, and my email is johndoe@acme.com.');
const options = new DeidentifyTextOptions();
options.setEntities([DetectEntities.NAME, DetectEntities.EMAIL_ADDRESS, DetectEntities.DOB]);
const tokenFormat = new TokenFormat();
tokenFormat.setDefault(TokenType.ENTITY_UNIQUE_COUNTER);
tokenFormat.setVaultToken([DetectEntities.NAME, DetectEntities.EMAIL_ADDRESS]);
options.setTokenFormat(tokenFormat);
options.setAllowRegexList(['Skyflow']);
options.setRestrictRegexList(['[0-9]{3}-[0-9]{2}-[0-9]{4}']);
const transformations = new Transformations();
transformations.setShiftDays({ max: 30, min: 10, entities: [DetectEntities.DOB] });
options.setTransformations(transformations);
```

**Replacement, inline configuration**

```typescript
import { DeidentifyStringRequest, DetectConfiguration, EntityType, DeidentificationType } from 'skyflow-node';

const configuration: DetectConfiguration = {
  detect: {
    entities: [
      { entityType: EntityType.NAME, deidentificationType: DeidentificationType.VAULT_TOKEN, destination: 'persons.name' },
      { entityType: EntityType.EMAIL_ADDRESS, deidentificationType: DeidentificationType.VAULT_TOKEN, destination: 'persons.email' },
      {
        entityType: EntityType.DOB,
        deidentificationType: DeidentificationType.ENTITY_UNIQUE_COUNTER,
        transformation: { shiftDates: { minDays: 10, maxDays: 30 } },
      },
      { entityType: EntityType.ALL, deidentificationType: DeidentificationType.ENTITY_UNIQUE_COUNTER },
    ],
    skip: ['Skyflow'],
    restrict: ['[0-9]{3}-[0-9]{2}-[0-9]{4}'],
  },
};

const request = new DeidentifyStringRequest('My name is John Doe, and my email is johndoe@acme.com.', { configuration });
```

**Replacement, stored configuration**

```typescript
const request = new DeidentifyStringRequest('My name is John Doe, and my email is johndoe@acme.com.', {
  configurationId: '<CONFIGURATION_ID>',
});
```

Two points differ in meaning, not only in name:

- The old options listed `entities` once and then assigned token types per list. Now the `deidentificationType` is
  stated on each entity, and the old `setDefault` becomes an `EntityType.ALL` entry placed last.
- The old `setVaultToken` list only named the entity types. Now each `VAULT_TOKEN` entity also needs a
  `destination` of the form `table.column`, the column with tokenization enabled that the value is stored in.

## Step 2: deidentifyText to deidentifyString

```typescript
// Removed
const before = await skyflowClient.detect().deidentifyText(request, options);
before.processedText;
for (const e of before.entities) {
  e.entity; e.token; e.value;
  e.textIndex?.start; e.textIndex?.end;
  e.processedIndex?.start; e.processedIndex?.end;
  e.scores;
}
before.wordCount; before.charCount; before.errors;

// Replacement
const after = await skyflowClient.detect().deidentifyString(request);
after.processedText;
for (const e of after.entities) {
  e.entityType; e.token; e.value;
  e.location?.startIndex; e.location?.endIndex;
  e.location?.startIndexProcessed; e.location?.endIndexProcessed;
  e.entityScores;
}
after.metrics?.wordCount; after.metrics?.characterCount;   // metrics is null when the server sends none
```

| Removed (`DeidentifiedTextResponse`) | Replacement (`DeidentifyStringResponse`) |
|---|---|
| `entities[].entity` | `entities[].entityType` (a string, so it can carry custom-type labels) |
| `entities[].textIndex.start` / `.end` | `entities[].location.startIndex` / `.endIndex` |
| `entities[].processedIndex.start` / `.end` | `entities[].location.startIndexProcessed` / `.endIndexProcessed` |
| `entities[].scores` | `entities[].entityScores` |
| `wordCount`, `charCount` as numbers | `metrics.wordCount`, `metrics.characterCount`, each `number | null` |
| `errors` | Removed. Failures reject the promise with `SkyflowError` |

`value` is populated only when the configuration sets `returnEntities` to `ALL`. The default `EXCLUDE_SENSITIVE_DATA`
returns an empty value.

## Step 3: reidentifyText to reidentifyString

Only vault tokens can be re-identified. Placeholders from `ENTITY_UNIQUE_COUNTER`, `ENTITY_ONLY` or `MASK` are not
stored, so they come back unchanged. The text to re-identify is the `processedText` of a `VAULT_TOKEN`
de-identification, in which a token looks like `[NAME_daa78453-9ca9-4ba5-a3ef-91934c11196c]`.

The old options took three lists of entity types. The new request takes a list of `RedactionLevel` rules, each naming
an entity type and a redaction type.

```typescript
// Removed
const options = new ReidentifyTextOptions();
options.setPlainTextEntities([DetectEntities.NAME]);
options.setMaskedEntities([DetectEntities.EMAIL_ADDRESS]);
options.setRedactedEntities([DetectEntities.SSN]);
const before = await skyflowClient.detect().reidentifyText(new ReidentifyTextRequest('<TEXT_WITH_VAULT_TOKENS>'), options);

// Replacement
const after = await skyflowClient.detect().reidentifyString(
  new ReidentifyStringRequest('<TEXT_WITH_VAULT_TOKENS>', {   // e.g. processedText of a deidentifyString call that used VAULT_TOKEN
    redactionLevel: [
      { entityName: EntityType.NAME, redactionType: RedactionType.PLAIN_TEXT },
      { entityName: EntityType.EMAIL_ADDRESS, redactionType: RedactionType.MASKED },
      { entityName: EntityType.SSN, redactionType: RedactionType.REDACTED },
    ],
  }),
);
```

| Removed list | Replacement rule |
|---|---|
| `setPlainTextEntities` | `{ entityName: x, redactionType: RedactionType.PLAIN_TEXT }` |
| `setMaskedEntities` | `{ entityName: x, redactionType: RedactionType.MASKED }` |
| `setRedactedEntities` | `{ entityName: x, redactionType: RedactionType.REDACTED }` |

`processedText` is unchanged and `metrics` is new. Without rules every token gets its original value. The skyvault
`RedactionLevel` has only `entityName` and `redactionType`; `tokenGroupName` and `redactionPattern` belong to the
flowvault SDK.

## Step 4: deidentifyFile, new request and response

The method keeps its name. The request and response classes keep their names but change shape. Three things change at
once: the file input, the policy, and the polling.

```typescript
// Removed: always polled, result in one response, processed copy written to outputDirectory
const options = new DeidentifyFileOptions();
options.setEntities([DetectEntities.ALL]);
const tokenFormat = new TokenFormat();
tokenFormat.setDefault(TokenType.ENTITY_UNIQUE_COUNTER);
options.setTokenFormat(tokenFormat);
options.setPixelDensity(200);
options.setMaxResolution(3000);
options.setOutputDirectory('/data/processed');
options.setWaitTime(64);
const before = await skyflowClient.detect().deidentifyFile(new DeidentifyFileRequest(fileInput), options);
before.status;          // string
before.file;            // File, first output only
before.entities;        // [{ file, extension }]
before.pageCount;

// Replacement: same behavior, opt in to polling
const after = await skyflowClient.detect().deidentifyFile(
  new DeidentifyFileRequest({
    filePath: '/data/intake/patient-notes.pdf',
    configurationId: '<CONFIGURATION_ID>',   // or configuration: { media: { document: { pdf: { density: 200, maxResolution: 3000 } } }, ... }
    pollOptions: { waitTime: 64 },
    outputDirectory: '/data/processed',
  }),
);
after.status;           // DetectRunStatus
for (const output of after.output) {       // every output, not only the first
  output.processedFile; output.processedFileType; output.processedFileExtension;
}
after.metrics?.pages;

switch (after.status) {
  case DetectRunStatus.SUCCESS:            // outputs are on disk under /data/processed
    break;
  case DetectRunStatus.IN_PROGRESS:
  case DetectRunStatus.QUEUED:             // the wait ran out: resume with getRun(after.runId)
    break;
  default:                                 // FAILED or UNKNOWN: after.message
}
```

Or submit only and retrieve later, which the old method could not do:

```typescript
const submitted = await skyflowClient.detect().deidentifyFile(
  new DeidentifyFileRequest({ filePath: '/data/intake/patient-notes.pdf', configurationId: '<CONFIGURATION_ID>' }),
);
const runId = submitted.runId;             // status is null, nothing written to disk
```

### File response mapping

| Removed (`DeidentifyFileResponse`, old shape) | Replacement (`DeidentifyFileResponse` and `GetRunResponse`) |
|---|---|
| `runId` | `runId` |
| `status` as a string | `status` as `DetectRunStatus` (`SUCCESS`, `FAILED`, `IN_PROGRESS`, `QUEUED`, `UNKNOWN`), `null` when not polled |
| `file`, `type`, `extension` for the first output | `output`, a `FileOutput[]` with `processedFile`, `processedFileType`, `processedFileExtension`; `outputType` says whether `processedFile` is base64 or a presigned URL |
| `entities` as `[{ file, extension }]` | The `FileOutput` whose `processedFileType` is `ENTITIES` (a JSON file) |
| `wordCount`, `charCount` | `metrics.wordCount`, `metrics.characterCount` |
| `sizeInKb`, `durationInSeconds` | `metrics.size`, `metrics.duration` |
| `pageCount`, `slideCount` | `metrics.pages`, `metrics.slides`; at most one of pages, slides and duration is set |
| `errors` | Removed. Failures reject with `SkyflowError`; a run that failed while processing has `status: FAILED` and `message` |
| — | `outputType`, `message` |

### Behavior differences to check

- **Polling is opt in.** Without `pollOptions` the call resolves with the run id immediately. Callers that relied on the
  result being complete must add `pollOptions`.
- **Budget limits changed.** `waitTime` defaults to 60 and tops out at 300, where the old method defaulted to 64 and
  capped at 64. `maxAttempts` is new, default and maximum 23.
- **The budget counts the pauses between lookups.** Like the old loop, the time spent inside each status call is not
  charged to `waitTime`, so wall-clock time can exceed it by the latency of the lookups. The final pause is trimmed so
  the pauses alone never exceed `waitTime`.
- **Output file names.** The redacted file is `processed-<input name>.<extension>` and the entities file is
  `processed-entities-<input name>.json`, written under `outputDirectory` (or the working directory when none is set)
  only for local file inputs that reached `SUCCESS` with base64 outputs.
- **All outputs are returned.** The old response surfaced only the first output. `output` holds the full list.
- **`UNKNOWN` ends polling.** The old method kept calling the run endpoint on any status it did not recognize. The new one
  stops and returns `UNKNOWN`; check for it and call `getRun` later.
- **Validation is stricter.** `waitTime` and `maxAttempts` out of range, `outputDirectory` without `pollOptions`, and
  supplying more than one of `file`, `filePath` and `value` reject before any network call.
- **Supported inputs widen.** `dataSource` can be `SKYFLOW_ID` for a file already in the vault, or `PRESIGNED_URL`, in
  addition to a local file. A `Buffer` is no longer accepted directly; wrap it in a web `File` or pass base64 as `value`.

## Step 5: getDetectRun to getRun

```typescript
// Removed
const run = await skyflowClient.detect().getDetectRun(new GetDetectRunRequest(runId));

// Replacement
import * as fs from 'fs';
const run = await skyflowClient.detect().getRun(new GetRunRequest(runId));
if (run.status === DetectRunStatus.SUCCESS) {
  for (const output of run.output) {
    if (run.outputType === DeidentifySourceType.BASE64) {
      const bytes = Buffer.from(output.processedFile ?? '', 'base64');
      fs.writeFileSync(`processed-${output.processedFileType}.${output.processedFileExtension?.toLowerCase()}`, bytes);
    }   // PRESIGNED_URL: download it yourself; do not log the URL
  }
} else if (run.status === DetectRunStatus.FAILED) {
  console.error('Run failed:', run.message);
}
```

The old call returned the file response type and wrote the processed file to disk. `getRun` returns `GetRunResponse`,
which has the same fields as the new `DeidentifyFileResponse` with `runId` echoed from the request, and writes nothing.
A blank run id is rejected before the call.

## New methods and options

- **`reidentifyFile(request)`**: synchronous re-identification of a file sent as base64 or a presigned URL, with the
  same `RedactionLevel` rules as strings. The output comes back in the response and the SDK writes nothing to disk.
  See [Re-identify a file](../skyvault/README.md#re-identify-a-file-reidentifyfilerequest).
- **`checkGuardrails(request)`**: toxicity and denied-topic screening. Toxicity is evaluated only when
  `checkToxicity: true` is set; with `denyTopics` alone the response reports `toxic: false` even for toxic text, and a
  request with neither is rejected with HTTP 400. See [Check guardrails](../skyvault/README.md#check-guardrails-checkguardrailsrequest).
- **`customTypes`** on `detect`: regex-defined entities with a label of your choosing, de-identified like any other
  entity.
- **`objectEntities`** on `detect`: `FACE`, `LICENSE_PLATE`, `LOGO` and `SIGNATURE` detection in images.
- **`returnEntities`** on `detect`: control whether raw values come back.
- **`fileMapping`** on `DetectConfiguration`: per-column handling for structured files.
- **`processingMode`** on `pdf`: `OCR` or `TEXT_LAYER`.
- **`includePrefix` / `prefixOverride`** on `Entity` and `CustomType`: control the prefix of `VAULT_TOKEN` tokens.
  `includePrefix: IncludePrefix.NO` returns raw tokens that cannot be re-identified.

## Migration checklist

1. Upgrade to `skyflow-node@2.2.0`.
2. Create a stored Detect configuration in Studio that reproduces your policy, or build it inline as a
   `DetectConfiguration` using the field mapping above.
3. Remove the imports of the deleted classes and enums (`DeidentifyTextRequest`, `DeidentifyTextOptions`, `TokenFormat`,
   `Transformations`, `DeidentifyFileOptions`, `Bleep`, `ReidentifyTextOptions`, `GetDetectRunRequest`, `DetectEntities`,
   `TokenType`, `DetectOutputTranscription`).
4. Rename the calls: `deidentifyText` to `deidentifyString`, `reidentifyText` to `reidentifyString`, `getDetectRun` to
   `getRun`. `deidentifyFile` keeps its name; switch its request to the object-literal form and drop the options argument.
5. Give every `VAULT_TOKEN` entity a `destination: '<TABLE>.<COLUMN>'`.
6. Add `pollOptions` to every file call that expects a completed result.
7. Replace reads of `file`, `entities` and the flat counts on file responses with a loop over `output` that branches on
   `outputType`, and reads of counts with `metrics`.
8. Switch re-identify calls from the three entity lists to `redactionLevel` rules, and do not use `RedactionType.DEFAULT`
   there.
9. Handle `DetectRunStatus.UNKNOWN` and a `null` status on file responses, and replace reads of `errors` with a
   `try`/`catch` of `SkyflowError`.
10. Print `error.httpCode`, `message` and `error.requestId` from `SkyflowError` in your error handling.
11. Run your integration tests against the detect vault and compare outputs with the previous version for the same inputs.
