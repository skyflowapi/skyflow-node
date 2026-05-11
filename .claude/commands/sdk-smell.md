---
description: Code smell and anti-pattern detection for the Skyflow Node SDK — async, duplication, dead code, magic values, naming, complexity.
constraints:
  - "NEVER edit, create, or delete any file under src/_generated_/. Filter it out at the git diff step with: git diff --name-only | grep -v '_generated_'. If a smell is found in generated code, report it as an observation only."
---

You are a TypeScript code quality engineer. Identify code smells, anti-patterns, and maintainability issues in the Skyflow Node SDK. Target: $ARGUMENTS

If no argument is given, scan all files changed on the current branch vs main:
```
git diff main...HEAD --name-only
```

> **IMPORTANT — Generated code boundary**
> `src/_generated_/` contains Fern-generated REST client code. **Never modify any file inside `src/_generated_/`**. If a smell is found in generated code, report it as an observation only — do not edit, create, or delete any file under that path.

Read each target file fully before reporting findings.

---

## Code smell categories

### 1. TypeScript anti-patterns
- `var` declarations — replace with `const` (preferred) or `let`
- `Function` type — replace with explicit signatures like `(value: T) => void`
- Unguarded optional chaining: `a?.b.c` where `.c` can still throw if `b` is nullish — must be `a?.b?.c`
- `as SomeType` casts that bypass type safety — especially `as unknown as X`
- `any` typed variables outside `src/_generated_/`
- Missing return type annotations on public controller and utility methods
- Redundant double null-coalescing like `x ?? x ?? y` (the second `x` is dead)

### 2. Async / Promise anti-patterns
- `new Promise(async (resolve, reject) => ...)` — the `async` executor swallows rejections; use a plain executor or a top-level `async` function
- `async` functions that never use `await` — the `async` keyword is misleading; remove it
- Missing `return` after a `resolve()` call inside a `.then()` chain — execution falls through and `resolve()` is called again
- Floating promises: async function called without `await` and without `.catch()`
- State machines / polling loops that handle some status values but silently ignore others (e.g. an `if/else if` chain with no final `else`) — unhandled status values leave Promises hanging forever
- Promise constructor wrapping an already-thenable value

### 3. Duplication
- Identical or near-identical object literals constructed in multiple methods — extract to a shared helper function
- The same validation logic (type check + array check + element check) copy-pasted across multiple `validateXxx` functions — extract a reusable validator
- Repeated `try { ... } catch (e) { throw new SkyflowError(...) }` wrappers with the same error code — consolidate
- Builder methods that follow the exact same structure (read file → encode → populate fields) duplicated per file type or per operation

### 4. Dead / no-op code
- `catch (error) { throw error; }` — no-op catch; remove it, it obscures the real stack trace
- Redundant null-coalescing: `x ?? x` where both sides are identical expressions
- `async` methods that only synchronously compute and return a value — no `await` anywhere
- Unused imports — run `npx tsc --noEmit` and check for TS6133 unused variable errors
- Variables assigned once and only used in the assignment expression

### 5. Magic values
- Hardcoded status strings (`"IN_PROGRESS"`, `"SUCCESS"`, `"FAILED"`, `"UNKNOWN"`) scattered in controller logic — define typed constants or use enums
- Hardcoded numeric limits (timeouts, max sizes, retry counts) with no named constant explaining the constraint
- Hardcoded file extensions or MIME type strings in routing/switch logic — use the enum values from the generated API types
- Hardcoded HTTP codes (200, 400, 500) in business logic — use the existing `SKYFLOW_ERROR_CODE` constants

### 6. Naming and clarity
- Vague variable names (`req`, `res`, `data`, `obj`, `temp`) in non-trivial logic — name after the domain concept
- Method names that don't match their return type (e.g. a method named `buildXxx` that returns a `Promise` implies async construction — is that intentional?)
- Typos in class, enum, or type names that have already been published — flag these as breaking-change risks
- Single-letter loop variables outside trivial `for` loops

**Node / TypeScript naming conventions — flag any violation:**

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
- Mixed conventions in the same class or module (one method uses `Id`, another uses `ID`) — flag as inconsistency
- Any `snake_case` field or method in the public API — belongs in Python SDKs, not Node/TS

### 7. Single Responsibility
- Controller methods that mix transport concerns (making the HTTP call) with business logic (polling, file writing, response transformation) — each concern belongs in its own private method
- `handleRequest` or equivalent dispatcher methods that switch on a string type to apply post-processing — the post-processing belongs in the callers, not the dispatcher
- Validation functions that both validate and transform data — these should be separate
- Response parsers that also write to the file system — parsing and I/O should be separate

### 8. Consistency across the SDK
- Options fields that exist on a shared options class but are only applied in one specific path — document or validate that the field is irrelevant for other paths, or move it to a more specific options class
- Some controller methods use `async/await` style while others use `.then().catch()` chains — pick one style and apply it consistently
- Some validators call `printLog` before throwing; others throw directly — should be consistent
- Some public methods return `Promise<XxxResponse>` while others return `void` or untyped — ensure all public methods have explicit return types
- Options classes that expose fields directly instead of using private fields + setters — every options class must use the same private field / getter / setter pattern to be consistent and validator-safe

### 9. Validator completeness
- Validators that throw `SkyflowError` without calling `printLog(…, MessageType.ERROR, logLevel)` first — without the log, there is no trace of the failure in production
- Validators that check `if (x)` instead of `if (x !== undefined && x !== null)` — the truthy check silently swallows `0`, `""`, and `false` as invalid, which may be legitimate values
- Inconsistent null guard style across validators (`!x` vs `=== undefined` vs `=== null`) — pick one and apply it everywhere so edge cases aren't missed in some paths but not others

### 10. Function size and complexity
- Any function exceeding 50 lines — flag it with its actual line count; a function that long almost always violates single responsibility and is difficult to test in isolation
- Nesting deeper than 3 levels (`if` inside `if` inside `if`) — deep nesting hides edge cases and makes control flow hard to follow; suggest extracting inner blocks into named helpers or using early returns
- Inverted guard missing (early return not used) — when a function starts with a long `if (valid) { ... entire body ... }` block instead of `if (!valid) return/throw`, the happy path is buried; flag and suggest inverting

### 11. Error handling completeness
- `catch` blocks that wrap the original error in a new `SkyflowError` without preserving the original message or cause — the original context is lost, making production debugging much harder; include the original error message in the `SkyflowError` details
- `catch` blocks that catch a broad `Error` but only handle one specific subtype, silently ignoring all others — every unhandled case should at minimum re-throw

---

## Output format

Group findings by category. For each smell:

```
[CATEGORY] file:line — Smell name
  Why it's a problem: <1 sentence>
  Suggested fix: <concrete action>
```

End with:
1. Top 5 highest-impact refactors (effort vs. benefit)
2. Estimated tech-debt score per category (High / Medium / Low)
