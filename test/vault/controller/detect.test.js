import DetectController from '../../../src/vault/controller/detect';
import { validateDeIdentifyTextRequest, validateReidentifyTextRequest } from '../../../src/utils/validations';
import DeidentifyTextResponse from '../../../src/vault/model/response/deidentify-text';
import ReidentifyTextResponse from '../../../src/vault/model/response/reidentify-text';

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
    },
    generateSDKMetrics: jest.fn().mockReturnValue({ sdk: 'metrics' }),
    getBearerToken: jest.fn().mockResolvedValue(Promise.resolve('your-bearer-token')),
}));

jest.mock('../../../src/utils/validations', () => ({
    validateDeIdentifyTextRequest: jest.fn(),
    validateReidentifyTextRequest: jest.fn(),
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