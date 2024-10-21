//imports

import { insertResponseType } from "../../../types";

class UpdateResponse {

    //fields
    updatedField?: Array<insertResponseType>;

    errors?: object;

    constructor({ updatedField, errors }: { updatedField?: Array<insertResponseType>, errors?: object }) {
        this.updatedField = updatedField;  
        this.errors = errors;
    }

    //getters and setters

}

export default UpdateResponse;
