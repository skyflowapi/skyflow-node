/*
  Copyright (c) 2022 Skyflow, Inc. 
*/

/**
 * @module Utils
 */

/**
 * Supported redaction types.
 */
export enum RedactionType {
  DEFAULT = 'DEFAULT',
  PLAIN_TEXT = 'PLAIN_TEXT',
  MASKED = 'MASKED',
  REDACTED = 'REDACTED',
}

/**
 * Supported request methods.
 */
export enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

/**
 * Supported log levels.
 */
export enum LogLevel {
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
  ERROR = 'ERROR',
  OFF = 'OFF'
}

/**
 * Supported message types.
 */
export enum MessageType {
  LOG = 'LOG',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

/**
 * Parameters for the insert record input. 
 *  @property records An array of insert records.
 */
export interface IInsertRecordInput {
  records: IInsertRecord[];
}

/**
 * Parameters for inserting a record.
 *  @property table Table that the data belongs to.
 *  @property fields Fields to insert data into.
 */
export interface IInsertRecord {
  table: string;
  fields: Record<string, any>;
}

/**
 * Parameters by the Reveal record.
 *  @property redaction Redaction type applied to the data. Defaults to `RedactionType.PLAIN_TEXT`.
 *  @property token Token of the revealed data.
 */
export interface IRevealRecord {
  token: string;
  redaction?: RedactionType;
}

/**
 * Parameters by the reveal response.
 *  @property records Records revealed, if any.
 *  @property errors Errors, if any.
 */
export interface IRevealResponseType {
  records?: Record<string, string>[];
  errors?: Record<string, any>[];
}

/**
 * Parameters for detokenizing input.
 * @property records Revealed records.
 */
export interface IDetokenizeInput {
  records: IRevealRecord[];
}

/**
 * Parameters for Skyflow ID record.
 *  @property ids Skyflow IDs of the records to get.
 *  @property redaction Type of redaction for values.
 *  @property table Type of redaction for values.
 *  @property columnName Column the data belongs to.
 *  @property columnValues Values of the records.
 */
export interface ISkyflowIdRecord {
  ids?: string[];
  redaction?: RedactionType;
  table: string;
  columnName?: string;
  columnValues?: string[];
}

/**
 * Parameters by Skyflow record.
 *  @property ids Skyflow IDs of the records to get.
 *  @property redaction Type of redaction for values.
 *  @property table Type of redaction for values.
 */
export interface ISkyflowRecord {
  ids: string[];
  redaction: RedactionType;
  table: string;
}

/**
 * Parameters by the getbyid input.
 *  @property records Records to get.
 */
export interface IGetByIdInput {
  records: ISkyflowRecord[];
}

/**
 * Parameters to retrieve input.
 * @property records Records to retrieve.
 */
export interface IGetInput {
  records: ISkyflowIdRecord[];
}

// export interface Context{
//   logLevel:LogLevel
// }

/**
 * Configuration to establish a connection.
 *  @property connectionURL URL of the outbound/inbound connection.
 *  @property methodName The HTTP request method to be used.
 *  @property pathParams Parameters to be included in the URL path.
 *  @property queryParams Query parameters to be included in the URL.
 *  @property requestBody Data to be included in the request body.
 *  @property requestHeader Headers to be included in the request.
 */
export interface IConnectionConfig {
  connectionURL: string;
  methodName: RequestMethod;
  pathParams?: any;
  queryParams?: any;
  requestBody?: any;
  requestHeader?: any;
}

export const TYPES = {
  INSERT: 'INSERT',
  DETOKENIZE: 'DETOKENIZE',
  GET_BY_ID: 'GET_BY_ID',
  GET: 'GET',
  INVOKE_CONNECTION: 'INVOKE_CONNECTION',
};

/**
 * Supported content types.
 */
export enum ContentType {
  APPLICATIONORJSON = 'application/json',
  TEXTORPLAIN = 'text/plain',
  TEXTORXML = 'text/xml',
  FORMURLENCODED = 'application/x-www-form-urlencoded',
  FORMDATA = 'multipart/form-data',
}

/**
 * Parameters by upsert option.
 *  @property table Table that the data belongs to.
 *  @property column Name of the unique column.
 */
export interface IUpsertOption {
  table: string;
  column: string;
}

/**
 * Parameters by insert options.
 * @property tokens If `true`, returns tokens for the collected data. Defaults to `false`.
 * @property upsert If specified, upserts data. If not specified, inserts data.
 */
export interface IInsertOptions {
  tokens?: boolean;
  upsert?: IUpsertOption[];
}

/**
 * Parameters for updating a record.
 *  @property id Skyflow ID of the record to update.
 *  @property table Table that the data belongs to.
 *  @property fields Fields to update data into.
 */
export interface IUpdateRecord{
  id: string,
  table: string,
  fields: Record<string,any>
}

/**
 * Parameters for updating a record.
 *  @property records An array of update records.
 */
export interface IUpdateInput{
  records: IUpdateRecord[];
}

/**
 * Parameters by update options.
 *  @property tokens If `true`, returns tokens for the collected data. Defaults to `false`.
 */
export interface IUpdateOptions{
  tokens: boolean
}

export interface IGetOptions{
  tokens?: boolean
  encodeURI?: boolean
}
export interface IDeleteRecord {
  id: string;
  table: string;
}

export interface IDeleteInput {
  records: IDeleteRecord[];
}

export interface IDeleteOptions {

}

export const SDK_METRICS_HEADER_KEY = "sky-metadata";
