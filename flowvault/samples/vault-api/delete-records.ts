import {
  Skyflow,
  Env,
  LogLevel,
  SkyflowError,
  DeleteRequest,
  Credentials,
} from 'skyflow-flowvault-node';

/** Delete records by Skyflow ID or by unique column values. */
async function performSecureDataDeletion(): Promise<void> {
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

    // Target by Skyflow IDs...
    const deleteRequest = new DeleteRequest('<SENSITIVE_DATA_TABLE>', ['<SKYFLOW_ID1>', '<SKYFLOW_ID2>']);

    // ...or by unique values: a list of { column: value } maps.
    // const deleteRequest = new DeleteRequest('<SENSITIVE_DATA_TABLE>', [], [
    //   { email: 'john@example.com' },
    // ]);

    const response = await skyflowClient
      .vault('<YOUR_VAULT_ID>')
      .delete(deleteRequest);

    // response.records: one DeleteResponseRecord per input, in order. Each has
    // skyflowId, httpCode, error, requestId.
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

performSecureDataDeletion();
