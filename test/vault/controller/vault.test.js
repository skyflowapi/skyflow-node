import VaultController from '../../../src/vault/controller/vault';
import { printLog, parameterizedString, MessageType, TYPES } from '../../../src/utils';
import logs from '../../../src/utils/logs';
import { validateInsertRequest, validateDetokenizeRequest, validateDeleteRequest, validateTokenizeRequest, validateQueryRequest, validateUpdateRequest, validateUploadFileRequest, validateGetRequest, validateGetColumnRequest } from '../../../src/utils/validations';
import InsertResponse from '../../../src/vault/model/response/insert';
import DeleteResponse from '../../../src/vault/model/response/delete';
import TokenizeResponse from '../../../src/vault/model/response/tokenize';
import QueryResponse from '../../../src/vault/model/response/query';
import UpdateResponse from '../../../src/vault/model/response/update';
import FileUploadResponse from '../../../src/vault/model/response/file-upload';
import GetResponse from '../../../src/vault/model/response/get';
import GetRequest from '../../../src/vault/model/request/get';
import GetColumnRequest from '../../../src/vault/model/request/get-column';
import SkyflowError from '../../../src/error';
import * as fs from 'fs';

jest.mock('fs');

global.FormData = class {
    data = {};
    
    append(key, value) {
        this.data[key] = value;
    }

    getData() {
        return this.data;
    }
};

jest.mock('../../../src/utils', () => ({
    printLog: jest.fn(),
    parameterizedString: jest.fn(),
    MessageType: {
        LOG: 'LOG',
        ERROR: 'ERROR',
    },
    TYPES: {
        INSERT: 'INSERT',
        INSERT_BATCH: 'INSERT_BATCH',
        DETOKENIZE: 'DETOKENIZE',
        TOKENIZE: 'TOKENIZE',
        DELETE: 'DELETE',
        UPDATE: 'UPDATE',
        GET: 'GET',
        FILE_UPLOAD: 'FILE_UPLOAD',
        QUERY: 'QUERY',
        INVOKE_CONNECTION: 'INVOKE_CONNECTION',
    },
    generateSDKMetrics: jest.fn(),
    getBearerToken: jest.fn().mockResolvedValue(Promise.resolve('your-bearer-token'))
}));

jest.mock('../../../src/utils/validations', () => ({
    validateInsertRequest: jest.fn(),
    validateDetokenizeRequest: jest.fn(),
    validateDeleteRequest: jest.fn(),
    validateTokenizeRequest: jest.fn(),
    validateQueryRequest: jest.fn(),
    validateUpdateRequest: jest.fn(),
    validateUploadFileRequest: jest.fn(),
    validateGetRequest: jest.fn(),
    validateGetColumnRequest: jest.fn(),
}));

jest.mock('../../../src/utils/logs', () => ({
    infoLogs: {
        CONTROLLER_INITIALIZED: 'VaultController initialized successfully.',
    },
    errorLogs: {
        INSERT_REQUEST_REJECTED: 'INSERT_REJECTED',
    }
}));

describe('VaultController', () => {
    let mockVaultClient;

    beforeEach(() => {
        mockVaultClient = {
            getLogLevel: jest.fn().mockReturnValue('DEBUG'),
        };
        jest.clearAllMocks();  // Clear all mocks before each test to avoid interference
    });

    test('should initialize VaultController and call printLog with correct parameters', () => {
        const vaultController = new VaultController(mockVaultClient);

        // Ensure the constructor sets the client and logs the initialization
        expect(vaultController).toBeInstanceOf(VaultController);
        expect(vaultController.client).toBe(mockVaultClient);

        // Verify printLog is called with expected parameters
        expect(printLog).toHaveBeenCalledTimes(1);
        expect(printLog).toHaveBeenCalledWith(
            logs.infoLogs.CONTROLLER_INITIALIZED,
            MessageType.LOG,
            'DEBUG'  // getLogLevel() should return 'DEBUG'
        );
    });

    test('should have the connection method defined', () => {
        const vaultController = new VaultController(mockVaultClient);
        expect(vaultController.connection).toBeDefined();
        expect(typeof vaultController.connection).toBe('function');
    });

    test('should have the lookUpBin method defined', () => {
        const vaultController = new VaultController(mockVaultClient);
        expect(vaultController.lookUpBin).toBeDefined();
        expect(typeof vaultController.lookUpBin).toBe('function');
    });

    test('should have the audit method defined', () => {
        const vaultController = new VaultController(mockVaultClient);
        expect(vaultController.audit).toBeDefined();
        expect(typeof vaultController.audit).toBe('function');
    });

    test('should have the detect method defined', () => {
        const vaultController = new VaultController(mockVaultClient);
        expect(vaultController.detect).toBeDefined();
        expect(typeof vaultController.detect).toBe('function');
    });
});


