---
description: Full quality pipeline for the Skyflow Node SDK — type check, lint, build, tests, coverage, and edge case analysis.
constraints:
  - "NEVER edit, create, or delete any file under src/_generated_/. Always filter generated files before passing any file list to lint or prettier: git diff --name-only | grep -E '\\.(ts|js)$' | grep -v '_generated_'. If analysis touches generated code, report it as an observation only."
---

Run the full Skyflow Node SDK quality pipeline and report results. Target (optional — specific test file or pattern): $ARGUMENTS

> **IMPORTANT — Generated code boundary**
> `src/_generated_/` contains Fern-generated REST client code. **Never modify any file inside `src/_generated_/`**. If analysis or test generation touches generated code, report it as an observation only — do not edit, create, or delete any file under that path.

Execute the following steps in order. Stop and report clearly if any step fails.

---

## Step 1 — TypeScript type check
```bash
npx tsc --noEmit
```
Report any type errors. These indicate broken contracts in the SDK's type system.

---

## Step 2 — Lint

Lint only the files that have changed, not the entire repo.

First, get the list of changed `.ts` / `.js` files:
```bash
git diff --name-only HEAD | grep -E '\.(ts|js)$'
```
If that returns nothing (e.g. all changes are staged or the target is a specific file from `$ARGUMENTS`), fall back to:
```bash
git diff --name-only --cached | grep -E '\.(ts|js)$'
```
If `$ARGUMENTS` is a file path, use that file directly.

Then run prettier and eslint only on those files:
```bash
npx prettier --check <changed files>
npx eslint <changed files>
```

Report any formatting or ESLint violations, including the file name and line number for each.

---

## Step 3 — Build
```bash
npm run build
```
Verify the TypeScript compiles cleanly to `lib/`. Report any build errors.

---

## Step 4 — Tests

If `$ARGUMENTS` is provided, run only matching tests:
```bash
npx jest "$ARGUMENTS" --coverage --verbose
```

Otherwise run the full suite:
```bash
npm test
```

---

## Step 5 — Coverage analysis

After tests complete, analyze coverage output:
- Report overall line / branch / function / statement coverage %
- **Line coverage must be 100%** for public interfaces in `src/` — flag any file below 100% line coverage
- Flag any file across the entire `src/` directory with branch coverage above or equal 90%
- For every flagged file, list the exact uncovered line numbers and what scenario they represent

---

## Step 6 — Edge case analysis and test generation

For every file across the entire `src/` directory that has branch coverage below 80%, or for the target file if `$ARGUMENTS` is provided:

### 6a — Identify uncovered edge cases
Read the source file and the corresponding test file. For each uncovered branch or line, identify what scenario is missing. Focus on:
- `null` / `undefined` inputs to public methods
- Empty strings, empty arrays, zero/negative numbers
- Async state machine values not exercised (e.g. unhandled poll statuses)
- Error paths that are never triggered in tests
- Boundary conditions (e.g. exactly at a limit vs. one over)
- Concurrent or reuse scenarios (same controller called twice)

List each gap as:
```
UNCOVERED: <file>:<line-range> — <what scenario is missing>
```

### 6b — Write the missing unit tests
For each identified gap, write a concrete Jest test case using the project's conventions:
- Test files live in `test/vault/controller/` or `test/utils/` and use `.test.js` extension
- Follow the existing `describe` / `it('should ...')` structure in that file
- Mock external dependencies (API calls, `getBearerToken`) the same way the existing tests do
- Each test must: arrange inputs → act (call the method) → assert the outcome (resolve value or rejection error code)

Output the new tests as a ready-to-paste code block, clearly labelled with the target test file path. Do **not** remove or modify existing tests.

---

## Step 7 — Report

Produce a summary table:

| Step | Status | Notes |
|------|--------|-------|
| Type check | PASS/FAIL | error count |
| Lint | PASS/FAIL | violation count |
| Build | PASS/FAIL | warning count |
| Tests | PASS/FAIL | X passed, Y failed, Z skipped |
| Coverage | % | files below threshold |
| Edge cases | n found | n tests written |

End with: **READY TO MERGE** or **NEEDS FIXES** with a bullet list of what must be fixed.
