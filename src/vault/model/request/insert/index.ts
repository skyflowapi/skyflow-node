//imports

class InsertRequest {

    //fields
    private _tableName: string;
    private _data: object[];

    // Constructor
    constructor(tableName: string, data: object[]) {
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
    public get data(): object[] {
        return this._data;
    }

    // Setter for _data
    public set data(data: object[]) {
        this._data = data;
    }

}

export default InsertRequest;
