import { BaseGetTokensResponse } from 'skyflow-common';
import { GetTokensResponseRecord } from '../../../types';

/** Response from a getTokens operation. */
class GetTokensResponse extends BaseGetTokensResponse {
  readonly records: GetTokensResponseRecord[];

  constructor({ records }: { records: GetTokensResponseRecord[] }) {
    super();
    this.records = records;
  }
}

export default GetTokensResponse;
