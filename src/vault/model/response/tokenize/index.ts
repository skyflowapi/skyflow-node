//imports

import { SkyflowRecordError } from "../../../../utils";

class TokenizeResponse {

    //fields
    tokens: Array<string>;

    errors: Array<SkyflowRecordError> | null;

    constructor({ tokens, errors }: { tokens: Array<string>, errors: Array<SkyflowRecordError> | null }) {
        this.tokens = tokens;
        this.errors = errors;
    }

    //getters and setters

}

export default TokenizeResponse;
