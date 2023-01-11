/*
  Copyright (c) 2022 Skyflow, Inc. 
*/
import Client from './client';

import {
  validateConnectionConfig, validateInsertRecords, validateDetokenizeInput, validateGetByIdInput, validateInitConfig, validateUpsertOptions, validateUpdateInput, validateGetInput,
} from './utils/validators';

import {
  ContentType,
  IGetInput,
  IInsertOptions,
  IUpdateInput,
  IUpdateOptions,
  TYPES,
} from './utils/common';
import {
  printLog,
  parameterizedString,
} from './utils/logs-helper';
import logs from './utils/logs';
import {
  IDetokenizeInput, IGetByIdInput, IConnectionConfig, MessageType,
} from './utils/common';

import {
  constructInsertRecordRequest,
  constructInsertRecordResponse,
} from './core/Collect';

import {
  fetchRecordsBySkyflowID,
  fetchRecordsByTokenId,
  updateRecordsBySkyflowID,
} from './core/Reveal';
import {
  fillUrlWithPathAndQueryParams, toLowerKeys,
} from './utils/helpers';
import { isTokenValid } from './utils/jwt-utils';
import SKYFLOW_ERROR_CODE from './utils/constants';
import SkyflowError from './libs/SkyflowError';

class Controller {
  #client: Client;

  constructor(client) {
    this.#client = client;
    printLog(logs.infoLogs.CONTROLLER_INITIALIZED, MessageType.LOG);
  }
  #bearerToken = ""

