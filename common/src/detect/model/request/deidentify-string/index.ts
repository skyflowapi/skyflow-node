import { DetectConfiguration } from "../../../types";

/** Optional fields of a {@link DeidentifyStringRequest}. */
export interface DeidentifyStringRequestFields {
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
}

/** Request for `detect().deidentifyString()`. */
class DeidentifyStringRequest {
    private _text: string;

    private _configurationId?: string;

    private _configuration?: DetectConfiguration;

    constructor(text: string, fields?: DeidentifyStringRequestFields) {
        this._text = text;
        this._configurationId = fields?.configurationId;
        this._configuration = fields?.configuration;
    }

    /** Text to de-identify. */
    get text(): string {
        return this._text;
    }

    set text(value: string) {
        this._text = value;
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
}

export default DeidentifyStringRequest;
