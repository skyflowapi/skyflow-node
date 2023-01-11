/*
	Copyright (c) 2022 Skyflow, Inc. 
*/

import Client from './client';
import { printLog } from './utils/logs-helper';
import logs from './utils/logs';
import Controller from './Controller';
import {
  IRevealResponseType,
  IConnectionConfig,
  RequestMethod,
  IInsertRecordInput,
  IDetokenizeInput,
  IGetByIdInput,
  RedactionType,
  MessageType,
  IInsertOptions,
  IUpdateInput,
  IUpdateOptions,
} from './utils/common';
import { formatVaultURL } from './utils/helpers';

export interface ISkyflow {
  vaultID?: string;
  vaultURL?: string;
  getBearerToken: () => Promise<string>;
  options?: Record<string, any>;
}

class Skyflow {
  #client: Client;
  #metadata = { };
  #Controller: Controller;

  constructor(config: ISkyflow) {
    this.#client = new Client(
      {
        ...config,
      }
      ,
      this.#metadata,
    );
    this.#Controller = new Controller(this.#client);

    printLog(logs.infoLogs.BEARER_TOKEN_LISTENER, MessageType.LOG);
  }

  static init(config: ISkyflow): Skyflow {
    printLog(logs.infoLogs.INITIALIZE_CLIENT, MessageType.LOG);
    config.vaultURL = formatVaultURL(config.vaultURL)
    const skyflow = new Skyflow(config);
    printLog(logs.infoLogs.CLIENT_INITIALIZED, MessageType.LOG);
    return skyflow;
  }

  insert(
    records: IInsertRecordInput,
    options?: IInsertOptions,
  ) {
    printLog(logs.infoLogs.INSERT_TRIGGERED, MessageType.LOG);
    return this.#Controller.insert(records, options);
  }

  detokenize(detokenizeInput: IDetokenizeInput): Promise<IRevealResponseType> {
    printLog(logs.infoLogs.DETOKENIZE_TRIGGERED,
      MessageType.LOG);
    return this.#Controller.detokenize(detokenizeInput);
  }

  getById(getByIdInput: IGetByIdInput) {
    printLog(logs.infoLogs.GET_BY_ID_TRIGGERED,
      MessageType.LOG);
    return this.#Controller.getById(getByIdInput);
  }

  get(getByIdInput: IGetByIdInput) {
    printLog(logs.infoLogs.GET_CALL_TRIGGERED,
      MessageType.LOG);
    return this.#Controller.get(getByIdInput);
  }

  invokeConnection(config: IConnectionConfig) {
    printLog(logs.infoLogs.INVOKE_CONNECTION_TRIGGERED,
      MessageType.LOG);

    return this.#Controller.invokeConnection(config);
  }

  update(updateInput: IUpdateInput,options?:IUpdateOptions){
    printLog(logs.infoLogs.UPDATE_TRIGGERED,
      MessageType.LOG);
    return this.#Controller.update(updateInput,options);
  }

  static get RedactionType() {
    return RedactionType;
  }

  static get RequestMethod() {
    return RequestMethod;
  }
}
export default Skyflow;
