import {
  Skyflow,
  Env,
  LogLevel,
  SkyflowError,
  DeleteFilesRequest,
  Credentials,
} from 'skyflow-flowvault-node';

/** Delete files from file columns (by Skyflow ID or by unique values). */
async function performDeleteFiles(): Promise<void> {
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

    // Each record sets exactly ONE of skyflowId or uniqueValues to target the record(s).
    const deleteFilesRequest = new DeleteFilesRequest([
      {
        tableName: '<SENSITIVE_DATA_TABLE>',
        columns: ['<FILE_COLUMN>'],
        skyflowId: '<SKYFLOW_ID>',
        // uniqueValues: [{ email: 'john@example.com' }],
      },
    ]);

    const response = await skyflowClient
      .vault('<YOUR_VAULT_ID>')
      .deleteFiles(deleteFilesRequest);

    // response.records: one DeleteFilesResponseRecord per resolved record, in order.
    // Each has skyflowId, tableName, columns, httpCode, error, requestId. Each column
    // result has column and status ("DELETED"); columns is null on a failed record.
    console.log('Records:', JSON.stringify(response.records, null, 2));
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

performDeleteFiles();
