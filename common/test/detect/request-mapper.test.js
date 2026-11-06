import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import {
    sendsConfiguration,
    toDeidentifyStringRequest,
    toDeidentifyFileRequest,
    toReidentifyStringRequest,
    toReidentifyFileRequest,
    toCheckGuardrailsRequest,
    toDetectConfig,
    toRedactionLevels,
    inferFormat,
    localFileName,
} from '../../src/detect/internal/request-mapper';
import DeidentifyStringRequest from '../../src/detect/model/request/deidentify-string';
import DeidentifyFileRequest from '../../src/detect/model/request/deidentify-file';
import ReidentifyStringRequest from '../../src/detect/model/request/reidentify-string';
import ReidentifyFileRequest from '../../src/detect/model/request/reidentify-file';
import CheckGuardrailsRequest from '../../src/detect/model/request/check-guardrails';
import {
    DeidentificationType,
    EntityType,
    FileDataFormat,
    MaskingMethod,
    ObjectDeidentificationType,
    ObjectEntityType,
    OutputTranscriptionType,
    PdfProcessingMode,
    ReturnEntitiesType,
} from '../../src/detect/types';
import { TestDeidentifySourceType as DeidentifySourceType, TestReidentifySourceType as ReidentifySourceType } from './test-types';
import { RedactionType } from '../../src/utils';
import SkyflowError from '../../src/error';
import SKYFLOW_ERROR_CODE from '../../src/error/codes';

beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
});
afterAll(() => jest.restoreAllMocks());

const VAULT = 'vault123';

describe('sendsConfiguration', () => {
    test('sends when inline configuration is set, or when neither is set', () => {
        expect(sendsConfiguration(undefined, undefined)).toBe(true);
        expect(sendsConfiguration(undefined, { detect: {} })).toBe(true);
        expect(sendsConfiguration('cfg', { detect: {} })).toBe(true);
        expect(sendsConfiguration('cfg', undefined)).toBe(false);
    });
});

describe('toDeidentifyStringRequest', () => {
    test('with neither id nor configuration, sends a configuration carrying only the vault id', () => {
        expect(toDeidentifyStringRequest(new DeidentifyStringRequest('hello'), VAULT)).toEqual({
            text: 'hello',
            configuration: { vaultId: VAULT },
        });
    });
    test('with only a configuration id, sends the id and nothing else', () => {
        expect(toDeidentifyStringRequest(new DeidentifyStringRequest('hello', { configurationId: 'cfg' }), VAULT)).toEqual({
            text: 'hello',
            configurationId: 'cfg',
        });
    });
    test('with both, sends both (the server rejects the combination)', () => {
        const out = toDeidentifyStringRequest(
            new DeidentifyStringRequest('hello', { configurationId: 'cfg', configuration: { name: 'n' } }),
            VAULT,
        );
        expect(out.configurationId).toBe('cfg');
        expect(out.configuration).toEqual({ vaultId: VAULT, name: 'n' });
    });
});

