const fs = require('fs');
const path = require('path');
const { validateDeidentifyFileRequest, validateSkyflowConfig, validateVaultConfig, validateUpdateVaultConfig, validateSkyflowCredentials, validateConnectionConfig, validateUpdateConnectionConfig, validateInsertRequest, validateUpdateRequest, validateGetRequest, validateDetokenizeRequest, validateTokenizeRequest, validateDeleteRequest, validateUploadFileRequest, validateQueryRequest, validateDeIdentifyTextRequest, validateReidentifyTextRequest, validateGetDetectRunRequest, validateInvokeConnectionRequest, validateUpdateOptions, validateGetColumnRequest, validateCredentialsWithId } = require('../../src/utils/validations');
const DeidentifyFileRequest = require('../../src/vault/model/request/deidentify-file').default;
const DeidentifyFileOptions = require('../../src/vault/model/options/deidentify-file').default;
const SKYFLOW_ERROR_CODE = require('../../src/error/codes');
const { default: TokenFormat } = require('../../src/vault/model/options/deidentify-text/token-format');
const { DetectEntities, Env, TokenMode, OrderByEnum } = require('../../src/utils');
const { LogLevel } = require('../../src/utils');
const { default: Transformations } = require('../../src/vault/model/options/deidentify-text/transformations');

