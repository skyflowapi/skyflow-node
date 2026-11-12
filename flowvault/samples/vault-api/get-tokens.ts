import {
  Skyflow,
  Env,
  LogLevel,
  SkyflowError,
  GetTokensRequest,
  Credentials,
} from 'skyflow-flowvault-node';

/** Look up the existing token for a value (deterministic token groups only). */
async function performGetTokens(): Promise<void> {
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

    // One record per input value. Only deterministic token groups are supported.
    const getTokensRequest = new GetTokensRequest([
      { value: 'john@example.com', tokenGroupName: '<TOKEN_GROUP_NAME>' },
      { value: 'jane@example.com', tokenGroupName: '<TOKEN_GROUP_NAME>' },
    ]);

    const response = await skyflowClient
      .vault('<YOUR_VAULT_ID>')
      .getTokens(getTokensRequest);

    // response.records: one GetTokensResponseRecord per input, in order. Each has
    // value, tokenGroupName, token, httpCode, error, requestId.
    console.log('Records:', response.records);
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

performGetTokens();
