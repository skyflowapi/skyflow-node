---
name: pr-review
description: Full pull-request review for the Skyflow Node SDK. Covers code quality, SDK patterns, tests, docs, security, breaking-change detection, naming conventions, edge cases, and coverage.
constraints:
  - "NEVER edit, create, or delete any file under src/_generated_/. Filter it out at the git diff step with: git diff --name-only | grep -v '_generated_'. If a finding relates to generated code, report it as an observation only."
---

You are a senior engineer conducting a pull-request review for the Skyflow Node SDK — a TypeScript client library for Skyflow's data privacy vault.

Review the target PR or branch: $ARGUMENTS

If no argument is given, diff the current branch against main:
```
git diff main...HEAD
git diff main...HEAD --name-only
git log main...HEAD --oneline
```

> **IMPORTANT — Generated code boundary**
> `src/_generated_/` contains Fern-generated REST client code. **Never modify any file inside `src/_generated_/`**. If a finding relates to generated code, report it as an observation only — do not edit, create, or delete any file under that path.

---

## Step 1 — Understand the change

- Summarise what the PR does in 2–3 sentences.
- List every file changed, grouped by layer: model / controller / validation / tests / samples / exports / docs.
- Identify the primary change type: **new feature** | **bug fix** | **refactor** | **docs** | **dependency update**.

---

## Step 2 — Breaking-change detection

- [ ] No public class or method removed from `src/index.ts`
- [ ] No public method signature changed (parameter added/removed/reordered, return type changed)
- [ ] No Request / Options / Response class field renamed or removed
- [ ] No error code value changed (string/number identity)
- [ ] No `LogLevel` enum value changed
- [ ] If a breaking change exists: is it intentional and documented in `CHANGELOG.md` / `docs/migrate_to_v2.md`?

Flag any breaking change as **BREAKING** even if intentional.

---

## Step 3 — SDK pattern compliance

### Request / Response / Options
- [ ] Every new public operation uses `XxxRequest`, `XxxOptions`, `XxxResponse` classes
- [ ] Options use setters (`options.setFoo(val)`), never direct property assignment
- [ ] Response objects are readonly data containers — no business logic

### Validation
- [ ] Every public method calls `validateXxx()` from `src/utils/validations/index.ts` **before** any API call
- [ ] Validators throw `SkyflowError` with a code from `src/error/codes/index.ts`
- [ ] `printLog(…, MessageType.ERROR, logLevel)` called **before** throwing — never after
- [ ] Edge cases covered: null/undefined, empty string, empty array, wrong type, negative numbers
- [ ] No truthy guard `if (!x)` for values where `0`, `""`, or `false` could be valid — use `=== undefined || === null` instead
- [ ] Consistent null guard style across all validators in the changed files — no mixing of `!x`, `=== undefined`, `=== null`

### Error handling
- [ ] All `async` methods have `try/catch` that rejects with a `SkyflowError` or re-throws the original
- [ ] No silent error swallowing (`catch` block that does nothing or only logs)
- [ ] No no-op catch (`catch (e) { throw e }` with no added value)
- [ ] `catch` blocks that wrap in `SkyflowError` must preserve the original error message or cause — losing it makes production debugging impossible

### Async / Promise patterns
- [ ] No `new Promise(async (resolve, reject) => …)` anti-pattern
- [ ] Every `resolve()` inside a `.then()` chain is preceded by `return`
- [ ] All API status/state values are handled — no unhandled enum member that leaves a Promise hanging
- [ ] No `fs.readFileSync` / `fs.writeFileSync` — use `fs.promises.*`

### TypeScript quality
- [ ] No `var` — use `const` or `let`
- [ ] No untyped `any` outside `src/_generated_/`
- [ ] No `Function` type — use explicit signatures
- [ ] Optional chaining applied consistently: `a?.b?.c` not `a?.b.c`
- [ ] No duplicate null-coalescing typos (`x ?? x ?? y`)
- [ ] All public controller and utility methods have explicit return type annotations

### Function size and complexity
- [ ] No function exceeds 50 lines — flag with actual line count
- [ ] No nesting deeper than 3 levels — suggest early returns or extracted helpers
- [ ] Long `if (valid) { ...entire body... }` blocks replaced with inverted guard + early return

### Options class consistency
- [ ] Every options class uses private fields + public getters + public setters — no direct field exposure

### State / side effects
- [ ] Per-call configuration stored in local variables, not mutated on `this`
- [ ] No instance-level state set inside method bodies that leaks across calls

---

