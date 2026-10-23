# Skyflow Node SDK — Split Architecture (`common` / `skyvault` / `flowvault`)

## Context

This repository historically shipped a single npm package, `skyflow-node`. To support a second
backend contract (**FlowVault**, v2) as its own installable SDK without forking the shared
plumbing, the repo is restructured into an **npm-workspaces monorepo** with three modules —
`common`, `skyvault`, `flowvault` — mirroring the Skyflow **Java** SDK split
(`common` / `skyvault` / `flowvault`).

Which SDK an application gets is decided **solely by which npm package it installs**
(`npm i skyflow-node` vs `npm i skyflow-flowvault-node`): no build flags, no runtime mode
switches, no environment configuration.

Design contract for the FlowVault surface:
<https://skyflow.atlassian.net/wiki/spaces/SDK1/pages/3110338561>

## Module layout

```
/ (workspace root — private, not published)
├── common/      → package "skyflow-common"        (private/internal; bundled into each published SDK)
├── skyvault/    → package "skyflow-node"           (2.x; the original SDK, backward compatible)
├── flowvault/   → package "skyflow-flowvault-node" (1.x; the new v2 SDK)
└── package.json  (workspaces: [common, skyvault, flowvault]; shared devDeps; build/test fan-out)
```

**Dependency direction:** `skyvault → common ← flowvault`. `common` depends on neither layer and
compiles & tests with neither present. A layer never imports the other layer.

### `common` (contract-agnostic core)
Everything that is not tied to a specific wire contract:
- `error/` — `SkyflowError`, error codes, message catalog.
- `utils/` — enums/consts, logging, SDK metrics, URL + auth helpers, JWT helpers.
- `service-account/` — bearer-token / signed-data-token lifecycle (wired to the shared **auth**
  generated client in `common/src/_generated_/`).
- `config/` — `Credentials` union, `VaultConfig`, `ConnectionConfig`.
- `validations/` — generic config/credential validators only.
- `types/` — pure, contract-agnostic types.
- `identity.ts` — the **mutable SDK identity** (`setSdkIdentity` / `getSdkIdentity`), default
  `skyflow-node`.
- `base/` — `BaseOptions` + `Base<Op>Request` / `Base<Op>Response` marker classes (shared
  extension points).
- `skyflow/base.ts` — **`BaseSkyflow`**, the shared facade base (vault-client registry, common
  credentials, log level, and the `addVaultConfig`/`updateVaultConfig`/`getVaultConfig`/
  `removeVaultConfig`/`setLogLevel`/`updateLogLevel`/`getLogLevel`/`updateSkyflowCredentials`/
  `getSkyflowCredentials` methods). Each layer extends it, implements `buildVaultEntry` to construct
  its own `VaultClient` + controllers, and adds its layer-specific accessors. Mirrors Java's
  `common` `BaseSkyflow`.

### `skyvault` (→ `skyflow-node`)
The original contract, unchanged behavior: vault data plane (insert/get/update/delete/
detokenize/tokenize/query/file-upload) + connections + detect. Its `Skyflow` **extends
`BaseSkyflow`** (adding the detect controller per vault + the connection registry/`connection()`);
its `VaultClient`, controllers and models import shared code from `skyflow-common`; its concrete
model classes extend the `common` `Base*` classes; the per-request validators live here. It keeps
its existing data-plane generated client under `skyvault/src/ _generated_`.

### `flowvault` (→ `skyflow-flowvault-node`)
The new v2 contract (unary only): insert/get/update/delete/query/detokenize/getTokens/uploadFiles/
deleteFiles. Its `Skyflow` **extends `BaseSkyflow`** (just `buildVaultEntry` + `vault()`); its
models/options extend the same `Base*` classes; it wires to its own generated client at
`flowvault/_generated_/rest/src` (`.records`/`.tokens`/`.files`/`.query`). No connections/detect.

## Consumer experience (one import per SDK)

Each layer **re-exports `common`'s public surface** from its own `index.ts`, so applications
install exactly one package and import everything from it — they never import `skyflow-common`
directly and never install both SDKs. `skyflow-common` is an **unpublished** workspace package
**bundled into each published tarball** at build time; `/** @internal */` + `stripInternal` keep
internal symbols out of the published `.d.ts`, and only the public entry is exposed via each
package's `"exports"` map.

