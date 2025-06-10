//imports

import { SkyflowRecordError } from "../../../../utils";
import { QueryResponseType } from "../../../types";

class QueryResponse {

    //fields
    fields: Array<QueryResponseType>;

    errors: Array<SkyflowRecordError> | null;

    constructor( { fields, errors }: { fields: Array<QueryResponseType>, errors: Array<SkyflowRecordError> | null }) {
        this.fields = fields;
        this.errors = errors;
    }

    //getters and setters

}

export default QueryResponse;
