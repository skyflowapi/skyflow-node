import { Metrics } from "../../../types";

/** Response of `detect().reidentifyString()`. */
class ReidentifyStringResponse {
    /** The re-identified text. */
    readonly processedText: string | null;

    /** Word and character counts. */
    readonly metrics: Metrics | null;

    constructor(input: { processedText: string | null; metrics: Metrics | null }) {
        this.processedText = input.processedText;
        this.metrics = input.metrics;
    }
}

export default ReidentifyStringResponse;
