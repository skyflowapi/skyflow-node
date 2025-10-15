//imports

import { SkyflowRecordError } from "../../../../utils";

class FileUploadResponse {

    //fields
    skyflowId: string;

    errors: Array<SkyflowRecordError> | null;

    constructor({ skyflowId, errors }: { skyflowId: string, errors: Array<SkyflowRecordError> | null }) {
        this.skyflowId = skyflowId;
        this.errors = errors;
    }

    //getters and setters

}

export default FileUploadResponse;
