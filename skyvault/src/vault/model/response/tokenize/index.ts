//imports

import { SkyflowRecordError } from "skyflow-common";
import { BaseTokenizeResponse } from "skyflow-common";

class TokenizeResponse extends BaseTokenizeResponse {

    //fields
    tokens: Array<string>;

    errors: Array<SkyflowRecordError> | null;

    constructor({ tokens, errors }: { tokens: Array<string>, errors: Array<SkyflowRecordError> | null }) {
        super();
        this.tokens = tokens;
        this.errors = errors;
    }

    //getters and setters

}

export default TokenizeResponse;
