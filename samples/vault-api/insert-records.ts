import { 
    Credentials, 
    Env, 
    InsertOptions, 
    InsertRequest, 
    LogLevel, 
    Skyflow, 
    VaultConfig, 
    SkyflowConfig,
    SkyflowError, 
    InsertResponse,
    ApiKeyCredentials,
    InsertResponseType
} from 'skyflow-node';

/**
 * Skyflow Secure Data Insertion Example
 * 
 * This example demonstrates how to:
 * 1. Configure credentials
 * 2. Set up vault configuration
 * 3. Create an insert request
 * 4. Handle response and errors
 */
async function performSecureDataInsertion() {
    try {
        // Step 1: Configure Credentials
        const credentials: Credentials = {
            // Using API Key authentication
            apiKey: 'your-skyflow-api-key',
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
            logLevel: LogLevel.INFO            // Logging verbosity
        };

        // Initialize Skyflow Client
        const skyflowClient: Skyflow = new Skyflow(skyflowConfig);

        // Step 4: Prepare Insertion Data
        const insertData: Record<string, unknown>[] = [
            { card_number: '4111111111111112' }  // Example sensitive data
        ];

        // Step 5: Create Insert Request
        const insertReq: InsertRequest = new InsertRequest(
            'sensitive_data_table',  // Replace with your actual table name
            insertData
        );

        // Step 6: Configure Insertion Options
        const insertOptions: InsertOptions = new InsertOptions();

        // Return tokens for inserted fields (default: false)
        insertOptions.setReturnTokens(true);

        // Continue inserting remaining records even when some fail (batch mode)
        // insertOptions.setContinueOnError(true);

        // Upsert: update the record if a matching value exists in the specified column
        // (the column must have the `unique` constraint in the vault schema)
        // insertOptions.setUpsertColumn('card_number');

        // Homogeneous insert: treat all records as the same schema for a bulk insert
        // insertOptions.setHomogeneous(true);

        // Step 7: Perform Secure Insertion
        const response: InsertResponse = await skyflowClient
            .vault(primaryVaultConfig.vaultId)
            .insert(insertReq, insertOptions);
        
        console.log(response);

        // Handle Successful Response — insertedFields is always an array
        for(let i = 0; i < response.insertedFields.length; i++) {
            const field: InsertResponseType = response.insertedFields[i];
            console.log('Inserted Field: ', field);
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

// Invoke the secure data insertion function
performSecureDataInsertion();
