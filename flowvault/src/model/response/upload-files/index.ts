import { BaseUploadFilesResponse } from 'skyflow-common';
import { UploadFilesResponseRecord } from '../../../types';

/** Response from an uploadFiles operation. */
class UploadFilesResponse extends BaseUploadFilesResponse {
  readonly records: UploadFilesResponseRecord[];

  constructor({ records }: { records: UploadFilesResponseRecord[] }) {
    super();
    this.records = records;
  }
}

export default UploadFilesResponse;
