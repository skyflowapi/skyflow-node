//imports

import { RedactionType } from "skyflow-common";
import { BaseGetRequest } from "skyflow-common";

class GetRequest extends BaseGetRequest {

    //fields
    private _table: string;
    private _ids: Array<string>;

    // Constructor
    constructor(table: string, _ids: Array<string>) {
        super();
        this._table = table;
        this._ids = _ids;
    }

    // Getter for table
    public get table(): string {
        return this._table;
    }

    // Setter for table
    public set table(value: string) {
        this._table = value;
    }

    // Getter for ids
    public get ids(): Array<string> {
        return this._ids;
    }

    // Setter for ids
    public set ids(value: Array<string>) {
        this._ids = value;
    }

}

export default GetRequest;
