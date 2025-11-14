# Skyflow Node SDK - AI Coding Agent Instructions

## Project Overview

The Skyflow Node SDK is a TypeScript-based client library for Skyflow's data privacy vault, supporting Node.js, Deno, Bun, and Cloudflare Workers. It provides three primary API surfaces: **Vault** (data operations), **Detect** (PII detection/masking), and **Connections** (integration gateway).

**Key Architecture:**
- **Client Layer** (`src/vault/client/`): Manages authentication, API initialization, and HTTP configuration
- **Controller Layer** (`src/vault/controller/`): Business logic for vault, detect, and connection operations
- **Model Layer** (`src/vault/model/`): Request/Response/Options classes for type-safe API interactions
- **Generated Code** (`src/_generated_/`): Auto-generated REST client (do not modify manually)

## Request/Response Pattern

All API operations follow a consistent pattern using dedicated classes:

```typescript
// 1. Create a Request object
const insertReq = new InsertRequest('table_name', [{ field: 'value' }]);

// 2. Create Options object (if needed)
const insertOptions = new InsertOptions();
insertOptions.setReturnTokens(true);

// 3. Call the operation through the client
const response: InsertResponse = await skyflowClient
  .vault(vaultId)
  .insert(insertReq, insertOptions);
```

**Key Classes:**
- Request classes: `InsertRequest`, `GetRequest`, `DetokenizeRequest`, `UpdateRequest`, etc.
- Options classes: `InsertOptions`, `GetOptions`, `DetokenizeOptions` (use setters, not direct property access)
- Response classes: `InsertResponse`, `GetResponse`, `DetokenizeResponse` (readonly data containers)

## Authentication & Credentials

The SDK supports five credential types (see `src/vault/config/credentials/index.ts`):

1. **Bearer Token** (recommended): `{ token: 'token' }`
3. **Path to JSON**: `{ path: '/path/to/creds.json' }`
4. **Credentials String**: `{ credentialsString: JSON.stringify(creds) }`
5. **Environment Variable**: Auto-reads `SKYFLOW_CREDENTIALS` if no credentials provided
2. **API Key**: `{ apiKey: 'key' }`

**Credentials Hierarchy:**
- Individual vault/connection credentials override common credentials
- Common credentials (`skyflowCredentials`) apply to all vaults/connections
- Use `validateSkyflowCredentials()` from `src/utils/validations/` for validation

## Client Initialization

The `Skyflow` class (in `src/vault/skyflow/index.ts`) manages multiple vaults and connections:

```typescript
const skyflowConfig: SkyflowConfig = {
  vaultConfigs: [vaultConfig1, vaultConfig2],
  connectionConfigs: [connectionConfig],
  skyflowCredentials: credentials, // Optional common credentials
  logLevel: LogLevel.ERROR // Default: LogLevel.ERROR
};

const client = new Skyflow(skyflowConfig);
```

**Multi-Vault Access:**
- Access specific vault: `client.vault('vault-id-1')`
- Access first vault: `client.vault()` (no ID defaults to first)
- Same pattern for `.detect()` and `.connection()`

## Error Handling Pattern

Always wrap SDK calls in try/catch and check for `SkyflowError`:

```typescript
try {
  const response = await skyflowClient.vault(vaultId).insert(request);
} catch (error) {
  if (error instanceof SkyflowError) {
    // Structured error from Skyflow
    console.error({
      code: error.error?.http_code,
      message: error.message,
      details: error.error?.details
    });
  } else {
    // Unexpected error
    console.error('Unexpected error:', error);
  }
}
```

**Error Structure:** See `src/error/index.ts` for `SkyflowError` class and `src/error/codes/` for error constants.

## Testing Conventions

- Tests use Jest (see `jest.config.js`)
- Test files: `test/**/*.test.js` (note: `.js` not `.ts`)
- Run tests: `npm test` (includes coverage)
- Coverage excludes: `src/_generated_`, model classes (request/response/options)
- Mock data: `test/mockData/` and `test/demo-credentials/`

