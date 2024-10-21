//imports

class DeleteRequest {
    //fields
    private _tableName: string;
    private _deleteIds: Array<string>;

    // Constructor
    constructor(tableName: string, deleteIds: Array<string>) {
        this._tableName = tableName;
        this._deleteIds = deleteIds;
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
    public get deleteIds(): Array<string> {
        return this._deleteIds;
    }

    // Setter for deleteData
    public set deleteIds(value: Array<string>) {
        this._deleteIds = value;
    }

}

export default DeleteRequest;
