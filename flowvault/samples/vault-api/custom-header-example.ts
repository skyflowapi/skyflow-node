import { randomUUID } from 'crypto';
import {
  Skyflow,
  Env,
  LogLevel,
  SkyflowError,
  InsertRequest,
  InsertOptions,
  CustomHeaderKey,
  Credentials,
} from 'skyflow-flowvault-node';

/**
 * Attach custom request headers to a call. The SDK supports a fixed set of
 * headers (see CustomHeaderKey): SKYFLOW_ACCOUNT_ID (x-skyflow-account-id),
 * SKYFLOW_ACCOUNT_NAME (x-skyflow-account-name) and REQUEST_ID_HEADER
 * (x-request-id). Register an interceptor on the *Options object; it runs once
 * per request and receives a RequestContext whose `operation` names the call.
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
    insertOptions.setInterceptor((ctx) => {
      // pass the request id (or any supported CustomHeaderKey) here
      ctx.addHeader(CustomHeaderKey.REQUEST_ID_HEADER, requestId);
    });

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