## Step 4 — Exports and public API surface

- [ ] New public types/classes exported from `src/index.ts`
- [ ] Internal helpers not accidentally exported
- [ ] No circular imports introduced

---

## Step 5 — Tests

- [ ] Test file exists at `test/vault/controller/<feature>.test.js`
- [ ] Happy path covered
- [ ] One test per new error code / validation branch
- [ ] API error response handled
- [ ] Async / polling / retry logic tested if applicable
- [ ] No tests removed without explanation
- [ ] `npm test` passes with no new failures
- [ ] **100% line coverage** on every new or changed file — flag any uncovered lines
- [ ] **Branch coverage ≥ 80%** on every new or changed file

**Edge case coverage check — for every new/changed source file:**
Read the source and test file together. Flag any of these scenarios that exist in the code but have no test:
- `null` / `undefined` passed to public methods
- Empty string, empty array, zero, negative number inputs
- All possible async status values (e.g. `IN_PROGRESS`, `SUCCESS`, `FAILED`, `UNKNOWN`) each exercised
- Error paths inside `catch` blocks that are never triggered
- Boundary conditions (exactly at a limit vs. one over)
- Same controller/client reused across two consecutive calls (state leakage)

List each gap as:
```
UNCOVERED EDGE CASE: <file>:<line> — <scenario missing>
```

---

## Step 6 — Sample code

- [ ] Sample exists in `samples/vault-api/`, `samples/detect-api/`, or `samples/service-account/`
- [ ] Uses only public exports from `'skyflow-node'`
- [ ] Follows `XxxRequest` / `XxxOptions` / `XxxResponse` pattern
- [ ] Shows `try/catch` with `SkyflowError` handling
- [ ] Type-checks cleanly (`tsc --noEmit`)

---

## Step 7 — Documentation & logging

- [ ] JSDoc on all new public-facing classes and methods
- [ ] No `console.log` — uses `printLog(…, MessageType, logLevel)`
- [ ] Sensitive values (tokens, credentials, PII) never appear in log messages
- [ ] Spellcheck passes: `npm run spellcheck`
- [ ] `CHANGELOG.md` updated if this is a user-visible change

---

## Step 8 — Security spot-check

- [ ] No credentials or tokens hard-coded or logged
- [ ] No new external HTTP calls outside the generated REST client
- [ ] No `eval`, `Function()`, or dynamic `require()` with user-controlled input
- [ ] Dependencies added to `package.json` are well-known, maintained packages — flag any unfamiliar ones

---

## Step 9 — Naming conventions (Node / TypeScript)

| Identifier type | Required style | Example |
|---|---|---|
| Field / variable / parameter | `camelCase` | `vaultId`, `tokenUri` |
| Constant | `UPPER_SNAKE_CASE` | `SDK_METRICS_HEADER_KEY` |
| Class / Interface / Type | `PascalCase` | `InsertRequest`, `VaultConfig` |
| Source file | `camelCase.ts` or `kebab-case.ts` | `deidentify-text.ts` |

**Acronym rule — title-case, not ALL-CAPS:**
- `ID` → `Id` (e.g. `skyflowId` not `skyflowID`)
- `URI` → `Uri` (e.g. `tokenUri` not `tokenURI`)
- `URL` → `Url` (e.g. `callbackUrl` not `callbackURL`)
- `API` → `Api` (e.g. `apiKey` not `APIKey`)
- Exception: standalone environment variable names stay `ALL_CAPS` (`SKYFLOW_ID`, `TOKEN_URI`)

- [ ] No ALL-CAPS acronyms in public field, method, parameter, or class names
- [ ] No `snake_case` fields or methods in the public API
- [ ] All classes, interfaces, and types are `PascalCase`
- [ ] All constants are `UPPER_SNAKE_CASE`
- [ ] No mixed conventions within the same class (one method `Id`, another `ID`)

---

## Output format

For each issue, output:

```
[SEVERITY] file:line — Short title
  Problem: <what is wrong>
  Fix: <concrete suggestion>
```

Severity levels: **BREAKING** | **CRITICAL** | **BUG** | **EDGE CASE** | **QUALITY** | **NITPICK**

End with:

**Summary table**
| Severity | Count |
|---|---|
| BREAKING | n |
| CRITICAL | n |
| BUG | n |
| EDGE CASE | n |
| QUALITY | n |
| NITPICK | n |
| Uncovered edge cases | n |

**Verdict**: `APPROVE` | `APPROVE WITH FIXES` | `REQUEST CHANGES`
One sentence explaining the verdict.
