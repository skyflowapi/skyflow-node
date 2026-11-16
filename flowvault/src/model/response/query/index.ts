import { BaseQueryResponse } from 'skyflow-common';
import { QueryResponseMetadata } from '../../../types';

/** Response from a query operation. Mirrors `QueryResponse` in the Java and Python FlowVault SDKs. */
class QueryResponse extends BaseQueryResponse {
  /** The result rows, one plain object per row keyed by column name. */
  readonly records: Record<string, unknown>[];
  readonly metadata: QueryResponseMetadata;
  readonly requestId: string;

  constructor({
    records,
    metadata,
    requestId,
  }: {
    records: Record<string, unknown>[];
    metadata: QueryResponseMetadata;
    requestId: string;
  }) {
    super();
    this.records = records;
    this.metadata = metadata;
    this.requestId = requestId;
  }
}

export default QueryResponse;
