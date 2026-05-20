class DeidentifyFileResponse {
    // fields
    fileBase64?: string;
    entities?: Array<{
        file: string;
        extension: string;
    }> = [];
    file?: File;
    type?: string;
    extension?: string;
    wordCount?: number;
    charCount?: number;
    sizeInKb?: number;
    durationInSeconds?: number;
    pageCount?: number;
    slideCount?: number;
    runId?: string;
    status?: string;

    constructor({        
        fileBase64,
        file,
        type,
        extension,
        wordCount,
        charCount,
        sizeInKb,
        durationInSeconds,
        pageCount,
        slideCount,
        entities,
        runId,
        status
    } :{
        fileBase64?: string;
        file?: File;
        type?: string;
        extension?: string;
        wordCount?: number;
        charCount?: number;
        sizeInKb?: number;
        durationInSeconds?: number;
        pageCount?: number;
        slideCount?: number;
        entities?: Array<{
            file: string;
            extension: string;
        }>;
        runId?: string;
        status?: string;
    }) {
        this.fileBase64 = fileBase64;
        this.file =  file;
        this.type = type;
        this.extension = extension;
        this.wordCount = wordCount;
        this.charCount = charCount;
        this.sizeInKb = sizeInKb;
        this.durationInSeconds = durationInSeconds;
        this.pageCount = pageCount;
        this.slideCount = slideCount;
        this.entities = entities;
        this.runId = runId;
        this.status = status;
    }

}

export default DeidentifyFileResponse;