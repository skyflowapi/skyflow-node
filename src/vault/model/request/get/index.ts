//imports

import { RedactionType } from "../../../../utils";

class GetRequest {

    //fields
    private _table: string;
    private _ids: Array<string>;

    // Constructor
    constructor(table: string, _ids: Array<string>) {
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
