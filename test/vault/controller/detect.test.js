import DetectController from '../../../src/vault/controller/detect';
import { validateDeidentifyFileRequest, validateDeIdentifyTextRequest, validateGetDetectRunRequest, validateReidentifyTextRequest } from '../../../src/utils/validations';
import DeidentifyTextResponse from '../../../src/vault/model/response/deidentify-text';
import ReidentifyTextResponse from '../../../src/vault/model/response/reidentify-text';
import DeidentifyFileRequest from '../../../src/vault/model/request/deidentify-file';
import DeidentifyFileOptions from '../../../src/vault/model/options/deidentify-file';
import { DETECT_STATUS, ENCODING_TYPE, TYPES } from '../../../src/utils';
import fs from 'fs';

jest.mock('../../../src/utils', () => ({
    printLog: jest.fn(),
    parameterizedString: jest.fn(),
    removeSDKVersion: jest.fn(),
    MessageType: {
        LOG: 'LOG',
        ERROR: 'ERROR',
        WARN: 'WARN',
    },
    LogLevel: {
        DEBUG: 'DEBUG',
        INFO: 'INFO',
        WARN: 'WARN',
        ERROR: 'ERROR',
        OFF: 'OFF',
    },
    TYPES: {
        DETECT: 'DETECT',
        DEIDENTIFY_FILE: 'DEIDENTIFY_FILE',
        DETECT_RUN: 'DETECT_RUN',
        DEIDENTIFY_TEXT: 'DEIDENTIFY_TEXT',
        REIDENTIFY_TEXT: 'REIDENTIFY_TEXT',
    },
    DeidenitfyFileRequestTypes: {
        AUDIO: 'AUDIO',
        TEXT: 'TEXT',
        PDF: 'PDF',
        IMAGE: 'IMAGE',
        PPT: 'PPT',
        SPREADSHEET: 'SPREADSHEET',
        STRUCTURED_TEXT: 'STRUCTURED_TEXT',
        DOCUMENT: 'DOCUMENT',
        FILE: 'FILE',
    },
    DETECT_STATUS: {
        IN_PROGRESS: 'IN_PROGRESS',
        SUCCESS: 'SUCCESS',
        FAILED: 'FAILED',
    },
    SDK: {
        METRICS_HEADER_KEY: 'sky-metadata',
    },
    FILE_EXTENSION: {
        JSON: 'json',
        MP3: 'mp3',
        WAV: 'wav',
    },
    FILE_FORMAT_TYPE: {
        TXT: 'txt',
        PDF: 'pdf',
    },
    FILE_PROCESSING: {
        PROCESSED_PREFIX: 'processed-',
        DEIDENTIFIED_PREFIX: 'deidentified.',
        ENTITIES: 'entities',
    },
    ENCODING_TYPE: {
        UTF8: 'utf8',
        BASE64: 'base64',
        BINARY: 'binary',
        UTF_8: 'utf-8',
    },
    generateSDKMetrics: jest.fn().mockReturnValue({ sdk: 'metrics' }),
    getBearerToken: jest.fn().mockResolvedValue(Promise.resolve('your-bearer-token')),
}));

jest.mock('../../../src/utils/validations', () => ({
    validateDeIdentifyTextRequest: jest.fn(),
    validateReidentifyTextRequest: jest.fn(),
    validateDeidentifyFileRequest: jest.fn(),
    validateGetDetectRunRequest: jest.fn(),
}));

describe('DetectController', () => {
    let mockVaultClient;
    let detectController;

    beforeEach(() => {
        mockVaultClient = {
            getLogLevel: jest.fn().mockReturnValue('DEBUG'),
            getCredentials: jest.fn().mockReturnValue({}),
            initAPI: jest.fn(),
            stringsAPI: {
                deidentifyString: jest.fn(),
                reidentifyString: jest.fn(),
            },
            filesAPI: {
                deidentifyPdf: jest.fn(),
                deidentifyAudio: jest.fn(),
                getRun: jest.fn(),
            },
            failureResponse: jest.fn().mockRejectedValue(new Error('API error')),
            vaultId: 'vault123',
        };
        jest.clearAllMocks();
    });

    test('should initialize DetectController and call printLog with correct parameters', () => {
        detectController = new DetectController(mockVaultClient);
        expect(detectController).toBeInstanceOf(DetectController);
    });
});

describe('deidentifyText', () => {

    let mockVaultClient;
    let detectController;

    beforeEach(() => {
        mockVaultClient = {
            getLogLevel: jest.fn().mockReturnValue('DEBUG'),
            getCredentials: jest.fn().mockReturnValue({}),
            initAPI: jest.fn(),
            stringsAPI: {
                deidentifyString: jest.fn(),
                reidentifyString: jest.fn(),
            },
            failureResponse: jest.fn().mockRejectedValue(new Error('API error')),
            vaultId: 'vault123',
        };
        detectController = new DetectController(mockVaultClient);
        jest.clearAllMocks();
    });

    test('should successfully deidentify text', async () => {
        const mockRequest = {
            text: 'Sensitive data to deidentify',
        };
        const mockOptions = {
            getEntities: jest.fn().mockReturnValue(['NAME', 'EMAIL']),
            getAllowRegexList: jest.fn().mockReturnValue(['regex1']),
            getRestrictRegexList: jest.fn().mockReturnValue(['regex2']),
            getTransformations: jest.fn().mockReturnValue({
                getShiftDays: jest.fn().mockReturnValue({
                    max: 10,
                    min: 5,
                    entities: ['DATE'],
                }),
            }),
            getTokenFormat: jest.fn().mockReturnValue({
                getDefault: jest.fn().mockReturnValue('default'),
                getVaultToken: jest.fn().mockReturnValue('vault-token'),
                getEntityUniqueCounter: jest.fn().mockReturnValue('entity-unique-counter'),
                getEntityOnly: jest.fn().mockReturnValue('entity-only'),
            })
        };

        const mockResponseData = {
            processed_text: 'Processed text',
            entities: [
                {
                    token: 'token1',
                    value: 'value1',
                    location: {
                        start_index: 0,
                        end_index: 5,
                        start_index_processed: 0,
                        end_index_processed: 5,
                    },
                    entity_type: 'NAME',
                    entity_scores: [0.9],
                },
            ],
            word_count: 5,
            character_count: 30,
        };

        mockVaultClient.stringsAPI.deidentifyString.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: mockResponseData,
                rawResponse: { headers: { get: jest.fn().mockReturnValue('request-id-123') } },
            }),
        }));

        const response = await detectController.deidentifyText(mockRequest, mockOptions);

        expect(validateDeIdentifyTextRequest).toHaveBeenCalledWith(mockRequest, mockOptions, 'DEBUG');
        expect(mockVaultClient.stringsAPI.deidentifyString).toHaveBeenCalledWith(
            expect.objectContaining({
                text: mockRequest.text,
                vault_id: 'vault123',
                entity_types: ['NAME', 'EMAIL'],
                allow_regex: ['regex1'],
                restrict_regex: ['regex2'],
                transformations: {
                    shift_dates: {
                        max_days: 10,
                        min_days: 5,
                        entity_types: ['DATE'],
                    },
                },
            })
        );
        expect(response).toBeInstanceOf(DeidentifyTextResponse);
        expect(response.processedText).toBe('Processed text');
        expect(response.entities).toHaveLength(1);
        expect(response.wordCount).toBe(5);
        expect(response.charCount).toBe(30);
        expect(response.errors).toBeNull();
    });

    test('should handle validation errors', async () => {
        const mockRequest = {
            text: 'Sensitive data to deidentify',
        };
        const mockOptions = {};

        validateDeIdentifyTextRequest.mockImplementation(() => {
            throw new Error('Validation error');
        });

        await expect(detectController.deidentifyText(mockRequest, mockOptions)).rejects.toThrow(
            'Validation error'
        );
        expect(validateDeIdentifyTextRequest).toHaveBeenCalledWith(mockRequest, mockOptions, 'DEBUG');
        expect(mockVaultClient.stringsAPI.deidentifyString).not.toHaveBeenCalled();
    });

    test('should handle API errors during deidentifyText', async () => {
        jest.mock('../../../src/utils/validations', () => ({
            validateDeIdentifyTextRequest: jest.fn(),
            validateReidentifyTextRequest: jest.fn(),
        }));
        validateDeIdentifyTextRequest.mockImplementation(() => {
            // No validation error
        });
        const mockRequest = {
            text: 'Sensitive data to deidentify',
        };
        const mockOptions = {
            getEntities: jest.fn().mockReturnValue([]), // Return an empty array for entities
            getAllowRegexList: jest.fn().mockReturnValue([]), // Return an empty array for allow regex
            getRestrictRegexList: jest.fn().mockReturnValue([]), // Return an empty array for restrict regex
            getTransformations: jest.fn().mockReturnValue({
                getShiftDays: jest.fn().mockReturnValue({
                    max: 10,
                    min: 5,
                    entities: ['DATE'],
                }),
            }),
            getTokenFormat: jest.fn().mockReturnValue({
                getDefault: jest.fn().mockReturnValue('default'),
                getVaultToken: jest.fn().mockReturnValue('vault-token'),
                getEntityUniqueCounter: jest.fn().mockReturnValue('entity-unique-counter'),
                getEntityOnly: jest.fn().mockReturnValue('entity-only'),
            })
        };

        mockVaultClient.stringsAPI.deidentifyString.mockImplementation(() => ({
            withRawResponse: jest.fn().mockRejectedValue(new Error('API error')),
        }));

        await expect(detectController.deidentifyText(mockRequest, mockOptions)).rejects.toThrow(
            'API error'
        );
        expect(mockVaultClient.stringsAPI.deidentifyString).toHaveBeenCalled();
    });

    // Lines 418-432: buildDeidentifyTextRequest options?.xxx false branches (options undefined)
    test('should deidentify text without options (covers options?.xxx false branches)', async () => {
        validateDeIdentifyTextRequest.mockImplementation(() => {});
        const mockRequest = { text: 'text to deidentify' };

        mockVaultClient.stringsAPI.deidentifyString.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { processed_text: 'processed text', entities: [], word_count: 1, character_count: 10 },
                rawResponse: null, // covers rawResponse?.headers false branch at line 389
            }),
        }));

        const response = await detectController.deidentifyText(mockRequest);
        expect(response).toBeInstanceOf(DeidentifyTextResponse);
        expect(response.processedText).toBe('processed text');
    });
});

