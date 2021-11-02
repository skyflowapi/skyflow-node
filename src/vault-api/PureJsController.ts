import Client from './client';

import {
  validateGatewayConfig, validateInsertRecords, validateDetokenizeInput, validateGetByIdInput,
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
  IDetokenizeInput, IGetByIdInput, IGatewayConfig, Context, MessageType,
} from './utils/common';

import {
  constructInsertRecordRequest,
  constructInsertRecordResponse,
} from './core/collect';

import {
  fetchRecordsBySkyflowID,
  fetchRecordsByTokenId,
} from './core/reveal';
import SkyflowError from './libs/SkyflowError';
import SKYFLOW_ERROR_CODE from './utils/constants';
import {
  clearEmpties,
  deletePropertyPath, fillUrlWithPathAndQueryParams, flattenObject, formatFrameNameToId,
} from './utils/helpers';

class PureJsController {
  #client: Client;

  #context: Context;

  constructor(client, context) {
    this.#client = client;
    this.#context = context;
    printLog(logs.infoLogs.PUREJS_CONTROLLER_INITIALIZED, MessageType.LOG,
      this.#context.logLevel);
  }

  detokenize(detokenizeInput: IDetokenizeInput): Promise<any> {
   
      return new Promise((resolve, reject) => {
        try {
          printLog(logs.infoLogs.VALIDATE_DETOKENIZE_INPUT, MessageType.LOG,
            this.#context.logLevel);

          validateDetokenizeInput(detokenizeInput);
          fetchRecordsByTokenId(detokenizeInput.records, this.#client)
          .then(
            (resolvedResult) => {
              printLog(logs.infoLogs.FETCH_RECORDS_RESOLVED, MessageType.LOG,
                this.#context.logLevel);
              resolve(resolvedResult);
            },
            (rejectedResult) => {
              printLog(logs.errorLogs.FETCH_RECORDS_REJECTED, MessageType.ERROR,
                this.#context.logLevel);

              reject({ error: rejectedResult });
            },
          );
          
          printLog(parameterizedString(logs.infoLogs.EMIT_PURE_JS_REQUEST, PUREJS_TYPES.DETOKENIZE),
            MessageType.LOG, this.#context.logLevel);
        } catch (e) {
          if(e instanceof Error)
          printLog(e.message, MessageType.ERROR, this.#context.logLevel);
          reject(e);
        }
      });
  }

  insert(records, options): Promise<any> {
      return new Promise((resolve, reject) => {
        try {
          printLog(logs.infoLogs.VALIDATE_RECORDS, MessageType.LOG,
            this.#context.logLevel);

          validateInsertRecords(records);
          
          this.insertData(records,options)
          .then((result) => {
            printLog(logs.infoLogs.INSERT_RECORDS_RESOLVED, MessageType.LOG,
              this.#context.logLevel);

            resolve(result);
          })
          .catch((error) => {
            printLog(logs.errorLogs.INSERT_RECORDS_REJECTED, MessageType.ERROR,
              this.#context.logLevel);
            reject({ error });
          });
          printLog(parameterizedString(logs.infoLogs.EMIT_PURE_JS_REQUEST, PUREJS_TYPES.INSERT),
            MessageType.LOG, this.#context.logLevel);
        } catch (e) {
          if(e instanceof Error)
          printLog(e.message, MessageType.ERROR, this.#context.logLevel);
          reject(e);
        }
      });
  }

  getById(getByIdInput: IGetByIdInput) {
      return new Promise((resolve, reject) => {
        try {
          printLog(logs.infoLogs.VALIDATE_GET_BY_ID_INPUT, MessageType.LOG,
            this.#context.logLevel);

          validateGetByIdInput(getByIdInput);

          fetchRecordsBySkyflowID(
            getByIdInput.records,
            this.#client,
          ).then(
            (resolvedResult) => {
              printLog(logs.infoLogs.GET_BY_SKYFLOWID_RESOLVED, MessageType.LOG,
                this.#context.logLevel);

              resolve(resolvedResult);
            },
            (rejectedResult) => {
              printLog(logs.errorLogs.GET_BY_SKYFLOWID_REJECTED, MessageType.ERROR,
                this.#context.logLevel);

              reject({ error: rejectedResult });
            },
          );
          
          printLog(parameterizedString(logs.infoLogs.EMIT_PURE_JS_REQUEST,
            PUREJS_TYPES.GET_BY_SKYFLOWID),
          MessageType.LOG, this.#context.logLevel);
        } catch (e) {
          if(e instanceof Error)
          printLog(e.message, MessageType.ERROR, this.#context.logLevel);

          reject(e);
        }
      });
  }

  invokeGateway(configuration: IGatewayConfig) {
      return new Promise((resolve, reject) => {
        try {
          printLog(logs.infoLogs.VALIDATE_GATEWAY_CONFIG, MessageType.LOG,
            this.#context.logLevel);

          validateGatewayConfig(configuration);
         
          const config = configuration as IGatewayConfig;
          const filledUrl = fillUrlWithPathAndQueryParams(config.gatewayURL,config.pathParams, config.queryParams);
          config.gatewayURL = filledUrl;
          this.sendInvokeGateWayRequest(config).then((resultResponse) => {
            printLog(logs.infoLogs.SEND_INVOKE_GATEWAY_RESOLVED, MessageType.LOG,
              this.#context.logLevel);

            resolve(resultResponse);
          }).catch((rejectedResponse) => {
            printLog(logs.errorLogs.SEND_INVOKE_GATEWAY_REJECTED, MessageType.ERROR,
              this.#context.logLevel);

            reject({ error: rejectedResponse });
          });
          printLog(parameterizedString(logs.infoLogs.EMIT_PURE_JS_REQUEST,
            PUREJS_TYPES.INVOKE_GATEWAY),
          MessageType.LOG, this.#context.logLevel);
        } catch (error) {
          if(error instanceof Error)
          printLog(error.message, MessageType.ERROR, this.#context.logLevel);

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

  sendInvokeGateWayRequest(config:IGatewayConfig) {
    return new Promise((rootResolve, rootReject) => {
      this.#client.config.getBearerToken().then((authToken) => {
        const invokeRequest = this.#client.request({
          url: config.gatewayURL,
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
export default PureJsController;
