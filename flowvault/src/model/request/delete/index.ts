import { BaseDeleteRequest } from 'skyflow-common';

/** Request to delete records by Skyflow ID or by unique column values. */
class DeleteRequest extends BaseDeleteRequest {
  private _table: string;
  private _ids: string[];
  // A list of { columnName: value, ... } maps (mirrors Java/Python flowvault);
  // each is sent on the wire as { data: {...} }.
  private _uniqueValues?: Record<string, unknown>[];

  constructor(table: string, ids: string[], uniqueValues?: Record<string, unknown>[]) {
    super();
    this._table = table;
    this._ids = ids;
    this._uniqueValues = uniqueValues;
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

  public get uniqueValues(): Record<string, unknown>[] | undefined {
    return this._uniqueValues;
  }

  public set uniqueValues(value: Record<string, unknown>[] | undefined) {
    this._uniqueValues = value;
  }
}

export default DeleteRequest;
