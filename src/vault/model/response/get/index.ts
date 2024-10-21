//imports

import { insertResponseType } from "../../../types";

class GetResponse {

    //fields
    data?: Array<insertResponseType>;

    errors?: object;

    constructor({ data, errors }: { data?: Array<insertResponseType>, errors?: object }) {
        this.data = data;
        this.errors = errors;
    }

    //getters and setters

}

export default GetResponse;