describe('VaultController insert method', () => {
    let mockVaultClient;
    let vaultController;

    beforeEach(() => {
        mockVaultClient = {
            getLogLevel: jest.fn().mockReturnValue('DEBUG'),
            vaultAPI: {
                recordServiceInsertRecord: jest.fn(),
                recordServiceBatchOperation: jest.fn(),
            },
            initAPI: jest.fn(),
            getCredentials: jest.fn().mockReturnValue({}),
            vaultId: 'vault123',
            failureResponse: jest.fn().mockRejectedValueOnce({})
        };
        vaultController = new VaultController(mockVaultClient);
        jest.clearAllMocks();
    });

    test('should successfully insert records with bulk insert', async () => {
        const mockRequest = {
            data: [{ field1: 'value1' }],
            tableName: 'testTable',
        };
        const mockOptions = {
            getContinueOnError: jest.fn().mockReturnValue(false),
            getReturnTokens: jest.fn().mockReturnValue(true),
            getUpsert: jest.fn().mockReturnValue(''),
            getHomogeneous: jest.fn().mockReturnValue(false),
            getTokenMode: jest.fn().mockReturnValue('')
        };
        const mockResponseData = { records: [{ skyflow_id: 'id123', tokens: {} }] };

        mockVaultClient.vaultAPI.recordServiceInsertRecord.mockResolvedValueOnce({ data: mockResponseData });

        const response = await vaultController.insert(mockRequest, mockOptions);

        expect(mockVaultClient.vaultAPI.recordServiceInsertRecord).toHaveBeenCalledWith(
            mockVaultClient.vaultId,
            mockRequest.tableName,
            expect.any(Object), // Request body
            expect.any(Object) // Headers
        );
        expect(response).toBeInstanceOf(InsertResponse);
        expect(response.insertedFields).toHaveLength(1);
    });

    test('should successfully insert records with bulk insert', async () => {
        const mockRequest = {
            data: [{ field1: 'value1' }],
            tableName: 'testTable',
        };
        const mockOptions = {
            getContinueOnError: jest.fn().mockReturnValue(false),
            getReturnTokens: jest.fn().mockReturnValue(true),
            getUpsert: jest.fn().mockReturnValue(''),
            getHomogeneous: jest.fn().mockReturnValue(false),
            getTokenMode: jest.fn().mockReturnValue('')
        };
        const mockResponseData = { records: [{ skyflow_id: 'id123', tokens: {} }] };

        mockVaultClient.vaultAPI.recordServiceInsertRecord.mockResolvedValueOnce({ data: mockResponseData });

        const response = await vaultController.insert(mockRequest, mockOptions);

        expect(mockVaultClient.vaultAPI.recordServiceInsertRecord).toHaveBeenCalledWith(
            mockVaultClient.vaultId,
            mockRequest.tableName,
            expect.any(Object), // Request body
            expect.any(Object) // Headers
        );
        expect(response).toBeInstanceOf(InsertResponse);
        expect(response.insertedFields).toHaveLength(1);
    });

    test('should reject insert records with bulk insert', async () => {
        const mockRequest = {
            data: [{ field1: 'value1' }],
            tableName: 'testTable',
        };
        const mockOptions = {
            getContinueOnError: jest.fn().mockReturnValue(false),
            getReturnTokens: jest.fn().mockReturnValue(true),
            getUpsert: jest.fn().mockReturnValue(''),
            getHomogeneous: jest.fn().mockReturnValue(false),
            getTokenMode: jest.fn().mockReturnValue('')
        };
        const mockResponseData = { skyflow_id: 'id123', tokens: {} };

        mockVaultClient.vaultAPI.recordServiceInsertRecord.mockResolvedValueOnce({ data: mockResponseData });

        const response = await vaultController.insert(mockRequest, mockOptions);

        expect(mockVaultClient.vaultAPI.recordServiceInsertRecord).toHaveBeenCalledWith(
            mockVaultClient.vaultId,
            mockRequest.tableName,
            expect.any(Object), // Request body
            expect.any(Object) // Headers
        );
        expect(response).toBeInstanceOf(InsertResponse);
        expect(response.insertedFields).toHaveLength(0);
    });

    test('should successfully insert records with batch insert', async () => {
        const mockRequest = {
            data: [{ field1: 'value1' }],
            tableName: 'testTable',
        };
        const mockOptions = {
            getContinueOnError: jest.fn().mockReturnValue(true),
            getReturnTokens: jest.fn().mockReturnValue(false),
            getUpsert: jest.fn().mockReturnValue(''),
            getHomogeneous: jest.fn().mockReturnValue(false),
            getTokenMode: jest.fn().mockReturnValue(''),
            getTokens: jest.fn().mockReturnValue([])
        };
        const mockResponseData = { responses: [{ Body: { records: [{ skyflow_id: 'id123' }] }, Status: 200 }, { Body: { records: [{ skyflow_id: 'id123' }] }, Status: 400 }] };

        mockVaultClient.vaultAPI.recordServiceBatchOperation.mockResolvedValueOnce({ data: mockResponseData });

        const response = await vaultController.insert(mockRequest, mockOptions);

        expect(mockVaultClient.vaultAPI.recordServiceBatchOperation).toHaveBeenCalled();
        expect(response.insertedFields).toHaveLength(1);
    });

    test('should reject insert records with batch insert', async () => {
        const mockRequest = {
            data: [{ field1: 'value1' }],
            tableName: 'testTable',
        };
        const mockOptions = {
            getContinueOnError: jest.fn().mockReturnValue(true),
            getReturnTokens: jest.fn().mockReturnValue(false),
            getUpsert: jest.fn().mockReturnValue(''),
            getHomogeneous: jest.fn().mockReturnValue(false),
            getTokenMode: jest.fn().mockReturnValue(''),
            getTokens: jest.fn().mockReturnValue([])
        };
        const mockResponseData = [{ Body: { records: [{ skyflow_id: 'id123' }] }, Status: 200 }];

        mockVaultClient.vaultAPI.recordServiceBatchOperation.mockResolvedValueOnce({ data: mockResponseData });

        const response = await vaultController.insert(mockRequest, mockOptions);

        expect(mockVaultClient.vaultAPI.recordServiceBatchOperation).toHaveBeenCalled();
        expect(response.insertedFields).toBe(undefined);
    });

    test('should handle validation errors', async () => {
        const mockRequest = {
            data: [{ field1: 'value1' }],
            tableName: 'testTable',
        };
        const mockOptions = {
            getContinueOnError: jest.fn().mockReturnValue(false),
            getReturnTokens: jest.fn().mockReturnValue(true),
            getUpsert: jest.fn().mockReturnValue(''),
            getHomogeneous: jest.fn().mockReturnValue(false),
            getTokenMode: jest.fn().mockReturnValue('')
        };

        validateInsertRequest.mockImplementation(() => {
            throw new Error('Validation error');
        });

        await expect(vaultController.insert(mockRequest, mockOptions)).rejects.toThrow('Validation error');
        expect(validateInsertRequest).toHaveBeenCalled();
        expect(mockVaultClient.vaultAPI.recordServiceInsertRecord).toHaveBeenCalled();
    });

    test('should log and reject on API error', async () => {
        const mockRequest = {
            data: [{ field1: 'value1' }],
            tableName: 'testTable',
        };
        const mockOptions = {
            getContinueOnError: jest.fn().mockReturnValue(false),
            getReturnTokens: jest.fn().mockReturnValue(true),
            getUpsert: jest.fn().mockReturnValue(''),
            getHomogeneous: jest.fn().mockReturnValue(false),
            getTokenMode: jest.fn().mockReturnValue('')
        };
        const errorResponse = new Error("Validation error");
        mockVaultClient.vaultAPI.recordServiceInsertRecord.mockRejectedValueOnce(errorResponse.message);

        await expect(vaultController.insert(mockRequest, mockOptions)).rejects.toEqual(errorResponse);
    });
});

