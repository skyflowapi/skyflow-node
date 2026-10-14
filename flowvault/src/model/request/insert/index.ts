import { BaseInsertRequest } from 'skyflow-common';
import { InsertRecord } from '../../../types';

/** Request to insert one or more records into a table. */
class InsertRequest extends BaseInsertRequest {
  private _tableName: string;
  private _records: InsertRecord[];

  constructor(tableName: string, records: InsertRecord[]) {
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

  public get records(): InsertRecord[] {
    return this._records;
  }

  public set records(value: InsertRecord[]) {
    this._records = value;
  }
}

export default InsertRequest;
