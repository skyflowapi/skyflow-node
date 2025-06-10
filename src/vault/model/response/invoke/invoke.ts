//imports

import { SkyflowRecordError } from "../../../../utils";
import { QueryResponseType } from "../../../types";

class InvokeConnectionResponse {
    //fields
    data?: Object;

    metadata?: Record<string, unknown>;

    errors: Array<SkyflowRecordError> | null;

    constructor({ data, metadata, errors }: { data?: object, metadata?: Record<string, unknown>, errors: Array<SkyflowRecordError> | null }) {
        this.data = data;
        this.metadata = metadata;
        this.errors = errors;
    }

    //getters and setters

}

export default InvokeConnectionResponse;
