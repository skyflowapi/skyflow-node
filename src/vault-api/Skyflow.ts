/*
	Copyright (c) 2022 Skyflow, Inc. 
*/

/**
 * This is the doc comment for Skyflow Module
 * @module Skyflow
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
   IGetInput,
 } from './utils/common';
 import { formatVaultURL } from './utils/helpers';
 

 /**
 * This is documentation for interface ISkyflow.
 * @property vaultID This is the vaultID property
 * @property vaultURL This is the vaultURL property
 * @property getBearerToken This is the getBearerToken property
 * @property options This is the options property
 */
 export interface ISkyflow {
   vaultID?: string;
   vaultURL?: string;
   getBearerToken: () => Promise<string>;
   options?: Record<string, any>;
 }
 
 /**
  * This is the documentation for Skyflow Class
  * @class Skyflow
  */
 class Skyflow {
   /**
    * @internal
    */
   #client: Client;
 
   /**
    * @internal
    */
   #metadata = { };
 
   /**
    * @internal
    */
   #Controller: Controller;
 
  /**
  * Some documentation for constructor
  * @param config This is a description of the first parameter.
  */
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
 
 
  /**
  * Some documentation for init method
  * @public
  * @param config This is a description of the first parameter.
  * @returns This is a description of what the method returns.
  */
   static init(config: ISkyflow): Skyflow {
     printLog(logs.infoLogs.INITIALIZE_CLIENT, MessageType.LOG);
     config.vaultURL = formatVaultURL(config.vaultURL)
     const skyflow = new Skyflow(config);
     printLog(logs.infoLogs.CLIENT_INITIALIZED, MessageType.LOG);
     return skyflow;
   }
 
  /**
  * Some documentation for insert method
  * @public
  * @param records This is a description of the first parameter.
  * @param options This is a description of the second parameter.
  * @returns This is a description of what the method returns.
  */
   insert(
     records: IInsertRecordInput,
     options?: IInsertOptions,
   ) {
     printLog(logs.infoLogs.INSERT_TRIGGERED, MessageType.LOG);
     return this.#Controller.insert(records, options);
   }
 
  /**
  * Some documentation for detokenize method
  * @public
  * @param detokenizeInput This is a description of the first parameter.
  * @returns This is a description of what the method returns.
  */
   detokenize(detokenizeInput: IDetokenizeInput): Promise<IRevealResponseType> {
     printLog(logs.infoLogs.DETOKENIZE_TRIGGERED,
       MessageType.LOG);
     return this.#Controller.detokenize(detokenizeInput);
   }
 
  /**
  * Some documentation for getById method
  * @public
  * @deprecated Use {@link get} instead.
  * @param getByIdInput This is a description of the first parameter.
  * @returns This is a description of what the method returns.
  */
   getById(getByIdInput: IGetByIdInput) {
     printLog(logs.infoLogs.GET_BY_ID_TRIGGERED,
       MessageType.LOG);
     return this.#Controller.getById(getByIdInput);
   }
 
  /**
  * Some documentation for get method
  * @public
  * @param getInput This is a description of the first parameter.
  * @returns This is a description of what the method returns.
  */
   get(getInput: IGetInput) {
     printLog(logs.infoLogs.GET_CALL_TRIGGERED,
       MessageType.LOG);
     return this.#Controller.get(getInput);
   }
 
  /**
  * Some documentation for invokeConnection method
  * @public
  * @param config This is a description of the first parameter.
  * @returns This is a description of what the method returns.
  */
   invokeConnection(config: IConnectionConfig) {
     printLog(logs.infoLogs.INVOKE_CONNECTION_TRIGGERED,
       MessageType.LOG);
 
     return this.#Controller.invokeConnection(config);
   }
 
  /**
  * Some documentation for update method
  * @public
  * @param updateInput This is a description of the first parameter.
  * @param options This is a description of the second parameter.
  * @returns This is a description of what the method returns.
  */
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
 