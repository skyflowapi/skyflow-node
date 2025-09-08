//imports

class DeleteRequest {
    //fields
    private _table: string;
    private _ids: Array<string>;

    // Constructor
    constructor(table: string, deleteIds: Array<string>) {
        this._table = table;
        this._ids = deleteIds;
    }

    // Getter for table
    public get table(): string {
        return this._table;
    }

    // Setter for table
    public set table(value: string) {
        this._table = value;
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
