class DeidentifyFileResponse {
    // fields
    file?: string;
    entities?: Array<{
        file: string;
        extension: string;
    }> = [];
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
        file,
        type,
        outputType,
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
        file?: string;
        type?: string;
        outputType?: string;
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
        this.file = file;
        this.type = type;
        this.extension = outputType;
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