//imports

class FileUploadRequest {

    //fields
    private _tableName: string;
    private _skyflowId: string;
    private _columnName: string;
    private _filePath: string;

    // Constructor
    constructor(tableName: string, skyflowId: string, columnName: string, filePath: string) {
        this._tableName = tableName;
        this._skyflowId = skyflowId;
        this._columnName = columnName;
        this._filePath = filePath;
    }

    // Getter for tableName
    public get tableName(): string {
        return this._tableName;
    }

    // Setter for tableName
    public set tableName(value: string) {
        this._tableName = value;
    }

    // Getter for skyflowId
    public get skyflowId(): string {
        return this._skyflowId;
    }

    // Setter for skyflowId
    public set skyflowId(value: string) {
        this._skyflowId = value;
    }

    // Getter for columnName
    public get columnName(): string {
        return this._columnName;
    }

    // Setter for columnName
    public set columnName(value: string) {
        this._columnName = value;
    }

    // Getter for filePath
    public get filePath(): string {
        return this._filePath;
    }

    // Setter for filePath
    public set filePath(value: string) {
        this._filePath = value;
    }
}

export default FileUploadRequest;
