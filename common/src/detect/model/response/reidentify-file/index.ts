import { DetectRunStatus, ReidentifyFileOutput, Metrics, ReidentifyFileSource } from "../../../types";

/** Response of `detect().reidentifyFile()`. */
class ReidentifyFileResponse {
    /** Status of the re-identification. */
    readonly status: DetectRunStatus;

    /** The output type as your SDK's `ReidentifySourceType`; `null` when the value is not one the SDK knows. */
    readonly outputType: ReidentifyFileSource | null;

    /** Re-identified file outputs, never null. */
    readonly output: ReidentifyFileOutput[];

    /** Size and counts. */
    readonly metrics: Metrics | null;

    constructor(input: {
        status: DetectRunStatus;
        outputType: ReidentifyFileSource | null;
        output: ReidentifyFileOutput[];
        metrics: Metrics | null;
    }) {
        this.status = input.status;
        this.outputType = input.outputType;
        this.output = input.output;
        this.metrics = input.metrics;
    }
}

export default ReidentifyFileResponse;
