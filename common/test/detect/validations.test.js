import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import {
    validateDeidentifyStringRequest,
    validateDeidentifyFileRequest,
    validatePollOptions,
    validateReidentifyStringRequest,
    validateReidentifyFileRequest,
    validateGetRunRequest,
    validateCheckGuardrailsRequest,
} from '../../src/detect/internal/validations';
import DeidentifyStringRequest from '../../src/detect/model/request/deidentify-string';
import DeidentifyFileRequest from '../../src/detect/model/request/deidentify-file';
import ReidentifyStringRequest from '../../src/detect/model/request/reidentify-string';
import ReidentifyFileRequest from '../../src/detect/model/request/reidentify-file';
import GetRunRequest from '../../src/detect/model/request/get-run';
import CheckGuardrailsRequest from '../../src/detect/model/request/check-guardrails';
import { TestDeidentifySourceType as DeidentifySourceType, TestReidentifySourceType as ReidentifySourceType } from './test-types';
import SkyflowError from '../../src/error';
import SKYFLOW_ERROR_CODE from '../../src/error/codes';

beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
});
afterAll(() => jest.restoreAllMocks());

function expectCode(fn, code) {
    let thrown;
    try {
        fn();
    } catch (e) {
        thrown = e;
    }
    expect(thrown).toBeInstanceOf(SkyflowError);
    expect(thrown.error.httpCode).toBe(code.httpCode);
    expect(thrown.message).toBe(code.message);
}

describe('validateDeidentifyStringRequest', () => {
    test('rejects a missing request', () => {
        expectCode(() => validateDeidentifyStringRequest(null), SKYFLOW_ERROR_CODE.INVALID_DEIDENTIFY_STRING_REQUEST);
    });
    test.each(['', '   ', undefined, 42])('rejects text %p', (text) => {
        expectCode(
            () => validateDeidentifyStringRequest(new DeidentifyStringRequest(text)),
            SKYFLOW_ERROR_CODE.INVALID_TEXT_IN_DEIDENTIFY_STRING,
        );
    });
    test('accepts text with or without a configuration', () => {
        expect(() => validateDeidentifyStringRequest(new DeidentifyStringRequest('hi'))).not.toThrow();
        expect(() =>
            validateDeidentifyStringRequest(new DeidentifyStringRequest('hi', { configurationId: 'cfg' })),
        ).not.toThrow();
        expect(() =>
            validateDeidentifyStringRequest(new DeidentifyStringRequest('hi', { configuration: { detect: {} } })),
        ).not.toThrow();
    });
});

