//imports

class UpdateRequest {

    //fields
    private _tableName: string;
    private _data: object;

    // Constructor
    constructor(tableName: string, data: object) {
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

    // Getter for updateData
    public get data(): object {
        return this._data;
    }

    // Setter for updateData
    public set data(value: object) {
        this._data = value;
    }

}

export default UpdateRequest;
