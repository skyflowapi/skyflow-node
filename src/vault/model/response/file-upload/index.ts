//imports

class FileUploadResponse {

    //fields
    skyflowID?: string;

    errors?: Object;

    constructor({ skyflowID, errors }: { skyflowID?: string, errors?: object }) {
        this.skyflowID = skyflowID;
        this.errors = errors;
    }

    //getters and setters

}

export default FileUploadResponse;