describe('validateDeidentifyFileRequest', () => {
    let tmpDir;
    let filePath;
    beforeAll(() => {
        tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'detect-validations-'));
        filePath = path.join(tmpDir, 'notes.txt');
        fs.writeFileSync(filePath, 'hello');
    });
    afterAll(() => fs.rmSync(tmpDir, { recursive: true, force: true }));

    const fileLike = () => ({ name: 'a.txt', arrayBuffer: async () => new ArrayBuffer(0) });

    test('rejects a missing request', () => {
        expectCode(() => validateDeidentifyFileRequest(undefined), SKYFLOW_ERROR_CODE.INVALID_DEIDENTIFY_FILE_REQUEST);
    });
    test('rejects more than one file source', () => {
        expectCode(
            () => validateDeidentifyFileRequest(new DeidentifyFileRequest({ file: fileLike(), filePath })),
            SKYFLOW_ERROR_CODE.MULTIPLE_FILE_SOURCES_IN_DEIDENTIFY_FILE,
        );
        expectCode(
            () =>
                validateDeidentifyFileRequest(
                    new DeidentifyFileRequest({ dataSource: DeidentifySourceType.BASE64, value: 'abc', filePath }),
                ),
            SKYFLOW_ERROR_CODE.MULTIPLE_FILE_SOURCES_IN_DEIDENTIFY_FILE,
        );
    });
    test('rejects a file that is not File-like', () => {
        expectCode(
            () => validateDeidentifyFileRequest(new DeidentifyFileRequest({ file: { name: 'x' } })),
            SKYFLOW_ERROR_CODE.INVALID_FILE_IN_DEIDENTIFY_FILE,
        );
    });
    test('rejects a filePath that does not exist or is a directory', () => {
        expectCode(
            () => validateDeidentifyFileRequest(new DeidentifyFileRequest({ filePath: path.join(tmpDir, 'missing.txt') })),
            SKYFLOW_ERROR_CODE.FILE_NOT_FOUND_IN_DEIDENTIFY_FILE,
        );
        expectCode(
            () => validateDeidentifyFileRequest(new DeidentifyFileRequest({ filePath: tmpDir })),
            SKYFLOW_ERROR_CODE.FILE_NOT_FOUND_IN_DEIDENTIFY_FILE,
        );
    });
    test('requires exactly one of filePath, file or value', () => {
        expectCode(
            () => validateDeidentifyFileRequest(new DeidentifyFileRequest({})),
            SKYFLOW_ERROR_CODE.MISSING_FILE_SOURCE_IN_DEIDENTIFY_FILE,
        );
        // dataSource alone is not a source: it only describes value.
        expectCode(
            () => validateDeidentifyFileRequest(new DeidentifyFileRequest({ dataSource: DeidentifySourceType.SKYFLOW_ID })),
            SKYFLOW_ERROR_CODE.MISSING_FILE_SOURCE_IN_DEIDENTIFY_FILE,
        );
        // An empty value still counts as the value source, so it collides with filePath.
        expectCode(
            () => validateDeidentifyFileRequest(new DeidentifyFileRequest({ value: '', filePath })),
            SKYFLOW_ERROR_CODE.MULTIPLE_FILE_SOURCES_IN_DEIDENTIFY_FILE,
        );
    });
    test('requires dataSource and a non-empty value for a value-based request', () => {
        expectCode(
            () => validateDeidentifyFileRequest(new DeidentifyFileRequest({ value: 'abc' })),
            SKYFLOW_ERROR_CODE.INVALID_DATA_SOURCE_IN_DEIDENTIFY_FILE,
        );
        expectCode(
            () => validateDeidentifyFileRequest(new DeidentifyFileRequest({ dataSource: DeidentifySourceType.BASE64, value: '' })),
            SKYFLOW_ERROR_CODE.INVALID_VALUE_IN_DEIDENTIFY_FILE,
        );
        expectCode(
            () => validateDeidentifyFileRequest(new DeidentifyFileRequest({ dataSource: DeidentifySourceType.BASE64, value: '   ' })),
            SKYFLOW_ERROR_CODE.INVALID_VALUE_IN_DEIDENTIFY_FILE,
        );
    });
    test('accepts each single source', () => {
        expect(() => validateDeidentifyFileRequest(new DeidentifyFileRequest({ file: fileLike() }))).not.toThrow();
        expect(() => validateDeidentifyFileRequest(new DeidentifyFileRequest({ filePath }))).not.toThrow();
        expect(() =>
            validateDeidentifyFileRequest(
                new DeidentifyFileRequest({ dataSource: DeidentifySourceType.PRESIGNED_URL, value: 'https://x' }),
            ),
        ).not.toThrow();
    });
    test('rejects outputDirectory without pollOptions, accepts it with pollOptions', () => {
        expectCode(
            () => validateDeidentifyFileRequest(new DeidentifyFileRequest({ filePath, outputDirectory: '/tmp/out' })),
            SKYFLOW_ERROR_CODE.OUTPUT_DIRECTORY_WITHOUT_POLL_OPTIONS,
        );
        expect(() =>
            validateDeidentifyFileRequest(new DeidentifyFileRequest({ filePath, outputDirectory: '/tmp/out', pollOptions: {} })),
        ).not.toThrow();
    });
    test('validates poll options bounds', () => {
        expectCode(
            () => validateDeidentifyFileRequest(new DeidentifyFileRequest({ filePath, pollOptions: { waitTime: 0 } })),
            SKYFLOW_ERROR_CODE.INVALID_WAIT_TIME_IN_POLL_OPTIONS,
        );
        expectCode(
            () => validateDeidentifyFileRequest(new DeidentifyFileRequest({ filePath, pollOptions: { maxAttempts: 24 } })),
            SKYFLOW_ERROR_CODE.INVALID_MAX_ATTEMPTS_IN_POLL_OPTIONS,
        );
    });
});

describe('validatePollOptions', () => {
    test('accepts undefined and in-range values', () => {
        expect(() => validatePollOptions(undefined)).not.toThrow();
        expect(() => validatePollOptions({})).not.toThrow();
        expect(() => validatePollOptions({ waitTime: 1, maxAttempts: 1 })).not.toThrow();
        expect(() => validatePollOptions({ waitTime: 300, maxAttempts: 23 })).not.toThrow();
    });
    test.each([301, -1, 'x', NaN])('rejects waitTime %p', (waitTime) => {
        expectCode(() => validatePollOptions({ waitTime }), SKYFLOW_ERROR_CODE.INVALID_WAIT_TIME_IN_POLL_OPTIONS);
    });
    test.each([0, 24, 'x'])('rejects maxAttempts %p', (maxAttempts) => {
        expectCode(() => validatePollOptions({ maxAttempts }), SKYFLOW_ERROR_CODE.INVALID_MAX_ATTEMPTS_IN_POLL_OPTIONS);
    });
});

