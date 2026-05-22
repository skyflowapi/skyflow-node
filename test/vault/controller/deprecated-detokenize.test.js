import VaultController from '../../../src/vault/controller/vault';
import { printLog } from '../../../src/utils';
import DetokenizeResponse from '../../../src/vault/model/response/detokenize';
import { validateDetokenizeRequest } from '../../../src/utils/validations';

jest.mock('../../../src/utils', () => ({
    printLog: jest.fn(),
    parameterizedString: jest.fn(),
    removeSDKVersion: jest.fn(),
    generateSDKMetrics: jest.fn(),
    getBearerToken: jest.fn().mockResolvedValue({ key: 'bearer-token' }),
    MessageType: { LOG: 'LOG', ERROR: 'ERROR', WARN: 'WARN' },
    LogLevel: { DEBUG: 'DEBUG', INFO: 'INFO', WARN: 'WARN', ERROR: 'ERROR', OFF: 'OFF' },
    TYPES: { DETOKENIZE: 'DETOKENIZE' },
    HTTP_STATUS_CODE: { OK: 200 },
    SDK: { METRICS_HEADER_KEY: 'sky-metadata' },
    SKYFLOW: { ID: 'skyflowId' },
    CONTENT_TYPE: { APPLICATION_JSON: 'application/json' },
    ENCODING_TYPE: { UTF8: 'utf8' },
    RedactionType: { DEFAULT: 'DEFAULT', PLAIN_TEXT: 'PLAIN_TEXT' },
}));

jest.mock('../../../src/utils/validations', () => ({
    validateDetokenizeRequest: jest.fn(),
}));

jest.mock('../../../src/utils/logs', () => ({
    infoLogs: { CONTROLLER_INITIALIZED: 'init', EMIT_REQUEST: 'emit' },
    errorLogs: { DETOKENIZE_REQUEST_REJECTED: 'rejected' },
    warnLogs: {
        DEPRECATED_REQUEST_ID_PROPERTY: "[DEPRECATED] Property 'request_ID' is deprecated and will be removed in an upcoming release. Use 'requestId' instead.",
        DEPRECATED_SKYFLOW_ID_PROPERTY: "[DEPRECATED] Property 'skyflow_id' is deprecated.",
    },
}));

// ─── SHARED SETUP ─────────────────────────────────────────────────────────────

const REQ_ID = 'req-detok-001';

function makeClient() {
    return {
        getLogLevel: jest.fn().mockReturnValue('WARN'),
        initAPI: jest.fn(),
        getCredentials: jest.fn().mockReturnValue({}),
        vaultId: 'vault-xyz',
        failureResponse: jest.fn().mockRejectedValue(new Error('fail')),
        tokensAPI: {
            recordServiceDetokenize: jest.fn(),
        },
    };
}

function detokenizeMock(records) {
    return {
        withRawResponse: jest.fn().mockResolvedValue({
            data: { records },
            rawResponse: { headers: { get: jest.fn().mockReturnValue(REQ_ID) } },
        }),
    };
}

const SUCCESS_RECORD = { token: 'tok-success', value: 'secret-value' };
const ERROR_RECORD   = { token: 'tok-error',   error: 'token not found' };

function makeRequest(tokens) {
    return { data: tokens.map(t => ({ token: t, redactionType: 'PLAIN_TEXT' })) };
}

const makeOptions = () => ({
    getContinueOnError: () => true,
    getDownloadUrl: () => false,
});

// ─── NEW API ──────────────────────────────────────────────────────────────────

describe('detokenize — new API', () => {
    let ctrl;

    beforeEach(() => {
        validateDetokenizeRequest.mockImplementation(() => {});
        jest.clearAllMocks();
        const client = makeClient();
        client.tokensAPI.recordServiceDetokenize.mockReturnValue(
            detokenizeMock([SUCCESS_RECORD, ERROR_RECORD])
        );
        ctrl = new VaultController(client);
    });

    it('detokenizedFields contains successful records', async () => {
        const res = await ctrl.detokenize(makeRequest(['tok-success', 'tok-error']), makeOptions());
        expect(res.detokenizedFields).toHaveLength(1);
        expect(res.detokenizedFields[0].token).toBe('tok-success');
        expect(res.detokenizedFields[0].value).toBe('secret-value');
    });

    it('errors array contains failed records', async () => {
        const res = await ctrl.detokenize(makeRequest(['tok-success', 'tok-error']), makeOptions());
        expect(res.errors).toHaveLength(1);
        expect(res.errors[0].token).toBe('tok-error');
    });

    it('errors[0].requestId is populated from response header', async () => {
        const res = await ctrl.detokenize(makeRequest(['tok-success', 'tok-error']), makeOptions());
        expect(res.errors[0].requestId).toBe(REQ_ID);
    });

    it('all-success: errors is null', async () => {
        const client = makeClient();
        client.tokensAPI.recordServiceDetokenize.mockReturnValue(
            detokenizeMock([SUCCESS_RECORD])
        );
        const c = new VaultController(client);
        const res = await c.detokenize(makeRequest(['tok-success']), makeOptions());
        expect(res.errors).toBeNull();
    });
});

// ─── DEPRECATED ───────────────────────────────────────────────────────────────
// Remove this block when request_ID shim is removed in v3.

describe('detokenize — request_ID shim on error records (deprecated)', () => {
    let ctrl;
    let client;

    beforeEach(() => {
        validateDetokenizeRequest.mockImplementation(() => {});
        jest.clearAllMocks();
        client = makeClient();
        client.tokensAPI.recordServiceDetokenize.mockReturnValue(
            detokenizeMock([SUCCESS_RECORD, ERROR_RECORD])
        );
        ctrl = new VaultController(client);
    });

    it('errors[0].request_ID returns same value as errors[0].requestId', async () => {
        const res = await ctrl.detokenize(makeRequest(['tok-success', 'tok-error']), makeOptions());
        expect(res.errors[0].request_ID).toBe(res.errors[0].requestId);
        expect(res.errors[0].request_ID).toBe(REQ_ID);
    });

    it('accessing request_ID logs deprecation warning', async () => {
        const res = await ctrl.detokenize(makeRequest(['tok-success', 'tok-error']), makeOptions());
        printLog.mockClear();
        void res.errors[0].request_ID;
        expect(printLog).toHaveBeenCalledWith(
            expect.stringContaining('request_ID'),
            expect.anything(),
            expect.anything(),
        );
    });

    it('request_ID is enumerable — appears in JSON.stringify output', async () => {
        const res = await ctrl.detokenize(makeRequest(['tok-success', 'tok-error']), makeOptions());
        const serialised = JSON.stringify(res.errors[0]);
        expect(serialised).toContain('"request_ID"');
    });

    it('request_ID does not appear on success records', async () => {
        const res = await ctrl.detokenize(makeRequest(['tok-success', 'tok-error']), makeOptions());
        expect(Object.keys(res.detokenizedFields[0])).not.toContain('request_ID');
    });
});
