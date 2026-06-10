import {
    Env,
    GetOptions,
    LogLevel,
    OrderByEnum,
    RedactionType,
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
            path: 'path-to-credentials-json', // Path to credentials file
        };

        // Step 2: Configure Vault 
        const primaryVaultConfig: VaultConfig = {
            vaultId: 'your-vault-id',          // Unique vault identifier
            clusterId: 'your-cluster-id',      // From vault URL
            env: Env.PROD,                     // Deployment environment
            credentials: credentials           // Authentication method
        };

        // Step 3: Configure Skyflow Client
        const skyflowConfig: SkyflowConfig = {
            vaultConfigs: [primaryVaultConfig],
            logLevel: LogLevel.ERROR,               // Logging verbosity
        };

        // Initialize Skyflow Client
        const skyflowClient: Skyflow = new Skyflow(skyflowConfig);

        // Step 4: Prepare Column-Based Retrieval Data
        const columnValues: Array<string> = [
            'value1', // Example Unique Column value 1
            'value2', // Example Unique Column value 2
        ];
        const tableName: string = 'table-name';          // Replace with your actual table name
        const columnName: string = 'column-name';       // Column name configured as unique in the schema

        // Step 5: Create Get Column Request
        const getRequest: GetColumnRequest = new GetColumnRequest(
            tableName,
            columnName,
            columnValues // Column values of the records to return
        );

        // Step 6: Configure Get Options
        const getOptions: GetOptions = new GetOptions();

        // Return tokens instead of plain-text values (default: false)
        getOptions.setReturnTokens(true);

        // Control how sensitive data is redacted in the response
        // getOptions.setRedactionType(RedactionType.PLAIN_TEXT);

        // Limit the response to specific field names
        // getOptions.setFields(['card_number', 'cardholder_name']);

        // Pagination: skip the first N records
        // getOptions.setOffset('10');

        // Pagination: return at most N records
        // getOptions.setLimit('20');

        // Sort order for returned records
        // getOptions.setOrderBy(OrderByEnum.ASCENDING);

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
                httpCode: error.error?.httpCode,
                grpcCode: error.error?.grpcCode,
                httpStatus: error.error?.httpStatus,
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
