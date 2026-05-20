import VaultController from '../../../src/vault/controller/vault';
import { printLog } from '../../../src/utils';
import InsertResponse from '../../../src/vault/model/response/insert';
import { validateInsertRequest } from '../../../src/utils/validations';

jest.mock('../../../src/utils', () => ({
    printLog: jest.fn(),
    parameterizedString: jest.fn(),
    removeSDKVersion: jest.fn(),
    generateSDKMetrics: jest.fn(),
    getBearerToken: jest.fn().mockResolvedValue({ key: 'bearer-token' }),
    MessageType: { LOG: 'LOG', ERROR: 'ERROR', WARN: 'WARN' },
    LogLevel: { DEBUG: 'DEBUG', INFO: 'INFO', WARN: 'WARN', ERROR: 'ERROR', OFF: 'OFF' },
    TYPES: { INSERT: 'INSERT', INSERT_BATCH: 'INSERT_BATCH' },
    HTTP_STATUS_CODE: { OK: 200, BAD_REQUEST: 400 },
    SDK: { METRICS_HEADER_KEY: 'sky-metadata' },
    SKYFLOW: { ID: 'skyflowId' },
    CONTENT_TYPE: { APPLICATION_JSON: 'application/json' },
    ENCODING_TYPE: { UTF8: 'utf8' },
}));

jest.mock('../../../src/utils/validations', () => ({
    validateInsertRequest: jest.fn(),
}));

jest.mock('../../../src/utils/logs', () => ({
    infoLogs: { CONTROLLER_INITIALIZED: 'init', EMIT_REQUEST: 'emit' },
    errorLogs: { INSERT_REQUEST_REJECTED: 'rejected' },
    warnLogs: {
        DEPRECATED_SKYFLOW_ID_PROPERTY: "[DEPRECATED] Property 'skyflow_id' is deprecated and will be removed in an upcoming release. Use 'skyflowId' instead.",
        DEPRECATED_REQUEST_ID_PROPERTY: "[DEPRECATED] Property 'request_ID' is deprecated and will be removed in an upcoming release. Use 'requestId' instead.",
    },
}));

// ─── SHARED SETUP ─────────────────────────────────────────────────────────────

function makeClient(overrides = {}) {
    return {
        getLogLevel: jest.fn().mockReturnValue('WARN'),
        initAPI: jest.fn(),
        getCredentials: jest.fn().mockReturnValue({}),
        vaultId: 'vault-abc',
        failureResponse: jest.fn().mockRejectedValue(new Error('fail')),
        vaultAPI: {
            recordServiceInsertRecord: jest.fn(),
            recordServiceBatchOperation: jest.fn(),
        },
        ...overrides,
    };
}

function bulkInsertMock(skyflowId = 'id-001', tokenMap = { card: 'tok-001' }) {
    return {
        withRawResponse: jest.fn().mockResolvedValue({
            data: { records: [{ skyflow_id: skyflowId, tokens: tokenMap }] },
            rawResponse: { headers: { get: jest.fn().mockReturnValue('req-id-bulk') } },
        }),
    };
}

function batchInsertMock({ successId = 'id-batch', errorMsg = null } = {}) {
    const responses = [
        { Body: { records: [{ skyflow_id: successId }] }, Status: 200 },
    ];
    if (errorMsg) {
        responses.push({ Body: { error: errorMsg }, Status: 400 });
    }
    return {
        withRawResponse: jest.fn().mockResolvedValue({
            data: { responses },
            rawResponse: { headers: { get: jest.fn().mockReturnValue('req-id-batch') } },
        }),
    };
}

// ─── NEW API ──────────────────────────────────────────────────────────────────

describe('insert — skyflowId (new API)', () => {
    let ctrl;

    beforeEach(() => {
        validateInsertRequest.mockImplementation(() => {});
        jest.clearAllMocks();
        const client = makeClient();
        client.vaultAPI.recordServiceInsertRecord.mockReturnValue(bulkInsertMock());
        ctrl = new VaultController(client);
    });

    it('bulk insert: insertedFields[0].skyflowId contains the record id', async () => {
        const req = { table: 'pii', data: [{ name: 'Alice' }] };
        const opts = {
            getContinueOnError: () => false,
            getReturnTokens: () => true,
            getUpsertColumn: () => '',
            getHomogeneous: () => false,
            getTokenMode: () => '',
            getTokens: () => [],
        };
        const res = await ctrl.insert(req, opts);
        expect(res).toBeInstanceOf(InsertResponse);
        expect(res.insertedFields[0].skyflowId).toBe('id-001');
    });

    it('batch insert: insertedFields[0].skyflowId contains the record id', async () => {
        const client = makeClient();
        client.vaultAPI.recordServiceBatchOperation.mockReturnValue(batchInsertMock({ successId: 'id-batch' }));
        const c = new VaultController(client);
        const req = { table: 'pii', data: [{ name: 'Bob' }] };
        const opts = {
            getContinueOnError: () => true,
            getReturnTokens: () => false,
            getUpsertColumn: () => '',
            getHomogeneous: () => false,
            getTokenMode: () => '',
            getTokens: () => [],
        };
        const res = await c.insert(req, opts);
        expect(res.insertedFields[0].skyflowId).toBe('id-batch');
    });

    it('batch insert error: errors[0].requestId is set', async () => {
        const client = makeClient();
        client.vaultAPI.recordServiceBatchOperation.mockReturnValue(
            batchInsertMock({ successId: 'id-ok', errorMsg: 'field missing' })
        );
        const c = new VaultController(client);
        const req = { table: 'pii', data: [{ name: 'Charlie' }, { bad: true }] };
        const opts = {
            getContinueOnError: () => true,
            getReturnTokens: () => false,
            getUpsertColumn: () => '',
            getHomogeneous: () => false,
            getTokenMode: () => '',
            getTokens: () => [],
        };
        const res = await c.insert(req, opts);
        expect(res.errors[0].requestId).toBe('req-id-batch');
    });
});

