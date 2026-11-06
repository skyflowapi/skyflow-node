import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

// Replace the generated Detect V2 resource clients with stubs that record calls.
jest.mock('../../src/_generated_/rest/api/resources/stringsV2/client/Client', () => {
    const api = { deidentifyStringV2: jest.fn(), reidentifyStringV2: jest.fn() };
    return { StringsV2: jest.fn(() => api), __api: api };
});
jest.mock('../../src/_generated_/rest/api/resources/filesV2/client/Client', () => {
    const api = { deidentifyFileV2: jest.fn(), reidentifyFileV2: jest.fn(), getRunV2: jest.fn() };
    return { FilesV2: jest.fn(() => api), __api: api };
});
jest.mock('../../src/_generated_/rest/api/resources/guardrailsV2/client/Client', () => {
    const api = { checkGuardrailsV2: jest.fn() };
    return { GuardrailsV2: jest.fn(() => api), __api: api };
});

import { BaseDetectController } from '../../src/detect/controller';
import { StringsV2, __api as strings } from '../../src/_generated_/rest/api/resources/stringsV2/client/Client';
import { FilesV2, __api as files } from '../../src/_generated_/rest/api/resources/filesV2/client/Client';
import { __api as guardrails } from '../../src/_generated_/rest/api/resources/guardrailsV2/client/Client';
import DeidentifyStringRequest from '../../src/detect/model/request/deidentify-string';
import DeidentifyFileRequest from '../../src/detect/model/request/deidentify-file';
import ReidentifyStringRequest from '../../src/detect/model/request/reidentify-string';
import ReidentifyFileRequest from '../../src/detect/model/request/reidentify-file';
import GetRunRequest from '../../src/detect/model/request/get-run';
import CheckGuardrailsRequest from '../../src/detect/model/request/check-guardrails';
import DeidentifyStringResponse from '../../src/detect/model/response/deidentify-string';
import DeidentifyFileResponse from '../../src/detect/model/response/deidentify-file';
import ReidentifyStringResponse from '../../src/detect/model/response/reidentify-string';
import ReidentifyFileResponse from '../../src/detect/model/response/reidentify-file';
import GetRunResponse from '../../src/detect/model/response/get-run';
import CheckGuardrailsResponse from '../../src/detect/model/response/check-guardrails';
import { DetectRunStatus, GuardrailsValidation } from '../../src/detect/types';
import { TestDeidentifySourceType as DeidentifySourceType, TestReidentifySourceType as ReidentifySourceType, TestDetectController } from './test-types';
import { LogLevel, SDK } from '../../src/utils';
import SkyflowError from '../../src/error';
import SKYFLOW_ERROR_CODE from '../../src/error/codes';

beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
});
afterAll(() => jest.restoreAllMocks());

const URL = 'https://abc.vault.skyflowapis.com';

function fakeClient(overrides = {}) {
    return {
        vaultId: 'vault123',
        url: URL,
        getLogLevel: () => LogLevel.ERROR,
        resolveAuthToken: jest.fn().mockResolvedValue('tok-1'),
        ...overrides,
    };
}

/** No real waiting while polling. */
class TestController extends TestDetectController {
    sleeper() {
        return async () => undefined;
    }
}

