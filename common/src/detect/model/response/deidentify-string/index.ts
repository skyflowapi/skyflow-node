import { DetectedEntity, Metrics } from "../../../types";

/** Response of `detect().deidentifyString()`. */
class DeidentifyStringResponse {
    /** The de-identified text with entity values replaced by tokens. */
    readonly processedText: string | null;

    /** Detected entities, never null. */
    readonly entities: DetectedEntity[];

    /** Word and character counts. */
    readonly metrics: Metrics | null;

    constructor(input: { processedText: string | null; entities: DetectedEntity[]; metrics: Metrics | null }) {
        this.processedText = input.processedText;
        this.entities = input.entities;
        this.metrics = input.metrics;
    }
}

export default DeidentifyStringResponse;
