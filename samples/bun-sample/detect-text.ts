import {
    Credentials,
    DeidentifyTextOptions,
    DeidentifyTextRequest,
    DeidentifyTextResponse,
    DetectEntities,
    Env,
    LogLevel,
    Skyflow,
    SkyflowConfig,
    SkyflowError,
    TokenFormat,
    TokenType,
    Transformations,
    VaultConfig,
} from "skyflow-node";

/**
 * Skyflow Deidentify Text Example
 *
 * This example demonstrates how to:
 * 1. Configure credentials
 * 2. Set up vault configuration
 * 3. Create a deidentify text request
 * 4. Use all available options for deidentification
 * 5. Handle response and errors
 */

async function performDeidentifyText() {
    try {
        // Step 1: Configure Credentials
        const credentials: Credentials = {
            path: "path-to-credentials-json", // Path to credentials file
        };

        // Step 2: Configure Vault
        const primaryVaultConfig: VaultConfig = {
            vaultId: "<VAULT_ID>", // Unique vault identifier
            clusterId: "<CLUSTER_ID>", // From vault URL
            env: Env.PROD, // Deployment environment
            credentials: credentials, // Authentication method
        };

        // Step 3: Configure Skyflow Client
        const skyflowConfig: SkyflowConfig = {
            vaultConfigs: [primaryVaultConfig],
            logLevel: LogLevel.INFO, // Recommended to use LogLevel.ERROR in production environment.
        };

        // Initialize Skyflow Client
        const skyflowClient: Skyflow = new Skyflow(skyflowConfig);

        // Step 4: Prepare Deidentify Text Request
        const deidentifyTextRequest = new DeidentifyTextRequest(
            "My SSN is 123-45-6789 and my card is 4111 1111 1111 1111.", // Text to be deidentified
        );

        // Step 5: Configure DeidentifyTextOptions
        const optionsText = new DeidentifyTextOptions();

        // setEntities: Specify which entities to deidentify
        optionsText.setEntities([DetectEntities.CREDIT_CARD, DetectEntities.SSN]);

        // setAllowRegexList: Allowlist regex patterns (entities matching these will not be deidentified)
        // optionsText.setAllowRegexList(['<YOUR_REGEX_PATTERN>']);

        // setRestrictRegexList: Restrict deidentification to entities matching these regex patterns
        // optionsText.setRestrictRegexList(['<YOUR_REGEX_PATTERN>']);

        // setTokenFormat: Specify the token format for deidentified entities
        const tokenFormat = new TokenFormat();
        tokenFormat.setDefault(TokenType.VAULT_TOKEN);
        optionsText.setTokenFormat(tokenFormat);

        // setTransformations: Specify custom transformations for entities
        const transformations = new Transformations();
        transformations.setShiftDays({
            max: 30, // Maximum shift days
            min: 30, // Minimum shift days
            entities: [DetectEntities.DOB], // Entities to apply the shift
        });
        optionsText.setTransformations(transformations);

        // Step 6: Call deidentifyText API
        const response: DeidentifyTextResponse = await skyflowClient
            .detect(primaryVaultConfig.vaultId)
            .deidentifyText(deidentifyTextRequest, optionsText);

        // Handle Successful Response
        console.log("Deidentify Text Response:", response);
    } catch (error) {
        // Comprehensive Error Handling
        if (error instanceof SkyflowError) {
            console.error("Skyflow Specific Error:", {
                code: error.error?.http_code,
                message: error.message,
                details: error.error?.details,
            });
        } else {
            console.error("Unexpected Error:", JSON.stringify(error));
        }
    }
}

// Invoke the deidentify text function
performDeidentifyText();