import { RequestInterceptor } from '../request-context';

/**
 * Base class for every FlowVault `*Options`.
 *
 * It carries an optional {@link RequestInterceptor} — the one supported way to
 * attach custom headers to a call. The interceptor may only set the headers in
 * {@link CustomHeaderKey}; arbitrary headers are not supported.
 */
export class FlowVaultOptions {
  private interceptor?: RequestInterceptor;

  /** Register an interceptor that attaches supported custom headers per request. */
  setInterceptor(interceptor: RequestInterceptor): void {
    this.interceptor = interceptor;
  }

  /** The registered request interceptor, if any. */
  getInterceptor(): RequestInterceptor | undefined {
    return this.interceptor;
  }
}

export default FlowVaultOptions;
