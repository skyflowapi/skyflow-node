import {
  Credentials,
  Env,
  LogLevel,
  Skyflow,
  SkyflowConfig,
  VaultConfig,
  ReidentifyTextRequest,
  ReidentifyTextOptions,
  DetectEntities,
  SkyflowError,
  ReidentifyTextResponse
} from 'skyflow-node';

/**
 * Skyflow Reidentify Text Example
 * 
 * This example demonstrates how to:
 * 1. Configure credentials
 * 2. Set up vault configuration
 * 3. Create a reidentify text request
 * 4. Use all available options for reidentification
 * 5. Handle response and errors
 */

async function performReidentifyText() {
  try {
    // Step 1: Configure Credentials
    const credentials: Credentials = {
      path: 'path-to-credentials-json', // Path to credentials file
    };

    // Step 2: Configure Vault
    const primaryVaultConfig: VaultConfig = {
      vaultId: '<VAULT_ID>',
      clusterId: '<CLUSTER_ID>',
      env: Env.PROD,
      credentials: credentials
    };

    // Step 3: Configure Skyflow Client
    const skyflowConfig: SkyflowConfig = {
      vaultConfigs: [primaryVaultConfig],
      logLevel: LogLevel.INFO,        // Recommended to use LogLevel.ERROR in production environment.
    };

    // Initialize Skyflow Client
    const skyflowClient: Skyflow = new Skyflow(skyflowConfig);

    // Step 4: Prepare Reidentify Text Request
    const reidentifyRequest = new ReidentifyTextRequest(
      '<REDACTED_TEXT_TO_REIDENTIFY>' // The redacted text to reidentify
    );

    // Step 5: Configure ReidentifyTextOptions
    const options = new ReidentifyTextOptions();

    // Specify which entities to reidentify as redacted, masked, or plain text
    options.setRedactedEntities([DetectEntities.NAME, DetectEntities.SSN]);
    options.setMaskedEntities([DetectEntities.DOB]);
    options.setPlainTextEntities([DetectEntities.PHONE_NUMBER]);

    // Step 6: Call reidentifyText
    const response: ReidentifyTextResponse = await skyflowClient
        .detect(primaryVaultConfig.vaultId)
        .reidentifyText(reidentifyRequest, options);

    // Step 7: Handle response
    console.log('Reidentified Text Response:', response);

  } catch (error) {
    // Comprehensive Error Handling
    if (error instanceof SkyflowError) {
        console.error('Skyflow Specific Error:', {
            code: error.error?.http_code,
            message: error.message,
            details: error.error?.details,
        });
    } else {
        console.error('Unexpected Error:', JSON.stringify(error));
    }
  }
}

// Invoke the reidentify text function
performReidentifyText();