describe('validateDeidentifyFileRequest', () => {
    let mockFile;
    let mockFilePath;

    beforeEach(() => {
        // Create a mock File object
        mockFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
        mockFilePath = '/path/to/file.txt';
        jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
        jest.spyOn(fs, 'lstatSync').mockImplementation(() => ({
            isFile: () => true,
            isDirectory: () => true
        }));
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('should throw error when request is null', () => {
        expect(() => validateDeidentifyFileRequest(null))
            .toThrow(SKYFLOW_ERROR_CODE.INVALID_DEIDENTIFY_FILE_REQUEST);
    });

    test('should throw error when request is undefined', () => {
        expect(() => validateDeidentifyFileRequest(undefined))
            .toThrow(SKYFLOW_ERROR_CODE.INVALID_DEIDENTIFY_FILE_REQUEST);
    });

    test('should throw error when neither file nor filePath is provided', () => {
        const request = new DeidentifyFileRequest({});
        expect(() => validateDeidentifyFileRequest(request))
            .toThrow(SKYFLOW_ERROR_CODE.INVALID_DEIDENTIFY_FILE_INPUT);
    });

    test('should throw error when both file and filePath are provided', () => {
        const request = new DeidentifyFileRequest({
            file: mockFile,
            filePath: mockFilePath
        });
        expect(() => validateDeidentifyFileRequest(request))
            .toThrow(SKYFLOW_ERROR_CODE.INVALID_DEIDENTIFY_FILE_INPUT);
    });

    // File object validation tests
    test('should validate request with valid file object', () => {
        const request = new DeidentifyFileRequest({ file: mockFile });
        expect(() => validateDeidentifyFileRequest(request)).not.toThrow();
    });

    test('should throw error for invalid file object', () => {
        const request = new DeidentifyFileRequest({
            file: { invalid: 'file' }
        });
        expect(() => validateDeidentifyFileRequest(request))
            .toThrow(SKYFLOW_ERROR_CODE.INVALID_FILE_TYPE);
    });

    test('should throw error for file with empty name', () => {
        const invalidFile = new File(['content'], '', { type: 'text/plain' });
        const request = new DeidentifyFileRequest({ file: invalidFile });
        expect(() => validateDeidentifyFileRequest(request))
            .toThrow(SKYFLOW_ERROR_CODE.INVALID_FILE_TYPE);
    });

    test('should throw error when file is not a File instance', () => {
        const request = new DeidentifyFileRequest({
            file: { name: 'test.txt', type: 'text/plain' }
        });
        expect(() => validateDeidentifyFileRequest(request))
            .toThrow(SKYFLOW_ERROR_CODE.INVALID_FILE_TYPE);
    });

    test('should throw error when file name is invalid', () => {
        const invalidFile = new File(['content'], '   ', { type: 'text/plain' });
        const request = new DeidentifyFileRequest({ file: invalidFile });
        expect(() => validateDeidentifyFileRequest(request))
            .toThrow(SKYFLOW_ERROR_CODE.INVALID_FILE_TYPE);
    });

    // File path validation tests
    test('should validate request with valid file path', () => {
        const request = new DeidentifyFileRequest({ filePath: mockFilePath });
        expect(() => validateDeidentifyFileRequest(request)).not.toThrow();
    });

    test('should throw error for non-existent file path', () => {
        jest.spyOn(fs, 'existsSync').mockImplementation(() => false);
        const request = new DeidentifyFileRequest({
            filePath: '/invalid/path.txt'
        });
        expect(() => validateDeidentifyFileRequest(request))
            .toThrow(SKYFLOW_ERROR_CODE.INVALID_DEIDENTIFY_FILE_PATH);
    });

    test('should throw error when file path points to directory', () => {
        jest.spyOn(fs, 'lstatSync').mockImplementation(() => ({
            isFile: () => false
        }));
        const request = new DeidentifyFileRequest({
            filePath: '/path/to/directory'
        });
        expect(() => validateDeidentifyFileRequest(request))
            .toThrow(SKYFLOW_ERROR_CODE.INVALID_DEIDENTIFY_FILE_PATH);
    });

    test('should throw error for empty file path', () => {
        const request = new DeidentifyFileRequest({ filePath: '' });
        expect(() => validateDeidentifyFileRequest(request))
            .toThrow(SKYFLOW_ERROR_CODE.INVALID_DEIDENTIFY_FILE_PATH);
    });

    // Options validation tests 
    test('should validate request with options containing valid wait time', () => {
        const request = new DeidentifyFileRequest({ file: mockFile });
        const options = new DeidentifyFileOptions();
        options.setWaitTime(30);
        expect(() => validateDeidentifyFileRequest(request, options)).not.toThrow();
    });

    test('should throw error for invalid wait time', () => {
        const request = new DeidentifyFileRequest({ file: mockFile });
        const options = new DeidentifyFileOptions();
        options.setWaitTime(65); // More than maximum allowed
        expect(() => validateDeidentifyFileRequest(request, options))
            .toThrow();
    });

    test('should validate request with valid output directory', () => {
        const request = new DeidentifyFileRequest({ file: mockFile });
        const options = new DeidentifyFileOptions();
        options.setOutputDirectory('/valid/output/dir');
        expect(() => validateDeidentifyFileRequest(request, options)).not.toThrow();
    });

    test('should throw error when output directory does not exist', () => {
        jest.spyOn(fs, 'existsSync').mockImplementation(() => false);
        const request = new DeidentifyFileRequest({ file: mockFile });
        const options = new DeidentifyFileOptions();
        options.setOutputDirectory('/nonexistent/dir');
        expect(() => validateDeidentifyFileRequest(request, options))
            .toThrow(SKYFLOW_ERROR_CODE.INVALID_OUTPUT_DIRECTORY_PATH);
    });

    test('should validate request with valid entities array', () => {
        const request = new DeidentifyFileRequest({ file: mockFile });
        const options = new DeidentifyFileOptions();
        options.setEntities(['PERSON', 'LOCATION']);
        expect(() => validateDeidentifyFileRequest(request, options)).not.toThrow();
    });

    test('should throw error for invalid entities type', () => {
        const request = new DeidentifyFileRequest({ file: mockFile });
        const options = new DeidentifyFileOptions();
        options.setEntities('PERSON');
        expect(() => validateDeidentifyFileRequest(request, options))
            .toThrow(SKYFLOW_ERROR_CODE.INVALID_ENTITIES);
    });

    test('should validate request with valid allow regex list', () => {
        const request = new DeidentifyFileRequest({ file: mockFile });
        const options = new DeidentifyFileOptions();
        options.setAllowRegexList(['^test', 'pattern$']);
        expect(() => validateDeidentifyFileRequest(request, options)).not.toThrow();
    });

    test('should throw error for invalid allow regex list', () => {
        const request = new DeidentifyFileRequest({ file: mockFile });
        const options = new DeidentifyFileOptions();
        options.setAllowRegexList('pattern');
        expect(() => validateDeidentifyFileRequest(request, options))
            .toThrow(SKYFLOW_ERROR_CODE.INVALID_ALLOW_REGEX_LIST);
    });

    test('should validate request with valid entities array', () => {
        const request = new DeidentifyFileRequest({ file: mockFile });
        const options = new DeidentifyFileOptions();
        options.setEntities(['PERSON', 'LOCATION']);
        expect(() => validateDeidentifyFileRequest(request, options)).not.toThrow();
    });

    test('should throw error for invalid entities type', () => {
        const request = new DeidentifyFileRequest({ file: mockFile });
        const options = new DeidentifyFileOptions();
        options.setEntities('PERSON');
        expect(() => validateDeidentifyFileRequest(request, options))
            .toThrow(SKYFLOW_ERROR_CODE.INVALID_ENTITIES);
    });

    test('should validate request with valid allow regex list', () => {
        const request = new DeidentifyFileRequest({ file: mockFile });
        const options = new DeidentifyFileOptions();
        options.setAllowRegexList(['^test', 'pattern$']);
        expect(() => validateDeidentifyFileRequest(request, options)).not.toThrow();
    });



    test('should throw error when options is invalid', () => {
        const request = new DeidentifyFileRequest({ file: mockFile });
        expect(() => validateDeidentifyFileRequest(request, {}))
            .toThrow(SKYFLOW_ERROR_CODE.INVALID_DEIDENTIFY_FILE_OPTIONS);
    });

    test('should throw error for invalid transformations', () => {
        const request = new DeidentifyFileRequest({ file: mockFile });
        const options = new DeidentifyFileOptions();
        options.setTransformations({});
        expect(() => validateDeidentifyFileRequest(request, options))
            .toThrow(SKYFLOW_ERROR_CODE.INVALID_TRANSFORMATIONS);
    });

    test('should throw error for invalid output processed image type', () => {
        const request = new DeidentifyFileRequest({ file: mockFile });
        const options = new DeidentifyFileOptions();
        options.setOutputProcessedImage('true');
        expect(() => validateDeidentifyFileRequest(request, options))
            .toThrow(SKYFLOW_ERROR_CODE.INVALID_OUTPUT_PROCESSED_IMAGE);
    });

 

    test('should throw error for invalid masking method type', () => {
        const request = new DeidentifyFileRequest({ file: mockFile });
        const options = new DeidentifyFileOptions();
        options.setMaskingMethod(123);
        expect(() => validateDeidentifyFileRequest(request, options))
            .toThrow(SKYFLOW_ERROR_CODE.INVALID_MASKING_METHOD);
    });

    test('should throw error for invalid pixel density type', () => {
        const request = new DeidentifyFileRequest({ file: mockFile });
        const options = new DeidentifyFileOptions();
        options.setPixelDensity('300');
        expect(() => validateDeidentifyFileRequest(request, options))
            .toThrow(SKYFLOW_ERROR_CODE.INVALID_PIXEL_DENSITY);
    });

    test('should throw error for invalid max resolution type', () => {
        const request = new DeidentifyFileRequest({ file: mockFile });
        const options = new DeidentifyFileOptions();
        options.setMaxResolution('1024');
        expect(() => validateDeidentifyFileRequest(request, options))
            .toThrow(SKYFLOW_ERROR_CODE.INVALID_MAX_RESOLUTION);
    });

    test('should throw error for invalid output processed audio type', () => {
        const request = new DeidentifyFileRequest({ file: mockFile });
        const options = new DeidentifyFileOptions();
        options.setOutputProcessedAudio('true');
        expect(() => validateDeidentifyFileRequest(request, options))
            .toThrow(SKYFLOW_ERROR_CODE.INVALID_OUTPUT_PROCESSED_AUDIO);
    });

    test('should throw error for invalid output transcription type', () => {
        const request = new DeidentifyFileRequest({ file: mockFile });
        const options = new DeidentifyFileOptions();
        options.setOutputTranscription(123);
        expect(() => validateDeidentifyFileRequest(request, options))
            .toThrow(SKYFLOW_ERROR_CODE.INVALID_OUTPUT_TRANSCRIPTION);
    });

    test("should throw error in case of vault token in deidentify file request", () => {
        const request = new DeidentifyFileRequest({ file: mockFile });
        const options = new DeidentifyFileOptions();
        const tokenFormat = new TokenFormat();
        tokenFormat.setVaultToken(DetectEntities.CREDIT_CARD);
        options.setTokenFormat(tokenFormat);

        expect(() => validateDeidentifyFileRequest(request, options))
            .toThrow(SKYFLOW_ERROR_CODE.INVALID_VAULT_TOKEN);
    });

    test('should validate request with all valid parameters', () => {
        const request = new DeidentifyFileRequest({ file: mockFile });
        const options = new DeidentifyFileOptions();
        options.setWaitTime(30);
        options.setOutputDirectory('/valid/output/dir');
        options.setEntities(['PERSON', 'LOCATION']);
        options.setAllowRegexList(['^test', 'pattern$']);
        expect(() => validateDeidentifyFileRequest(request, options)).not.toThrow();
    });
});

describe('validateSkyflowConfig', () => {
  // Test for null/undefined config
  test('should throw error when config is null/undefined', () => {
    expect(() => validateSkyflowConfig(null)).toThrow(SKYFLOW_ERROR_CODE.CONFIG_MISSING);
    expect(() => validateSkyflowConfig(undefined)).toThrow(SKYFLOW_ERROR_CODE.CONFIG_MISSING);
  });

  // Test for missing both vaultConfigs and connectionConfigs
  test('should throw error when both vaultConfigs and connectionConfigs are missing', () => {
    const config = {};
    expect(() => validateSkyflowConfig(config)).toThrow(SKYFLOW_ERROR_CODE.INVALID_SKYFLOW_CONFIG);
  });

  // Test for invalid vaultConfigs type
  test('should throw error when vaultConfigs is not an array', () => {
    const config = {
      vaultConfigs: {} // Not an array
    };
    expect(() => validateSkyflowConfig(config)).toThrow(SKYFLOW_ERROR_CODE.INVALID_TYPE_FOR_CONFIG);
  });

  // Test for invalid connectionConfigs type
  test('should throw error when connectionConfigs is not an array', () => {
    const config = {
      connectionConfigs: {} // Not an array
    };
    expect(() => validateSkyflowConfig(config)).toThrow(SKYFLOW_ERROR_CODE.INVALID_TYPE_FOR_CONFIG);
  });

  // Test for valid config with vaultConfigs only
  test('should validate config with valid vaultConfigs array', () => {
    const config = {
      vaultConfigs: []
    };
    expect(() => validateSkyflowConfig(config)).not.toThrow();
  });

  // Test for valid config with connectionConfigs only
  test('should validate config with valid connectionConfigs array', () => {
    const config = {
      connectionConfigs: []
    };
    expect(() => validateSkyflowConfig(config)).not.toThrow();
  });

  // Test for valid config with both configs
  test('should validate config with both valid vaultConfigs and connectionConfigs', () => {
    const config = {
      vaultConfigs: [],
      connectionConfigs: []
    };
    expect(() => validateSkyflowConfig(config)).not.toThrow();
  });

  // Test different log levels
  test('should work with different log levels', () => {
    const config = {
      vaultConfigs: []
    };
    expect(() => validateSkyflowConfig(config, LogLevel.DEBUG)).not.toThrow();
    expect(() => validateSkyflowConfig(config, LogLevel.INFO)).not.toThrow();
    expect(() => validateSkyflowConfig(config, LogLevel.WARN)).not.toThrow();
    expect(() => validateSkyflowConfig(config, LogLevel.ERROR)).not.toThrow();
  });

  // Test with empty arrays
  test('should accept empty arrays for both configs', () => {
    const config = {
      vaultConfigs: [],
      connectionConfigs: []
    };
    expect(() => validateSkyflowConfig(config)).not.toThrow();
  });

  // Test with null arrays
  test('should throw error when arrays are null', () => {
    const config = {
      vaultConfigs: null,
      connectionConfigs: null
    };
    expect(() => validateSkyflowConfig(config)).toThrow(SKYFLOW_ERROR_CODE.INVALID_TYPE_FOR_CONFIG);
  });

  // Test with undefined arrays
  test('should handle undefined arrays gracefully', () => {
    const config = {
      vaultConfigs: undefined,
      connectionConfigs: undefined
    };
    expect(() => validateSkyflowConfig(config)).toThrow(SKYFLOW_ERROR_CODE.INVALID_SKYFLOW_CONFIG);
  });
});

describe('validateVaultConfig', () => {
  // Test for null/undefined config
  test('should throw error when vaultConfig is null/undefined', () => {
    expect(() => validateVaultConfig(null)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_VAULT_CONFIG);
    expect(() => validateVaultConfig(undefined)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_VAULT_CONFIG);
  });

  // Test for missing vaultId
  test('should throw error when vaultId is missing', () => {
    const config = {
      clusterId: 'test-cluster'
    };
    expect(() => validateVaultConfig(config)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_VAULT_ID);
  });

  // Test for invalid vaultId
  test('should throw error when vaultId is invalid', () => {
    const config = {
      vaultId: '',  // empty string
      clusterId: 'test-cluster'
    };
    expect(() => validateVaultConfig(config)).toThrow(SKYFLOW_ERROR_CODE.INVALID_VAULT_ID);

    const config2 = {
      vaultId: 123,  // not a string
      clusterId: 'test-cluster'
    };
    expect(() => validateVaultConfig(config2)).toThrow(SKYFLOW_ERROR_CODE.INVALID_VAULT_ID);
  });

  // Test for missing clusterId
  test('should throw error when clusterId is missing', () => {
    const config = {
      vaultId: 'test-vault'
    };
    expect(() => validateVaultConfig(config)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_CLUSTER_ID);
  });

  // Test for invalid clusterId
  test('should throw error when clusterId is invalid', () => {
    const config = {
      vaultId: 'test-vault',
      clusterId: ''  // empty string
    };
    expect(() => validateVaultConfig(config)).toThrow(SKYFLOW_ERROR_CODE.INVALID_CLUSTER_ID);

    const config2 = {
      vaultId: 'test-vault',
      clusterId: 123  // not a string
    };
    expect(() => validateVaultConfig(config2)).toThrow(SKYFLOW_ERROR_CODE.INVALID_CLUSTER_ID);
  });

  // Test for invalid env
  test('should throw error when env is invalid', () => {
    const config = {
      vaultId: 'test-vault',
      clusterId: 'test-cluster',
      env: 'INVALID_ENV'
    };
    expect(() => validateVaultConfig(config)).toThrow(SKYFLOW_ERROR_CODE.INVALID_ENV);
  });

  // Test for valid env values
  test('should accept valid env values', () => {
    const config = {
      vaultId: 'test-vault',
      clusterId: 'test-cluster',
      env: Env.PROD
    };
    expect(() => validateVaultConfig(config)).not.toThrow();
  });

  // Test for valid configuration
  test('should accept valid vault configuration', () => {
    const config = {
      vaultId: 'test-vault',
      clusterId: 'test-cluster',
      env: Env.PROD,
      credentials: {
        apiKey: 'sky-key-123'  // Valid API key format
      }
    };
    expect(() => validateVaultConfig(config)).not.toThrow();
  });

  // Test different log levels
  test('should work with different log levels', () => {
    const config = {
      vaultId: 'test-vault',
      clusterId: 'test-cluster'
    };
    expect(() => validateVaultConfig(config, LogLevel.DEBUG)).not.toThrow();
    expect(() => validateVaultConfig(config, LogLevel.INFO)).not.toThrow();
    expect(() => validateVaultConfig(config, LogLevel.WARN)).not.toThrow();
    expect(() => validateVaultConfig(config, LogLevel.ERROR)).not.toThrow();
  });

  // Test for empty strings
  test('should throw error for empty string values', () => {
    const config = {
      vaultId: '',  // whitespace only
      clusterId: 'test-cluster'
    };
    expect(() => validateVaultConfig(config)).toThrow(SKYFLOW_ERROR_CODE.INVALID_VAULT_ID);
  });

  // Test for proper error messages
  test('should throw errors with proper error codes', () => {
    const config = {
      vaultId: 'test-vault',
      clusterId: ''
    };
    try {
      validateVaultConfig(config);
    } catch (error) {
      expect(error.code).toBe(SKYFLOW_ERROR_CODE.INVALID_CLUSTER_ID);
    }
  });
});

describe('validateUpdateVaultConfig', () => {
  // Test for null/undefined config
  test('should throw error when vaultConfig is null/undefined', () => {
    expect(() => validateUpdateVaultConfig(null)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_VAULT_CONFIG);
    expect(() => validateUpdateVaultConfig(undefined)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_VAULT_CONFIG);
  });

  // Test for missing vaultId
  test('should throw error when vaultId is missing', () => {
    const config = {
      clusterId: 'test-cluster',
      env: Env.PROD
    };
    expect(() => validateUpdateVaultConfig(config)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_VAULT_ID);
  });

  // Test for invalid vaultId
  test('should throw error when vaultId is invalid', () => {
    const config = {
      vaultId: '',  // empty string
      clusterId: 'test-cluster'
    };
    expect(() => validateUpdateVaultConfig(config)).toThrow(SKYFLOW_ERROR_CODE.INVALID_VAULT_ID);

    const config2 = {
      vaultId: 123,  // not a string
      clusterId: 'test-cluster'
    };
    expect(() => validateUpdateVaultConfig(config2)).toThrow(SKYFLOW_ERROR_CODE.INVALID_VAULT_ID);
  });

  // Test for invalid clusterId type
  test('should throw error when clusterId is invalid type', () => {
    const config = {
      vaultId: 'test-vault',
      clusterId: 123  // not a string
    };
    expect(() => validateUpdateVaultConfig(config)).toThrow(SKYFLOW_ERROR_CODE.INVALID_CLUSTER_ID);
  });

  // Test for invalid env
  test('should throw error when env is invalid', () => {
    const config = {
      vaultId: 'test-vault',
      env: 'INVALID_ENV'
    };
    expect(() => validateUpdateVaultConfig(config)).toThrow(SKYFLOW_ERROR_CODE.INVALID_ENV);
  });

  // Test for credentials validation
  test('should validate credentials if provided', () => {
    const config = {
      vaultId: 'test-vault',
      credentials: {
        apiKey: 'invalid-key'  // Invalid API key format
      }
    };
    expect(() => validateUpdateVaultConfig(config)).toThrow(SKYFLOW_ERROR_CODE.INVALID_API_KEY_WITH_ID);
  });

  // Test for valid partial update with only vaultId
  test('should accept valid config with only vaultId', () => {
    const config = {
      vaultId: 'test-vault'
    };
    expect(() => validateUpdateVaultConfig(config)).not.toThrow();
  });

  // Test for valid partial update with some fields
  test('should accept valid partial vault configuration', () => {
    const config = {
      vaultId: 'test-vault',
      clusterId: 'test-cluster'
    };
    expect(() => validateUpdateVaultConfig(config)).not.toThrow();
  });

  // Test for valid full update
  test('should accept valid full vault configuration', () => {
    const config = {
      vaultId: 'test-vault',
      clusterId: 'test-cluster',
      env: Env.PROD,
      credentials: {
        apiKey: 'sky-key-123'  // Valid API key format
      }
    };
    expect(() => validateUpdateVaultConfig(config)).not.toThrow();
  });

  // Test different log levels
  test('should work with different log levels', () => {
    const config = {
      vaultId: 'test-vault'
    };
    expect(() => validateUpdateVaultConfig(config, LogLevel.DEBUG)).not.toThrow();
    expect(() => validateUpdateVaultConfig(config, LogLevel.INFO)).not.toThrow();
    expect(() => validateUpdateVaultConfig(config, LogLevel.WARN)).not.toThrow();
    expect(() => validateUpdateVaultConfig(config, LogLevel.ERROR)).not.toThrow();
  });

  // Test for whitespace values
  test('should throw error for whitespace string values', () => {
    const config = {
      vaultId: '',  // whitespace only
    };
    expect(() => validateUpdateVaultConfig(config)).toThrow(SKYFLOW_ERROR_CODE.INVALID_VAULT_ID);
  });
});

describe('validateSkyflowCredentials', () => {
  // Test for null/undefined credentials
  test('should throw error when credentials are null/undefined', () => {
    expect(() => validateSkyflowCredentials(null)).toThrow(SKYFLOW_ERROR_CODE.CREDENTIALS_WITH_NO_VALID_KEY);
    expect(() => validateSkyflowCredentials(undefined)).toThrow(SKYFLOW_ERROR_CODE.CREDENTIALS_WITH_NO_VALID_KEY);
  });

  // Test for empty credentials object
  test('should throw error when credentials object is empty', () => {
    expect(() => validateSkyflowCredentials({})).toThrow(SKYFLOW_ERROR_CODE.CREDENTIALS_WITH_NO_VALID_KEY);
  });

  // Test for multiple credential types
  test('should throw error when multiple credential types are provided', () => {
    const credentials = {
      token: 'valid-token',
      apiKey: 'sky-key-123'
    };
    expect(() => validateSkyflowCredentials(credentials)).toThrow(SKYFLOW_ERROR_CODE.MULTIPLE_CREDENTIALS_PASSED);
  });

  // Test TokenCredentials validation
  describe('TokenCredentials validation', () => {
    test('should accept valid token credentials', () => {
      const credentials = {
        token: 'valid-non-expired-token'
      };
      jest.spyOn(require('../../src/utils/jwt-utils'), 'isExpired').mockReturnValue(false);
      expect(() => validateSkyflowCredentials(credentials)).not.toThrow();
    });

    test('should throw error for expired token', () => {
      const credentials = {
        token: 'expired-token'
      };
      jest.spyOn(require('../../src/utils/jwt-utils'), 'isExpired').mockReturnValue(true);
      expect(() => validateSkyflowCredentials(credentials)).toThrow(SKYFLOW_ERROR_CODE.INVALID_BEARER_TOKEN);
    });
  });

  // Test PathCredentials validation
  describe('PathCredentials validation', () => {
    test('should accept valid path credentials', () => {
      const credentials = {
        path: '/valid/path/to/file'
      };
      jest.spyOn(require('fs'), 'existsSync').mockReturnValue(true);
      expect(() => validateSkyflowCredentials(credentials)).not.toThrow();
    });

    test('should throw error for invalid path', () => {
      const credentials = {
        path: ''
      };
      expect(() => validateSkyflowCredentials(credentials)).toThrow(SKYFLOW_ERROR_CODE.INVALID_CREDENTIALS_FILE_PATH);
    });

    test('should validate roles if provided', () => {
      const credentials = {
        path: '/valid/path',
        roles: 'invalid-roles' // should be array
      };
      jest.spyOn(require('fs'), 'existsSync').mockReturnValue(true);
      expect(() => validateSkyflowCredentials(credentials)).toThrow(SKYFLOW_ERROR_CODE.INVALID_ROLES_KEY_TYPE);
    });

    test('should validate context if provided', () => {
      const credentials = {
        path: '/valid/path',
        context: 123 // should be string
      };
      jest.spyOn(require('fs'), 'existsSync').mockReturnValue(true);
      expect(() => validateSkyflowCredentials(credentials)).toThrow(SKYFLOW_ERROR_CODE.INVALID_CONTEXT);
    });
  });

  // Test StringCredentials validation
  describe('StringCredentials validation', () => {
    test('should accept valid string credentials', () => {
      const credentials = {
        credentialsString: JSON.stringify({
          clientID: 'test',
          keyID: 'test',
          privateKey: 'test'
        })
      };
      expect(() => validateSkyflowCredentials(credentials)).not.toThrow();
    });

    test('should throw error for invalid credentials string', () => {
      const credentials = {
        credentialsString: 'invalid-json'
      };
      expect(() => validateSkyflowCredentials(credentials)).toThrow(SKYFLOW_ERROR_CODE.INVALID_PARSED_CREDENTIALS_STRING);
    });

    test('should validate roles if provided', () => {
      const credentials = {
        credentialsString: JSON.stringify({
          clientID: 'test',
          keyID: 'test'
        }),
        roles: 'invalid-roles' // should be array
      };
      expect(() => validateSkyflowCredentials(credentials)).toThrow(SKYFLOW_ERROR_CODE.INVALID_ROLES_KEY_TYPE);
    });
  });

  // Test ApiKeyCredentials validation
  describe('ApiKeyCredentials validation', () => {
    test('should accept valid API key credentials', () => {
      const credentials = {
        apiKey: 'sky-key-123'
      };
      expect(() => validateSkyflowCredentials(credentials)).not.toThrow();
    });

    test('should throw error for invalid API key format', () => {
      const credentials = {
        apiKey: 'invalid-key'
      };
      expect(() => validateSkyflowCredentials(credentials)).toThrow(SKYFLOW_ERROR_CODE.INVALID_API_KEY);
    });
  });

  // Test different log levels
  test('should work with different log levels', () => {
    const credentials = {
      apiKey: 'sky-key-123'
    };
    expect(() => validateSkyflowCredentials(credentials, LogLevel.DEBUG)).not.toThrow();
    expect(() => validateSkyflowCredentials(credentials, LogLevel.INFO)).not.toThrow();
    expect(() => validateSkyflowCredentials(credentials, LogLevel.WARN)).not.toThrow();
    expect(() => validateSkyflowCredentials(credentials, LogLevel.ERROR)).not.toThrow();
  });
});


describe('validateConnectionConfig', () => {
  // Test for null/undefined config
  test('should throw error when connectionConfig is null/undefined', () => {
    expect(() => validateConnectionConfig(null)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_CONNECTION_CONFIG);
    expect(() => validateConnectionConfig(undefined)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_CONNECTION_CONFIG);
  });

  // Test for missing connectionId
  test('should throw error when connectionId is missing', () => {
    const config = {
      connectionUrl: 'https://example.com'
    };
    expect(() => validateConnectionConfig(config)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_CONNECTION_ID);
  });

  // Test for invalid connectionId
  test('should throw error when connectionId is invalid', () => {
    const config = {
      connectionId: '',  // empty string
      connectionUrl: 'https://example.com'
    };
    expect(() => validateConnectionConfig(config)).toThrow(SKYFLOW_ERROR_CODE.INVALID_CONNECTION_ID);

    const config2 = {
      connectionId: 123,  // not a string
      connectionUrl: 'https://example.com'
    };
    expect(() => validateConnectionConfig(config2)).toThrow(SKYFLOW_ERROR_CODE.INVALID_CONNECTION_ID);
  });

  // Test for missing connectionUrl
  test('should throw error when connectionUrl is missing', () => {
    const config = {
      connectionId: 'test-connection'
    };
    expect(() => validateConnectionConfig(config)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_CONNECTION_URL);
  });

  // Test for invalid connectionUrl
  test('should throw error when connectionUrl is invalid', () => {
    const config = {
      connectionId: 'test-connection',
      connectionUrl: ''  // empty string
    };
    expect(() => validateConnectionConfig(config)).toThrow(SKYFLOW_ERROR_CODE.INVALID_CONNECTION_URL);

    const config2 = {
      connectionId: 'test-connection',
      connectionUrl: 'not-a-url'  // invalid URL format
    };
    expect(() => validateConnectionConfig(config2)).toThrow(SKYFLOW_ERROR_CODE.INVALID_CONNECTION_URL);
  });

  // Test for invalid URL format
  test('should throw error for invalid URL format', () => {
    const config = {
      connectionId: 'test-connection',
      connectionUrl: 'invalid-url-format'
    };
    expect(() => validateConnectionConfig(config)).toThrow(SKYFLOW_ERROR_CODE.INVALID_CONNECTION_URL);
  });

  // Test credentials validation
  test('should validate credentials if provided', () => {
    const config = {
      connectionId: 'test-connection',
      connectionUrl: 'https://example.com',
      credentials: {
        apiKey: 'invalid-key'  // Invalid API key format
      }
    };
    expect(() => validateConnectionConfig(config)).toThrow(SKYFLOW_ERROR_CODE.INVALID_API_KEY_WITH_ID);
  });

  // Test for valid configuration
  test('should accept valid connection configuration', () => {
    const config = {
      connectionId: 'test-connection',
      connectionUrl: 'https://example.com',
      credentials: {
        apiKey: 'sky-key-123'  // Valid API key format
      }
    };
    expect(() => validateConnectionConfig(config)).not.toThrow();
  });

  // Test different log levels
  test('should work with different log levels', () => {
    const config = {
      connectionId: 'test-connection',
      connectionUrl: 'https://example.com'
    };
    expect(() => validateConnectionConfig(config, LogLevel.DEBUG)).not.toThrow();
    expect(() => validateConnectionConfig(config, LogLevel.INFO)).not.toThrow();
    expect(() => validateConnectionConfig(config, LogLevel.WARN)).not.toThrow();
    expect(() => validateConnectionConfig(config, LogLevel.ERROR)).not.toThrow();
  });

  // Test for whitespace values
  test('should throw error for whitespace string values', () => {
    const config = {
      connectionId: '   ',  // whitespace only
      connectionUrl: 'https://example.com'
    };
    expect(() => validateConnectionConfig(config)).toThrow(SKYFLOW_ERROR_CODE.INVALID_CONNECTION_ID);
  });

  // Test for URL with query parameters
  test('should accept URL with query parameters', () => {
    const config = {
      connectionId: 'test-connection',
      connectionUrl: 'https://example.com/api?key=value'
    };
    expect(() => validateConnectionConfig(config)).not.toThrow();
  });

  // Test for URL with path parameters
  test('should accept URL with path parameters', () => {
    const config = {
      connectionId: 'test-connection',
      connectionUrl: 'https://example.com/api/{param}/value'
    };
    expect(() => validateConnectionConfig(config)).not.toThrow();
  });
});

describe('validateUpdateConnectionConfig', () => {
  // Test for null/undefined config
  test('should throw error when connectionConfig is null/undefined', () => {
    expect(() => validateUpdateConnectionConfig(null)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_CONNECTION_CONFIG);
    expect(() => validateUpdateConnectionConfig(undefined)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_CONNECTION_CONFIG);
  });

  // Test for missing connectionId
  test('should throw error when connectionId is missing', () => {
    const config = {
      connectionUrl: 'https://example.com'
    };
    expect(() => validateUpdateConnectionConfig(config)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_CONNECTION_ID);
  });

  // Test for invalid connectionId
  test('should throw error when connectionId is invalid', () => {
    const config = {
      connectionId: '',  // empty string
      connectionUrl: 'https://example.com'
    };
    expect(() => validateUpdateConnectionConfig(config)).toThrow(SKYFLOW_ERROR_CODE.INVALID_CONNECTION_ID);

    const config2 = {
      connectionId: 123,  // not a string
      connectionUrl: 'https://example.com'
    };
    expect(() => validateUpdateConnectionConfig(config2)).toThrow(SKYFLOW_ERROR_CODE.INVALID_CONNECTION_ID);
  });

  // Test for invalid connectionUrl when provided
  test('should throw error when connectionUrl is invalid', () => {
    const config2 = {
      connectionId: 'test-connection',
      connectionUrl: 'not-a-url'  // invalid URL format
    };
    expect(() => validateUpdateConnectionConfig(config2)).toThrow(SKYFLOW_ERROR_CODE.INVALID_CONNECTION_URL);
  });

  // Test for valid partial update with only connectionId
  test('should accept valid config with only connectionId', () => {
    const config = {
      connectionId: 'test-connection'
    };
    expect(() => validateUpdateConnectionConfig(config)).not.toThrow();
  });

  // Test for valid update with all fields
  test('should accept valid connection configuration update', () => {
    const config = {
      connectionId: 'test-connection',
      connectionUrl: 'https://example.com',
      credentials: {
        apiKey: 'sky-key-123'  // Valid API key format
      }
    };
    expect(() => validateUpdateConnectionConfig(config)).not.toThrow();
  });

  // Test credentials validation
  test('should validate credentials if provided', () => {
    const config = {
      connectionId: 'test-connection',
      credentials: {
        apiKey: 'invalid-key'  // Invalid API key format
      }
    };
    expect(() => validateUpdateConnectionConfig(config)).toThrow(SKYFLOW_ERROR_CODE.INVALID_API_KEY_WITH_ID);
  });

  // Test different log levels
  test('should work with different log levels', () => {
    const config = {
      connectionId: 'test-connection'
    };
    expect(() => validateUpdateConnectionConfig(config, LogLevel.DEBUG)).not.toThrow();
    expect(() => validateUpdateConnectionConfig(config, LogLevel.INFO)).not.toThrow();
    expect(() => validateUpdateConnectionConfig(config, LogLevel.WARN)).not.toThrow();
    expect(() => validateUpdateConnectionConfig(config, LogLevel.ERROR)).not.toThrow();
  });

  // Test for whitespace values
  test('should throw error for whitespace string values', () => {
    const config = {
      connectionId: '   ',  // whitespace only
    };
    expect(() => validateUpdateConnectionConfig(config)).toThrow(SKYFLOW_ERROR_CODE.INVALID_CONNECTION_ID);
  });

  // Test for URL with query parameters
  test('should accept URL with query parameters when provided', () => {
    const config = {
      connectionId: 'test-connection',
      connectionUrl: 'https://example.com/api?key=value'
    };
    expect(() => validateUpdateConnectionConfig(config)).not.toThrow();
  });

  // Test for URL with path parameters
  test('should accept URL with path parameters when provided', () => {
    const config = {
      connectionId: 'test-connection',
      connectionUrl: 'https://example.com/api/{param}/value'
    };
    expect(() => validateUpdateConnectionConfig(config)).not.toThrow();
  });

  // Test that connectionUrl is optional
  test('should not require connectionUrl', () => {
    const config = {
      connectionId: 'test-connection',
      credentials: {
        apiKey: 'sky-key-123'
      }
    };
    expect(() => validateUpdateConnectionConfig(config)).not.toThrow();
  });
});

describe('validateInsertRequest', () => {
  // Test for null/undefined request
  test('should throw error when insertRequest is null/undefined', () => {
    expect(() => validateInsertRequest(null)).toThrow(SKYFLOW_ERROR_CODE.INVALID_INSERT_REQUEST);
    expect(() => validateInsertRequest(undefined)).toThrow(SKYFLOW_ERROR_CODE.INVALID_INSERT_REQUEST);
  });

  // Test for missing table
  test('should throw error when table is missing', () => {
    const request = {
      data: [{ field: 'value' }]
    };
    expect(() => validateInsertRequest(request)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_TABLE_NAME);
  });

  // Test for invalid table name
  test('should throw error when table name is invalid', () => {
    const request = {
      table: '',  // empty string
      data: [{ field: 'value' }]
    };
    expect(() => validateInsertRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_TABLE_NAME);

    const request2 = {
      table: '   ',  // whitespace only
      data: [{ field: 'value' }]
    };
    expect(() => validateInsertRequest(request2)).toThrow(SKYFLOW_ERROR_CODE.INVALID_TABLE_NAME);

    const request3 = {
      table: 123,  // not a string
      data: [{ field: 'value' }]
    };
    expect(() => validateInsertRequest(request3)).toThrow(SKYFLOW_ERROR_CODE.INVALID_TABLE_NAME);
  });

  // Test for missing data
  test('should throw error when data is missing', () => {
    const request = {
      table: 'users'
    };
    expect(() => validateInsertRequest(request)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_DATA_IN_INSERT);
  });

  // Test for invalid data type
  test('should throw error when data is not an array', () => {
    const request = {
      table: 'users',
      data: { field: 'value' }  // object instead of array
    };
    expect(() => validateInsertRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_TYPE_OF_DATA_IN_INSERT);
  });

  // Test for empty data array
  test('should throw error when data array is empty', () => {
    const request = {
      table: 'users',
      data: []
    };
    expect(() => validateInsertRequest(request)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_DATA_IN_INSERT);
  });

  // Test for null/undefined records in data
  test('should throw error when data contains null/undefined records', () => {
    const request = {
      table: 'users',
      data: [null]
    };
    expect(() => validateInsertRequest(request)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_RECORD_IN_INSERT);

    const request2 = {
      table: 'users',
      data: [undefined]
    };
    expect(() => validateInsertRequest(request2)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_RECORD_IN_INSERT);
  });

  // Test for invalid record types
  test('should throw error when records are not objects', () => {
    const request = {
      table: 'users',
      data: ['invalid']  // string instead of object
    };
    expect(() => validateInsertRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_RECORD_IN_INSERT);
  });

  // Test for empty records
  test('should throw error when records are empty objects', () => {
    const request = {
      table: 'users',
      data: [{}]
    };
    expect(() => validateInsertRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_RECORD_IN_INSERT);
  });

  // Test for invalid field names in records
  test('should throw error when record fields have invalid types', () => {
    const request = {
      table: 'users',
      data: [{
        [Symbol('key')]: 'value'  // Symbol instead of string
      }]
    };
    expect(() => validateInsertRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_RECORD_IN_INSERT);
  });

  // Test insert options validation
  describe('Insert Options Validation', () => {
    const validRequest = {
      table: 'users',
      data: [{ field: 'value' }]
    };

    test('should validate returnTokens option', () => {
      const options = {
        getReturnTokens: () => 'not-a-boolean'
      };
      expect(() => validateInsertRequest(validRequest, options))
        .toThrow(SKYFLOW_ERROR_CODE.INVALID_RETURN_TOKEN);
    });

    test('should validate upsertColumn option', () => {
      const options = {
        getUpsertColumn: () => 123  // number instead of string
      };
      expect(() => validateInsertRequest(validRequest, options))
        .toThrow(SKYFLOW_ERROR_CODE.INVALID_UPSERT);
    });

    test('should validate continueOnError option', () => {
      const options = {
        getContinueOnError: () => 'not-a-boolean'
      };
      expect(() => validateInsertRequest(validRequest, options))
        .toThrow(SKYFLOW_ERROR_CODE.INVALID_CONTINUE_ON_ERROR);
    });

    test('should validate tokens option', () => {
      const options = {
        getTokens: () => 'not-an-array'
      };
      expect(() => validateInsertRequest(validRequest, options))
        .toThrow(SKYFLOW_ERROR_CODE.INVALID_INSERT_TOKENS);
    });

    test('should validate token elements', () => {
      const options = {
        getTokens: () => [null]  // null token
      };
      expect(() => validateInsertRequest(validRequest, options))
        .toThrow(SKYFLOW_ERROR_CODE.EMPTY_INSERT_TOKEN);
    });
  });

  // Test valid cases
  // Test valid cases
test('should accept valid insert request', () => {
  const request = {
    _table: 'users',  // Changed from table to _table
    table: 'users',   // Keep both for compatibility
    data: [
      { field1: 'value1' },
      { field2: 'value2' }
    ]
  };
  expect(() => validateInsertRequest(request)).not.toThrow();
});

// Also update other test cases that check table property
test('should throw error when table is missing', () => {
  const request = {
    data: [{ field: 'value' }]
  };
  expect(() => validateInsertRequest(request)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_TABLE_NAME);
});

test('should throw error when table name is invalid', () => {
  const request = {
    _table: '',  // Changed from table to _table
    table: '',
    data: [{ field: 'value' }]
  };
  expect(() => validateInsertRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_TABLE_NAME);

  const request2 = {
    _table: '   ',  // Changed from table to _table
    table: '   ',
    data: [{ field: 'value' }]
  };
  expect(() => validateInsertRequest(request2)).toThrow(SKYFLOW_ERROR_CODE.INVALID_TABLE_NAME);

  const request3 = {
    _table: 123,  // Changed from table to _table
    table: 123,
    data: [{ field: 'value' }]
  };
  expect(() => validateInsertRequest(request3)).toThrow(SKYFLOW_ERROR_CODE.INVALID_TABLE_NAME);
});

  // Test different log levels
  test('should work with different log levels', () => {
    const request = {
      _table: 'users', 
      table: 'users',
      data: [{ field: 'value' }]
    };
    expect(() => validateInsertRequest(request, undefined, LogLevel.DEBUG)).not.toThrow();
    expect(() => validateInsertRequest(request, undefined, LogLevel.INFO)).not.toThrow();
    expect(() => validateInsertRequest(request, undefined, LogLevel.WARN)).not.toThrow();
    expect(() => validateInsertRequest(request, undefined, LogLevel.ERROR)).not.toThrow();
  });
});


describe('validateUpdateRequest', () => {
  // Test for null/undefined request
  test('should throw error when updateRequest is null/undefined', () => {
    expect(() => validateUpdateRequest(null)).toThrow(SKYFLOW_ERROR_CODE.INVALID_UPDATE_REQUEST);
    expect(() => validateUpdateRequest(undefined)).toThrow(SKYFLOW_ERROR_CODE.INVALID_UPDATE_REQUEST);
  });

  // Test for missing table
  test('should throw error when table is missing', () => {
    const request = {
      data: { skyflow_id: 'valid-id', field: 'value' }
    };
    expect(() => validateUpdateRequest(request)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_TABLE_NAME);
  });

  // Test for invalid table name
  test('should throw error when table name is invalid', () => {
    const request = {
      _table: '',  // empty string
      table: '',
      data: { skyflow_id: 'valid-id', field: 'value' }
    };
    expect(() => validateUpdateRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_TABLE_NAME);

    const request2 = {
      _table: '   ',  // whitespace only
      table: '   ',
      data: { skyflow_id: 'valid-id', field: 'value' }
    };
    expect(() => validateUpdateRequest(request2)).toThrow(SKYFLOW_ERROR_CODE.INVALID_TABLE_NAME);

    const request3 = {
      _table: 123,  // not a string
      table: 123,
      data: { skyflow_id: 'valid-id', field: 'value' }
    };
    expect(() => validateUpdateRequest(request3)).toThrow(SKYFLOW_ERROR_CODE.INVALID_TABLE_NAME);
  });

  // Test for missing data
  test('should throw error when data is missing', () => {
    const request = {
      _table: 'users',
      table: 'users'
    };
    expect(() => validateUpdateRequest(request)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_UPDATE_DATA);
  });

  // Test for invalid data type
  test('should throw error when data is not an object', () => {
    const request = {
      _table: 'users',
      table: 'users',
      data: 'invalid'  // string instead of object
    };
    expect(() => validateUpdateRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_TYPE_OF_UPDATE_DATA);
  });

  // Test for missing skyflow_id
  test('should throw error when skyflow_id is missing', () => {
    const request = {
      _table: 'users',
      table: 'users',
      data: { field: 'value' }
    };
    expect(() => validateUpdateRequest(request)).toThrow(SKYFLOW_ERROR_CODE.MISSING_SKYFLOW_ID_IN_UPDATE);
  });

  // Test for invalid skyflow_id
  test('should throw error when skyflow_id is invalid', () => {
    const request = {
      _table: 'users',
      table: 'users',
      data: { skyflow_id: '' }  // empty string
    };
    expect(() => validateUpdateRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_SKYFLOW_ID_IN_UPDATE);

    const request2 = {
      _table: 'users',
      table: 'users',
      data: { skyflow_id: 123 }  // not a string
    };
    expect(() => validateUpdateRequest(request2)).toThrow(SKYFLOW_ERROR_CODE.INVALID_SKYFLOW_ID_IN_UPDATE);
  });

  // Test update options validation
  describe('Update Options Validation', () => {
    const validRequest = {
      _table: 'users',
      table: 'users',
      data: { skyflow_id: 'valid-id', field: 'value' }
    };

    test('should validate returnTokens option', () => {
      const options = {
        getReturnTokens: () => 'not-a-boolean'
      };
      expect(() => validateUpdateRequest(validRequest, options))
        .toThrow(SKYFLOW_ERROR_CODE.INVALID_RETURN_TOKEN);
    });

    test('should validate tokenMode option', () => {
      const options = {
        getTokenMode: () => 'invalid-mode'
      };
      expect(() => validateUpdateRequest(validRequest, options))
        .toThrow(SKYFLOW_ERROR_CODE.INVALID_TOKEN_MODE);
    });

    test('should validate tokens option', () => {
      const options = {
        getTokens: () => 'not-an-object'
      };
      expect(() => validateUpdateRequest(validRequest, options))
        .toThrow(SKYFLOW_ERROR_CODE.INVALID_UPDATE_TOKENS);
    });
  });

  // Test empty record validation
  test('should throw error for empty update record', () => {
    const request = {
      _table: 'users',
      table: 'users',
      data: {
        skyflow_id: 'valid-id'
        // No other fields to update
      }
    };
    expect(() => validateUpdateRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_RECORD_IN_UPDATE);
  });

  // Test for invalid field names
  test('should throw error when record fields have invalid types', () => {
    const request = {
      _table: 'users',
      table: 'users',
      data: {
        skyflow_id: 'valid-id',
        [Symbol('key')]: 'value'  // Symbol instead of string
      }
    };
    expect(() => validateUpdateRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_RECORD_IN_UPDATE);
  });
});

describe('validateUpdateRequest - validateUpdateInput', () => {
  const validTable = {
    _table: 'users',
    table: 'users'
  };

  // Test validateUpdateInput with empty object
  test('should throw error when data object is empty', () => {
    const request = {
      ...validTable,
      data: {
        skyflow_id: 'valid-id',
        // No other fields provided
      }
    };
    expect(() => validateUpdateRequest(request))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_RECORD_IN_UPDATE);
  });

  // Test validateUpdateInput with non-string keys
  test('should throw error when data contains non-string keys', () => {
    const symbolKey = Symbol('test');
    const request = {
      ...validTable,
      data: {
        skyflow_id: 'valid-id',
        [symbolKey]: 'value'  // Symbol key instead of string
      }
    };
    expect(() => validateUpdateRequest(request))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_RECORD_IN_UPDATE);
  });

  // Test validateUpdateInput with invalid data type
  test('should throw error when data is not an object', () => {
    const request = {
      ...validTable,
      data: 'not-an-object'  // String instead of object
    };
    expect(() => validateUpdateRequest(request))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_TYPE_OF_UPDATE_DATA);
  });

  // Test validateUpdateInput with array data
  test('should throw error when data is an array', () => {
    const request = {
      ...validTable,
      data: ['not', 'an', 'object']
    };
    expect(() => validateUpdateRequest(request))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_TYPE_OF_UPDATE_DATA);
  });

  // Test validateUpdateInput with null values
  test('should throw error when data contains null values', () => {
    const request = {
      ...validTable,
      data: {
        skyflow_id: 'valid-id',
        field: null
      }
    };
    expect(() => validateUpdateRequest(request))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_RECORD_IN_UPDATE);
  });

  // Test valid update data with multiple fields
  test('should accept valid update data with multiple string fields', () => {
    const request = {
      ...validTable,
      data: {
        skyflowId: 'valid-id',
        field1: 'value1',
        field2: 'value2',
        field3: 'value3'
      }
    };
    expect(() => validateUpdateRequest(request)).not.toThrow();
  });

  // Test update data with nested objects
  test('should accept update data with nested objects', () => {
    const request = {
      ...validTable,
      data: {
        skyflowId: 'valid-id',
        field1: {
          nested: 'value'
        }
      }
    };
    expect(() => validateUpdateRequest(request)).not.toThrow();
  });

  // Test update data with mixed value types
  test('should accept update data with mixed value types', () => {
    const request = {
      ...validTable,
      data: {
        skyflowId: 'valid-id',
        stringField: 'string',
        objectField: { key: 'value' },
        numberField: 123,
        booleanField: true
      }
    };
    expect(() => validateUpdateRequest(request)).not.toThrow();
  });

  // Test error handling in validateUpdateInput
  test('should handle errors in validateUpdateInput gracefully', () => {
    const request = {
      ...validTable,
      data: Object.create(null)  // Object with no prototype
    };
    expect(() => validateUpdateRequest(request))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_RECORD_IN_UPDATE);
  });

  // Test update with minimal valid data
  test('should accept minimal valid update data', () => {
    const request = {
      ...validTable,
      data: {
        skyflowId: 'valid-id',
        field1: 'value1'
      }
    };
    expect(() => validateUpdateRequest(request)).not.toThrow();
  });
});

