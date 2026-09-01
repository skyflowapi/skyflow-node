---
name: compare-sdks
description: Compare feature coverage and request/response/option type structure across two or more Skyflow SDKs (Node, Java, Python, Go, ...), regardless of each SDK's internal folder layout or design pattern. Unlike api-vs-sdk-parity (one SDK vs the wire contract), this compares SDKs against each other. Prompts the user for each SDK's git URL/path if not given in $ARGUMENTS. Argument: $ARGUMENTS
constraints:
  - "Never edit, create, or delete any file inside a cloned/checked-out SDK repo — those are read-only sources, not output targets."
  - "Do not modify any source code in this pass — this skill only produces the comparison doc."
  - "Never invent, guess, or recall an SDK's operations or model shape from memory — read the actual cloned/local source on every run."
  - "Never assume one participant's folder layout, naming convention, or design pattern (builder vs. plain object, typed vs. dict, controller-per-file vs. one big file) applies to any other participant — rediscover each one from its own source."
---

You are producing a cross-SDK comparison: which operations each SDK exposes, and how each SDK's request/response/options types line up field-by-field against the others. This is a **SDK-vs-SDK** comparison, not SDK-vs-contract — if the user actually wants the wire contract (protobuf/OpenAPI) compared to a single SDK, use the `api-vs-sdk-parity` skill instead.

This skill is **structure-agnostic by design**: it compares SDK *capabilities*, not SDK *code layouts*. Two participants can be organized completely differently — one file per operation vs. one giant file for everything, typed classes vs. untyped dicts, a builder pattern vs. a single constructor, a `controller`/`model` split vs. no such split at all — and the comparison must still work. Every step below is written to discover structure from source, never to assume it.

## Getting the SDKs to compare

`$ARGUMENTS` may list one or more SDK locations, each either:
- a git URL (`https://github.com/...`, `git@...`), optionally with `@<ref>` or "branch: <name>"/"tag: <name>", or
- a local filesystem path to an SDK repo checkout.

This repo (the Node/TypeScript SDK, at the current working directory) is **always included** as one participant by default — no need for the user to pass its own path. Everything in `$ARGUMENTS` is additional SDKs to compare it against. This repo's own layout is not a template the other participants are expected to match — it is just one more participant to be discovered like any other.

