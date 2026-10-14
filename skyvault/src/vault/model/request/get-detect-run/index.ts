class GetDetectRunRequest {
    // Field
    private _runId: string;

    // Constructor
    constructor(runId: string) {
        this._runId = runId;
    }

    // Getter for runId
    public get runId(): string {
        return this._runId;
    }

    // Setter for runId
    public set runId(value: string) {
        this._runId = value;
    }
}

export default GetDetectRunRequest;