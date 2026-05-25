import { LogLevel, MessageType, printLog } from '../../../../utils';
import logs from '../../../../utils/logs';

class DetokenizeOptions {
    // Fields with default values
    private continueOnError?: boolean;
    private downloadUrl?: boolean;

    // Constructor
    constructor() { }

    // Setters
    setContinueOnError(continueOnError: boolean) {
        this.continueOnError = continueOnError;
    }

    setDownloadUrl(downloadUrl: boolean) {
        this.downloadUrl = downloadUrl;
    }

    /** @deprecated Use setDownloadUrl() instead. Will be removed in v3. */
    setDownloadURL(downloadURL: boolean) {
        printLog(logs.warnLogs.DEPRECATED_SET_DOWNLOAD_URL, MessageType.WARN, LogLevel.WARN);
        this.setDownloadUrl(downloadURL);
    }

    // Getters
    getContinueOnError(): boolean | undefined {
        return this.continueOnError;
    }

    getDownloadUrl(): boolean | undefined {
        return this.downloadUrl;
    }

    /** @deprecated Use getDownloadUrl() instead. Will be removed in v3. */
    getDownloadURL(): boolean | undefined {
        printLog(logs.warnLogs.DEPRECATED_GET_DOWNLOAD_URL, MessageType.WARN, LogLevel.WARN);
        return this.getDownloadUrl();
    }
}


export default DetokenizeOptions;