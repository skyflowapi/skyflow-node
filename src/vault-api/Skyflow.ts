/*
	Copyright (c) 2022 Skyflow, Inc. 
*/

/**
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
 * Wraps the parameters required by Skyflow.
 * @property vaultID ID of the vault to connect to.
 * @property vaultURL URL of the vault to connect to.
 * @property getBearerToken Function that retrieves a Skyflow bearer token from your backend.
 * @property options Additional configuration options.
 */
 export interface ISkyflow {
   vaultID?: string;
   vaultURL?: string;
   getBearerToken: () => Promise<string>;
   options?: Record<string, any>;
 }
 
 /**
  * Parent Skyflow class consists of all the methods exposed to the client.
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
  * @internal
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
  * Initializes the Skyflow client.
  * @public
  * @param config Configuration for the Skyflow client.
  * @returns Returns an instance of the Skyflow client.
  */
   static init(config: ISkyflow): Skyflow {
     printLog(logs.infoLogs.INITIALIZE_CLIENT, MessageType.LOG);
     config.vaultURL = formatVaultURL(config.vaultURL)
     const skyflow = new Skyflow(config);
     printLog(logs.infoLogs.CLIENT_INITIALIZED, MessageType.LOG);
     return skyflow;
   }
 
  /**
  * Inserts data into the vault.
  * @public
  * @param records Records to insert.
  * @param options Options for the insertion.
  * @returns Returns the insert response.
  */
   insert(
     records: IInsertRecordInput,
     options?: IInsertOptions,
   ) {
     printLog(logs.infoLogs.INSERT_TRIGGERED, MessageType.LOG);
     return this.#Controller.insert(records, options);
   }
 
  /**
  * Returns values that correspond to the specified tokens.
  * @public
  * @param detokenizeInput Tokens to return values for.
  * @returns Tokens to return values for.
  */
   detokenize(detokenizeInput: IDetokenizeInput): Promise<IRevealResponseType> {
     printLog(logs.infoLogs.DETOKENIZE_TRIGGERED,
       MessageType.LOG);
     return this.#Controller.detokenize(detokenizeInput);
   }
 
  /**
  * Reveals records by Skyflow ID.
  * @public
  * @deprecated Use {@link get} instead.
  * @param getByIdInput Skyflow IDs.
  * @returns Returns the specified records and any errors.
  * @public
  */
   getById(getByIdInput: IGetByIdInput) {
     printLog(logs.infoLogs.GET_BY_ID_TRIGGERED,
       MessageType.LOG);
     return this.#Controller.getById(getByIdInput);
   }
 
  /**
  * Returns records by Skyflow IDs or column values.
  * @public
  * @param getInput Identifiers for the records.
  * @returns Returns the specified records and any errors.
  */
   get(getInput: IGetInput) {
     printLog(logs.infoLogs.GET_CALL_TRIGGERED,
       MessageType.LOG);
     return this.#Controller.get(getInput);
   }
 
  /**
  * Invokes a connection to a third-party service.
  * @public
  * @param config Configuration for the connection.
  * @returns Returns the connection response.
  */
   invokeConnection(config: IConnectionConfig) {
     printLog(logs.infoLogs.INVOKE_CONNECTION_TRIGGERED,
       MessageType.LOG);
 
     return this.#Controller.invokeConnection(config);
   }
 
  /**
  * Updates the configuration of elements inside the composable container.
  * @public
  * @param updateInput Input data for the update operation.
  * @param options Options for the container update.
  * @returns Returns the response for the update operation.
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
 