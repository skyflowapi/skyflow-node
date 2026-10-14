import { BaseQueryRequest } from 'skyflow-common';

/** Request to run a SQL-like query against a vault. */
class QueryRequest extends BaseQueryRequest {
  private _query: string;

  constructor(query: string) {
    super();
    this._query = query;
  }

  public get query(): string {
    return this._query;
  }

  public set query(value: string) {
    this._query = value;
  }
}

export default QueryRequest;
