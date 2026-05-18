import { LogLevel, MessageType, printLog } from '../../../../utils';

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
        printLog("[DEPRECATED] Method 'setDownloadURL()' is deprecated and will be removed in an upcoming release. Use 'setDownloadUrl()' instead.", MessageType.WARN, LogLevel.WARN);
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
        printLog("[DEPRECATED] Method 'getDownloadURL()' is deprecated and will be removed in an upcoming release. Use 'getDownloadUrl()' instead.", MessageType.WARN, LogLevel.WARN);
        return this.getDownloadUrl();
    }
}


export default DetokenizeOptions;