**If `$ARGUMENTS` supplies fewer than one other SDK location** (i.e. nothing to compare this repo against), stop and use AskUserQuestion (or a direct question if AskUserQuestion isn't available) to ask the user for the git URL or local path of each additional SDK they want compared — you need at least two participants total (this repo + at least one more) to produce a comparison. Don't guess a URL or proceed with only this repo.

For each SDK location given:
- **Local path** → use it directly, read-only. Note whatever `git log -1`/`git status` shows in the doc header, but don't `git pull` a checkout you don't own.
- **Git URL** → clone it yourself into a stable cache location outside this repo, e.g. `/tmp/skyflow-sdk-compare-clones/<repo-name>`, so repeat runs don't re-clone from scratch:
  - New: `git clone --depth 1 [--branch <ref>] <url> <dir>`.
  - Already cloned: `git fetch --depth 1 origin <ref-or-default-branch> && git checkout FETCH_HEAD` before reading, so the comparison isn't run against a stale checkout.
  - Treat every clone as read-only — never write into it, never run install/build steps, you only need to read source.

---

## Discovering each participant's structure

Do this fresh for **every** participant on **every** run, including this repo — never carry over a layout assumption from a prior run, from another participant, or from this doc's own examples. The examples below (`src/vault/controller`, "a `service-account` module", etc.) describe what one specific SDK happens to look like today; treat them as illustrations of the *concept* to find, not as paths to search for.

1. **Scan the folder structure first, before inferring anything else.** For every participant, get a real listing of what's actually in the repo before guessing at language, entry points, or layout: run `git ls-files` at the repo root if it's a git checkout (respects `.gitignore`, so generated/vendored noise is excluded automatically), or `find <repo-root> -maxdepth 4 -type f | sort` otherwise. Use that listing — not intuition — to spot: the source root(s) (`src`, `lib`, `pkg`, `internal`, or files straight at repo root), test/doc/sample/example directories (exclude these from the comparison — they aren't public SDK surface), and language/build hints (`package.json`, `pom.xml`/`build.gradle`, `pyproject.toml`/`setup.py`, `go.mod`, ...). Keep this listing (or its top 2-3 directory levels) per participant; it seeds every step below and is reported in the doc's "Repository structure" table so a reader can see what was actually scanned rather than assumed.

2. **Language.** Infer from file extensions at the repo root / primary source directory found in step 1 (`.ts`, `.java`, `.py`, `.go`, or anything else). If a participant is polyglot (bindings, generated clients in another language, sample apps), identify which language is the actual public SDK surface.

3. **Public entry point(s).** However this SDK expects a consumer to start — a single client class/object, several independent service objects, free functions, a builder — find it from the README/quickstart, the package's main export/`__init__`, or its public API index, not from a guess about where "the client" ought to live. Some SDKs have a `client`/`controller` layer; others don't separate concerns that way at all (e.g. one flat module of free functions). Both are valid; describe what's actually there.

4. **Operation surface.** From the entry point(s), find every operation the SDK actually exposes to a consumer — regardless of whether it's organized as one class per operation, one class for a whole domain (vault/detect/connections), or a flat set of top-level functions. Cross-reference against the known operation list in Step 1 of "Steps" below, but that list is a checklist to verify against, not a ceiling or a floor — an SDK can expose fewer of them (note as not-implemented) or things outside that list entirely (note as an SDK-specific addition, don't force it into an existing row).

5. **Model layer.** However request/response/options-equivalent data is represented — dedicated typed classes, builder objects, plain dicts/maps with string keys, fields folded onto one request object with no separate "options" concept at all — find the actual shape by reading the operation's implementation, not by assuming a `request`/`response`/`options` three-way split exists. If a participant folds two of those concepts together (very common — see the existing `docs/sdk-comparison.md` for examples), say so explicitly in that operation's section instead of forcing a synthetic split.

6. **If a layer or concept genuinely can't be found** after actually searching (not just failing to find it at an assumed path), say so in the doc rather than guessing, and ask the user if it matters for the run.

---

## Type-equivalence reference

This table seeds four common languages so you have a starting point; it is **not** an exhaustive or closed list. When a participant uses a different language, or a shape the table doesn't cover, derive the equivalent yourself using the same reasoning the table demonstrates — structural equivalence, not identical spelling — and add a row/column as needed rather than forcing the participant into one of the four listed columns.

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

1. **Build the feature matrix.** Using the operation surface you discovered per participant (see "Discovering each participant's structure" above), list every operation any participant implements — insert, update, get, delete, detokenize, tokenize, query, deidentify-text, reidentify-text, file-upload, deidentify-file, invoke, and any others actually present, whether or not they appear in this checklist. Normalize by the underlying wire operation, not by each SDK's exact method spelling or file location (e.g. Python's `snake_case` method name and Node's `camelCase` one are the same operation, even if they live in differently-organized files). Produce one matrix: rows = operations, columns = each SDK (participant's language/name), cells = ✅ implemented / ❌ not implemented, with a note if an SDK exposes it under a notably different name, shape, or code organization (e.g. folded into another method, or implemented as a free function instead of a class method).

2. **Compare request/response/options structures per shared operation.** For every operation implemented by two or more participants, read each participant's actual request/response/options type(s) for that operation — or that language's/SDK's own fold of those concepts, whatever shape it actually takes — and record exact field names, that language's type, and optionality/defaults.

3. **Build one field-by-field table per operation**, columns = `Field | <SDK 1 lang> | <SDK 2 lang> | ... | Status`. A field "matches" when it's present across participants with structurally-equivalent types (per the reference table, or your own derived equivalent) and consistent optionality, accounting for each language's own naming convention and each SDK's own code organization.

4. **Flag every mismatch and note why it might be intentional before assuming it's a bug:**
   - A field one SDK exposes as optional/defaulted where another treats it as required may be deliberate defensive parsing — say so.
   - A field present in one SDK's model with no peer in another may be a legitimate SDK-side addition (e.g. client-side routing info) rather than a gap — say so explicitly.
   - A newer SDK may simply not have caught up to a feature/field another SDK already has — note it as a currency gap, not a design divergence, if that's what the evidence suggests (e.g. changelog, version, recent commit history).
   - Don't assume a quirk found in one SDK pairing (a rename, a dropped field, a different code layout) generalizes to a third SDK — re-verify against that SDK's own source.
   - Every flagged mismatch feeds the differences summary table in the Output section below — capture operation, field, which SDK(s) diverge, and the one-line reasoning as you go, rather than re-deriving it from the per-operation tables afterward.

5. **Compare the service-account / credential-utility surface, every run, not just the vault/detect/connection controller operations.** Every SDK ships some mechanism — free functions, static methods, or a builder object — for: generating a bearer token from a credentials file path, generating one from a credentials string, generating signed data tokens (same file-path/string split), and checking whether a token is expired. These live outside whatever the main operation surface is, often (but not necessarily) in a `service-account`/`serviceaccount`/`service_account` module or a shared/common package used by more than one SDK — find them by searching for "bearer token" and "signed data token" functionality rather than assuming a fixed module name or path. Apply steps 2–4 to this surface exactly as to any operation: field-by-field tables for the options/parameters each function accepts (ctx, roles/roleIds, logLevel, a token-URI override, time-to-live, etc.) and for what each returns — pay particular attention to the **return shape**, since SDKs diverge here more than elsewhere (a named object/struct vs. a bare tuple vs. a single bare value with a field silently dropped is a real, well-precedented divergence to watch for, not a hypothetical one).

