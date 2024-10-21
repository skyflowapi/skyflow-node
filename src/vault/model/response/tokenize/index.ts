//imports

class TokenizeResponse {

    //fields
    tokens?: Array<string>;

    errors?: Object;

    constructor({ tokens, errors }: { tokens?: Array<string>, errors?: object }) {
        this.tokens = tokens;
        this.errors = errors;
    }

    //getters and setters

}

export default TokenizeResponse;
