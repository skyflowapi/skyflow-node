import { BaseDetokenizeResponse } from 'skyflow-common';
import { DetokenizeResponseRecord } from '../../../types';

/** Response from a detokenize operation. */
class DetokenizeResponse extends BaseDetokenizeResponse {
  readonly records: DetokenizeResponseRecord[];

  constructor({ records }: { records: DetokenizeResponseRecord[] }) {
    super();
    this.records = records;
  }
}

export default DetokenizeResponse;
