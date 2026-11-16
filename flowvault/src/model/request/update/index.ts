import { BaseUpdateRequest } from 'skyflow-common';
import { UpdateRequestRecord } from '../../../types';
import { UpdateType } from '../../../enums/update-type';

/** Request to update one or more records in a table. */
class UpdateRequest extends BaseUpdateRequest {
  private _tableName: string;
  private _records: UpdateRequestRecord[];
  // Request-level update type; mirrors `UpdateType` in the Java FlowVault SDK.
  private _updateType?: UpdateType;

  constructor(tableName: string, records: UpdateRequestRecord[], updateType?: UpdateType) {
    super();
    this._tableName = tableName;
    this._records = records;
    this._updateType = updateType;
  }

  public get tableName(): string {
    return this._tableName;
  }

  public set tableName(value: string) {
    this._tableName = value;
  }

  public get records(): UpdateRequestRecord[] {
    return this._records;
  }

  public set records(value: UpdateRequestRecord[]) {
    this._records = value;
  }

  public get updateType(): UpdateType | undefined {
    return this._updateType;
  }

  public set updateType(value: UpdateType | undefined) {
    this._updateType = value;
  }
}

export default UpdateRequest;
