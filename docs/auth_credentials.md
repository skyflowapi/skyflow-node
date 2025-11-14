# Authentication credentials options

> [!NOTE]
> Only one type of credential can be used at a time. If multiple credentials are provided, the last one added will take precedence.

**Choosing the right credential type:**
- Use **API keys** for long-term service authentication
- Use **Bearer tokens** for optimal security
- Use **Service account file paths** when credentials are managed externally
- Use **Credential strings** when integrating with secret management systems
- Use **Environment variables** to avoid hardcoding credentials in source code (recommended)

1. **API keys**
   A unique identifier used to authenticate and authorize requests to an API.

   ```ts
   const credentials: Credentials = {
     apiKey: "<YOUR_API_KEY>"
   };
   ```

2. **Bearer tokens**
   A temporary access token used to authenticate API requests, typically included in the
   Authorization header.

   ```ts
   const credentials: Credentials = {
     token: "<YOUR_BEARER_TOKEN>"
   };
   ```

3. **Service account credentials file path**
   The file path pointing to a JSON file containing credentials for a service account, used
   for secure API access.

   ```ts
   const credentials: Credentials = {
     path: "<YOUR_CREDENTIALS_FILE_PATH>"
   };
   ```

4. **Service account credentials string**
   JSON-formatted string containing service account credentials, often used as an alternative to a file for programmatic authentication.

   ```ts
   const credentials: Credentials = {
     credentialsString: JSON.stringify(process.env.SKYFLOW_CREDENTIALS)
   };
   ```

5. **Environment variables**
   If no credentials are explicitly provided the SDK automatically looks for the SKYFLOW_CREDENTIALS environment variable. This variable must return an object like one of the examples above.