describe('validateGetRequest', () => {
  // Test for null/undefined request
  test('should throw error when getRequest is null/undefined', () => {
    expect(() => validateGetRequest(null)).toThrow(SKYFLOW_ERROR_CODE.INVALID_GET_REQUEST);
    expect(() => validateGetRequest(undefined)).toThrow(SKYFLOW_ERROR_CODE.INVALID_GET_REQUEST);
  });

  // Test for missing table
  test('should throw error when table is missing', () => {
    const request = {
      ids: ['id1', 'id2']
    };
    expect(() => validateGetRequest(request)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_TABLE_NAME);
  });

  // Test for invalid table name
  test('should throw error when table name is invalid', () => {
    const request = {
      _table: '',  // empty string
      table: '',
      ids: ['id1']
    };
    expect(() => validateGetRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_TABLE_NAME);

    const request2 = {
      _table: '   ',  // whitespace only
      table: '   ',
      ids: ['id1']
    };
    expect(() => validateGetRequest(request2)).toThrow(SKYFLOW_ERROR_CODE.INVALID_TABLE_NAME);

    const request3 = {
      _table: 123,  // not a string
      table: 123,
      ids: ['id1']
    };
    expect(() => validateGetRequest(request3)).toThrow(SKYFLOW_ERROR_CODE.INVALID_TABLE_NAME);
  });

  // Test for missing ids
  test('should throw error when ids is missing', () => {
    const request = {
      _table: 'users',
      table: 'users'
    };
    expect(() => validateGetRequest(request)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_IDS_IN_GET);
  });

  // Test for invalid ids type
  test('should throw error when ids is not an array', () => {
    const request = {
      _table: 'users',
      table: 'users',
      ids: 'invalid'  // string instead of array
    };
    expect(() => validateGetRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_TYPE_OF_IDS);
  });

  // Test for empty ids array
  test('should throw error when ids array is empty', () => {
    const request = {
      _table: 'users',
      table: 'users',
      ids: []
    };
    expect(() => validateGetRequest(request)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_IDS_IN_GET);
  });

  // Test for invalid id in array
  test('should throw error when id in array is invalid', () => {
    const request = {
      _table: 'users',
      table: 'users',
      ids: [null]  // null id
    };
    expect(() => validateGetRequest(request)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_ID_IN_GET);

    const request2 = {
      _table: 'users',
      table: 'users',
      ids: ['valid', 123]  // number instead of string
    };
    expect(() => validateGetRequest(request2)).toThrow(SKYFLOW_ERROR_CODE.INVALID_ID_IN_GET);
  });

  // Test GetOptions validation
  describe('GetOptions Validation', () => {
    const validRequest = {
      _table: 'users',
      table: 'users',
      ids: ['id1', 'id2']
    };

    test('should validate returnTokens option', () => {
      const options = {
        getReturnTokens: () => 'not-a-boolean'
      };
      expect(() => validateGetRequest(validRequest, options))
        .toThrow(SKYFLOW_ERROR_CODE.INVALID_RETURN_TOKEN);
    });

    test('should validate redactionType option', () => {
      const options = {
        getRedactionType: () => 'INVALID_TYPE'
      };
      expect(() => validateGetRequest(validRequest, options))
        .toThrow(SKYFLOW_ERROR_CODE.INVALID_REDACTION_TYPE);
    });

    test('should validate fields option', () => {
      const options = {
        getFields: () => 'not-an-array'
      };
      expect(() => validateGetRequest(validRequest, options))
        .toThrow(SKYFLOW_ERROR_CODE.INVALID_FIELDS);
    });

    test('should validate field elements', () => {
      const options = {
        getFields: () => [null]  // null field
      };
      expect(() => validateGetRequest(validRequest, options))
        .toThrow(SKYFLOW_ERROR_CODE.EMPTY_FIELD);

      const options2 = {
        getFields: () => ['', 'valid']  // empty string field
      };
      expect(() => validateGetRequest(validRequest, options2))
        .toThrow(SKYFLOW_ERROR_CODE.INVALID_FIELD);
    });
  });

  // Test valid cases
  test('should accept valid get request', () => {
    const request = {
      _table: 'users',
      table: 'users',
      ids: ['id1', 'id2']
    };
    expect(() => validateGetRequest(request)).not.toThrow();
  });

  // Test valid get request with options
  test('should accept valid get request with options', () => {
    const request = {
      _table: 'users',
      table: 'users',
      ids: ['id1', 'id2']
    };
    const options = {
      getReturnTokens: () => true,
      getRedactionType: () => 'REDACTED',
      getFields: () => ['field1', 'field2']
    };
    expect(() => validateGetRequest(request, options)).not.toThrow();
  });

  // Test different log levels
  test('should work with different log levels', () => {
    const request = {
      _table: 'users',
      table: 'users',
      ids: ['id1']
    };
    expect(() => validateGetRequest(request, undefined, LogLevel.DEBUG)).not.toThrow();
    expect(() => validateGetRequest(request, undefined, LogLevel.INFO)).not.toThrow();
    expect(() => validateGetRequest(request, undefined, LogLevel.WARN)).not.toThrow();
    expect(() => validateGetRequest(request, undefined, LogLevel.ERROR)).not.toThrow();
  });
});

