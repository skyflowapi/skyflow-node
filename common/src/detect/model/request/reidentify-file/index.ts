import { FileDataFormat, RedactionRule, ReidentifyFileSource } from "../../../types";

/** Optional fields of a {@link ReidentifyFileRequest}. */
export interface ReidentifyFileRequestFields {
    /**
     * File format. Limited to the formats that support `VAULT_TOKEN`: `TXT`,
     * `CSV`, `JSON`, `JSONL`, `XML`, `DOCX`, `XLSX` or `PPTX`.
     */
    dataFormat?: FileDataFormat;
    /** Redaction rules, as your SDK's `RedactionLevel`. Without rules every token is replaced by its original value. */
    redactionLevel?: RedactionRule[];
}

/** Request for `detect().reidentifyFile()`. Synchronous: the re-identified file comes back in the response. */
class ReidentifyFileRequest {
    private _dataSource: ReidentifyFileSource;

    private _value: string;

    private _dataFormat?: FileDataFormat;

    private _redactionLevel?: RedactionRule[];

    constructor(dataSource: ReidentifyFileSource, value: string, fields?: ReidentifyFileRequestFields) {
        this._dataSource = dataSource;
        this._value = value;
        this._dataFormat = fields?.dataFormat;
        this._redactionLevel = fields?.redactionLevel;
    }

    /** A value of your SDK's `ReidentifySourceType`: `BASE64` or `PRESIGNED_URL`. Re-identification does not accept a skyflow id. */
    get dataSource(): ReidentifyFileSource {
        return this._dataSource;
    }

    set dataSource(value: ReidentifyFileSource) {
        this._dataSource = value;
    }

    /** Base64 content or a presigned URL, per `dataSource`. */
    get value(): string {
        return this._value;
    }

    set value(value: string) {
        this._value = value;
    }

    get dataFormat(): FileDataFormat | undefined {
        return this._dataFormat;
    }

    set dataFormat(value: FileDataFormat | undefined) {
        this._dataFormat = value;
    }

    get redactionLevel(): RedactionRule[] | undefined {
        return this._redactionLevel;
    }

    set redactionLevel(value: RedactionRule[] | undefined) {
        this._redactionLevel = value;
    }
}

export default ReidentifyFileRequest;
