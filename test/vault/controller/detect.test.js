import DetectController from '../../../src/vault/controller/detect';
import { validateDeidentifyFileRequest, validateDeIdentifyTextRequest, validateGetDetectRunRequest, validateReidentifyTextRequest } from '../../../src/utils/validations';
import DeidentifyTextResponse from '../../../src/vault/model/response/deidentify-text';
import ReidentifyTextResponse from '../../../src/vault/model/response/reidentify-text';
import DeidentifyFileRequest from '../../../src/vault/model/request/deidentify-file';
import DeidentifyFileOptions from '../../../src/vault/model/options/deidentify-file';
import { TYPES } from '../../../src/utils';
import fs from 'fs';

jest.mock('../../../src/utils', () => ({
    printLog: jest.fn(),
    parameterizedString: jest.fn(),
    removeSDKVersion: jest.fn(),
    MessageType: {
        LOG: 'LOG',
        ERROR: 'ERROR',
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
        const file = new File(['doc content'], 'test.txt');
        const deidentifyFileReq = new DeidentifyFileRequest({file});
        const options = new DeidentifyFileOptions();

        mockVaultClient.filesAPI.deidentifyText.mockImplementation(() => ({
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
                        processedFile: 'textProcessedFile',
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
                run_id: 'textRunId',
            });

        const promise = detectController.deidentifyFile(deidentifyFileReq, options);
        await jest.runAllTimersAsync();

        const result = await promise;
        expect(result.fileBase64).toBe('textProcessedFile');
        expect(result.extension).toBe('txt');
        expect(result.wordCount).toBe(7);
        expect(result.charCount).toBe(70);
        expect(result.sizeInKb).toBe(1024);
        expect(result.pageCount).toBe(1);
        expect(result.status).toBe('SUCCESS');
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

        const pdfFile = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
        const pdfRequest = new DeidentifyFileRequest({file: pdfFile});

        const mockOptions = new DeidentifyFileOptions();
        mockOptions.setWaitTime(16);
        mockOptions.setOutputDirectory('/mock/output/directory');

        // Mock the deidentifyPdf API call
        mockVaultClient.filesAPI.deidentifyPdf.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'mockRunId' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('request-id-123') } },
            }),
        }));

        // Mock the getRun API call for polling
        mockVaultClient.filesAPI.getRun
            .mockResolvedValueOnce({ status: 'IN_PROGRESS' })
            .mockResolvedValueOnce({ status: 'IN_PROGRESS' })
            .mockResolvedValueOnce({
                status: 'SUCCESS',
                output: [
                    {
                        processedFile: Buffer.from('mockProcessedFileContent').toString('base64'),
                        processedFileType: 'pdf',
                        processedFileExtension: 'pdf',
                    },
                ],
                wordCharacterCount: {
                    wordCount: 100,
                    characterCount: 500,
                },
                size: 1024,
                duration: 0,
                pages: 10,
                slides: 0,
            });

        // Mock the file system to avoid actual file writes
        jest.spyOn(fs, 'existsSync').mockImplementation((path) => path === '/mock/output/directory');
        jest.spyOn(fs, 'mkdirSync').mockImplementation(() => {});
        jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

        const promise = detectController.deidentifyFile(pdfRequest, mockOptions);

        await jest.runAllTimersAsync();

        const result = await promise;
        
        // Assertions for the response
        expect(result.extension).toBe('pdf');

        // Assertions for processDeidentifyFileResponse
        expect(fs.existsSync).toHaveBeenCalledWith('/mock/output/directory');
        expect(fs.writeFileSync).toHaveBeenCalledWith(
            '/mock/output/directory/processed-test.pdf',
            expect.any(Buffer)
        );
    });
});