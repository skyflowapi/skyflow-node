import { CustomHeaderKey } from '../../enums/custom-header-key';

/** Reported when the caller's request was not split into batches. */
const NOT_BATCHED = -1;

/**
 * The context handed to a {@link RequestInterceptor} for each outgoing request.
 *
 * Use {@link RequestContext.addHeader} to attach one of the supported custom
 * headers (see {@link CustomHeaderKey}). `operation` names the vault operation
 * (`INSERT`, `GET`, ...), so an interceptor can vary a header per operation.
 */
export class RequestContext {
  readonly operation: string;

  /**
   * Zero-based position of this batch within the caller's request, or `-1` when
   * the operation was not batched. FlowVault's unary operations are never
   * batched, so this is always `-1` today; it mirrors the other SDKs' context.
   */
  readonly batchIndex: number;

  /** Total number of batches the request was split into, or `-1` when not batched. */
  readonly totalBatches: number;

  private readonly headerMap: Map<CustomHeaderKey, string> = new Map();

  constructor(
    operation: string,
    batchIndex: number = NOT_BATCHED,
    totalBatches: number = NOT_BATCHED,
  ) {
    this.operation = operation;
    this.batchIndex = batchIndex;
    this.totalBatches = totalBatches;
  }

  /** Attach a supported custom header to the outgoing request. */
  addHeader(key: CustomHeaderKey, value: string): void {
    this.headerMap.set(key, value);
  }

  /** A copy of the headers the interceptor added, keyed by {@link CustomHeaderKey}. */
  get headers(): Map<CustomHeaderKey, string> {
    return new Map(this.headerMap);
  }
}

/**
 * A hook invoked once per outgoing request. Attach supported custom headers to
 * the request by calling {@link RequestContext.addHeader} on the context.
 */
export type RequestInterceptor = (context: RequestContext) => void;

export default RequestContext;
