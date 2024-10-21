//imports
import { METHOD } from "../../../../utils";
import { StringKeyValueMapType } from "../../../types";

class InvokeConnectionRequest {
    //fields
    url: string;
    method?: METHOD;
    queryParams?: StringKeyValueMapType;
    pathParams?: StringKeyValueMapType;
    body?: StringKeyValueMapType;
    headers?: StringKeyValueMapType;

    constructor({ url, method, pathParams, queryParams, body, headers }: { url:string, method?: METHOD, pathParams?: StringKeyValueMapType, queryParams?: StringKeyValueMapType, headers: StringKeyValueMapType, body?: StringKeyValueMapType }) {
        this.url = url;
        this.method = method;
        this.pathParams = pathParams;
        this.queryParams = queryParams;
        this.body = body;
        this.headers = headers;
    }

    //getters and setters

}

export default InvokeConnectionRequest;