## SDK identity (self-reporting)

`common` holds a mutable identity object. Each layer **stamps** it at client construction:
- `skyvault` → `{ name: "skyflow-node", version: <skyvault version> }` (also the default).
- `flowvault` → `setSdkIdentity({ name: "skyflow-flowvault-node", version: <flowvault version> })`.

Telemetry (`generateSDKMetrics` → `sky-metadata` header, `sdk_name_version`) reads the live
identity, so each SDK self-reports its own `name@version`.

## Independent versioning & tagging

Each published package has its own `version` and release tags:

| Package | Version line | Git tag that triggers its release |
| --- | --- | --- |
| `skyflow-node` | 2.x (unchanged from today) | **plain semver** `x.y.z` (and `x.y.z-beta.n`) |
| `skyflow-flowvault-node` | 1.x (new) | **prefixed** `flowvault/x.y.z` (and `flowvault/x.y.z-beta.n`) |

npm resolves packages by name from the registry (not from git tags), so the prefixed
`flowvault/*` tags are purely CI triggers — no distribution mirror repo is needed. The products
are distinguished solely by package name.

### Version-bump script
`scripts/bump_version.sh <product> <version> [sha]` where `<product>` is `skyflow-node` or
`skyflow-flowvault-node`; it bumps the right package's `package.json` `version` (and, for internal
builds, appends `-dev.<sha>`).

## Release flow (CI)

- **PR / push CI**: one command builds and tests **both** SDKs — the root `npm run build`
  (`tsc -b` across the workspace) + `npm test` (fans out to each package).
- **Public release**:
  - plain-semver tag → publish **`skyflow-node`** to npm only.
  - `flowvault/*` tag → publish **`skyflow-flowvault-node`** to npm only.
- **Beta**: `x.y.z-beta.n` → `skyflow-node@beta`; `flowvault/x.y.z-beta.n` →
  `skyflow-flowvault-node@beta`.
- **Internal (JFrog)**: branch-namespaced builds publish `-dev.<sha>` to the private registry,
  per product.

## Build & packaging

- **Dev/CI build** — TypeScript **project references**: the root `npm run build` (`tsc -b`) builds
  `common` first, then `skyvault` and `flowvault` against `common`'s declarations (each to its own
  `lib/`). `npm test` fans out across the three workspaces.
- **Publish build** — each publishable package has a **tsup** bundle (`npm run build:dist`) that
  **inlines `skyflow-common`** (`noExternal: ['skyflow-common']`) into a self-contained
  `dist/index.js` + bundled `dist/index.d.ts`, keeping real npm deps external. `skyflow-common` is a
  **devDependency** of each layer, so it never appears in the published `dependencies` (verified via
  `npm pack`). `stripInternal` keeps `/** @internal */` symbols out of the published `.d.ts`, and
  each package's `"exports"` map exposes only `.` (CJS `require` + `types`). Common's runtime deps
  (`jsonwebtoken`, `jwt-decode`) are declared in each layer's `dependencies` since common is inlined.
- **Verified**: `npm pack` → install the tarball into a fresh consumer → `require()` works for both
  SDKs; skyvault keeps all 74 public type names and the `v2.1.2` prefix, flowvault self-reports
  `v1.0.0`.

### Minor packaging note
The bundler materializes a handful of **type-only** exports (`Credentials`, `VaultConfig`,
`ConnectionConfig`, the credential subtypes, the service-account option types, `SkyflowRecordError`)
as inert `undefined` runtime keys on skyvault's CJS export object — because their source re-exports
use value syntax (`export { X }`) rather than `export type { X }`. This is harmless (a type has no
runtime value) and the full type surface is preserved in the `.d.ts`; marking those re-exports
`export type` in `common`'s barrel + the layer barrels would remove the extra keys.

## Generated code (maintainer-owned)

The OpenAPI spec is split and the client/transport code is generated **per module**:
`common/src/_generated_/` (auth), `skyvault/src/ _generated_` (v1 data plane),
`flowvault/_generated_/rest/src` (v2 data plane). Generated directories are treated as **provided
inputs** — not generated, moved, renamed, or hand-edited by the split. Where the hand-written
layer needs something the generated surface doesn't provide, it is **flagged** for the maintainer
to regenerate (see "Known flags" below).

