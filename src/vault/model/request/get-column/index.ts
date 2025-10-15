//imports

class GetColumnRequest {

    //fields
    private _table: string;
    private _columnName: string;
    private _columnValues: Array<string>;

    // Constructor
    constructor(table: string, _columnName: string, _columnValues: Array<string>) {
        this._table = table;
        this._columnName = _columnName;
        this._columnValues = _columnValues;
    }

    // Getter for table
    public get table(): string {
        return this._table;
    }

    // Setter for table
    public set table(value: string) {
        this._table = value;
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
