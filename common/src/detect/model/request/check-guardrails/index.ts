/** Optional fields of a {@link CheckGuardrailsRequest}. */
export interface CheckGuardrailsRequestFields {
    /** Whether to check for toxicity. Sent only when set. */
    checkToxicity?: boolean;
    /** Topics to deny. Sent only when set. */
    denyTopics?: string[];
}

/** Request for `detect().checkGuardrails()`. */
class CheckGuardrailsRequest {
    private _text: string;

    private _checkToxicity?: boolean;

    private _denyTopics?: string[];

    constructor(text: string, fields?: CheckGuardrailsRequestFields) {
        this._text = text;
        this._checkToxicity = fields?.checkToxicity;
        this._denyTopics = fields?.denyTopics;
    }

    /** Text to screen. */
    get text(): string {
        return this._text;
    }

    set text(value: string) {
        this._text = value;
    }

    get checkToxicity(): boolean | undefined {
        return this._checkToxicity;
    }

    set checkToxicity(value: boolean | undefined) {
        this._checkToxicity = value;
    }

    get denyTopics(): string[] | undefined {
        return this._denyTopics;
    }

    set denyTopics(value: string[] | undefined) {
        this._denyTopics = value;
    }
}

export default CheckGuardrailsRequest;
