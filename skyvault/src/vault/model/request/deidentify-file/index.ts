import { FileInput } from "../../../types";

class DeidentifyFileRequest {
    private _file: FileInput ; // Accepts a native file object (File for browser, Buffer for Node.js)

    constructor(file: FileInput ) {
        this._file = file;
    }

    public getFile(): FileInput  {
        return this._file;
    }

    public setFile(file: FileInput ): void {
        this._file = file;
    }
}

export default DeidentifyFileRequest;