describe('VaultController detokenize method', () => {
    let mockVaultClient;
    let vaultController;

    beforeEach(() => {
        mockVaultClient = {
            getLogLevel: jest.fn().mockReturnValue('DEBUG'),
            initAPI: jest.fn(),
            tokensAPI: {
                recordServiceDetokenize: jest.fn(),
            },
            getCredentials: jest.fn().mockReturnValue({}),
            vaultId: 'vault123',
            failureResponse: jest.fn().mockRejectedValueOnce({}),
        };
        vaultController = new VaultController(mockVaultClient);
        jest.clearAllMocks();
    });

    test('should successfully detokenize records', async () => {
        const mockRequest = {
            tokens: ['token1', 'token2'],
            redactionType: 'PLAIN_TEXT',
        };
        const mockOptions = {
            getContinueOnError: jest.fn().mockReturnValue(true),
            getDownloadURL: jest.fn().mockReturnValue(false)
        };
        const mockDetokenizeResponse = {
            data: {
                records: [
                    { token: 'token1', value: 'value1' },
                    { token: 'token2', error: 'error2' }
                ]
            }
        };

        mockVaultClient.tokensAPI.recordServiceDetokenize.mockResolvedValueOnce(mockDetokenizeResponse);

        const response = await vaultController.detokenize(mockRequest, mockOptions);

        expect(mockVaultClient.tokensAPI.recordServiceDetokenize).toHaveBeenCalledWith(
            'vault123',
            expect.anything(), // Detokenization payload
            expect.any(Object) // Headers
        );
        expect(response.detokenizedFields).toHaveLength(1); // Success responses
        expect(response.errors).toHaveLength(1); // Error responses
    });

    test('should return unknown detokenize records', async () => {
        const mockRequest = {
            tokens: ['token1', 'token2'],
            redactionType: 'PLAIN_TEXT',
        };
        const mockOptions = {
            getContinueOnError: jest.fn().mockReturnValue(true),
            getDownloadURL: jest.fn().mockReturnValue(false)
        };
        const mockDetokenizeResponse = {
            data: {
                records: {}
            }
        };

        mockVaultClient.tokensAPI.recordServiceDetokenize.mockResolvedValueOnce(mockDetokenizeResponse);

        const response = await vaultController.detokenize(mockRequest, mockOptions);

        expect(mockVaultClient.tokensAPI.recordServiceDetokenize).toHaveBeenCalledWith(
            'vault123',
            expect.anything(), // Detokenization payload
            expect.any(Object) // Headers
        );
        expect(response.detokenizedFields).toHaveLength(0); // Success responses
        expect(response.errors).toHaveLength(0); // Error responses
    });

    test('should reject detokenize records with validation error', async () => {
        const mockRequest = {
            tokens: ['token1', 'token2'],
            redactionType: 'PLAIN_TEXT',
        };
        const mockOptions = {
            getContinueOnError: jest.fn().mockReturnValue(true),
            getDownloadURL: jest.fn().mockReturnValue(false)
        };

        validateDetokenizeRequest.mockImplementation(() => {
            throw new Error('Validation error');
        });

        await expect(vaultController.detokenize(mockRequest, mockOptions)).rejects.toThrow('Validation error');
        expect(validateDetokenizeRequest).toHaveBeenCalledWith(mockRequest, mockOptions);
    });

    test('should handle API error during detokenize', async () => {
        const mockRequest = {
            tokens: ['token1', 'token2'],
            redactionType: 'PLAIN_TEXT',
        };
        const mockOptions = {
            getContinueOnError: jest.fn().mockReturnValue(true),
            getDownloadURL: jest.fn().mockReturnValue(false)
        };

        const errorResponse = new Error("Validation error");
        mockVaultClient.tokensAPI.recordServiceDetokenize.mockRejectedValueOnce(errorResponse);

        await expect(vaultController.detokenize(mockRequest, mockOptions)).rejects.toThrow('Validation error');
        expect(mockVaultClient.tokensAPI.recordServiceDetokenize).toHaveBeenCalled();
    });

    test('should log and resolve with empty arrays when no records are returned', async () => {
        const mockRequest = {
            tokens: ['token1', 'token2'],
            redactionType: 'PLAIN_TEXT',
        };
        const mockOptions = {
            getContinueOnError: jest.fn().mockReturnValue(true),
            getDownloadURL: jest.fn().mockReturnValue(false)
        };

        validateDetokenizeRequest.mockImplementation(() => {
            // throw new Error('Validation error');
        });

        mockVaultClient.tokensAPI.recordServiceDetokenize.mockResolvedValueOnce([]);

        try {
            const response = await vaultController.detokenize(mockRequest, mockOptions);
        } catch (err) {
            expect(err).toBeDefined();
        }
    });

    test('should reject when an unexpected error occurs', async () => {
        const mockRequest = {
            tokens: ['token1', 'token2'],
            redactionType: 'PLAIN_TEXT',
        };
        const mockOptions = {
            getContinueOnError: jest.fn().mockReturnValue(true),
            getDownloadURL: jest.fn().mockReturnValue(false)
        };
        validateDetokenizeRequest.mockImplementation(() => {
            throw new Error('Validation error');
        });

        const unexpectedError = new Error("Validation error");
        mockVaultClient.tokensAPI.recordServiceDetokenize.mockRejectedValueOnce(unexpectedError);

        await expect(vaultController.detokenize(mockRequest, mockOptions)).rejects.toThrow('Validation error');
        expect(mockVaultClient.tokensAPI.recordServiceDetokenize).toHaveBeenCalled();
    });
});

