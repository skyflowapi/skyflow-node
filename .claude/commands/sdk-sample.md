---
description: Generate a new Skyflow Node SDK sample file demonstrating a specific feature with proper patterns, error handling, and type safety.
constraints:
  - "NEVER edit, create, or delete any file under src/_generated_/. Samples must import only from 'skyflow-node' (the public package), never directly from src/_generated_/."
---

Create a new Skyflow Node SDK sample. Feature to demonstrate: $ARGUMENTS

> **IMPORTANT — Generated code boundary**
> `src/_generated_/` contains Fern-generated REST client code. **Never modify any file inside `src/_generated_/`**. Samples must import only from `'skyflow-node'` (the public package), never directly from `src/_generated_/`.

Read the following before writing anything:
1. An existing sample in `samples/vault-api/` to understand structure and style
2. `src/index.ts` to see what is exported
3. `samples/package.json` to understand available imports

---

## Sample requirements

### File location
- Vault operations → `samples/vault-api/<feature-name>.ts`
- Service account / auth → `samples/service-account/<feature-name>.ts`
- Detect / PII operations → `samples/vault-api/detect-<feature-name>.ts`

### Required structure (in this order)
1. Import block — only from `'skyflow-node'` (not from `src/`)
2. Credentials configuration with `Credentials` type
3. `VaultConfig` (and `ConnectionConfig` if needed)
4. `SkyflowConfig` with `logLevel: LogLevel.ERROR`
5. `Skyflow` client initialization
6. Request object construction using the appropriate `XxxRequest` class
7. Options object using setters (not direct property assignment)
8. `async` function wrapping the SDK call
9. `try/catch` with `SkyflowError` check
10. `main()` call at the bottom

### Code style rules
- Use realistic placeholder values (`'your-vault-id'`, `'your-api-key'`, table names matching the feature)
- Every non-obvious step gets a short inline comment explaining WHY (not what)
- Show the full error handling pattern — both `SkyflowError` and generic `Error`
- Keep the sample under 100 lines — if it needs more, split into focused examples
- No `console.log` on success paths other than printing the response

### Template
```typescript
import Skyflow, {
  Credentials,
  LogLevel,
  SkyflowConfig,
  // add relevant Request/Options/Response imports
} from 'skyflow-node';

const credentials: Credentials = {
  apiKey: 'your-skyflow-api-key',
};

const primaryVaultConfig = {
  vaultId: 'your-vault-id',
  clusterId: 'your-cluster-id',
  credentials,
};

const skyflowConfig: SkyflowConfig = {
  vaultConfigs: [primaryVaultConfig],
  logLevel: LogLevel.ERROR,
};

const skyflowClient = new Skyflow(skyflowConfig);

async function main() {
  try {
    // Build request
    // Execute
    // Log response
  } catch (error) {
    if (error instanceof SkyflowError) {
      console.error('Skyflow error:', {
        code: error.error?.http_code,
        message: error.message,
        details: error.error?.details,
      });
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

main();
```

---

After creating the file:
1. Run `npx tsc --noEmit --project samples/tsconfig.json 2>/dev/null || npx tsc --noEmit` to verify it type-checks
2. Report the file path created and any type errors to fix