**Test Structure:**
```javascript
describe('ComponentName', () => {
  it('should perform specific action', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

## Build & Development Workflow

**Essential Commands:**
- `npm run build` - Compile TypeScript to `lib/` (CommonJS)
- `npm test` - Run Jest tests with coverage
- `npm run lint` - Run prettier + eslint
- `npm run lint-fix` - Auto-fix formatting issues
- `npm run spellcheck` - Check spelling with cspell
- `npm run docs-gen` - Generate TypeDoc + process markdown

**Build Output:**
- Compiled JS: `lib/`
- TypeScript config: `tsconfig.json` (target: ES6, module: CommonJS)
- Babel config: `babel.config.js` (for test transpilation)

## Logging System

Configure via `LogLevel` enum (in `src/utils/index.ts`):
- `LogLevel.DEBUG` - All logs (verbose)
- `LogLevel.INFO` - Info, warn, error
- `LogLevel.WARN` - Warn and error only
- `LogLevel.ERROR` - Error only (default)
- `LogLevel.OFF` - No logs

**Usage:**
```typescript
import { printLog, MessageType, LogLevel } from './utils';
printLog('message', MessageType.LOG, this.logLevel);
```

## Validation Pattern

All inputs are validated using functions in `src/utils/validations/index.ts`:

- `validateSkyflowConfig()` - Client configuration
- `validateVaultConfig()` - Vault setup
- `validateConnectionConfig()` - Connection setup
- `validateSkyflowCredentials()` - Credential objects

**When adding new features:**
1. Add validation function in `src/utils/validations/`
2. Call validation early (constructor/method entry)
3. Throw `SkyflowError` with appropriate error code from `src/error/codes/`

## Important File Locations

- **Main exports**: `src/index.ts` (public API surface)
- **Client initialization**: `src/vault/skyflow/index.ts`
- **HTTP client**: `src/vault/client/index.ts`
- **Controllers**: `src/vault/controller/{vault,detect,connections}/`
- **Type definitions**: `src/vault/types/index.ts`
- **Utilities**: `src/utils/` (validations, logging, JWT helpers)
- **Service account auth**: `src/service-account/`
- **Sample code**: `samples/` (use as reference for common patterns)

## Special Considerations

1. **Bearer Token Expiry**: SDK auto-generates new tokens when expired. Edge case: token expires between validation and API call - solution is to retry the request.

2. **Generated Code**: `src/_generated_/` contains Fern-generated REST clients. Never modify manually. These are initialized in `VaultClient.initAPI()` based on operation type.

3. **File Operations**: Require Node.js v20+ for `File` API. See `src/vault/controller/detect/` for file handling examples.

4. **Async Patterns**: All SDK operations return Promises. Controllers use `async/await`. Always propagate errors to callers.

5. **V1 to V2 Migration**: See `docs/migrate_to_v2.md` for breaking changes. Key difference: class-based Request/Response/Options objects vs. plain objects.

## Code Style Guidelines

- **TypeScript**: Strict mode enabled, no implicit any
- **Naming**: PascalCase for classes, camelCase for functions/variables
- **Imports**: Use absolute paths from `src/`, export via `src/index.ts`
- **Error Messages**: Use parameterized strings from `src/utils/logs/`
- **Comments**: JSDoc for public APIs, inline comments for complex logic
- **Formatting**: Prettier + ESLint (run `npm run lint-fix` before commit)

## When Adding New Features

1. Create Request/Response/Options classes in `src/vault/model/`
2. Add controller method in appropriate controller
3. Update `src/index.ts` with exports
4. Add validation in `src/utils/validations/`
5. Write tests in `test/`
6. Add sample in `samples/` directory
7. Update TypeDoc comments for documentation generation

## Documentation & README Standards

### Core Writing Principles

When creating or updating documentation (including README.md, samples, and code comments):

1. **Research-driven creation**: Thoroughly research existing docs before writing. Create original content that addresses specific user scenarios—don't copy existing material.

2. **Context-driven updates**: Analyze content structure and identify specific sections requiring changes. Improve clarity, accuracy, and completeness through thoughtful revision.

3. **Quality assurance**: Resolve all IDE warnings and errors before finalizing. Iterate until documentation passes validation checks.

4. **Consistency first**: Maintain uniform formatting, terminology, and structure while adapting content to user needs.

### README.md Maintenance

The README.md follows specific standards for SDK documentation:

**Structure requirements:**
- **Project identification**: Name at top, clear owner/author identification, repository URL
- **Project evaluation**: Describe what the project *does* (not what it's *made of*)—focus on user benefits
  - Use patterns like: "With Skyflow Node SDK you can securely handle sensitive data..."
  - Write in second person (you), use action verbs, avoid passive voice
  - Describe who may use it and under what terms (MIT license)
- **Usage help**: Prerequisites, installation steps, quickstart that works on first try
- **Engagement**: Links to docs, support channels, contribution guidelines

**Writing style:**
- **Voice**: Conversational but professional, use second person ("you")
- **Sentences**: Under 26 words when possible, active voice, present tense
- **Instructions**: Start with verbs ("Create", "Configure", "Call")
- **Code formatting**: Single backticks for inline code (filenames, class names, methods), fenced blocks for multi-line examples
- **Links**: Descriptive text rather than raw URLs
- **Emphasis**: `_italics_` for key terms/concepts, `**bold**` for UI elements

**Content organization:**
- Lead with most important information
- Break up text with headers, lists, formatting
- Use parallel structure in lists
- Keep README under 10-12 screens—move extensive content to separate docs
- Add table of contents if README exceeds 3-4 screens

### Code Examples in Documentation

All code examples must:
- Be **complete and working**—avoid placeholder or empty examples
- Include **realistic values** that demonstrate actual usage
- Add **explanatory comments** for key parts
- Show **error handling patterns** with `SkyflowError`
- Match the **class-based Request/Response/Options pattern**

**Good example pattern:**
```typescript
// Step 1: Configure credentials
const credentials: Credentials = {
  apiKey: 'your-skyflow-api-key',
};

// Step 2: Create request with actual data structure
const insertReq = new InsertRequest('table_name', [
  { card_number: '4111111111111112', cardholder_name: 'John Doe' }
]);

// Step 3: Configure options using setters
const insertOptions = new InsertOptions();
insertOptions.setReturnTokens(true);

// Step 4: Execute with error handling
try {
  const response = await skyflowClient.vault(vaultId).insert(insertReq, insertOptions);
  console.log('Insert response:', response);
} catch (error) {
  if (error instanceof SkyflowError) {
    console.error({
      code: error.error?.http_code,
      message: error.message
    });
  }
}
```

### Progressive Disclosure Pattern

When documenting features:
1. **Quickstart**: Minimal working example with most common use case
2. **Basic usage**: Core functionality with clear explanations
3. **Advanced options**: Link to detailed docs for complex scenarios
4. **Related concepts**: Cross-reference to related features

### Formatting Standards

- **Line length**: 80-character limit for readability (except URLs/code blocks)
- **Indentation**: 2 spaces (never tabs)
- **Code blocks**: Always include language identifier
- **Tables**: Use for structured comparisons (error codes, options, parameters)
- **Lists**: Use for sequential steps or feature enumerations

### Testing Documentation

Before finalizing any documentation:
1. **Test all code examples**—every snippet must execute successfully
2. **Verify all links** work and point to correct locations
3. **Check for consistency** with existing terminology and patterns
4. **Validate formatting** matches project standards
5. **Review for completeness**—ensure all required sections present
