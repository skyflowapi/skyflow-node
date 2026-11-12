import {
  Skyflow,
  Env,
  LogLevel,
  SkyflowError,
  UpdateRequest,
  Credentials,
} from 'skyflow-flowvault-node';

/** Update existing records by Skyflow ID. */
async function performSecureDataUpdate(): Promise<void> {
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

    // Each record needs a skyflowId. Set `table` on a record to target a
    // different table in the same call; `tokens` enables BYOT. The optional 3rd
    // arg is a request-level updateType: 'UPDATE' (merge) or 'REPLACE' (overwrite).
    const updateRequest = new UpdateRequest('<SENSITIVE_DATA_TABLE>', [
      { skyflowId: '<SKYFLOW_ID>', data: { name: 'Jane Doe' } },
    ], 'UPDATE');

    const response = await skyflowClient
      .vault('<YOUR_VAULT_ID>')
      .update(updateRequest);

    // response.records: one UpdateResponseRecord per input, in order. Each has
    // skyflowId, tableName, tokens, data, hashedData, httpCode, error, requestId.
    for (const record of response.records) {
      if (record.error == null) {
        console.log(`${record.skyflowId} updated -> tokens=`, record.tokens);
      } else {
        console.log(`${record.skyflowId} failed (${record.httpCode}): ${record.error}`);
      }
    }
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

performSecureDataUpdate();
