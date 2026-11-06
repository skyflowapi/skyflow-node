import { DeidentifyFileSource, DetectRunStatus, FileOutput, Metrics } from "../../../types";
import { DetectRunFields } from "../get-run";

/**
 * Response of `detect().deidentifyFile()`. Without `pollOptions` only `runId`
 * is set; with polling it carries the run's status, outputs and metrics.
 */
class DeidentifyFileResponse implements DetectRunFields {
    readonly runId: string | null;

    readonly status: DetectRunStatus | null;

    readonly outputType: DeidentifyFileSource | null;

    readonly output: FileOutput[];

    readonly metrics: Metrics | null;

    readonly message: string | null;

    constructor(input: DetectRunFields) {
        this.runId = input.runId;
        this.status = input.status;
        this.outputType = input.outputType;
        this.output = input.output;
        this.metrics = input.metrics;
        this.message = input.message;
    }
}

export default DeidentifyFileResponse;
