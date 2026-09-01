---
name: api-vs-sdk-parity
description: Generate or update an API-vs-SDK parity doc for a Skyflow SDK — the wire-level API contract (protobuf or OpenAPI/JSON Schema) vs the SDK's public request/response/option models. Defaults to this repo (Node/TypeScript); pass a git URL or local path in $ARGUMENTS to target a different Skyflow SDK (Java, Python, Go, ...) instead. Argument: $ARGUMENTS
constraints:
  - "Never edit, create, or delete any file under src/_generated_/, or anywhere inside a cloned/checked-out SDK repo — those are read-only sources, not output targets."
  - "Do not modify any source code in this pass — this skill only produces the doc."
  - "Never invent, guess, or recall a contract's field shape, or a target SDK's model shape, from memory — read the given path/URL or use exactly what was pasted."
---

You are producing a field-by-field parity doc between Skyflow's wire-level API contract and a Skyflow SDK's public models. Neither this repo nor a freshly cloned SDK repo is assumed to have a `.proto` or OpenAPI/Swagger file checked in — the contract must come from `$ARGUMENTS` (a path, if the caller has one locally, or pasted content) on essentially every run. Do not fall back to a contract file from a previous run sitting anywhere in the repo, and do not fabricate field shapes.

## Getting the contract

`$ARGUMENTS` may contain either:
- a path to a contract file (protobuf `.proto`, or OpenAPI/Swagger `.yaml`/`.yml`/`.json`) — relative to the repo root, or absolute, or
- the raw contract content itself, pasted in a fenced code block (` ```proto ... ``` `, ` ```yaml ... ``` `, or ` ```json ... ``` `).

If `$ARGUMENTS` has no contract path or pasted content, or names a path that doesn't exist, **stop and ask the user to share the contract** before doing anything else.

Once you have a real path, read it with the Read tool. If pasted inline, use that content directly. Note which contract style it is (protobuf `message`/`service` definitions, OpenAPI 3 `components.schemas`, or Swagger 2 `definitions`) — the vocabulary differs and step 1 below needs to know which to grep for.

## Getting the SDK to compare

`$ARGUMENTS` may also specify which SDK to compare the contract against. Distinguish this from a contract path/model-scope path by what it points at: a contract file has a `.proto`/`.yaml`/`.yml`/`.json` extension; a *model scope* path (see below) lives inside the current repo's own model tree; anything else that looks like a git remote (`https://github.com/...`, `git@...`, optionally with a `@<ref>` or "branch: <name>"/"tag: <name>" suffix) or a local filesystem path to a *different* repository root is the **target SDK location**.

- **No SDK location given** → default to this repo, checked out at the current working directory (Node/TypeScript SDK).
- **A local path to a different repo** → use it directly, read-only. Don't assume it's already up to date — note whatever `git log -1`/`git status` shows in the doc's header so staleness is visible, but don't `git pull` a checkout you don't own.
- **A git URL** → clone it yourself rather than asking the user to. Use a stable cache location outside both this repo and the SDK's own tree, e.g. `/tmp/skyflow-sdk-parity-clones/<repo-name>`, so repeat runs against the same SDK don't re-clone from scratch:
  - If that directory doesn't exist yet: `git clone --depth 1 [--branch <ref>] <url> <dir>`.
  - If it already exists as a git checkout: `git fetch --depth 1 origin <ref-or-default-branch> && git checkout FETCH_HEAD` (or a plain `git pull` on the default branch) to refresh it before reading — never diff against a stale clone from a previous run.
  - Treat this clone as read-only. Never write into it, and never run install/build steps in it — you only need to read source files.

