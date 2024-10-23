//imports

import { RedactionType } from "../../../../utils";

class DetokenizeRequest {

    //fields
    private _tokens: Array<string>;
    private _redactionType?: RedactionType;

    // Constructor
    constructor(tokens: Array<string>, redactionType?: RedactionType) {
        this._tokens = tokens;
        this._redactionType = redactionType;
    }

    // Getter for redactionType
    public get redactionType(): RedactionType | undefined {
        return this._redactionType;
    }

    // Setter for redactionType
    public set redactionType(value: RedactionType) {
        this._redactionType = value;
    }

    // Getter for tokens
    public get tokens(): Array<string> {
        return this._tokens;
    }

    // Setter for tokens
    public set tokens(value: Array<string>) {
        this._tokens = value;
    }

}

export default DetokenizeRequest;
