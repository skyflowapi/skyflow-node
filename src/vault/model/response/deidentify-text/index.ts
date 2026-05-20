//imports

import { IndexRange } from "../../../types";
import { SkyflowRecordError } from "../../../../utils";

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
    errors: Array<SkyflowRecordError> | null;

    constructor({
        processedText,
        entities,
        wordCount,
        charCount,
        errors,
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
        errors?: Array<SkyflowRecordError> | null;
    }) {
        this.processedText = processedText;
        this.entities = entities;
        this.wordCount = wordCount;
        this.charCount = charCount;
        this.errors = errors ?? null;
    }

    //getters and setters
}

export default DeidentifyTextResponse;