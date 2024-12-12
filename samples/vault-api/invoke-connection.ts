import { 
    Credentials, 
    Env, 
    InvokeConnectionRequest, 
    RequestMethod, 
    LogLevel, 
    Skyflow, 
    VaultConfig, 
    SkyflowConfig, 
    ConnectionConfig, 
    SkyflowError 
} from 'skyflow-node';

/**
 * Skyflow Connection Invocation Example
 * 
 * This example demonstrates how to:
 * 1. Configure credentials
 * 2. Set up vault and connection configurations
 * 3. Invoke a connection
 * 4. Handle response and errors
 */
async function invokeSkyflowConnection() {
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

        // Step 3: Configure Connection
        const primaryConnectionConfig: ConnectionConfig = {
            connectionId: 'your-connection-id', // Unique connection identifier
            connectionUrl: 'your-connection-url', // connection url
            credentials: credentials            // Connection-specific credentials
        };

        // Step 4: Configure Skyflow Client
        const skyflowConfig: SkyflowConfig = {
            vaultConfigs: [primaryVaultConfig],
            connectionConfigs: [primaryConnectionConfig],
            logLevel: LogLevel.INFO            // Logging verbosity
        };

        // Initialize Skyflow Client
        const skyflowClient: Skyflow = new Skyflow(skyflowConfig);

        // Step 5: Prepare Connection Request
        const requestBody = {
            key1: 'value1',  // Replace with actual key-value pairs
            key2: 'value2'
        };

        const requestHeaders = {
            'content-type': 'application/json'
        };

        const requestMethod: RequestMethod = RequestMethod.POST;

        // Step 6: Create Invoke Connection Request
        const invokeReq: InvokeConnectionRequest = new InvokeConnectionRequest(
            requestMethod,
            requestBody,
            requestHeaders
        );

        // Step 7: Invoke Connection
        const response = await skyflowClient
            .connection()
            .invoke(invokeReq);

        // Handle Successful Response
        console.log('Connection invocation successful:', response);

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

// Invoke the connection function
invokeSkyflowConnection();
