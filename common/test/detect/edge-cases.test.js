// Covers the remaining branches of the detect layer: controller error paths for the
// re-identify operations, SkyflowError pass-through, the real-timer sleeper, output write
// failures, sparse media configurations, and default parameters.
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

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

import { __api as strings } from '../../src/_generated_/rest/api/resources/stringsV2/client/Client';
import { __api as files } from '../../src/_generated_/rest/api/resources/filesV2/client/Client';
import ReidentifyStringRequest from '../../src/detect/model/request/reidentify-string';
import ReidentifyFileRequest from '../../src/detect/model/request/reidentify-file';
import DeidentifyFileRequest from '../../src/detect/model/request/deidentify-file';
import GetRunResponse from '../../src/detect/model/response/get-run';
import { toSkyflowError } from '../../src/detect/internal/errors';
import { pollRun } from '../../src/detect/internal/run-poller';
import { writeOutputs } from '../../src/detect/internal/file-output-writer';
import { toDetectConfig } from '../../src/detect/internal/request-mapper';
import { completeDeidentifyFile } from '../../src/detect/internal/deidentify-file-flow';
import { DetectRunStatus, ObjectEntityType, DeidentifyFileDataFormat } from '../../src/detect/types';
import { TestDeidentifySourceType as DeidentifySourceType, TestReidentifySourceType as ReidentifySourceType, TestDetectController } from './test-types';
import { LogLevel } from '../../src/utils';
import SkyflowError from '../../src/error';
import SKYFLOW_ERROR_CODE from '../../src/error/codes';

beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
});
afterAll(() => jest.restoreAllMocks());
beforeEach(() => jest.clearAllMocks());

const fakeClient = () => ({
    vaultId: 'vault123',
    url: 'https://abc.vault.skyflowapis.com',
    getLogLevel: () => LogLevel.ERROR,
    resolveAuthToken: jest.fn().mockResolvedValue('tok'),
});

describe('controller error paths', () => {
    test('reidentifyString normalizes an API failure', async () => {
        const controller = new TestDetectController(fakeClient());
        strings.reidentifyStringV2.mockRejectedValue({ statusCode: 403, body: { error: { message: 'forbidden' } } });
        await expect(controller.reidentifyString(new ReidentifyStringRequest('[NAME_1]'))).rejects.toMatchObject({
            message: 'forbidden',
            error: expect.objectContaining({ httpCode: 403 }),
        });
    });

    test('reidentifyFile normalizes an API failure', async () => {
        const controller = new TestDetectController(fakeClient());
        files.reidentifyFileV2.mockRejectedValue({ statusCode: 500, body: { error: { message: 'boom' } } });
        await expect(controller.reidentifyFile(new ReidentifyFileRequest(ReidentifySourceType.BASE64, 'abc'))).rejects.toMatchObject({
            message: 'boom',
        });
    });

    test('a SkyflowError thrown by the transport passes through unchanged', async () => {
        const controller = new TestDetectController(fakeClient());
        const original = new SkyflowError(SKYFLOW_ERROR_CODE.INTERNAL_SERVER_ERROR, ['x']);
        strings.reidentifyStringV2.mockRejectedValue(original);
        await expect(controller.reidentifyString(new ReidentifyStringRequest('t'))).rejects.toBe(original);
        expect(toSkyflowError(original, 'log')).toBe(original);
    });

    test('the base controller uses the real timer sleeper by default', () => {
        expect(new TestDetectController(fakeClient()).sleeper()).toBeUndefined();
    });
});

describe('run poller with the real timer', () => {
    test('waits on setTimeout between lookups when no sleeper is supplied', async () => {
        jest.useFakeTimers();
        try {
            const fetcher = jest
                .fn()
                .mockResolvedValueOnce(new GetRunResponse({ runId: 'r', status: DetectRunStatus.IN_PROGRESS, outputType: null, output: [], metrics: null, message: null }))
                .mockResolvedValueOnce(new GetRunResponse({ runId: 'r', status: DetectRunStatus.SUCCESS, outputType: null, output: [], metrics: null, message: null }));
            const pending = pollRun('r', { waitTime: 5, maxAttempts: 5 }, fetcher);
            await jest.advanceTimersByTimeAsync(1000);
            const out = await pending;
            expect(out.status).toBe(DetectRunStatus.SUCCESS);
            expect(fetcher).toHaveBeenCalledTimes(2);
        } finally {
            jest.useRealTimers();
        }
    });
});

