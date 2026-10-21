# Skyflow FlowVault Node SDK

The FlowVault (v2) Node.js SDK for Skyflow's data privacy vault — a unary, strongly-typed client
for the v2 vault data plane. With it you can securely insert, retrieve, update, delete, query,
detokenize, tokenize, and attach files to records in a Flow DB vault.

> This is a **separate product** from `skyflow-node` (the SkyVault SDK). Install exactly one:
> `npm i skyflow-flowvault-node` **or** `npm i skyflow-node`. A lower `flowvault` version number
> does not mean it is older — the two products version independently.

## Table of contents

- [Overview](#overview)
- [Install](#install)
- [Quickstart](#quickstart)
- [Authenticate](#authenticate)
- [Initialize the client](#initialize-the-client)
- [Vault operations](#vault-operations)
- [Custom request headers](#custom-request-headers)
- [Error handling](#error-handling)
- [Samples](#samples)
- [License](#license)

## Overview

- **Unary interfaces only.** Every method is a single request → single response; there are no bulk
  or async variants.
- **Unified responses.** Each response carries a single `records` list, with per-record `httpCode`,
  `error`, and `requestId`. Whole-call failures throw a `SkyflowError`.
- **Multi-vault.** One client can hold several vault configs; pick one per call with `vault(vaultId)`.

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
