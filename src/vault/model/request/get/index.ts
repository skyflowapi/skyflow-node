//imports

import { RedactionType } from "../../../../utils";

class GetRequest {

    //fields
    private _tableName: string;
    private _ids: Array<string>;

    // Constructor
    constructor(tableName: string, _ids: Array<string>) {
        this._tableName = tableName;
        this._ids = _ids;
    }

    // Getter for tableName
    public get tableName(): string {
        return this._tableName;
    }

    // Setter for tableName
    public set tableName(value: string) {
        this._tableName = value;
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
