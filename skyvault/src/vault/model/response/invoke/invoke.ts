//imports

import { SkyflowRecordError } from "skyflow-common";
import { BaseInvokeConnectionResponse } from "skyflow-common";

class InvokeConnectionResponse extends BaseInvokeConnectionResponse {
    //fields
    data?: Object;

    metadata?: Record<string, unknown>;

    errors: Array<SkyflowRecordError> | null;

    constructor({ data, metadata, errors }: { data?: object, metadata?: Record<string, unknown>, errors: Array<SkyflowRecordError> | null }) {
        super();
        this.data = data;
        this.metadata = metadata;
        this.errors = errors;
    }

    //getters and setters

}

export default InvokeConnectionResponse;
