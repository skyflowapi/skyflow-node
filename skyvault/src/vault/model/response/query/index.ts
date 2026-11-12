//imports

import { SkyflowRecordError } from "skyflow-common";
import { QueryResponseType } from "../../../types";
import { BaseQueryResponse } from "skyflow-common";

class QueryResponse extends BaseQueryResponse {

    //fields
    fields: Array<QueryResponseType>;

    errors: Array<SkyflowRecordError> | null;

    constructor( { fields, errors }: { fields: Array<QueryResponseType>, errors: Array<SkyflowRecordError> | null }) {
        super();
        this.fields = fields;
        this.errors = errors;
    }

    //getters and setters

}

export default QueryResponse;
