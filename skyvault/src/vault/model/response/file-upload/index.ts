//imports

import { SkyflowRecordError } from "skyflow-common";
import { BaseFileUploadResponse } from "skyflow-common";

class FileUploadResponse extends BaseFileUploadResponse {

    //fields
    skyflowId: string;

    errors: Array<SkyflowRecordError> | null;

    constructor({ skyflowId, errors }: { skyflowId: string, errors: Array<SkyflowRecordError> | null }) {
        super();
        this.skyflowId = skyflowId;
        this.errors = errors;
    }

    //getters and setters

}

export default FileUploadResponse;
