import { BaseGetRequest } from 'skyflow-common';
import { ColumnRedactions } from '../../../types';

/** A single table / skyflow-ids entry for a multi-table get request, with optional
 * per-record column selection / redaction / unique-value lookup. Mirrors
 * `GetRequestRecord` in the Java and Python FlowVault SDKs. */
export interface GetRequestRecord {
  tableName: string;
  skyflowIds: string[];
  columns?: string[];
  columnRedactions?: ColumnRedactions[];
  uniqueValues?: Record<string, unknown>[];
}

/** Request to fetch records by Skyflow ID, optionally across tables. */
class GetRequest extends BaseGetRequest {
  private _tableName: string;
  private _skyflowIds: string[];
  private _records?: GetRequestRecord[];

  constructor(tableName: string, skyflowIds: string[], records?: GetRequestRecord[]) {
    super();
    this._tableName = tableName;
    this._skyflowIds = skyflowIds;
    this._records = records;
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

  public get records(): GetRequestRecord[] | undefined {
    return this._records;
  }

  public set records(value: GetRequestRecord[] | undefined) {
    this._records = value;
  }
}

export default GetRequest;
