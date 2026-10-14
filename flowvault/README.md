# Skyflow FlowVault Node SDK (`skyflow-flowvault-node`)

The FlowVault (v2) Node.js SDK for Skyflow's data privacy vault. It provides a unary,
strongly-typed contract over the v2 vault data plane.

> This is a separate product from `skyflow-node` (the SkyVault SDK). Install exactly one:
> `npm i skyflow-flowvault-node` **or** `npm i skyflow-node`. A lower `flowvault` version
> number does not mean it is older — the two products version independently.

## Install

```bash
npm install skyflow-flowvault-node
```

## Quickstart

```typescript
import { Skyflow, InsertRequest, InsertOptions, LogLevel } from 'skyflow-flowvault-node';

const client = new Skyflow({
  vaultConfigs: [{
    vaultId: 'your-vault-id',
    clusterId: 'your-cluster-id',
    credentials: { token: 'your-bearer-token' },
  }],
  logLevel: LogLevel.ERROR,
});

const req = new InsertRequest('cards', [
  { data: { card_number: '4111111111111111', cardholder_name: 'Jane Doe' } },
]);

const res = await client.vault('your-vault-id').insert(req);
console.log(res.records);
```

## Operations (all unary)

`insert` · `get` · `update` · `delete` · `query` · `detokenize` · `getTokens` ·
`uploadFiles` · `deleteFiles`.

Every response returns a single `records` list with per-record `httpCode` / `error` /
`requestId`; whole-call failures throw `SkyflowError`.

## Design & architecture

- Contract design doc: <https://skyflow.atlassian.net/wiki/spaces/SDK1/pages/3110338561>
- Monorepo split (`common` / `skyvault` / `flowvault`): see `docs/sdk-split-plan.md`.

## License

MIT
