//imports

class InsertRequest {

    //fields
    private _tableName: string;
    private _data: Record<string, unknown>[];

    // Constructor
    constructor(tableName: string, data: Record<string, unknown>[]) {
        this._tableName = tableName;
        this._data = data;
    }

    // Getter for tableName
    public get tableName(): string {
        return this._tableName;
    }

    // Setter for tableName
    public set tableName(value: string) {
        this._tableName = value;
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
