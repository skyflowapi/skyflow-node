import { BaseDeleteFilesRequest } from 'skyflow-common';
import { DeleteFilesRequestRecord } from '../../../types';

/** Request to delete files from one or more file columns. */
class DeleteFilesRequest extends BaseDeleteFilesRequest {
  private _records: DeleteFilesRequestRecord[];

  constructor(records: DeleteFilesRequestRecord[]) {
    super();
    this._records = records;
  }

  public get records(): DeleteFilesRequestRecord[] {
    return this._records;
  }

  public set records(value: DeleteFilesRequestRecord[]) {
    this._records = value;
  }
}

export default DeleteFilesRequest;
