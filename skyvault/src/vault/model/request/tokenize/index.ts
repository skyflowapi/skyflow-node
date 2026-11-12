//imports

import { TokenizeRequestType } from "../../../types";
import { BaseTokenizeRequest } from "skyflow-common";

class TokenizeRequest extends BaseTokenizeRequest {

    //fields
    private _values: Array<TokenizeRequestType>;

    // Constructor
    constructor(values: Array<TokenizeRequestType>) {
        super();
        this._values = values;
    }

    // Getter for _values
    public get values(): Array<TokenizeRequestType> {
        return this._values;
    }

    // Setter for _values
    public set values(value: Array<TokenizeRequestType>) {
        this._values = value;
    }

}

export default TokenizeRequest;
