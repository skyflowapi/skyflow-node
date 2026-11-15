import { BaseUploadFilesRequest } from 'skyflow-common';
import { UploadFilesRequestRecord } from '../../../types';

/** Request to upload files into one or more file columns. */
class UploadFilesRequest extends BaseUploadFilesRequest {
  private _records: UploadFilesRequestRecord[];

  constructor(records: UploadFilesRequestRecord[]) {
    super();
    this._records = records;
  }

  public get records(): UploadFilesRequestRecord[] {
    return this._records;
  }

  public set records(value: UploadFilesRequestRecord[]) {
    this._records = value;
  }
}

export default UploadFilesRequest;
