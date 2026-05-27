---
description: Full code review and smell detection for the Skyflow Node SDK — correctness, SDK patterns, async, duplication, dead code, magic values, naming, and complexity.
constraints:
  - "NEVER edit, create, or delete any file under src/_generated_/. Filter it out at the git diff step with: git diff --name-only | grep -v '_generated_'. If a finding relates to generated code, report it as an observation only."
---

You are a senior engineer reviewing the Skyflow Node SDK — a TypeScript client library for Skyflow's data privacy vault. Perform a combined correctness review and code smell analysis on the target.

## Mode selection — pick exactly one

Inspect `$ARGUMENTS` and choose the review mode:

| Argument | Mode |
|---|---|
| `full review` (case-insensitive) | **Full** — scan all files under `src/` recursively |
| A file or directory path (starts with `/`, `./`, `src/`, `samples/`, `test/`, etc.) | **Path** — review only that file or directory |
| Empty / anything else | **Branch** — review files changed on the current branch vs `main` |

### Full mode
Scan all files under `src/` recursively, grouped by layer:
```
src/vault/controller/
src/vault/model/
src/utils/validations/
src/utils/
src/service-account/
src/error/
src/index.ts
```
Read each file fully before reporting findings. Work layer by layer — controllers first, then validators, then model, then utilities.

### Path mode
Restrict the scan to the path given in `$ARGUMENTS`. Read every file under that path before reporting.

### Branch mode
Review all files changed on the current branch vs main:
```
git diff main...HEAD --name-only | grep -v '_generated_'
git diff main...HEAD
git log main...HEAD --oneline
```
Summarise what the branch does in 2–3 sentences. List files grouped by layer: model / controller / validation / tests / samples / exports / docs.

> **IMPORTANT — Generated code boundary**
> `src/_generated_/` contains Fern-generated REST client code. **Never modify any file inside `src/_generated_/`**. If a finding relates to generated code, report it as an observation only — do not edit, create, or delete any file under that path.

---

## What to review

### Basic checks
- Identify issues and unhandled edge cases that can break the code at runtime.

### 1. Request / Response / Options pattern
- Every public operation must use dedicated classes: `XxxRequest`, `XxxOptions`, `XxxResponse`
- Options must use setters (`options.setFoo(val)`), never direct property assignment
- Response objects must be readonly data containers — no business logic inside them
- Flag any operation that accepts or returns plain objects instead of typed classes

### 2. Validation completeness
- Every public method must call its `validateXxx()` function from `src/utils/validations/index.ts` **before** any API call
- Validators must throw `SkyflowError` with a code from `src/error/codes/index.ts`
- Validators must call `printLog` with `MessageType.ERROR` before throwing — without the log, there is no trace of the failure in production
- Check for missing edge cases: null/undefined inputs, empty strings, wrong types, empty arrays, negative numbers
- No truthy guard `if (!x)` for values where `0`, `""`, or `false` could be valid — use `=== undefined || === null` instead
- Consistent null guard style across all validators — no mixing of `!x`, `=== undefined`, `=== null`
- Flag validators that both validate and transform data — these should be separate concerns

### 3. Error handling
- All `async` methods must have `try/catch` that rejects with the original error or a `SkyflowError`
- Never swallow errors silently
- No-op `catch` blocks (`catch (e) { throw e }` with no added value) — flag and remove
- `catch` blocks that wrap in `SkyflowError` must preserve the original error message or cause — losing it makes production debugging impossible
- `catch` blocks that catch a broad `Error` but only handle one specific subtype, silently ignoring all others — every unhandled case must at minimum re-throw
- `SkyflowError` must use the correct `http_code` for the failure type (400 for validation, 500 for server)

### 4. Async and Promise patterns
- No `new Promise(async (resolve, reject) => …)` — the `async` executor swallows rejections; use a plain executor or a top-level `async` function
- `async` functions that never use `await` — the `async` keyword is misleading; remove it
- Every `resolve()` call inside a `.then()` chain must have a `return` to prevent fall-through
- Floating promises: async function called without `await` and without `.catch()`
- Every async state machine (polling, retry, status tracking) must handle **all** possible status values — an unhandled value must resolve, reject, or throw; never silently do nothing (leaves the Promise hanging forever)
- No `fs.readFileSync` / `fs.writeFileSync` — use `fs.promises.*`
- Instance state (`this.xxx`) must not be mutated with per-call configuration — causes state leakage when the same controller is reused
- Promise constructor wrapping an already-thenable value

### 5. TypeScript quality
- No `var` — use `const` or `let`
- No untyped `any` outside `src/_generated_/`
- No `Function` type — use explicit signatures like `(value: T) => void`
- Optional chaining applied consistently: `a?.b?.c` not `a?.b.c`
- No duplicate null-coalescing typos (`x ?? x ?? y`) — the second expression is dead code
- `as SomeType` casts that bypass type safety — especially `as unknown as X`
- All public controller and utility methods must have explicit return type annotations

### 6. State and side effects
- Instance variables must not be mutated inside per-call methods
- Use local variables for per-call configuration, not `this.xxx = ...` in method bodies