describe('validateGetColumnRequest', () => {
  // Test for null/undefined request
  test('should throw error when getRequest is null/undefined', () => {
    expect(() => validateGetColumnRequest(null)).toThrow(SKYFLOW_ERROR_CODE.INVALID_GET_COLUMN_REQUEST);
    expect(() => validateGetColumnRequest(undefined)).toThrow(SKYFLOW_ERROR_CODE.INVALID_GET_COLUMN_REQUEST);
  });

  // Test for missing table
  test('should throw error when table is missing', () => {
    const request = {
      columnName: 'email',
      columnValues: ['value1']
    };
    expect(() => validateGetColumnRequest(request)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_TABLE_NAME);
  });

  // Test for invalid table name
  test('should throw error when table name is invalid', () => {
    const request = {
      _table: '',  // empty string
      table: '',
      columnName: 'email',
      columnValues: ['value1']
    };
    expect(() => validateGetColumnRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_TABLE_NAME);

    const request2 = {
      _table: '   ',  // whitespace only
      table: '   ',
      columnName: 'email',
      columnValues: ['value1']
    };
    expect(() => validateGetColumnRequest(request2)).toThrow(SKYFLOW_ERROR_CODE.INVALID_TABLE_NAME);

    const request3 = {
      _table: 123,  // not a string
      table: 123,
      columnName: 'email',
      columnValues: ['value1']
    };
    expect(() => validateGetColumnRequest(request3)).toThrow(SKYFLOW_ERROR_CODE.INVALID_TABLE_NAME);
  });

  // Test for missing columnName
  test('should throw error when columnName is missing', () => {
    const request = {
      _table: 'users',
      table: 'users',
      columnValues: ['value1']
    };
    expect(() => validateGetColumnRequest(request)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_COLUMN_NAME);
  });

  // Test for invalid columnName
  test('should throw error when columnName is invalid', () => {
    const request = {
      _table: 'users',
      table: 'users',
      _columnName: '',  // empty string
      columnName: '',
      columnValues: ['value1']
    };
    expect(() => validateGetColumnRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_COLUMN_NAME);

    const request2 = {
      _table: 'users',
      table: 'users',
      _columnName: '   ',  // whitespace only
      columnName: '   ',
      columnValues: ['value1']
    };
    expect(() => validateGetColumnRequest(request2)).toThrow(SKYFLOW_ERROR_CODE.INVALID_COLUMN_NAME);

    const request3 = {
      _table: 'users',
      table: 'users',
      _columnName: 123,  // not a string
      columnName: 123,
      columnValues: ['value1']
    };
    expect(() => validateGetColumnRequest(request3)).toThrow(SKYFLOW_ERROR_CODE.INVALID_COLUMN_NAME);
  });

  // Test for missing columnValues
  test('should throw error when columnValues is missing', () => {
    const request = {
      _table: 'users',
      table: 'users',
      _columnName: 'email',
      columnName: 'email'
    };
    expect(() => validateGetColumnRequest(request)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_COLUMN_VALUES);
  });

  // Test for invalid columnValues type
  test('should throw error when columnValues is not an array', () => {
    const request = {
      _table: 'users',
      table: 'users',
      _columnName: 'email',
      columnName: 'email',
      columnValues: 'invalid'  // string instead of array
    };
    expect(() => validateGetColumnRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_COLUMN_VALUES);
  });

  // Test for empty columnValues array
  test('should throw error when columnValues array is empty', () => {
    const request = {
      _table: 'users',
      table: 'users',
      _columnName: 'email',
      columnName: 'email',
      columnValues: []
    };
    expect(() => validateGetColumnRequest(request)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_COLUMN_VALUES);
  });

  // Test for invalid columnValue in array
  test('should throw error when columnValue in array is invalid', () => {
    const request = {
      _table: 'users',
      table: 'users',
      _columnName: 'email',
      columnName: 'email',
      columnValues: [null]  // null value
    };
    expect(() => validateGetColumnRequest(request)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_COLUMN_VALUE);

    const request2 = {
      _table: 'users',
      table: 'users',
      _columnName: 'email',
      columnName: 'email',
      columnValues: ['valid', 123]  // number instead of string
    };
    expect(() => validateGetColumnRequest(request2)).toThrow(SKYFLOW_ERROR_CODE.INVALID_COLUMN_VALUE);
  });

  // Test GetOptions validation
  describe('GetOptions Validation', () => {
    const validRequest = {
      _table: 'users',
      table: 'users',
      _columnName: 'email',
      columnName: 'email',
      columnValues: ['value1', 'value2']
    };

    test('should validate returnTokens option', () => {
      const options = {
        getReturnTokens: () => 'not-a-boolean'
      };
      expect(() => validateGetColumnRequest(validRequest, options))
        .toThrow(SKYFLOW_ERROR_CODE.INVALID_RETURN_TOKEN);
    });

    test('should validate redactionType option', () => {
      const options = {
        getRedactionType: () => 'INVALID_TYPE'
      };
      expect(() => validateGetColumnRequest(validRequest, options))
        .toThrow(SKYFLOW_ERROR_CODE.INVALID_REDACTION_TYPE);
    });
  });
});


