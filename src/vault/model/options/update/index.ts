//imports
import { TokenMode } from "../../../../utils";

class UpdateOptions {

    //fields
    private returnTokens?: boolean;
    private tokenMode?: TokenMode;
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

    setTokenMode(tokenMode: TokenMode) {
        this.tokenMode = tokenMode;
    }

    getTokenMode(): TokenMode | undefined {
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