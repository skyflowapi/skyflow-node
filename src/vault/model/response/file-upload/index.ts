//imports

class FileUploadResponse {

    //fields
    skyflowId?: string;

    errors?: Object;

    constructor({ skyflowId, errors }: { skyflowId?: string, errors?: object }) {
        this.skyflowId = skyflowId;
        this.errors = errors;
    }

    //getters and setters

}

export default FileUploadResponse;
