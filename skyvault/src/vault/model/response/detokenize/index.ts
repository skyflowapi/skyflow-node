//imports

import { SkyflowRecordError } from "skyflow-common";
import { ErrorDetokenizeResponse, SuccessDetokenizeResponse } from "../../../types";
import { BaseDetokenizeResponse } from "skyflow-common";

class DetokenizeResponse extends BaseDetokenizeResponse {

    //fields
    detokenizedFields: Array<SuccessDetokenizeResponse> | null;

    errors: Array<SkyflowRecordError> | null;

    constructor({ detokenizedFields, errors }: { detokenizedFields: Array<SuccessDetokenizeResponse> | null, errors: Array<SkyflowRecordError> | null }) {
        super();
        this.detokenizedFields = detokenizedFields;
        this.errors = errors;
    }

    //getters and setters

}

export default DetokenizeResponse;
