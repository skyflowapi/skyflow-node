import {
    Credentials,
    Env,
    LogLevel,
    Skyflow,
    SkyflowConfig,
    SkyflowError,
    DeidentifyFileRequest,
    DeidentifyFileOptions,
    DetectEntities,
    TokenFormat,
    TokenType,
    Transformations,
    VaultConfig,
    FileUploadRequest,
    FileUploadOptions,
    DeidentifyTextRequest,
} from 'skyflow-node';

/**
 * Performs deidentification of sensitive information in files
 * @param file - The file to process
 * @param skyflowClient - Initialized Skyflow client
 * @param vaultId - Target vault identifier
 * @returns Object containing base64 encoded file and format, or Error
 */
async function performDeidentifyFile(file: File, skyflowClient: Skyflow, vaultId: string) {
    try {
        // 1. Create deidentify file request with input file
        const deidentifyFile = new DeidentifyFileRequest(file);

        // 2. Configure deidentification options
        const options = new DeidentifyFileOptions();

        // 3. Set token format for deidentified entities
        const tokenFormat = new TokenFormat();
        tokenFormat.setDefault(TokenType.ENTITY_ONLY);
        options.setTokenFormat(tokenFormat);

        // 4. Configure transformations for specific entities
        const transformations = new Transformations();
        transformations.setShiftDays({
            max: 30,
            min: 10,
            entities: [DetectEntities.SSN],
        });
        options.setTransformations(transformations);

        // 5. Execute deidentification
        const response = await skyflowClient
            .detect(vaultId)
            .deidentifyFile(deidentifyFile, options);
        
        return { base64: response.file, format: response.extension };

    } catch (error) {
        if (error instanceof SkyflowError) {
            console.log('Skyflow Error:', {
                code: (error as SkyflowError).error?.http_code,
                message: (error as SkyflowError).message,
                details: (error as SkyflowError).error?.details,
            });
        } else {
            console.log('Unexpected Error:', error);
        }
        return error as Error;
    }
}

/**
 * Uploads a file to Skyflow vault
 * @param file - The file to upload
 * @param skyflowClient - Initialized Skyflow client
 * @param vaultId - Target vault identifier
 */
async function performFileUpload(file: File, skyflowClient: Skyflow, vaultId: string) {
    try {
        // 1. Create file upload request with table and column details
        const request = new FileUploadRequest(
            "table2", 
            "252d05d6-8353-4438-b102-1557097f4e77", 
            "file"
        );

        // 2. Configure upload options
        const options = new FileUploadOptions();
        options.setFileObject(file);

        // 3. Execute file upload
        return await skyflowClient.vault(vaultId).uploadFile(request, options);
    } catch (error) {
        return error;
    }
}

/**
 * Deidentifies sensitive information in text
 * @param text - The text to process
 * @param skyflowClient - Initialized Skyflow client
 * @param vaultId - Target vault identifier
 */
async function performDeidentifyText(text: string, skyflowClient: Skyflow, vaultId: string) {
    try {
        // 1. Create text deidentification request
        const deidentifyText = new DeidentifyTextRequest(text);

        // 2. Execute text deidentification
        return await skyflowClient.detect(vaultId).deidentifyText(deidentifyText);
    } catch (error) {
        return error;
    }
}

export default {
    async fetch(request, env, ctx): Promise<Response> {
        // 1. Set up authentication credentials
        const credentials: Credentials = {
            token: '<BEAERER_TOKEN>', // Replace with your BEARER token
        };

        // Step 2: Configure Vault 
        const primaryVaultConfig: VaultConfig = {
            vaultId: '<VAULT_ID>>',          // Unique vault identifier
            clusterId: '<CLUSTER_ID>>',      // From vault URL
            env: Env.DEV,                   // Deployment environment
            credentials: credentials        // Authentication method
        };

        // 3. Initialize Skyflow client
        const skyflowConfig: SkyflowConfig = {
            vaultConfigs: [primaryVaultConfig],
            logLevel: LogLevel.INFO,
        };
        const skyflowClient: Skyflow = new Skyflow(skyflowConfig);

        // 4. Route requests based on path
        const url = new URL(request.url);

        if (request.method === 'POST') {
            const formData = await request.formData();

            switch (url.pathname) {
                case '/saveFile': {
                    const file = formData.get('file') as File;
                    if (!file || !(file instanceof File)) {
                        return new Response('Invalid file upload', { status: 400 });
                    }
                    const result = await performFileUpload(file, skyflowClient, primaryVaultConfig.vaultId);
                    return new Response(JSON.stringify(result), {
                        headers: { 'Content-Type': 'application/json' },
                    });
                }
                case '/detectFile': {
                    const file = formData.get('file') as File;
                    if (!file || !(file instanceof File)) {
                        return new Response('Invalid file upload', { status: 400 });
                    }
                    const result = await performDeidentifyFile(file, skyflowClient, primaryVaultConfig.vaultId);
                    return new Response(JSON.stringify(result), {
                        headers: { 'Content-Type': 'application/json' },
                    });
                }
                case '/detectText': {
                    const text = formData.get('text') as string;
                    if (!text || typeof text !== 'string') {
                        return new Response('Invalid text input', { status: 400 });
                    }
                    const result = await performDeidentifyText(text, skyflowClient, primaryVaultConfig.vaultId);
                    return new Response(JSON.stringify(result), {
                        headers: { 'Content-Type': 'application/json' },
                    });
                }
            }
        }

        return new Response('Not Found', { status: 404 });
    },
} satisfies ExportedHandler<Env>;
