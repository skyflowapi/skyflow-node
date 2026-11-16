import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { writeOutputs, outputFileName, stripExtension } from '../../src/detect/internal/file-output-writer';
import { DeidentifyFileDataFormat } from '../../src/detect/types';
import { TestDeidentifySourceType as DeidentifySourceType } from './test-types';
import SkyflowError from '../../src/error';

beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
});
afterAll(() => jest.restoreAllMocks());

const b64 = (s) => Buffer.from(s).toString('base64');

describe('stripExtension', () => {
    test('drops the last extension, keeps dot-less names, defaults empty to "output"', () => {
        expect(stripExtension('notes.pdf')).toBe('notes');
        expect(stripExtension('archive.tar.gz')).toBe('archive.tar');
        expect(stripExtension('README')).toBe('README');
        expect(stripExtension('')).toBe('output');
        expect(stripExtension(undefined)).toBe('output');
    });
});

describe('outputFileName', () => {
    test('names processed files and entity files, and avoids collisions', () => {
        const used = new Set();
        expect(outputFileName('notes', { processedFile: 'x', processedFileType: 'REDACTED_FILE', processedFileExtension: DeidentifyFileDataFormat.PDF }, used)).toBe('processed-notes.pdf');
        expect(outputFileName('notes', { processedFile: 'x', processedFileType: 'ENTITIES', processedFileExtension: DeidentifyFileDataFormat.JSON }, used)).toBe('processed-entities-notes.json');
        expect(outputFileName('notes', { processedFile: 'x', processedFileType: 'OBJECT_ENTITIES', processedFileExtension: null }, used)).toBe('processed-object-entities-notes.json');
        // Same stem + extension again -> type inserted before the extension.
        expect(outputFileName('notes', { processedFile: 'x', processedFileType: 'REDACTED_TEXT', processedFileExtension: DeidentifyFileDataFormat.PDF }, used)).toBe('processed-notes.redacted_text.pdf');
        // No type and no extension -> .bin, and a counter on collision.
        expect(outputFileName('notes', { processedFile: 'x', processedFileType: null, processedFileExtension: null }, used)).toBe('processed-notes.bin');
        expect(outputFileName('notes', { processedFile: 'x', processedFileType: null, processedFileExtension: null }, used)).toBe('processed-notes.5.bin');
    });
});

describe('writeOutputs', () => {
    let tmpDir;
    beforeEach(() => {
        tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'detect-writer-'));
    });
    afterEach(() => fs.rmSync(tmpDir, { recursive: true, force: true }));

    test('writes decoded BASE64 outputs into the directory, creating it when missing', async () => {
        const dir = path.join(tmpDir, 'nested', 'out');
        const written = await writeOutputs(
            [
                { processedFile: b64('redacted'), processedFileType: 'REDACTED_FILE', processedFileExtension: DeidentifyFileDataFormat.TXT },
                { processedFile: b64('[]'), processedFileType: 'ENTITIES', processedFileExtension: DeidentifyFileDataFormat.JSON },
                { processedFile: null, processedFileType: 'REDACTED_TEXT', processedFileExtension: DeidentifyFileDataFormat.TXT },
            ],
            DeidentifySourceType.BASE64,
            'notes.txt',
            dir,
        );
        expect(written).toEqual([path.join(dir, 'processed-notes.txt'), path.join(dir, 'processed-entities-notes.json')]);
        expect(fs.readFileSync(written[0], 'utf8')).toBe('redacted');
        expect(fs.readFileSync(written[1], 'utf8')).toBe('[]');
    });

    test('returns nothing for empty outputs or non-BASE64 output types', async () => {
        expect(await writeOutputs([], DeidentifySourceType.BASE64, 'a.txt', tmpDir)).toEqual([]);
        expect(
            await writeOutputs([{ processedFile: 'https://u', processedFileType: 'REDACTED_FILE', processedFileExtension: null }], DeidentifySourceType.PRESIGNED_URL, 'a.txt', tmpDir),
        ).toEqual([]);
        expect(fs.readdirSync(tmpDir)).toEqual([]);
    });

    test('throws a SkyflowError when the directory cannot be created', async () => {
        const blocker = path.join(tmpDir, 'file-not-dir');
        fs.writeFileSync(blocker, 'x');
        await expect(
            writeOutputs([{ processedFile: b64('a'), processedFileType: 'REDACTED_FILE', processedFileExtension: DeidentifyFileDataFormat.TXT }], DeidentifySourceType.BASE64, 'a.txt', path.join(blocker, 'sub')),
        ).rejects.toBeInstanceOf(SkyflowError);
    });
});
