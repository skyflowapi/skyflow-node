//imports

import { tokenizeRequestType } from "../../../types";

class TokenizeRequest {

    //fields
    private _values: Array<tokenizeRequestType>;

    // Constructor
    constructor(values: Array<tokenizeRequestType>) {
        this._values = values;
    }

    // Getter for _values
    public get values(): Array<tokenizeRequestType> {
        return this._values;
    }

    // Setter for _values
    public set values(value: Array<tokenizeRequestType>) {
        this._values = value;
    }

}

export default TokenizeRequest;
