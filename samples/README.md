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
4. Copy your **Vault ID** and **Cluster ID** from the URL (format: `https://{clusterId}.vault.skyflowapis.com`), then click **Cancel**.

### Create a service account

1. Click **IAM** > **Service Accounts** > **New Service Account** in the side navigation.
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
   - Replace `<VAULT_ID>` with your Vault ID from Skyflow Studio
   - Replace `<CLUSTER_ID>` with your Cluster ID from the vault URL
   - Replace credential placeholders with your actual credentials
3. Run the sample:

```bash
cd samples
npm install
ts-node vault-api/insert-records.ts
```

### Sample files overview

**Vault API samples** (`vault-api/`):
- `insert-records.ts` - Insert data and get tokens
- `insert-continue-on-error.ts` - Bulk insert with error handling
- `insert-byot.ts` - Upsert operations
- `get-records.ts` - Retrieve records by Skyflow IDs
- `get-column-values.ts` - Query by column values
- `detokenzie-records.ts` - Convert tokens to values
- `tokenize-records.ts` - Get tokens for existing values
- `update-record.ts` - Update existing records
- `delete-records.ts` - Delete records by ID
- `query-records.ts` - SQL query operations
- `file-upload.ts` - Upload files to vault
- `invoke-connection.ts` - Call external integrations

**Detect API samples** (`detect-api/`):
- `deidentify-text.ts` - Anonymize text data
- `deidentify-file.ts` - Anonymize file data
- `reidentify-text.ts` - Restore original values
- `get-detect-run.ts` - Check operation status

**Service Account samples** (`service-account/`):
- `token-generation-example.ts` - Generate bearer tokens
- `scoped-token-generation-example.ts` - Role-scoped tokens
- `token-generation-with-context-example.ts` - Context-aware tokens
- `signed-token-generation-example.ts` - Signed data tokens
- `bearer-token-expiry-example.ts` - Handle token expiration

For detailed API documentation, see the main [README](../README.md).
