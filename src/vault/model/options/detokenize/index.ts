
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

    // Getters
    getContinueOnError(): boolean | undefined {
        return this.continueOnError;
    }

    getDownloadUrl(): boolean | undefined {
        return this.downloadUrl;
    }
}


export default DetokenizeOptions;