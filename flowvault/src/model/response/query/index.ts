import { BaseQueryResponse } from 'skyflow-common';
import { FlowVaultRecordError, QueryResponseMetadata } from '../../../types';

/** Response from a query operation. */
class QueryResponse extends BaseQueryResponse {
  readonly fields: Record<string, unknown>[];
  readonly errors: FlowVaultRecordError[] | null;
  readonly metadata: QueryResponseMetadata;
  readonly requestId: string;

  constructor({
    fields,
    errors,
    metadata,
    requestId,
  }: {
    fields: Record<string, unknown>[];
    errors: FlowVaultRecordError[] | null;
    metadata: QueryResponseMetadata;
    requestId: string;
  }) {
    super();
    this.fields = fields;
    this.errors = errors;
    this.metadata = metadata;
    this.requestId = requestId;
  }
}

export default QueryResponse;
