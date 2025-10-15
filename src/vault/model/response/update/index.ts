//imports

import { SkyflowRecordError } from "../../../../utils";
import { InsertResponseType } from "../../../types";

class UpdateResponse {

    //fields
    updatedField: InsertResponseType;

    errors: Array<SkyflowRecordError> | null;

    constructor({ updatedField, errors }: { updatedField: InsertResponseType, errors: Array<SkyflowRecordError> | null }) {
        this.updatedField = updatedField;  
        this.errors = errors;
    }

    //getters and setters

}

export default UpdateResponse;
