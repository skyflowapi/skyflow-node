import { BYOT } from "../../../../utils";

//imports
class InsertOptions {
    // Fields
    private returnTokens?: boolean;
    private upsert?: string;
    private tokens?: Array<string>;
    private homogeneous?: boolean;
    private tokenMode?: BYOT;
    private tokenStrict?: boolean;
    private continueOnError?: boolean;

    // Constructor
    constructor() { }

    // Setters
    setReturnTokens(returnTokens: boolean) {
        this.returnTokens = returnTokens;
    }

    setUpsert(upsert: string) {
        this.upsert = upsert;
    }

    setTokens(tokens: Array<string>) {
        this.tokens = tokens;
    }

    setHomogeneous(homogeneous: boolean) {
        this.homogeneous = homogeneous;
    }

    setTokenMode(tokenMode: BYOT) {
        this.tokenMode = tokenMode;
    }

    setTokenStrict(tokenStrict: boolean) {
        this.tokenStrict = tokenStrict;
    }

    setContinueOnError(continueOnError: boolean) {
        this.continueOnError = continueOnError;
    }

    // Getters
    getReturnTokens(): boolean | undefined {
        return this.returnTokens;
    }

    getUpsert(): string | undefined {
        return this.upsert;
    }

    getTokens(): Array<string> | undefined {
        return this.tokens;
    }

    getHomogeneous(): boolean | undefined {
        return this.homogeneous;
    }

    getTokenMode(): BYOT | undefined {
        return this.tokenMode;
    }

    getTokenStrict(): boolean | undefined {
        return this.tokenStrict;
    }

    getContinueOnError(): boolean | undefined {
        return this.continueOnError;
    }
}

export default InsertOptions;