  detokenize(detokenizeInput: IDetokenizeInput): Promise<any> {

    return new Promise((resolve, reject) => {
      try {
        validateInitConfig(this.#client.config)
        printLog(logs.infoLogs.VALIDATE_DETOKENIZE_INPUT, MessageType.LOG);
        validateDetokenizeInput(detokenizeInput);
        printLog(parameterizedString(logs.infoLogs.EMIT_REQUEST, TYPES.DETOKENIZE),
          MessageType.LOG);
        this.getToken().then((res)=>{
          fetchRecordsByTokenId(detokenizeInput.records, this.#client,res)
            .then(
              (resolvedResult) => {
                printLog(logs.infoLogs.FETCH_RECORDS_RESOLVED, MessageType.LOG);
                resolve(resolvedResult);
              },
              (rejectedResult) => {
                reject(rejectedResult);
              },
            );
        }).catch(err=>reject(err))
      } catch (e) {
        if(e instanceof Error)
          printLog(e.message, MessageType.ERROR);
        reject(e);
      }
    });
  }

  insert(records, options?:IInsertOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        validateInitConfig(this.#client.config);
        if (options && options.tokens && typeof options.tokens !== 'boolean') {
          throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TOKENS_IN_INSERT, [], true);
        }
        if (options) {
          options = { ...options, tokens: options?.tokens !== undefined ? options.tokens : true };
        } else {
          options = { tokens: true,};
        }
        if (options?.upsert) {
          validateUpsertOptions(options.upsert);
        }
        printLog(logs.infoLogs.VALIDATE_RECORDS, MessageType.LOG);
        validateInsertRecords(records);
        printLog(parameterizedString(logs.infoLogs.EMIT_REQUEST, TYPES.INSERT),
          MessageType.LOG);
        this.insertData(records,options)
          .then((result) => {
            printLog(logs.infoLogs.INSERT_RECORDS_RESOLVED, MessageType.LOG);
            resolve(result);
          })
          .catch((error) => {
            reject(error);
          });
      } catch (e) {
        if(e instanceof Error)
          printLog(e.message, MessageType.ERROR);
        reject(e);
      }
    });
  }

  getById(getByIdInput: IGetByIdInput) {
    return new Promise((resolve, reject) => {
      try {
        validateInitConfig(this.#client.config)
        printLog(logs.infoLogs.VALIDATE_GET_BY_ID_INPUT, MessageType.LOG);
        validateGetByIdInput(getByIdInput);
        printLog(parameterizedString(logs.infoLogs.EMIT_REQUEST,
          TYPES.GET_BY_ID),
          MessageType.LOG);
        this.getToken().then((res)=>{
          fetchRecordsBySkyflowID(
            getByIdInput.records,
            this.#client,
            res
          ).then(
            (resolvedResult) => {
              printLog(logs.infoLogs.GET_BY_SKYFLOWID_RESOLVED, MessageType.LOG);
              resolve(resolvedResult);
            },
            (rejectedResult) => {
              reject(rejectedResult);
            },
          );
        }).catch(err => {
          reject(err)
        })
      } catch (e) {
        if (e instanceof Error)
          printLog(e.message, MessageType.ERROR);
        reject(e);
      }
    });
  }

  get(getInput: IGetInput) {
    return new Promise((resolve, reject) => {
      try {
        validateInitConfig(this.#client.config)
        printLog(logs.infoLogs.VALIDATE_GET_INPUT, MessageType.LOG);
        validateGetInput(getInput);
        printLog(parameterizedString(logs.infoLogs.EMIT_REQUEST,
          TYPES.GET),
          MessageType.LOG);
        this.getToken().then((res) => {
          fetchRecordsBySkyflowID(
            getInput.records,
            this.#client,
            res
          ).then(
            (resolvedResult) => {
              printLog(logs.infoLogs.GET_BY_SKYFLOWID_RESOLVED, MessageType.LOG);
              resolve(resolvedResult);
            },
            (rejectedResult) => {
              reject(rejectedResult);
            },
          );
        }).catch(err => {
          reject(err)
        })
      } catch (e) {
        if (e instanceof Error)
          printLog(e.message, MessageType.ERROR);
        reject(e);
      }
    });
  }

  invokeConnection(configuration: IConnectionConfig) {
    return new Promise((resolve, reject) => {
      try {
        printLog(logs.infoLogs.VALIDATE_CONNECTION_CONFIG, MessageType.LOG);
        validateConnectionConfig(configuration);
        const config = configuration as IConnectionConfig;
        const filledUrl = fillUrlWithPathAndQueryParams(config.connectionURL,config.pathParams, config.queryParams);
        config.connectionURL = filledUrl;
        printLog(parameterizedString(logs.infoLogs.EMIT_REQUEST,
          TYPES.INVOKE_CONNECTION),
          MessageType.LOG);
        this.sendInvokeConnectionRequest(config).then((resultResponse) => {
          printLog(logs.infoLogs.SEND_INVOKE_CONNECTION_RESOLVED, MessageType.LOG);
          resolve(resultResponse);
        }).catch((rejectedResponse) => {
          printLog(logs.errorLogs.SEND_INVOKE_CONNECTION_REJECTED, MessageType.ERROR);
          reject({ error: rejectedResponse });
        });
      } catch (error) {
        if(error instanceof Error)
          printLog(error.message, MessageType.ERROR);
        reject(error);
      }
    });

  }

  update(updateInput: IUpdateInput, options?: IUpdateOptions){
    return new Promise((resolve,reject)=>{
      try{
        validateInitConfig(this.#client.config);
        if (options && options.tokens && typeof options.tokens !== 'boolean') {
          throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TOKENS_IN_UPDATE);
        }
        if (options) {
          options = { ...options, tokens: options?.tokens !== undefined ? options.tokens : true };
        } else {
          options = { tokens: true,};
        }
        validateUpdateInput(updateInput);
        this.getToken().then((authToken)=>{
          updateRecordsBySkyflowID(updateInput.records,options,this.#client,authToken)
            .then((response)=>{
              printLog(logs.infoLogs.UPDATE_REQUEST_RESOLVED, MessageType.LOG);
              resolve(response);
            }).catch((error)=>{
              printLog(logs.errorLogs.UPDATE_REQUEST_REJECTED, MessageType.ERROR);
              reject(error);
            });
        }).catch((err)=>{
          reject(err);
        })

      }catch(error){
        if(error instanceof Error)
          printLog(error.message, MessageType.ERROR);
        reject(error);
      }
    });
  }

  insertData(records, options) {
    const requestBody = constructInsertRecordRequest(records, options);
    return new Promise((rootResolve, rootReject) => {
      this.getToken().then((res)=>{
        this.#client
          .request({
            body: { records: requestBody },
            requestMethod: 'POST',
            url:
              `${this.#client.config.vaultURL
              }/v1/vaults/${
                this.#client.config.vaultID}`,
            headers: {
              Authorization: `Bearer ${res}`,
            },
          })
          .then((response: any) => {
            rootResolve(
              constructInsertRecordResponse(
                response,
                options.tokens,
                records.records,
              ),
            );
          })
          .catch((error) => {
            rootReject(error);
          });
      }).catch(err =>{
        rootReject(err)
      })
    });
  }

  sendInvokeConnectionRequest(config:IConnectionConfig) {
    return new Promise((rootResolve, rootReject) => {

      this.getToken().then((res)=>{
        const invokeRequest = this.#client.request({
          url: config.connectionURL,
          requestMethod: config.methodName,
          body: config.requestBody,
          headers: { 'x-skyflow-authorization': res, 'content-type': ContentType.APPLICATIONORJSON,...toLowerKeys(config.requestHeader) },
        });
        invokeRequest.then((response) => {
          rootResolve(response);
        }).catch((err) => {
          rootReject({ errors: [err] });
        });
      }).catch(err =>{
        rootReject(err);
      })
    });
  }


  getToken() : Promise<string> {
    return new Promise((resolve,reject)=>{
      if(isTokenValid(this.#bearerToken)) {
        resolve(this.#bearerToken)
      }
      else {
        this.#client.config.getBearerToken().then((authToken) => {
          if(isTokenValid(authToken)) {
            resolve(authToken)
          }
          else {
            reject(new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_BEARER_TOKEN))
          }
        }).catch((err)=>{
          reject(err)
        })
      }
    })
  }
}
export default Controller;
