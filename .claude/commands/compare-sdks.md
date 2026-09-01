---
name: compare-sdks
description: Compare feature coverage and request/response/option type structure across two or more Skyflow SDKs (Node, Java, Python, Go, ...). Unlike api-vs-sdk-parity (one SDK vs the wire contract), this compares SDKs against each other. Prompts the user for each SDK's git URL/path if not given in $ARGUMENTS. Argument: $ARGUMENTS
constraints:
  - "Never edit, create, or delete any file inside a cloned/checked-out SDK repo — those are read-only sources, not output targets."
  - "Do not modify any source code in this pass — this skill only produces the comparison doc."
  - "Never invent, guess, or recall an SDK's operations or model shape from memory — read the actual cloned/local source on every run."
---

You are producing a cross-SDK comparison: which operations each SDK exposes, and how each SDK's request/response/options types line up field-by-field against the others. This is a **SDK-vs-SDK** comparison, not SDK-vs-contract — if the user actually wants the wire contract (protobuf/OpenAPI) compared to a single SDK, use the `api-vs-sdk-parity` skill instead.

## Getting the SDKs to compare

`$ARGUMENTS` may list one or more SDK locations, each either:
- a git URL (`https://github.com/...`, `git@...`), optionally with `@<ref>` or "branch: <name>"/"tag: <name>", or
- a local filesystem path to an SDK repo checkout.

This repo (the Node/TypeScript SDK, at the current working directory) is **always included** as one participant by default — no need for the user to pass its own path. Everything in `$ARGUMENTS` is additional SDKs to compare it against.

**If `$ARGUMENTS` supplies fewer than one other SDK location** (i.e. nothing to compare this repo against), stop and use AskUserQuestion (or a direct question if AskUserQuestion isn't available) to ask the user for the git URL or local path of each additional SDK they want compared — you need at least two participants total (this repo + at least one more) to produce a comparison. Don't guess a URL or proceed with only this repo.

For each SDK location given:
- **Local path** → use it directly, read-only. Note whatever `git log -1`/`git status` shows in the doc header, but don't `git pull` a checkout you don't own.
- **Git URL** → clone it yourself into a stable cache location outside this repo, e.g. `/tmp/skyflow-sdk-compare-clones/<repo-name>`, so repeat runs don't re-clone from scratch:
  - New: `git clone --depth 1 [--branch <ref>] <url> <dir>`.
  - Already cloned: `git fetch --depth 1 origin <ref-or-default-branch> && git checkout FETCH_HEAD` before reading, so the comparison isn't run against a stale checkout.
  - Treat every clone as read-only — never write into it, never run install/build steps, you only need to read source.

For each participant (including this repo), identify its language and layers from what's actually there — don't assume every SDK mirrors this repo's `src/vault/controller` / `src/vault/model/{request,response,options}` layout:
- Language from file extensions at the repo root / `src`-equivalent (`.ts`, `.java`, `.py`, `.go`, ...).
- Its controller/service layer (where operations like insert/update/get/delete/detokenize/tokenize/query/deidentify-text/reidentify-text/file-upload/deidentify-file/invoke are implemented) — check `README`, package/module layout; don't assume it matches another SDK's naming.
- Its model layer (request/response/options types, or that language's fold of the same three concepts — e.g. request builders that also carry what Node calls "options").
- If a layer can't be confidently found after a real search, say so in the doc rather than guessing, and ask the user if it matters for the run.

---

## Type-equivalence reference

Use this (extend it if a target SDK is in a language not listed) to decide whether a field "matches" across languages — the point is structural equivalence, not identical spelling:

| Concept | TypeScript | Java | Python | Go |
|---|---|---|---|---|
| string | `string` | `String` | `str` | `string` |
| integer | `number` | `Integer`/`int`, `Long`/`long` | `int` | `int32`/`int64` |
| boolean | `boolean` | `Boolean`/`boolean` | `bool` | `bool` |
| float/double | `number` | `Double`/`double` | `float` | `float64` |
| array of T | `T[]` | `List<T>` | `List[T]` | `[]T` |
| map/dict of T | `Record<string, T>` | `Map<String, T>` | `Dict[str, T]` | `map[string]T` |
| optional/nullable | `T \| undefined`, `T?`, `field?:` | `Optional<T>`, `@Nullable`, absent from required setters | `Optional[T]`, `T \| None`, a default | a pointer `*T`, or a zero-value default (note explicitly when "absent" vs "zero" is ambiguous) |

A field name differing only by each language's own naming convention (`camelCase` in TS, `PascalCase`/`camelCase` in Java/Go, `snake_case` in Python) is a **match**, not a mismatch — flag naming only when it diverges from that SDK's own convention or clearly drops semantic meaning.

---

## Steps

1. **Build the feature matrix.** From each participant's controller/service layer, list every operation it implements (insert, update, get, delete, detokenize, tokenize, query, deidentify-text, reidentify-text, file-upload, deidentify-file, invoke, and any others actually present — re-derive this list from source, don't assume it matches a prior run). Normalize by the underlying wire operation, not by each SDK's exact method spelling (e.g. Python's `snake_case` method name and Node's `camelCase` one are the same operation). Produce one matrix: rows = operations, columns = each SDK (participant's language/name), cells = ✅ implemented / ❌ not implemented, with a note if an SDK exposes it under a notably different name or shape (e.g. folded into another method).

