//imports

import { ErrorDetokenizeResponse, SuccessDetokenizeResponse } from "../../../types";

class DetokenizeResponse {

    //fields
    detokenizedFields?: Array<SuccessDetokenizeResponse>;

    errors?: Array<ErrorDetokenizeResponse>;

    constructor({ detokenizedFields, errors }: { detokenizedFields?: Array<SuccessDetokenizeResponse>, errors?: Array<ErrorDetokenizeResponse> }) {
        this.detokenizedFields = detokenizedFields;
        this.errors = errors;
    }

    //getters and setters

}

export default DetokenizeResponse;
