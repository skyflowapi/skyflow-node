import { BYOT } from "../../../../utils";

//imports
class InsertOptions {
    // Fields
    private returnTokens?: boolean;
    private upsert?: string;
    private tokens?: Array<object>;
    private homogeneous?: boolean;
    private tokenMode?: BYOT;
    private continueOnError?: boolean;

    // Constructor
    constructor() { }

    // Setters
    setReturnTokens(returnTokens: boolean) {
        this.returnTokens = returnTokens;
    }

    setUpsertColumn(upsert: string) {
        this.upsert = upsert;
    }

    setTokens(tokens: Array<object>) {
        this.tokens = tokens;
    }

    setHomogeneous(homogeneous: boolean) {
        this.homogeneous = homogeneous;
    }

    setTokenMode(tokenMode: BYOT) {
        this.tokenMode = tokenMode;
    }

    setContinueOnError(continueOnError: boolean) {
        this.continueOnError = continueOnError;
    }

    // Getters
    getReturnTokens(): boolean | undefined {
        return this.returnTokens;
    }

    getUpsertColumn(): string | undefined {
        return this.upsert;
    }

    getTokens(): Array<object> | undefined {
        return this.tokens;
    }

    getHomogeneous(): boolean | undefined {
        return this.homogeneous;
    }

    getTokenMode(): BYOT | undefined {
        return this.tokenMode;
    }

    getContinueOnError(): boolean | undefined {
        return this.continueOnError;
    }
}

export default InsertOptions;