2. **Compare request/response/options structures per shared operation.** For every operation implemented by two or more participants, read each participant's actual request/response/options type(s) for that operation (or a language's equivalent fold of those concepts) and record exact field names, that language's type, and optionality/defaults.

3. **Build one field-by-field table per operation**, columns = `Field | <SDK 1 lang> | <SDK 2 lang> | ... | Status`. A field "matches" when it's present across participants with structurally-equivalent types (per the reference table) and consistent optionality, accounting for each language's own naming convention.

4. **Flag every mismatch and note why it might be intentional before assuming it's a bug:**
   - A field one SDK exposes as optional/defaulted where another treats it as required may be deliberate defensive parsing — say so.
   - A field present in one SDK's model with no peer in another may be a legitimate SDK-side addition (e.g. client-side routing info) rather than a gap — say so explicitly.
   - A newer SDK may simply not have caught up to a feature/field another SDK already has — note it as a currency gap, not a design divergence, if that's what the evidence suggests (e.g. changelog, version, recent commit history).
   - Don't assume a quirk found in one SDK pairing (a rename, a dropped field) generalizes to a third SDK — re-verify against that SDK's own source.
   - Every flagged mismatch feeds the differences summary table in Output (step 4a below) — capture operation, field, which SDK(s) diverge, and the one-line reasoning as you go, rather than re-deriving it from the per-operation tables afterward.

5. **Compare the service-account / credential-utility surface, every run, not just the vault/detect/connection controller operations.** Every SDK ships free functions or an equivalent object (e.g. `generateBearerToken`/`generate_bearer_token`/`GenerateBearerToken`/a `BearerToken` builder) for: generating a bearer token from a credentials file path, generating one from a credentials string, generating signed data tokens (same file-path/string split), and checking whether a token is expired (`isExpired`/`is_expired`/`IsExpired`/`Token.isExpired`). These live outside the controller layer (often a `service-account`/`serviceaccount`/`service_account` module or a shared/common package used by more than one SDK) — find them by grepping for "bearer" and "signed data token" rather than assuming a fixed path. Apply steps 2–4 to this surface exactly as to any operation: field-by-field tables for the options/parameters each function accepts (ctx, roles/roleIds, logLevel, a token-URI override, time-to-live, etc.) and for what each returns — pay particular attention to the **return shape**, since SDKs diverge here more than elsewhere (a named object/struct vs. a bare tuple vs. a single bare value with a field silently dropped is a real, well-precedented divergence to watch for, not a hypothetical one).

