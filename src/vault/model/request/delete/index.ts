//imports

class DeleteRequest {
    //fields
    private _tableName: string;
    private _ids: Array<string>;

    // Constructor
    constructor(tableName: string, deleteIds: Array<string>) {
        this._tableName = tableName;
        this._ids = deleteIds;
    }

    // Getter for tableName
    public get tableName(): string {
        return this._tableName;
    }

    // Setter for tableName
    public set tableName(value: string) {
        this._tableName = value;
    }

    // Getter for deleteData
    public get ids(): Array<string> {
        return this._ids;
    }

    // Setter for deleteData
    public set ids(value: Array<string>) {
        this._ids = value;
    }

}

export default DeleteRequest;
