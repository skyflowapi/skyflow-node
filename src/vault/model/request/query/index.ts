
class QueryRequest {
    private _query: string;

    constructor(query: string) {
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