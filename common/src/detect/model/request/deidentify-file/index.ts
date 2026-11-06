import { DeidentifyFileSource, DetectConfiguration, FileDataFormat, PollOptions } from "../../../types";

/**
 * Fields of a {@link DeidentifyFileRequest}. Supply the file through exactly
 * one of `value` (with a `dataSource`), `file` or `filePath`.
 */
export interface DeidentifyFileRequestFields {
    /** How `value` supplies the file: a value of your SDK's `DeidentifySourceType` (`BASE64` or `PRESIGNED_URL`; skyvault also accepts `SKYFLOW_ID`). */
    dataSource?: DeidentifyFileSource;
    /** Base64 content, a presigned URL or, on skyvault, a skyflow id, per `dataSource`. */
    value?: string;
    /** An in-memory `File`; read and base64-encoded when sent. Requires Node.js 20+. */
    file?: File;
    /** Path to a local file; read and base64-encoded when sent. */
    filePath?: string;
    /** File format. Inferred from the file name's extension when omitted for a local file. */
    dataFormat?: FileDataFormat;
    /**
     * Id of a Detect configuration created through the management API.
     * Sending it together with `configuration` is rejected by the API.
     */
    configurationId?: string;
    /**
     * Inline configuration. With neither this nor `configurationId` set, the
     * SDK sends only the vault id and the server applies the vault's defaults.
     */
    configuration?: DetectConfiguration;
    /** Poll the run after submitting. Omit to submit only and return the run id. */
    pollOptions?: PollOptions;
    /**
     * Where outputs are written on success. Requires `pollOptions` and a local
     * file (`file` or `filePath`). Defaults to the working directory.
     */
    outputDirectory?: string;
}

/** Request for `detect().deidentifyFile()`. */
class DeidentifyFileRequest {
    private _dataSource?: DeidentifyFileSource;

    private _value?: string;

    private _file?: File;

    private _filePath?: string;

    private _dataFormat?: FileDataFormat;

    private _configurationId?: string;

    private _configuration?: DetectConfiguration;

    private _pollOptions?: PollOptions;

    private _outputDirectory?: string;

    constructor(fields: DeidentifyFileRequestFields = {}) {
        this._dataSource = fields.dataSource;
        this._value = fields.value;
        this._file = fields.file;
        this._filePath = fields.filePath;
        this._dataFormat = fields.dataFormat;
        this._configurationId = fields.configurationId;
        this._configuration = fields.configuration;
        this._pollOptions = fields.pollOptions;
        this._outputDirectory = fields.outputDirectory;
    }

    get dataSource(): DeidentifyFileSource | undefined {
        return this._dataSource;
    }

    set dataSource(value: DeidentifyFileSource | undefined) {
        this._dataSource = value;
    }

    get value(): string | undefined {
        return this._value;
    }

    set value(value: string | undefined) {
        this._value = value;
    }

    get file(): File | undefined {
        return this._file;
    }

    set file(value: File | undefined) {
        this._file = value;
    }

    get filePath(): string | undefined {
        return this._filePath;
    }

    set filePath(value: string | undefined) {
        this._filePath = value;
    }

    get dataFormat(): FileDataFormat | undefined {
        return this._dataFormat;
    }

    set dataFormat(value: FileDataFormat | undefined) {
        this._dataFormat = value;
    }

    get configurationId(): string | undefined {
        return this._configurationId;
    }

    set configurationId(value: string | undefined) {
        this._configurationId = value;
    }

    get configuration(): DetectConfiguration | undefined {
        return this._configuration;
    }

    set configuration(value: DetectConfiguration | undefined) {
        this._configuration = value;
    }

    get pollOptions(): PollOptions | undefined {
        return this._pollOptions;
    }

    set pollOptions(value: PollOptions | undefined) {
        this._pollOptions = value;
    }

    get outputDirectory(): string | undefined {
        return this._outputDirectory;
    }

    set outputDirectory(value: string | undefined) {
        this._outputDirectory = value;
    }
}

export default DeidentifyFileRequest;