describe('reidentifyText', () => {
    let mockVaultClient;
    let detectController;

    beforeEach(() => {
        mockVaultClient = {
            getLogLevel: jest.fn().mockReturnValue('DEBUG'),
            getCredentials: jest.fn().mockReturnValue({}),
            initAPI: jest.fn(),
            stringsAPI: {
                deidentifyString: jest.fn(),
                reidentifyString: jest.fn(),
            },
            failureResponse: jest.fn().mockRejectedValue(new Error('API error')),
            vaultId: 'vault123',
        };
        detectController = new DetectController(mockVaultClient);
        jest.clearAllMocks();
    });
    test('should successfully reidentify text', async () => {
        const mockRequest = {
            text: 'Redacted text to reidentify',
        };
        const mockOptions = {
            getRedactedEntities: jest.fn().mockReturnValue(['NAME']),
            getMaskedEntities: jest.fn().mockReturnValue(['EMAIL']),
            getPlainTextEntities: jest.fn().mockReturnValue(['PHONE']),
        };

        const mockResponseData = {
            text: 'Reidentified text',
        };

        mockVaultClient.stringsAPI.reidentifyString.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: mockResponseData,
                rawResponse: { headers: { get: jest.fn().mockReturnValue('request-id-123') } },
            }),
        }));

        const response = await detectController.reidentifyText(mockRequest, mockOptions);

        expect(validateReidentifyTextRequest).toHaveBeenCalledWith(mockRequest, mockOptions, 'DEBUG');
        expect(mockVaultClient.stringsAPI.reidentifyString).toHaveBeenCalledWith(
            expect.objectContaining({
                text: mockRequest.text,
                vault_id: 'vault123',
                format: {
                    redacted: ['NAME'],
                    masked: ['EMAIL'],
                    plaintext: ['PHONE'],
                },
            })
        );
        expect(response).toBeInstanceOf(ReidentifyTextResponse);
        expect(response.processedText).toBe('Reidentified text');
    });

    test('should handle validation errors', async () => {
        const mockRequest = {
            text: 'Redacted text to reidentify',
        };
        const mockOptions = {
            getRedactedEntities: jest.fn().mockReturnValue(['NAME']),
            getMaskedEntities: jest.fn().mockReturnValue(['EMAIL']),
            getPlainTextEntities: jest.fn().mockReturnValue(['PHONE']),
        };

        validateReidentifyTextRequest.mockImplementation(() => {
            throw new Error('Validation error');
        });

        await expect(detectController.reidentifyText(mockRequest, mockOptions)).rejects.toThrow(
            'Validation error'
        );
        expect(validateReidentifyTextRequest).toHaveBeenCalledWith(mockRequest, mockOptions, 'DEBUG');
        expect(mockVaultClient.stringsAPI.reidentifyString).not.toHaveBeenCalled();
    });

    test('should handle API errors during reidentifyText', async () => {
        jest.mock('../../../src/utils/validations', () => ({
            validateDeIdentifyTextRequest: jest.fn(),
            validateReidentifyTextRequest: jest.fn(),
        }));
        validateReidentifyTextRequest.mockImplementation(() => {
            // No validation error
        });
        const mockRequest = {
            text: 'Redacted text to reidentify',
        };
        const mockOptions = {
            getRedactedEntities: jest.fn().mockReturnValue(['NAME']),
            getMaskedEntities: jest.fn().mockReturnValue(['EMAIL']),
            getPlainTextEntities: jest.fn().mockReturnValue(['PHONE']),
        };

        mockVaultClient.stringsAPI.reidentifyString.mockImplementation(() => ({
            withRawResponse: jest.fn().mockRejectedValue(new Error('API error')),
        }));

        await expect(detectController.reidentifyText(mockRequest, mockOptions)).rejects.toThrow(
            'API error'
        );
        expect(mockVaultClient.stringsAPI.reidentifyString).toHaveBeenCalled();
    });

    test('should reidentify text without options (covers options?.xxx false branches)', async () => {
        validateReidentifyTextRequest.mockImplementation(() => {});
        const mockRequest = { text: 'redacted text' };

        mockVaultClient.stringsAPI.reidentifyString.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { text: 'plain text' },
                rawResponse: null,
            }),
        }));

        const response = await detectController.reidentifyText(mockRequest);
        expect(response).toBeInstanceOf(ReidentifyTextResponse);
        expect(response.processedText).toBe('plain text');
    });
});

