const fs = require('fs');
const path = require('path');
const { validateDeidentifyFileRequest } = require('../../src/utils/validations');
const DeidentifyFileRequest = require('../../src/vault/model/request/deidentify-file').default;
const DeidentifyFileOptions = require('../../src/vault/model/options/deidentify-file').default;
const SKYFLOW_ERROR_CODE = require('../../src/error/codes');
const { default: TokenFormat } = require('../../src/vault/model/options/deidentify-text/token-format');
const { DetectEntities } = require('../../src/utils');

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
