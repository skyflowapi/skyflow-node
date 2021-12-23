
import Client from './client';
import {
  isValidURL,
} from './utils/validators';
import { printLog } from './utils/logsHelper';
import SkyflowError from './libs/SkyflowError';
import logs from './utils/logs';
import SKYFLOW_ERROR_CODE from './utils/constants';
import PureJsController from './PureJsController';
import {
  IRevealResponseType,
  IConnectionConfig,
  RequestMethod,
  IInsertRecordInput,
  IDetokenizeInput,
  IGetByIdInput,
  RedactionType,
  LogLevel,
  MessageType,
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
  #pureJsController: PureJsController;
  #logLevel:LogLevel;

  constructor(config: ISkyflow) {
    this.#client = new Client(
      {
        ...config,
      }
      ,
      this.#metadata,
    );
   this.#logLevel = config?.options?.logLevel || LogLevel.ERROR;
    // this.#logLevel = LogLevel.NONE;
    this.#pureJsController = new PureJsController(this.#client,
      { logLevel: this.#logLevel});

    printLog(logs.infoLogs.BEARER_TOKEN_LISTENER, MessageType.LOG,
      this.#logLevel);
  }

  static init(config: ISkyflow): Skyflow {
   // const logLevel = config?.options?.logLevel || LogLevel.ERROR;
      const logLevel = LogLevel.NONE;
    printLog(logs.infoLogs.INITIALIZE_CLIENT, MessageType.LOG,
      logLevel);
    config.vaultURL = formatVaultURL(config.vaultURL)
    const skyflow = new Skyflow(config);
    printLog(logs.infoLogs.CLIENT_INITIALIZED, MessageType.LOG, logLevel);
    return skyflow;
  }

  insert(
    records: IInsertRecordInput,
    options: Record<string, any> = { tokens: true },
  ) {
    printLog(logs.infoLogs.INSERT_TRIGGERED, MessageType.LOG,
      this.#logLevel);
    return this.#pureJsController.insert(records, options);
  }

  detokenize(detokenizeInput: IDetokenizeInput): Promise<IRevealResponseType> {
    printLog(logs.infoLogs.DETOKENIZE_TRIGGERED,
      MessageType.LOG, this.#logLevel);
    return this.#pureJsController.detokenize(detokenizeInput);
  }

  getById(getByIdInput: IGetByIdInput) {
    printLog(logs.infoLogs.GET_BY_ID_TRIGGERED,
      MessageType.LOG, this.#logLevel);
    return this.#pureJsController.getById(getByIdInput);
  }

  invokeConnection(config: IConnectionConfig) {
    printLog(logs.infoLogs.INVOKE_CONNECTION_TRIGGERED,
      MessageType.LOG, this.#logLevel);

    return this.#pureJsController.invokeConnection(config);
  }

  static get RedactionType() {
    return RedactionType;
  }

  static get RequestMethod() {
    return RequestMethod;
  }

  static get LogLevel() {
    return LogLevel;
  }
}
export default Skyflow;
