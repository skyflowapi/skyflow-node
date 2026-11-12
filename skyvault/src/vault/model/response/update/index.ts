//imports

import { SkyflowRecordError } from "skyflow-common";
import { InsertResponseType } from "../../../types";
import { BaseUpdateResponse } from "skyflow-common";

class UpdateResponse extends BaseUpdateResponse {

    //fields
    updatedField: InsertResponseType;

    errors: Array<SkyflowRecordError> | null;

    constructor({ updatedField, errors }: { updatedField: InsertResponseType, errors: Array<SkyflowRecordError> | null }) {
        super();
        this.updatedField = updatedField;
        this.errors = errors;
    }

    //getters and setters

}

export default UpdateResponse;
