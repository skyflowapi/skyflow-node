
class DetokenizeOptions {
    // Fields with default values
    private continueOnError?: boolean;
    private downloadURL?: boolean;

    // Constructor
    constructor() { }

    // Setters
    setContinueOnError(continueOnError: boolean) {
        this.continueOnError = continueOnError;
    }

    setDownloadURL(downloadURL: boolean) {
        this.downloadURL = downloadURL;
    }

    // Getters
    getContinueOnError(): boolean | undefined {
        return this.continueOnError;
    }

    getDownloadURL(): boolean | undefined {
        return this.downloadURL;
    }
}


export default DetokenizeOptions;