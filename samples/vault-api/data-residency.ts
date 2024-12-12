import { 
    Credentials, 
    Env, 
    GetRequest, 
    GetResponse, 
    InsertRequest, 
    LogLevel, 
    Skyflow, 
    VaultConfig, 
    SkyflowConfig, 
    InsertResponse, 
    SkyflowError 
} from 'skyflow-node';

/**
 * Skyflow Vault Data Transfer Example
 * 
 * This example demonstrates how to:
 * 1. Configure credentials
 * 2. Set up primary and secondary vault configurations
 * 3. Retrieve data from one vault
 * 4. Insert data into another vault
 * 5. Handle responses and errors
 */
async function transferDataBetweenVaults() {
    try {
        // Step 1: Configure Credentials
        const credentials: Credentials = {
            token: 'BEARER_TOKEN',  // Bearer token for authentication
        };

        // Step 2: Configure Primary Vault
        const primaryVaultConfig: VaultConfig = {
            vaultId: 'vault-id-1',          // Primary vault ID
            clusterId: 'cluster-id-1',      // Cluster ID from your vault URL
            env: Env.PROD,                  // Environment (default: PROD)
            credentials: credentials,       // Authentication method for this vault
        };

        // Step 3: Configure Skyflow Client
        const skyflowConfig: SkyflowConfig = {
            vaultConfigs: [primaryVaultConfig],
            logLevel: LogLevel.ERROR,  // Set log level to ERROR
        };

        const skyflowClient: Skyflow = new Skyflow(skyflowConfig);

        // Step 4: Configure Secondary Vault
        const secondaryVaultConfig: VaultConfig = {
            vaultId: 'vault-id-2',          // Secondary vault ID
            clusterId: 'cluster-id-2',      // Cluster ID from the secondary vault URL
            env: Env.PROD,                  // Environment (default: PROD)
            // If no individual credentials are provided, Skyflow credentials will be used
        };

        // Add Secondary Vault to Skyflow Client
        skyflowClient.addVaultConfig(secondaryVaultConfig);

        // Step 5: Get Data from Primary Vault
        const getIds: Array<string> = [
            'skyflow-id-1',
            'skyflow-id-2',
        ];

        const tableName: string = 'your-table-name';  // Replace with your table name

        const getRequest: GetRequest = new GetRequest(tableName, getIds);

        // Perform Get request on Primary Vault
        const getResponse = await skyflowClient
            .vault('vault-id-1')  // Specify the vault ID or it defaults to the first valid vault
            .get(getRequest);

        // Step 6: Handle Get Response and Insert Data into Secondary Vault
        const getResponseData: GetResponse = getResponse as GetResponse;

        const insertData: Array<Object> = getResponseData.data!;

        // Remove skyflow_id from the data (if needed for re-insertion)
        const sanitizedData = insertData.map(item => {
            const { skyflow_id, ...rest } = item as any;  // Exclude the skyflow_id field
            return rest;
        });

        // Step 7: Insert Data into Secondary Vault
        const insertRequest: InsertRequest = new InsertRequest(
            tableName,  // Same table name or different as needed
            sanitizedData,
        );

        // Perform Insert request on Secondary Vault
        const insertResponse = await skyflowClient
            .vault('vault-id-2')  // Specify the secondary vault ID
            .insert(insertRequest);

        console.log('Data successfully inserted into secondary vault:', insertResponse);

    } catch (error) {
        // Comprehensive error handling
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

// Invoke the data transfer function
transferDataBetweenVaults();
