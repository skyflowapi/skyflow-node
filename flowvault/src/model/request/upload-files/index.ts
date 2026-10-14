import { BaseUploadFilesRequest } from 'skyflow-common';
import { UploadFilesRecord } from '../../../types';

/** Request to upload files into one or more file columns. */
class UploadFilesRequest extends BaseUploadFilesRequest {
  private _records: UploadFilesRecord[];

  constructor(records: UploadFilesRecord[]) {
    super();
    this._records = records;
  }

  public get records(): UploadFilesRecord[] {
    return this._records;
  }

  public set records(value: UploadFilesRecord[]) {
    this._records = value;
  }
}

export default UploadFilesRequest;
