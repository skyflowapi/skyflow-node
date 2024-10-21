//imports
import { BYOT } from "../../../../utils";

class UpdateOptions {

    //fields
    private returnTokens?: boolean;
    private tokenMode?: BYOT;

    // Constructor
    constructor() {
    }

    setReturnTokens(returnTokens: boolean) {
        this.returnTokens = returnTokens;
    }

    setTokenMode(tokenMode: BYOT) {
        this.tokenMode = tokenMode;
    }

    getTokenMode(): BYOT | undefined {
        return this.tokenMode;
    }

    getReturnTokens(): boolean | undefined {
        return this.returnTokens;
    }

}

export default UpdateOptions;
