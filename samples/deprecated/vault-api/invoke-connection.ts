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
    SkyflowError,
    InvokeConnectionResponse
} from 'skyflow-node';

/**
 * Skyflow Connection Invocation Example
 *
 * This example demonstrates how to:
 * 1. Configure credentials
 * 2. Set up vault and connection configurations
 * 3. Invoke a connection with multiple content-type formats
 * 4. Handle response and errors
 */

const NGROK_BASE = '<YOUR_CONNECTION_BASE_URL>';

async function invokeSkyflowConnection() {
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

    // Step 3: Configure Connections (one per content-type format)
    const connectionConfigs: ConnectionConfig[] = [
        {
            connectionId: 'conn-json-to-json',
            connectionUrl: `${NGROK_BASE}/v1/payment_methods/json`,
            credentials: credentials
        },
        {
            connectionId: 'conn-json-to-xml',
            connectionUrl: `${NGROK_BASE}/v1/payment_methods/json-to-xml`,
            credentials: credentials
        },
        {
            connectionId: 'conn-urlencoded-to-json',
            connectionUrl: `${NGROK_BASE}/v1/payment_methods/urlencoded-to-json`,
            credentials: credentials
        },
        {
            connectionId: 'conn-xml-to-json',
            connectionUrl: `${NGROK_BASE}/v1/payment_methods/xml-to-json`,
            credentials: credentials
        },
        {
            connectionId: 'conn-json-to-urlencoded',
            connectionUrl: `${NGROK_BASE}/v1/payment_methods/json-to-urlencoded`,
            credentials: credentials
        },
    ];

    // Step 4: Configure Skyflow Client
    const skyflowConfig: SkyflowConfig = {
        vaultConfigs: [primaryVaultConfig],
        connectionConfigs: connectionConfigs,
        logLevel: LogLevel.INFO
    };

    // Initialize Skyflow Client
    const skyflowClient: Skyflow = new Skyflow(skyflowConfig);

    const jsonBody: Record<string, string> = {
        card_number: '4111111111111112',
        cardholder_name: 'John Doe'
    };

    const tests: Array<{ label: string; connectionId: string; req: InvokeConnectionRequest }> = [
        {
            label: 'JSON → JSON',
            connectionId: 'conn-json-to-json',
            req: new InvokeConnectionRequest(RequestMethod.POST, jsonBody, { 'Content-Type': 'application/json' })
        },
        {
            label: 'JSON → XML',
            connectionId: 'conn-json-to-xml',
            req: new InvokeConnectionRequest(RequestMethod.POST, jsonBody, { 'Content-Type': 'application/json' })
        },
        {
            label: 'URL-encoded → JSON',
            connectionId: 'conn-urlencoded-to-json',
            req: new InvokeConnectionRequest(RequestMethod.POST, jsonBody, { 'Content-Type': 'application/x-www-form-urlencoded' })
        },
        {
            label: 'XML → JSON',
            connectionId: 'conn-xml-to-json',
            req: new InvokeConnectionRequest(
                RequestMethod.POST,
                '<payment><card_number>4111111111111112</card_number><cardholder_name>John Doe</cardholder_name></payment>' as any,
                { 'Content-Type': 'application/xml' }
            )
        },
        {
            label: 'JSON → URL-encoded',
            connectionId: 'conn-json-to-urlencoded',
            req: new InvokeConnectionRequest(RequestMethod.POST, jsonBody, { 'Content-Type': 'application/json' })
        },
    ];

    // Step 5: Invoke each connection
    for (const test of tests) {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`[${test.label}]`);
        try {
            const response: InvokeConnectionResponse = await skyflowClient
                .connection(test.connectionId)
                .invoke(test.req);

            console.log('Connection invocation successful:', JSON.stringify(response.data, null, 2));
        } catch (error) {
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
}

// Invoke the connection function
invokeSkyflowConnection();