describe('validateDetokenizeRequest', () => {
  // Test for null/undefined request
  test('should throw error when detokenizeRequest is null/undefined', () => {
    expect(() => validateDetokenizeRequest(null)).toThrow(SKYFLOW_ERROR_CODE.INVALID_DETOKENIZE_REQUEST);
    expect(() => validateDetokenizeRequest(undefined)).toThrow(SKYFLOW_ERROR_CODE.INVALID_DETOKENIZE_REQUEST);
  });

  // Test for missing data array
  test('should throw error when data is missing', () => {
    const request = {};
    expect(() => validateDetokenizeRequest(request)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_TOKENS_IN_DETOKENIZE);
  });

  // Test for invalid data type
  test('should throw error when data is not an array', () => {
    const request = {
      data: 'not-an-array'
    };
    expect(() => validateDetokenizeRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_TOKENS_TYPE_IN_DETOKENIZE);
  });

  // Test for empty data array
  test('should throw error when data array is empty', () => {
    const request = {
      data: []
    };
    expect(() => validateDetokenizeRequest(request)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_TOKENS_IN_DETOKENIZE);
  });

  // Test for null/undefined records in data
  test('should throw error when data contains null/undefined records', () => {
    const request = {
      data: [null]
    };
    expect(() => validateDetokenizeRequest(request)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_TOKEN_IN_DETOKENIZE);

    const request2 = {
      data: [undefined]
    };
    expect(() => validateDetokenizeRequest(request2)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_TOKEN_IN_DETOKENIZE);
  });

  // Test for invalid token in records
  test('should throw error when token is invalid', () => {
    const request = {
      data: [{
        token: ''  // empty string
      }]
    };
    expect(() => validateDetokenizeRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_TOKEN_IN_DETOKENIZE);

    const request2 = {
      data: [{
        token: '   '  // whitespace only
      }]
    };
    expect(() => validateDetokenizeRequest(request2)).toThrow(SKYFLOW_ERROR_CODE.INVALID_TOKEN_IN_DETOKENIZE);

    const request3 = {
      data: [{
        token: 123  // not a string
      }]
    };
    expect(() => validateDetokenizeRequest(request3)).toThrow(SKYFLOW_ERROR_CODE.INVALID_TOKEN_IN_DETOKENIZE);
  });

  // Test for invalid redactionType
  test('should throw error when redactionType is invalid', () => {
    const request = {
      data: [{
        token: 'valid-token',
        redactionType: 'INVALID_TYPE'
      }]
    };
    expect(() => validateDetokenizeRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_REDACTION_TYPE);
  });

  // Test DetokenizeOptions validation
  describe('DetokenizeOptions Validation', () => {
    const validRequest = {
      data: [{
        token: 'valid-token'
      }]
    };

    test('should validate continueOnError option', () => {
      const options = {
        getContinueOnError: () => 'not-a-boolean'
      };
      expect(() => validateDetokenizeRequest(validRequest, options))
        .toThrow(SKYFLOW_ERROR_CODE.INVALID_CONTINUE_ON_ERROR);
    });

    test('should validate downloadURL option', () => {
      const options = {
        getDownloadURL: () => 'not-a-boolean'
      };
      expect(() => validateDetokenizeRequest(validRequest, options))
        .toThrow(SKYFLOW_ERROR_CODE.INVALID_DOWNLOAD_URL);
    });
  });

  // Test valid cases
  test('should accept valid detokenize request', () => {
    const request = {
      data: [{
        token: 'valid-token'
      }]
    };
    expect(() => validateDetokenizeRequest(request)).not.toThrow();
  });

  // Test valid request with multiple tokens
  test('should accept valid request with multiple tokens', () => {
    const request = {
      data: [
        { token: 'token1' },
        { token: 'token2' },
        { token: 'token3' }
      ]
    };
    expect(() => validateDetokenizeRequest(request)).not.toThrow();
  });

  // Test valid request with redactionType
  test('should accept valid request with redactionType', () => {
    const request = {
      data: [{
        token: 'valid-token',
        redactionType: 'REDACTED'
      }]
    };
    expect(() => validateDetokenizeRequest(request)).not.toThrow();
  });

  // Test valid request with options
  test('should accept valid request with options', () => {
    const request = {
      data: [{
        token: 'valid-token'
      }]
    };
    const options = {
      getContinueOnError: () => true,
      getDownloadURL: () => false
    };
    expect(() => validateDetokenizeRequest(request, options)).not.toThrow();
  });

  // Test different log levels
  test('should work with different log levels', () => {
    const request = {
      data: [{
        token: 'valid-token'
      }]
    };
    expect(() => validateDetokenizeRequest(request, undefined, LogLevel.DEBUG)).not.toThrow();
    expect(() => validateDetokenizeRequest(request, undefined, LogLevel.INFO)).not.toThrow();
    expect(() => validateDetokenizeRequest(request, undefined, LogLevel.WARN)).not.toThrow();
    expect(() => validateDetokenizeRequest(request, undefined, LogLevel.ERROR)).not.toThrow();
  });
});

describe('validateTokenizeRequest', () => {
  // Test for null/undefined request
  test('should throw error when tokenizeRequest is null/undefined', () => {
    expect(() => validateTokenizeRequest(null)).toThrow(SKYFLOW_ERROR_CODE.INVALID_TOKENIZE_REQUEST);
    expect(() => validateTokenizeRequest(undefined)).toThrow(SKYFLOW_ERROR_CODE.INVALID_TOKENIZE_REQUEST);
  });

  // Test for missing values array
  test('should throw error when values is missing', () => {
    const request = {};
    expect(() => validateTokenizeRequest(request)).toThrow(SKYFLOW_ERROR_CODE.MISSING_VALUES_IN_TOKENIZE);
  });

  // Test for invalid values type
  test('should throw error when values is not an array', () => {
    const request = {
      _values: 'not-an-array',
      values: 'not-an-array'
    };
    expect(() => validateTokenizeRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_VALUES_TYPE_IN_TOKENIZE);
  });

  // Test for empty values array
  test('should throw error when values array is empty', () => {
    const request = {
      _values: [],
      values: []
    };
    expect(() => validateTokenizeRequest(request)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_VALUES_IN_TOKENIZE);
  });

  // Test for null/undefined data in values
  test('should throw error when values contains null/undefined data', () => {
    const request = {
      _values: [null],
      values: [null]
    };
    expect(() => validateTokenizeRequest(request)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_DATA_IN_TOKENIZE);

    const request2 = {
      _values: [undefined],
      values: [undefined]
    };
    expect(() => validateTokenizeRequest(request2)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_DATA_IN_TOKENIZE);
  });

  // Test for invalid data type in values
  test('should throw error when data is not an object', () => {
    const request = {
      _values: ['invalid'],
      values: ['invalid']
    };
    expect(() => validateTokenizeRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_DATA_IN_TOKENIZE);
  });

  // Test for missing value in data
  test('should throw error when value is missing in data', () => {
    const request = {
      _values: [{ columnGroup: 'test-group' }],
      values: [{ columnGroup: 'test-group' }]
    };
    expect(() => validateTokenizeRequest(request)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_VALUE_IN_TOKENIZE);
  });

  // Test for invalid value in data
  test('should throw error when value is invalid', () => {
    const request = {
      _values: [{ 
        value: '',  // empty string
        columnGroup: 'test-group' 
      }],
      values: [{ 
        value: '',
        columnGroup: 'test-group' 
      }]
    };
    expect(() => validateTokenizeRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_VALUE_IN_TOKENIZE);

    const request2 = {
      _values: [{ 
        value: '   ',  // whitespace only
        columnGroup: 'test-group' 
      }],
      values: [{ 
        value: '   ',
        columnGroup: 'test-group' 
      }]
    };
    expect(() => validateTokenizeRequest(request2)).toThrow(SKYFLOW_ERROR_CODE.INVALID_VALUE_IN_TOKENIZE);
  });

  // Test for missing columnGroup
  test('should throw error when columnGroup is missing', () => {
    const request = {
      _values: [{ value: 'test-value' }],
      values: [{ value: 'test-value' }]
    };
    expect(() => validateTokenizeRequest(request)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_COLUMN_GROUP_IN_TOKENIZE);
  });

  // Test for invalid columnGroup
  test('should throw error when columnGroup is invalid', () => {
    const request = {
      _values: [{ 
        value: 'test-value',
        columnGroup: ''  // empty string
      }],
      values: [{ 
        value: 'test-value',
        columnGroup: ''
      }]
    };
    expect(() => validateTokenizeRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_COLUMN_GROUP_IN_TOKENIZE);

    const request2 = {
      _values: [{ 
        value: 'test-value',
        columnGroup: '   '  // whitespace only
      }],
      values: [{ 
        value: 'test-value',
        columnGroup: '   '
      }]
    };
    expect(() => validateTokenizeRequest(request2)).toThrow(SKYFLOW_ERROR_CODE.INVALID_COLUMN_GROUP_IN_TOKENIZE);
  });

  // Test valid cases
  test('should accept valid tokenize request', () => {
    const request = {
      _values: [{ 
        value: 'test-value',
        columnGroup: 'test-group'
      }],
      values: [{ 
        value: 'test-value',
        columnGroup: 'test-group'
      }]
    };
    expect(() => validateTokenizeRequest(request)).not.toThrow();
  });

  // Test valid request with multiple values
  test('should accept valid request with multiple values', () => {
    const request = {
      _values: [
        { value: 'value1', columnGroup: 'group1' },
        { value: 'value2', columnGroup: 'group2' },
        { value: 'value3', columnGroup: 'group3' }
      ],
      values: [
        { value: 'value1', columnGroup: 'group1' },
        { value: 'value2', columnGroup: 'group2' },
        { value: 'value3', columnGroup: 'group3' }
      ]
    };
    expect(() => validateTokenizeRequest(request)).not.toThrow();
  });

  // Test different log levels
  test('should work with different log levels', () => {
    const request = {
      _values: [{ 
        value: 'test-value',
        columnGroup: 'test-group'
      }],
      values: [{ 
        value: 'test-value',
        columnGroup: 'test-group'
      }]
    };
    expect(() => validateTokenizeRequest(request, LogLevel.DEBUG)).not.toThrow();
    expect(() => validateTokenizeRequest(request, LogLevel.INFO)).not.toThrow();
    expect(() => validateTokenizeRequest(request, LogLevel.WARN)).not.toThrow();
    expect(() => validateTokenizeRequest(request, LogLevel.ERROR)).not.toThrow();
  });
});

describe('validateDeleteRequest', () => {
  // Test for null/undefined request
  test('should throw error when deleteRequest is null/undefined', () => {
    expect(() => validateDeleteRequest(null)).toThrow(SKYFLOW_ERROR_CODE.INVALID_DELETE_REQUEST);
    expect(() => validateDeleteRequest(undefined)).toThrow(SKYFLOW_ERROR_CODE.INVALID_DELETE_REQUEST);
  });

  // Test for missing table
  test('should throw error when table is missing', () => {
    const request = {
      ids: ['id1', 'id2']
    };
    expect(() => validateDeleteRequest(request)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_TABLE_NAME);
  });

  // Test for invalid table name
  test('should throw error when table name is invalid', () => {
    const request = {
      _table: '',  // empty string
      table: '',
      ids: ['id1']
    };
    expect(() => validateDeleteRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_TABLE_NAME);

    const request2 = {
      _table: '   ',  // whitespace only
      table: '   ',
      ids: ['id1']
    };
    expect(() => validateDeleteRequest(request2)).toThrow(SKYFLOW_ERROR_CODE.INVALID_TABLE_NAME);

    const request3 = {
      _table: 123,  // not a string
      table: 123,
      ids: ['id1']
    };
    expect(() => validateDeleteRequest(request3)).toThrow(SKYFLOW_ERROR_CODE.INVALID_TABLE_NAME);
  });

  // Test for missing ids
  test('should throw error when ids is missing', () => {
    const request = {
      _table: 'users',
      table: 'users'
    };
    expect(() => validateDeleteRequest(request)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_DELETE_IDS);
  });

  // Test for invalid ids type
  test('should throw error when ids is not an array', () => {
    const request = {
      _table: 'users',
      table: 'users',
      ids: 'not-an-array'
    };
    expect(() => validateDeleteRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_DELETE_IDS_INPUT);
  });

  // Test for empty ids array
  test('should throw error when ids array is empty', () => {
    const request = {
      _table: 'users',
      table: 'users',
      ids: []
    };
    expect(() => validateDeleteRequest(request)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_DELETE_IDS);
  });

  // Test for invalid id in array
  test('should throw error when id in array is invalid', () => {
    const request = {
      _table: 'users',
      table: 'users',
      ids: [null]  // null id
    };
    expect(() => validateDeleteRequest(request)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_ID_IN_DELETE);

    const request2 = {
      _table: 'users',
      table: 'users',
      ids: [123]  // number instead of string
    };
    expect(() => validateDeleteRequest(request2)).toThrow(SKYFLOW_ERROR_CODE.INVALID_ID_IN_DELETE);

    const request3 = {
      _table: 'users',
      table: 'users',
      ids: ['']  // empty string
    };
    expect(() => validateDeleteRequest(request3)).toThrow(SKYFLOW_ERROR_CODE.INVALID_ID_IN_DELETE);

    const request4 = {
      _table: 'users',
      table: 'users',
      ids: ['   ']  // whitespace only
    };
    expect(() => validateDeleteRequest(request4)).toThrow(SKYFLOW_ERROR_CODE.INVALID_ID_IN_DELETE);
  });

  // Test valid cases
  test('should accept valid delete request', () => {
    const request = {
      _table: 'users',
      table: 'users',
      ids: ['id1', 'id2']
    };
    expect(() => validateDeleteRequest(request)).not.toThrow();
  });

  // Test with single id
  test('should accept valid delete request with single id', () => {
    const request = {
      _table: 'users',
      table: 'users',
      ids: ['valid-id']
    };
    expect(() => validateDeleteRequest(request)).not.toThrow();
  });

  // Test different log levels
  test('should work with different log levels', () => {
    const request = {
      _table: 'users',
      table: 'users',
      ids: ['valid-id']
    };
    expect(() => validateDeleteRequest(request, LogLevel.DEBUG)).not.toThrow();
    expect(() => validateDeleteRequest(request, LogLevel.INFO)).not.toThrow();
    expect(() => validateDeleteRequest(request, LogLevel.WARN)).not.toThrow();
    expect(() => validateDeleteRequest(request, LogLevel.ERROR)).not.toThrow();
  });

  // Test with mixed valid and invalid ids
  test('should throw error when any id in array is invalid', () => {
    const request = {
      _table: 'users',
      table: 'users',
      ids: ['valid-id', '']  // second id is invalid
    };
    expect(() => validateDeleteRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_ID_IN_DELETE);
  });

  // Test with undefined id in array
  test('should throw error when array contains undefined', () => {
    const request = {
      _table: 'users',
      table: 'users',
      ids: ['valid-id', undefined]
    };
    expect(() => validateDeleteRequest(request)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_ID_IN_DELETE);
  });
});

