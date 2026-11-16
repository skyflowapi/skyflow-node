//imports
import { DetokenizeData } from "../../../types";
import { BaseDetokenizeRequest } from "skyflow-common";

class DetokenizeRequest extends BaseDetokenizeRequest {

    //fields
    private _data: DetokenizeData[];

    // Constructor
    constructor(data: DetokenizeData[]) {
        super();
        this._data = data;
    }

    // Getter for tokens
    public get data(): DetokenizeData[] {
        return this._data;
    }

    // Setter for tokens
    public set data(value: DetokenizeData[]) {
        this._data = value;
    }

}

export default DetokenizeRequest;
