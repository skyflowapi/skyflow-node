import { FlowVaultOptions } from '../base';
import { UpsertOptions } from '../../../types';

/** Options for an insert operation. */
class InsertOptions extends FlowVaultOptions {
  private upsert?: UpsertOptions;

  constructor() {
    super();
  }

  setUpsert(upsert: UpsertOptions): void {
    this.upsert = upsert;
  }

  getUpsert(): UpsertOptions | undefined {
    return this.upsert;
  }
}

export default InsertOptions;