const apiError = (statusCode, message, requestId = 'req-1') => ({
    statusCode,
    body: { error: { message, grpc_code: 3, http_code: statusCode, http_status: 'Bad Request', details: [] } },
    rawResponse: { headers: new Map([['x-request-id', requestId]]) },
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe('construction and transport plumbing', () => {
    test('builds each generated client lazily with live baseUrl/token suppliers and per-call options', async () => {
        const client = fakeClient({ timeout: 30, maxRetries: 2 });
        const controller = new TestController(client);
        expect(StringsV2).not.toHaveBeenCalled();

        strings.deidentifyStringV2.mockResolvedValue({ processedText: 'x' });
        await controller.deidentifyString(new DeidentifyStringRequest('hi'));

        expect(StringsV2).toHaveBeenCalledTimes(1);
        const suppliers = StringsV2.mock.calls[0][0];
        expect(suppliers.baseUrl()).toBe(URL);
        expect(suppliers.token()).toBe('tok-1');

        const [, options] = strings.deidentifyStringV2.mock.calls[0];
        expect(options.timeoutInSeconds).toBe(30);
        expect(options.maxRetries).toBe(2);
        expect(JSON.parse(options.headers[SDK.METRICS_HEADER_KEY])).toEqual(expect.objectContaining({ sdk_name_version: expect.any(String) }));

        // Second call reuses the client; the token supplier reflects the refreshed token.
        client.resolveAuthToken.mockResolvedValue('tok-2');
        await controller.deidentifyString(new DeidentifyStringRequest('again'));
        expect(StringsV2).toHaveBeenCalledTimes(1);
        expect(suppliers.token()).toBe('tok-2');
    });

    test('omits timeout and retries from the call options when the client has none', async () => {
        const controller = new TestController(fakeClient());
        strings.deidentifyStringV2.mockResolvedValue({});
        await controller.deidentifyString(new DeidentifyStringRequest('hi'));
        const [, options] = strings.deidentifyStringV2.mock.calls[0];
        expect(options.timeoutInSeconds).toBeUndefined();
        expect(options.maxRetries).toBeUndefined();
    });

    test('validation failures throw before any token or network call', async () => {
        const client = fakeClient();
        const controller = new TestController(client);
        await expect(controller.deidentifyString(new DeidentifyStringRequest(''))).rejects.toBeInstanceOf(SkyflowError);
        expect(client.resolveAuthToken).not.toHaveBeenCalled();
        expect(strings.deidentifyStringV2).not.toHaveBeenCalled();
    });

    test('a token failure propagates as-is', async () => {
        const client = fakeClient({ resolveAuthToken: jest.fn().mockRejectedValue(new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_CREDENTIALS)) });
        const controller = new TestController(client);
        await expect(controller.checkGuardrails(new CheckGuardrailsRequest('t'))).rejects.toMatchObject({
            message: SKYFLOW_ERROR_CODE.EMPTY_CREDENTIALS.message,
        });
    });
});

describe('deidentifyString / reidentifyString', () => {
    test('deidentifyString sends the mapped request and returns a mapped response', async () => {
        const controller = new TestController(fakeClient());
        strings.deidentifyStringV2.mockResolvedValue({
            processedText: 'Hi [NAME_1]',
            entities: [{ token: 'NAME_1', entityType: 'NAME', location: { startIndex: 3, endIndex: 7 } }],
            metrics: { wordCount: 2 },
        });
        const res = await controller.deidentifyString(new DeidentifyStringRequest('Hi John', { configurationId: 'cfg' }));
        expect(strings.deidentifyStringV2.mock.calls[0][0]).toEqual({ text: 'Hi John', configurationId: 'cfg' });
        expect(res).toBeInstanceOf(DeidentifyStringResponse);
        expect(res.processedText).toBe('Hi [NAME_1]');
        expect(res.entities[0].token).toBe('NAME_1');
        expect(res.metrics.wordCount).toBe(2);
    });

    test('an API error is normalized into a SkyflowError with code, message and request id', async () => {
        const controller = new TestController(fakeClient());
        strings.deidentifyStringV2.mockRejectedValue(apiError(400, 'bad config', 'req-9'));
        let thrown;
        try {
            await controller.deidentifyString(new DeidentifyStringRequest('Hi'));
        } catch (e) {
            thrown = e;
        }
        expect(thrown).toBeInstanceOf(SkyflowError);
        expect(thrown.message).toBe('bad config');
        expect(thrown.error.httpCode).toBe(400);
        expect(thrown.error.requestId).toBe('req-9');
        expect(thrown.error.grpcCode).toBe(3);
    });

    test('reidentifyString adds the vault id and maps the response', async () => {
        const controller = new TestController(fakeClient());
        strings.reidentifyStringV2.mockResolvedValue({ processedText: 'Hi John', metrics: { characterCount: 7 } });
        const res = await controller.reidentifyString(new ReidentifyStringRequest('Hi [NAME_1]', { redactionLevel: [{ tokenGroupName: 'g' }] }));
        expect(strings.reidentifyStringV2.mock.calls[0][0]).toEqual({ vaultId: 'vault123', text: 'Hi [NAME_1]', redactionLevel: [{ tokenGroupName: 'g' }] });
        expect(res).toBeInstanceOf(ReidentifyStringResponse);
        expect(res.processedText).toBe('Hi John');
    });
});

describe('deidentifyFile', () => {
    let tmpDir;
    let filePath;
    beforeEach(() => {
        tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'detect-controller-'));
        filePath = path.join(tmpDir, 'notes.txt');
        fs.writeFileSync(filePath, 'John lives here');
    });
    afterEach(() => fs.rmSync(tmpDir, { recursive: true, force: true }));

    test('submit only: returns the run id, no polling, nothing written', async () => {
        const controller = new TestController(fakeClient());
        files.deidentifyFileV2.mockResolvedValue({ runId: 'run-1' });
        const res = await controller.deidentifyFile(new DeidentifyFileRequest({ filePath, configurationId: 'cfg' }));
        expect(res).toBeInstanceOf(DeidentifyFileResponse);
        expect(res.runId).toBe('run-1');
        expect(res.status).toBeNull();
        expect(files.getRunV2).not.toHaveBeenCalled();
        const [sent] = files.deidentifyFileV2.mock.calls[0];
        expect(sent).toEqual({ dataSource: 'BASE64', value: Buffer.from('John lives here').toString('base64'), dataFormat: 'txt', configurationId: 'cfg' });
        expect(fs.readdirSync(tmpDir)).toEqual(['notes.txt']);
    });

    test('submit and poll: polls getRun until SUCCESS and writes outputs for a local file', async () => {
        const controller = new TestController(fakeClient());
        files.deidentifyFileV2.mockResolvedValue({ runId: 'run-2' });
        files.getRunV2
            .mockResolvedValueOnce({ status: 'IN_PROGRESS' })
            .mockResolvedValueOnce({
                status: 'SUCCESS',
                outputType: 'BASE64',
                output: [
                    { processedFile: Buffer.from('[NAME_1] lives here').toString('base64'), processedFileType: 'REDACTED_FILE', processedFileExtension: 'txt' },
                    { processedFile: Buffer.from('[]').toString('base64'), processedFileType: 'ENTITIES', processedFileExtension: 'json' },
                ],
                metrics: { wordCount: 3 },
            });
        const outDir = path.join(tmpDir, 'out');
        const res = await controller.deidentifyFile(
            new DeidentifyFileRequest({ filePath, pollOptions: { waitTime: 30 }, outputDirectory: outDir }),
        );
        expect(res.runId).toBe('run-2');
        expect(res.status).toBe(DetectRunStatus.SUCCESS);
        expect(res.outputType).toBe(DeidentifySourceType.BASE64);
        expect(res.output).toHaveLength(2);
        expect(res.metrics.wordCount).toBe(3);
        expect(files.getRunV2).toHaveBeenCalledTimes(2);
        expect(files.getRunV2.mock.calls[0][0]).toBe('run-2');
        expect(files.getRunV2.mock.calls[0][1]).toEqual({ vaultId: 'vault123' });
        expect(fs.readFileSync(path.join(outDir, 'processed-notes.txt'), 'utf8')).toBe('[NAME_1] lives here');
        expect(fs.readFileSync(path.join(outDir, 'processed-entities-notes.json'), 'utf8')).toBe('[]');
    });

    test('submit and poll on a value-based request writes nothing even on SUCCESS', async () => {
        const controller = new TestController(fakeClient());
        files.deidentifyFileV2.mockResolvedValue({ runId: 'run-3' });
        files.getRunV2.mockResolvedValue({
            status: 'SUCCESS',
            outputType: 'BASE64',
            output: [{ processedFile: Buffer.from('x').toString('base64'), processedFileType: 'REDACTED_FILE', processedFileExtension: 'txt' }],
        });
        const res = await controller.deidentifyFile(
            new DeidentifyFileRequest({ dataSource: DeidentifySourceType.SKYFLOW_ID, value: 'sid', pollOptions: {}, outputDirectory: tmpDir }),
        );
        expect(res.status).toBe(DetectRunStatus.SUCCESS);
        expect(fs.readdirSync(tmpDir)).toEqual(['notes.txt']);
    });

    test('a FAILED run returns the message without writing', async () => {
        const controller = new TestController(fakeClient());
        files.deidentifyFileV2.mockResolvedValue({ runId: 'run-4' });
        files.getRunV2.mockResolvedValue({ status: 'FAILED', message: 'unsupported file' });
        const res = await controller.deidentifyFile(new DeidentifyFileRequest({ filePath, pollOptions: {} }));
        expect(res.status).toBe(DetectRunStatus.FAILED);
        expect(res.message).toBe('unsupported file');
        expect(fs.readdirSync(tmpDir)).toEqual(['notes.txt']);
    });

    test('a submit error is normalized', async () => {
        const controller = new TestController(fakeClient());
        files.deidentifyFileV2.mockRejectedValue(apiError(413, 'too large'));
        await expect(controller.deidentifyFile(new DeidentifyFileRequest({ filePath }))).rejects.toMatchObject({ message: 'too large' });
    });

    test('a getRun failure while polling is normalized and propagated', async () => {
        const controller = new TestController(fakeClient());
        files.deidentifyFileV2.mockResolvedValue({ runId: 'run-5' });
        files.getRunV2.mockRejectedValue(apiError(404, 'no such run'));
        await expect(controller.deidentifyFile(new DeidentifyFileRequest({ filePath, pollOptions: {} }))).rejects.toMatchObject({ message: 'no such run' });
    });
});