describe('validateUploadFileRequest', () => {
  // Test for null/undefined request
  test('should throw error when uploadFileRequest is null/undefined', () => {
    expect(() => validateUploadFileRequest(null)).toThrow(SKYFLOW_ERROR_CODE.INVALID_FILE_UPLOAD_REQUEST);
    expect(() => validateUploadFileRequest(undefined)).toThrow(SKYFLOW_ERROR_CODE.INVALID_FILE_UPLOAD_REQUEST);
  });

  // Test for missing table
  test('should throw error when table is missing', () => {
    const request = {
      skyflowId: 'id1',
      columnName: 'file_column'
    };
    expect(() => validateUploadFileRequest(request)).toThrow(SKYFLOW_ERROR_CODE.MISSING_TABLE_IN_UPLOAD_FILE);
  });

  // Test for invalid table name
  test('should throw error when table name is invalid', () => {
    const request = {
      _table: '',  // empty string
      table: '',
      skyflowId: 'id1',
      columnName: 'file_column'
    };
    expect(() => validateUploadFileRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_TABLE_IN_UPLOAD_FILE);

    const request2 = {
      _table: '   ',  // whitespace only
      table: '   ',
      skyflowId: 'id1',
      columnName: 'file_column'
    };
    expect(() => validateUploadFileRequest(request2)).toThrow(SKYFLOW_ERROR_CODE.INVALID_TABLE_IN_UPLOAD_FILE);
  });

  // Test for missing skyflowId
  test('should throw error when skyflowId is missing', () => {
    const request = {
      _table: 'users',
      table: 'users',
      columnName: 'file_column'
    };
    expect(() => validateUploadFileRequest(request)).toThrow(SKYFLOW_ERROR_CODE.MISSING_SKYFLOW_ID_IN_UPLOAD_FILE);
  });

  // Test for invalid skyflowId
  test('should throw error when skyflowId is invalid', () => {
    const request = {
      _table: 'users',
      table: 'users',
      _skyflowId: '',  // empty string
      skyflowId: '',
      columnName: 'file_column'
    };
    expect(() => validateUploadFileRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_SKYFLOW_ID_IN_UPLOAD_FILE);

    const request2 = {
      _table: 'users',
      table: 'users',
      _skyflowId: '   ',  // whitespace only
      skyflowId: '   ',
      columnName: 'file_column'
    };
    expect(() => validateUploadFileRequest(request2)).toThrow(SKYFLOW_ERROR_CODE.INVALID_SKYFLOW_ID_IN_UPLOAD_FILE);
  });

  // Test for missing columnName
  test('should throw error when columnName is missing', () => {
    const request = {
      _table: 'users',
      table: 'users',
      _skyflowId: 'id1',
      skyflowId: 'id1'
    };
    expect(() => validateUploadFileRequest(request)).toThrow(SKYFLOW_ERROR_CODE.MISSING_COLUMN_NAME_IN_UPLOAD_FILE);
  });

  // Test for invalid columnName
  test('should throw error when columnName is invalid', () => {
    const request = {
      _table: 'users',
      table: 'users',
      _skyflowId: 'id1',
      skyflowId: 'id1',
      _columnName: '',  // empty string
      columnName: ''
    };
    expect(() => validateUploadFileRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_COLUMN_NAME_IN_UPLOAD_FILE);
  });

  // Test FileUploadOptions validation
  describe('FileUploadOptions Validation', () => {
    const validRequest = {
      _table: 'users',
      table: 'users',
      _skyflowId: 'id1',
      skyflowId: 'id1',
      _columnName: 'file_column',
      columnName: 'file_column'
    };

    // Test invalid filePath
    test('should throw error when filePath is invalid', () => {
      const options = {
        getFilePath: () => 123  // number instead of string
      };
      expect(() => validateUploadFileRequest(validRequest, options))
        .toThrow(SKYFLOW_ERROR_CODE.INVALID_FILE_PATH_IN_UPLOAD_FILE);
    });

    // Test invalid base64
    test('should throw error when base64 is invalid', () => {
      const options = {
        getBase64: () => 123  // number instead of string
      };
      expect(() => validateUploadFileRequest(validRequest, options))
        .toThrow(SKYFLOW_ERROR_CODE.INVALID_BASE64_IN_UPLOAD_FILE);
    });

    // Test invalid fileObject
    test('should throw error when fileObject is invalid', () => {
      const options = {
        getFileObject: () => "not-a-file-object"  // string instead of File object
      };
      expect(() => validateUploadFileRequest(validRequest, options))
        .toThrow(SKYFLOW_ERROR_CODE.INVALID_FILE_OBJECT_IN_UPLOAD_FILE);
    });

    // Test missing file source
    test('should throw error when no file source is provided', () => {
      const options = {
        getFilePath: () => null,
        getBase64: () => null,
        getFileObject: () => null
      };
      expect(() => validateUploadFileRequest(validRequest, options))
        .toThrow(SKYFLOW_ERROR_CODE.MISSING_FILE_SOURCE_IN_UPLOAD_FILE);
    });

    // Test missing fileName for base64
    test('should throw error when fileName is missing for base64', () => {
      const options = {
        getBase64: () => 'valid-base64',
        getFileName: () => null
      };
      expect(() => validateUploadFileRequest(validRequest, options))
        .toThrow(SKYFLOW_ERROR_CODE.MISSING_FILE_NAME_FOR_BASE64);
    });

    // Test invalid File object
    test('should throw error when File object is invalid', () => {
      const options = {
        getFileObject: () => ({})  // not a File instance
      };
      expect(() => validateUploadFileRequest(validRequest, options))
        .toThrow(SKYFLOW_ERROR_CODE.INVALID_FILE_OBJECT_IN_UPLOAD_FILE);
    });

    // Test missing filename in File object
    test('should throw error when filename is missing in File object', () => {
      const mockFile = new File([], '');  // empty filename
      const options = {
        getFileObject: () => mockFile
      };
      expect(() => validateUploadFileRequest(validRequest, options))
        .toThrow(SKYFLOW_ERROR_CODE.MISSING_FILE_NAME_IN_FILE_OBJECT);
    });
  });

  // Test valid cases
  test('should accept valid upload request with filePath', () => {
    const request = {
      _table: 'users',
      table: 'users',
      _skyflowId: 'id1',
      skyflowId: 'id1',
      _columnName: 'file_column',
      columnName: 'file_column'
    };
    const options = {
      getFilePath: () => '/valid/path/to/file.txt',
      getBase64: () => null,
      getFileObject: () => null
    };
    expect(() => validateUploadFileRequest(request, options)).not.toThrow();
  });

  test('should accept valid upload request with base64', () => {
    const request = {
      _table: 'users',
      table: 'users',
      _skyflowId: 'id1',
      skyflowId: 'id1',
      _columnName: 'file_column',
      columnName: 'file_column'
    };
    const options = {
      getFilePath: () => null,
      getBase64: () => 'valid-base64',
      getFileName: () => 'file.txt',
      getFileObject: () => null
    };
    expect(() => validateUploadFileRequest(request, options)).not.toThrow();
  });

  test('should accept valid upload request with File object', () => {
    const request = {
      _table: 'users',
      table: 'users',
      _skyflowId: 'id1',
      skyflowId: 'id1',
      _columnName: 'file_column',
      columnName: 'file_column'
    };
    const mockFile = new File(['test'], 'test.txt');
    const options = {
      getFilePath: () => null,
      getBase64: () => null,
      getFileObject: () => mockFile
    };
    expect(() => validateUploadFileRequest(request, options)).not.toThrow();
  });
});

describe('validateQueryRequest', () => {
  // Test for null/undefined request
  test('should throw error when queryRequest is null/undefined', () => {
    expect(() => validateQueryRequest(null)).toThrow(SKYFLOW_ERROR_CODE.INVALID_QUERY_REQUEST);
    expect(() => validateQueryRequest(undefined)).toThrow(SKYFLOW_ERROR_CODE.INVALID_QUERY_REQUEST);
  });

  // Test for missing query
  test('should throw error when query is missing', () => {
    const request = {};
    expect(() => validateQueryRequest(request)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_QUERY);
  });

  // Test for missing _query property
  test('should throw error when _query property is missing', () => {
    const request = {
      query: 'SELECT * FROM users'
    };
    expect(() => validateQueryRequest(request)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_QUERY);
  });

  // Test for invalid query type
  test('should throw error when query is not a string', () => {
    const request = {
      _query: 123,
      query: 123  // number instead of string
    };
    expect(() => validateQueryRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_QUERY);

    const request2 = {
      _query: {},
      query: {}  // object instead of string
    };
    expect(() => validateQueryRequest(request2)).toThrow(SKYFLOW_ERROR_CODE.INVALID_QUERY);
  });

  // Test for empty query string
  test('should throw error when query is empty string', () => {
    const request = {
      _query: '',
      query: ''
    };
    expect(() => validateQueryRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_QUERY);
  });

  // Test for whitespace-only query
  test('should throw error when query contains only whitespace', () => {
    const request = {
      _query: '   ',
      query: '   '
    };
    expect(() => validateQueryRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_QUERY);
  });

  // Test valid query
  test('should accept valid query request', () => {
    const request = {
      _query: 'SELECT * FROM users',
      query: 'SELECT * FROM users'
    };
    expect(() => validateQueryRequest(request)).not.toThrow();
  });

  // Test complex valid query
  test('should accept valid complex query', () => {
    const request = {
      _query: 'SELECT id, name FROM users WHERE age > 18 ORDER BY name DESC',
      query: 'SELECT id, name FROM users WHERE age > 18 ORDER BY name DESC'
    };
    expect(() => validateQueryRequest(request)).not.toThrow();
  });

  // Test different log levels
  test('should work with different log levels', () => {
    const request = {
      _query: 'SELECT * FROM users',
      query: 'SELECT * FROM users'
    };
    expect(() => validateQueryRequest(request, LogLevel.DEBUG)).not.toThrow();
    expect(() => validateQueryRequest(request, LogLevel.INFO)).not.toThrow();
    expect(() => validateQueryRequest(request, LogLevel.WARN)).not.toThrow();
    expect(() => validateQueryRequest(request, LogLevel.ERROR)).not.toThrow();
  });

  // Test query with special characters
  test('should accept query with special characters', () => {
    const request = {
      _query: 'SELECT * FROM `my-table` WHERE `column-name` = "value"',
      query: 'SELECT * FROM `my-table` WHERE `column-name` = "value"'
    };
    expect(() => validateQueryRequest(request)).not.toThrow();
  });

  // Test query with multiple lines
  test('should accept multi-line query', () => {
    const request = {
      _query: `
        SELECT * 
        FROM users 
        WHERE age > 18
      `,
      query: `
        SELECT * 
        FROM users 
        WHERE age > 18
      `
    };
    expect(() => validateQueryRequest(request)).not.toThrow();
  });
});

describe('validateDeIdentifyTextRequest', () => {
  // Test for invalid text
  test('should throw error when text is missing', () => {
    const request = {};
    expect(() => validateDeIdentifyTextRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_TEXT_IN_DEIDENTIFY);
  });

  test('should throw error when text is empty', () => {
    const request = {
      text: ''
    };
    expect(() => validateDeIdentifyTextRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_TEXT_IN_DEIDENTIFY);
  });

  test('should throw error when text is whitespace', () => {
    const request = {
      text: '   '
    };
    expect(() => validateDeIdentifyTextRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_TEXT_IN_DEIDENTIFY);
  });

  test('should throw error when text is not string', () => {
    const request = {
      text: 123
    };
    expect(() => validateDeIdentifyTextRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_TEXT_IN_DEIDENTIFY);
  });

  // Test Options Validation
  describe('Options Validation', () => {
    const validRequest = {
      text: 'valid text'
    };

    test('should throw error when entities is not an array', () => {
      const options = {
        getEntities: () => 'not-an-array'
      };
      expect(() => validateDeIdentifyTextRequest(validRequest, options))
        .toThrow(SKYFLOW_ERROR_CODE.INVALID_ENTITIES_IN_DEIDENTIFY);
    });

    test('should throw error when allowRegexList is not an array', () => {
      const options = {
        getAllowRegexList: () => 'not-an-array'
      };
      expect(() => validateDeIdentifyTextRequest(validRequest, options))
        .toThrow(SKYFLOW_ERROR_CODE.INVALID_ALLOW_REGEX_LIST);
    });

    test('should throw error when restrictRegexList is not an array', () => {
      const options = {
        getRestrictRegexList: () => 'not-an-array'
      };
      expect(() => validateDeIdentifyTextRequest(validRequest, options))
        .toThrow(SKYFLOW_ERROR_CODE.INVALID_RESTRICT_REGEX_LIST);
    });

    test('should throw error when tokenFormat is not TokenFormat instance', () => {
      const options = {
        getTokenFormat: () => ({})  // not a TokenFormat instance
      };
      expect(() => validateDeIdentifyTextRequest(validRequest, options))
        .toThrow(SKYFLOW_ERROR_CODE.INVALID_TOKEN_FORMAT);
    });

    test('should throw error when transformations is not Transformations instance', () => {
      const options = {
        getTransformations: () => ({})  // not a Transformations instance
      };
      expect(() => validateDeIdentifyTextRequest(validRequest, options))
        .toThrow(SKYFLOW_ERROR_CODE.INVALID_TRANSFORMATIONS);
    });
  });

  // Test valid cases
  test('should accept valid request without options', () => {
    const request = {
      text: 'valid text'
    };
    expect(() => validateDeIdentifyTextRequest(request)).not.toThrow();
  });

  test('should accept valid request with valid options', () => {
    const request = {
      text: 'valid text'
    };
    const options = {
      getEntities: () => ['PERSON', 'EMAIL'],
      getAllowRegexList: () => ['^test', 'test$'],
      getRestrictRegexList: () => ['^restricted', 'restricted$'],
      getTokenFormat: () => new TokenFormat(),
      getTransformations: () => new Transformations()
    };
    expect(() => validateDeIdentifyTextRequest(request, options)).not.toThrow();
  });

  // Test different log levels
  test('should work with different log levels', () => {
    const request = {
      text: 'valid text'
    };
    expect(() => validateDeIdentifyTextRequest(request, undefined, LogLevel.DEBUG)).not.toThrow();
    expect(() => validateDeIdentifyTextRequest(request, undefined, LogLevel.INFO)).not.toThrow();
    expect(() => validateDeIdentifyTextRequest(request, undefined, LogLevel.WARN)).not.toThrow();
    expect(() => validateDeIdentifyTextRequest(request, undefined, LogLevel.ERROR)).not.toThrow();
  });

  // Test with various text content
  test('should accept text with special characters', () => {
    const request = {
      text: 'Special chars: !@#$%^&*()'
    };
    expect(() => validateDeIdentifyTextRequest(request)).not.toThrow();
  });

  test('should accept multi-line text', () => {
    const request = {
      text: `Line 1
             Line 2
             Line 3`
    };
    expect(() => validateDeIdentifyTextRequest(request)).not.toThrow();
  });

  test('should accept text with multiple spaces', () => {
    const request = {
      text: 'Text with    multiple     spaces'
    };
    expect(() => validateDeIdentifyTextRequest(request)).not.toThrow();
  });
});

describe('validateReidentifyTextRequest', () => {
  // Test for invalid text
  test('should throw error when text is missing', () => {
    const request = {};
    expect(() => validateReidentifyTextRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_TEXT_IN_REIDENTIFY);
  });

  test('should throw error when text is empty', () => {
    const request = {
      text: ''
    };
    expect(() => validateReidentifyTextRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_TEXT_IN_REIDENTIFY);
  });

  test('should throw error when text is whitespace', () => {
    const request = {
      text: '   '
    };
    expect(() => validateReidentifyTextRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_TEXT_IN_REIDENTIFY);
  });

  test('should throw error when text is not string', () => {
    const request = {
      text: 123
    };
    expect(() => validateReidentifyTextRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_TEXT_IN_REIDENTIFY);
  });

  // Test Options Validation
  describe('ReidentifyTextOptions Validation', () => {
    const validRequest = {
      text: 'valid text with tokens'
    };

    test('should throw error when redactedEntities is not an array', () => {
      const options = {
        getRedactedEntities: () => 'not-an-array'
      };
      expect(() => validateReidentifyTextRequest(validRequest, options))
        .toThrow(SKYFLOW_ERROR_CODE.INVALID_REDACTED_ENTITIES_IN_REIDENTIFY);
    });

    test('should throw error when maskedEntities is not an array', () => {
      const options = {
        getMaskedEntities: () => 'not-an-array'
      };
      expect(() => validateReidentifyTextRequest(validRequest, options))
        .toThrow(SKYFLOW_ERROR_CODE.INVALID_MASKED_ENTITIES_IN_REIDENTIFY);
    });

    test('should throw error when plainTextEntities is not an array', () => {
      const options = {
        getPlainTextEntities: () => 'not-an-array'
      };
      expect(() => validateReidentifyTextRequest(validRequest, options))
        .toThrow(SKYFLOW_ERROR_CODE.INVALID_PLAIN_TEXT_ENTITIES_IN_REIDENTIFY);
    });

    test('should accept valid arrays for all entity types', () => {
      const options = {
        getRedactedEntities: () => ['PERSON', 'EMAIL'],
        getMaskedEntities: () => ['PHONE', 'SSN'],
        getPlainTextEntities: () => ['ADDRESS']
      };
      expect(() => validateReidentifyTextRequest(validRequest, options)).not.toThrow();
    });

    test('should accept empty arrays for entity types', () => {
      const options = {
        getRedactedEntities: () => [],
        getMaskedEntities: () => [],
        getPlainTextEntities: () => []
      };
      expect(() => validateReidentifyTextRequest(validRequest, options)).not.toThrow();
    });
  });

  // Test valid cases
  test('should accept valid request without options', () => {
    const request = {
      text: 'valid text with tokens'
    };
    expect(() => validateReidentifyTextRequest(request)).not.toThrow();
  });

  // Test different log levels
  test('should work with different log levels', () => {
    const request = {
      text: 'valid text with tokens'
    };
    expect(() => validateReidentifyTextRequest(request, undefined, LogLevel.DEBUG)).not.toThrow();
    expect(() => validateReidentifyTextRequest(request, undefined, LogLevel.INFO)).not.toThrow();
    expect(() => validateReidentifyTextRequest(request, undefined, LogLevel.WARN)).not.toThrow();
    expect(() => validateReidentifyTextRequest(request, undefined, LogLevel.ERROR)).not.toThrow();
  });

  // Test with various text content
  test('should accept text with special characters', () => {
    const request = {
      text: 'Text with special chars: !@#$%^&*()'
    };
    expect(() => validateReidentifyTextRequest(request)).not.toThrow();
  });

  test('should accept multi-line text', () => {
    const request = {
      text: `Line 1
             Line 2
             Line 3`
    };
    expect(() => validateReidentifyTextRequest(request)).not.toThrow();
  });

  test('should accept text with tokens', () => {
    const request = {
      text: 'Text with {{TOKEN_1}} and {{TOKEN_2}} embedded'
    };
    expect(() => validateReidentifyTextRequest(request)).not.toThrow();
  });

  // Test combinations of options
  test('should accept request with mixed entity types', () => {
    const request = {
      text: 'Text with tokens'
    };
    const options = {
      getRedactedEntities: () => ['PERSON'],
      getMaskedEntities: () => ['EMAIL'],
      getPlainTextEntities: () => ['PHONE']
    };
    expect(() => validateReidentifyTextRequest(request, options)).not.toThrow();
  });
});

