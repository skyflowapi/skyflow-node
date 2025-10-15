//imports

import { SkyflowRecordError } from "../../../../utils";
import { GetResponseData } from "../../../types";

class GetResponse {

    //fields
    data: Array<GetResponseData>;

    errors: Array<SkyflowRecordError> | null;

    constructor({ data, errors }: { data: Array<GetResponseData>, errors: Array<SkyflowRecordError> | null}) {
        this.data = data;
        this.errors = errors;
    }

    //getters and setters

}

export default GetResponse;
