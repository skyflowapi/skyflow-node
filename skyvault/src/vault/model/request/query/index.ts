import { BaseQueryRequest } from "skyflow-common";

class QueryRequest extends BaseQueryRequest {
    private _query: string;

    constructor(query: string) {
        super();
        this._query = query;
    }

    // Getter for query
    public get query(): string {
        return this._query;
    }

    // Setter for query
    public set query(value: string) {
        this._query = value;
    }
}

export default QueryRequest;