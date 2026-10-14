import { BaseOptions } from 'skyflow-common';
import { ColumnRedaction } from '../../../types';

/** Options for a get operation. */
class GetOptions extends BaseOptions {
  private fields?: string[];
  private columnRedactions?: ColumnRedaction[];
  private uniqueValues?: Record<string, unknown>[];
  private limit?: number;
  private offset?: number;

  constructor() {
    super();
  }

  setFields(fields: string[]): void {
    this.fields = fields;
  }

  getFields(): string[] | undefined {
    return this.fields;
  }

  setColumnRedactions(columnRedactions: ColumnRedaction[]): void {
    this.columnRedactions = columnRedactions;
  }

  getColumnRedactions(): ColumnRedaction[] | undefined {
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
