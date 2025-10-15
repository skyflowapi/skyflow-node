
class FileUploadOptions {
    // Fields with default values
    private filePath?: string;
    private base64?: string;
    private fileObject?: File;
    private fileName?: string;

    // Constructor
    constructor() { }

    // Setters
    setFilePath(filePath: string): void {
        this.filePath = filePath;
    }
    setBase64(base64: string): void {
        this.base64 = base64;
    }

    setFileObject(fileObject: File): void {
        this.fileObject = fileObject;
    }

    setFileName(fileName: string): void {
        this.fileName = fileName;
    }



    // Getters
    getFilePath(): string | undefined {
        return this.filePath;
    }

    getBase64(): string | undefined {
        return this.base64;
    }

    getFileObject(): File | undefined {
        return this.fileObject;
    }

    getFileName(): string | undefined {
        return this.fileName;
    }
}


export default FileUploadOptions;