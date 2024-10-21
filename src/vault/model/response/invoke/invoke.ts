//imports

import { queryResponseType } from "../../../types";

class InvokeConnectionResponse {
    //fields

    errors?: Object;

    constructor( { errors }: {  errors?: object }) {
        this.errors = errors;
    }

    //getters and setters

}

export default InvokeConnectionResponse;