describe('validateGetDetectRunRequest', () => {
  // Test for missing runId
  test('should throw error when runId is missing', () => {
    const request = {};
    expect(() => validateGetDetectRunRequest(request)).toThrow(SKYFLOW_ERROR_CODE.EMPTY_RUN_ID);
  });

  // Test for invalid runId type
  test('should throw error when runId is not a string', () => {
    const request = {
      runId: 123  // number instead of string
    };
    expect(() => validateGetDetectRunRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_RUN_ID);

    const request2 = {
      runId: {}  // object instead of string
    };
    expect(() => validateGetDetectRunRequest(request2)).toThrow(SKYFLOW_ERROR_CODE.INVALID_RUN_ID);

    const request3 = {
      runId: true  // boolean instead of string
    };
    expect(() => validateGetDetectRunRequest(request3)).toThrow(SKYFLOW_ERROR_CODE.INVALID_RUN_ID);
  });

  // Test for empty runId
  test('should throw error when runId is empty string', () => {
    const request = {
      runId: ''
    };
    expect(() => validateGetDetectRunRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_RUN_ID);
  });

  // Test for whitespace runId
  test('should throw error when runId contains only whitespace', () => {
    const request = {
      runId: '   '
    };
    expect(() => validateGetDetectRunRequest(request)).toThrow(SKYFLOW_ERROR_CODE.INVALID_RUN_ID);
  });

  // Test valid cases
  test('should accept valid request', () => {
    const request = {
      runId: 'valid-run-id'
    };
    expect(() => validateGetDetectRunRequest(request)).not.toThrow();
  });

  // Test for different valid runId formats
  test('should accept different valid runId formats', () => {
    const request1 = {
      runId: 'run-123'
    };
    expect(() => validateGetDetectRunRequest(request1)).not.toThrow();

    const request2 = {
      runId: 'RUN_456'
    };
    expect(() => validateGetDetectRunRequest(request2)).not.toThrow();

    const request3 = {
      runId: '789abc'
    };
    expect(() => validateGetDetectRunRequest(request3)).not.toThrow();
  });

  // Test different log levels
  test('should work with different log levels', () => {
    const request = {
      runId: 'valid-run-id'
    };
    expect(() => validateGetDetectRunRequest(request, LogLevel.DEBUG)).not.toThrow();
    expect(() => validateGetDetectRunRequest(request, LogLevel.INFO)).not.toThrow();
    expect(() => validateGetDetectRunRequest(request, LogLevel.WARN)).not.toThrow();
    expect(() => validateGetDetectRunRequest(request, LogLevel.ERROR)).not.toThrow();
  });

  // Test special characters in runId
  test('should accept runId with special characters', () => {
    const request = {
      runId: 'run-id_123.456@test'
    };
    expect(() => validateGetDetectRunRequest(request)).not.toThrow();
  });

});

describe('validateInvokeConnectionRequest', () => {
  // Test for null/undefined request
  test('should throw error when request is null/undefined', () => {
    expect(() => validateInvokeConnectionRequest(null))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_INVOKE_CONNECTION_REQUEST);
    expect(() => validateInvokeConnectionRequest(undefined))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_INVOKE_CONNECTION_REQUEST);
  });

  // Test for missing method
  test('should throw error when method is missing', () => {
    const request = {};
    expect(() => validateInvokeConnectionRequest(request))
      .toThrow(SKYFLOW_ERROR_CODE.EMPTY_METHOD_NAME);
  });

  // Test for invalid method
  test('should throw error when method is invalid', () => {
    const request = {
      method: 'INVALID_METHOD'
    };
    expect(() => validateInvokeConnectionRequest(request))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_METHOD_NAME);
  });

  // Test for invalid queryParams
  test('should throw error when queryParams is invalid', () => {
    const request = {
      method: 'GET',
      queryParams: 'not-an-object'  // string instead of object
    };
    expect(() => validateInvokeConnectionRequest(request))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_QUERY_PARAMS);

    const request2 = {
      method: 'GET',
      queryParams: [1, 2, 3]  // array instead of object
    };
    expect(() => validateInvokeConnectionRequest(request2))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_QUERY_PARAMS);

    const request3 = {
      method: 'GET',
      queryParams: {
        param1: 123  // number instead of string
      }
    };
    expect(() => validateInvokeConnectionRequest(request3))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_QUERY_PARAMS);
  });

  // Test for invalid pathParams
  test('should throw error when pathParams is invalid', () => {
    const request = {
      method: 'GET',
      pathParams: 'not-an-object'
    };
    expect(() => validateInvokeConnectionRequest(request))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_PATH_PARAMS);

    const request2 = {
      method: 'GET',
      pathParams: {
        param1: true  // boolean instead of string
      }
    };
    expect(() => validateInvokeConnectionRequest(request2))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_PATH_PARAMS);
  });

  // Test for invalid body
  test('should throw error when body is invalid', () => {
    const request = {
      method: 'POST',
      body: 'not-an-object'
    };
    expect(() => validateInvokeConnectionRequest(request))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_BODY);

    const request2 = {
      method: 'POST',
      body: {
        field: Symbol()  // symbol instead of string or object
      }
    };
    expect(() => validateInvokeConnectionRequest(request2))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_BODY);
  });

  // Test valid cases
  test('should accept valid request with minimal params', () => {
    const request = {
      method: 'GET'
    };
    expect(() => validateInvokeConnectionRequest(request)).not.toThrow();
  });

  test('should accept valid request with all params', () => {
    const request = {
      method: 'POST',
      queryParams: {
        param1: 'value1',
        param2: 'value2'
      },
      pathParams: {
        id: '123'
      },
      body: {
        field1: 'value1',
        field2: {
          nested: 'value'
        }
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token'
      }
    };
    expect(() => validateInvokeConnectionRequest(request)).not.toThrow();
  });

  // Test nested objects in body
  test('should accept nested objects in body', () => {
    const request = {
      method: 'POST',
      body: {
        level1: {
          level2: {
            level3: 'value'
          }
        }
      }
    };
    expect(() => validateInvokeConnectionRequest(request)).not.toThrow();
  });

  // Test empty objects in optional params
  test('should accept empty objects for optional params', () => {
    const request = {
      method: 'GET',
      queryParams: {},
      pathParams: {},
      body: {},
      headers: {}
    };
    expect(() => validateInvokeConnectionRequest(request)).not.toThrow();
  });
});


describe('validateUpdateOptions - validateUpdateToken', () => {
  // Test validateUpdateToken with empty object
  test('should throw error when tokens object is empty', () => {
    const options = {
      getTokens: () => ({})
    };
    expect(() => validateUpdateOptions(options))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_TOKEN_IN_UPDATE);
  });

  // Test validateUpdateToken with non-string keys
  test('should throw error when tokens contain non-string keys', () => {
    const symbolKey = Symbol('test');
    const options = {
      getTokens: () => ({
        [symbolKey]: 'value'  // Symbol key instead of string
      })
    };
    expect(() => validateUpdateOptions(options))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_TOKEN_IN_UPDATE);
  });

  // Test validateUpdateToken with multiple valid tokens
  test('should accept tokens with multiple string fields', () => {
    const options = {
      getTokens: () => ({
        field1: 'token1',
        field2: 'token2',
        field3: 'token3'
      })
    };
    expect(() => validateUpdateOptions(options)).not.toThrow();
  });

  // Test validateUpdateToken with nested objects
  test('should accept tokens with nested objects', () => {
    const options = {
      getTokens: () => ({
        field1: {
          nestedToken: 'value'
        }
      })
    };
    expect(() => validateUpdateOptions(options)).not.toThrow();
  });

  // Test validateUpdateToken with mixed value types
  test('should accept tokens with mixed value types', () => {
    const options = {
      getTokens: () => ({
        stringToken: 'token1',
        objectToken: { key: 'value' },
        numberToken: 123,
        booleanToken: true
      })
    };
    expect(() => validateUpdateOptions(options)).not.toThrow();
  });

  // Test validateUpdateToken with non-object token values
  test('should throw error when tokens is not an object', () => {
    const options = {
      getTokens: () => 'not-an-object'
    };
    expect(() => validateUpdateOptions(options))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_UPDATE_TOKENS);
  });

  // Test complete update options with valid tokens
  test('should accept valid update options with tokens', () => {
    const options = {
      getReturnTokens: () => true,
      getTokenMode: () => TokenMode.ENABLE,
      getTokens: () => ({
        field1: 'token1',
        field2: 'token2'
      })
    };
    expect(() => validateUpdateOptions(options)).not.toThrow();
  });
});

describe('validateInsertRequest - validateInsertOptions', () => {
  const validRequest = {
    _table: 'users',
    table: 'users',
    data: [{ field: 'value' }]
  };

  // Test returnTokens validation
  test('should throw error when returnTokens is not boolean', () => {
    const options = {
      getReturnTokens: () => 'not-a-boolean'
    };
    expect(() => validateInsertRequest(validRequest, options))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_RETURN_TOKEN);
  });

  // Test upsertColumn validation
  test('should throw error when upsertColumn is not string', () => {
    const options = {
      getUpsertColumn: () => 123 // number instead of string
    };
    expect(() => validateInsertRequest(validRequest, options))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_UPSERT);
  });

  // Test continueOnError validation
  test('should throw error when continueOnError is not boolean', () => {
    const options = {
      getContinueOnError: () => 'not-a-boolean'
    };
    expect(() => validateInsertRequest(validRequest, options))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_CONTINUE_ON_ERROR);
  });

  // Test homogeneous validation
  test('should throw error when homogeneous is not boolean', () => {
    const options = {
      getHomogeneous: () => 'not-a-boolean'
    };
    expect(() => validateInsertRequest(validRequest, options))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_HOMOGENEOUS);
  });

  // Test tokenMode validation
  test('should throw error when tokenMode is invalid', () => {
    const options = {
      getTokenMode: () => 'INVALID_MODE'
    };
    expect(() => validateInsertRequest(validRequest, options))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_TOKEN_MODE);
  });

  // Test tokens validation
  test('should throw error when tokens is not an array', () => {
    const options = {
      getTokens: () => 'not-an-array'
    };
    expect(() => validateInsertRequest(validRequest, options))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_INSERT_TOKENS);
  });

  // Test token elements validation
  test('should throw error when token element is null', () => {
    const options = {
      getTokens: () => [null]
    };
    expect(() => validateInsertRequest(validRequest, options))
      .toThrow(SKYFLOW_ERROR_CODE.EMPTY_INSERT_TOKEN);
  });

  test('should throw error when token element is not an object', () => {
    const options = {
      getTokens: () => ['not-an-object']
    };
    expect(() => validateInsertRequest(validRequest, options))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_INSERT_TOKEN);
  });

  // Test valid combinations
  test('should accept valid insert options', () => {
    const options = {
      getReturnTokens: () => true,
      getUpsertColumn: () => 'id',
      getContinueOnError: () => true,
      getHomogeneous: () => true,
      getTokenMode: () => TokenMode.ENABLE,
      getTokens: () => [{ token: 'valid-token' }]
    };
    expect(() => validateInsertRequest(validRequest, options)).not.toThrow();
  });

  // Test optional parameters
  test('should accept undefined options', () => {
    expect(() => validateInsertRequest(validRequest, undefined)).not.toThrow();
  });

  // Test partial options
  test('should accept valid insert options', () => {
    const options = {
        getReturnTokens: () => true,
        getUpsertColumn: () => 'id',
        getContinueOnError: () => true,
        getHomogeneous: () => true,
        getTokenMode: () => 'ENABLE',
        getTokens: () => [{ token: 'valid-token' }]
    };
    expect(() => validateInsertRequest(validRequest, options)).not.toThrow();
});

  // Test token strict mode validation
  test('should throw error in ENABLE_STRICT mode when token count mismatches', () => {
    const request = {
      _table: 'users',
      table: 'users',
      data: [
        { field1: 'value1' },
        { field2: 'value2' }
      ]
    };
    const options = {
      getTokenMode: () => TokenMode.ENABLE_STRICT,
      getTokens: () => [{ token: 'token1' }] // Only one token for two records
    };
    expect(() => validateInsertRequest(request, options))
      .toThrow(SKYFLOW_ERROR_CODE.INSUFFICIENT_TOKENS_PASSED_FOR_TOKEN_MODE_ENABLE_STRICT);
  });

  test('should throw error in ENABLE mode when tokens are missing', () => {
    const options = {
      getTokenMode: () => TokenMode.ENABLE
      // No tokens provided
    };
    expect(() => validateInsertRequest(validRequest, options))
      .toThrow(SKYFLOW_ERROR_CODE.NO_TOKENS_WITH_TOKEN_MODE);
  });

  // Test complex data scenarios
  test('should validate options with multiple records and tokens', () => {
    const request = {
      _table: 'users',
      table: 'users',
      data: [
        { field1: 'value1' },
        { field2: 'value2' }
      ]
    };
    const options = {
      getTokenMode: () => TokenMode.ENABLE_STRICT,
      getTokens: () => [
        { field1: 'token1' },
        { field2: 'token2' }
      ],
      getReturnTokens: () => true
    };
    expect(() => validateInsertRequest(request, options)).not.toThrow();
  });
});

describe('validateInsertRequest - validateTokensForInsertRequest', () => {
  const validRequest = {
    _table: 'users',
    table: 'users',
    data: [
      { field1: 'value1' },
      { field2: 'value2' }
    ]
  };

  // Test when token mode is ENABLE but tokens are missing
  test('should throw error when token mode is ENABLE but tokens are missing', () => {
    const options = {
      getTokenMode: () => 'ENABLE',
      getTokens: () => undefined
    };
    expect(() => validateInsertRequest(validRequest, options))
      .toThrow(SKYFLOW_ERROR_CODE.NO_TOKENS_WITH_TOKEN_MODE);
  });

  // Test when token mode is ENABLE_STRICT but tokens are missing
  test('should throw error when token mode is ENABLE_STRICT but tokens are missing', () => {
    const options = {
      getTokenMode: () => 'ENABLE_STRICT',
      getTokens: () => undefined
    };
    expect(() => validateInsertRequest(validRequest, options))
      .toThrow(SKYFLOW_ERROR_CODE.NO_TOKENS_WITH_TOKEN_MODE);
  });

  // Test token count mismatch in ENABLE_STRICT mode
  test('should throw error when token count does not match data count in ENABLE_STRICT mode', () => {
    const options = {
      getTokenMode: () => 'ENABLE_STRICT',
      getTokens: () => [
        { field1: 'token1' }  // Only one token for two records
      ]
    };
    expect(() => validateInsertRequest(validRequest, options))
      .toThrow(SKYFLOW_ERROR_CODE.INSUFFICIENT_TOKENS_PASSED_FOR_TOKEN_MODE_ENABLE_STRICT);
  });

  // Test token field mismatch in ENABLE_STRICT mode
  test('should throw error when token fields do not match data fields in ENABLE_STRICT mode', () => {
    const options = {
      getTokenMode: () => 'ENABLE_STRICT',
      getTokens: () => [
        { differentField: 'token1' },
        { anotherField: 'token2' }
      ]
    };
    expect(() => validateInsertRequest(validRequest, options))
      .toThrow(SKYFLOW_ERROR_CODE.INSUFFICIENT_TOKENS_PASSED_FOR_TOKEN_MODE_ENABLE_STRICT);
  });

  // Test valid case with ENABLE mode
  test('should accept valid request with ENABLE mode and tokens', () => {
    const options = {
      getTokenMode: () => 'ENABLE',
      getTokens: () => [
        { field1: 'token1' },
        { field2: 'token2' }
      ]
    };
    expect(() => validateInsertRequest(validRequest, options)).not.toThrow();
  });

  // Test valid case with ENABLE_STRICT mode
  test('should accept valid request with ENABLE_STRICT mode and matching tokens', () => {
    const request = {
      _table: 'users',
      table: 'users',
      data: [
        { field1: 'value1' }
      ]
    };
    const options = {
      getTokenMode: () => 'ENABLE_STRICT',
      getTokens: () => [
        { field1: 'token1' }
      ]
    };
    expect(() => validateInsertRequest(request, options)).not.toThrow();
  });

  // Test with multiple fields in ENABLE_STRICT mode
  test('should accept valid request with multiple fields in ENABLE_STRICT mode', () => {
    const request = {
      _table: 'users',
      table: 'users',
      data: [
        { 
          field1: 'value1',
          field2: 'value2'
        }
      ]
    };
    const options = {
      getTokenMode: () => 'ENABLE_STRICT',
      getTokens: () => [
        { 
          field1: 'token1',
          field2: 'token2'
        }
      ]
    };
    expect(() => validateInsertRequest(request, options)).not.toThrow();
  });

  // Test DISABLE mode
  test('should accept request with DISABLE mode without tokens', () => {
    const options = {
      getTokenMode: () => 'DISABLE'
    };
    expect(() => validateInsertRequest(validRequest, options)).not.toThrow();
  });

  // Test without token mode
  test('should accept request without token mode', () => {
    const options = {
      getReturnTokens: () => true,
      getUpsertColumn: () => 'id',
      getContinueOnError: () => true,
      getHomogeneous: () => true,
      getTokenMode: () => 'DISABLE',
      getTokens: () => [{ token: 'valid-token' }]
    };
    expect(() => validateInsertRequest(validRequest, options)).not.toThrow();
  });

  // Test with empty tokens array in ENABLE_STRICT mode
  test('should throw error with empty tokens array in ENABLE_STRICT mode', () => {
    const options = {
      getTokenMode: () => 'ENABLE_STRICT',
      getTokens: () => []
    };
    expect(() => validateInsertRequest(validRequest, options))
      .toThrow(SKYFLOW_ERROR_CODE.INSUFFICIENT_TOKENS_PASSED_FOR_TOKEN_MODE_ENABLE_STRICT);
  });

  // Test with null tokens in ENABLE mode
  test('should throw error with null tokens in ENABLE mode', () => {
    const options = {
      getTokenMode: () => 'ENABLE',
      getTokens: () => null
    };
    expect(() => validateInsertRequest(validRequest, options))
      .toThrow(SKYFLOW_ERROR_CODE.NO_TOKENS_WITH_TOKEN_MODE);
  });

  // Test validateTokensMapWithTokenStrict with missing fields
  test('should throw error when token map is missing required fields', () => {
    const request = {
      _table: 'users',
      table: 'users',
      data: [
        { 
          field1: 'value1',
          field2: 'value2',
          field3: 'value3'
        }
      ]
    };
    const options = {
      getTokenMode: () => 'ENABLE_STRICT',
      getTokens: () => [
        { 
          field1: 'token1',
          field2: 'token2'
          // field3 is missing
        }
      ]
    };
    expect(() => validateInsertRequest(request, options))
      .toThrow(SKYFLOW_ERROR_CODE.INSUFFICIENT_TOKENS_PASSED_FOR_TOKEN_MODE_ENABLE_STRICT);
  });
});

