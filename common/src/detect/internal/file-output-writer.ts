// Writes the base64 outputs of a successful file run next to, or into a chosen directory for, the
// local file that was submitted. Internal to the SDK.
//
// Each output becomes `processed-<input name>.<extension>`. Entity outputs carry their type in the
// name so they never collide with a processed file of the same extension: ENTITIES becomes
// `processed-entities-<input name>.json` and OBJECT_ENTITIES becomes
// `processed-object-entities-<input name>.json`. If two outputs would still share a name the file
// type is added before the extension. Presigned-URL outputs are not fetched and nothing is written
// for them.
import * as fs from "fs";
import * as path from "path";
import { ENCODING_TYPE, LogLevel, MessageType, parameterizedString, printLog } from "../../utils";
import logs from "../../utils/logs";
import SkyflowError from "../../error";
import SKYFLOW_ERROR_CODE from "../../error/codes";
import { BASE64_SOURCE, DeidentifyFileSource, FileOutput } from "../types";

/** @internal */
export const PROCESSED_FILE_NAME_PREFIX = "processed-";

const ENTITIES_TYPE = "ENTITIES";

/** @internal */
export function stripExtension(fileName: string | null | undefined): string {
    if (!fileName) {
        return "output";
    }
    const ext = path.extname(fileName);
    return ext && ext.length < fileName.length ? fileName.slice(0, -ext.length) : fileName;
}

/**
 * @param base the input file name without its extension
 * @returns `processed-<base>.<ext>`, or `processed-<type>-<base>.json` for entity outputs
 * @internal
 */
export function outputFileName(base: string, output: FileOutput, used: Set<string>): string {
    const type = output.processedFileType ?? "";
    const entities = type.toUpperCase().includes(ENTITIES_TYPE);
    let extension: string;
    if (output.processedFileExtension) {
        extension = output.processedFileExtension.toLowerCase();
    } else if (entities) {
        extension = "json";
    } else {
        extension = "bin";
    }
    // ENTITIES -> processed-entities-<base>, OBJECT_ENTITIES -> processed-object-entities-<base>
    const stem = entities
        ? `${PROCESSED_FILE_NAME_PREFIX}${type.toLowerCase().replace(/_/g, "-")}-${base}`
        : `${PROCESSED_FILE_NAME_PREFIX}${base}`;
    let name = `${stem}.${extension}`;
    if (used.has(name)) {
        name = `${stem}.${type.length === 0 ? String(used.size) : type.toLowerCase()}.${extension}`;
    }
    used.add(name);
    return name;
}

function writeFailure(log: string, target: string, logLevel: LogLevel): SkyflowError {
    printLog(parameterizedString(log, target), MessageType.ERROR, logLevel);
    return new SkyflowError(SKYFLOW_ERROR_CODE.FAILED_TO_WRITE_OUTPUT_FILE, [target]);
}

/**
 * @returns the paths written, in output order; empty when the output type is not BASE64
 * @throws SkyflowError if the directory cannot be created or a file cannot be decoded or written
 * @internal
 */
export async function writeOutputs(
    outputs: FileOutput[],
    outputType: DeidentifyFileSource | null,
    inputFileName: string,
    outputDirectory: string | undefined,
    logLevel: LogLevel = LogLevel.ERROR,
): Promise<string[]> {
    const written: string[] = [];
    if (!outputs || outputs.length === 0) {
        return written;
    }
    if (outputType !== BASE64_SOURCE) {
        printLog(
            parameterizedString(logs.infoLogs.OUTPUT_NOT_WRITTEN_FOR_OUTPUT_TYPE, String(outputType)),
            MessageType.LOG,
            logLevel,
        );
        return written;
    }
    const directory = outputDirectory && outputDirectory.trim().length > 0 ? outputDirectory : undefined;
    if (directory) {
        try {
            await fs.promises.mkdir(directory, { recursive: true });
        } catch (_e) {
            throw writeFailure(logs.errorLogs.OUTPUT_DIRECTORY_NOT_CREATED, directory, logLevel);
        }
    }
    const base = stripExtension(inputFileName);
    const used = new Set<string>();
    for (const output of outputs) {
        if (!output || !output.processedFile) {
            continue;
        }
        const name = outputFileName(base, output, used);
        const target = directory ? path.join(directory, name) : name;
        try {
            await fs.promises.writeFile(target, Buffer.from(output.processedFile, ENCODING_TYPE.BASE64));
        } catch (_e) {
            throw writeFailure(logs.errorLogs.OUTPUT_FILE_NOT_WRITTEN, target, logLevel);
        }
        printLog(parameterizedString(logs.infoLogs.OUTPUT_FILE_WRITTEN, target), MessageType.LOG, logLevel);
        written.push(target);
    }
    return written;
}
