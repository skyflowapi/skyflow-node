import { BaseGetTokensRequest } from 'skyflow-common';
import { GetTokensRecord } from '../../../types';

/** Request to fetch deterministic tokens for a list of values. */
class GetTokensRequest extends BaseGetTokensRequest {
  private _records: GetTokensRecord[];

  constructor(records: GetTokensRecord[]) {
    super();
    this._records = records;
  }

  public get records(): GetTokensRecord[] {
    return this._records;
  }

  public set records(value: GetTokensRecord[]) {
    this._records = value;
  }
}

export default GetTokensRequest;