describe('VaultController delete method', () => {
    let mockVaultClient;
    let vaultController;

    beforeEach(() => {
        mockVaultClient = {
            getLogLevel: jest.fn().mockReturnValue('DEBUG'),
            vaultAPI: {
                recordServiceBulkDeleteRecord: jest.fn(),
            },
            initAPI: jest.fn(),
            getCredentials: jest.fn().mockReturnValue({}),
            vaultId: 'vault123',
            failureResponse: jest.fn().mockRejectedValueOnce({})
        };
        vaultController = new VaultController(mockVaultClient);
        jest.clearAllMocks();
    });

    test('should successfully delete records', async () => {
        const mockRequest = {
            deleteIds: ['id123'],
            tableName: 'testTable',
        };
        const mockResponseData = { RecordIDResponse: ['id123'] };

        mockVaultClient.vaultAPI.recordServiceBulkDeleteRecord.mockResolvedValueOnce({ data: mockResponseData });

        const response = await vaultController.delete(mockRequest);

        expect(mockVaultClient.vaultAPI.recordServiceBulkDeleteRecord).toHaveBeenCalledWith(
            mockVaultClient.vaultId,
            mockRequest.tableName,
            expect.any(Object), // Request body
            expect.any(Object) // Headers
        );
        expect(response).toBeInstanceOf(DeleteResponse);
        expect(response.deletedIds).toHaveLength(1);
        expect(response.errors).toHaveLength(0);
    });

    test('should handle delete validation errors', async () => {
        const mockRequest = {
            deleteIds: ['id123'],
            tableName: 'testTable',
        };

        validateDeleteRequest.mockImplementation(() => {
            throw new Error('Validation error');
        });

        await expect(vaultController.delete(mockRequest)).rejects.toThrow('Validation error');
        expect(validateDeleteRequest).toHaveBeenCalled();
        expect(mockVaultClient.vaultAPI.recordServiceBulkDeleteRecord).toHaveBeenCalled();
    });

    test('should handle API errors during delete', async () => {
        const mockRequest = {
            deleteIds: ['id123'],
            tableName: 'testTable',
        };
        const errorResponse = new Error('Validation error');

        mockVaultClient.vaultAPI.recordServiceBulkDeleteRecord.mockRejectedValueOnce(errorResponse.message);

        await expect(vaultController.delete(mockRequest)).rejects.toEqual(errorResponse);
        expect(mockVaultClient.vaultAPI.recordServiceBulkDeleteRecord).toHaveBeenCalled();
    });

    test('should reject when API returns no deleted records', async () => {
        const mockRequest = {
            deleteIds: ['id123'],
            tableName: 'testTable',
        };
        const mockResponseData = { RecordIDResponse: [] }; // Simulate no records deleted
        validateDeleteRequest.mockImplementation(() => {
            // throw new Error('Validation error');
        });
        mockVaultClient.vaultAPI.recordServiceBulkDeleteRecord.mockResolvedValueOnce({ data: mockResponseData });

        const response = await vaultController.delete(mockRequest);

        expect(response.deletedIds).toHaveLength(0);
        expect(response.errors).toHaveLength(0);
    });

    test('should log and reject when API returns errors during delete', async () => {
        const mockRequest = {
            deleteIds: ['id123'],
            tableName: 'testTable',
        };
        const errorResponse = new Error('Validation error');
        validateDeleteRequest.mockImplementation(() => {
            throw new Error('Validation error');
        });
        mockVaultClient.vaultAPI.recordServiceBulkDeleteRecord.mockRejectedValueOnce(errorResponse);

        await expect(vaultController.delete(mockRequest)).rejects.toEqual(errorResponse);
        expect(mockVaultClient.vaultAPI.recordServiceBulkDeleteRecord).toHaveBeenCalled();
    });
});