describe('toDetectConfig', () => {
    test('maps every field of a full inline configuration and drops unset keys', () => {
        const out = toDetectConfig(
            {
                name: 'cfg',
                description: 'desc',
                detect: {
                    entities: [
                        {
                            entityType: EntityType.DOB,
                            deidentificationType: DeidentificationType.ENTITY_UNIQUE_COUNTER,
                            transformation: { shiftDates: { minDays: 10, maxDays: 30 } },
                        },
                        { entityType: EntityType.NAME, deidentificationType: DeidentificationType.VAULT_TOKEN, destination: 'pii.name' },
                        null,
                    ],
                    objectEntities: [{ entityType: ObjectEntityType.FACE, deidentificationType: ObjectDeidentificationType.REDACT }],
                    restrict: ['[0-9]{3}'],
                    skip: ['Skyflow'],
                    customTypes: [{ label: 'EMPLOYEE_ID', match: ['EMP-[0-9]{6}'] }],
                    returnEntities: ReturnEntitiesType.ALL,
                },
                fileMapping: [{ source: 'a', destination: 'b', outputFileNameSuffix: '_x', entitiesDestination: 'e', objectEntitiesDestination: 'o' }],
                media: {
                    audio: { outputProcessedAudio: true, outputTranscription: OutputTranscriptionType.TRANSCRIPTION, bleep: { startPadding: 0.5, gain: 2 } },
                    document: { pdf: { processingMode: PdfProcessingMode.OCR, density: 300 } },
                    image: { maskingMethod: MaskingMethod.BLUR, outputOcrText: true },
                },
            },
            VAULT,
        );
        expect(out).toEqual({
            vaultId: VAULT,
            name: 'cfg',
            description: 'desc',
            detect: {
                entities: [
                    { entityType: 'DOB', deidentificationType: 'ENTITY_UNIQUE_COUNTER', transformation: { shiftDates: { minDays: 10, maxDays: 30 } } },
                    { entityType: 'NAME', deidentificationType: 'VAULT_TOKEN', destination: 'pii.name' },
                ],
                objectEntities: [{ entityType: 'FACE', deidentificationType: 'REDACT' }],
                restrict: ['[0-9]{3}'],
                skip: ['Skyflow'],
                customTypes: [{ label: 'EMPLOYEE_ID', match: ['EMP-[0-9]{6}'] }],
                returnEntities: 'ALL',
            },
            fileMapping: [{ source: 'a', destination: 'b', outputFileNameSuffix: '_x', entitiesDestination: 'e', objectEntitiesDestination: 'o' }],
            media: {
                audio: { outputProcessedAudio: true, outputTranscription: 'TRANSCRIPTION', bleep: { startPadding: 0.5, gain: 2 } },
                document: { pdf: { processingMode: 'OCR', density: 300 } },
                image: { maskingMethod: 'BLUR', outputOcrText: true },
            },
        });
    });
    test('an empty transformation / media / detect maps to empty objects', () => {
        const out = toDetectConfig({ detect: { entities: [{ transformation: {} }] }, media: {} }, VAULT);
        expect(out).toEqual({ vaultId: VAULT, detect: { entities: [{ transformation: {} }] }, media: {} });
    });
});

describe('toDeidentifyFileRequest', () => {
    let tmpDir;
    let filePath;
    beforeAll(() => {
        tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'detect-mapper-'));
        filePath = path.join(tmpDir, 'patient-notes.pdf');
        fs.writeFileSync(filePath, 'pdf-bytes');
    });
    afterAll(() => fs.rmSync(tmpDir, { recursive: true, force: true }));

    test('value-based request passes dataSource, value and lower-cased dataFormat through', async () => {
        const out = await toDeidentifyFileRequest(
            new DeidentifyFileRequest({
                dataSource: DeidentifySourceType.SKYFLOW_ID,
                value: 'sid',
                dataFormat: FileDataFormat.DOCX,
                configurationId: 'cfg',
            }),
            VAULT,
        );
        expect(out).toEqual({ dataSource: 'SKYFLOW_ID', value: 'sid', dataFormat: 'docx', configurationId: 'cfg' });
    });
    test('filePath request is read, base64-encoded, sent as BASE64 and the format inferred', async () => {
        const out = await toDeidentifyFileRequest(new DeidentifyFileRequest({ filePath }), VAULT);
        expect(out.dataSource).toBe('BASE64');
        expect(out.value).toBe(Buffer.from('pdf-bytes').toString('base64'));
        expect(out.dataFormat).toBe('pdf');
        expect(out.configuration).toEqual({ vaultId: VAULT });
    });
    test('File request is encoded from arrayBuffer and an explicit dataFormat wins over inference', async () => {
        const file = { name: 'x.txt', arrayBuffer: async () => Uint8Array.from(Buffer.from('hello')).buffer };
        const out = await toDeidentifyFileRequest(
            new DeidentifyFileRequest({ file, dataFormat: FileDataFormat.CSV, dataSource: DeidentifySourceType.PRESIGNED_URL }),
            VAULT,
        );
        expect(out.dataSource).toBe('BASE64'); // local file always wins
        expect(out.value).toBe(Buffer.from('hello').toString('base64'));
        expect(out.dataFormat).toBe('csv');
    });
    test('an unknown extension leaves dataFormat unset so the server infers it', async () => {
        const unknown = path.join(tmpDir, 'blob.weird');
        fs.writeFileSync(unknown, 'x');
        const out = await toDeidentifyFileRequest(new DeidentifyFileRequest({ filePath: unknown }), VAULT);
        expect(out.dataFormat).toBeUndefined();
    });
    test('an unreadable file throws FAILED_TO_ENCODE_FILE', async () => {
        const file = { name: 'bad.txt', arrayBuffer: async () => { throw new Error('boom'); } };
        let thrown;
        try {
            await toDeidentifyFileRequest(new DeidentifyFileRequest({ file }), VAULT);
        } catch (e) {
            thrown = e;
        }
        expect(thrown).toBeInstanceOf(SkyflowError);
        expect(thrown.message).toBe(SKYFLOW_ERROR_CODE.FAILED_TO_ENCODE_FILE.message);
    });
});

