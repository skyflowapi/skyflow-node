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
  MaskingMethod,
  DetectOutputTranscription,
  TokenFormat,
  TokenType,
  Transformations,
  Bleep,
  VaultConfig,
  DeidentifyFileResponse,
} from 'skyflow-node'; 
import fs from 'fs';

/**
 * Skyflow Deidentify File Example
 * 
 * This sample demonstrates how to use all available options for deidentifying files.
 * Supported file types: images (jpg, png, etc.), pdf, audio (mp3, wav), documents, spreadsheets, presentations, structured text.
 * 
 * Note: File deidentification requires Node.js version 20 or above.
 */

async function performDeidentifyFile() {
  try {
    // Step 1: Configure Credentials
    const credentials: Credentials = {
      path: 'path-to-credentials-json', // Path to credentials file
    };

    // Step 2: Configure Vault
    const primaryVaultConfig: VaultConfig = {
      vaultId: '<VAULT_ID>',
      clusterId: '<CLUSTER_ID>',
      env: Env.PROD,
      credentials: credentials,
    };

    // Step 3: Configure Skyflow Client
    const skyflowConfig: SkyflowConfig = {
      vaultConfigs: [primaryVaultConfig],
      logLevel: LogLevel.INFO,        // Recommended to use LogLevel.ERROR in production environment.
    };

    // Initialize Skyflow Client
    const skyflowClient: Skyflow = new Skyflow(skyflowConfig);

    // Step 4: Prepare Deidentify File Request
    // Replace with your file object (e.g., from fs.readFileSync or browser File API)
    const buffer = fs.readFileSync('<FILE_PATH>'); // Replace with the path to your file
    const file = new File([buffer], '<FILE_PATH>');
    const deidentifyFile = new DeidentifyFileRequest(file);

    // Step 5: Configure DeidentifyFileOptions
    const options = new DeidentifyFileOptions();

    // Entities to detect and deidentify
    options.setEntities([DetectEntities.SSN, DetectEntities.CREDIT_CARD]);

    // Allowlist regex patterns (entities matching these will NOT be deidentified)
    options.setAllowRegexList(['<YOUR_REGEX_PATTERN>']);

    // Restrict deidentification to entities matching these regex patterns
    options.setRestrictRegexList(['<YOUR_REGEX_PATTERN>']);

    // Token format for deidentified entities
    const tokenFormat = new TokenFormat();
    tokenFormat.setDefault(TokenType.ENTITY_ONLY);
    options.setTokenFormat(tokenFormat);

    // Custom transformations for entities
    // const transformations = new Transformations(); // Transformations cannot be applied to Documents, Images, or PDFs file formats.
    // transformations.setShiftDays({
    //   max: 30,
    //   min: 10,
    //   entities: [DetectEntities.SSN],
    // });
    // options.setTransformations(transformations);

    // Output directory for saving the deidentified file
    options.setOutputDirectory('<OUTPUT_DIRECTORY_PATH>'); // Replace with your output directory

    // Wait time for response (max 64 seconds)
    options.setWaitTime(15);

    // --- Image Options (apply when file is an image) ---
    // options.setOutputProcessedImage(true); // Include processed image in output
    // options.setOutputOcrText(true);        // Include OCR text in response
    // options.setMaskingMethod(MaskingMethod.Blackbox); // Masking method for image entities

    // --- PDF Options (apply when file is a PDF) ---
    // options.setPixelDensity(1.5); // Pixel density for PDF processing
    // options.setMaxResolution(2000); // Max resolution for PDF

    // --- Audio Options (apply when file is audio) ---
    // options.setOutputProcessedAudio(true); // Include processed audio in output
    // options.setOutputTranscription(DetectOutputTranscription.PLAINTEXT_TRANSCRIPTION); // Type of transcription

    // Bleep audio configuration
    // const bleep = new Bleep();
    // bleep.setGain(5);           // Loudness in dB
    // bleep.setFrequency(1000);   // Pitch in Hz
    // bleep.setStartPadding(0.1); // Padding at start in seconds
    // bleep.setStopPadding(0.2);  // Padding at end in seconds
    // options.setBleep(bleep);


    // Step 6: Call deidentifyFile API
    const response: DeidentifyFileResponse = await skyflowClient
      .detect(primaryVaultConfig.vaultId)
      .deidentifyFile(deidentifyFile, options);

    // Handle Successful Response
    console.log('Deidentify File Response:', response);

  } catch (error) {
      // Comprehensive Error Handling
      if (error instanceof SkyflowError) {
          console.error('Skyflow Specific Error:', {
              code: error.error?.http_code,
              message: error.message,
              details: error.error?.details,
          });
      } else {
          console.error('Unexpected Error:', JSON.stringify(error));
      }
  }
}

// Invoke the deidentify file function
performDeidentifyFile();