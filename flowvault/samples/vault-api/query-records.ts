import {
  Skyflow,
  Env,
  LogLevel,
  SkyflowError,
  QueryRequest,
  Credentials,
} from 'skyflow-flowvault-node';

/** Run a read-only SQL SELECT query against the vault. */
async function performQuery(): Promise<void> {
  try {
    const credentials: Credentials = {
      path: '<PATH_TO_YOUR_CREDENTIALS_JSON>',
    };

    const skyflowClient = new Skyflow({
      vaultConfigs: [
        {
          vaultId: '<YOUR_VAULT_ID>',
          clusterId: '<YOUR_CLUSTER_ID>',
          env: Env.PROD,
          credentials,
        },
      ],
      logLevel: LogLevel.ERROR,
    });

    // Only SELECT is supported; a call returns at most 25 rows — page with OFFSET.
    const queryRequest = new QueryRequest(
      "SELECT name, email FROM <SENSITIVE_DATA_TABLE> LIMIT 25",
    );

    const response = await skyflowClient
      .vault('<YOUR_VAULT_ID>')
      .query(queryRequest);

    // response.fields: the result rows (one object per row). response.metadata.columns
    // lists the returned columns; response.requestId is always set.
    console.log('Request ID:', response.requestId);
    console.log('Columns:', response.metadata?.columns);
    console.log('Rows:', response.fields);
  } catch (error) {
    if (error instanceof SkyflowError) {
      console.error('Skyflow Error:', {
        code: error.error?.httpCode,
        message: error.message,
        details: error.error?.details,
      });
    } else {
      console.error('Unexpected Error:', error);
    }
  }
}

performQuery();