describe('validateUpdateRequest - validateUpdateOptions', () => {
  const validRequest = {
    _table: 'users',
    table: 'users',
    data: {
      skyflowId: 'valid-id',
      field1: 'value1'
    }
  };

  // Test returnTokens validation
  test('should throw error when returnTokens is not boolean', () => {
    const options = {
      getReturnTokens: () => 'not-a-boolean'
    };
    expect(() => validateUpdateRequest(validRequest, options))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_RETURN_TOKEN);
  });

  // Test tokenMode validation
  test('should throw error when tokenMode is invalid', () => {
    const options = {
      getTokenMode: () => 'INVALID_MODE'
    };
    expect(() => validateUpdateRequest(validRequest, options))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_TOKEN_MODE);
  });

  // Test tokens validation
  test('should throw error when tokens is not an object', () => {
    const options = {
      getTokens: () => 'not-an-object'
    };
    expect(() => validateUpdateRequest(validRequest, options))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_UPDATE_TOKENS);
  });

  // Test empty tokens object
  test('should throw error when tokens object is empty', () => {
    const options = {
      getTokens: () => ({})
    };
    expect(() => validateUpdateRequest(validRequest, options))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_TOKEN_IN_UPDATE);
  });

  // Test invalid token keys
  test('should throw error when tokens contain non-string keys', () => {
    const symbolKey = Symbol('test');
    const options = {
      getTokens: () => ({
        [symbolKey]: 'value'  // Symbol key instead of string
      })
    };
    expect(() => validateUpdateRequest(validRequest, options))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_TOKEN_IN_UPDATE);
  });

  // Test valid tokens with different value types
  test('should accept tokens with various value types', () => {
    const options = {
      getTokens: () => ({
        field1: 'string-token',
        field2: { nested: 'value' },
        field3: 123,
        field4: true
      })
    };
    expect(() => validateUpdateRequest(validRequest, options)).not.toThrow();
  });

  // Test valid options with all properties
  test('should accept valid update options with all properties', () => {
    const options = {
      getReturnTokens: () => true,
      getTokenMode: () => 'ENABLE',
      getTokens: () => ({
        field1: 'token1',
        field2: 'token2'
      })
    };
    expect(() => validateUpdateRequest(validRequest, options)).not.toThrow();
  });

  // Test partial valid options
  test('should accept valid options with only returnTokens', () => {
    const options = {
      getReturnTokens: () => true
    };
    expect(() => validateUpdateRequest(validRequest, options)).not.toThrow();
  });

  // Test undefined options
  test('should accept request without options', () => {
    expect(() => validateUpdateRequest(validRequest)).not.toThrow();
  });

  // Test empty options object
  test('should accept empty options object', () => {
    const options = {};
    expect(() => validateUpdateRequest(validRequest, options)).not.toThrow();
  });

  // Test with different TokenMode values
  test('should accept valid token modes', () => {
    const validModes = ['ENABLE', 'DISABLE'];
    validModes.forEach(mode => {
      const options = {
        getTokenMode: () => mode
      };
      expect(() => validateUpdateRequest(validRequest, options)).not.toThrow();
    });
  });

  // Test complex nested tokens
  test('should accept tokens with nested structures', () => {
    const options = {
      getTokens: () => ({
        field1: {
          nested1: {
            nested2: 'token-value'
          }
        },
        field2: 'simple-token'
      })
    };
    expect(() => validateUpdateRequest(validRequest, options)).not.toThrow();
  });
});

describe('validateGetRequest/validateGetColumnRequest - validateGetOptions', () => {
  const validGetRequest = {
    _table: 'users',
    table: 'users',
    ids: ['id1']
  };

  const validGetColumnRequest = {
    _table: 'users',
    table: 'users',
    _columnName: 'email',
    columnName: 'email',
    columnValues: ['value1']
  };

  // Test returnTokens validation
  test('should throw error when returnTokens is not boolean', () => {
    const options = {
      getReturnTokens: () => 'not-a-boolean'
    };
    expect(() => validateGetRequest(validGetRequest, options))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_RETURN_TOKEN);
  });

  // Test redactionType validation
  test('should throw error when redactionType is invalid', () => {
    const options = {
      getRedactionType: () => 'INVALID_TYPE'
    };
    expect(() => validateGetRequest(validGetRequest, options))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_REDACTION_TYPE);
  });

  // Test offset validation
  test('should throw error when offset is not string', () => {
    const options = {
      getOffset: () => 123  // number instead of string
    };
    expect(() => validateGetRequest(validGetRequest, options))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_OFFSET);
  });

  // Test limit validation
  test('should throw error when limit is not string', () => {
    const options = {
      getLimit: () => 123  // number instead of string
    };
    expect(() => validateGetRequest(validGetRequest, options))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_LIMIT);
  });

  // Test downloadURL validation
  test('should throw error when downloadURL is not boolean', () => {
    const options = {
      getDownloadURL: () => 'not-a-boolean'
    };
    expect(() => validateGetRequest(validGetRequest, options))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_DOWNLOAD_URL);
  });

  // Test columnName validation
  test('should throw error when columnName is not string', () => {
    const options = {
      getColumnName: () => 123  // number instead of string
    };
    expect(() => validateGetRequest(validGetRequest, options))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_COLUMN_NAME);
  });

  // Test orderBy validation
  test('should throw error when orderBy is invalid', () => {
    const options = {
      getOrderBy: () => 'INVALID_ORDER'
    };
    expect(() => validateGetRequest(validGetRequest, options))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_ORDER_BY);
  });

  // Test fields validation
  test('should throw error when fields is not an array', () => {
    const options = {
      getFields: () => 'not-an-array'
    };
    expect(() => validateGetRequest(validGetRequest, options))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_FIELDS);
  });

  // Test fields array elements
  test('should throw error when fields contain invalid elements', () => {
    const options = {
      getFields: () => [null]
    };
    expect(() => validateGetRequest(validGetRequest, options))
      .toThrow(SKYFLOW_ERROR_CODE.EMPTY_FIELD);

    const options2 = {
      getFields: () => ['']  // empty string
    };
    expect(() => validateGetRequest(validGetRequest, options2))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_FIELD);

    const options3 = {
      getFields: () => [123]  // number instead of string
    };
    expect(() => validateGetRequest(validGetRequest, options3))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_FIELD);
  });

  // Test columnValues validation
  test('should throw error when columnValues is not an array', () => {
    const options = {
      getColumnValues: () => 'not-an-array'
    };
    expect(() => validateGetColumnRequest(validGetColumnRequest, options))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_COLUMN_VALUES);
  });

  // Test columnValues array elements
  test('should throw error when columnValues contain invalid elements', () => {
    const options = {
      getColumnValues: () => [null]
    };
    expect(() => validateGetColumnRequest(validGetColumnRequest, options))
      .toThrow(SKYFLOW_ERROR_CODE.EMPTY_COLUMN_VALUE);

    const options2 = {
      getColumnValues: () => ['']  // empty string
    };
    expect(() => validateGetColumnRequest(validGetColumnRequest, options2))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_COLUMN_VALUE);

    const options3 = {
      getColumnValues: () => [123]  // number instead of string
    };
    expect(() => validateGetColumnRequest(validGetColumnRequest, options3))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_COLUMN_VALUE);
  });

  // Test valid options
  test('should accept valid options with all properties', () => {
    const options = {
      getReturnTokens: () => true,
      getRedactionType: () => 'REDACTED',
      getOffset: () => '0',
      getLimit: () => '10',
      getDownloadURL: () => false,
      getColumnName: () => 'column1',
      getOrderBy: () => OrderByEnum.ASCENDING,
      getFields: () => ['field1', 'field2'],
      getColumnValues: () => ['value1', 'value2']
    };
    expect(() => validateGetRequest(validGetRequest, options)).not.toThrow();
    expect(() => validateGetColumnRequest(validGetColumnRequest, options)).not.toThrow();
  });

  // Test partial valid options
  test('should accept partial valid options', () => {
    const options = {
      getReturnTokens: () => true,
      getRedactionType: () => 'REDACTED'
    };
    expect(() => validateGetRequest(validGetRequest, options)).not.toThrow();
    expect(() => validateGetColumnRequest(validGetColumnRequest, options)).not.toThrow();
  });

  // Test undefined options
  test('should accept undefined options', () => {
    expect(() => validateGetRequest(validGetRequest)).not.toThrow();
    expect(() => validateGetColumnRequest(validGetColumnRequest)).not.toThrow();
  });
});

describe('validateCredentialsWithId', () => {
  const type = 'vault';
  const typeId = 'vault_id';
  const id = 'test-id';

  // Test PathCredentials validation
  describe('PathCredentials validation', () => {
    test('should throw error when path credentials are invalid', () => {
      const credentials = {
        path: 123,  // invalid type
        roles: ['role1']
      };
      expect(() => validateCredentialsWithId(credentials, type, typeId, id))
        .toThrow(SKYFLOW_ERROR_CODE.INVALID_FILE_PATH_WITH_ID);
    });

    test('should throw error when roles is not an array', () => {
      const credentials = {
        path: '/valid/path',
        roles: 'not-an-array'
      };
      expect(() => validateCredentialsWithId(credentials, type, typeId, id))
        .toThrow(SKYFLOW_ERROR_CODE.INVALID_ROLES_KEY_TYPE);
    });

    test('should throw error when context is not a string', () => {
      const credentials = {
        path: '/valid/path',
        roles: ['role1'],
        context: 123  // invalid type
      };
      expect(() => validateCredentialsWithId(credentials, type, typeId, id))
        .toThrow(SKYFLOW_ERROR_CODE.INVALID_CONTEXT);
    });

    test('should accept valid path credentials', () => {
      // Mock fs.existsSync to return true
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      
      const credentials = {
        path: '/valid/path',
        roles: ['role1'],
        context: 'test-context'
      };
      expect(() => validateCredentialsWithId(credentials, type, typeId, id)).not.toThrow();
    });
  });

  // Test TokenCredentials validation
  describe('TokenCredentials validation', () => {
    test('should throw error when token is invalid', () => {
      const credentials = {
        token: 123  // invalid type
      };
      expect(() => validateCredentialsWithId(credentials, type, typeId, id))
        .toThrow(SKYFLOW_ERROR_CODE.INVALID_BEARER_TOKEN_WITH_ID);
    });

    test('should throw error when token is expired', () => {
      // Mock isExpired to return true
      jest.spyOn(require('../../src/utils/jwt-utils'), 'isExpired').mockReturnValue(true);

      const credentials = {
        token: 'expired-token'
      };
      expect(() => validateCredentialsWithId(credentials, type, typeId, id))
        .toThrow(SKYFLOW_ERROR_CODE.INVALID_BEARER_TOKEN_WITH_ID);
    });

    test('should accept valid token credentials', () => {
      // Mock isExpired to return false
      jest.spyOn(require('../../src/utils/jwt-utils'), 'isExpired').mockReturnValue(false);

      const credentials = {
        token: 'valid-token'
      };
      expect(() => validateCredentialsWithId(credentials, type, typeId, id)).not.toThrow();
    });
  });

  // Test StringCredentials validation
  describe('StringCredentials validation', () => {
    test('should throw error when credentials string is invalid', () => {
      const credentials = {
        credentialsString: 123  // invalid type
      };
      expect(() => validateCredentialsWithId(credentials, type, typeId, id))
        .toThrow(SKYFLOW_ERROR_CODE.INVALID_PARSED_CREDENTIALS_STRING_WITH_ID);
    });

    test('should throw error when roles is not an array', () => {
      const credentials = {
        credentialsString: JSON.stringify({
          clientID: 'client1',
          keyID: 'key1'
        }),
        roles: 'not-an-array'
      };
      expect(() => validateCredentialsWithId(credentials, type, typeId, id))
        .toThrow(SKYFLOW_ERROR_CODE.INVALID_ROLES_KEY_TYPE);
    });

    test('should throw error when context is not a string', () => {
      const credentials = {
        credentialsString: JSON.stringify({
          clientID: 'client1',
          keyID: 'key1'
        }),
        roles: ['role1'],
        context: 123  // invalid type
      };
      expect(() => validateCredentialsWithId(credentials, type, typeId, id))
        .toThrow(SKYFLOW_ERROR_CODE.INVALID_CONTEXT);
    });

    test('should accept valid string credentials', () => {
      const credentials = {
        credentialsString: JSON.stringify({
          clientID: 'client1',
          keyID: 'key1'
        }),
        roles: ['role1'],
        context: 'test-context'
      };
      expect(() => validateCredentialsWithId(credentials, type, typeId, id)).not.toThrow();
    });
  });

  // Test multiple credentials error
  test('should throw error when multiple credential types are provided', () => {
    const credentials = {
      token: 'valid-token',
      path: '/valid/path'
    };
    expect(() => validateCredentialsWithId(credentials, type, typeId, id))
      .toThrow(SKYFLOW_ERROR_CODE.MULTIPLE_CREDENTIALS_PASSED_WITH_ID);
  });

  // Test no credentials error
  test('should throw error when no valid credential type is provided', () => {
    const credentials = {
      invalidType: 'some-value'
    };
    expect(() => validateCredentialsWithId(credentials, type, typeId, id))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_CREDENTIALS_WITH_ID);
  });

  // Test null credentials
  test('should throw error when credentials is null', () => {
    expect(() => validateCredentialsWithId(null, type, typeId, id))
      .toThrow(SKYFLOW_ERROR_CODE.INVALID_CREDENTIALS_WITH_ID);
  });
});