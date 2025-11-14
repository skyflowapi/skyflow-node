# Authentication credentials options

Note: Only one type of credential can be used at a time. If multiple credentials are provided, the last one added will take precedence.

1. **API keys**
   A unique identifier used to authenticate and authorize requests to an API.

   ```ts
   const credentials = {
     apiKey: "<YOUR_API_KEY>"
   };
   ```

2. **Bearer tokens**
   A temporary access token used to authenticate API requests, typically included in the
   Authorization header.

   ```ts
   const credentials = {
     token: "<YOUR_BEARER_TOKEN>"
   };
   ```

3. **Service account credentials file path**
   The file path pointing to a JSON file containing credentials for a service account, used
   for secure API access.

   ```ts
   const credentials = {
     path: "<YOUR_CREDENTIALS_FILE_PATH>"
   };
   ```

4. **Service account credentials string**
   JSON-formatted string containing service account credentials, often used as an alternative to a file for programmatic authentication.

   ```ts
   const credentials = {
     credentialsString: JSON.stringify(process.env.SKYFLOW_CREDENTIALS)
   };
   ```

5. **Environment variables**
   Automatically uses the SKYFLOW_CREDENTIALS environment variable when no credentials are explicitly provided. This variable must return an object like one of the examples above.
