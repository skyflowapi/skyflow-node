import { BaseInsertResponse } from 'skyflow-common';
import { InsertResponseRecord } from '../../../types';

/** Response from an insert operation. */
class InsertResponse extends BaseInsertResponse {
  readonly records: InsertResponseRecord[];

  constructor({ records }: { records: InsertResponseRecord[] }) {
    super();
    this.records = records;
  }
}

export default InsertResponse;
