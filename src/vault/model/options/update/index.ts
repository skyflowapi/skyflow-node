//imports
import { TokenMode } from "../../../../utils";

class UpdateOptions {

    //fields
    private returnTokens?: boolean;
    private tokenMode?: TokenMode;
    private tokens?: Record<string, unknown>;

    // Constructor
    constructor() {
    }

    setReturnTokens(returnTokens: boolean) {
        this.returnTokens = returnTokens;
    }

    setTokens(tokens: Record<string, unknown>) {
        this.tokens = tokens;
    }

    setTokenMode(tokenMode: TokenMode) {
        this.tokenMode = tokenMode;
    }

    getTokenMode(): TokenMode | undefined {
        return this.tokenMode;
    }

    getTokens(): Record<string, unknown> | undefined {
        return this.tokens;
    }

    getReturnTokens(): boolean | undefined {
        return this.returnTokens;
    }

}

export default UpdateOptions;
