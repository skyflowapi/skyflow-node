/*
  Copyright (c) 2022 Skyflow, Inc. 
*/

/**
 * This is the doc comment for Utils Module
 * @module Utils
 */

/**
 * This is documentation for RedactionType enumeration.
 */
 export enum RedactionType {
  DEFAULT = 'DEFAULT',
  PLAIN_TEXT = 'PLAIN_TEXT',
  MASKED = 'MASKED',
  REDACTED = 'REDACTED',
}

/**
 * This is documentation for RequestMethod enumeration.
 */
export enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

/**
 * This is documentation for LogLevel enumeration.
 */
export enum LogLevel {
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
  ERROR = 'ERROR',
  OFF = 'OFF'
}

/**
 * This is documentation for MessageType enumeration.
 */
export enum MessageType {
  LOG = 'LOG',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

/**
 * This is documentation for interface IInsertRecordInput.
 *  @property records This is the description for the records property
 */
export interface IInsertRecordInput {
  records: IInsertRecord[];
}

/**
 * This is documentation for interface IInsertRecord.
 *  @property table This is the description for the table property
 *  @property fields This is the description for the fields property
 */
export interface IInsertRecord {
  table: string;
  fields: Record<string, any>;
}

/**
 * This is documentation for interface IRevealRecord.
 *  @property redaction This is the description for the redaction property
 *  @property token This is the description for the token property
 */
export interface IRevealRecord {
  token: string;
  redaction?: RedactionType;
}

/**
 * This is documentation for interface IRevealResponseType.
 *  @property records This is the description for the records property
 *  @property errors This is the description for the errors property
 */
export interface IRevealResponseType {
  records?: Record<string, string>[];
  errors?: Record<string, any>[];
}

/**
 * This is documentation for interface IDetokenizeInput.
 * @property records This is the description for the records property
 */
export interface IDetokenizeInput {
  records: IRevealRecord[];
}

/**
 * This is documentation for interface ISkyflowIdRecord.
 *  @property ids This is the description for the ids property
 *  @property redaction This is the description for the redaction property
 *  @property table This is the description for the table property
 *  @property columnName This is the description for the columnName property
 *  @property columnValues This is the description for the columnValues property
 */
export interface ISkyflowIdRecord {
  ids?: string[];
  redaction: RedactionType;
  table: string;
  columnName?: string;
  columnValues?: string[];
}

/**
 * This is documentation for interface ISkyflowRecord.
 *  @property ids This is the description for the ids property
 *  @property redaction This is the description for the redaction property
 *  @property table This is the description for the table property
 */
export interface ISkyflowRecord {
  ids: string[];
  redaction: RedactionType;
  table: string;
}

/**
 * This is documentation for interface IGetByIdInput.
 *  @property records This is the description for the records property
 */
export interface IGetByIdInput {
  records: ISkyflowRecord[];
}

/**
 * This is documentation for interface IGetInput.
 * @property records This is the description for the records property
 */
export interface IGetInput {
  records: ISkyflowIdRecord[];
}

// export interface Context{
//   logLevel:LogLevel
// }

/**
 * This is documentation for interface IConnectionConfig.
 *  @property connectionURL This is the description for the connectionURL property
 *  @property methodName This is the description for the methodName property
 *  @property pathParams This is the description for the pathParams property
 *  @property queryParams This is the description for the queryParams property
 *  @property requestBody This is the description for the requestBody property
 *  @property requestHeader This is the description for the requestHeader property
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
 * This is documentation for ContentType enumeration.
 */
export enum ContentType {
  APPLICATIONORJSON = 'application/json',
  TEXTORPLAIN = 'text/plain',
  TEXTORXML = 'text/xml',
  FORMURLENCODED = 'application/x-www-form-urlencoded',
  FORMDATA = 'multipart/form-data',
}

/**
 * This is documentation for interface IUpsertOption.
 *  @property table This is the description for the table property
 *  @property column This is the description for the column property
 */
export interface IUpsertOption {
  table: string;
  column: string;
}

/**
 * This is documentation for interface IInsertOptions.
 * @property tokens This is the description for the tokens property
 * @property upsert This is the description for the upsert property
 */
export interface IInsertOptions {
  tokens?: boolean;
  upsert?: IUpsertOption[];
}

/**
 * This is documentation for interface IUpdateRecord.
 *  @property id This is the description for the id property
 *  @property table This is the description for the table property
 *  @property fields This is the description for the fields property
 */
export interface IUpdateRecord{
  id: string,
  table: string,
  fields: Record<string,any>
}

/**
 * This is documentation for interface IUpdateInput.
 *  @property records This is the description for the records property
 */
export interface IUpdateInput{
  records: IUpdateRecord[];
}

/**
 * This is documentation for interface IUpdateOptions.
 *  @property tokens This is the description for the tokens property
 */
export interface IUpdateOptions{
  tokens: boolean
}

export const SDK_METRICS_HEADER_KEY = "sky-metadata";