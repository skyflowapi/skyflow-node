//imports
import { BYOT } from "../../../../utils";

class UpdateOptions {

    //fields
    private returnTokens?: boolean;
    private tokenMode?: BYOT;
    private tokens?: object;

    // Constructor
    constructor() {
    }

    setReturnTokens(returnTokens: boolean) {
        this.returnTokens = returnTokens;
    }

    setTokens(tokens: object) {
        this.tokens = tokens;
    }

    setTokenMode(tokenMode: BYOT) {
        this.tokenMode = tokenMode;
    }

    getTokenMode(): BYOT | undefined {
        return this.tokenMode;
    }

    getTokens(): object | undefined {
        return this.tokens;
    }

    getReturnTokens(): boolean | undefined {
        return this.returnTokens;
    }

}

export default UpdateOptions;
