import { BaseDeleteFilesResponse } from 'skyflow-common';
import { DeleteFilesResponseRecord } from '../../../types';

/** Response from a deleteFiles operation. */
class DeleteFilesResponse extends BaseDeleteFilesResponse {
  readonly records: DeleteFilesResponseRecord[];

  constructor({ records }: { records: DeleteFilesResponseRecord[] }) {
    super();
    this.records = records;
  }
}

export default DeleteFilesResponse;