describe('getDetectRun', () => {
    let mockVaultClient;
    let detectController;

    beforeEach(() => {
        mockVaultClient = {
            getLogLevel: jest.fn().mockReturnValue('DEBUG'),
            getCredentials: jest.fn().mockReturnValue({}),
            initAPI: jest.fn(),
            filesAPI: {
                getRun: jest.fn(),
            },
            failureResponse: jest.fn().mockRejectedValue(new Error('API error')),
            vaultId: 'vault123',
        };
        detectController = new DetectController(mockVaultClient);
        jest.clearAllMocks();
    });

    test('should successfully get detect run and parse response', async () => {
        jest.mock('../../../src/utils/validations', () => ({
            validateGetDetectRunRequest: jest.fn(),
        }));
        validateGetDetectRunRequest.mockImplementation(() => {
            // No validation error
        });
        const mockRequest = { runId: 'mockRunId' };
        const mockResponseData = {
            output: [
                {
                    processedFile: 'mockProcessedFile',
                    processedFileType: 'text',
                    processedFileExtension: 'txt',
                },
            ],
            wordCharacterCount: {
                wordCount: 100,
                characterCount: 500,
            },
            size: 1024,
            duration: 0,
            pages: 1,
            slides: 0,
            run_id: 'mockRunId',
        };

        mockVaultClient.filesAPI.getRun.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: mockResponseData,
                rawResponse: { headers: { get: jest.fn().mockReturnValue('request-id-123') } },
            }),
        }));

        const result = await detectController.getDetectRun(mockRequest);

        expect(mockVaultClient.filesAPI.getRun).toHaveBeenCalledWith(
            mockRequest.runId,
            { vault_id: 'vault123' }
        );
    });

    test('should handle validation errors', async () => {
        const mockRequest = { runId: 'mockRunId' };
        validateGetDetectRunRequest.mockImplementation(() => {
            throw new Error('Validation error');
        });

        await expect(detectController.getDetectRun(mockRequest)).rejects.toThrow('Validation error');
        expect(mockVaultClient.filesAPI.getRun).not.toHaveBeenCalled();
    });

    test('should handle API errors during getDetectRun', async () => {
        jest.mock('../../../src/utils/validations', () => ({
            validateGetDetectRunRequest: jest.fn(),
        }));
        validateGetDetectRunRequest.mockImplementation(() => {
            // No validation error
        });
        const mockRequest = { runId: 'mockRunId' };
        mockVaultClient.filesAPI.getRun.mockImplementation(() => ({
            withRawResponse: jest.fn().mockRejectedValue(new Error('API error')),
        }));

        await expect(detectController.getDetectRun(mockRequest)).rejects.toThrow('API error');
    });

    // Lines 580-583: catch block — if (error instanceof Error) false branch
    test('should handle non-Error thrown in getDetectRun catch block', async () => {
        validateGetDetectRunRequest.mockImplementation(() => {
            throw 'non-error string exception';
        });
        const mockRequest = { runId: 'mockRunId' };
        await expect(detectController.getDetectRun(mockRequest)).rejects.toBe('non-error string exception');
    });
});

