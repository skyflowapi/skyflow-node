import {
    Credentials,
    Env,
    GetRequest,
    GetOptions,
    GetResponse,
    InsertRequest,
    LogLevel,
    RedactionType,
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
            token: 'BEARER_TOKEN',
        };

        // Step 2: Configure Primary Vault (source)
        const primaryVaultConfig: VaultConfig = {
            vaultId: '<VAULT_ID>',
            clusterId: '<CLUSTER_ID>',
            env: Env.DEV,
            credentials: credentials,
        };

        // Step 3: Configure Skyflow Client
        const skyflowConfig: SkyflowConfig = {
            vaultConfigs: [primaryVaultConfig],
            logLevel: LogLevel.WARN,
        };

        const skyflowClient: Skyflow = new Skyflow(skyflowConfig);

        // Step 4: (In a real data-residency scenario, addVaultConfig a second vault here)
        // For this demo, source and destination are the same vault.

        // Step 5: Get Data from Primary Vault
        const getIds: Array<string> = [
            '<SKYFLOW_ID>',
        ];

        const tableName: string = 'table1';

        const getRequest: GetRequest = new GetRequest(tableName, getIds);
        const getOptions: GetOptions = new GetOptions();
        getOptions.setReturnTokens(false);  // Get plaintext to re-insert into destination vault
        getOptions.setRedactionType(RedactionType.PLAIN_TEXT);

        // Perform Get request on Primary Vault
        const getResponse: GetResponse = await skyflowClient
            .vault('<VAULT_ID>')
            .get(getRequest, getOptions);

        // Step 6: Handle Get Response and Insert Data into Secondary Vault
        const getResponseData: GetResponse = getResponse as GetResponse;

        const insertData: Array<Record<string, unknown>> = getResponseData.data!;

        // Remove skyflow_id from the data (if needed for re-insertion)
        const sanitizedData = insertData.map((item: Record<string, unknown>) => {
            // Strip skyflowId, deprecated skyflow_id getter, file columns, and nulls before re-insertion
            return Object.fromEntries(
                Object.entries(item).filter(([k, v]) =>
                    k !== 'skyflowId' && k !== 'skyflow_id' && k !== 'file' && v !== null
                )
            );
        });

        // Step 7: Insert Data into Secondary Vault
        const insertRequest: InsertRequest = new InsertRequest(
            tableName,  // Same table name or different as needed
            sanitizedData,
        );

        // Perform Insert request on Secondary Vault
        const insertResponse: InsertResponse = await skyflowClient
            .vault('<VAULT_ID>')
            .insert(insertRequest);

        console.log('Data successfully inserted into secondary vault:', insertResponse);

        // v1 backward-compat: skyflow_id deprecated getter on get response
        const getRecord = getResponse.data?.[0];
        const v1GetId = (getRecord as any)?.skyflow_id; // fires WARN
        console.log('[v1] get skyflow_id   :', v1GetId);
        console.log('[v2] get skyflowId    :', getRecord?.skyflowId);

        // v1 backward-compat: skyflow_id deprecated getter on insert response
        const insertField = insertResponse.insertedFields?.[0];
        const v1InsertId = (insertField as any)?.skyflow_id; // fires WARN
        console.log('[v1] insert skyflow_id:', v1InsertId);
        console.log('[v2] insert skyflowId :', insertField?.skyflowId);

        const getMatch = v1GetId && getRecord?.skyflowId && v1GetId === getRecord.skyflowId;
        const insertMatch = v1InsertId && insertField?.skyflowId && v1InsertId === insertField.skyflowId;
        console.log('v1/v2 get match    :', getMatch ? 'PASS' : 'FAIL');
        console.log('v1/v2 insert match :', insertMatch ? 'PASS' : 'FAIL');

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
