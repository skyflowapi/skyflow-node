//imports
import { RequestMethod } from "skyflow-common";
import { StringKeyValueMapType } from "../../../types";
import { BaseInvokeConnectionRequest } from "skyflow-common";

class InvokeConnectionRequest extends BaseInvokeConnectionRequest {
    //fields
    method: RequestMethod;
    queryParams?: StringKeyValueMapType;
    pathParams?: StringKeyValueMapType;
    body?: StringKeyValueMapType;
    headers?: StringKeyValueMapType;

    constructor(method: RequestMethod, body?: StringKeyValueMapType, headers?: StringKeyValueMapType, pathParams?: StringKeyValueMapType, queryParams?: StringKeyValueMapType) {
        super();
        this.method = method;
        this.pathParams = pathParams;
        this.queryParams = queryParams;
        this.body = body;
        this.headers = headers;
    }

    //getters and setters

}

export default InvokeConnectionRequest;
