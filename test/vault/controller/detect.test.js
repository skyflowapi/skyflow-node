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

describe('DetectController - Files', () => {
    let mockVaultClient;
    let detectController;

    beforeEach(() => {
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
        jest.clearAllMocks();
    });

    const mockFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const mockRequest = new DeidentifyFileRequest(mockFile);
    const mockOptions = new DeidentifyFileOptions();
    mockOptions.setWaitTime(16);

    const mockPollResponse = {
        status: 'SUCCESS',
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
        pages: 0,
        slides: 0,
    };

    const setupPolling = () => {
        mockVaultClient.filesAPI.getRun
            .mockResolvedValueOnce({ status: 'IN_PROGRESS' }) // First poll
            .mockResolvedValueOnce({ status: 'IN_PROGRESS' }) // Second poll
            .mockResolvedValueOnce(mockPollResponse); // Final poll
    };

    test('should successfully deidentify an audio file', async () => {
        jest.mock('../../../src/utils/validations', () => ({
            validateDeidentifyFileRequest: jest.fn(),
        }));
        validateDeidentifyFileRequest.mockImplementation(() => {
            // No validation error
        });
        detectController = new DetectController(mockVaultClient);
        const audioFile = new File(['audio content'], 'test.mp3', { type: 'audio/mpeg' });
        const audioRequest = new DeidentifyFileRequest(audioFile);

        setupPolling();

        mockVaultClient.filesAPI.deidentifyAudio.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'mockRunId' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('request-id-123') } },
            }),
        }));

        const result = await detectController.deidentifyFile(audioRequest, mockOptions);

        expect(result.file).toBe('mockProcessedFile');
        expect(result.type).toBe('text');
        expect(result.extension).toBe('txt');
    });

    test('should successfully deidentify a PDF file', async () => {
        jest.mock('../../../src/utils/validations', () => ({
            validateDeidentifyFileRequest: jest.fn(),
        }));
        validateDeidentifyFileRequest.mockImplementation(() => {
            // No validation error
        });
        detectController = new DetectController(mockVaultClient);
        const pdfFile = new File(['pdf content'], 'test.pdf', { type: 'application/pdf' });
        const pdfRequest = new DeidentifyFileRequest(pdfFile);

        setupPolling();

        mockVaultClient.filesAPI.deidentifyPdf.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'mockRunId' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('request-id-123') } },
            }),
        }));

        const result = await detectController.deidentifyFile(pdfRequest, mockOptions);

        expect(result.file).toBe('mockProcessedFile');
        expect(result.type).toBe('text');
        expect(result.extension).toBe('txt');
    });

    test('should successfully deidentify a PDF file and save processed file to output directory', async () => {
        jest.mock('../../../src/utils/validations', () => ({
            validateDeidentifyFileRequest: jest.fn(),
        }));
        validateDeidentifyFileRequest.mockImplementation(() => {
            // No validation error
        });
    
        detectController = new DetectController(mockVaultClient);
    
        const pdfFile = new File(['pdf content'], 'test.pdf', { type: 'application/pdf' });
        const pdfRequest = new DeidentifyFileRequest(pdfFile);
    
        const mockOptions = new DeidentifyFileOptions();
        mockOptions.setWaitTime(16);
        mockOptions.setOutputDirectory('/mock/output/directory'); // Set the output directory
    
        // Mock the deidentifyPdf API call
        mockVaultClient.filesAPI.deidentifyPdf.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'mockRunId' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('request-id-123') } },
            }),
        }));
    
        // Mock the getRun API call for polling
        mockVaultClient.filesAPI.getRun = jest.fn()
            .mockResolvedValueOnce({ status: 'IN_PROGRESS' }) // First poll
            .mockResolvedValueOnce({ status: 'IN_PROGRESS' }) // Second poll
            .mockResolvedValueOnce({ // Final poll
                status: 'SUCCESS',
                output: [
                    {
                        processedFile: Buffer.from('mockProcessedFileContent').toString('base64'), // Base64-encoded content
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
    
        const result = await detectController.deidentifyFile(pdfRequest, mockOptions);
    
        // Assertions for the response
        expect(result.extension).toBe('pdf');
    
        // Assertions for processDeidentifyFileResponse
        expect(fs.existsSync).toHaveBeenCalledWith('/mock/output/directory');
        expect(fs.writeFileSync).toHaveBeenCalledWith(
            '/mock/output/directory/processed-test.pdf',
            expect.any(Buffer)
        );
    });

    test('should successfully deidentify an image file', async () => {
        jest.mock('../../../src/utils/validations', () => ({
            validateDeidentifyFileRequest: jest.fn(),
        }));
        validateDeidentifyFileRequest.mockImplementation(() => {
            // No validation error
        });
        detectController = new DetectController(mockVaultClient);
        const imageFile = new File(['image content'], 'test.png', { type: 'image/png' });
        const imageRequest = new DeidentifyFileRequest(imageFile);

        setupPolling();

        mockVaultClient.filesAPI.deidentifyImage.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'mockRunId' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('request-id-123') } },
            }),
        }));

        const result = await detectController.deidentifyFile(imageRequest, mockOptions);

        expect(result.file).toBe('mockProcessedFile');
        expect(result.type).toBe('text');
        expect(result.extension).toBe('txt');
    });

    test('should successfully deidentify a presentation file', async () => {
        jest.mock('../../../src/utils/validations', () => ({
            validateDeidentifyFileRequest: jest.fn(),
        }));
        validateDeidentifyFileRequest.mockImplementation(() => {
            // No validation error
        });
        detectController = new DetectController(mockVaultClient);
        const pptFile = new File(['ppt content'], 'test.pptx', { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
        const pptRequest = new DeidentifyFileRequest(pptFile);

        setupPolling();

        mockVaultClient.filesAPI.deidentifyPresentation.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'mockRunId' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('request-id-123') } },
            }),
        }));

        const result = await detectController.deidentifyFile(pptRequest, mockOptions);

        expect(result.file).toBe('mockProcessedFile');
        expect(result.type).toBe('text');
        expect(result.extension).toBe('txt');
    });

    test('should successfully deidentify a spreadsheet file', async () => {
        jest.mock('../../../src/utils/validations', () => ({
            validateDeidentifyFileRequest: jest.fn(),
        }));
        validateDeidentifyFileRequest.mockImplementation(() => {
            // No validation error
        });
        detectController = new DetectController(mockVaultClient);
        const spreadsheetFile = new File(['spreadsheet content'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const spreadsheetRequest = new DeidentifyFileRequest(spreadsheetFile);

        setupPolling();

        mockVaultClient.filesAPI.deidentifySpreadsheet.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'mockRunId' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('request-id-123') } },
            }),
        }));

        const result = await detectController.deidentifyFile(spreadsheetRequest, mockOptions);

        expect(result.file).toBe('mockProcessedFile');
        expect(result.type).toBe('text');
        expect(result.extension).toBe('txt');
    });

    test('should successfully deidentify a structured text file', async () => {
        jest.mock('../../../src/utils/validations', () => ({
            validateDeidentifyFileRequest: jest.fn(),
        }));
        validateDeidentifyFileRequest.mockImplementation(() => {
            // No validation error
        });
        detectController = new DetectController(mockVaultClient);
        const structuredTextFile = new File(['structured text content'], 'test.json', { type: 'application/json' });
        const structuredTextRequest = new DeidentifyFileRequest(structuredTextFile);

        setupPolling();

        mockVaultClient.filesAPI.deidentifyStructuredText.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'mockRunId' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('request-id-123') } },
            }),
        }));

        const result = await detectController.deidentifyFile(structuredTextRequest, mockOptions);

        expect(result.file).toBe('mockProcessedFile');
        expect(result.type).toBe('text');
        expect(result.extension).toBe('txt');
    });

    test('should successfully deidentify a document file', async () => {
        jest.mock('../../../src/utils/validations', () => ({
            validateDeidentifyFileRequest: jest.fn(),
        }));
        validateDeidentifyFileRequest.mockImplementation(() => {
            // No validation error
        });
        detectController = new DetectController(mockVaultClient);
        const documentFile = new File(['document content'], 'test.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const documentRequest = new DeidentifyFileRequest(documentFile);

        setupPolling();

        mockVaultClient.filesAPI.deidentifyDocument.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'mockRunId' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('request-id-123') } },
            }),
        }));

        const result = await detectController.deidentifyFile(documentRequest, mockOptions);

        expect(result.file).toBe('mockProcessedFile');
        expect(result.type).toBe('text');
        expect(result.extension).toBe('txt');
    });

    test('should successfully deidentify a generic file', async () => {
        jest.mock('../../../src/utils/validations', () => ({
            validateDeidentifyFileRequest: jest.fn(),
        }));
        validateDeidentifyFileRequest.mockImplementation(() => {
            // No validation error
        });
        detectController = new DetectController(mockVaultClient);
        const genericFile = new File(['generic content'], 'test.zip', { type: 'application/zip' });
        const genericRequest = new DeidentifyFileRequest(genericFile);

        setupPolling();

        mockVaultClient.filesAPI.deidentifyFile.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'mockRunId' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('request-id-123') } },
            }),
        }));

        const result = await detectController.deidentifyFile(genericRequest, mockOptions);

        expect(result.file).toBe('mockProcessedFile');
        expect(result.type).toBe('text');
        expect(result.extension).toBe('txt');
    });

    test('should throw validation error', async () => {
        jest.mock('../../../src/utils/validations', () => ({
            validateDeidentifyFileRequest: jest.fn(),
        }));
        validateDeidentifyFileRequest.mockImplementation(() => {
            throw new Error("Validation error");
        });
    
        // Initialize DetectController
        detectController = new DetectController(mockVaultClient);
    
        // Create a generic file and request
        const genericFile = new File(['generic content'], 'test.zip', { type: 'application/zip' });
        const genericRequest = new DeidentifyFileRequest(genericFile);
    
        // Assert that the deidentifyFile method throws the validation error
        await expect(detectController.deidentifyFile(genericRequest, mockOptions)).rejects.toThrow("Validation error");
    });

    test('should successfully deidentify a text file with processed file after polling', async () => {
        jest.mock('../../../src/utils/validations', () => ({
            validateDeidentifyFileRequest: jest.fn(),
        }));
        validateDeidentifyFileRequest.mockImplementation(() => {
            // No validation error
        });
        detectController = new DetectController(mockVaultClient);
        const mockFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
        const mockRequest = new DeidentifyFileRequest(mockFile);
        const mockOptions = new DeidentifyFileOptions();
        mockOptions.setWaitTime(16);

        mockVaultClient.filesAPI.deidentifyText.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'mockRunId' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('request-id-123') } },
            }),
        }));

        mockVaultClient.filesAPI.getRun = jest.fn()
        .mockResolvedValueOnce({ status: 'IN_PROGRESS' }) // First poll
        .mockResolvedValueOnce({ status: 'IN_PROGRESS' }) // Second poll
        .mockResolvedValueOnce({ // Final poll
            status: 'SUCCESS',
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
            pages: 0,
            slides: 0,
        });


        const result = await detectController.deidentifyFile(mockRequest, mockOptions);
        expect(result.file).toBe('mockProcessedFile');
        expect(result.type).toBe('text');
    });

    test('should handle error when getRun method rejects during polling', async () => {
        jest.mock('../../../src/utils/validations', () => ({
            validateDeidentifyFileRequest: jest.fn(),
        }));
        validateDeidentifyFileRequest.mockImplementation(() => {
            // No validation error
        });
    
        detectController = new DetectController(mockVaultClient);
        const mockFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
        const mockRequest = new DeidentifyFileRequest(mockFile);
        const mockOptions = new DeidentifyFileOptions();
        mockOptions.setWaitTime(16);
    
        mockVaultClient.filesAPI.deidentifyText.mockImplementation(() => ({
            withRawResponse: jest.fn().mockResolvedValue({
                data: { run_id: 'mockRunId' },
                rawResponse: { headers: { get: jest.fn().mockReturnValue('request-id-123') } },
            }),
        }));
    
        // Simulate getRun method rejecting with an error
        mockVaultClient.filesAPI.getRun = jest.fn()
            .mockResolvedValueOnce({ status: 'IN_PROGRESS' }) // First poll
            .mockResolvedValueOnce({ status: 'IN_PROGRESS' }) // Second poll
            .mockRejectedValueOnce(new Error('Polling failed')); // Third poll rejects with an error
    
        await expect(detectController.deidentifyFile(mockRequest, mockOptions)).rejects.toThrow('Polling failed');
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