/** Request for `detect().getRun()`. */
class GetRunRequest {
    private _runId: string;

    constructor(runId: string) {
        this._runId = runId;
    }

    /** The run id returned by a prior `deidentifyFile` call. */
    get runId(): string {
        return this._runId;
    }

    set runId(value: string) {
        this._runId = value;
    }
}

export default GetRunRequest;
