//imports
import { Method } from "../../../../utils";
import { StringKeyValueMapType } from "../../../types";

class InvokeConnectionRequest {
    //fields
    method: Method;
    queryParams?: StringKeyValueMapType;
    pathParams?: StringKeyValueMapType;
    body?: StringKeyValueMapType;
    headers?: StringKeyValueMapType;

    constructor(method: Method, body?: StringKeyValueMapType, headers?: StringKeyValueMapType, pathParams?: StringKeyValueMapType, queryParams?: StringKeyValueMapType) {
        this.method = method;
        this.pathParams = pathParams;
        this.queryParams = queryParams;
        this.body = body;
        this.headers = headers;
    }

    //getters and setters

}

export default InvokeConnectionRequest;
