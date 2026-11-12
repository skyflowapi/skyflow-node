import { DeidentifyFileDataFormat, ReidentifyFileDataFormat } from '../../src/detect/types';
import { DeidentifyFileRequestV2DataFormat } from '../../src/_generated_/rest/api/resources/filesV2/types/DeidentifyFileRequestV2DataFormat';
import { ReidentifyFileRequestV2DataFormat } from '../../src/_generated_/rest/api/resources/filesV2/types/ReidentifyFileRequestV2DataFormat';
import { FileOutputProcessedFileExtension } from '../../src/_generated_/rest/api/types/FileOutputProcessedFileExtension';
import { toFileOutput, toReidentifyFileOutput } from '../../src/detect/internal/response-mapper';

// The public file-format enums must mirror the generated wire enums value for value, so a caller can never
// select a format the endpoint rejects and never misses one it accepts.
const wire = (constObject) => Object.values(constObject).map((v) => String(v).toUpperCase()).sort();
const sdk = (enumObject) => Object.values(enumObject).sort();

describe('Detect file-format enums', () => {
    test('DeidentifyFileDataFormat mirrors the de-identify request wire enum', () => {
        expect(sdk(DeidentifyFileDataFormat)).toEqual(wire(DeidentifyFileRequestV2DataFormat));
    });

    test('DeidentifyFileDataFormat also mirrors the output extension wire enum', () => {
        expect(sdk(DeidentifyFileDataFormat)).toEqual(wire(FileOutputProcessedFileExtension));
    });

    test('ReidentifyFileDataFormat mirrors the re-identify request wire enum and has 8 values', () => {
        expect(sdk(ReidentifyFileDataFormat)).toEqual(wire(ReidentifyFileRequestV2DataFormat));
        expect(Object.keys(ReidentifyFileDataFormat)).toHaveLength(8);
    });

    test('re-identify formats are a subset of de-identify formats', () => {
        const deidentify = new Set(sdk(DeidentifyFileDataFormat));
        for (const f of sdk(ReidentifyFileDataFormat)) {
            expect(deidentify.has(f)).toBe(true);
        }
    });

    test('toReidentifyFileOutput narrows the extension to ReidentifyFileDataFormat', () => {
        expect(toReidentifyFileOutput({ processedFile: 'b64', processedFileType: 'REIDENTIFIED_FILE', processedFileExtension: 'docx' })).toEqual({
            processedFile: 'b64',
            processedFileType: 'REIDENTIFIED_FILE',
            processedFileExtension: ReidentifyFileDataFormat.DOCX,
        });
        // a format outside the re-identify set, or an unknown one, maps to null
        expect(toReidentifyFileOutput({ processedFileExtension: 'pdf' }).processedFileExtension).toBeNull();
        expect(toReidentifyFileOutput({ processedFileExtension: 'weird' }).processedFileExtension).toBeNull();
        // the de-identify mapper still accepts the wider set
        expect(toFileOutput({ processedFileExtension: 'pdf' }).processedFileExtension).toBe(DeidentifyFileDataFormat.PDF);
    });
});
