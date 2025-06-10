//imports

import { IndexRange } from "../../../types";

class DeidentifyTextResponse {
    //fields
    processedText: string;
    entities: Array<{
        token?: string;
        value?: string;
        textIndex?: IndexRange;
        processedIndex?: IndexRange;
        entity?: string;
        scores?: Record<string, number>;
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
            token?: string;
            value?: string;
            textIndex?: IndexRange;
            processedIndex?: IndexRange;
            entity?: string;
            scores?: Record<string, number>;
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

export default DeidentifyTextResponse;