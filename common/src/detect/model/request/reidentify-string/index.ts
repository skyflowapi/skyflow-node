import { RedactionRule } from "../../../types";

/** Optional fields of a {@link ReidentifyStringRequest}. */
export interface ReidentifyStringRequestFields {
    /** Redaction rules, as your SDK's `RedactionLevel`. Without rules every token is replaced by its original value. */
    redactionLevel?: RedactionRule[];
}

/** Request for `detect().reidentifyString()`. */
class ReidentifyStringRequest {
    private _text: string;

    private _redactionLevel?: RedactionRule[];

    constructor(text: string, fields?: ReidentifyStringRequestFields) {
        this._text = text;
        this._redactionLevel = fields?.redactionLevel;
    }

    /** The de-identified text to re-identify. */
    get text(): string {
        return this._text;
    }

    set text(value: string) {
        this._text = value;
    }

    get redactionLevel(): RedactionRule[] | undefined {
        return this._redactionLevel;
    }

    set redactionLevel(value: RedactionRule[] | undefined) {
        this._redactionLevel = value;
    }
}

export default ReidentifyStringRequest;
