import { randomUUID } from 'crypto';
import {
  Skyflow,
  Env,
  LogLevel,
  SkyflowError,
  InsertRequest,
  InsertOptions,
  Credentials,
} from 'skyflow-flowvault-node';

/**
 * Attach custom request headers to a call. Every *Options class extends
 * BaseOptions, which provides setRequestHeaders() / getRequestHeaders() — use it
 * to add per-call headers such as a correlation / request id.
 */
async function performInsertWithCustomHeaders(): Promise<void> {
  try {
    const credentials: Credentials = {
      token: '<BEARER_TOKEN>',
    };

    const skyflowClient = new Skyflow({
      vaultConfigs: [
        {
          vaultId: '<YOUR_VAULT_ID>',
          clusterId: '<YOUR_CLUSTER_ID>',
          env: Env.DEV,
          credentials,
        },
      ],
      logLevel: LogLevel.DEBUG,
    });

    const insertRequest = new InsertRequest('<TABLE_NAME>', [
      { data: { '<YOUR_COLUMN_NAME>': '<YOUR_VALUE>' } },
    ]);

    const requestId = randomUUID();
    console.log('request id =>', requestId);

    const insertOptions = new InsertOptions();
    insertOptions.setRequestHeaders({ 'x-request-id': requestId });

    const response = await skyflowClient
      .vault('<YOUR_VAULT_ID>')
      .insert(insertRequest, insertOptions);

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

performInsertWithCustomHeaders();
