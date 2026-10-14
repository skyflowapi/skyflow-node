import { BaseUpdateRequest } from 'skyflow-common';
import { UpdateRecord } from '../../../types';

/** Request to update one or more records in a table. */
class UpdateRequest extends BaseUpdateRequest {
  private _tableName: string;
  private _records: UpdateRecord[];

  constructor(tableName: string, records: UpdateRecord[]) {
    super();
    this._tableName = tableName;
    this._records = records;
  }

  public get tableName(): string {
    return this._tableName;
  }

  public set tableName(value: string) {
    this._tableName = value;
  }

  public get records(): UpdateRecord[] {
    return this._records;
  }

  public set records(value: UpdateRecord[]) {
    this._records = value;
  }
}

export default UpdateRequest;
