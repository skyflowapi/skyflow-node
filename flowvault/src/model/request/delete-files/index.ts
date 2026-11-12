import { BaseDeleteFilesRequest } from 'skyflow-common';
import { DeleteFilesRecord } from '../../../types';

/** Request to delete files from one or more file columns. */
class DeleteFilesRequest extends BaseDeleteFilesRequest {
  private _records: DeleteFilesRecord[];

  constructor(records: DeleteFilesRecord[]) {
    super();
    this._records = records;
  }

  public get records(): DeleteFilesRecord[] {
    return this._records;
  }

  public set records(value: DeleteFilesRecord[]) {
    this._records = value;
  }
}

export default DeleteFilesRequest;
