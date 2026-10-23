import { BaseDeleteResponse } from 'skyflow-common';
import { DeleteResponseRecord } from '../../../types';

/** Response from a delete operation. */
class DeleteResponse extends BaseDeleteResponse {
  readonly records: DeleteResponseRecord[];

  constructor({ records }: { records: DeleteResponseRecord[] }) {
    super();
    this.records = records;
  }
}

export default DeleteResponse;
