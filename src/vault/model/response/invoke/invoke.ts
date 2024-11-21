//imports

import { queryResponseType } from "../../../types";

class InvokeConnectionResponse {
    //fields
    data?: Object;

    metadata?: Object;

    errors?: Object;

    constructor({ data, metadata, errors }: { data?: object, metadata?: Object, errors?: object }) {
        this.data = data;
        this.metadata = metadata;
        this.errors = errors;
    }

    //getters and setters

}

export default InvokeConnectionResponse;
