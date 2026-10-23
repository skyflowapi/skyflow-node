import { BaseUpdateResponse } from 'skyflow-common';
import { UpdateResponseRecord } from '../../../types';

/** Response from an update operation. */
class UpdateResponse extends BaseUpdateResponse {
  readonly records: UpdateResponseRecord[];

  constructor({ records }: { records: UpdateResponseRecord[] }) {
    super();
    this.records = records;
  }
}

export default UpdateResponse;
