# FlowVault Node samples

Runnable examples for the `skyflow-flowvault-node` SDK — one file per operation. See the
[flowvault README](../README.md) for the full SDK guide.

## Prerequisites

- Node.js 20+ (the `File` API used by `uploadFiles` requires v20+).
- `npm install skyflow-flowvault-node`
- A FlowVault vault and Skyflow credentials (a service-account `credentials.json`, an API key, or a
  bearer token).

## Configure

Each sample has placeholders near the top — replace them with your own values:

```typescript
const credentials: Credentials = { path: '<PATH_TO_YOUR_CREDENTIALS_JSON>' }; // or { apiKey } / { token } / { credentialsString }

const skyflowClient = new Skyflow({
  vaultConfigs: [{
    vaultId: '<YOUR_VAULT_ID>',
    clusterId: '<YOUR_CLUSTER_ID>',
    env: Env.PROD,
    credentials,
  }],
  logLevel: LogLevel.ERROR,
});
```

## Run

The samples are TypeScript. Run one with `ts-node` (or compile with `tsc` first):

```bash
npx ts-node flowvault/samples/vault-api/insert-records.ts
```

## Vault operations

| Sample | Demonstrates |
|---|---|
| [insert-records.ts](vault-api/insert-records.ts) | Insert records (request-level or per-record `table`; `upsert`) |
| [get-records.ts](vault-api/get-records.ts) | Retrieve records by Skyflow ID (single- and multi-table) |
| [update-record.ts](vault-api/update-record.ts) | Update a record by Skyflow ID |
| [delete-records.ts](vault-api/delete-records.ts) | Delete records by Skyflow ID or unique values |
| [detokenize-records.ts](vault-api/detokenize-records.ts) | Detokenize tokens |
| [query-records.ts](vault-api/query-records.ts) | Run a read-only SQL `SELECT` query |
| [get-tokens.ts](vault-api/get-tokens.ts) | Look up existing tokens for values (deterministic token groups) |
| [upload-files.ts](vault-api/upload-files.ts) | Upload files to file columns (`filePath` / `base64` / `file`) |
| [delete-files.ts](vault-api/delete-files.ts) | Delete files from file columns (by `skyflowId` or `uniqueValues`) |

## Custom headers & HTTP config

| Sample | Demonstrates |
|---|---|
| [custom-header-example.ts](vault-api/custom-header-example.ts) | Attach custom headers via `options.setRequestHeaders(...)` |
| [timeout-and-retry-config-example.ts](vault-api/timeout-and-retry-config-example.ts) | Per-vault `timeout` / `maxRetries` / `vaultUrl` config |

## Service account (token generation)

| Sample | Demonstrates |
|---|---|
| [token-generation-example.ts](service-account/token-generation-example.ts) | Bearer token from a credentials file path or a credentials string |
| [scoped-token-generation-example.ts](service-account/scoped-token-generation-example.ts) | Scoped tokens via `roleIds` |
| [signed-token-generation-example.ts](service-account/signed-token-generation-example.ts) | Signed data tokens (`generateSignedDataTokens`), string and object context |
