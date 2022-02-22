import Client from './client';

import {
  validateConnectionConfig, validateInsertRecords, validateDetokenizeInput, validateGetByIdInput, validateInitConfig,
} from './utils/validators';

import {
  PUREJS_TYPES,
} from './utils/common';
import {
  printLog,
  parameterizedString,
} from './utils/logsHelper';
import logs from './utils/logs';
import {
  IDetokenizeInput, IGetByIdInput, IConnectionConfig, MessageType,
} from './utils/common';

import {
  constructInsertRecordRequest,
  constructInsertRecordResponse,
} from './core/collect';

import {
  fetchRecordsBySkyflowID,
  fetchRecordsByTokenId,
} from './core/reveal';
import {
 fillUrlWithPathAndQueryParams,
} from './utils/helpers';

class Controller {
  #client: Client;

  constructor(client) {
    this.#client = client;
    printLog(logs.infoLogs.PUREJS_CONTROLLER_INITIALIZED, MessageType.LOG);
  }

  detokenize(detokenizeInput: IDetokenizeInput): Promise<any> {
   
      return new Promise((resolve, reject) => {
        try {
          validateInitConfig(this.#client.config)
          printLog(logs.infoLogs.VALIDATE_DETOKENIZE_INPUT, MessageType.LOG);

          validateDetokenizeInput(detokenizeInput);
          fetchRecordsByTokenId(detokenizeInput.records, this.#client)
          .then(
            (resolvedResult) => {
              printLog(logs.infoLogs.FETCH_RECORDS_RESOLVED, MessageType.LOG);
              resolve(resolvedResult);
            },
            (rejectedResult) => {
              reject(rejectedResult);
            },
          );
          
          printLog(parameterizedString(logs.infoLogs.EMIT_PURE_JS_REQUEST, PUREJS_TYPES.DETOKENIZE),
            MessageType.LOG);
        } catch (e) {
          if(e instanceof Error)
          printLog(e.message, MessageType.ERROR);
          reject(e);
        }
      });
  }

  insert(records, options): Promise<any> {
      return new Promise((resolve, reject) => {
        try {
          validateInitConfig(this.#client.config)
          printLog(logs.infoLogs.VALIDATE_RECORDS, MessageType.LOG);

          validateInsertRecords(records);
          
          this.insertData(records,options)
          .then((result) => {
            printLog(logs.infoLogs.INSERT_RECORDS_RESOLVED, MessageType.LOG);

            resolve(result);
          })
          .catch((error) => {
            reject({ error });
          });
          printLog(parameterizedString(logs.infoLogs.EMIT_PURE_JS_REQUEST, PUREJS_TYPES.INSERT),
            MessageType.LOG);
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

          fetchRecordsBySkyflowID(
            getByIdInput.records,
            this.#client,
          ).then(
            (resolvedResult) => {
              printLog(logs.infoLogs.GET_BY_SKYFLOWID_RESOLVED, MessageType.LOG);

              resolve(resolvedResult);
            },
            (rejectedResult) => {
              reject(rejectedResult);
            },
          );
          
          printLog(parameterizedString(logs.infoLogs.EMIT_PURE_JS_REQUEST,
            PUREJS_TYPES.GET_BY_SKYFLOWID),
          MessageType.LOG);
        } catch (e) {
          if(e instanceof Error)
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
          this.sendInvokeConnectionRequest(config).then((resultResponse) => {
            printLog(logs.infoLogs.SEND_INVOKE_CONNECTION_RESOLVED, MessageType.LOG);

            resolve(resultResponse);
          }).catch((rejectedResponse) => {
            printLog(logs.errorLogs.SEND_INVOKE_CONNECTION_REJECTED, MessageType.ERROR);

            reject({ error: rejectedResponse });
          });
          printLog(parameterizedString(logs.infoLogs.EMIT_PURE_JS_REQUEST,
            PUREJS_TYPES.INVOKE_CONNECTION),
          MessageType.LOG);
        } catch (error) {
          if(error instanceof Error)
          printLog(error.message, MessageType.ERROR);

          reject(error);
        }
      });
    
  }


  insertData(records, options) {
    const requestBody = constructInsertRecordRequest(records, options);
    return new Promise((rootResolve, rootReject) => {
     // getAccessToken().then((authToken) => {
      this.#client.config.getBearerToken().then((authToken) => {
        this.#client
          .request({
            body: { records: requestBody },
            requestMethod: 'POST',
            url:
            `${this.#client.config.vaultURL
            }/v1/vaults/${
              this.#client.config.vaultID}`,
            headers: {
              Authorization: `Bearer ${authToken}`,
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
      }).catch((err) => {
        rootReject(err);
      });
    });
  }

  sendInvokeConnectionRequest(config:IConnectionConfig) {
    return new Promise((rootResolve, rootReject) => {
      this.#client.config.getBearerToken().then((authToken) => {
        const invokeRequest = this.#client.request({
          url: config.connectionURL,
          requestMethod: config.methodName,
          body: config.requestBody,
          headers: { ...config.requestHeader, 'X-Skyflow-Authorization': authToken, 'Content-Type': 'application/json' },
        });
        invokeRequest.then((response) => {
          rootResolve(response);
        }).catch((err) => {
          rootReject({ errors: [err] });
        });
      }).catch((err) => {
        rootReject(err);
      });
    });
  }
}
export default Controller;
