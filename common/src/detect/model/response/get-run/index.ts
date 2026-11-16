import { DeidentifyFileSource, DetectRunStatus, FileOutput, Metrics } from "../../../types";

/** Fields shared by {@link GetRunResponse} and `DeidentifyFileResponse`. */
export interface DetectRunFields {
    /** Run id, always present once the run was submitted. */
    runId: string | null;
    /** Run status. `null` on a submit-only `deidentifyFile` response. */
    status: DetectRunStatus | null;
    /** The run's output type as your SDK's `DeidentifySourceType`; `null` until the run completes or when the value is not one the SDK knows. */
    outputType: DeidentifyFileSource | null;
    /** Every output of the run, empty until complete, never null. */
    output: FileOutput[];
    /** Size, counts, pages, slides, duration. `null` until complete. */
    metrics: Metrics | null;
    /** Failure detail when the status is `FAILED`. */
    message: string | null;
}

/** Response of `detect().getRun()`. */
class GetRunResponse implements DetectRunFields {
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

export default GetRunResponse;