describe('reidentifyFile / getRun / checkGuardrails', () => {
    test('reidentifyFile maps request and response', async () => {
        const controller = new TestController(fakeClient());
        files.reidentifyFileV2.mockResolvedValue({ status: 'SUCCESS', outputType: 'BASE64', output: [{ processedFile: 'b64', processedFileType: 'REIDENTIFIED_FILE', processedFileExtension: 'txt' }] });
        const res = await controller.reidentifyFile(new ReidentifyFileRequest(ReidentifySourceType.BASE64, 'abc'));
        expect(files.reidentifyFileV2.mock.calls[0][0]).toEqual({ dataSource: 'BASE64', value: 'abc', vaultId: 'vault123' });
        expect(res).toBeInstanceOf(ReidentifyFileResponse);
        expect(res.status).toBe(DetectRunStatus.SUCCESS);
        expect(res.output[0].processedFile).toBe('b64');
    });

    test('getRun trims the id, passes the vault id as the query, and maps the run', async () => {
        const controller = new TestController(fakeClient());
        files.getRunV2.mockResolvedValue({ status: 'QUEUED' });
        const res = await controller.getRun(new GetRunRequest('  run-7 '));
        expect(files.getRunV2).toHaveBeenCalledWith('run-7', { vaultId: 'vault123' }, expect.any(Object));
        expect(res).toBeInstanceOf(GetRunResponse);
        expect(res.runId).toBe('run-7');
        expect(res.status).toBe(DetectRunStatus.QUEUED);
    });

    test('checkGuardrails maps request and response', async () => {
        const controller = new TestController(fakeClient());
        guardrails.checkGuardrailsV2.mockResolvedValue({ text: 't', validation: 'FAILED', toxic: true });
        const res = await controller.checkGuardrails(new CheckGuardrailsRequest('t', { checkToxicity: true, denyTopics: ['politics'] }));
        expect(guardrails.checkGuardrailsV2.mock.calls[0][0]).toEqual({ text: 't', vaultId: 'vault123', checkToxicity: true, denyTopics: ['politics'] });
        expect(res).toBeInstanceOf(CheckGuardrailsResponse);
        expect(res.validation).toBe(GuardrailsValidation.FAILED);
        expect(res.toxic).toBe(true);
        expect(res.deniedTopic).toBeNull();
    });

    test('a generic Error from the transport becomes a SkyflowError with its message', async () => {
        const controller = new TestController(fakeClient());
        guardrails.checkGuardrailsV2.mockRejectedValue(new Error('socket hang up'));
        let thrown;
        try {
            await controller.checkGuardrails(new CheckGuardrailsRequest('t'));
        } catch (e) {
            thrown = e;
        }
        expect(thrown).toBeInstanceOf(SkyflowError);
        expect(thrown.message).toBe('socket hang up');
        expect(thrown.error.httpCode).toBe(400);
    });

    test('the files client is built once and shared by file operations', async () => {
        const controller = new TestController(fakeClient());
        files.getRunV2.mockResolvedValue({ status: 'SUCCESS' });
        await controller.getRun(new GetRunRequest('a'));
        await controller.getRun(new GetRunRequest('b'));
        expect(FilesV2).toHaveBeenCalledTimes(1);
    });
});
