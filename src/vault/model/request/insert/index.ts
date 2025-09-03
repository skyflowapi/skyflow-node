//imports

class InsertRequest {

    //fields
    private _table: string;
    private _data: Record<string, unknown>[];

    // Constructor
    constructor(table: string, data: Record<string, unknown>[]) {
        this._table = table;
        this._data = data;
    }

    // Getter for table
    public get table(): string {
        return this._table;
    }

    // Setter for table
    public set table(value: string) {
        this._table = value;
    }

    // Getter for _data
    public get data(): Record<string, unknown>[] {
        return this._data;
    }

    // Setter for _data
    public set data(data: Record<string, unknown>[]) {
        this._data = data;
    }

}

export default InsertRequest;
