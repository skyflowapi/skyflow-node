// Imports

class FileUploadRequest {
    private _table: string;
    private _columnName: string;

    // Constructor
    constructor(table: string, columnName: string) {
        this._table = table;
        this._columnName = columnName;
    }

    // Getters and Setters
    public get table(): string {
        return this._table;
    }
    public set table(value: string) {
        this._table = value;
    }

    public get columnName(): string {
        return this._columnName;
    }
    public set columnName(value: string) {
        this._columnName = value;
    }
}

export default FileUploadRequest;