// ─── DEPRECATED ───────────────────────────────────────────────────────────────
// Remove these blocks when the deprecated shims are removed in v3.

describe('insert — skyflow_id shim (deprecated)', () => {
    let ctrl;

    beforeEach(() => {
        validateInsertRequest.mockImplementation(() => {});
        jest.clearAllMocks();
    });

    it('batch insert: skyflow_id returns same value as skyflowId', async () => {
        const client = makeClient();
        client.vaultAPI.recordServiceBatchOperation.mockReturnValue(batchInsertMock({ successId: 'id-dep' }));
        ctrl = new VaultController(client);
        const req = { table: 'pii', data: [{ name: 'Dep' }] };
        const opts = {
            getContinueOnError: () => true,
            getReturnTokens: () => false,
            getUpsertColumn: () => '',
            getHomogeneous: () => false,
            getTokenMode: () => '',
            getTokens: () => [],
        };
        const res = await ctrl.insert(req, opts);
        expect(res.insertedFields[0].skyflow_id).toBe(res.insertedFields[0].skyflowId);
        expect(res.insertedFields[0].skyflow_id).toBe('id-dep');
    });

    it('batch insert: accessing skyflow_id logs deprecation warning', async () => {
        const client = makeClient();
        client.vaultAPI.recordServiceBatchOperation.mockReturnValue(batchInsertMock({ successId: 'id-dep' }));
        ctrl = new VaultController(client);
        const req = { table: 'pii', data: [{ name: 'Dep' }] };
        const opts = {
            getContinueOnError: () => true,
            getReturnTokens: () => false,
            getUpsertColumn: () => '',
            getHomogeneous: () => false,
            getTokenMode: () => '',
            getTokens: () => [],
        };
        const res = await ctrl.insert(req, opts);
        printLog.mockClear();
        void res.insertedFields[0].skyflow_id;
        expect(printLog).toHaveBeenCalledWith(
            expect.stringContaining('skyflow_id'),
            expect.anything(),
            expect.anything(),
        );
    });

    it('batch insert: skyflow_id is enumerable (serialises to JSON)', async () => {
        const client = makeClient();
        client.vaultAPI.recordServiceBatchOperation.mockReturnValue(batchInsertMock({ successId: 'id-dep' }));
        ctrl = new VaultController(client);
        const req = { table: 'pii', data: [{ name: 'Dep' }] };
        const opts = {
            getContinueOnError: () => true,
            getReturnTokens: () => false,
            getUpsertColumn: () => '',
            getHomogeneous: () => false,
            getTokenMode: () => '',
            getTokens: () => [],
        };
        const res = await ctrl.insert(req, opts);
        expect(Object.keys(res.insertedFields[0])).toContain('skyflow_id');
        expect(JSON.stringify(res.insertedFields[0])).toContain('"skyflow_id"');
    });
});

describe('insert — request_ID shim on batch error (deprecated)', () => {
    let ctrl;

    beforeEach(() => {
        validateInsertRequest.mockImplementation(() => {});
        jest.clearAllMocks();
    });

    it('errors[0].request_ID returns same value as errors[0].requestId', async () => {
        const client = makeClient();
        client.vaultAPI.recordServiceBatchOperation.mockReturnValue(
            batchInsertMock({ successId: 'id-ok', errorMsg: 'bad field' })
        );
        ctrl = new VaultController(client);
        const req = { table: 'pii', data: [{ a: 1 }, { bad: true }] };
        const opts = {
            getContinueOnError: () => true,
            getReturnTokens: () => false,
            getUpsertColumn: () => '',
            getHomogeneous: () => false,
            getTokenMode: () => '',
            getTokens: () => [],
        };
        const res = await ctrl.insert(req, opts);
        expect(res.errors[0].request_ID).toBe(res.errors[0].requestId);
    });

    it('errors[0].request_ID access logs deprecation warning', async () => {
        const client = makeClient();
        client.vaultAPI.recordServiceBatchOperation.mockReturnValue(
            batchInsertMock({ successId: 'id-ok', errorMsg: 'bad field' })
        );
        ctrl = new VaultController(client);
        const req = { table: 'pii', data: [{ a: 1 }, { bad: true }] };
        const opts = {
            getContinueOnError: () => true,
            getReturnTokens: () => false,
            getUpsertColumn: () => '',
            getHomogeneous: () => false,
            getTokenMode: () => '',
            getTokens: () => [],
        };
        const res = await ctrl.insert(req, opts);
        printLog.mockClear();
        void res.errors[0].request_ID;
        expect(printLog).toHaveBeenCalledWith(
            expect.stringContaining('request_ID'),
            expect.anything(),
            expect.anything(),
        );
    });
});
