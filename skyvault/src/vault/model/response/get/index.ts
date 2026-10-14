//imports

import { SkyflowRecordError } from "skyflow-common";
import { GetResponseData } from "../../../types";
import { BaseGetResponse } from "skyflow-common";

class GetResponse extends BaseGetResponse {

    //fields
    data: Array<GetResponseData>;

    errors: Array<SkyflowRecordError> | null;

    constructor({ data, errors }: { data: Array<GetResponseData>, errors: Array<SkyflowRecordError> | null}) {
        super();
        this.data = data;
        this.errors = errors;
    }

    //getters and setters

}

export default GetResponse;
