# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run build          # Compile TypeScript → lib/ (CommonJS, ES6 target)
npm test               # Run Jest with coverage
npm run lint           # prettier check + eslint (max-warnings 0)
npm run lint-fix       # Auto-fix formatting
npm run spellcheck     # cspell across ts/js/md
npm run contract-snapshot         # Regenerate API surface report
npm run contract-snapshot-verify  # Verify API surface hasn't changed (CI)
```

**Run a single test file:**
```bash
npx jest test/vault/insert.test.js
```

**Run tests matching a pattern:**
```bash
npx jest --testNamePattern="insert"
```

## Architecture

### Layer Overview

```
Skyflow (src/vault/skyflow/)         ← entry point, config manager
  └─ VaultClient (src/vault/client/) ← HTTP client, token lifecycle
       └─ Controllers               ← business logic
            ├─ VaultController      (vault CRUD + tokenize/detokenize)
            ├─ DetectController     (PII deidentify/reidentify, file ops)
            └─ ConnectionController (gateway invoke)
```

`src/_generated_/` contains Fern-generated REST clients (`Records`, `Tokens`, `Strings`, `Files`, `Query`). **Never edit manually.** `VaultClient.initAPI()` selects the right generated client per operation type.

### Public API Surface

`src/index.ts` is the single export file. Everything exposed to SDK consumers must be exported there.

**`Skyflow` class methods** (runtime config management):
- `addVaultConfig` / `updateVaultConfig` / `removeVaultConfig` / `getVaultConfig`
- `addConnectionConfig` / `updateConnectionConfig` / `removeConnectionConfig` / `getConnectionConfig`
- `vault(id?)` → `VaultController`
- `detect(vaultId?)` → `DetectController`
- `connection(id?)` → `ConnectionController`

**`VaultController` operations:** `insert`, `update`, `delete`, `get`, `uploadFile`, `query`, `detokenize`, `tokenize`

**`DetectController` operations:** `deidentifyText`, `reidentifyText`, `deidentifyFile`, `getDetectRun`

**`ConnectionController` operations:** `invoke`

### Request/Response/Options Pattern

Every operation uses three dedicated class types in `src/vault/model/`:
- `*Request` — input data (constructor args)
- `*Options` — behavioural flags (use setters: `options.setReturnTokens(true)`)
- `*Response` — readonly result container

Coverage is intentionally excluded for model classes (`src/.*/model/request`, `response`, `options`).

### Credential Resolution

Priority: individual vault/connection credentials > `skyflowCredentials` (common). Fallback: `SKYFLOW_CREDENTIALS` env var. Five types: `token`, `apiKey`, `path`, `credentialsString`, env var. See `src/vault/config/credentials/index.ts`.

Token expiry is handled automatically — `VaultClient` regenerates tokens and retries. Edge case: token expiring between validation and the HTTP call resolves on retry.

### Error Handling

`SkyflowError` (from `src/error/`) is the structured SDK error. Error codes live in `src/error/codes/`. Error message templates in `src/utils/logs/`. Always throw `SkyflowError` (never raw `Error`) from SDK internals.

### Validation

All public inputs validated in `src/utils/validations/index.ts` before any logic runs. When adding operations, add validation there, call it at method entry, throw `SkyflowError` with a code from `src/error/codes/`.

### Tests

- Files: `test/**/*.test.js` (JavaScript, not TypeScript — Babel transpiles them)
- Mock data: `test/mockData/`, credentials fixtures: `test/demo-credentials/`
- `jest.config.js` sets `testEnvironment: "node"` and excludes generated + model classes from coverage

### Adding a New Vault Operation

1. `src/vault/model/request/`, `response/`, `options/` — new classes
2. `src/vault/controller/vault/index.ts` — implement method
3. `src/utils/validations/index.ts` — add validation
4. `src/index.ts` — export all new classes
5. `test/vault/` — add test file
6. `samples/vault-api/` — add sample

## Skills & Commands

**Slash commands** (type `/command-name`):
- `/code-review` — code smell, patterns, async, complexity audit on current branch diff
- `/code-security` — credentials, injection, auth lifecycle, HTTP safety audit
- `/sdk-sample` — generate a sample file for a specific feature
- `/test` — full pipeline: type check, lint, build, tests, coverage

**When to use proactively:**
- Before any PR → `/code-review` + `/test`
- Auth/credential/HTTP changes → `/code-security`
- New feature needs a sample → `/sdk-sample`
- Never edit `src/_generated_/` — all commands filter it automatically

### Logging

```typescript
import { printLog, MessageType, LogLevel } from './utils';
printLog('message', MessageType.LOG, this.logLevel);
```

Default `LogLevel` is `ERROR`. Never hardcode log calls — always gate on the instance's `logLevel`.
