import {
  Skyflow,
  Env,
  LogLevel,
  SkyflowError,
  Credentials,
} from 'skyflow-flowvault-node';

/**
 * Per-vault timeout and retry configuration.
 *
 * The flowvault SDK honors these VaultConfig fields (applied to the generated
 * client's request layer at client construction):
 *   timeout     timeout in seconds for each attempt, applied again to each retry. Default 60.
 *   maxRetries  retry attempts after the first failure (408/429/5xx). Default 2; 0 turns retries off.
 *   vaultUrl    override the vault URL derived from clusterId/env.
 *
 * NOTE: the finer-grained connect/read/write timeouts and retry-delay knobs from
 * the Python SDK are fixed inside the Node generated client and are not
 * configurable here.
 */
async function performWithTimeoutAndRetry(): Promise<void> {
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
          timeout: 30, // seconds
          maxRetries: 2,
          // vaultUrl: 'https://<CLUSTER_ID>.skyvault.skyflowapis.com', // optional URL override
        },
      ],
      logLevel: LogLevel.ERROR,
    });

    console.log('Skyflow client configured with per-vault timeout & retry settings:', skyflowClient);

    // Use the client as usual; requests now fail fast at the configured timeout
    // and retry transient 408/429/5xx responses with exponential backoff + jitter.
    // const res = await skyflowClient.vault('<YOUR_VAULT_ID>').query(new QueryRequest('SELECT 1'));
    // console.log(res.fields);
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

performWithTimeoutAndRetry();