describe('deidentifyFile', () => {
    let mockVaultClient;
    let detectController;

    beforeEach(() => {
        jest.useFakeTimers();
        mockVaultClient = {
            getLogLevel: jest.fn().mockReturnValue('DEBUG'),
            getCredentials: jest.fn().mockReturnValue({}),
            initAPI: jest.fn(),
            filesAPI: {
                deidentifyText: jest.fn(),
                deidentifyAudio: jest.fn(),
                deidentifyPdf: jest.fn(),
                deidentifyImage: jest.fn(),
                deidentifyPresentation: jest.fn(),
                deidentifySpreadsheet: jest.fn(),
                deidentifyStructuredText: jest.fn(),
                deidentifyDocument: jest.fn(),
                deidentifyFile: jest.fn(),
                getRun: jest.fn(),
            },
            failureResponse: jest.fn().mockRejectedValue(new Error('API error')),
            vaultId: 'vault123',
        };
        detectController = new DetectController(mockVaultClient);
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('should successfully deidentify a PDF file and poll until SUCCESS', async () => {
        // Arrange
        const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
        const deidentifyFileReq = new DeidentifyFileRequest({file});
        const options = new DeidentifyFileOptions();
        options.setPixelDensity(300);
        options.setMaxResolution(2000);

        // Mock PDF deidentify API to return a run_id
        mockVaultClient.filesAPI.deidentifyPdf.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'run123' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('request-id-123') } },
            }),
        }));

        // Polling: IN_PROGRESS twice, then SUCCESS
        mockVaultClient.filesAPI.getRun
            .mockResolvedValueOnce({ status: 'IN_PROGRESS' })
            .mockResolvedValueOnce({ status: 'IN_PROGRESS' })
            .mockResolvedValueOnce({
                status: 'SUCCESS',
                output: [
                    {
                        processedFile: 'mockProcessedFile',
                        processedFileType: 'pdf',
                        processedFileExtension: 'pdf',
                    },
                ],
                wordCharacterCount: {
                    wordCount: 10,
                    characterCount: 100,
                },
                size: 2048,
                duration: 0,
                pages: 2,
                slides: 0,
                run_id: 'run123',
            });

        // Act
        const promise = detectController.deidentifyFile(deidentifyFileReq, options);

        // Fast-forward all timers and flush all microtasks
        await jest.runAllTimersAsync();

        const result = await promise;

        // Assert
        expect(mockVaultClient.filesAPI.deidentifyPdf).toHaveBeenCalled();
        expect(mockVaultClient.filesAPI.getRun).toHaveBeenCalledTimes(3);
        expect(result.fileBase64).toBe('mockProcessedFile');
        expect(result.type).toBe('pdf');
        expect(result.extension).toBe('pdf');
        expect(result.wordCount).toBe(10);
        expect(result.charCount).toBe(100);
        expect(result.sizeInKb).toBe(2048);
        expect(result.pageCount).toBe(2);
        expect(result.status).toBe('SUCCESS');
        expect(result.errors).toBeNull();
    });

    test('should successfully deidentify a PDF file using file path', async () => {
        const filePath = 'test/mockData/pii.pdf';
        const deidentifyFileReq = new DeidentifyFileRequest({filePath});
        const options = new DeidentifyFileOptions();
        options.setPixelDensity(300);
        options.setMaxResolution(2000);

        // Mock fs.promises.readFile so fake timers don't block on real I/O
        jest.spyOn(fs.promises, 'readFile').mockResolvedValue(Buffer.from('dummy pdf content'));

        // Mock PDF deidentify API to return a run_id
        mockVaultClient.filesAPI.deidentifyPdf.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'run123' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('request-id-123') } },
            }),
        }));

        // Polling: IN_PROGRESS twice, then SUCCESS
        mockVaultClient.filesAPI.getRun
            .mockResolvedValueOnce({ status: 'IN_PROGRESS' })
            .mockResolvedValueOnce({ status: 'IN_PROGRESS' })
            .mockResolvedValueOnce({
                status: 'SUCCESS',
                output: [
                    {
                        processedFile: 'mockProcessedFile',
                        processedFileType: 'pdf',
                        processedFileExtension: 'pdf',
                    },
                ],
                wordCharacterCount: {
                    wordCount: 10,
                    characterCount: 100,
                },
                size: 2048,
                duration: 0,
                pages: 2,
                slides: 0,
                run_id: 'run123',
            });

        // Act
        const promise = detectController.deidentifyFile(deidentifyFileReq, options);

        // Fast-forward all timers and flush all microtasks
        await jest.runAllTimersAsync();

        const result = await promise;

        // Assert
        expect(mockVaultClient.filesAPI.deidentifyPdf).toHaveBeenCalled();
        expect(mockVaultClient.filesAPI.getRun).toHaveBeenCalledTimes(3);
        expect(result.fileBase64).toBe('mockProcessedFile');
        expect(result.type).toBe('pdf');
        expect(result.extension).toBe('pdf');
        expect(result.wordCount).toBe(10);
        expect(result.charCount).toBe(100);
        expect(result.sizeInKb).toBe(2048);
        expect(result.pageCount).toBe(2);
        expect(result.status).toBe('SUCCESS');

        // Assert file object
        expect(result.file).toBeInstanceOf(File);
        expect(result.file.name).toBe('deidentified.pdf');
    });

    test('should reject for PDF if polling returns FAILED', async () => {
        const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
        const deidentifyFileReq = new DeidentifyFileRequest(file);
        const options = new DeidentifyFileOptions();

        mockVaultClient.filesAPI.deidentifyPdf.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'run123' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('request-id-123') } },
            }),
        }));

        mockVaultClient.filesAPI.getRun.mockResolvedValue({ status: 'FAILED', message: 'Processing failed' });

        await expect(detectController.deidentifyFile(deidentifyFileReq, options)).rejects.toThrow();
    });

    test('should reject for PDF if polling throws error', async () => {
        const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
        const deidentifyFileReq = new DeidentifyFileRequest({file});
        const options = new DeidentifyFileOptions();

        mockVaultClient.filesAPI.deidentifyPdf.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'run123' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('request-id-123') } },
            }),
        }));

        mockVaultClient.filesAPI.getRun.mockRejectedValue(new Error('Polling error'));

        await expect(detectController.deidentifyFile(deidentifyFileReq, options)).rejects.toThrow('Polling error');
    });

    test('should reject if deidentifyPdf throws error', async () => {
        const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
        const deidentifyFileReq = new DeidentifyFileRequest({file});
        const options = new DeidentifyFileOptions();

        mockVaultClient.filesAPI.deidentifyPdf.mockImplementation(() => ({
            withRawResponse: jest.fn().mockRejectedValue(new Error('API error')),
        }));

        await expect(detectController.deidentifyFile(deidentifyFileReq, options)).rejects.toThrow('API error');
    });

    test('should successfully deidentify an audio file and poll until SUCCESS', async () => {
        const file = new File(['audio content'], 'test.mp3');
        const deidentifyFileReq = new DeidentifyFileRequest({file});
        const options = new DeidentifyFileOptions();

        mockVaultClient.filesAPI.deidentifyAudio.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'audioRunId' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('request-id-456') } },
            }),
        }));

        mockVaultClient.filesAPI.getRun
            .mockResolvedValueOnce({ status: 'IN_PROGRESS' })
            .mockResolvedValueOnce({ status: 'IN_PROGRESS' })
            .mockResolvedValueOnce({
                status: 'SUCCESS',
                output: [
                    {
                        processedFile: 'audioProcessedFile',
                        processedFileType: 'mp3',
                        processedFileExtension: 'mp3',
                    },
                ],
                wordCharacterCount: {
                    wordCount: 5,
                    characterCount: 50,
                },
                size: 512,
                duration: 10,
                pages: 0,
                slides: 0,
                run_id: 'audioRunId',
            });

        const promise = detectController.deidentifyFile(deidentifyFileReq, options);
        await jest.runAllTimersAsync();

        const result = await promise;
        expect(mockVaultClient.filesAPI.deidentifyAudio).toHaveBeenCalled();
    });

    test('should successfully deidentify an image file and poll until SUCCESS', async () => {
        const file = new File(['image content'], 'test.png', { type: 'image/png' });
        const deidentifyFileReq = new DeidentifyFileRequest({file});
        const options = new DeidentifyFileOptions();

        mockVaultClient.filesAPI.deidentifyImage.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'imgRunId' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('request-id-789') } },
            }),
        }));

        mockVaultClient.filesAPI.getRun
            .mockResolvedValueOnce({ status: 'IN_PROGRESS' })
            .mockResolvedValueOnce({ status: 'IN_PROGRESS' })
            .mockResolvedValueOnce({
                status: 'SUCCESS',
                output: [
                    {
                        processedFile: 'imgProcessedFile',
                        processedFileType: 'png',
                        processedFileExtension: 'png',
                    },
                ],
                wordCharacterCount: {
                    wordCount: 2,
                    characterCount: 20,
                },
                size: 256,
                duration: 0,
                pages: 0,
                slides: 0,
                run_id: 'imgRunId',
            });

        const promise = detectController.deidentifyFile(deidentifyFileReq, options);
        await jest.runAllTimersAsync();

        const result = await promise;
        expect(mockVaultClient.filesAPI.deidentifyImage).toHaveBeenCalled();
        expect(mockVaultClient.filesAPI.getRun).toHaveBeenCalledTimes(3);
    });

    test('should successfully deidentify a spreadsheet file and poll until SUCCESS', async () => {
        const file = new File(['spreadsheet content'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const deidentifyFileReq = new DeidentifyFileRequest({file});
        const options = new DeidentifyFileOptions();

        mockVaultClient.filesAPI.deidentifySpreadsheet.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'sheetRunId' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('request-id-321') } },
            }),
        }));

        mockVaultClient.filesAPI.getRun
            .mockResolvedValueOnce({ status: 'IN_PROGRESS' })
            .mockResolvedValueOnce({ status: 'IN_PROGRESS' })
            .mockResolvedValueOnce({
                status: 'SUCCESS',
                output: [
                    {
                        processedFile: 'sheetProcessedFile',
                        processedFileType: 'xlsx',
                        processedFileExtension: 'xlsx',
                    },
                ],
                wordCharacterCount: {
                    wordCount: 8,
                    characterCount: 80,
                },
                size: 1024,
                duration: 0,
                pages: 0,
                slides: 0,
                run_id: 'sheetRunId',
            });

        const promise = detectController.deidentifyFile(deidentifyFileReq, options);
        await jest.runAllTimersAsync();

        const result = await promise;
        expect(mockVaultClient.filesAPI.deidentifySpreadsheet).toHaveBeenCalled();
        expect(result.fileBase64).toBe('sheetProcessedFile');
        expect(result.type).toBe('xlsx');
        expect(result.extension).toBe('xlsx');
        expect(result.wordCount).toBe(8);
        expect(result.charCount).toBe(80);
        expect(result.sizeInKb).toBe(1024);
        expect(result.status).toBe('SUCCESS');
    });

    test('should successfully deidentify a ppt file and poll until SUCCESS', async () => {
        const file = new File(['ppt content'], 'test.pptx', { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
        const deidentifyFileReq = new DeidentifyFileRequest({file});
        const options = new DeidentifyFileOptions();

        mockVaultClient.filesAPI.deidentifyPresentation.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'pptRunId' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('request-id-654') } },
            }),
        }));

        mockVaultClient.filesAPI.getRun
            .mockResolvedValueOnce({ status: 'IN_PROGRESS' })
            .mockResolvedValueOnce({
                status: 'SUCCESS',
                output: [
                    {
                        processedFile: 'pptProcessedFile',
                        processedFileType: 'pptx',
                        processedFileExtension: 'pptx',
                    },
                ],
                wordCharacterCount: {
                    wordCount: 3,
                    characterCount: 30,
                },
                size: 2048,
                duration: 0,
                pages: 0,
                slides: 5,
                run_id: 'pptRunId',
            });

        const promise = detectController.deidentifyFile(deidentifyFileReq, options);
        await jest.runAllTimersAsync();

        const result = await promise;
        expect(result.fileBase64).toBe('pptProcessedFile');
        expect(result.type).toBe('pptx');
        expect(result.extension).toBe('pptx');
        expect(result.wordCount).toBe(3);
        expect(result.charCount).toBe(30);
        expect(result.sizeInKb).toBe(2048);
        expect(result.slideCount).toBe(5);
        expect(result.status).toBe('SUCCESS');
    });

    test('should successfully deidentify a structured text file and poll until SUCCESS', async () => {
        const file = new File(['json content'], 'test.json', { type: 'application/json' });
        const deidentifyFileReq = new DeidentifyFileRequest({file});
        const options = new DeidentifyFileOptions();

        mockVaultClient.filesAPI.deidentifyStructuredText.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'jsonRunId' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('request-id-987') } },
            }),
        }));

        mockVaultClient.filesAPI.getRun
            .mockResolvedValueOnce({ status: 'IN_PROGRESS' })
            .mockResolvedValueOnce({
                status: 'SUCCESS',
                output: [
                    {
                        processedFile: 'jsonProcessedFile',
                        processedFileType: 'json',
                        processedFileExtension: 'json',
                    },
                ],
                wordCharacterCount: {
                    wordCount: 6,
                    characterCount: 60,
                },
                size: 512,
                duration: 0,
                pages: 0,
                slides: 0,
                run_id: 'jsonRunId',
            });

        const promise = detectController.deidentifyFile(deidentifyFileReq, options);
        await jest.runAllTimersAsync();

        const result = await promise;
        expect(result.fileBase64).toBe('jsonProcessedFile');
        expect(result.type).toBe('json');
        expect(result.extension).toBe('json');
        expect(result.wordCount).toBe(6);
        expect(result.charCount).toBe(60);
        expect(result.sizeInKb).toBe(512);
        expect(result.status).toBe('SUCCESS');
    });

    test('should successfully deidentify a document file and poll until SUCCESS', async () => {
        const file = new File(['doc content'], 'test.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const deidentifyFileReq = new DeidentifyFileRequest({file});
        const options = new DeidentifyFileOptions();

        mockVaultClient.filesAPI.deidentifyDocument.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'docRunId' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('request-id-111') } },
            }),
        }));

        mockVaultClient.filesAPI.getRun
            .mockResolvedValueOnce({ status: 'IN_PROGRESS' })
            .mockResolvedValueOnce({
                status: 'SUCCESS',
                output: [
                    {
                        processedFile: 'docProcessedFile',
                        processedFileType: 'docx',
                        processedFileExtension: 'docx',
                    },
                ],
                wordCharacterCount: {
                    wordCount: 7,
                    characterCount: 70,
                },
                size: 1024,
                duration: 0,
                pages: 1,
                slides: 0,
                run_id: 'docRunId',
            });

        const promise = detectController.deidentifyFile(deidentifyFileReq, options);
        await jest.runAllTimersAsync();

        const result = await promise;
        expect(result.fileBase64).toBe('docProcessedFile');
        expect(result.type).toBe('docx');
        expect(result.extension).toBe('docx');
        expect(result.wordCount).toBe(7);
        expect(result.charCount).toBe(70);
        expect(result.sizeInKb).toBe(1024);
        expect(result.pageCount).toBe(1);
        expect(result.status).toBe('SUCCESS');
    });

  test('should successfully deidentify a text file and poll until SUCCESS', async () => {
    // 1. Data Setup
    const file = new File(['doc content'], 'test.txt', { type: 'text/plain' });
    const deidentifyFileReq = new DeidentifyFileRequest({ file });
    const options = new DeidentifyFileOptions();
    options.setOutputDirectory('/mock/output/directory');

    // 2. Mock File System (source uses fs.promises — spy on async methods)
    const mkdirSpy = jest.spyOn(fs.promises, 'mkdir').mockResolvedValue(undefined);
    const writeFileSpy = jest.spyOn(fs.promises, 'writeFile').mockResolvedValue(undefined);

    // 3. Mock deidentifyFile (The specific method causing the TypeError)
    mockVaultClient.filesAPI.deidentifyFile = jest.fn().mockImplementation(() => ({
        withRawResponse: jest.fn().mockResolvedValue({
            data: { run_id: 'docRunId' },
            rawResponse: { 
                headers: { 
                    get: jest.fn().mockReturnValue('request-id-111') 
                } 
            },
        }),
    }));

    mockVaultClient.filesAPI.getRun = jest.fn()
        .mockResolvedValueOnce({ status: 'IN_PROGRESS' })
        .mockResolvedValueOnce({
            status: 'SUCCESS',
            output: [
                {
                    processedFile: Buffer.from('textProcessedFile').toString('base64'),
                    processedFileType: 'text',
                    processedFileExtension: 'txt',
                },
            ],
            wordCharacterCount: {
                wordCount: 7,
                characterCount: 70,
            },
            size: 1024,
            duration: 0,
            pages: 1,
            slides: 0,
            run_id: 'docRunId',
        });

    const promise = detectController.deidentifyFile(deidentifyFileReq, options);

    // Fast-forward through the polling intervals
    await jest.runAllTimersAsync();

    const result = await promise;

    // 6. Assertions
    expect(result.extension).toBe('txt');
    expect(result.wordCount).toBe(7);
    expect(result.status).toBe('SUCCESS');

    // Verify file system interactions
    expect(mkdirSpy).toHaveBeenCalledWith('/mock/output/directory', { recursive: true });
    expect(writeFileSpy).toHaveBeenCalledWith(
        expect.stringContaining('processed-test.txt'),
        expect.any(Buffer)
    );
});

    test('should successfully deidentify a generic file and poll until SUCCESS', async () => {
        const file = new File(['generic content'], 'test.abc', { type: 'application/octet-stream' });
        const deidentifyFileReq = new DeidentifyFileRequest({file});
        const options = new DeidentifyFileOptions();

        mockVaultClient.filesAPI.deidentifyFile.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'genRunId' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('request-id-222') } },
            }),
        }));

        mockVaultClient.filesAPI.getRun
            .mockResolvedValueOnce({ status: 'IN_PROGRESS' })
            .mockResolvedValueOnce({
                status: 'SUCCESS',
                output: [
                    {
                        processedFile: 'genProcessedFile',
                        processedFileType: 'abc',
                        processedFileExtension: 'abc',
                    },
                ],
                wordCharacterCount: {
                    wordCount: 4,
                    characterCount: 40,
                },
                size: 256,
                duration: 0,
                pages: 0,
                slides: 0,
                run_id: 'genRunId',
            });

        const promise = detectController.deidentifyFile(deidentifyFileReq, options);
        await jest.runAllTimersAsync();

        const result = await promise;
        expect(result.fileBase64).toBe('genProcessedFile');
        expect(result.type).toBe('abc');
        expect(result.extension).toBe('abc');
        expect(result.wordCount).toBe(4);
        expect(result.charCount).toBe(40);
        expect(result.sizeInKb).toBe(256);
        expect(result.status).toBe('SUCCESS');
    });

    test('should successfully deidentify a PDF file and save processed file to output directory', async () => {
    // 1. Clear any previous mock call data
    jest.clearAllMocks();

    const pdfFile = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    const pdfRequest = new DeidentifyFileRequest({file: pdfFile});

    const mockOptions = new DeidentifyFileOptions();
    mockOptions.setWaitTime(16);
    mockOptions.setOutputDirectory('/mock/output/directory');

    // Mock API implementations...
    mockVaultClient.filesAPI.deidentifyPdf.mockImplementation(() => ({
        withRawResponse: jest.fn().mockResolvedValue({
            data: { run_id: 'mockRunId' },
            rawResponse: { headers: { get: jest.fn().mockReturnValue('request-id-123') } },
        }),
    }));

    mockVaultClient.filesAPI.getRun
        .mockResolvedValueOnce({ status: 'IN_PROGRESS' })
        .mockResolvedValueOnce({ status: 'IN_PROGRESS' })
        .mockResolvedValueOnce({
            status: 'SUCCESS',
            output: [{
                processedFile: Buffer.from('mockProcessedFileContent').toString('base64'),
                processedFileType: 'pdf',
                processedFileExtension: 'pdf',
            }],
            // ... (other mock data)
        });

    // 2. Setup Spies (source uses fs.promises — spy on async methods)
    const mkdirSpy = jest.spyOn(fs.promises, 'mkdir').mockResolvedValue(undefined);
    const writeSpy = jest.spyOn(fs.promises, 'writeFile').mockResolvedValue(undefined);

    // 3. START the execution
    const promise = detectController.deidentifyFile(pdfRequest, mockOptions);

    // 4. ADVANCE timers so the polling intervals fire
    await jest.runAllTimersAsync();

    // 5. AWAIT the result
    const result = await promise;
    
    // Assertions
    expect(result.extension).toBe('pdf');
    expect(mkdirSpy).toHaveBeenCalledWith('/mock/output/directory', { recursive: true });
    expect(writeSpy).toHaveBeenCalledWith(
        expect.stringContaining('processed-test.pdf'),
        expect.any(Buffer)
    );
});

    // Lines 101-119, 319, 621-631: TEXT file type via .text extension
    test('should successfully deidentify a text file using deidentifyText API', async () => {
        jest.clearAllMocks();
        const file = new File(['text content'], 'test.text', { type: 'text/plain' });
        const deidentifyFileReq = new DeidentifyFileRequest({file});
        const options = new DeidentifyFileOptions();

        mockVaultClient.filesAPI.deidentifyText.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'textRunId' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('request-id-text') } },
            }),
        }));

        mockVaultClient.filesAPI.getRun
            .mockResolvedValueOnce({ status: 'IN_PROGRESS' })
            .mockResolvedValueOnce({
                status: 'SUCCESS',
                output: [{
                    processedFile: 'textProcessedFile',
                    processedFileType: 'text',
                    processedFileExtension: 'txt',
                }],
                wordCharacterCount: { wordCount: 3, characterCount: 30 },
                size: 128,
                duration: 0,
                pages: 0,
                slides: 0,
                run_id: 'textRunId',
            });

        const promise = detectController.deidentifyFile(deidentifyFileReq, options);
        await jest.runAllTimersAsync();

        const result = await promise;
        expect(mockVaultClient.filesAPI.deidentifyText).toHaveBeenCalled();
        expect(result.fileBase64).toBe('textProcessedFile');
        expect(result.status).toBe('SUCCESS');
    });

    // Line 483: entities array populated from output with processedFileType === 'entities'
    test('should populate entities array when output contains entities type items', async () => {
        jest.clearAllMocks();
        const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
        const deidentifyFileReq = new DeidentifyFileRequest({file});
        const options = new DeidentifyFileOptions();

        mockVaultClient.filesAPI.deidentifyPdf.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'entRunId' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('req-ent') } },
            }),
        }));

        mockVaultClient.filesAPI.getRun.mockResolvedValueOnce({
            status: 'SUCCESS',
            output: [
                {
                    processedFile: 'mainProcessedFile',
                    processedFileType: 'pdf',
                    processedFileExtension: 'pdf',
                },
                {
                    processedFile: 'entitiesData',
                    processedFileType: 'entities',
                    processedFileExtension: 'json',
                },
            ],
            wordCharacterCount: { wordCount: 5, characterCount: 50 },
            size: 512,
            duration: 0,
            pages: 1,
            slides: 0,
            run_id: 'entRunId',
        });

        const promise = detectController.deidentifyFile(deidentifyFileReq, options);
        await jest.runAllTimersAsync();

        const result = await promise;
        expect(result.entities).toHaveLength(1);
        expect(result.entities[0].file).toBe('entitiesData');
        expect(result.entities[0].extension).toBe('json');
    });

    // Lines 347-348 + 720: maxWaitTime=1 reached on first poll → resolve IN_PROGRESS → early return
    test('should return IN_PROGRESS response when maxWaitTime reached during first poll', async () => {
        jest.clearAllMocks();
        const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
        const deidentifyFileReq = new DeidentifyFileRequest({file});
        const options = new DeidentifyFileOptions();
        options.setWaitTime(1);

        mockVaultClient.filesAPI.deidentifyPdf.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'pollRunId' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('req-poll') } },
            }),
        }));

        mockVaultClient.filesAPI.getRun.mockResolvedValue({ status: 'IN_PROGRESS' });

        const promise = detectController.deidentifyFile(deidentifyFileReq, options);
        await jest.runAllTimersAsync();

        const result = await promise;
        expect(result.runId).toBe('pollRunId');
        expect(result.status).toBe('IN_PROGRESS');
    });

    // Lines 353-354: nextWaitTime >= maxWaitTime → cap currentWaitTime then hit max on second poll
    test('should cap wait time when nextWaitTime exceeds maxWaitTime', async () => {
        jest.clearAllMocks();
        const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
        const deidentifyFileReq = new DeidentifyFileRequest({file});
        const options = new DeidentifyFileOptions();
        options.setWaitTime(2);

        mockVaultClient.filesAPI.deidentifyPdf.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'capRunId' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('req-cap') } },
            }),
        }));

        mockVaultClient.filesAPI.getRun.mockResolvedValue({ status: 'IN_PROGRESS' });

        const promise = detectController.deidentifyFile(deidentifyFileReq, options);
        await jest.runAllTimersAsync();

        const result = await promise;
        expect(result.runId).toBe('capRunId');
        expect(result.status).toBe('IN_PROGRESS');
    });

    // Lines 366-367: FAILED status via correct {file} constructor
    test('should reject when polling returns FAILED status (correct request wrapper)', async () => {
        jest.clearAllMocks();
        const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
        const deidentifyFileReq = new DeidentifyFileRequest({file});
        const options = new DeidentifyFileOptions();

        mockVaultClient.filesAPI.deidentifyPdf.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'failRunId' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('req-fail') } },
            }),
        }));

        mockVaultClient.filesAPI.getRun.mockResolvedValue({ status: 'FAILED', message: 'Processing failed' });

        await expect(detectController.deidentifyFile(deidentifyFileReq, options)).rejects.toThrow();
    });

    // Lines 368-369: unknown status via correct {file} constructor
    test('should reject when polling returns unknown status', async () => {
        jest.clearAllMocks();
        const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
        const deidentifyFileReq = new DeidentifyFileRequest({file});
        const options = new DeidentifyFileOptions();

        mockVaultClient.filesAPI.deidentifyPdf.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'unknownRunId' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('req-unknown') } },
            }),
        }));

        mockVaultClient.filesAPI.getRun.mockResolvedValue({ status: 'UNKNOWN_STATUS', message: 'unexpected' });

        await expect(detectController.deidentifyFile(deidentifyFileReq, options)).rejects.toThrow();
    });

    // Line 285: null processedFile → continue (skip writing)
    test('should skip output item when processedFile is null', async () => {
        jest.clearAllMocks();
        const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
        const deidentifyFileReq = new DeidentifyFileRequest({file});
        const options = new DeidentifyFileOptions();
        options.setOutputDirectory('/mock/output');

        const mkdirSpy = jest.spyOn(fs.promises, 'mkdir').mockResolvedValue(undefined);
        const writeSpy = jest.spyOn(fs.promises, 'writeFile').mockResolvedValue(undefined);

        mockVaultClient.filesAPI.deidentifyPdf.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'runNull' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('req-null') } },
            }),
        }));

        mockVaultClient.filesAPI.getRun.mockResolvedValueOnce({
            status: 'SUCCESS',
            output: [
                { processedFile: null, processedFileExtension: 'pdf' },
            ],
            wordCharacterCount: { wordCount: 0, characterCount: 0 },
            size: 0, duration: 0, pages: 0, slides: 0,
            run_id: 'runNull',
        });

        const promise = detectController.deidentifyFile(deidentifyFileReq, options);
        await jest.runAllTimersAsync();

        await promise;
        expect(mkdirSpy).toHaveBeenCalled();
        expect(writeSpy).not.toHaveBeenCalled();
    });

    // Line 289: non-alphanumeric extension → throw SkyflowError
    test('should throw when processedFileExtension contains non-alphanumeric characters', async () => {
        jest.clearAllMocks();
        const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
        const deidentifyFileReq = new DeidentifyFileRequest({file});
        const options = new DeidentifyFileOptions();
        options.setOutputDirectory('/mock/output');

        jest.spyOn(fs.promises, 'mkdir').mockResolvedValue(undefined);

        mockVaultClient.filesAPI.deidentifyPdf.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'runBadExt' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('req-badext') } },
            }),
        }));

        mockVaultClient.filesAPI.getRun.mockResolvedValueOnce({
            status: 'SUCCESS',
            output: [
                { processedFile: 'base64data', processedFileExtension: '../etc' },
            ],
            wordCharacterCount: { wordCount: 0, characterCount: 0 },
            size: 0, duration: 0, pages: 0, slides: 0,
            run_id: 'runBadExt',
        });

        await expect(detectController.deidentifyFile(deidentifyFileReq, options)).rejects.toThrow();
    });

    // Lines 301-302: json extension → Buffer.from().toString(utf8) → writeFile with string
    test('should write UTF-8 decoded content for json extension', async () => {
        jest.clearAllMocks();
        const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
        const deidentifyFileReq = new DeidentifyFileRequest({file});
        const options = new DeidentifyFileOptions();
        options.setOutputDirectory('/mock/output');

        const mkdirSpy = jest.spyOn(fs.promises, 'mkdir').mockResolvedValue(undefined);
        const writeSpy = jest.spyOn(fs.promises, 'writeFile').mockResolvedValue(undefined);

        const base64Json = Buffer.from('{"key":"value"}').toString('base64');

        mockVaultClient.filesAPI.deidentifyPdf.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'runJson' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('req-json') } },
            }),
        }));

        mockVaultClient.filesAPI.getRun.mockResolvedValueOnce({
            status: 'SUCCESS',
            output: [
                { processedFile: base64Json, processedFileType: 'json', processedFileExtension: 'json' },
            ],
            wordCharacterCount: { wordCount: 0, characterCount: 0 },
            size: 0, duration: 0, pages: 0, slides: 0,
            run_id: 'runJson',
        });

        const promise = detectController.deidentifyFile(deidentifyFileReq, options);
        await jest.runAllTimersAsync();

        await promise;
        expect(writeSpy).toHaveBeenCalledWith(
            expect.stringContaining('processed-test.json'),
            '{"key":"value"}'
        );
    });

    // Lines 303-305: mp3 extension → Buffer.from() → writeFile with binary encoding
    test('should write binary content for mp3 extension', async () => {
        jest.clearAllMocks();
        const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
        const deidentifyFileReq = new DeidentifyFileRequest({file});
        const options = new DeidentifyFileOptions();
        options.setOutputDirectory('/mock/output');

        const mkdirSpy = jest.spyOn(fs.promises, 'mkdir').mockResolvedValue(undefined);
        const writeSpy = jest.spyOn(fs.promises, 'writeFile').mockResolvedValue(undefined);

        const base64Mp3 = Buffer.from('mp3 audio data').toString('base64');

        mockVaultClient.filesAPI.deidentifyPdf.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'runMp3' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('req-mp3') } },
            }),
        }));

        mockVaultClient.filesAPI.getRun.mockResolvedValueOnce({
            status: 'SUCCESS',
            output: [
                { processedFile: base64Mp3, processedFileType: 'mp3', processedFileExtension: 'mp3' },
            ],
            wordCharacterCount: { wordCount: 0, characterCount: 0 },
            size: 0, duration: 0, pages: 0, slides: 0,
            run_id: 'runMp3',
        });

        const promise = detectController.deidentifyFile(deidentifyFileReq, options);
        await jest.runAllTimersAsync();

        await promise;
        expect(writeSpy).toHaveBeenCalledWith(
            expect.stringContaining('processed-test.mp3'),
            expect.any(Buffer),
            { encoding: 'binary' }
        );
    });

    // Line 297: path traversal detected → throw SkyflowError
    test('should throw when resolved output path escapes the output directory', async () => {
        jest.clearAllMocks();
        const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
        const deidentifyFileReq = new DeidentifyFileRequest({file});
        const options = new DeidentifyFileOptions();
        options.setOutputDirectory('/mock/output');

        const pathModule = require('path');
        const resolveSpy = jest.spyOn(pathModule, 'resolve')
            .mockReturnValueOnce('/etc/malicious.pdf')
            .mockReturnValueOnce('/mock/output');

        jest.spyOn(fs.promises, 'mkdir').mockResolvedValue(undefined);

        mockVaultClient.filesAPI.deidentifyPdf.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'runTraversal' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('req-traversal') } },
            }),
        }));

        mockVaultClient.filesAPI.getRun.mockResolvedValueOnce({
            status: 'SUCCESS',
            output: [
                { processedFile: 'base64data', processedFileType: 'pdf', processedFileExtension: 'pdf' },
            ],
            wordCharacterCount: { wordCount: 0, characterCount: 0 },
            size: 0, duration: 0, pages: 0, slides: 0,
            run_id: 'runTraversal',
        });

        try {
            await expect(detectController.deidentifyFile(deidentifyFileReq, options)).rejects.toThrow();
        } finally {
            resolveSpy.mockRestore();
        }
    });

    // Line 274: writeFile throws inside decodeBase64AndSaveToFile → SkyflowError
    test('should throw SkyflowError when writeFile fails in decodeBase64AndSaveToFile', async () => {
        jest.clearAllMocks();
        const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
        const deidentifyFileReq = new DeidentifyFileRequest({file});
        const options = new DeidentifyFileOptions();
        options.setOutputDirectory('/mock/output');

        jest.spyOn(fs.promises, 'mkdir').mockResolvedValue(undefined);
        jest.spyOn(fs.promises, 'writeFile').mockRejectedValue(new Error('Disk full'));

        const base64Data = Buffer.from('some content').toString('base64');

        mockVaultClient.filesAPI.deidentifyPdf.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'runWrite' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('req-write') } },
            }),
        }));

        mockVaultClient.filesAPI.getRun.mockResolvedValueOnce({
            status: 'SUCCESS',
            output: [
                { processedFile: base64Data, processedFileType: 'bin', processedFileExtension: 'bin' },
            ],
            wordCharacterCount: { wordCount: 0, characterCount: 0 },
            size: 0, duration: 0, pages: 0, slides: 0,
            run_id: 'runWrite',
        });

        await expect(detectController.deidentifyFile(deidentifyFileReq, options)).rejects.toThrow();
    });

    // Lines 82-99: buildAudioRequest options?.xxx false branches (options undefined)
    test('should deidentify audio file without options', async () => {
        jest.clearAllMocks();
        const file = new File(['audio content'], 'test.mp3');
        const deidentifyFileReq = new DeidentifyFileRequest({file});

        mockVaultClient.filesAPI.deidentifyAudio.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'audioNoOpts' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('req-audio-no') } },
            }),
        }));

        mockVaultClient.filesAPI.getRun.mockResolvedValueOnce({
            status: 'SUCCESS',
            output: [{ processedFile: 'audioData', processedFileType: 'mp3', processedFileExtension: 'mp3' }],
            wordCharacterCount: { wordCount: 1, characterCount: 10 },
            size: 100, duration: 5, pages: 0, slides: 0,
        });

        const promise = detectController.deidentifyFile(deidentifyFileReq);
        await jest.runAllTimersAsync();
        const result = await promise;
        expect(result.status).toBe('SUCCESS');
    });

    // Lines 100-120: buildTextFileRequest options?.xxx false branches (options undefined)
    test('should deidentify text file without options (covers buildTextFileRequest options?.xxx false branches)', async () => {
        jest.clearAllMocks();
        // .text extension (contains 'text') routes to TEXT handler / buildTextFileRequest
        const file = new File(['text content'], 'test.text');
        const deidentifyFileReq = new DeidentifyFileRequest({file});

        mockVaultClient.filesAPI.deidentifyText.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'textNoOpts' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('req-text-no') } },
            }),
        }));

        mockVaultClient.filesAPI.getRun.mockResolvedValueOnce({
            status: 'SUCCESS',
            output: [{ processedFile: 'textData', processedFileType: 'text', processedFileExtension: 'text' }],
            wordCharacterCount: { wordCount: 1, characterCount: 10 },
            size: 100, duration: 0, pages: 0, slides: 0,
        });

        const promise = detectController.deidentifyFile(deidentifyFileReq);
        await jest.runAllTimersAsync();
        const result = await promise;
        expect(result.status).toBe('SUCCESS');
    });

    // Lines 129-138: buildPdfRequest options?.xxx false branches (options undefined)
    test('should deidentify pdf file without options', async () => {
        jest.clearAllMocks();
        const file = new File(['pdf content'], 'test.pdf', { type: 'application/pdf' });
        const deidentifyFileReq = new DeidentifyFileRequest({file});

        mockVaultClient.filesAPI.deidentifyPdf.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'pdfNoOpts' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('req-pdf-no') } },
            }),
        }));

        mockVaultClient.filesAPI.getRun.mockResolvedValueOnce({
            status: 'SUCCESS',
            output: [{ processedFile: 'pdfData', processedFileType: 'pdf', processedFileExtension: 'pdf' }],
            wordCharacterCount: { wordCount: 5, characterCount: 50 },
            size: 512, duration: 0, pages: 1, slides: 0,
        });

        const promise = detectController.deidentifyFile(deidentifyFileReq);
        await jest.runAllTimersAsync();
        const result = await promise;
        expect(result.status).toBe('SUCCESS');
        expect(result.type).toBe('pdf');
    });

    // Lines 151-161: buildImageRequest options?.xxx false branches (options undefined)
    test('should deidentify image file without options', async () => {
        jest.clearAllMocks();
        const file = new File(['image content'], 'test.png', { type: 'image/png' });
        const deidentifyFileReq = new DeidentifyFileRequest({file});

        mockVaultClient.filesAPI.deidentifyImage.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'imgNoOpts' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('req-img-no') } },
            }),
        }));

        mockVaultClient.filesAPI.getRun.mockResolvedValueOnce({
            status: 'SUCCESS',
            output: [{ processedFile: 'imgData', processedFileType: 'png', processedFileExtension: 'png' }],
            wordCharacterCount: { wordCount: 0, characterCount: 0 },
            size: 256, duration: 0, pages: 0, slides: 0,
        });

        const promise = detectController.deidentifyFile(deidentifyFileReq);
        await jest.runAllTimersAsync();
        const result = await promise;
        expect(result.status).toBe('SUCCESS');
    });

    // Lines 175-182: buildPptRequest options?.xxx false branches (options undefined)
    test('should deidentify pptx file without options', async () => {
        jest.clearAllMocks();
        const file = new File(['ppt content'], 'test.pptx');
        const deidentifyFileReq = new DeidentifyFileRequest({file});

        mockVaultClient.filesAPI.deidentifyPresentation.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'pptNoOpts' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('req-ppt-no') } },
            }),
        }));

        mockVaultClient.filesAPI.getRun.mockResolvedValueOnce({
            status: 'SUCCESS',
            output: [{ processedFile: 'pptData', processedFileType: 'pptx', processedFileExtension: 'pptx' }],
            wordCharacterCount: { wordCount: 0, characterCount: 0 },
            size: 128, duration: 0, pages: 0, slides: 5,
        });

        const promise = detectController.deidentifyFile(deidentifyFileReq);
        await jest.runAllTimersAsync();
        const result = await promise;
        expect(result.status).toBe('SUCCESS');
    });

    // Lines 195-202: buildSpreadsheetRequest options?.xxx false branches (options undefined)
    test('should deidentify xlsx file without options', async () => {
        jest.clearAllMocks();
        const file = new File(['sheet content'], 'test.xlsx');
        const deidentifyFileReq = new DeidentifyFileRequest({file});

        mockVaultClient.filesAPI.deidentifySpreadsheet.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'xlsxNoOpts' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('req-xlsx-no') } },
            }),
        }));

        mockVaultClient.filesAPI.getRun.mockResolvedValueOnce({
            status: 'SUCCESS',
            output: [{ processedFile: 'xlsxData', processedFileType: 'xlsx', processedFileExtension: 'xlsx' }],
            wordCharacterCount: { wordCount: 0, characterCount: 0 },
            size: 128, duration: 0, pages: 0, slides: 0,
        });

        const promise = detectController.deidentifyFile(deidentifyFileReq);
        await jest.runAllTimersAsync();
        const result = await promise;
        expect(result.status).toBe('SUCCESS');
    });

    // Lines 215-223: buildStructuredTextRequest options?.xxx false branches (options undefined)
    test('should deidentify json file without options', async () => {
        jest.clearAllMocks();
        const file = new File(['{"key":"val"}'], 'test.json');
        const deidentifyFileReq = new DeidentifyFileRequest({file});

        mockVaultClient.filesAPI.deidentifyStructuredText.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'jsonNoOpts' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('req-json-no') } },
            }),
        }));

        mockVaultClient.filesAPI.getRun.mockResolvedValueOnce({
            status: 'SUCCESS',
            output: [{ processedFile: 'jsonData', processedFileType: 'json', processedFileExtension: 'json' }],
            wordCharacterCount: { wordCount: 0, characterCount: 0 },
            size: 64, duration: 0, pages: 0, slides: 0,
        });

        const promise = detectController.deidentifyFile(deidentifyFileReq);
        await jest.runAllTimersAsync();
        const result = await promise;
        expect(result.status).toBe('SUCCESS');
    });

    // Lines 236-243: buildDocumentRequest options?.xxx false branches (options undefined)
    test('should deidentify docx file without options', async () => {
        jest.clearAllMocks();
        const file = new File(['doc content'], 'test.docx');
        const deidentifyFileReq = new DeidentifyFileRequest({file});

        mockVaultClient.filesAPI.deidentifyDocument.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'docxNoOpts' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('req-docx-no') } },
            }),
        }));

        mockVaultClient.filesAPI.getRun.mockResolvedValueOnce({
            status: 'SUCCESS',
            output: [{ processedFile: 'docxData', processedFileType: 'docx', processedFileExtension: 'docx' }],
            wordCharacterCount: { wordCount: 0, characterCount: 0 },
            size: 64, duration: 0, pages: 0, slides: 0,
        });

        const promise = detectController.deidentifyFile(deidentifyFileReq);
        await jest.runAllTimersAsync();
        const result = await promise;
        expect(result.status).toBe('SUCCESS');
    });

    // Lines 257-264: buildGenericFileRequest options?.xxx false branches (options undefined)
    test('should deidentify generic file without options', async () => {
        jest.clearAllMocks();
        const file = new File(['generic content'], 'test.abc');
        const deidentifyFileReq = new DeidentifyFileRequest({file});

        mockVaultClient.filesAPI.deidentifyFile.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'abcNoOpts' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('req-abc-no') } },
            }),
        }));

        mockVaultClient.filesAPI.getRun.mockResolvedValueOnce({
            status: 'SUCCESS',
            output: [{ processedFile: 'abcData', processedFileType: 'abc', processedFileExtension: 'abc' }],
            wordCharacterCount: { wordCount: 0, characterCount: 0 },
            size: 64, duration: 0, pages: 0, slides: 0,
        });

        const promise = detectController.deidentifyFile(deidentifyFileReq);
        await jest.runAllTimersAsync();
        const result = await promise;
        expect(result.status).toBe('SUCCESS');
    });

    // Lines 344, 363-366: response.status?.toUpperCase() false branch (status undefined)
    test('should reject when getRun returns response with no status field', async () => {
        jest.clearAllMocks();
        const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
        const deidentifyFileReq = new DeidentifyFileRequest({file});
        const options = new DeidentifyFileOptions();

        mockVaultClient.filesAPI.deidentifyPdf.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'runNoStatus' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('req-no-status') } },
            }),
        }));

        // No status field — covers response.status?.toUpperCase() false branch
        mockVaultClient.filesAPI.getRun.mockResolvedValue({});

        await expect(detectController.deidentifyFile(deidentifyFileReq, options)).rejects.toThrow();
    });

    // Lines 459-460, 473, 481: parseDeidentifyFileResponse with null output array
    test('should handle SUCCESS response with null output array', async () => {
        jest.clearAllMocks();
        const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
        const deidentifyFileReq = new DeidentifyFileRequest({file});
        const options = new DeidentifyFileOptions();

        mockVaultClient.filesAPI.deidentifyPdf.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'runNullOut' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('req-null-out') } },
            }),
        }));

        // null output covers data.output?.[0]?.xxx false branches and data.output || [] true branch
        mockVaultClient.filesAPI.getRun.mockResolvedValueOnce({
            status: 'SUCCESS',
            output: null,
            wordCharacterCount: null,
            size: null,
            duration: null,
            pages: null,
            slides: null,
        });

        const promise = detectController.deidentifyFile(deidentifyFileReq, options);
        await jest.runAllTimersAsync();
        const result = await promise;
        expect(result.status).toBe('SUCCESS');
        expect(result.fileBase64).toBe('');
        expect(result.entities).toHaveLength(0);
    });

    // Lines 459-460, 473: parseDeidentifyFileResponse with empty output array
    test('should handle SUCCESS response with empty output array', async () => {
        jest.clearAllMocks();
        const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
        const deidentifyFileReq = new DeidentifyFileRequest({file});
        const options = new DeidentifyFileOptions();

        mockVaultClient.filesAPI.deidentifyPdf.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'runEmptyOut' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('req-empty-out') } },
            }),
        }));

        // empty output covers data.output[0] undefined (?.processedFile false branch)
        mockVaultClient.filesAPI.getRun.mockResolvedValueOnce({
            status: 'SUCCESS',
            output: [],
            wordCharacterCount: { wordCount: 0, characterCount: 0 },
            size: 0, duration: 0, pages: 0, slides: 0,
        });

        const promise = detectController.deidentifyFile(deidentifyFileReq, options);
        await jest.runAllTimersAsync();
        const result = await promise;
        expect(result.status).toBe('SUCCESS');
        expect(result.fileBase64).toBe('');
        expect(result.entities).toHaveLength(0);
    });
});