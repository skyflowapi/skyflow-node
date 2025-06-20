class DeidentifyFileRequest {
    private _file: File ; // Accepts a native file object (File for browser, Buffer for Node.js)

    constructor(file: File ) {
        this._file = file;
    }

    public getFile(): File  {
        return this._file;
    }

    public setFile(file: File ): void {
        this._file = file;
    }
}

export default DeidentifyFileRequest;