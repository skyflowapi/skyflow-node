// Imports

class FileUploadRequest {
    private _tableName: string;
    private _skyflowId: string;
    private _columnName: string;
    private _filePath?: string;
    private _base64?: string;
    private _fileObject?: File;
    private _fileName?: string;

    // Constructor
    constructor(tableName: string, skyflowId: string, columnName: string, filePath?: string, base64?: string, fileObject?: File, fileName?: string) {
        this._tableName = tableName;
        this._skyflowId = skyflowId;
        this._columnName = columnName;
        this._filePath = filePath;
        this._base64 = base64;
        this._fileObject = fileObject;
        this._fileName = fileName;
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

    public get filePath(): string | undefined {
        return this._filePath;
    }
    public set filePath(value: string | undefined) {
        this._filePath = value;
    }

    public get base64(): string | undefined {
        return this._base64;
    }
    public set base64(value: string | undefined) {
        this._base64 = value;
    }

    public get fileObject(): File | undefined {
        return this._fileObject;
    }
    public set fileObject(value: File | undefined) {
        this._fileObject = value;
    }

    public get fileName(): string | undefined {
        return this._fileName;
    }
    public set fileName(value: string | undefined) {
        this._fileName = value;
    }
}

export default FileUploadRequest;
