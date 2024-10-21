//imports

import { queryResponseType } from "../../../types";

class QueryResponse {

    //fields
    fields?: Array<queryResponseType>;

    errors?: Object;

    constructor( { fields, errors }: { fields?: Array<queryResponseType>, errors?: object }) {
        this.fields = fields;
        this.errors = errors;
    }

    //getters and setters

}

export default QueryResponse;
