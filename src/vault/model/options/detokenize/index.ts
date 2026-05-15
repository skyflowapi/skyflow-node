import { warnOnce } from '../../../../utils/warn-once';

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
        warnOnce('DetokenizeOptions.setDownloadURL() is deprecated, use setDownloadUrl()');
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
        warnOnce('DetokenizeOptions.getDownloadURL() is deprecated, use getDownloadUrl()');
        return this.getDownloadUrl();
    }
}


export default DetokenizeOptions;