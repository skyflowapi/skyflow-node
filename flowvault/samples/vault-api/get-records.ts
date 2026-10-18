import {
  Skyflow,
  Env,
  LogLevel,
  SkyflowError,
  GetRequest,
  GetOptions,
  Credentials,
} from 'skyflow-flowvault-node';

/** Retrieve records by Skyflow ID (single- or multi-table). */
async function performSecureDataRetrieval(): Promise<void> {
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

    // Single-table: pass the table and the Skyflow IDs.
    const getRequest = new GetRequest('<SENSITIVE_DATA_TABLE>', ['<SKYFLOW_ID1>', '<SKYFLOW_ID2>']);

    // Multi-table batch: leave table/ids empty and pass per-table records instead.
    // Each record can carry its own columns / columnRedactions / uniqueValues.
    // const getRequest = new GetRequest('', [], [
    //   { tableName: '<TABLE_A>', ids: ['<ID_A1>'], columns: ['<COLUMN>'] },
    //   { tableName: '<TABLE_B>', ids: [], uniqueValues: [{ email: '<EMAIL>' }] },
    // ]);

    // Optional: limit columns, redact per column, or look up by unique values.
    const getOptions = new GetOptions();
    // getOptions.setFields(['name', 'email']);
    // getOptions.setColumnRedactions([{ columnName: 'ssn', redaction: 'MASKED' }]);
    // getOptions.setUniqueValues([{ email: 'john@example.com' }]);

    const response = await skyflowClient
      .vault('<YOUR_VAULT_ID>')
      .get(getRequest, getOptions);

    // response.records: one GetResponseRecord per result. Each has skyflowId,
    // tableName, data, tokens, hashedData, httpCode, error, requestId.
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

performSecureDataRetrieval();