describe('validateReidentifyStringRequest', () => {
    test('rejects a missing request and blank text', () => {
        expectCode(() => validateReidentifyStringRequest(null), SKYFLOW_ERROR_CODE.INVALID_REIDENTIFY_STRING_REQUEST);
        expectCode(
            () => validateReidentifyStringRequest(new ReidentifyStringRequest(' ')),
            SKYFLOW_ERROR_CODE.INVALID_TEXT_IN_REIDENTIFY_STRING,
        );
    });
    test('rejects a non-array redactionLevel and accepts an array', () => {
        expectCode(
            () => validateReidentifyStringRequest(new ReidentifyStringRequest('t', { redactionLevel: {} })),
            SKYFLOW_ERROR_CODE.INVALID_REDACTION_LEVEL,
        );
        expect(() =>
            validateReidentifyStringRequest(new ReidentifyStringRequest('t', { redactionLevel: [{ tokenGroupName: 'g' }] })),
        ).not.toThrow();
    });
});

describe('validateReidentifyFileRequest', () => {
    test('rejects a missing request, dataSource and value', () => {
        expectCode(() => validateReidentifyFileRequest(undefined), SKYFLOW_ERROR_CODE.INVALID_REIDENTIFY_FILE_REQUEST);
        expectCode(
            () => validateReidentifyFileRequest(new ReidentifyFileRequest(undefined, 'abc')),
            SKYFLOW_ERROR_CODE.INVALID_DATA_SOURCE_IN_REIDENTIFY_FILE,
        );
        expectCode(
            () => validateReidentifyFileRequest(new ReidentifyFileRequest(ReidentifySourceType.BASE64, '')),
            SKYFLOW_ERROR_CODE.INVALID_VALUE_IN_REIDENTIFY_FILE,
        );
    });
    test('accepts a valid request', () => {
        expect(() =>
            validateReidentifyFileRequest(new ReidentifyFileRequest(ReidentifySourceType.PRESIGNED_URL, 'https://x')),
        ).not.toThrow();
    });
});

describe('validateGetRunRequest', () => {
    test('rejects a missing request and blank runId', () => {
        expectCode(() => validateGetRunRequest(null), SKYFLOW_ERROR_CODE.INVALID_GET_RUN_REQUEST);
        expectCode(() => validateGetRunRequest(new GetRunRequest('')), SKYFLOW_ERROR_CODE.INVALID_RUN_ID_IN_GET_RUN);
        expectCode(() => validateGetRunRequest(new GetRunRequest(undefined)), SKYFLOW_ERROR_CODE.INVALID_RUN_ID_IN_GET_RUN);
    });
    test('accepts a run id', () => {
        expect(() => validateGetRunRequest(new GetRunRequest('run-1'))).not.toThrow();
    });
});

describe('validateCheckGuardrailsRequest', () => {
    test('rejects a missing request, blank text and bad denyTopics', () => {
        expectCode(() => validateCheckGuardrailsRequest(null), SKYFLOW_ERROR_CODE.INVALID_CHECK_GUARDRAILS_REQUEST);
        expectCode(
            () => validateCheckGuardrailsRequest(new CheckGuardrailsRequest('')),
            SKYFLOW_ERROR_CODE.INVALID_TEXT_IN_CHECK_GUARDRAILS,
        );
        expectCode(
            () => validateCheckGuardrailsRequest(new CheckGuardrailsRequest('t', { denyTopics: 'politics' })),
            SKYFLOW_ERROR_CODE.INVALID_DENY_TOPICS_IN_CHECK_GUARDRAILS,
        );
        expectCode(
            () => validateCheckGuardrailsRequest(new CheckGuardrailsRequest('t', { denyTopics: ['ok', 3] })),
            SKYFLOW_ERROR_CODE.INVALID_DENY_TOPICS_IN_CHECK_GUARDRAILS,
        );
    });
    test('accepts text with optional checks', () => {
        expect(() => validateCheckGuardrailsRequest(new CheckGuardrailsRequest('t'))).not.toThrow();
        expect(() =>
            validateCheckGuardrailsRequest(new CheckGuardrailsRequest('t', { checkToxicity: true, denyTopics: ['a'] })),
        ).not.toThrow();
    });
});
