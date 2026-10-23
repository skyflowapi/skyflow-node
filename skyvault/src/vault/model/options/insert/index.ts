import { TokenMode } from "skyflow-common";
import { BaseOptions } from "skyflow-common";

//imports
class InsertOptions extends BaseOptions {
    // Fields
    private returnTokens?: boolean;
    private upsert?: string;
    private tokens?: Array<Record<string, unknown>>;
    private homogeneous?: boolean;
    private tokenMode?: TokenMode;
    private continueOnError?: boolean;

    // Constructor
    constructor() { super(); }

    // Setters
    setReturnTokens(returnTokens: boolean) {
        this.returnTokens = returnTokens;
    }

    setUpsertColumn(upsert: string) {
        this.upsert = upsert;
    }

    setTokens(tokens: Array<Record<string, unknown>>) {
        this.tokens = tokens;
    }

    setHomogeneous(homogeneous: boolean) {
        this.homogeneous = homogeneous;
    }

    setTokenMode(tokenMode: TokenMode) {
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

    getTokens(): Array<Record<string, unknown>> | undefined {
        return this.tokens;
    }

    getHomogeneous(): boolean | undefined {
        return this.homogeneous;
    }

    getTokenMode(): TokenMode | undefined {
        return this.tokenMode;
    }

    getContinueOnError(): boolean | undefined {
        return this.continueOnError;
    }
}

export default InsertOptions;
