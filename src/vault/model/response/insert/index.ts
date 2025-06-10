//imports
import { SkyflowRecordError } from "../../../../utils";
import { InsertResponseType } from "../../../types";

class InsertResponse {

    //fields
    insertedFields: Array<InsertResponseType> | null;

    errors: Array<SkyflowRecordError> | null;

    constructor({ insertedFields, errors }: { insertedFields: Array<InsertResponseType> | null, errors: Array<SkyflowRecordError> | null }) {
        this.insertedFields = insertedFields;  
        this.errors = errors;
    }

    //getters and setters

}

export default InsertResponse;
