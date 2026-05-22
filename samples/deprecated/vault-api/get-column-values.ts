import { 
    Env, 
    GetOptions, 
    LogLevel, 
    Skyflow, 
    GetColumnRequest, 
    Credentials, 
    SkyflowConfig, 
    VaultConfig, 
    SkyflowError, 
    GetResponse,
    GetResponseData
} from 'skyflow-node';

/**
 * Skyflow Secure Column-Based Retrieval Example
 * 
 * This example demonstrates how to:
 * 1. Configure credentials
 * 2. Set up vault configuration
 * 3. Create a column-based get request
 * 4. Handle response and errors
 */
async function performSecureColumnRetrieval() {
    try {
        // Step 1: Configure Credentials
        const credentials: Credentials = {
            token: 'BEARER_TOKEN',
        };

        // Step 2: Configure Vault
        const primaryVaultConfig: VaultConfig = {
            vaultId: '<VAULT_ID>',
            clusterId: '<CLUSTER_ID>',
            env: Env.DEV,
            credentials: credentials
        };

        // Step 3: Configure Skyflow Client
        const skyflowConfig: SkyflowConfig = {
            vaultConfigs: [primaryVaultConfig],
            logLevel: LogLevel.WARN,
        };

        // Initialize Skyflow Client
        const skyflowClient: Skyflow = new Skyflow(skyflowConfig);

        // Step 4: Prepare Column-Based Retrieval Data
        const columnValues: Array<string> = [
            '4111111111111112',
        ];
        const tableName: string = 'table1';
        const columnName: string = 'card_number';

        // Step 5: Create Get Column Request
        const getRequest: GetColumnRequest = new GetColumnRequest(
            tableName,
            columnName,
            columnValues // Column values of the records to return
        );

        // Step 6: Configure Get Options
        const getOptions: GetOptions = new GetOptions();
        getOptions.setReturnTokens(false); // Column-based lookup returns plaintext values

        // Step 7: Perform Secure Retrieval
        const response: GetResponse = await skyflowClient
            .vault(primaryVaultConfig.vaultId)
            .get(getRequest, getOptions);

        // Handle Successful Response
        console.log('Column-based retrieval successful:', response);
        if (response.data != null) {
          response.data.forEach((record: GetResponseData) => {
            console.log("Get data:", record);
            // Handle record data
          });
        }

    } catch (error) {
        // Comprehensive Error Handling
        if (error instanceof SkyflowError) {
            console.error('Skyflow Specific Error:', {
                code: error.error?.http_code,
                message: error.message,
                details: error.error?.details,
            });
        } else {
            console.error('Unexpected Error:', error);
        }
    }
}

// Invoke the secure column retrieval function
performSecureColumnRetrieval();
