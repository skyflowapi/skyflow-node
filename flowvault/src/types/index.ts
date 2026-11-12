// Shared FlowVault types: record shapes for requests and the unified
// response records. Response envelopes themselves are the Response classes
// under `model/response`.

import { SkyflowRecordError } from 'skyflow-common';

/** A single record to insert. `tokens` enables BYOT (bring your own token).
 * `table` is an optional per-record table name — when any record sets it, the
 * records can target multiple tables in a single insert call (matches the
 * Java/Python flowvault SDKs). */
export interface InsertRecord {
  data: Record<string, unknown>;
  tokens?: Record<string, unknown>;
  table?: string;
  /** Per-record upsert; when any record sets it, request-level upsert is ignored. */
  upsert?: UpsertOptions;
}

/** Upsert configuration for insert operations. */
export interface UpsertOptions {
  updateType: string;
  uniqueColumns: string[];
}

/** Column level redaction used by get. */
export interface ColumnRedaction {
  columnName: string;
  redaction: string;
}

/** A single record to update. `table` is an optional per-record table name
 * (lets a single update call target multiple tables, like insert). */
export interface UpdateRecord {
  skyflowId: string;
  data: Record<string, unknown>;
  tokens?: Record<string, unknown>;
  table?: string;
}

/** Token group redaction used by detokenize. */
export interface TokenGroupRedaction {
  tokenGroupName: string;
  redaction: string;
}

/** A value / token-group pair to tokenize via getTokens. */
export interface GetTokensRecord {
  value: unknown;
  tokenGroupName: string;
}

/** A single file column to upload. Provide exactly one of filePath/base64/file. */
export interface UploadFilesColumn {
  column: string;
  filePath?: string;
  base64?: string;
  file?: File;
  fileName?: string;
}

/** A record (row) with one or more file columns to upload. */
export interface UploadFilesRecord {
  tableName: string;
  skyflowId?: string;
  columns: UploadFilesColumn[];
}

/** A record (row) with one or more file columns to delete. */
export interface DeleteFilesRecord {
  tableName: string;
  columns: string[];
  skyflowId?: string;
  uniqueValues?: Record<string, unknown>[];
}

/** Result of uploading a file to a single column. */
export type UploadStatus = 'UPLOADED' | 'FAILED' | 'SKIPPED';

/**
 * A single parsed token, surfaced per column in insert/get/update responses.
 * Mirrors the `Token` type in the Java/Python flowvault SDKs. The SDK parses the
 * generic wire token map into `Record<column, Token[]>`. `path` is populated only
 * when the vault returns a token path; a column tokenized against a single
 * unnamed group can come back as a bare value (then only `token` is set).
 */
export interface Token {
  token?: string;
  tokenGroupName?: string;
  path?: string;
}

// ---------------------------------------------------------------------------
// Unified response records. Every record carries httpCode and an optional
// error. requestId is populated only when error is present.
// ---------------------------------------------------------------------------

export interface InsertResponseRecord {
  tableName?: string | null;
  skyflowId?: string | null;
  // tokens and data are surfaced separately (matches the Java/Python flowvault
  // SDKs); either may be present depending on the vault configuration.
  tokens?: Record<string, Token[]> | null;
  data?: Record<string, unknown> | null;
  hashedData?: Record<string, unknown> | null;
  httpCode: number;
  error?: string | null;
  requestId?: string | null;
}

export interface GetResponseRecord {
  skyflowId?: string | null;
  tableName?: string | null;
  data?: Record<string, unknown> | null;
  hashedData?: Record<string, unknown> | null;
  tokens?: Record<string, Token[]> | null;
  httpCode: number;
  error?: string | null;
  requestId?: string | null;
}

export interface UpdateResponseRecord {
  skyflowId?: string | null;
  tableName?: string | null;
  tokens?: Record<string, Token[]> | null;
  data?: Record<string, unknown> | null;
  hashedData?: Record<string, unknown> | null;
  httpCode: number;
  error?: string | null;
  requestId?: string | null;
}

// NOTE: the delete response record intentionally has NO tableName — the v2
// delete API (and the Java/Python flowvault SDKs) return only skyflowId.
export interface DeleteResponseRecord {
  skyflowId?: string | null;
  httpCode: number;
  error?: string | null;
  requestId?: string | null;
}

export interface DetokenizeResponseRecord {
  token: string;
  tokenGroupName?: string | null;
  value?: unknown;
  metadata?: { skyflowId?: string | null; tableName?: string | null } | null;
  httpCode: number;
  error?: string | null;
  requestId?: string | null;
}

export interface GetTokensResponseRecord {
  value: unknown;
  tokenGroupName: string | null;
  token?: string | null;
  httpCode: number;
  error?: string | null;
  requestId?: string | null;
}

export interface UploadFilesResponseColumn {
  column: string;
  fileName?: string | null;
  uploadStatus: UploadStatus;
  error?: string | null;
}

export interface UploadFilesResponseRecord {
  skyflowId?: string | null;
  tableName?: string | null;
  columns: UploadFilesResponseColumn[];
  httpCode: number;
  error?: string | null;
  requestId?: string | null;
}

export interface DeleteFilesResponseColumn {
  column: string;
  // Status is parsed from the API response value (e.g. "DELETED"), not assumed.
  status: string | null;
}

export interface DeleteFilesResponseRecord {
  skyflowId?: string | null;
  tableName?: string | null;
  columns: DeleteFilesResponseColumn[] | null;
  httpCode: number;
  error?: string | null;
  requestId?: string | null;
}

/** Metadata block returned by query. */
export interface QueryResponseMetadata {
  columns: string[];
}

/** Record-level error shape re-used by query. */
export type FlowVaultRecordError = SkyflowRecordError;

/** Internal: registry entry for a configured vault. */
export type { SkyflowConfig } from 'skyflow-common';