Once you know the SDK's root, **identify its language and its model layer from what's actually there** — don't assume it mirrors this repo's `src/vault/model/request|response|options` layout, since that's a Node/TypeScript-specific convention:
- Look for the language first (file extensions present at the repo root / `src`-equivalent: `.ts`, `.java`, `.py`, `.go`, ...) — this decides what "an exported type" means (TypeScript `export interface`/`type`/`class`; Java a `public class`/`record` in a `model`/`dto`/`types`-ish package; Python a `class` in a `models`/`types` module, often a dataclass or Pydantic model; Go an exported `struct` in a `models`/`types` package).
- Look for directory names that suggest request/response/options (or the SDK's local terms for the same three concepts — e.g. Java/Go SDKs often fold "options" into request builders) — check any top-level `README`, and the package/module structure, rather than guessing from this repo's naming.
- If you can't confidently find a model layer after a real search, say so and ask the user where it lives in that SDK, instead of guessing.

Alternatively, `$ARGUMENTS` can specify the model location directly:
- a directory path containing the target language's model source files, or
- one or more labeled fenced code blocks containing the actual type definitions (any language), for comparing against a model source not checked out anywhere.

If `$ARGUMENTS` gives neither an SDK location nor a model path, default to this repo's own model source: `src/vault/model/`, which has three subdirectories —
- `src/vault/model/request/` — request bodies
- `src/vault/model/response/` — response bodies
- `src/vault/model/options/` — caller-facing option objects

Read all three (of whatever the target SDK's equivalent structure turns out to be) unless `$ARGUMENTS` scopes the run to one (e.g. "just responses", "just options for insert"). State whichever default or scope was used explicitly in the doc's header — including which SDK repo/ref was compared — so a future run against a narrower scope or a different SDK isn't silently assumed to mean the same thing.

To find out what the target SDK actually implements today (rather than assuming it matches a previous run or another language's SDK), find its equivalent of a controller/service layer (in this repo: `src/vault/controller/`, currently `vault`, `audit`, `binlookup`, `connections`, and `detect`) and cross-reference its operations against the model layer (e.g. `insert`, `update`, `get`, `delete`, `detokenize`, `tokenize`, `query`, `deidentify-text`, `reidentify-text`, `file-upload`, `deidentify-file`, `invoke`). Re-derive this list from the source on every run; the exact set of implemented operations changes over time and per SDK.

---

## Type-equivalence reference

Use this (extend it if a contract construct isn't listed, or the target SDK is in a language not listed) when deciding whether a field "matches" across the contract and the target language:

| Protobuf | OpenAPI / JSON Schema | TypeScript | Java | Python | Go |
|---|---|---|---|---|---|
| `string` / `StringValue` | `type: string` | `string` | `String` | `str` | `string` |
| `int32` / `Int32Value`, `int64` | `type: integer` | `number` | `Integer`/`int`, `Long`/`long` | `int` | `int32`/`int64` |
| `bool` / `BoolValue` | `type: boolean` | `boolean` | `Boolean`/`boolean` | `bool` | `bool` |
| `double` / `DoubleValue`, `float` | `type: number` | `number` | `Double`/`double` | `float` | `float64` |
| `repeated T` | `type: array`, `items: T` | `T[]` | `List<T>` | `List[T]` | `[]T` |
| `Struct` (used as a map) | `type: object`, `additionalProperties: T` | `Record<string, T>` | `Map<String, T>` | `Dict[str, T]` | `map[string]T` |
| optional/nullable marker | field absent from `required: [...]`, or `nullable: true` | `T \| undefined`, `T?`, an optional property (`field?:`) | `Optional<T>`, a `@Nullable` field, or absent from a builder's required setters | `Optional[T]`, `T \| None`, a field with a default | a pointer `*T`, or a zero-value default (harder to distinguish "absent" from "zero" — note this explicitly when it matters) |
| "default when absent" idiom | schema `default: <value>` | `?? <default>`, `\|\|= <default>`, a default parameter | a default in the builder/constructor, or a null-check with a fallback | a default parameter, or `.get(key, default)` | a zero-value default, or an explicit fallback after an `ok` check |

---

## Steps

1. From the contract, list every message/schema definition (`grep -n "^message "` for protobuf; look under `components.schemas` for OpenAPI 3, `definitions` for Swagger 2 — use offset/limit or grep rather than reading a large file in one shot). Identify which ones correspond to what the target SDK actually implements today, per the controller/model cross-reference above — a different run, a different scope, or a different SDK entirely may cover a different subset. Re-derive this mapping from what's actually present in the target source; never assume it matches what a prior run against another SDK found.
2. For each relevant contract message/schema, record its exact field names, its contract-native type, and which fields are required (protobuf's `required` list, or OpenAPI's `required: [...]` array — explicitly note "not required" if neither exists).
3. Read every file in the target model source director(ies) (or parse each pasted block). For each publicly-reachable type in the target language (TypeScript `export interface`/`type`/`class`; Java a `public class`/`record`; Python a `class` reachable from the package's public module; Go an exported `struct` — in every case, anything reachable from the SDK's public entry point, not an unexported/package-private helper type) that corresponds to one of the messages/schemas from step 1, record its exact field names, the target language's types, and optionality — plus any default value substituted when a wire key is absent (e.g. a field defaulting to `0`, `''`, `None`, or a zero value during parsing).
4. Build one field-by-field table per type: `Field | Contract | <Language> | Status`, with the SDK's actual language name in the header (e.g. `Java`, `Python`, `Go`) instead of a placeholder. A field "matches" when the name agrees after accounting for a documented wire-key rename (e.g. a `snake_case` wire key vs a `camelCase`/`PascalCase` property, per that language's naming convention), the types are equivalent per the reference table above, and optionality is consistent or the flip is clearly intentional.
5. Flag every mismatch and note WHY it might be intentional before assuming it's a bug:
   - A contract-required field that's optional/defaulted in the SDK is often deliberate defensive parsing (drop/default instead of throw on a malformed response) — say so.
   - A field present in the contract but never exposed by the SDK (e.g. a raw plaintext value the SDK deliberately withholds) may be a deliberate security choice — note it as intentional, don't flag it as missing, but say what confirms the intent (a comment, a design doc, a test) if you can find one.
   - A field on the SDK's model with no contract peer (e.g. a field added to carry client-side routing info) is a legitimate SDK-side addition, not a mismatch — say so explicitly.
   - Cross-check the contract's own inline examples against its own field descriptions — authors sometimes document a field one way and give an example using a different key. Flag any such internal inconsistency you find, since the SDK's parsing code can only pick one of the two.
   - When comparing a non-Node SDK, don't assume it shares a Node-SDK quirk (a rename, a dropped field, an enum gap) found in an earlier run against a different language — re-verify against that SDK's own source every time.
6. List client-side-only types with no contract peer separately (e.g. connection/vault configuration, not part of any wire response) — these are not parity gaps.
7. List contract messages/schemas/operations with no implementation at all in the target SDK as a scope note, not a parity gap.
8. Do not modify any source code in this pass, in this repo or in a cloned SDK repo — this skill only produces the doc.
9. Do not mention test coverage or missing tests anywhere in the doc — this skill compares the contract to SDK models only, not test coverage.

---

## Output

Default filename: `docs/api-vs-sdk-parity.md`, for a run against this repo with no scoping. Use a suffixed filename instead — `docs/api-vs-sdk-parity-<scope>.md` — whenever the run doesn't match that default, so different scopes/SDKs get their own doc rather than overwriting each other or the default Node doc:
- scoped to a subset of models in this repo (e.g. "just options") → `docs/api-vs-sdk-parity-options.md`-style scope tag.
- run against a different SDK entirely → tag with that SDK's language/name, e.g. `docs/api-vs-sdk-parity-java.md`, `docs/api-vs-sdk-parity-python.md`, `docs/api-vs-sdk-parity-go.md`. Derive the tag from the SDK's repo name/language, not from guesswork.

- If the target file doesn't exist, create it with a top-level heading, a one-line note on what contract source, contract style, and model path(s) were compared, which SDK repo and ref (branch/tag/commit) it came from when it isn't this repo, and the date, then one section per type.
- If it exists, replace only the sections for types covered by this run — leave unrelated sections untouched. Add new sections for types not previously covered.
- Every section is a markdown table — never a prose bullet list — even when a whole area is one side's fields vs the other's absence. A cell with nothing to report is literally "Absent" or "N/A", not an omitted row.
- End the doc with an "Open items worth a decision" list — anything a human needs to resolve (an ambiguous wire key, an unconfirmed intentional omission). If nothing is open, say so explicitly rather than omitting the section.

```
# API vs SDK Parity — Skyflow <Language> SDK

Compares <contract source, e.g. "pasted protobuf" / "openapi.yaml"> against <language> models in `<source path(s)>` (<SDK repo/ref, or "this repo" if local>). Generated <date>.

### <TypeName> ↔ `<ContractMessage/Schema>`
| Field | Contract | <Language> | Status |
|---|---|---|---|
| ... | ... | ... | ✅ match / ⚠️ <mismatch, with reasoning> / ℹ️ <intentional/SDK-only, with reasoning> |

### Client-side-only types (no contract peer)
| Type | Purpose |
|---|---|
| ... | ... |

### Unimplemented contract features (scope note, not a parity bug)
| Contract feature | Note |
|---|---|
| ... | ... |

---
## Open items worth a decision
<list, or "none identified">
```
