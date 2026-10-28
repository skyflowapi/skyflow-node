import * as fs from 'fs/promises';
import * as path from 'path';
import * as Gen from '../../../_generated_/rest/src/api';
import {
  SDK,
  MessageType,
  LogLevel,
  printLog,
  generateSDKMetrics,
  removeSDKVersion,
  SkyflowError,
  logs,
} from 'skyflow-common';
import VaultClient from '../../client';
import { FlowVaultOptions } from '../../model/options/base';
import { RequestContext } from '../../model/request-context';
import InsertRequest from '../../model/request/insert';
import InsertOptions from '../../model/options/insert';
import InsertResponse from '../../model/response/insert';
import GetRequest from '../../model/request/get';
import GetOptions from '../../model/options/get';
import GetResponse from '../../model/response/get';
import UpdateRequest from '../../model/request/update';
import UpdateOptions from '../../model/options/update';
import UpdateResponse from '../../model/response/update';
import DeleteRequest from '../../model/request/delete';
import DeleteResponse from '../../model/response/delete';
import QueryRequest from '../../model/request/query';
import QueryResponse from '../../model/response/query';
import DetokenizeRequest from '../../model/request/detokenize';
import DetokenizeOptions from '../../model/options/detokenize';
import DeleteOptions from '../../model/options/delete';
import QueryOptions from '../../model/options/query';
import GetTokensOptions from '../../model/options/get-tokens';
import UploadFilesOptions from '../../model/options/upload-files';
import DeleteFilesOptions from '../../model/options/delete-files';
import DetokenizeResponse from '../../model/response/detokenize';
import GetTokensRequest from '../../model/request/get-tokens';
import GetTokensResponse from '../../model/response/get-tokens';
import UploadFilesRequest from '../../model/request/upload-files';
import UploadFilesResponse from '../../model/response/upload-files';
import DeleteFilesRequest from '../../model/request/delete-files';
import DeleteFilesResponse from '../../model/response/delete-files';
import {
  InsertResponseRecord,
  GetResponseRecord,
  UpdateResponseRecord,
  DeleteResponseRecord,
  DetokenizeResponseRecord,
  GetTokensResponseRecord,
  UploadFilesColumn,
  UploadFilesResponseColumn,
  UploadFilesResponseRecord,
  DeleteFilesResponseRecord,
  UpsertOptions,
  Token,
} from '../../types';
import {
  validateInsertRequest,
  validateGetRequest,
  validateUpdateRequest,
  validateDeleteRequest,
  validateQueryRequest,
  validateDetokenizeRequest,
  validateGetTokensRequest,
  validateUploadFilesRequest,
  validateDeleteFilesRequest,
} from '../../validations';

interface PreparedColumn {
  column: string;
  fileName?: string;
  bytes: Uint8Array;
  contentType: string;
}

/** The data plane names the system primary-key column `skyflowID` on the wire;
 * the SDK surfaces it as `skyflowId` everywhere else. */
const WIRE_SKYFLOW_ID = 'skyflowID';
const SKYFLOW_ID = 'skyflowId';

/** Parse one wire token entry into a typed {@link Token}. Mirrors the Java/Python
 * flowvault `toToken`: a map yields token/tokenGroupName/path; a bare value
 * (a column tokenized against a single unnamed group) yields a token-only entry. */
function toToken(entry: unknown): Token | null {
  if (entry !== null && typeof entry === 'object' && !Array.isArray(entry)) {
    const map = entry as Record<string, unknown>;
    const token: Token = {};
    if (map.token != null) token.token = String(map.token);
    if (map.tokenGroupName != null) token.tokenGroupName = String(map.tokenGroupName);
    if (map.path != null) token.path = String(map.path);
    return token;
  }
  if (entry != null) return { token: String(entry) };
  return null;
}

/** Parse a single column's wire value (a list of entries, or one entry) into Token[]. */
function parseTokenEntries(rawValue: unknown): Token[] | null {
  if (rawValue == null) return null;
  const parsed: Token[] = [];
  const entries = Array.isArray(rawValue) ? rawValue : [rawValue];
  for (const entry of entries) {
    const token = toToken(entry);
    if (token) parsed.push(token);
  }
  return parsed;
}

/**
 * Parse the generic wire token map (`column -> value`) into `column -> Token[]`.
 * Mirrors `Token.parseTokens` in the Java/Python flowvault SDKs so insert/get/
 * update responses surface typed tokens instead of untyped maps. Returns null
 * when there are no tokens.
 */