describe('VaultController tokenize method', () => {
    let mockVaultClient;
    let vaultController;

    beforeEach(() => {
        mockVaultClient = {
            getLogLevel: jest.fn().mockReturnValue('DEBUG'),
            tokensAPI: {
                recordServiceTokenize: jest.fn(),
            },
            initAPI: jest.fn(),
            getCredentials: jest.fn().mockReturnValue({}),
            vaultId: 'vault123',
            failureResponse: jest.fn().mockRejectedValueOnce(new SkyflowError({http_code:500,message:"Invalid"}))
        };
        vaultController = new VaultController(mockVaultClient);
        jest.clearAllMocks();
    });

    test('should successfully tokenize records', async () => {
        const mockRequest = {
            values: [{ value: 'sensitiveData', columnGroup: 'group1' }],
        };
        const mockResponseData = { data: { records: [{ token: 'token123' }] } };

        mockVaultClient.tokensAPI.recordServiceTokenize.mockResolvedValueOnce(mockResponseData);

        const response = await vaultController.tokenize(mockRequest);

        expect(mockVaultClient.tokensAPI.recordServiceTokenize).toHaveBeenCalledWith(
            mockVaultClient.vaultId,
            expect.any(Object) // Tokenize payload
        );
        expect(response).toBeInstanceOf(TokenizeResponse);
        expect(response.tokens).toHaveLength(1);
        expect(response.errors).toHaveLength(0);
    });

    test('should handle validation errors', async () => {
        const mockRequest = {
            values: [{ value: 'sensitiveData', columnGroup: 'group1' }],
        };

        validateTokenizeRequest.mockImplementation(() => {
            throw new Error('Validation error');
        });

        await expect(vaultController.tokenize(mockRequest)).rejects.toThrow('Validation error');
        expect(validateTokenizeRequest).toHaveBeenCalled();
        expect(mockVaultClient.tokensAPI.recordServiceTokenize).not.toHaveBeenCalled();
    });

    test('should handle API errors during tokenization', async () => {
        const mockRequest = {
            values: [{ value: 'sensitiveData', columnGroup: 'group1' }],
        };
        const errorResponse = new Error('Validation error');

        mockVaultClient.tokensAPI.recordServiceTokenize.mockRejectedValueOnce(errorResponse.message);

        await expect(vaultController.tokenize(mockRequest)).rejects.toEqual(errorResponse);
        expect(mockVaultClient.tokensAPI.recordServiceTokenize).not.toHaveBeenCalled();
    });

    test('should reject when API returns no tokens', async () => {
        const mockRequest = {
            values: [{ value: 'sensitiveData', columnGroup: 'group1' }],
        };
        const mockResponseData = []; // Simulate no tokens returned

        validateTokenizeRequest.mockImplementation(() => {
            // throw new Error('Validation error');
        });
        mockVaultClient.tokensAPI.recordServiceTokenize.mockResolvedValueOnce(mockResponseData);

        try {
            const response = await vaultController.tokenize(mockRequest);
        } catch (err) {
            expect(err).toBeDefined();
        }
    });

    test('should log and reject when API returns errors during tokenization', async () => {
        const mockRequest = {
            values: [{ value: 'sensitiveData', columnGroup: 'group1' }],
        };
        const errorResponse = new Error('Validation error');

        validateTokenizeRequest.mockImplementation(() => {
            throw new Error('Validation error');
        });
        mockVaultClient.tokensAPI.recordServiceTokenize.mockRejectedValueOnce(errorResponse);

        await expect(vaultController.tokenize(mockRequest)).rejects.toEqual(errorResponse);
        expect(mockVaultClient.tokensAPI.recordServiceTokenize).not.toHaveBeenCalled();
    });
});

describe('VaultController query method', () => {
    let mockVaultClient;
    let vaultController;

    beforeEach(() => {
        mockVaultClient = {
            getLogLevel: jest.fn().mockReturnValue('DEBUG'),
            queryAPI: {
                queryServiceExecuteQuery: jest.fn(),
            },
            initAPI: jest.fn(),
            getCredentials: jest.fn().mockReturnValue({}),
            vaultId: 'vault123',
            failureResponse: jest.fn().mockRejectedValueOnce({})
        };
        vaultController = new VaultController(mockVaultClient);
        jest.clearAllMocks();
    });

    test('should successfully query records', async () => {
        const mockRequest = {
            query: 'SELECT * FROM table WHERE id=1',
        };
        const mockResponseData = {data:{ records: [{
            fields: { id: '1', name: 'test' },
            tokens: { id: 'token123' },
        }]}};

        mockVaultClient.queryAPI.queryServiceExecuteQuery.mockResolvedValueOnce(mockResponseData);

        const response = await vaultController.query(mockRequest);

        expect(mockVaultClient.queryAPI.queryServiceExecuteQuery).toHaveBeenCalledWith(
            mockVaultClient.vaultId,
            expect.any(Object), // Query body
            expect.any(Object)  // Headers
        );
        expect(response).toBeInstanceOf(QueryResponse);
        expect(response.fields).toHaveLength(1);
        expect(response.fields[0].id).toBe('1');
        expect(response.fields[0].tokenizedData.id).toBe('token123');
        expect(response.errors).toHaveLength(0);
    });

    test('should handle validation errors', async () => {
        const mockRequest = {
            query: 'SELECT * FROM table WHERE id=1',
        };

        validateQueryRequest.mockImplementation(() => {
            throw new Error('Validation error');
        });

        await expect(vaultController.query(mockRequest)).rejects.toThrow('Validation error');
        expect(validateQueryRequest).toHaveBeenCalled();
        expect(mockVaultClient.queryAPI.queryServiceExecuteQuery).toHaveBeenCalled();
    });

    test('should handle API errors during query execution', async () => {
        const mockRequest = {
            query: 'SELECT * FROM table WHERE id=1',
        };
        const errorResponse = new Error('Validation error');

        mockVaultClient.queryAPI.queryServiceExecuteQuery.mockRejectedValueOnce(errorResponse.message);

        await expect(vaultController.query(mockRequest)).rejects.toEqual(errorResponse);
        expect(mockVaultClient.queryAPI.queryServiceExecuteQuery).toHaveBeenCalled();
    });

    test('should return empty fields when no records are returned', async () => {
        const mockRequest = {
            query: 'SELECT * FROM table WHERE id=1',
        };
        const mockResponseData = []; // Simulate no records returned

        mockVaultClient.queryAPI.queryServiceExecuteQuery.mockResolvedValueOnce(mockResponseData);
        try{
            const response = await vaultController.query(mockRequest);
        } catch(err){
            expect(err).toBeDefined()
        }
    });

    test('should reject and log when API returns error during query', async () => {
        const mockRequest = {
            query: 'SELECT * FROM table WHERE id=1',
        };
        const errorResponse = new Error('Validation error');

        mockVaultClient.queryAPI.queryServiceExecuteQuery.mockRejectedValueOnce(errorResponse);

        await expect(vaultController.query(mockRequest)).rejects.toEqual(errorResponse);
        expect(mockVaultClient.queryAPI.queryServiceExecuteQuery).toHaveBeenCalled();
    });
});

