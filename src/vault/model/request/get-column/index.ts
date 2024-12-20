//imports

class GetColumnRequest {

    //fields
    private _tableName: string;
    private _columnName: string;
    private _columnValues: Array<string>;

    // Constructor
    constructor(tableName: string, _columnName: string, _columnValues: Array<string>) {
        this._tableName = tableName;
        this._columnName = _columnName;
        this._columnValues = _columnValues;
    }

    // Getter for tableName
    public get tableName(): string {
        return this._tableName;
    }

    // Setter for tableName
    public set tableName(value: string) {
        this._tableName = value;
    }

    // Getter for columnName
    public get columnName(): string {
        return this._columnName;
    }

    // Setter for columnName
    public set columnName(value: string) {
        this._columnName = value;
    }

    // Getter for columnValues
    public get columnValues(): Array<string> {
        return this._columnValues;
    }

    // Setter for columnValues
    public set columnValues(value: Array<string>) {
        this._columnValues = value;
    }
}

export default GetColumnRequest;
