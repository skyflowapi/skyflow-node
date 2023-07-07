/*
  Copyright (c) 2022 Skyflow, Inc. 
*/
export enum RedactionType {
  DEFAULT = 'DEFAULT',
  PLAIN_TEXT = 'PLAIN_TEXT',
  MASKED = 'MASKED',
  REDACTED = 'REDACTED',
}

export enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export enum LogLevel {
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
  ERROR = 'ERROR',
  OFF = 'OFF'
}


export enum MessageType {
  LOG = 'LOG',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export interface IInsertRecordInput {
  records: IInsertRecord[];
}

export interface IInsertRecord {
  table: string;
  fields: Record<string, any>;
}

export interface IRevealRecord {
  token: string;
  redaction?: RedactionType;
}

export interface IRevealResponseType {
  records?: Record<string, string>[];
  errors?: Record<string, any>[];
}

export interface IDetokenizeInput {
  records: IRevealRecord[];
}

export interface ISkyflowIdRecord {
  ids?: string[];
  redaction: RedactionType;
  table: string;
  columnName?: string;
  columnValues?: string[];
}

export interface ISkyflowRecord {
  ids: string[];
  redaction: RedactionType;
  table: string;
}

export interface IGetByIdInput {
  records: ISkyflowRecord[];
}

export interface IGetInput {
  records: ISkyflowIdRecord[];
}

// export interface Context{
//   logLevel:LogLevel
// }

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

export enum ContentType {
  APPLICATIONORJSON = 'application/json',
  TEXTORPLAIN = 'text/plain',
  TEXTORXML = 'text/xml',
  FORMURLENCODED = 'application/x-www-form-urlencoded',
  FORMDATA = 'multipart/form-data',
}

export interface IUpsertOption {
  table: string;
  column: string;
}

export interface IInsertOptions {
  tokens?: boolean;
  upsert?: IUpsertOption[];
}

export interface IUpdateRecord{
  id: string,
  table: string,
  fields: Record<string,any>
}
export interface IUpdateInput{
  records: IUpdateRecord[];
}

export interface IUpdateOptions{
  tokens: boolean
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