# Node.js SDK samples

Explore working examples that demonstrate common SDK operations. Start with basic vault operations like `insert-records.ts`, then explore other samples for specific use cases.

## Prerequisites

- A Skyflow account. If you don't have one, register for one on the [Try Skyflow](https://skyflow.com/try-skyflow) page.
- [Node 7.6.0](https://nodejs.org/en/) and above.

## Prepare

Install the Node SDK:

```bash
npm install skyflow-node
```

### Create a vault

1. Navigate to Skyflow Studio in your browser.
2. Click **Create Vault** > **Start With a Template** > **Quickstart vault**.
3. When the vault is ready, click the gear icon and select **Edit Vault Details**.
4. Copy your **Vault URL** and **Vault ID**, then click **Cancel**.

### Create a service account

1. In the side navigation, click **Access** > **Service Accounts** > **New Service Account**.
2. Enter "SDK Samples" for **Name** and choose **Vault Editor** for **Roles**.
3. Click **Create**. Your browser downloads a **credentials.json** file. Store this file securely.

## The samples

Sample files are organized by API type:
- `vault-api/` - Vault operations (insert, get, update, delete, tokenize, detokenize)
- `detect-api/` - Detect operations (deidentify, reidentify)
- `service-account/` - Token generation examples

### Running a sample

1. Open the sample file you want to run (for example, `vault-api/insert-records.ts`)
2. Update placeholder values:

   | Placeholder | Replace With |
   |-------------|--------------|
   | `<VAULT_ID>` | Your Vault ID from Skyflow Studio |
   | `<CLUSTER_ID>` | Your Cluster ID from the vault URL |
   | `<YOUR_CREDENTIAL_FILE>` | Relative path to your actual credentials file |
   | `<TABLE_NAME>` | The name of a table in your vault (for example, `users`) |
   | `<COLUMN_NAME>` | The name of a column in your table (for example, `name`) |
   | `<ID1>`, `<ID2>`, etc. | Actual record IDs from your vault |
   | `<VALUE>` | Actual values to insert into your vault |
   | `<TOKEN1>`, `<TOKEN2>`, etc. | Actual tokens from your vault |
   | `<CONNECTION_URL>` | Your connection URL |

3. Run the sample:

   ```bash
   cd samples
   npm install
   ts-node vault-api/insert-records.ts
   ```

### Sample files overview

**Vault API samples** ([`vault-api/`](vault-api/)):
- [`insert-records.ts`](vault-api/insert-records.ts) - Insert data and get tokens
- [`insert-continue-on-error.ts`](vault-api/insert-continue-on-error.ts) - Bulk insert with error handling
- [`insert-byot.ts`](vault-api/insert-byot.ts) - Upsert operations
- [`get-records.ts`](vault-api/get-records.ts) - Retrieve records by Skyflow IDs
- [`get-column-values.ts`](vault-api/get-column-values.ts) - Query by column values
- [`detokenzie-records.ts`](vault-api/detokenzie-records.ts) - Convert tokens to values
- [`tokenize-records.ts`](vault-api/tokenize-records.ts) - Get tokens for existing values
- [`update-record.ts`](vault-api/update-record.ts) - Update existing records
- [`delete-records.ts`](vault-api/delete-records.ts) - Delete records by ID
- [`query-records.ts`](vault-api/query-records.ts) - SQL query operations
- [`file-upload.ts`](vault-api/file-upload.ts) - Upload files to vault
- [`invoke-connection.ts`](vault-api/invoke-connection.ts) - Call external integrations

**Detect API samples** ([`detect-api/`](detect-api/)):
- [`deidentify-text.ts`](detect-api/deidentify-text.ts) - Anonymize text data
- [`deidentify-file.ts`](detect-api/deidentify-file.ts) - Anonymize file data
- [`reidentify-text.ts`](detect-api/reidentify-text.ts) - Restore original values
- [`get-detect-run.ts`](detect-api/get-detect-run.ts) - Check operation status

**Service Account samples** ([`service-account/`](service-account/)):
- [`token-generation-example.ts`](service-account/token-generation-example.ts) - Generate bearer tokens
- [`scoped-token-generation-example.ts`](service-account/scoped-token-generation-example.ts) - Role-scoped tokens
- [`token-generation-with-context-example.ts`](service-account/token-generation-with-context-example.ts) - Context-aware tokens
- [`signed-token-generation-example.ts`](service-account/signed-token-generation-example.ts) - Signed data tokens
- [`bearer-token-expiry-example.ts`](service-account/bearer-token-expiry-example.ts) - Handle token expiration

For detailed API documentation, see the main [README](../README.md).
