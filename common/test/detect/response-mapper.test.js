import {
    enumOrDefault,
    toMetrics,
    toDeidentifyStringResponse,
    toReidentifyStringResponse,
    toFileOutput,
    toGetRunResponse as mapGetRunResponse,
    submittedDeidentifyFileResponse,
    toDeidentifyFileResponse,
    toReidentifyFileResponse as mapReidentifyFileResponse,
    toCheckGuardrailsResponse,
} from '../../src/detect/internal/response-mapper';
import { DetectRunStatus, GuardrailsValidation, DeidentifyFileDataFormat } from '../../src/detect/types';
import { TestDeidentifySourceType as DeidentifySourceType, TestReidentifySourceType as ReidentifySourceType, resolveDeidentifySource, resolveReidentifySource } from './test-types';

// The mappers take the SDK's source resolver; these bind the test stand-ins.
const toGetRunResponse = (runId, response) => mapGetRunResponse(runId, response, resolveDeidentifySource);
const toReidentifyFileResponse = (response) => mapReidentifyFileResponse(response, resolveReidentifySource);
import DeidentifyStringResponse from '../../src/detect/model/response/deidentify-string';
import GetRunResponse from '../../src/detect/model/response/get-run';
import DeidentifyFileResponse from '../../src/detect/model/response/deidentify-file';

describe('enumOrDefault', () => {
    test('returns the matching enum member, else the fallback', () => {
        expect(enumOrDefault(DetectRunStatus, 'SUCCESS', DetectRunStatus.UNKNOWN)).toBe(DetectRunStatus.SUCCESS);
        expect(enumOrDefault(DetectRunStatus, 'NEW_STATUS', DetectRunStatus.UNKNOWN)).toBe(DetectRunStatus.UNKNOWN);
        expect(enumOrDefault(DetectRunStatus, undefined, null)).toBeNull();
    });
});

describe('toMetrics', () => {
    test('maps every field, null-filling missing ones', () => {
        expect(toMetrics({ size: 1.5, wordCount: 3 })).toEqual({
            size: 1.5,
            wordCount: 3,
            characterCount: null,
            slides: null,
            pages: null,
            duration: null,
        });
        expect(toMetrics(undefined)).toBeNull();
    });
});

describe('string responses', () => {
    test('toDeidentifyStringResponse maps entities, locations and scores; entities never null', () => {
        const out = toDeidentifyStringResponse({
            processedText: 'Hi [NAME_1]',
            entities: [
                {
                    token: 'NAME_1',
                    value: 'John',
                    location: { startIndex: 3, endIndex: 7 },
                    entityType: 'NAME',
                    entityScores: { NAME: 0.98 },
                },
                null,
                { token: 'X' },
            ],
            metrics: { wordCount: 2 },
        });
        expect(out).toBeInstanceOf(DeidentifyStringResponse);
        expect(out.processedText).toBe('Hi [NAME_1]');
        expect(out.entities).toEqual([
            {
                token: 'NAME_1',
                value: 'John',
                location: { startIndex: 3, endIndex: 7, startIndexProcessed: null, endIndexProcessed: null },
                entityType: 'NAME',
                entityScores: { NAME: 0.98 },
            },
            { token: 'X', value: null, location: null, entityType: null, entityScores: {} },
        ]);
        expect(out.metrics.wordCount).toBe(2);
        expect(toDeidentifyStringResponse({}).entities).toEqual([]);
        expect(toDeidentifyStringResponse({}).processedText).toBeNull();
    });
    test('toReidentifyStringResponse maps text and metrics', () => {
        const out = toReidentifyStringResponse({ processedText: 'Hi John', metrics: { characterCount: 7 } });
        expect(out.processedText).toBe('Hi John');
        expect(out.metrics.characterCount).toBe(7);
    });
});

describe('file responses', () => {
    test('toFileOutput upper-cases the extension into DeidentifyFileDataFormat and tolerates unknowns', () => {
        expect(toFileOutput({ processedFile: 'b64', processedFileType: 'REDACTED_FILE', processedFileExtension: 'pdf' })).toEqual({
            processedFile: 'b64',
            processedFileType: 'REDACTED_FILE',
            processedFileExtension: DeidentifyFileDataFormat.PDF,
        });
        expect(toFileOutput({ processedFileExtension: 'weird' })).toEqual({
            processedFile: null,
            processedFileType: null,
            processedFileExtension: null,
        });
    });
    test('toGetRunResponse carries the run id and maps status/outputType with UNKNOWN fallback', () => {
        const out = toGetRunResponse('run-1', {
            status: 'SUCCESS',
            outputType: 'BASE64',
            output: [{ processedFile: 'x', processedFileType: 'ENTITIES', processedFileExtension: 'json' }, null],
            metrics: { pages: 2 },
            message: undefined,
        });
        expect(out).toBeInstanceOf(GetRunResponse);
        expect(out.runId).toBe('run-1');
        expect(out.status).toBe(DetectRunStatus.SUCCESS);
        expect(out.outputType).toBe(DeidentifySourceType.BASE64);
        expect(out.output).toHaveLength(1);
        expect(out.metrics.pages).toBe(2);
        expect(out.message).toBeNull();

        const unknown = toGetRunResponse('run-2', { status: 'SOMETHING_NEW' });
        expect(unknown.status).toBe(DetectRunStatus.UNKNOWN);
        expect(unknown.outputType).toBeNull();
        expect(unknown.output).toEqual([]);
        expect(unknown.metrics).toBeNull();
    });
    test('submittedDeidentifyFileResponse has only the run id; toDeidentifyFileResponse merges a run', () => {
        const submitted = submittedDeidentifyFileResponse('run-1');
        expect(submitted).toBeInstanceOf(DeidentifyFileResponse);
        expect(submitted).toEqual(expect.objectContaining({ runId: 'run-1', status: null, outputType: null, output: [], metrics: null, message: null }));

        const run = toGetRunResponse('run-1', { status: 'FAILED', message: 'bad file' });
        const merged = toDeidentifyFileResponse('run-1', run);
        expect(merged.status).toBe(DetectRunStatus.FAILED);
        expect(merged.message).toBe('bad file');
        expect(merged.runId).toBe('run-1');
    });
    test('toReidentifyFileResponse maps status, output type and outputs', () => {
        const out = toReidentifyFileResponse({ status: 'SUCCESS', outputType: 'PRESIGNED_URL', output: [{ processedFile: 'https://u' }] });
        expect(out.status).toBe(DetectRunStatus.SUCCESS);
        expect(out.outputType).toBe(ReidentifySourceType.PRESIGNED_URL);
        expect(out.output[0].processedFile).toBe('https://u');
        expect(toReidentifyFileResponse({}).status).toBe(DetectRunStatus.UNKNOWN);
    });
});

describe('toCheckGuardrailsResponse', () => {
    test('passes the API values through, with UNKNOWN for an unrecognized validation', () => {
        expect(toCheckGuardrailsResponse({ text: 't', validation: 'FAILED', toxic: true, deniedTopic: false })).toEqual(
            expect.objectContaining({ text: 't', validation: GuardrailsValidation.FAILED, toxic: true, deniedTopic: false }),
        );
        const sparse = toCheckGuardrailsResponse({ text: 't', validation: 'MAYBE' });
        expect(sparse.validation).toBe(GuardrailsValidation.UNKNOWN);
        expect(sparse.toxic).toBeNull();
        expect(sparse.deniedTopic).toBeNull();
    });
});