6. **Compare client construction and configuration, every run, not just as a client-side-only-types list.** This is the entry point every operation above depends on, and it is directly comparable across SDKs even though it isn't itself a wire operation. Cover, field-by-field, per participant:
   - The construction pattern itself (single config-object constructor vs. a chainable builder vs. functional options), and whether configs are typed classes/structs or untyped dicts/maps.
   - `VaultConfig`-equivalent: id, cluster id, environment (and its default when omitted — check whether it's a compile-time/library default or something that only surfaces as a runtime error on first call), credentials, and any SDK-only extras (e.g. a direct base-URL override that bypasses cluster id/env).
   - `ConnectionConfig`-equivalent: id, URL, credentials — and specifically whether credentials are required or optional at this level, since SDKs disagree here.
   - `Credentials`-equivalent: is it a discriminated union (type-system-enforced exactly-one-of) or a flat struct/dict relying on runtime validation for the same "exactly one of token/path/credentialsString/apiKey" rule; whether a token-URI override field exists; whether `roles`/`context` are present on every credential shape or only some.
   - Client accessors (`.vault()`/`.detect()`/`.connection()` or equivalents) and their **default-selection behavior when no id is passed and multiple configs are registered** — check whether the underlying data structure preserves insertion order (deterministic first-added) or not (e.g. an unordered map/dict in a language where iteration order isn't guaranteed, which is a real non-determinism bug to flag, not a style nit).
   - Config mutation methods (add/update/remove/get vault or connection config, update credentials, set/update log level) — note deprecated aliases and whether these methods are chainable (return the client) or not, per SDK.

7. List remaining client-side-only types with no peer in any other SDK separately (e.g. internal client registries, dead/unused placeholder code, stub types for unimplemented operations) — not a parity gap. Do not put `VaultConfig`/`ConnectionConfig`/`Credentials`/the construction pattern here now that step 6 covers them field-by-field.

8. Do not modify source code in this pass, in this repo or in any cloned SDK repo — this skill only produces the doc.

9. Do not mention test coverage anywhere in the doc — this skill compares operations and model shape only.

---

## Output

Default filename: `docs/sdk-comparison.md`. If the run is scoped (e.g. "just insert", "just responses") or repeated against a different set of SDKs than a prior run, use `docs/sdk-comparison-<scope-or-sdk-set>.md` instead, so different comparisons don't silently overwrite each other.

- If the target file doesn't exist, create it with a top-level heading, a one-line note listing every participant (repo/ref or "this repo", plus language), and the date, then the feature matrix, then the differences summary, then one section per compared operation, then the service-account section (step 5) and the client construction & configuration section (step 6), then remaining client-side-only types (step 7), then open items.
- If it exists, replace only the sections covered by this run — leave unrelated sections untouched; add new sections for operations/participants not previously covered.
- The service-account section (step 5) and the client construction & configuration section (step 6) are **not optional add-ons** — include them on every run against this skill, the same as any vault/detect/connection operation, even if the user's request only names specific vault operations; only skip them if the run is explicitly scoped to exclude them (e.g. "just compare insert").
- **Every section — with no exception — is a markdown table, never prose or a bullet list.** This applies to the feature matrix, the differences summary, every per-operation request/response/options section, the service-account and client-construction sections, the client-side-only-types list, and the closing open-items list (as a `| # | Item |` table). If you catch yourself about to write a sentence describing a difference, stop and put it in a table row instead. A cell with nothing to report is literally "Absent" or "N/A", not an omitted row.
- The **differences summary** table is the primary deliverable readers scan first: one row per divergence found anywhere in the run (a feature gap from step 1, a mismatch flagged in step 4, or a divergence found in the service-account or client-construction sections) — never restate rows where every participant simply matches. If a run finds zero divergences, keep the table with a single row stating that.

```
# SDK Comparison

Participants: <SDK 1 — repo/ref or "this repo", language>, <SDK 2 — repo/ref, language>, ... Generated <date>.

## Feature matrix

| Operation | <SDK 1> | <SDK 2> | ... | Notes |
|---|---|---|---|---|
| insert | ✅ | ✅ | ... | |
| ... | | | | |

## Differences summary

| # | Operation | Field | <SDK 1> | <SDK 2> | ... | Difference | Likely intentional? |
|---|---|---|---|---|---|---|---|
| 1 | insert | ... | ... | ... | ... | <one-line description of the divergence> | Yes/No/Unclear — <why> |
| ... | | | | | | | |

### `<Operation>` — Request
| Field | <SDK 1 lang> | <SDK 2 lang> | ... | Status |
|---|---|---|---|---|
| ... | ... | ... | ... | ✅ match / ⚠️ <mismatch, with reasoning> / ℹ️ <intentional/SDK-only, with reasoning> |

### `<Operation>` — Response
| Field | <SDK 1 lang> | <SDK 2 lang> | ... | Status |
|---|---|---|---|---|
| ... |

### `<Operation>` — Options
| Field | <SDK 1 lang> | <SDK 2 lang> | ... | Status |
|---|---|---|---|---|
| ... |

## Generate Bearer Token (service-account credential utility)
| Field | <SDK 1 lang> | <SDK 2 lang> | ... | Status |
|---|---|---|---|---|
| ... | ... | ... | ... | ✅ match / ⚠️ <mismatch> / ℹ️ <intentional/SDK-only> |

## Generate Signed Data Tokens (service-account credential utility)
| Field | <SDK 1 lang> | <SDK 2 lang> | ... | Status |
|---|---|---|---|---|
| ... |

## Token Expiry Check (service-account credential utility)
| Field | <SDK 1 lang> | <SDK 2 lang> | ... | Status |
|---|---|---|---|---|
| ... |

## Client Construction & Configuration

### Construction pattern
| Aspect | <SDK 1> | <SDK 2> | ... |
|---|---|---|---|
| Entry point | ... | ... | ... |
| Config shape (typed vs. dict/map) | ... | ... | ... |
| Construction failure mode | ... | ... | ... |

### `VaultConfig`
| Field | <SDK 1 lang> | <SDK 2 lang> | ... | Status |
|---|---|---|---|---|
| ... |

### `ConnectionConfig`
| Field | <SDK 1 lang> | <SDK 2 lang> | ... | Status |
|---|---|---|---|---|
| ... |

### `Credentials`
| Field | <SDK 1 lang> | <SDK 2 lang> | ... | Status |
|---|---|---|---|---|
| ... |

### Client accessors & config mutation
| Aspect | <SDK 1> | <SDK 2> | ... |
|---|---|---|---|
| get a vault/detect/connection controller | ... | ... | ... |
| default selection with no id (multiple configs registered) | ... | ... | ... |
| add / update / remove / get config | ... | ... | ... |

### Client-side-only types (no peer in other SDKs)
| SDK | Type | Purpose |
|---|---|---|
| ... | ... | ... |

---
## Open items worth a decision
<list, or "none identified">
```
