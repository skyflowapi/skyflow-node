import {
    DeidentifyStringRequest,
    DeidentifyFileRequest,
    ReidentifyStringRequest,
    ReidentifyFileRequest,
    GetRunRequest,
    CheckGuardrailsRequest,
    DeidentifyStringResponse,
    DeidentifyFileResponse,
    ReidentifyStringResponse,
    ReidentifyFileResponse,
    GetRunResponse,
    CheckGuardrailsResponse,
    DetectRunStatus,
    EntityType,
    FileDataFormat,
    GuardrailsValidation,
    POLL_OPTIONS,
    BaseDetectController,
} from '../../src';
import { TestDeidentifySourceType as DeidentifySourceType, TestReidentifySourceType as ReidentifySourceType } from './test-types';

describe('detect request models', () => {
    test('DeidentifyStringRequest stores text and optional fields with settable accessors', () => {
        const r = new DeidentifyStringRequest('t', { configurationId: 'c' });
        expect(r.text).toBe('t');
        expect(r.configurationId).toBe('c');
        expect(r.configuration).toBeUndefined();
        r.text = 'u';
        r.configurationId = undefined;
        r.configuration = { detect: { entities: [{ entityType: EntityType.NAME }] } };
        expect(r.text).toBe('u');
        expect(r.configurationId).toBeUndefined();
        expect(r.configuration.detect.entities[0].entityType).toBe('NAME');
    });

    test('DeidentifyFileRequest stores every field and defaults to an empty request', () => {
        const empty = new DeidentifyFileRequest();
        expect(empty.dataSource).toBeUndefined();
        expect(empty.pollOptions).toBeUndefined();

        const r = new DeidentifyFileRequest({
            dataSource: DeidentifySourceType.PRESIGNED_URL,
            value: 'https://u',
            dataFormat: FileDataFormat.PDF,
            configurationId: 'c',
            pollOptions: { waitTime: 10 },
            outputDirectory: '/out',
        });
        expect(r.dataSource).toBe(DeidentifySourceType.PRESIGNED_URL);
        expect(r.value).toBe('https://u');
        expect(r.dataFormat).toBe(FileDataFormat.PDF);
        expect(r.configurationId).toBe('c');
        expect(r.pollOptions).toEqual({ waitTime: 10 });
        expect(r.outputDirectory).toBe('/out');

        r.dataSource = DeidentifySourceType.BASE64;
        r.value = 'abc';
        r.file = undefined;
        r.filePath = '/in/a.txt';
        r.dataFormat = undefined;
        r.configurationId = undefined;
        r.configuration = { name: 'n' };
        r.pollOptions = undefined;
        r.outputDirectory = undefined;
        expect(r.filePath).toBe('/in/a.txt');
        expect(r.configuration.name).toBe('n');
        expect(r.file).toBeUndefined();
    });

    test('ReidentifyStringRequest / ReidentifyFileRequest / GetRunRequest / CheckGuardrailsRequest', () => {
        const s = new ReidentifyStringRequest('t', { redactionLevel: [{ tokenGroupName: 'g' }] });
        expect(s.redactionLevel).toEqual([{ tokenGroupName: 'g' }]);
        s.text = 'x';
        s.redactionLevel = undefined;
        expect(s.text).toBe('x');
        expect(s.redactionLevel).toBeUndefined();

        const f = new ReidentifyFileRequest(ReidentifySourceType.BASE64, 'v', { dataFormat: FileDataFormat.TXT });
        expect(f.dataSource).toBe(ReidentifySourceType.BASE64);
        expect(f.value).toBe('v');
        expect(f.dataFormat).toBe(FileDataFormat.TXT);
        expect(f.redactionLevel).toBeUndefined();
        f.dataSource = ReidentifySourceType.PRESIGNED_URL;
        f.value = 'w';
        f.dataFormat = undefined;
        f.redactionLevel = [];
        expect(f.dataSource).toBe(ReidentifySourceType.PRESIGNED_URL);
        expect(f.redactionLevel).toEqual([]);

        const g = new GetRunRequest('run');
        g.runId = 'run2';
        expect(g.runId).toBe('run2');

        const c = new CheckGuardrailsRequest('t', { checkToxicity: true, denyTopics: ['a'] });
        expect(c.checkToxicity).toBe(true);
        expect(c.denyTopics).toEqual(['a']);
        c.text = 'u';
        c.checkToxicity = undefined;
        c.denyTopics = undefined;
        expect(c.text).toBe('u');
        expect(c.checkToxicity).toBeUndefined();
    });
});

describe('detect response models', () => {
    test('responses are plain readonly data containers', () => {
        expect(new DeidentifyStringResponse({ processedText: 'p', entities: [], metrics: null })).toEqual(
            expect.objectContaining({ processedText: 'p', entities: [], metrics: null }),
        );
        expect(new ReidentifyStringResponse({ processedText: 'p', metrics: null }).processedText).toBe('p');
        const run = { runId: 'r', status: DetectRunStatus.SUCCESS, outputType: null, output: [], metrics: null, message: null };
        expect(new DeidentifyFileResponse(run)).toEqual(expect.objectContaining(run));
        expect(new GetRunResponse(run)).toEqual(expect.objectContaining(run));
        expect(new ReidentifyFileResponse({ status: DetectRunStatus.FAILED, outputType: null, output: [], metrics: null }).status).toBe(DetectRunStatus.FAILED);
        expect(new CheckGuardrailsResponse({ text: 't', validation: GuardrailsValidation.PASSED, toxic: null, deniedTopic: null }).validation).toBe('PASSED');
    });

    test('the public barrel exposes the poll limits and the base controller', () => {
        expect(POLL_OPTIONS.MAX_WAIT_TIME_SECONDS).toBe(300);
        expect(typeof BaseDetectController).toBe('function');
    });
});
