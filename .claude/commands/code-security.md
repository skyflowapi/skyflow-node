---
description: Security audit for the Skyflow Node SDK — credentials, injection, file I/O, deps, auth lifecycle, HTTP safety.
constraints:
  - "NEVER edit, create, or delete any file under src/_generated_/. Filter it out at the git diff step with: git diff --name-only | grep -v '_generated_'. If a finding relates to generated code, report it as an observation only."
---

You are a security engineer auditing the Skyflow Node SDK — a TypeScript library that handles sensitive PII and credentials. Perform a security review on the target: $ARGUMENTS

If no argument is given, scan all files changed on the current branch vs main:
```
git diff main...HEAD --name-only
```

> **IMPORTANT — Generated code boundary**
> `src/_generated_/` contains Fern-generated REST client code. **Never modify any file inside `src/_generated_/`**. If a security finding relates to generated code, report it as an observation only — do not edit, create, or delete any file under that path.

Read each target file fully before reporting findings. For any file that touches authentication, file I/O, or HTTP calls, also read the related controller and validation file.

---

## Security checks

### 1. Credential and token exposure
- Bearer tokens, API keys, and service account credentials must **never** appear in:
  - Log messages (even at DEBUG level)
  - Error messages or `SkyflowError` details
  - Response objects returned to callers
  - File names or paths written to disk
- Check that `getBearerToken()` results are used immediately and not stored on `this` or in module-level variables
- Verify that credentials passed in `Credentials` objects are not echoed back in any response or log
- Check that error catch blocks don't accidentally log the full error object (which may contain auth headers)

### 2. Input validation and injection
- All user-supplied strings passed to file system APIs (`readFileSync`, `writeFileSync`, `mkdirSync`, `existsSync`, `lstatSync`, `readdirSync`) must be validated before use — check for path traversal (`../`), null bytes, and absolute paths escaping expected directories
- Regex patterns supplied by users (e.g. allow/restrict lists) must be wrapped in `try/catch` on `new RegExp()` construction — malformed or catastrophic patterns cause ReDoS or crashes
- Any `Buffer.from(x, 'base64')` call on data from an API response or user input must have a size check before decoding — unbounded base64 can cause OOM
- Ensure no user-controlled string reaches `eval`, `new Function()`, `child_process.exec/spawn`, or dynamic `require()`/`import()`
- SQL-like query strings passed to the vault API (e.g. `QueryRequest`) must be treated as opaque — verify no string interpolation of user data happens server-side by checking that the SDK passes values as parameters, not concatenated strings

### 3. File system security
- User-supplied directory paths (e.g. output directories) must be validated to be existing, accessible directories — the SDK must not create arbitrary directory trees from user input
- Output file paths must be constructed with `path.join(validatedBaseDir, sanitizedFileName)` — never raw string concatenation
- File name components that come from API responses (extensions, type names) must be sanitized before use in a path — they could contain `../`, leading dots, or special characters if the response is tampered with
- Temporary or intermediate files written during processing must be cleaned up on both success and error paths

### 4. Dependency and supply chain
- Run `npm audit --json` and report all HIGH and CRITICAL severity findings with CVE IDs
- Check `package.json` for any dependency that has not been pinned to a specific version (floating `^` or `~` versions on security-sensitive packages)
- Flag any dynamic `require()` or `import()` where the module path is derived from user input or environment variables

### 5. Error message information leakage
- `SkyflowError` messages surfaced to callers must not include: internal file system paths, raw stack traces, server-side SQL or query details, or internal service names
- Catch blocks that log errors must use `removeSDKVersion(error.message)` — never `error.stack` in production log paths
- HTTP response bodies from API errors must be stripped of internal server details (stack traces, internal hostnames) before being wrapped in `SkyflowError`
- Ensure `SkyflowError.error.details` only contains information safe to expose to SDK consumers

### 6. Authentication and token lifecycle
- Bearer tokens fetched via `getBearerToken()` must be checked as non-expired immediately before the API call
- Check for TOCTOU (time-of-check-time-of-use): if token validity is checked in a validator but the actual call happens later, a token could expire in between
- API key validation (`isValidAPIKey()`) must check format meaningfully — not just truthiness
- Service account JWT generation must use a secure signing algorithm — verify RS256 or ES256, never HS256 with a weak secret
- Check that no credential type silently falls back to a less secure method without logging a warning

### 7. HTTP and network security
- All HTTP calls made through the generated REST client (`src/_generated_/`) must use HTTPS — flag any `http://` hardcoded URLs
- Auth headers must be forwarded correctly and not leaked in redirect responses
- Verify that `x-request-id` and other response headers are read but not echoed back in subsequent requests (header injection risk)
- Check that connection timeouts are configured — no indefinite blocking calls

### 8. Generated code (`src/_generated_/`)
- Do not modify — but do verify it uses HTTPS only, applies auth headers from the SDK layer, and does not hardcode environment-specific endpoints
- Flag if the generated client silently retries on auth failure without refreshing the token (could mask credential issues)

---

## Output format

For each finding:

```
[SEVERITY] file:line — Finding title
  Risk: <what an attacker or misconfiguration could cause>
  Trigger: <how to reach this code path>
  Fix: <concrete remediation>
  CWE: <CWE-ID if applicable>
```

Severity: **CRITICAL** | **HIGH** | **MEDIUM** | **LOW** | **INFO**

End with:
1. Overall risk rating (Critical / High / Medium / Low)
2. Top 3 highest-priority fixes
3. Whether the code is safe to ship as-is
