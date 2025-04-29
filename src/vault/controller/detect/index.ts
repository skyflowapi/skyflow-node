//imports

import { MessageType, printLog } from "../../../utils";
import logs from "../../../utils/logs";
import VaultClient from "../../client";

class DetectController {

    private client: VaultClient;

    constructor(client: VaultClient) {
        this.client = client;
        printLog(logs.infoLogs.CONTROLLER_INITIALIZED, MessageType.LOG, this.client.getLogLevel());
    }

    static initialize() {
        //return detect object
    }

    deIdentify() {
        return this;
    }

    text() {

    }

    file() {

    }

}

export default DetectController;