describe('inferFormat / localFileName', () => {
    test('inferFormat maps known extensions case-insensitively and returns undefined otherwise', () => {
        expect(inferFormat('a.PDF')).toBe(FileDataFormat.PDF);
        expect(inferFormat('a.jsonl')).toBe(FileDataFormat.JSONL);
        expect(inferFormat('a.unknown')).toBeUndefined();
        expect(inferFormat('noext')).toBeUndefined();
        expect(inferFormat(null)).toBeUndefined();
    });
    test('localFileName uses the File name, the filePath basename, or null', () => {
        expect(localFileName(new DeidentifyFileRequest({ file: { name: '/tmp/x/a.txt', arrayBuffer: async () => null } }))).toBe('a.txt');
        expect(localFileName(new DeidentifyFileRequest({ file: { arrayBuffer: async () => null } }))).toBe('output');
        expect(localFileName(new DeidentifyFileRequest({ filePath: '/data/in/notes.pdf' }))).toBe('notes.pdf');
        expect(localFileName(new DeidentifyFileRequest({ dataSource: DeidentifySourceType.BASE64, value: 'x' }))).toBeNull();
    });
});

describe('reidentify / guardrails mappers', () => {
    test('toReidentifyStringRequest adds the vault id and maps redaction levels', () => {
        const out = toReidentifyStringRequest(
            new ReidentifyStringRequest('[NAME_1]', {
                redactionLevel: [
                    { tokenGroupName: 'g', redactionPattern: 'p' },
                    { entityName: EntityType.SSN, redactionType: RedactionType.MASKED },
                    null,
                ],
            }),
            VAULT,
        );
        expect(out).toEqual({
            vaultId: VAULT,
            text: '[NAME_1]',
            redactionLevel: [
                { tokenGroupName: 'g', redactionPattern: 'p' },
                { entityName: 'SSN', redactionType: 'MASKED' },
            ],
        });
        expect(toReidentifyStringRequest(new ReidentifyStringRequest('t'), VAULT)).toEqual({ vaultId: VAULT, text: 't' });
    });
    test('toReidentifyFileRequest lower-cases the format and maps redaction levels', () => {
        const out = toReidentifyFileRequest(
            new ReidentifyFileRequest(ReidentifySourceType.BASE64, 'abc', {
                dataFormat: FileDataFormat.TXT,
                redactionLevel: [{ tokenGroupName: 'g' }],
            }),
            VAULT,
        );
        expect(out).toEqual({ dataSource: 'BASE64', value: 'abc', vaultId: VAULT, dataFormat: 'txt', redactionLevel: [{ tokenGroupName: 'g' }] });
    });
    test('toCheckGuardrailsRequest sends optional checks only when set', () => {
        expect(toCheckGuardrailsRequest(new CheckGuardrailsRequest('t'), VAULT)).toEqual({ text: 't', vaultId: VAULT });
        expect(toCheckGuardrailsRequest(new CheckGuardrailsRequest('t', { checkToxicity: false, denyTopics: ['a'] }), VAULT)).toEqual({
            text: 't',
            vaultId: VAULT,
            checkToxicity: false,
            denyTopics: ['a'],
        });
    });
    test('toRedactionLevels drops undefined keys', () => {
        expect(toRedactionLevels([{ tokenGroupName: 'g', entityName: undefined }])).toEqual([{ tokenGroupName: 'g' }]);
    });
});
