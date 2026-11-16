import { FlowVaultOptions } from '../base';
import { ColumnRedactions } from '../../../types';

/** Options for a get operation. */
class GetOptions extends FlowVaultOptions {
  private columns?: string[];
  private columnRedactions?: ColumnRedactions[];
  private uniqueValues?: Record<string, unknown>[];
  private limit?: number;
  private offset?: number;

  constructor() {
    super();
  }

  setColumns(columns: string[]): void {
    this.columns = columns;
  }

  getColumns(): string[] | undefined {
    return this.columns;
  }

  setColumnRedactions(columnRedactions: ColumnRedactions[]): void {
    this.columnRedactions = columnRedactions;
  }

  getColumnRedactions(): ColumnRedactions[] | undefined {
    return this.columnRedactions;
  }

  setUniqueValues(uniqueValues: Record<string, unknown>[]): void {
    this.uniqueValues = uniqueValues;
  }

  getUniqueValues(): Record<string, unknown>[] | undefined {
    return this.uniqueValues;
  }

  setLimit(limit: number): void {
    this.limit = limit;
  }

  getLimit(): number | undefined {
    return this.limit;
  }

  setOffset(offset: number): void {
    this.offset = offset;
  }

  getOffset(): number | undefined {
    return this.offset;
  }
}

export default GetOptions;
