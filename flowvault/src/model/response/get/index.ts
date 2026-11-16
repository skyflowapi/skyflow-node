import { BaseGetResponse } from 'skyflow-common';
import { GetResponseRecord } from '../../../types';

/** Response from a get operation. */
class GetResponse extends BaseGetResponse {
  readonly records: GetResponseRecord[];

  constructor({ records }: { records: GetResponseRecord[] }) {
    super();
    this.records = records;
  }
}

export default GetResponse;
