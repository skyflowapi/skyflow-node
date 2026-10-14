import {
  AuthInfo,
  AuthType,
  Credentials,
  LogLevel,
  MessageType,
  SkyflowError,
  errorMessages,
  getBearerToken,
  isExpired,
  printLog,
  logs,
  HTTP_HEADER,
  HTTP_STATUS_CODE,
} from 'skyflow-common';
import { Records } from '../../_generated_/rest/src/api/resources/records/client/Client';
import { Tokens } from '../../_generated_/rest/src/api/resources/tokens/client/Client';
import { Files } from '../../_generated_/rest/src/api/resources/files/client/Client';
import { Query } from '../../_generated_/rest/src/api/resources/query/client/Client';

/**
 * VaultClient owns the connection details for a single vault: its URL,
 * credentials, log level and bearer token. It lazily builds the generated
 * resource clients (Records / Tokens / Files / Query), each wired to a
 * baseUrl + token supplier, and exposes them as typed accessors. The
 * generated top-level `SkyflowClient` wrapper is intentionally not used (see
 * notes) — the resource clients take the exact same options and are composed
 * directly, mirroring the sibling skyvault SDK.
 *
 * It also normalizes the v2 error envelope into a common `SkyflowError`.
 */
class VaultClient {
  vaultId: string;

  url: string;

  private currentToken = '';

  private recordsApi?: Records;

  private tokensApi?: Tokens;

  private filesApi?: Files;

  private queryApi?: Query;

  individualCredentials?: Credentials;

  skyflowCredentials?: Credentials;

  logLevel: LogLevel;

  authInfo?: AuthInfo;

  private updateTriggered = false;

  constructor(
    url: string,
    vaultId: string,
    individualCredentials?: Credentials,
    skyflowCredentials?: Credentials,
    logLevel?: LogLevel,
  ) {
    this.url = url;
    this.vaultId = vaultId;
    this.individualCredentials = individualCredentials;
    this.skyflowCredentials = skyflowCredentials;
    this.logLevel = logLevel || LogLevel.ERROR;
  }

  updateClientConfig(
    url: string,
    vaultId: string,
    individualCredentials?: Credentials,
    skyflowCredentials?: Credentials,
    logLevel?: LogLevel,
  ): void {
    this.updateTriggered = true;
    this.url = url;
    this.vaultId = vaultId;
    this.individualCredentials = individualCredentials;
    this.skyflowCredentials = skyflowCredentials;
    this.logLevel = logLevel || LogLevel.ERROR;
    // Force the resource clients to be rebuilt against the new URL.
    this.recordsApi = undefined;
    this.tokensApi = undefined;
    this.filesApi = undefined;
    this.queryApi = undefined;
  }

  getLogLevel(): LogLevel {
    return this.logLevel;
  }

  setLogLevel(logLevel: LogLevel): void {
    this.logLevel = logLevel;
  }

  updateSkyflowCredentials(credentials?: Credentials): void {
    this.updateTriggered = true;
    this.skyflowCredentials = credentials;
  }

  getCredentials(): Credentials | undefined {
    if (this.authInfo?.key && !this.updateTriggered) {
      switch (this.authInfo.type) {
        case AuthType.API_KEY:
          printLog(logs.infoLogs.REUSE_KEY, MessageType.LOG, this.logLevel);
          return { apiKey: this.authInfo.key } as Credentials;
        case AuthType.TOKEN:
          if (!isExpired(this.authInfo.key)) {
            printLog(logs.infoLogs.REUSE_BEARER_TOKEN, MessageType.LOG, this.logLevel);
            return { token: this.authInfo.key } as Credentials;
          }
          break;
        default:
          break;
      }
    }
    this.updateTriggered = false;
    return this.individualCredentials ?? this.skyflowCredentials;
  }

  /** Resolve a bearer token and make sure the generated clients are ready. */
  async getToken(): Promise<void> {
    const authInfo = await getBearerToken(this.getCredentials(), this.logLevel);
    this.authInfo = authInfo;
    this.currentToken = authInfo.key;
  }

  private supplierOptions(): Records.Options {
    return {
      baseUrl: () => this.url,
      token: () => this.currentToken,
    };
  }

  get records(): Records {
    if (!this.recordsApi) {
      this.recordsApi = new Records(this.supplierOptions());
    }
    return this.recordsApi;
  }

  get tokens(): Tokens {
    if (!this.tokensApi) {
      this.tokensApi = new Tokens(this.supplierOptions());
    }
    return this.tokensApi;
  }

  get files(): Files {
    if (!this.filesApi) {
      this.filesApi = new Files(this.supplierOptions());
    }
    return this.filesApi;
  }

  get query(): Query {
    if (!this.queryApi) {
      this.queryApi = new Query(this.supplierOptions());
    }
    return this.queryApi;
  }

  /**
   * Normalize a thrown error (generated SkyflowError envelope, timeout, or a
   * plain Error) into a common `SkyflowError`. The v2 envelope is
   * `{ error: { requestId?, grpcCode?/grpc_code?, httpCode?/http_code?,
   * httpStatus?/http_status?, message, details? } }`.
   */
  failureResponse(err: any): SkyflowError {
    if (err instanceof SkyflowError) {
      return err;
    }

    const rawResponse = err?.rawResponse;
    const headers = rawResponse?.headers;
    const headerRequestId =
      headers && headers.get
        ? headers.get(HTTP_HEADER.X_REQUEST_ID) || ''
        : '';

    const body = err?.body;
    const errorData = (body && typeof body === 'object' ? body.error : undefined) ?? {};

    const message: string =
      errorData.message ?? err?.message ?? errorMessages.ERROR_OCCURRED;
    const httpCode =
      err?.statusCode ??
      errorData.httpCode ??
      errorData.http_code ??
      HTTP_STATUS_CODE.BAD_REQUEST;
    const grpcCode = errorData.grpcCode ?? errorData.grpc_code;
    const httpStatus = errorData.httpStatus ?? errorData.http_status;
    const details = errorData.details ?? [];
    const requestId = errorData.requestId ?? headerRequestId;

    printLog(message, MessageType.ERROR, this.logLevel);

    return new SkyflowError(
      {
        httpCode,
        message,
        requestId,
        grpcCode,
        httpStatus,
        details,
      },
      [],
    );
  }
}

export default VaultClient;