describe('deidentify-file flow defaults', () => {
    test('completeDeidentifyFile submit-only works with default log level and sleeper', async () => {
        const res = await completeDeidentifyFile(new DeidentifyFileRequest({ filePath: '/x' }), 'run-1', jest.fn());
        expect(res.runId).toBe('run-1');
        expect(res.status).toBeNull();
    });
});

describe('output writer failures', () => {
    test('throws FAILED_TO_WRITE_OUTPUT_FILE when a target cannot be written', async () => {
        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'detect-writer-fail-'));
        try {
            // A directory already occupies the output file name, so writeFile fails.
            fs.mkdirSync(path.join(tmpDir, 'processed-notes.txt'));
            let thrown;
            try {
                await writeOutputs(
                    [{ processedFile: Buffer.from('a').toString('base64'), processedFileType: 'REDACTED_FILE', processedFileExtension: DeidentifyFileDataFormat.TXT }],
                    DeidentifySourceType.BASE64,
                    'notes.txt',
                    tmpDir,
                );
            } catch (e) {
                thrown = e;
            }
            expect(thrown).toBeInstanceOf(SkyflowError);
            expect(thrown.message).toContain('processed-notes.txt');
        } finally {
            fs.rmSync(tmpDir, { recursive: true, force: true });
        }
    });
});

describe('submit without a run id', () => {
    test('deidentifyFile returns a null run id when the API omits it, and does not poll', async () => {
        const controller = new TestDetectController(fakeClient());
        files.deidentifyFileV2.mockResolvedValue({});
        const res = await controller.deidentifyFile(
            new DeidentifyFileRequest({ dataSource: DeidentifySourceType.PRESIGNED_URL, value: 'https://u', pollOptions: {} }),
        );
        expect(res.runId).toBeNull();
        expect(res.status).toBeNull();
        expect(files.getRunV2).not.toHaveBeenCalled();
    });
});

describe('toSkyflowError fallbacks', () => {
    test('a null error yields the generic message and a 400 code', () => {
        const err = toSkyflowError(null, 'log');
        expect(err).toBeInstanceOf(SkyflowError);
        expect(err.error.httpCode).toBe(400);
        expect(err.error.requestId).toBeNull();
    });

    test('camelCase body fields and a body request id are honoured; a rawResponse without headers is tolerated', () => {
        const err = toSkyflowError(
            {
                body: { error: { message: 'm', httpCode: 429, grpcCode: 8, httpStatus: 'Too Many Requests', details: ['d'], requestId: 'body-req' } },
                rawResponse: {},
            },
            'log',
        );
        expect(err.error.httpCode).toBe(429);
        expect(err.error.grpcCode).toBe(8);
        expect(err.error.httpStatus).toBe('Too Many Requests');
        expect(err.error.details).toEqual(['d']);
        expect(err.error.requestId).toBe('body-req');
    });

    test('a plain Error with no body uses its message; a non-object body is ignored', () => {
        expect(toSkyflowError(new Error('socket'), 'log').message).toBe('socket');
        const err = toSkyflowError({ statusCode: 502, body: 'gateway text', rawResponse: { headers: new Map() } }, 'log');
        expect(err.error.httpCode).toBe(502);
        expect(err.error.requestId).toBeNull();
    });
});

describe('output writer directory defaults', () => {
    test('a blank outputDirectory writes into the working directory', async () => {
        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'detect-writer-cwd-'));
        const previous = process.cwd();
        process.chdir(tmpDir);
        try {
            const written = await writeOutputs(
                [{ processedFile: Buffer.from('a').toString('base64'), processedFileType: 'REDACTED_FILE', processedFileExtension: DeidentifyFileDataFormat.TXT }],
                DeidentifySourceType.BASE64,
                'notes.txt',
                '   ',
            );
            expect(written).toEqual(['processed-notes.txt']);
            expect(fs.existsSync(path.join(tmpDir, 'processed-notes.txt'))).toBe(true);
        } finally {
            process.chdir(previous);
            fs.rmSync(tmpDir, { recursive: true, force: true });
        }
    });
});

describe('sparse configuration mapping', () => {
    test('audio without bleep, document without pdf, and null object entities map cleanly', () => {
        const out = toDetectConfig(
            {
                detect: { objectEntities: [null, { entityType: ObjectEntityType.LOGO }] },
                media: { audio: { outputProcessedAudio: false }, document: {} },
            },
            'vault123',
        );
        expect(out).toEqual({
            vaultId: 'vault123',
            detect: { objectEntities: [{ entityType: 'LOGO' }] },
            media: { audio: { outputProcessedAudio: false }, document: {} },
        });
    });
});