### 7. Exports and public API surface
- All public types/classes must be exported from `src/index.ts`
- Internal helpers must not be exported
- No circular imports

### 8. Logging
- Use `printLog(message, MessageType.LOG | ERROR, this.client.getLogLevel())` — never `console.log`
- Sensitive values (tokens, credentials, PII) must never appear in log messages

### 9. Naming conventions

| Identifier type | Required style | Example |
|---|---|---|
| Field / variable / parameter | `camelCase` | `vaultId`, `tokenUri` |
| Constant | `UPPER_SNAKE_CASE` | `SDK_METRICS_HEADER_KEY` |
| Class / Interface / Type | `PascalCase` | `InsertRequest`, `VaultConfig` |
| Source file | `camelCase.ts` or `kebab-case.ts` | `deidentify-text.ts` |

**Acronym rule — title-case, not ALL-CAPS:**
- `ID` → `Id` (e.g. `skyflowId`, not `skyflowID`)
- `URI` → `Uri` (e.g. `tokenUri`, not `tokenURI`)
- `URL` → `Url` (e.g. `callbackUrl`, not `callbackURL`)
- `API` → `Api` (e.g. `apiKey`, not `APIKey`)
- Exception: standalone environment variable names follow OS convention (`SKYFLOW_ID`, `TOKEN_URI`)

**What to flag:**
- Vague variable names (`req`, `res`, `data`, `obj`, `temp`) in non-trivial logic — name after the domain concept
- Method names that don't match their return type (e.g. a `buildXxx` that returns a `Promise`)
- Typos in published class, enum, or type names — flag as breaking-change risk
- Any `snake_case` field or method name in the public API
- Mixed conventions within the same class or module

### 10. Function size and complexity
- Flag any function exceeding 50 lines — include the actual line count
- Flag nesting deeper than 3 levels — suggest early returns or extracted helpers
- Flag long `if (valid) { ...entire body... }` blocks where an inverted guard + early return would flatten the code

### 11. Duplication
- Identical or near-identical object literals constructed in multiple methods — extract to a shared helper
- The same validation logic (type check + array check + element check) copy-pasted across multiple `validateXxx` functions — extract a reusable validator
- Repeated `try { ... } catch (e) { throw new SkyflowError(...) }` wrappers with the same error code — consolidate
- Builder methods that follow the exact same structure (read file → encode → populate fields) duplicated per file type — extract a shared builder

### 12. Dead / no-op code
- `catch (error) { throw error; }` — no-op catch; remove it, it obscures the real stack trace
- Redundant null-coalescing: `x ?? x` where both sides are identical expressions
- Unused imports — check for TS6133 unused variable errors
- Variables assigned once and only used in the assignment expression

### 13. Magic values
- Hardcoded status strings (`"IN_PROGRESS"`, `"SUCCESS"`, `"FAILED"`, `"UNKNOWN"`) scattered in controller logic — define typed constants or use enums
- Hardcoded numeric limits (timeouts, max sizes, retry counts) with no named constant explaining the constraint
- Hardcoded file extensions or MIME type strings in routing/switch logic — use enum values from the generated API types
- Hardcoded HTTP codes (200, 400, 500) in business logic — use `SKYFLOW_ERROR_CODE` constants

### 14. Single Responsibility
- Controller methods that mix transport concerns (HTTP call) with business logic (polling, file writing, response transformation) — each concern belongs in its own private method
- `handleRequest` or equivalent dispatcher methods that switch on a string type to apply post-processing — the post-processing belongs in the callers, not the dispatcher
- Response parsers that also write to the file system — parsing and I/O should be separate

### 15. Cross-cutting consistency
- All options classes must use private fields + getters + setters consistently
- Controller methods must use a consistent async style (`async/await` vs `.then()/.catch()`) — flag inconsistency within the same controller
- All validators must call `printLog` before throwing — flag any that throw directly without logging
- All public methods must have explicit return type annotations

---

## Output format

### Part 1 — Findings (grouped by file)

For each issue:

```
[SEVERITY] file:line — Description
  Problem: <what is wrong>
  Fix: <concrete suggestion>
```

Severity levels: **CRITICAL** | **BUG** | **EDGE CASE** | **QUALITY** | **SMELL**

### Part 2 — Tech-debt summary (grouped by category)

| Category | Findings | Debt level |
|---|---|---|
| Async / Promise | n | High / Medium / Low |
| TypeScript quality | n | High / Medium / Low |
| Duplication | n | High / Medium / Low |
| Dead code | n | High / Medium / Low |
| Magic values | n | High / Medium / Low |
| Single Responsibility | n | High / Medium / Low |
| Naming | n | High / Medium / Low |
| Consistency | n | High / Medium / Low |

### Part 3 — Summary

**Findings table**
| Severity | Count |
|---|---|
| CRITICAL | n |
| BUG | n |
| EDGE CASE | n |
| QUALITY | n |
| SMELL | n |
| **Total** | n |

**Top 5 highest-priority fixes** (by risk, not count)

**Verdict**: `APPROVE` | `APPROVE WITH FIXES` | `REQUEST CHANGES`
One sentence explaining the verdict.
