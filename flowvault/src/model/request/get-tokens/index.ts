import { BaseGetTokensRequest } from 'skyflow-common';
import { GetTokensRequestRecord } from '../../../types';

/** Request to fetch deterministic tokens for a list of values. */
class GetTokensRequest extends BaseGetTokensRequest {
  private _records: GetTokensRequestRecord[];

  constructor(records: GetTokensRequestRecord[]) {
    super();
    this._records = records;
  }

  public get records(): GetTokensRequestRecord[] {
    return this._records;
  }

  public set records(value: GetTokensRequestRecord[]) {
    this._records = value;
  }
}

export default GetTokensRequest;