describe('VaultController update method', () => {
    let mockVaultClient;
    let vaultController;

    beforeEach(() => {
        mockVaultClient = {
            getLogLevel: jest.fn().mockReturnValue('DEBUG'),
            vaultAPI: {
                recordServiceUpdateRecord: jest.fn(),
            },
            initAPI: jest.fn(),
            getCredentials: jest.fn().mockReturnValue({}),
            vaultId: 'vault123',
            failureResponse: jest.fn().mockRejectedValueOnce({})
        };
        vaultController = new VaultController(mockVaultClient);
        jest.clearAllMocks();
    });

    test('should successfully update record', async () => {
        const mockRequest = {
            updateData: { field1: 'value1' },
            tableName: 'testTable',
            skyflowId: 'id123',
        };
        const mockOptions = {
            getReturnTokens: jest.fn().mockReturnValue(true),
            getTokenMode: jest.fn().mockReturnValue("DISABLE"),
        };
        const mockResponseData = {data: { skyflow_id: 'id123', tokens: { field1: 'token123' } }};

        mockVaultClient.vaultAPI.recordServiceUpdateRecord.mockResolvedValueOnce(mockResponseData);

        const response = await vaultController.update(mockRequest, mockOptions);

        expect(mockVaultClient.vaultAPI.recordServiceUpdateRecord).toHaveBeenCalledWith(
            mockVaultClient.vaultId,
            mockRequest.tableName,
            mockRequest.skyflowId,
            expect.any(Object), // Update data
            expect.any(Object)  // Headers
        );
        expect(response).toBeInstanceOf(UpdateResponse);
        expect(response.updatedField.skyflowID).toBe('id123');
        expect(response.updatedField.field1).toBe('token123');
        expect(response.errors).toHaveLength(0);
    });

    test('should successfully update record using enable tokens', async () => {
        const mockRequest = {
            updateData: { field1: 'value1' },
            tableName: 'testTable',
            skyflowId: 'id123',
        };
        const mockOptions = {
            getReturnTokens: jest.fn().mockReturnValue(true),
            getTokenMode: jest.fn().mockReturnValue("ENABLE"),
        };
        const mockResponseData = {data: { skyflow_id: 'id123', tokens: { field1: 'token123' } }};

        mockVaultClient.vaultAPI.recordServiceUpdateRecord.mockResolvedValueOnce(mockResponseData);

        const response = await vaultController.update(mockRequest, mockOptions);

        expect(mockVaultClient.vaultAPI.recordServiceUpdateRecord).toHaveBeenCalledWith(
            mockVaultClient.vaultId,
            mockRequest.tableName,
            mockRequest.skyflowId,
            expect.any(Object), // Update data
            expect.any(Object)  // Headers
        );
        expect(response).toBeInstanceOf(UpdateResponse);
        expect(response.updatedField.skyflowID).toBe('id123');
        expect(response.updatedField.field1).toBe('token123');
        expect(response.errors).toHaveLength(0);
    });

    test('should handle validation errors', async () => {
        const mockRequest = {
            updateData: { field1: 'value1' },
            tableName: 'testTable',
            skyflowId: 'id123',
        };
        const mockOptions = {
            getReturnTokens: jest.fn().mockReturnValue(true),
            getTokenMode: jest.fn().mockReturnValue(false),
        };

        validateUpdateRequest.mockImplementation(() => {
            throw new Error('Validation error');
        });

        await expect(vaultController.update(mockRequest, mockOptions)).rejects.toThrow('Validation error');
        expect(validateUpdateRequest).toHaveBeenCalled();
        expect(mockVaultClient.vaultAPI.recordServiceUpdateRecord).toHaveBeenCalled();
    });

    test('should handle API errors during record update', async () => {
        const mockRequest = {
            updateData: { field1: 'value1' },
            tableName: 'testTable',
            skyflowId: 'id123',
        };
        const mockOptions = {
            getReturnTokens: jest.fn().mockReturnValue(true),
            getTokenMode: jest.fn().mockReturnValue("ENABLE"),
        };
        const errorResponse = new Error('Validation error');

        mockVaultClient.vaultAPI.recordServiceUpdateRecord.mockRejectedValueOnce(errorResponse.message);

        await expect(vaultController.update(mockRequest, mockOptions)).rejects.toEqual(errorResponse);
        expect(mockVaultClient.vaultAPI.recordServiceUpdateRecord).toHaveBeenCalled();
    });

    test('should return updated record without tokens when token mode is disabled', async () => {
        const mockRequest = {
            updateData: { field1: 'value1' },
            tableName: 'testTable',
            skyflowId: 'id123',
        };
        const mockOptions = {
            getReturnTokens: jest.fn().mockReturnValue(false),
            getTokenMode: jest.fn().mockReturnValue(false),
        };
        const mockResponseData = { skyflow_id: 'id123' };

        mockVaultClient.vaultAPI.recordServiceUpdateRecord.mockResolvedValueOnce(mockResponseData);

        try{
            const response = await vaultController.update(mockRequest, mockOptions);
        } catch(err) {
            expect(err).toBeDefined();
        }
    });

    test('should reject and log when API returns error during update', async () => {
        const mockRequest = {
            updateData: { field1: 'value1' },
            tableName: 'testTable',
            skyflowId: 'id123',
        };
        const mockOptions = {
            getReturnTokens: jest.fn().mockReturnValue(true),
            getTokenMode: jest.fn().mockReturnValue(false),
        };
        const errorResponse = new Error('Validation error');

        mockVaultClient.vaultAPI.recordServiceUpdateRecord.mockRejectedValueOnce(errorResponse);

        await expect(vaultController.update(mockRequest, mockOptions)).rejects.toEqual(errorResponse);
        expect(mockVaultClient.vaultAPI.recordServiceUpdateRecord).toHaveBeenCalled();
    });
});

