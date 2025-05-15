// Imports

class FileUploadRequest {
    private _tableName: string;
    private _skyflowId: string;
    private _columnName: string;

    // Constructor
    constructor(tableName: string, skyflowId: string, columnName: string) {
        this._tableName = tableName;
        this._skyflowId = skyflowId;
        this._columnName = columnName;
    }    

    // Getters and Setters
    public get tableName(): string {
        return this._tableName;
    }
    public set tableName(value: string) {
        this._tableName = value;
    }

    public get skyflowId(): string {
        return this._skyflowId;
    }
    public set skyflowId(value: string) {
        this._skyflowId = value;
    }

    public get columnName(): string {
        return this._columnName;
    }
    public set columnName(value: string) {
        this._columnName = value;
    }
}

export default FileUploadRequest;