function parseTokens(raw: unknown): Record<string, Token[]> | null {
  if (raw == null || typeof raw !== 'object') return null;
  const parsed: Record<string, Token[]> = {};
  for (const [column, value] of Object.entries(raw as Record<string, unknown>)) {
    const tokens = parseTokenEntries(value);
    if (tokens != null) parsed[column] = tokens;
  }
  return parsed;
}

/**
 * Operation names handed to a request interceptor via {@link RequestContext}.
 * Kept identical to the Python/Java FlowVault SDKs so interceptor logic ports
 * across languages.
 */
const Operation = {
  INSERT: 'INSERT',
  GET: 'GET',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  DETOKENIZE: 'DETOKENIZE',
  QUERY: 'QUERY',
  GET_TOKENS: 'GET_TOKENS',
  UPLOAD_FILES: 'UPLOAD_FILES',
  DELETE_FILES: 'DELETE_FILES',
} as const;

/**
 * VaultController holds the 9 unary FlowVault operations. Each validates its
 * input, ensures a bearer token, calls the generated client, and maps the
 * generated response onto the hand-written Response shape. Whole-call
 * failures are normalized to `SkyflowError` and thrown.
 */
class VaultController {
  private client: VaultClient;

  constructor(client: VaultClient) {
    this.client = client;
  }

  private get logLevel(): LogLevel {
    return this.client.getLogLevel();
  }

  private sdkHeaders(): Record<string, string> {
    return { [SDK.METRICS_HEADER_KEY]: JSON.stringify(generateSDKMetrics(this.logLevel)) };
  }

  /**
   * Request options for every generated call: the SDK metrics header merged with
   * any per-call custom headers (from the options' interceptor), plus the vault's
   * configured timeout (seconds) and retry count, when set.
   */
  private requestOptions(operation: string, callOptions?: FlowVaultOptions): {
    headers: Record<string, string>;
    timeoutInSeconds?: number;
    maxRetries?: number;
  } {
    const result: { headers: Record<string, string>; timeoutInSeconds?: number; maxRetries?: number } = {
      headers: { ...this.sdkHeaders(), ...this.customHeaders(operation, callOptions) },
    };
    if (this.client.timeout !== undefined) result.timeoutInSeconds = this.client.timeout;
    if (this.client.maxRetries !== undefined) result.maxRetries = this.client.maxRetries;
    return result;
  }

  /**
   * Run the caller's interceptor (if any) against a fresh {@link RequestContext}
   * and turn the headers it set into wire headers. Each header key is a
   * {@link CustomHeaderKey} whose value is already the header name.
   */
  // eslint-disable-next-line class-methods-use-this
  private customHeaders(operation: string, callOptions?: FlowVaultOptions): Record<string, string> {
    const interceptor = callOptions?.getInterceptor();
    if (!interceptor) return {};
    const context = new RequestContext(operation);
    interceptor(context);
    const headers: Record<string, string> = {};
    context.headers.forEach((value, key) => {
      headers[key] = value;
    });
    return headers;
  }

  // eslint-disable-next-line class-methods-use-this
  private getRequestId(rawResponse: any): string | undefined {
    const headers = rawResponse?.headers;
    if (headers && headers.get) {
      return headers.get('x-request-id') || undefined;
    }
    return undefined;
  }

  private handleError(error: unknown): SkyflowError {
    if (error instanceof Error) {
      printLog(removeSDKVersion(error.message), MessageType.ERROR, this.logLevel);
    }
    return this.client.failureResponse(error);
  }

  private static toGenUpsert(upsert: UpsertOptions): Gen.Upsert {
    return {
      updateType: upsert.updateType as Gen.UpsertUpdateType,
      uniqueColumns: upsert.uniqueColumns,
    };
  }

  // Per-record failures can come back with a 4xx HTTP status whose body carries a
  // records/response array (e.g. a delete/get/update of a non-existent id). Pull
  // those out so they surface as a normal response instead of a thrown error.
  private static unaryErrorRecords(error: unknown): unknown[] | null {
    const body = (error as { body?: { records?: unknown; response?: unknown } })?.body;
    if (body && typeof body === 'object') {
      if (Array.isArray(body.records)) return body.records;
      if (Array.isArray(body.response)) return body.response;
    }
    return null;
  }

