//imports

class DeidentifiedTextResponse {
    //fields
    processedText: string;
    entities: Array<{
        token: string;
        value: string;
        textIndex: object;
        processedIndex: object;
        entity: string;
        scores: object;
    }>;
    wordCount: number;
    charCount: number;

    constructor({
        processedText,
        entities,
        wordCount,
        charCount,
    }: {
        processedText: string;
        entities: Array<{
            token: string;
            value: string;
            textIndex: object;
            processedIndex: object;
            entity: string;
            scores: object;
        }>;
        wordCount: number;
        charCount: number;
    }) {
        this.processedText = processedText;
        this.entities = entities;
        this.wordCount = wordCount;
        this.charCount = charCount;
    }

    //getters and setters
}

export default DeidentifiedTextResponse;