6. **Compare client construction and configuration, every run, not just as a client-side-only-types list.** This is the entry point every operation above depends on, and it is directly comparable across SDKs even though it isn't itself a wire operation, and even though the construction mechanism itself (constructor, builder, functional options, something else entirely) will likely differ per SDK. Cover, field-by-field, per participant:
   - The construction pattern itself (single config-object constructor vs. a chainable builder vs. functional options vs. anything else), and whether configs are typed classes/structs or untyped dicts/maps.
   - Vault-config-equivalent: id, cluster id, environment (and its default when omitted — check whether it's a compile-time/library default or something that only surfaces as a runtime error on first call), credentials, and any SDK-only extras (e.g. a direct base-URL override that bypasses cluster id/env).
   - Connection-config-equivalent: id, URL, credentials — and specifically whether credentials are required or optional at this level, since SDKs disagree here.
   - Credentials-equivalent: is it a discriminated union (type-system-enforced exactly-one-of) or a flat struct/dict relying on runtime validation for the same "exactly one of token/path/credentialsString/apiKey" rule; whether a token-URI override field exists; whether `roles`/`context` are present on every credential shape or only some.
   - Client accessors (`.vault()`/`.detect()`/`.connection()` or equivalents, however named) and their **default-selection behavior when no id is passed and multiple configs are registered** — check whether the underlying data structure preserves insertion order (deterministic first-added) or not (e.g. an unordered map/dict in a language where iteration order isn't guaranteed, which is a real non-determinism bug to flag, not a style nit).
   - Config mutation methods (add/update/remove/get vault or connection config, update credentials, set/update log level) — note deprecated aliases and whether these methods are chainable (return the client) or not, per SDK.

7. List remaining client-side-only types with no peer in any other SDK separately (e.g. internal client registries, dead/unused placeholder code, stub types for unimplemented operations) — not a parity gap. Do not put vault-config/connection-config/credentials/the construction pattern here now that step 6 covers them field-by-field.

8. Do not modify source code in this pass, in this repo or in any cloned SDK repo — this skill only produces the doc.

9. Do not mention test coverage anywhere in the doc — this skill compares operations and model shape only.

---

## Output

Default filename: `docs/sdk-comparison.md`. If the run is scoped (e.g. "just insert", "just responses") or repeated against a different set of SDKs than a prior run, use `docs/sdk-comparison-<scope-or-sdk-set>.md` instead, so different comparisons don't silently overwrite each other.

- If the target file doesn't exist, create it with a top-level heading, a one-line note listing every participant (repo/ref or "this repo", plus language), and the date, then the repository structure table (from step 1 of "Discovering each participant's structure"), then the feature matrix, then the differences summary, then one section per compared operation, then the service-account section (step 5) and the client construction & configuration section (step 6), then remaining client-side-only types (step 7), then open items.
- If it exists, replace only the sections covered by this run — leave unrelated sections untouched; add new sections for operations/participants not previously covered.
- The service-account section (step 5) and the client construction & configuration section (step 6) are **not optional add-ons** — include them on every run against this skill, the same as any vault/detect/connection operation, even if the user's request only names specific vault operations; only skip them if the run is explicitly scoped to exclude them (e.g. "just compare insert").
- **Every section — with no exception — is a markdown table, never prose or a bullet list.** This applies to the feature matrix, the differences summary, every per-operation request/response/options section, the service-account and client-construction sections, the client-side-only-types list, and the closing open-items list (as a `| # | Item |` table). If you catch yourself about to write a sentence describing a difference, stop and put it in a table row instead. A cell with nothing to report is literally "Absent" or "N/A", not an omitted row.
- The **differences summary** table is the primary deliverable readers scan first: one row per divergence found anywhere in the run (a feature gap from step 1, a mismatch flagged in step 4, or a divergence found in the service-account or client-construction sections) — never restate rows where every participant simply matches. If a run finds zero divergences, keep the table with a single row stating that.

```
# SDK Comparison

Participants: <SDK 1 — repo/ref or "this repo", language>, <SDK 2 — repo/ref, language>, ... Generated <date>.

## Repository structure

| Participant | Source root | Key directories (operations/model/service-account) | Test/doc/sample dirs excluded | Notes |
|---|---|---|---|---|
| ... | ... | ... | ... | ... |

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

### Vault config
| Field | <SDK 1 lang> | <SDK 2 lang> | ... | Status |
|---|---|---|---|---|
| ... |

### Connection config
| Field | <SDK 1 lang> | <SDK 2 lang> | ... | Status |
|---|---|---|---|---|
| ... |

### Credentials
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