## Known flags (for the maintainer)

1. **common auth generated `Client.ts` fails `strict`** — `common/src/_generated_/rest/Client.ts`
   (a management-plane `patchV2VaultsId` stub) calls `encodeURIComponent(vaultId)` on a possibly
   `undefined` `vaultId` (TS2345). It is unused by `common` (service-account uses the
   `authentication` resource directly), so it + `rest/index.ts` are `exclude`d in
   `common/tsconfig.json`. To compile them, the generated code needs a null-guard — a regeneration
   concern, not a hand-edit.
2. **Error-message version — resolved.** `error/codes` is now Proxy-wrapped so each code's `message`
   resolves lazily from the identity-aware `errorMessages` at throw time. Each layer stamps its
   identity from an in-source `version.ts` constant (kept in sync by the bump script), so error text
   self-reports the live version: skyvault → `v2.1.2`, flowvault → `v1.0.0`. Note the error-prefix
   *name* ("Skyflow Node SDK") is still a shared string (keeping skyvault backward-compatible with
   its `removeSDKVersion` regex); the per-product *name* is reported in telemetry (`sdk_name_version`).
3. **`src/ _generated_` leading space** — the legacy skyvault data-plane generated directory name
   contains a leading space; it is preserved (not renamed) and remains wired into jest/eslint/
   cspell/gitleaks patterns.

### FlowVault contract — reconciled against the Java & Python flowvault SDKs

The flowvault layer was first written to the frozen design doc, then **aligned to the Java and
Python flowvault SDKs** (the authoritative cross-language contract). Final decisions:

| Topic | Decision (aligned to Java/Python) |
| --- | --- |
| **Errors** | Throw a flat camelCase `SkyflowError` (`httpCode` from HTTP status, `requestId` from the `x-request-id` header, `grpcCode`/`httpStatus`/`message`/`details`). The wire body is snake_case under `error`; the SDK reads it and surfaces camelCase. No nested `error` key on the thrown object. Matches Java `SkyflowException`. |
| **BYOT `tokens` (insert/update)** | **Kept** — Java flowvault's `InsertRequestRecord`/`UpdateRequestRecord` carry `tokens`. The Node generated `InsertRecordData`/`UpdateRecordData` now model `tokens?` (regenerated), so the SDK forwards it typed (no cast). ✅ resolved. |
| **Detokenize response** | Read wire key `response[]`, expose as `records[]`. Matches Java/Python. |
| **Delete response** | **No `tableName`** on `DeleteResponseRecord` (only `skyflowId`/`httpCode`/`error`/`requestId`). Matches Java `DeleteResponseRecord` and Python `DeleteResponseRecord`. |
| **`uniqueValues` (get & delete)** | A **list of `{ column: value, … }` maps**, each sent as `{ data: {…} }`. (Not `{columnName, columnValues[]}`.) Matches Java `List<Map>` → `V1UniqueValue{data}` and Python `__to_unique_values`. |
| **deleteFiles column status** | **Parsed** from each column's response value (object → `.status`, else the value), not assumed `"DELETED"`. Mirrors Python `__file_column_status`. (`DeleteFilesResponseRecord` keeps `tableName` + `columns` — unlike record-delete.) |
| **insert/update `fields`** | Generated `RecordResponseObject` splits `data` + `tokens`; the SDK exposes one `fields = tokens ?? data`. (Retained merge choice.) |
| **Query** | flowvault **has** `query` (as in Python; Java flowvault has none). Response is `fields`/`records` + `metadata.columns` + call-level `requestId`; **no per-record `errors`** (the query API has no partial-error responses, so `errors` is always `null`). |

Open regeneration items (generated code untouched; flag for the maintainer):
- Both `common` and `flowvault` generated clients ship a top-level `Client.ts` (`patchV2VaultsId`)
  that fails `strict` (`encodeURIComponent(vaultId)` on `string | undefined`); unused by the
  hand-written layers (which compose resource clients directly), so it + its `index.ts` are
  `exclude`d in the relevant tsconfigs — a regeneration concern, not a hand-edit.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