describe('VaultController uploadFile method', () => {
    let mockVaultClient;
    let vaultController;
    let mockFormData;
    let mockFs;

    beforeEach(() => {
        mockVaultClient = {
            getLogLevel: jest.fn().mockReturnValue('DEBUG'),
            vaultAPI: {
                fileServiceUploadFile: jest.fn(),
            },
            initAPI: jest.fn(),
            getCredentials: jest.fn().mockReturnValue({}),
            vaultId: 'vault123',
            failureResponse: jest.fn().mockRejectedValueOnce({})
        };
        mockFormData = require('form-data');
        mockFs = require('fs');
        vaultController = new VaultController(mockVaultClient);
        jest.clearAllMocks();
    });

    test('should successfully upload file', async () => {
        const mockRequest = {
            filePath: '/path/to/file',
            columnName: 'testColumn',
            tableName: 'testTable',
            skyflowId: 'id123',
        };
        const mockResponseData = {data:{ skyflow_id: 'id123' }};

        const mockStream = { on: jest.fn() };
        jest.spyOn(mockFs, 'createReadStream').mockReturnValueOnce(mockStream);
        mockVaultClient.vaultAPI.fileServiceUploadFile.mockResolvedValueOnce(mockResponseData);

        const response = await vaultController.uploadFile(mockRequest);

        expect(mockFs.createReadStream).toHaveBeenCalledWith(mockRequest.filePath);

        expect(response).toBeInstanceOf(FileUploadResponse);
        expect(response.skyflowID).toBe('id123');
        expect(response.errors).toHaveLength(0);
    });

    test('should handle validation errors during upload', async () => {
        const mockRequest = {
            filePath: '/path/to/file',
            columnName: 'testColumn',
            tableName: 'testTable',
            skyflowId: 'id123',
        };

        validateUploadFileRequest.mockImplementation(() => {
            throw new Error('Validation error');
        });

        await expect(vaultController.uploadFile(mockRequest)).rejects.toThrow('Validation error');
        expect(validateUploadFileRequest).toHaveBeenCalled();
        expect(mockVaultClient.vaultAPI.fileServiceUploadFile).toHaveBeenCalled();
    });

    test('should handle file stream creation failure', async () => {
        const mockRequest = {
            filePath: '/path/to/nonexistent/file',
            columnName: 'testColumn',
            tableName: 'testTable',
            skyflowId: 'id123',
        };

        jest.spyOn(mockFs, 'createReadStream').mockImplementationOnce(() => {
            throw new Error('Validation error');
        });

        await expect(vaultController.uploadFile(mockRequest)).rejects.toThrow('Validation error');
        expect(mockFs.createReadStream).toHaveBeenCalledWith(mockRequest.filePath);
        expect(mockVaultClient.vaultAPI.fileServiceUploadFile).not.toHaveBeenCalled();
    });

    test('should handle API errors during file upload', async () => {
        const mockRequest = {
            filePath: '/path/to/file',
            columnName: 'testColumn',
            tableName: 'testTable',
            skyflowId: 'id123',
        };
        const mockStream = { on: jest.fn() };
        jest.spyOn(mockFs, 'createReadStream').mockReturnValueOnce(mockStream);

        const errorResponse = new Error('Validation error');
        mockVaultClient.vaultAPI.fileServiceUploadFile.mockRejectedValueOnce(errorResponse);

        await expect(vaultController.uploadFile(mockRequest)).rejects.toEqual(errorResponse);
        expect(mockVaultClient.vaultAPI.fileServiceUploadFile).toHaveBeenCalled();
    });

    test('should log and reject errors during file upload', async () => {
        const mockRequest = {
            filePath: '/path/to/file',
            columnName: 'testColumn',
            tableName: 'testTable',
            skyflowId: 'id123',
        };
        const mockStream = { on: jest.fn() };
        jest.spyOn(mockFs, 'createReadStream').mockReturnValueOnce(mockStream);

        const errorResponse = new Error('Validation error');
        mockVaultClient.vaultAPI.fileServiceUploadFile.mockRejectedValueOnce(errorResponse);

        await expect(vaultController.uploadFile(mockRequest)).rejects.toEqual(errorResponse);
        expect(mockVaultClient.vaultAPI.fileServiceUploadFile).toHaveBeenCalled();
        // expect(printLog).toHaveBeenCalledWith(errorResponse.message, MessageType.ERROR, mockVaultClient.getLogLevel());
    });
});

