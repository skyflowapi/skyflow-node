import { FileType } from "../../../types";

class DeidentifyFileRequest {
    private _file: FileType ; // Accepts a native file object (File for browser, Buffer for Node.js)

    constructor(file: FileType ) {
        this._file = file;
    }

    public getFile(): FileType  {
        return this._file;
    }

    public setFile(file: FileType ): void {
        this._file = file;
    }
}

export default DeidentifyFileRequest;