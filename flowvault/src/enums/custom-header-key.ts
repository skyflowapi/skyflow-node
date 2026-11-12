/**
 * The custom request-header keys the FlowVault SDK supports.
 *
 * Only these headers may be attached to an outgoing request (through a
 * {@link RequestInterceptor}). Each enum value is the header name sent on the
 * wire, so `CustomHeaderKey.REQUEST_ID_HEADER` maps to `x-request-id`.
 */
export enum CustomHeaderKey {
  SKYFLOW_ACCOUNT_ID = 'x-skyflow-account-id',
  SKYFLOW_ACCOUNT_NAME = 'x-skyflow-account-name',
  REQUEST_ID_HEADER = 'x-request-id',
}

export default CustomHeaderKey;
