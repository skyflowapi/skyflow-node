//imports
import { SkyflowRecordError } from "../../../../utils";
import { InsertResponseType } from "../../../types";

class InsertResponse {

    //fields
    insertedFields: Array<InsertResponseType>;

    errors: Array<SkyflowRecordError> | null;

    /**
     * @deprecated Passing null for insertedFields is no longer supported. Pass empty array [] instead.
     */
    constructor({ insertedFields, errors }: { insertedFields: Array<InsertResponseType>, errors: Array<SkyflowRecordError> | null }) {
        this.insertedFields = insertedFields;  
        this.errors = errors;
    }

    //getters and setters

}

export default InsertResponse;
