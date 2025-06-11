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
    InsertResponse
} from 'skyflow-node';

/**
 * Skyflow Secure Data Insertion Example With Continue On Error
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
        const insertData: Array<object> = [
            { card_number: "41111111111111111", cvv: "111" }, // Example sensitive data
            { card_numbe: "41111111111111111", cvv: "132" },  // Example incorrect data
          ];

        // Step 5: Create Insert Request
        const insertReq: InsertRequest = new InsertRequest(
            'sensitive_table_name',  // Replace with your actual table name
            insertData
        );

        // Step 6: Configure Insertion Options
        const insertOptions: InsertOptions = new InsertOptions();
        insertOptions.setReturnTokens(true);     // Optional: Get tokens for inserted data
        insertOptions.setContinueOnError(true);  // Optional: Continue on partial errors

        // Step 7: Perform Secure Insertion
        const response: InsertResponse = await skyflowClient
            .vault(primaryVaultConfig.vaultId)
            .insert(insertReq, insertOptions);
        

        if (
            response.insertedFields.length === 0 &&
            Array.isArray(response.errors) &&
            response.errors.length > 0
        ) {
            //handle insert response failure
            console.error("Insert failed: ", response.errors);
        } else if (
            response.insertedFields.length > 0 &&
            Array.isArray(response.errors) &&
            response.errors.length > 0
        ) {
            // handle partial response
            console.log("Inserted Fields: ", response.insertedFields);
            console.warn("Partially Errors: ", response.errors);
        } else {
            // handle successful response
            console.log("Insert successful: ", response.insertedFields);
        }

    } catch (error) {
        // Comprehensive Error Handling
        if (error instanceof SkyflowError) {
            console.error('Skyflow Specific Error:', {
                code: error.error?.http_code,
                message: error.message,
                details: error.error?.details
            });
        } else {
            console.error('Unexpected Error:', error);
        }
    }
}

// Invoke the secure data insertion function
performSecureDataInsertion();
