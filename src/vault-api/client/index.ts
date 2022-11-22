/*
	Copyright (c) 2022 Skyflow, Inc. 
*/
import SkyflowError from '../libs/SkyflowError';
import { ISkyflow } from '../Skyflow';
import SKYFLOW_ERROR_CODE from '../utils/constants';
import logs from '../utils/logs';
import {
  printLog
} from '../utils/logs-helper';
import {
  ContentType,
   MessageType
} from '../utils/common';
import axios, { Method } from 'axios';
import { objectToFormData, toLowerKeys } from '../utils/helpers';
export interface IClientRequest {
  body?: any;
  headers?: Record<string, string>;
  requestMethod:Method;
  url: string;
}

class Client {
  config: ISkyflow;

  #metaData: any;

  constructor(config: ISkyflow, metadata) {
    this.config = config;
    this.#metaData = metadata;
  }
  
  convertRequestBody = (body:any,contentType:string) => {
    if (contentType?.includes(ContentType.FORMURLENCODED)) {
      const qs = require('qs');
      return qs.stringify(body)
    } else if (contentType?.includes(ContentType.FORMDATA)) {
      return objectToFormData(body);
    } else {
      return JSON.stringify({ ...body})
    }
  }
  getHeaders = (data:any,headerKeys:any) =>{
    if(headerKeys['content-type'] === "multipart/form-data") {
      return {...headerKeys, ...data.getHeaders()}
    } else {
      return {...headerKeys}
    }
  }

  request = (request: IClientRequest) => new Promise((resolve, reject) => {
    const headerKeys = toLowerKeys(request.headers);
    let contentType = headerKeys['content-type']
    const data = this.convertRequestBody(request.body,contentType) 
    const headers = this.getHeaders(data,headerKeys)
    axios({
      method : request.requestMethod,
      url: request.url,
      data: data,
      headers: this.getHeaders(data,headerKeys)
      }
    ).then((res)=> {
      resolve(res.data)
    }).catch((err)=> {
        this.failureResponse(err).catch((err)=>reject(err))
    })
  });

  failureResponse = (err:any) => new Promise((_,reject) => {
    const contentType = err.response?.headers['content-type']
    const data = err.response.data
    const requestId = err.response?.headers['x-request-id']
    if (contentType && contentType.includes('application/json')) {
      let description = JSON.parse(JSON.stringify(data));
      if (description?.error?.message) {
        description = requestId ? `${description?.error?.message} - requestId: ${requestId}` : description?.error?.message;
      }
      printLog(description, MessageType.ERROR);
      reject(new SkyflowError({
          code: err.response.status,
          description,
        }, [], true));
      } else if (contentType && contentType.includes('text/plain')) {
        let description = requestId ? `${data} - requestId: ${requestId}` : data
        printLog(description, MessageType.ERROR);
        reject(new SkyflowError({
          code: err.response.status,
          description,
        }, [], true));
      } else {
        let description = requestId ? `${logs.errorLogs.ERROR_OCCURED} - requestId: ${requestId}` : logs.errorLogs.ERROR_OCCURED
        printLog(description, MessageType.ERROR);
        reject(new SkyflowError({
          code: err.response.status,
          description,
        }, [], true));
      }
  })
}


export default Client;
