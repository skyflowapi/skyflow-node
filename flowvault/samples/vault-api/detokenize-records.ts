import {
  Skyflow,
  Env,
  LogLevel,
  SkyflowError,
  DetokenizeRequest,
  Credentials,
} from 'skyflow-flowvault-node';

/** Detokenize a list of tokens back to their values. */
async function performSecureDetokenization(): Promise<void> {
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

    // Optionally pass group-level redactions; omit for the default redaction.
    const detokenizeRequest = new DetokenizeRequest(
      ['<TOKEN1>', '<TOKEN2>'],
      // [{ tokenGroupName: '<TOKEN_GROUP_NAME>', redaction: 'PLAIN_TEXT' }],
    );

    const response = await skyflowClient
      .vault('<YOUR_VAULT_ID>')
      .detokenize(detokenizeRequest);

    // response.records: one DetokenizeResponseRecord per input, in order. Each has
    // token, value, tokenGroupName, metadata ({ skyflowId, tableName }),
    // httpCode, error, requestId.
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

performSecureDetokenization();
