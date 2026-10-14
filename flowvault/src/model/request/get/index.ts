import { BaseGetRequest } from 'skyflow-common';

/** A single table/ids entry for a multi-table get request. */
export interface GetRecord {
  tableName: string;
  ids: string[];
}

/** Request to fetch records by Skyflow ID, optionally across tables. */
class GetRequest extends BaseGetRequest {
  private _table: string;
  private _ids: string[];
  private _records?: GetRecord[];

  constructor(table: string, ids: string[], records?: GetRecord[]) {
    super();
    this._table = table;
    this._ids = ids;
    this._records = records;
  }

  public get table(): string {
    return this._table;
  }

  public set table(value: string) {
    this._table = value;
  }

  public get ids(): string[] {
    return this._ids;
  }

  public set ids(value: string[]) {
    this._ids = value;
  }

  public get records(): GetRecord[] | undefined {
    return this._records;
  }

  public set records(value: GetRecord[] | undefined) {
    this._records = value;
  }
}

export default GetRequest;
