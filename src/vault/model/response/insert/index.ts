//imports
import { insertResponseType } from "../../../types";

class InsertResponse {

    //fields
    insertedFields?: Array<insertResponseType>;

    errors?: object;

    constructor({ insertedFields, errors }: { insertedFields?: Array<insertResponseType>, errors?: object }) {
        this.insertedFields = insertedFields;  
        this.errors = errors;
    }

    //getters and setters

}

export default InsertResponse;