  // Surface per-record failures from an error body as a normal response (matches
  // Java/Python flowvault); re-throw genuine whole-call errors.
  private unaryError<T>(error: unknown, build: (records: unknown[], requestId?: string) => T): T {
    const errorRecords = VaultController.unaryErrorRecords(error);
    if (errorRecords) {
      const requestId = this.getRequestId((error as { rawResponse?: unknown }).rawResponse);
      return build(errorRecords, requestId);
    }
    throw this.handleError(error);
  }

  // ---------------------------------------------------------------- insert
  async insert(request: InsertRequest, options?: InsertOptions): Promise<InsertResponse> {
    try {
      printLog(logs.infoLogs.INSERT_TRIGGERED, MessageType.LOG, this.logLevel);
      printLog(logs.infoLogs.VALIDATE_INSERT_INPUT, MessageType.LOG, this.logLevel);
      validateInsertRequest(request, options, this.logLevel);
      await this.client.getToken();

      // When any record carries its own table, send a per-record tableName so a
      // single insert can target multiple tables (matches Java/Python flowvault).
      const insertPerRecordTable = request.records.some(
        (record) => record.table !== undefined && record.table !== null,
      );
      const requestUpsert = options?.getUpsert();
      // When any record carries its own upsert, send per-record upsert and drop
      // the request-level one (matches Java/Python flowvault).
      const insertPerRecordUpsert = request.records.some(
        (record) => record.upsert !== undefined && record.upsert !== null,
      );
      const genReq: Gen.InsertRequest = {
        vaultID: this.client.vaultId,
        records: request.records.map((record) => {
          const genRecord: Gen.InsertRecordData = { data: record.data };
          if (record.tokens) genRecord.tokens = record.tokens; // BYOT
          if (insertPerRecordTable) genRecord.tableName = record.table ?? request.tableName;
          if (insertPerRecordUpsert) {
            const recordUpsert = record.upsert ?? requestUpsert;
            if (recordUpsert) genRecord.upsert = VaultController.toGenUpsert(recordUpsert);
          }
          return genRecord;
        }),
      } as Gen.InsertRequest;

      // The API requires tableName in exactly ONE place. Send it at the request
      // level only when no record carries its own; otherwise it is per-record.
      if (!insertPerRecordTable) {
        genReq.tableName = request.tableName;
      }

      if (!insertPerRecordUpsert && requestUpsert) {
        genReq.upsert = VaultController.toGenUpsert(requestUpsert);
      }

      const { data, rawResponse } = await this.client.records
        .insertRecords(genReq, this.requestOptions(Operation.INSERT, options))
        .withRawResponse();
      const requestId = this.getRequestId(rawResponse);
      printLog(logs.infoLogs.INSERT_DATA_SUCCESS, MessageType.LOG, this.logLevel);

      const records = (data.records ?? []).map((record) =>
        this.mapInsertRecord(record, requestId),
      );
      return new InsertResponse({ records });
    } catch (error) {
      return this.unaryError(error, (errorRecords, requestId) =>
        new InsertResponse({
          records: errorRecords.map((record) => this.mapInsertRecord(record as Gen.RecordResponseObject, requestId)),
        }));
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private mapInsertRecord(
    record: Gen.RecordResponseObject,
    requestId?: string,
  ): InsertResponseRecord {
    const hasError = record.error !== undefined && record.error !== null;
    const result: InsertResponseRecord = {
      tableName: record.tableName ?? null,
      skyflowId: record.skyflowID ?? null,
      tokens: parseTokens(record.tokens),
      data: record.data ?? null,
      hashedData: record.hashedData ?? null,
      httpCode: record.httpCode,
      error: hasError ? record.error : null,
    };
    if (hasError) {
      result.requestId = requestId ?? null;
    }
    return result;
  }

  // ------------------------------------------------------------------- get
  async get(request: GetRequest, options?: GetOptions): Promise<GetResponse> {
    try {
      printLog(logs.infoLogs.GET_TRIGGERED, MessageType.LOG, this.logLevel);
      printLog(logs.infoLogs.VALIDATE_GET_INPUT, MessageType.LOG, this.logLevel);
      validateGetRequest(request, options, this.logLevel);
      await this.client.getToken();

      const genReq: Gen.GetRequest = { vaultID: this.client.vaultId };
      if (request.records && request.records.length > 0) {
        genReq.records = request.records.map((record) => {
          const genRecord: Gen.GetRequestData = {
            tableName: record.tableName,
            skyflowIDs: record.ids,
          };
          if (record.columns) genRecord.columns = record.columns;
          if (record.columnRedactions) {
            genRecord.columnRedactions = record.columnRedactions.map((redaction) => ({
              columnName: redaction.columnName,
              redaction: redaction.redaction,
            }));
          }
          if (record.uniqueValues) {
            genRecord.uniqueValues = record.uniqueValues.map((data) => ({ data }));
          }
          return genRecord;
        });
      } else {
        genReq.tableName = request.table;
        genReq.skyflowIDs = request.ids;
      }

      const fields = options?.getFields();
      if (fields) genReq.columns = fields;
      const redactions = options?.getColumnRedactions();
      if (redactions) {
        genReq.columnRedactions = redactions.map((redaction) => ({
          columnName: redaction.columnName,
          redaction: redaction.redaction,
        }));
      }
      const uniqueValues = options?.getUniqueValues();
      if (uniqueValues) {
        genReq.uniqueValues = uniqueValues.map((data) => ({ data }));
      }
      const limit = options?.getLimit();
      if (limit !== undefined) genReq.limit = limit;
      const offset = options?.getOffset();
      if (offset !== undefined) genReq.offset = offset;

      const { data, rawResponse } = await this.client.records
        .getRecords(genReq, this.requestOptions(Operation.GET, options))
        .withRawResponse();
      const requestId = this.getRequestId(rawResponse);
      printLog(logs.infoLogs.GET_SUCCESS, MessageType.LOG, this.logLevel);

      const records = (data.records ?? []).map((record) => this.mapGetRecord(record, requestId));
      return new GetResponse({ records });
    } catch (error) {
      return this.unaryError(error, (errorRecords, requestId) =>
        new GetResponse({
          records: errorRecords.map((record) => this.mapGetRecord(record as Gen.RecordResponseObject, requestId)),
        }));
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private mapGetRecord(record: Gen.RecordResponseObject, requestId?: string): GetResponseRecord {
    const hasError = record.error !== undefined && record.error !== null;
    const result: GetResponseRecord = {
      skyflowId: record.skyflowID ?? null,
      tableName: record.tableName ?? null,
      data: record.data ?? null,
      hashedData: record.hashedData ?? null,
      tokens: parseTokens(record.tokens),
      httpCode: record.httpCode,
      error: hasError ? record.error : null,
    };
    if (hasError) {
      result.requestId = requestId ?? null;
    }
    return result;
  }

  // ---------------------------------------------------------------- update
  async update(request: UpdateRequest, options?: UpdateOptions): Promise<UpdateResponse> {
    try {
      printLog(logs.infoLogs.UPDATE_TRIGGERED, MessageType.LOG, this.logLevel);
      printLog(logs.infoLogs.VALIDATE_UPDATE_INPUT, MessageType.LOG, this.logLevel);
      validateUpdateRequest(request, options, this.logLevel);
      await this.client.getToken();

      const updatePerRecordTable = request.records.some(
        (record) => record.table !== undefined && record.table !== null,
      );
      const genReq: Gen.UpdateRequest = {
        vaultID: this.client.vaultId,
        records: request.records.map((record) => {
          const genRecord: Gen.UpdateRecordData = { skyflowID: record.skyflowId, data: record.data };
          if (record.tokens) genRecord.tokens = record.tokens; // BYOT
          if (updatePerRecordTable) genRecord.tableName = record.table ?? request.tableName;
          return genRecord;
        }),
      } as Gen.UpdateRequest;
      // Table in exactly ONE place — request level only when not per-record.
      if (!updatePerRecordTable) {
        genReq.tableName = request.tableName;
      }
      if (request.updateType) {
        genReq.updateType = request.updateType as Gen.UpdateRequestUpdateType;
      }

      const { data, rawResponse } = await this.client.records
        .updateRecords(genReq, this.requestOptions(Operation.UPDATE, options))
        .withRawResponse();
      const requestId = this.getRequestId(rawResponse);
      printLog(logs.infoLogs.UPDATE_SUCCESS, MessageType.LOG, this.logLevel);

      const records = (data.records ?? []).map((record) =>
        this.mapUpdateRecord(record, requestId),
      );
      return new UpdateResponse({ records });
    } catch (error) {
      return this.unaryError(error, (errorRecords, requestId) =>
        new UpdateResponse({
          records: errorRecords.map((record) => this.mapUpdateRecord(record as Gen.RecordResponseObject, requestId)),
        }));
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private mapUpdateRecord(
    record: Gen.RecordResponseObject,
    requestId?: string,
  ): UpdateResponseRecord {
    const hasError = record.error !== undefined && record.error !== null;
    const result: UpdateResponseRecord = {
      skyflowId: record.skyflowID ?? null,
      tableName: record.tableName ?? null,
      tokens: parseTokens(record.tokens),
      data: record.data ?? null,
      hashedData: record.hashedData ?? null,
      httpCode: record.httpCode,
      error: hasError ? record.error : null,
    };
    if (hasError) {
      result.requestId = requestId ?? null;
    }
    return result;
  }

  // ---------------------------------------------------------------- delete
  async delete(request: DeleteRequest, options?: DeleteOptions): Promise<DeleteResponse> {
    try {
      printLog(logs.infoLogs.DELETE_TRIGGERED, MessageType.LOG, this.logLevel);
      printLog(logs.infoLogs.VALIDATE_DELETE_INPUT, MessageType.LOG, this.logLevel);
      validateDeleteRequest(request, this.logLevel);
      await this.client.getToken();

      const genReq: Gen.DeleteRequest = {
        vaultID: this.client.vaultId,
        tableName: request.table,
      };
      if (request.ids && request.ids.length > 0) {
        genReq.skyflowIDs = request.ids;
      }
      if (request.uniqueValues && request.uniqueValues.length > 0) {
        // Each { col: value, ... } map becomes one wire { data: {...} } entry.
        genReq.uniqueValues = request.uniqueValues.map((data) => ({ data }));
      }

      const { data, rawResponse } = await this.client.records
        .deleteRecords(genReq, this.requestOptions(Operation.DELETE, options))
        .withRawResponse();
      const requestId = this.getRequestId(rawResponse);
      printLog(logs.infoLogs.DELETE_SUCCESS, MessageType.LOG, this.logLevel);

      const records = (data.records ?? []).map((record) =>
        this.mapDeleteRecord(record, requestId),
      );
      return new DeleteResponse({ records });
    } catch (error) {
      return this.unaryError(error, (errorRecords, requestId) =>
        new DeleteResponse({
          records: errorRecords.map((record) => this.mapDeleteRecord(record as Gen.DeleteResponseObject, requestId)),
        }));
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private mapDeleteRecord(
    record: Gen.DeleteResponseObject,
    requestId?: string,
  ): DeleteResponseRecord {
    const hasError = record.error !== undefined && record.error !== null;
    const result: DeleteResponseRecord = {
      skyflowId: record.skyflowID ?? null,
      httpCode: record.httpCode,
      error: hasError ? record.error : null,
    };
    if (hasError) {
      result.requestId = requestId ?? null;
    }
    return result;
  }

  // ----------------------------------------------------------------- query
  async query(request: QueryRequest, options?: QueryOptions): Promise<QueryResponse> {
    try {
      printLog(logs.infoLogs.QUERY_TRIGGERED, MessageType.LOG, this.logLevel);
      printLog(logs.infoLogs.VALIDATE_QUERY_INPUT, MessageType.LOG, this.logLevel);
      validateQueryRequest(request, this.logLevel);
      await this.client.getToken();

      const genReq: Gen.ExecuteQueryRequest = {
        vaultID: this.client.vaultId,
        query: request.query,
      };

      const { data, rawResponse } = await this.client.query
        .executeQuery(genReq, this.requestOptions(Operation.QUERY, options))
        .withRawResponse();
      const requestId = this.getRequestId(rawResponse) ?? '';
      printLog(logs.infoLogs.QUERY_SUCCESS, MessageType.LOG, this.logLevel);

      // The query data plane returns the system primary-key column as
      // `skyflowID`; normalize it to `skyflowId` so query rows (and the column
      // list) use the same key as every other operation's response records.
      const normalizeKey = (key: string): string => (key === WIRE_SKYFLOW_ID ? SKYFLOW_ID : key);
      const fields = (data.records ?? []).map((record) => {
        const row = record.data ?? {};
        const normalized: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(row)) normalized[normalizeKey(key)] = value;
        return normalized;
      });
      // NOTE: generated ExecuteQueryResponse has no per-record errors block.
      return new QueryResponse({
        fields,
        errors: null,
        metadata: { columns: (data.metadata?.columns ?? []).map(normalizeKey) },
        requestId,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ------------------------------------------------------------ detokenize
  async detokenize(
    request: DetokenizeRequest,
    options?: DetokenizeOptions,
  ): Promise<DetokenizeResponse> {
    try {
      printLog(logs.infoLogs.DETOKENIZE_TRIGGERED, MessageType.LOG, this.logLevel);
      printLog(logs.infoLogs.VALIDATE_DETOKENIZE_INPUT, MessageType.LOG, this.logLevel);
      validateDetokenizeRequest(request, options, this.logLevel);
      await this.client.getToken();

      const genReq: Gen.DetokenizeRequest = {
        vaultID: this.client.vaultId,
        tokens: request.tokens,
      };
      const redactions = request.tokenGroupRedactions;
      if (redactions) {
        genReq.tokenGroupRedactions = redactions.map((redaction) => ({
          tokenGroupName: redaction.tokenGroupName,
          redaction: redaction.redaction,
        }));
      }

      const { data, rawResponse } = await this.client.tokens
        .detokenize(genReq, this.requestOptions(Operation.DETOKENIZE, options))
        .withRawResponse();
      const requestId = this.getRequestId(rawResponse);
      printLog(logs.infoLogs.DETOKENIZE_SUCCESS, MessageType.LOG, this.logLevel);

      // NOTE: generated DetokenizeResponse exposes records under `response`.
      const records = (data.response ?? []).map((record) =>
        this.mapDetokenizeRecord(record, requestId),
      );
      return new DetokenizeResponse({ records });
    } catch (error) {
      return this.unaryError(error, (errorRecords, requestId) =>
        new DetokenizeResponse({
          records: errorRecords.map((record) => this.mapDetokenizeRecord(record as Gen.DetokenizeResponseObject, requestId)),
        }));
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private mapDetokenizeRecord(
    record: Gen.DetokenizeResponseObject,
    requestId?: string,
  ): DetokenizeResponseRecord {
    const hasError = record.error !== undefined && record.error !== null;
    const metadata = record.metadata as Record<string, unknown> | undefined;
    const result: DetokenizeResponseRecord = {
      token: record.token,
      tokenGroupName: record.tokenGroupName ?? null,
      value: record.value,
      metadata: metadata
        ? {
            skyflowId: (metadata.skyflowID ?? metadata.skyflowId ?? null) as string | null,
            tableName: (metadata.tableName ?? null) as string | null,
          }
        : null,
      httpCode: record.httpCode ?? 200,
      error: hasError ? record.error : null,
    };
    if (hasError) {
      result.requestId = requestId ?? null;
    }
    return result;
  }

  // ------------------------------------------------------------- getTokens
  async getTokens(request: GetTokensRequest, options?: GetTokensOptions): Promise<GetTokensResponse> {
    try {
      printLog(logs.infoLogs.TOKENIZE_TRIGGERED, MessageType.LOG, this.logLevel);
      printLog(logs.infoLogs.VALIDATE_TOKENIZE_INPUT, MessageType.LOG, this.logLevel);
      validateGetTokensRequest(request, this.logLevel);
      await this.client.getToken();

      const genReq: Gen.GetTokensFromValuesRequest = {
        vaultID: this.client.vaultId,
        records: request.records.map((record) => ({
          value: record.value,
          tokenGroupName: record.tokenGroupName,
        })),
      };

      const { data, rawResponse } = await this.client.tokens
        .getTokens(genReq, this.requestOptions(Operation.GET_TOKENS, options))
        .withRawResponse();
      const requestId = this.getRequestId(rawResponse);
      printLog(logs.infoLogs.TOKENIZE_SUCCESS, MessageType.LOG, this.logLevel);

      const records = (data.records ?? []).map((record) =>
        this.mapGetTokensRecord(record, requestId),
      );
      return new GetTokensResponse({ records });
    } catch (error) {
      return this.unaryError(error, (errorRecords, requestId) =>
        new GetTokensResponse({
          records: errorRecords.map((record) => this.mapGetTokensRecord(record as Gen.TokenizeResponseObject, requestId)),
        }));
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private mapGetTokensRecord(
    record: Gen.TokenizeResponseObject,
    requestId?: string,
  ): GetTokensResponseRecord {
    const hasError = record.error !== undefined && record.error !== null;
    const result: GetTokensResponseRecord = {
      value: record.value,
      tokenGroupName: record.tokenGroupName,
      token: record.token ?? null,
      httpCode: record.httpCode ?? 200,
      error: hasError ? record.error : null,
    };
    if (hasError) {
      result.requestId = requestId ?? null;
    }
    return result;
  }

  // ----------------------------------------------------------- uploadFiles
  async uploadFiles(request: UploadFilesRequest, options?: UploadFilesOptions): Promise<UploadFilesResponse> {
    try {
      printLog(logs.infoLogs.UPLOAD_FILE_TRIGGERED, MessageType.LOG, this.logLevel);
      printLog(logs.infoLogs.VALIDATE_FILE_UPLOAD_INPUT, MessageType.LOG, this.logLevel);
      validateUploadFilesRequest(request, undefined, this.logLevel);
      await this.client.getToken();

      // Phase A: prepare file bytes and request signed upload URLs.
      const prepared: PreparedColumn[][] = [];
      for (let i = 0; i < request.records.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        prepared.push(await Promise.all(request.records[i].columns.map((c) => this.prepareColumn(c))));
      }

      const genReq: Gen.FileUploadRequest = {
        vaultID: this.client.vaultId,
        records: request.records.map((record, index) => {
          const genRecord: Gen.FileUploadRecord = {
            tableName: record.tableName,
            columns: prepared[index].map((column) => {
              const col: Gen.FileUploadColumn = { column: column.column };
              if (column.fileName) col.fileName = column.fileName;
              return col;
            }),
          };
          if (record.skyflowId) genRecord.skyflowID = record.skyflowId;
          return genRecord;
        }),
      };

      const { data, rawResponse } = await this.client.files
        .uploadFiles(genReq, this.requestOptions(Operation.UPLOAD_FILES, options))
        .withRawResponse();
      const requestId = this.getRequestId(rawResponse);
      printLog(logs.infoLogs.FILE_UPLOAD_DATA_SUCCESS, MessageType.LOG, this.logLevel);

      // Phase B: PUT each file's bytes to its signed URL.
      const records: UploadFilesResponseRecord[] = [];
      const responseRecords = data.records ?? [];
      for (let i = 0; i < responseRecords.length; i += 1) {
        const responseRecord = responseRecords[i];
        const preparedColumns = prepared[i] ?? [];
        // eslint-disable-next-line no-await-in-loop
        const columns = await this.uploadColumns(responseRecord, preparedColumns);
        const hasError = responseRecord.error !== undefined && responseRecord.error !== null;
        const record: UploadFilesResponseRecord = {
          skyflowId: responseRecord.skyflowID ?? null,
          tableName: responseRecord.tableName ?? null,
          columns,
          httpCode: responseRecord.httpCode,
          error: hasError ? responseRecord.error : null,
        };
        if (hasError) {
          record.requestId = requestId ?? null;
        }
        records.push(record);
      }

      return new UploadFilesResponse({ records });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private async uploadColumns(
    responseRecord: Gen.FileUploadResponseObject,
    preparedColumns: PreparedColumn[],
  ): Promise<UploadFilesResponseColumn[]> {
    const signedUrls = (responseRecord.data ?? {}) as Record<string, unknown>;
    const recordErrored =
      responseRecord.error !== undefined && responseRecord.error !== null;

    const results = await Promise.all(
      preparedColumns.map(async (column) => {
        const result: UploadFilesResponseColumn = {
          column: column.column,
          fileName: column.fileName ?? null,
          uploadStatus: 'SKIPPED',
        };
        if (recordErrored) {
          result.error = responseRecord.error;
          return result;
        }
        const signedUrl = signedUrls[column.column];
        if (typeof signedUrl !== 'string' || signedUrl.length === 0) {
          // No signed URL returned for this column -> SKIPPED, no error
          // (matches the Python flowvault SDK).
          return result;
        }
        try {
          const putResponse = await fetch(signedUrl, {
            method: 'PUT',
            headers: { 'Content-Type': column.contentType },
            body: column.bytes,
          });
          if (putResponse.ok) {
            result.uploadStatus = 'UPLOADED';
          } else {
            result.uploadStatus = 'FAILED';
            result.error = `Upload failed with status ${putResponse.status}.`;
          }
        } catch (putError) {
          result.uploadStatus = 'FAILED';
          result.error = putError instanceof Error ? putError.message : String(putError);
        }
        return result;
      }),
    );
    return results;
  }

  private async prepareColumn(column: UploadFilesColumn): Promise<PreparedColumn> {
    let bytes: Uint8Array = new Uint8Array();
    let fileName = column.fileName;
    if (column.filePath) {
      const buffer = await fs.readFile(column.filePath);
      bytes = new Uint8Array(buffer);
      if (!fileName) fileName = path.basename(column.filePath);
    } else if (column.base64 !== undefined) {
      bytes = new Uint8Array(Buffer.from(column.base64, 'base64'));
    } else if (column.file) {
      const arrayBuffer = await column.file.arrayBuffer();
      bytes = new Uint8Array(arrayBuffer);
      if (!fileName) fileName = column.file.name;
    }
    return {
      column: column.column,
      fileName,
      bytes,
      contentType: this.inferContentType(fileName),
    };
  }

  // eslint-disable-next-line class-methods-use-this
  private inferContentType(fileName?: string): string {
    const ext = (fileName?.split('.').pop() || '').toLowerCase();
    const map: Record<string, string> = {
      pdf: 'application/pdf',
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      gif: 'image/gif',
      txt: 'text/plain',
      csv: 'text/csv',
      json: 'application/json',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };
    return map[ext] || 'application/octet-stream';
  }

  // ----------------------------------------------------------- deleteFiles
  async deleteFiles(request: DeleteFilesRequest, options?: DeleteFilesOptions): Promise<DeleteFilesResponse> {
    try {
      printLog(logs.infoLogs.UPLOAD_FILE_TRIGGERED, MessageType.LOG, this.logLevel);
      printLog(logs.infoLogs.VALIDATE_FILE_UPLOAD_INPUT, MessageType.LOG, this.logLevel);
      validateDeleteFilesRequest(request, this.logLevel);
      await this.client.getToken();

      const genReq: Gen.FileDeleteRequest = {
        vaultID: this.client.vaultId,
        records: request.records.map((record) => {
          const genRecord: Gen.FileDeleteRecord = {
            tableName: record.tableName,
            columns: record.columns,
          };
          if (record.skyflowId) genRecord.skyflowID = record.skyflowId;
          if (record.uniqueValues) {
            genRecord.uniqueValues = record.uniqueValues.map((data) => ({ data }));
          }
          return genRecord;
        }),
      };

      const { data, rawResponse } = await this.client.files
        .deleteFiles(genReq, this.requestOptions(Operation.DELETE_FILES, options))
        .withRawResponse();
      const requestId = this.getRequestId(rawResponse);
      printLog(logs.infoLogs.FILE_UPLOAD_DATA_SUCCESS, MessageType.LOG, this.logLevel);

      const records = (data.records ?? []).map((record) =>
        this.mapDeleteFilesRecord(record, requestId),
      );
      return new DeleteFilesResponse({ records });
    } catch (error) {
      return this.unaryError(error, (errorRecords, requestId) =>
        new DeleteFilesResponse({
          records: errorRecords.map((record) => this.mapDeleteFilesRecord(record as Gen.FileDeleteResponseObject, requestId)),
        }));
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private mapDeleteFilesRecord(
    record: Gen.FileDeleteResponseObject,
    requestId?: string,
  ): DeleteFilesResponseRecord {
    const hasError = record.error !== undefined && record.error !== null;
    const columnMap = record.data as Record<string, unknown> | undefined;
    const result: DeleteFilesResponseRecord = {
      skyflowId: record.skyflowID ?? null,
      tableName: record.tableName ?? null,
      // Status is parsed from each column's response value (object -> .status,
      // else the value itself), mirroring the Python flowvault SDK.
      columns: columnMap
        ? Object.entries(columnMap).map(([column, value]) => ({
            column,
            status:
              value !== null && typeof value === 'object'
                ? (((value as Record<string, unknown>).status as string) ?? null)
                : ((value as string) ?? null),
          }))
        : null,
      httpCode: record.httpCode,
      error: hasError ? record.error : null,
    };
    if (hasError) {
      result.requestId = requestId ?? null;
    }
    return result;
  }
}

export default VaultController;
