import { BaseDeleteRequest } from 'skyflow-common';

/** Request to delete records by Skyflow ID or by unique column values. */
class DeleteRequest extends BaseDeleteRequest {
  private _tableName: string;
  private _skyflowIds: string[];
  // A list of { columnName: value, ... } maps (mirrors Java/Python flowvault);
  // each is sent on the wire as { data: {...} }.
  private _uniqueValues?: Record<string, unknown>[];

  constructor(tableName: string, skyflowIds: string[], uniqueValues?: Record<string, unknown>[]) {
    super();
    this._tableName = tableName;
    this._skyflowIds = skyflowIds;
    this._uniqueValues = uniqueValues;
  }

  public get tableName(): string {
    return this._tableName;
  }

  public set tableName(value: string) {
    this._tableName = value;
  }

  public get skyflowIds(): string[] {
    return this._skyflowIds;
  }

  public set skyflowIds(value: string[]) {
    this._skyflowIds = value;
  }

  public get uniqueValues(): Record<string, unknown>[] | undefined {
    return this._uniqueValues;
  }

  public set uniqueValues(value: Record<string, unknown>[] | undefined) {
    this._uniqueValues = value;
  }
}

export default DeleteRequest;
