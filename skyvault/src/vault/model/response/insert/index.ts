//imports
import { SkyflowRecordError } from "skyflow-common";
import { InsertResponseType } from "../../../types";
import { BaseInsertResponse } from "skyflow-common";

class InsertResponse extends BaseInsertResponse {

    //fields
    insertedFields: Array<InsertResponseType>;

    errors: Array<SkyflowRecordError> | null;

    /**
     * @deprecated Passing null for insertedFields is no longer supported. Pass empty array [] instead.
     */
    constructor({ insertedFields, errors }: { insertedFields: Array<InsertResponseType>, errors: Array<SkyflowRecordError> | null }) {
        super();
        this.insertedFields = insertedFields;
        this.errors = errors;
    }

    //getters and setters

}

export default InsertResponse;
