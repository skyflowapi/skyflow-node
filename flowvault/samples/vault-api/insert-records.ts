import {
  Skyflow,
  Env,
  LogLevel,
  SkyflowError,
  InsertRequest,
  InsertOptions,
  Credentials,
} from 'skyflow-flowvault-node';

/** Insert records into one or more tables. */
async function performSecureDataInsertion(): Promise<void> {
  try {
    const credentials: Credentials = {
      path: '<PATH_TO_YOUR_CREDENTIALS_JSON>', // or { apiKey } / { token } / { credentialsString }
    };

    const skyflowClient = new Skyflow({
      vaultConfigs: [
        {
          vaultId: '<YOUR_VAULT_ID>',
          clusterId: '<YOUR_CLUSTER_ID>', // from the vault URL: https://{clusterId}.vault.skyflowapis.com
          env: Env.PROD, // DEV, STAGE, SANDBOX, or PROD
          credentials,
        },
      ],
      logLevel: LogLevel.ERROR,
    });

    // One record per entry. Set `table` on a record to insert into a different
    // table in the same call (multi-table insert); otherwise the request-level
    // table applies. `tokens` enables BYOT (bring your own token).
    const insertRequest = new InsertRequest('<SENSITIVE_DATA_TABLE>', [
      { data: { name: 'John Doe', email: 'john@example.com' } },
      // { data: { name: 'Jane Doe', email: 'jane@example.com' }, table: '<OTHER_TABLE>' },
    ]);

    // Upsert: update the record when a matching value exists in a unique column.
    const insertOptions = new InsertOptions();
    // insertOptions.setUpsert({ updateType: 'UPDATE', uniqueColumns: ['email'] });

    const response = await skyflowClient
      .vault('<YOUR_VAULT_ID>')
      .insert(insertRequest, insertOptions);

    // response.records: one InsertResponseRecord per input, in order. Each has
    // tableName, skyflowId, tokens, data, hashedData, httpCode, error, requestId.
    for (const record of response.records) {
      if (record.error == null) {
        console.log(`${record.skyflowId} -> tokens=`, record.tokens);
      } else {
        console.log(`failed (${record.httpCode}): ${record.error} [requestId=${record.requestId}]`);
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

performSecureDataInsertion();
