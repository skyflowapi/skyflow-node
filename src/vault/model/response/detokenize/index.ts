//imports

import { SkyflowRecordError } from "../../../../utils";
import { ErrorDetokenizeResponse, SuccessDetokenizeResponse } from "../../../types";

class DetokenizeResponse {

    //fields
    detokenizedFields: Array<SuccessDetokenizeResponse> | null;

    errors: Array<SkyflowRecordError> | null;

    constructor({ detokenizedFields, errors }: { detokenizedFields: Array<SuccessDetokenizeResponse> | null, errors: Array<SkyflowRecordError> | null }) {
        this.detokenizedFields = detokenizedFields;
        this.errors = errors;
    }

    //getters and setters

}

export default DetokenizeResponse;