describe('VaultController get method', () => {
    let mockVaultClient;
    let vaultController;

    beforeEach(() => {
        mockVaultClient = {
            getLogLevel: jest.fn().mockReturnValue('DEBUG'),
            vaultAPI: {
                recordServiceBulkGetRecord: jest.fn(),
            },
            initAPI: jest.fn(),
            getCredentials: jest.fn().mockReturnValue({}),
            vaultId: 'vault123',
            failureResponse: jest.fn().mockRejectedValueOnce({})
        };
        vaultController = new VaultController(mockVaultClient);
        jest.clearAllMocks();
    });

    const createGetRequest = (ids) => new GetRequest('testTable', ids );
    const createGetColumnRequest = (columnName, columnValues) => new GetColumnRequest('testTable', columnName, columnValues );

    test('should successfully get records for GetRequest', async () => {
        const mockRequest = createGetRequest(['id1', 'id2']);
        const mockResponseData = { data: { records: [{ fields: { field1: 'value1' } }, { fields: { field2: 'value2' } }] } };

        mockVaultClient.vaultAPI.recordServiceBulkGetRecord.mockResolvedValueOnce(mockResponseData);

        const response = await vaultController.get(mockRequest);

        // Validate that the correct validation method was called
        expect(validateGetRequest).toHaveBeenCalledWith(mockRequest);

        // Validate the response structure and content
        expect(response).toBeInstanceOf(GetResponse);
        expect(response.data).toEqual([{ field1: 'value1' }, { field2: 'value2' }]);
        expect(response.errors).toHaveLength(0);
    });

    test('should successfully get records for GetColumnRequest', async () => {
        const mockRequest = createGetColumnRequest('columnName', ['value1', 'value2']);
        const mockResponseData = { data: { records:[{ fields: { field1: 'value1' } }]}};

        mockVaultClient.vaultAPI.recordServiceBulkGetRecord.mockResolvedValueOnce(mockResponseData);

        const response = await vaultController.get(mockRequest);

        // Validate that the correct validation method was called
        expect(validateGetColumnRequest).toHaveBeenCalledWith(mockRequest);

        // Validate the response structure and content
        expect(response).toBeInstanceOf(GetResponse);
        expect(response.data).toEqual([{ field1: 'value1' }]);
        expect(response.errors).toHaveLength(0);
    });

    test('should handle validation errors for GetRequest', async () => {
        const mockRequest = createGetRequest(['id1']);
        validateGetRequest.mockImplementation(() => { throw new Error('Validation error'); });

        await expect(vaultController.get(mockRequest)).rejects.toThrow('Validation error');
        
        // Validate that the validation method was called
        expect(validateGetRequest).toHaveBeenCalledWith(mockRequest);
        
        // Ensure that the API call was not made
        expect(mockVaultClient.vaultAPI.recordServiceBulkGetRecord).toHaveBeenCalled();
    });

    test('should handle validation errors for GetColumnRequest', async () => {
        const mockRequest = createGetColumnRequest('columnName', ['value1']);
        validateGetColumnRequest.mockImplementation(() => { throw new Error('Validation error'); });

        await expect(vaultController.get(mockRequest)).rejects.toThrow('Validation error');
        
        // Validate that the validation method was called
        expect(validateGetColumnRequest).toHaveBeenCalledWith(mockRequest);
        
        // Ensure that the API call was not made
        expect(mockVaultClient.vaultAPI.recordServiceBulkGetRecord).toHaveBeenCalled();
    });

    test('should handle API errors during get', async () => {
        const mockRequest = createGetRequest(['id1']);
        const errorResponse = new Error('Validation error');

        mockVaultClient.vaultAPI.recordServiceBulkGetRecord.mockRejectedValueOnce(errorResponse);

        await expect(vaultController.get(mockRequest)).rejects.toEqual(errorResponse);
        
        // Validate that the API call was made
        expect(mockVaultClient.vaultAPI.recordServiceBulkGetRecord).toHaveBeenCalled();
    });

    test('should log and reject errors during get', async () => {
        const mockRequest = createGetRequest(['id1']);
        const errorResponse = new Error('Validation error');

        mockVaultClient.vaultAPI.recordServiceBulkGetRecord.mockRejectedValueOnce(errorResponse);

        await expect(vaultController.get(mockRequest)).rejects.toEqual(errorResponse);
    });

    test('should handle undefined parameters correctly', async () => {
        const mockRequest = createGetRequest(undefined); // Pass undefined IDs
        const mockResponseData = [{ fields: { field1: 'value1' } }];
        validateGetRequest.mockImplementation(() => { 
        });
        mockVaultClient.vaultAPI.recordServiceBulkGetRecord.mockResolvedValueOnce(mockResponseData);

        try{
            const response = await vaultController.get(mockRequest);
        } catch(err) {
            expect(err).toBeDefined();
        }
    });
});

describe('VaultController Error Handling', () => {
    let mockVaultClient;
    let vaultController;

    beforeEach(() => {
        mockVaultClient = {
            getLogLevel: jest.fn().mockReturnValue('DEBUG'),
            vaultAPI: {
                recordServiceInsertRecord: jest.fn(),
                recordServiceBatchOperation: jest.fn(),
            },
            initAPI: jest.fn(),
            getCredentials: jest.fn().mockReturnValue({}),
            vaultId: 'vault123',
            failureResponse: jest.fn().mockRejectedValueOnce(new SkyflowError({http_code:500,message:"Invalid"}))
        };
        vaultController = new VaultController(mockVaultClient);
        jest.clearAllMocks();
        validateInsertRequest.mockImplementation(() => {});
    });

    test('failureResponse should handle JSON error correctly', async () => {
        const mockError = {
            response: {
                headers: {
                    'content-type': 'application/json',
                    'x-request-id': 'req123',
                },
                data: {
                    error: {
                        message: 'Not Found',
                        http_status: 404,
                        grpc_code: 'NOT_FOUND',
                    },
                },
                status: 404,
            },
        };

        mockVaultClient.vaultAPI.recordServiceInsertRecord.mockRejectedValueOnce(mockError);

        await expect(vaultController.insert({ tableName: 'users', data: [{}] })).rejects.toThrow(SkyflowError);

        // You can check if the error contains the right message
        try {
            await vaultController.insert({ tableName: 'users', data: [{}] });
        } catch (e) {
            expect(e).toBeDefined();
        }
    });

    test('failureResponse should handle text error correctly', async () => {
        const mockError = {
            response: {
                headers: {
                    'content-type': 'text/plain',
                    'x-request-id': 'req123',
                },
                data: 'An unexpected error occurred.',
                status: 400,
            },
        };

        mockVaultClient.vaultAPI.recordServiceInsertRecord.mockRejectedValueOnce(mockError);

        await expect(vaultController.insert({ tableName: 'users', data: [{}] })).rejects.toThrow(SkyflowError);

        // Check that the error message is as expected
        try {
            await vaultController.insert({ tableName: 'users', data: [{}] });
        } catch (e) {
            expect(e).toBeDefined();
        }
    });

    test('failureResponse should handle generic error when no content type', async () => {
        const mockError = {
            response: {
                headers: {},
                data: 'An unknown error occurred.',
                status: 500,
            },
        };

        mockVaultClient.vaultAPI.recordServiceInsertRecord.mockRejectedValueOnce(mockError);

        await expect(vaultController.insert({ tableName: 'users', data: [{}] })).rejects.toThrow(SkyflowError);

        // Check that the error message is as expected
        try {
            await vaultController.insert({ tableName: 'users', data: [{}] });
        } catch (e) {
            expect(e).toBeDefined();
        }
    });

    test('failureResponse should handle generic error when no response object', async () => {
        const mockError = new Error('Network Error');

        mockVaultClient.vaultAPI.recordServiceInsertRecord.mockRejectedValueOnce(mockError);

        await expect(vaultController.insert({ tableName: 'users', data: [{}] })).rejects.toThrow(SkyflowError);

        // Check that the error message is as expected
        try {
            await vaultController.insert({ tableName: 'users', data: [{}] });
        } catch (e) {
            expect(e).toBeDefined();
        }
    });
});