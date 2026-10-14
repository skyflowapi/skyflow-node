class ReidentifyTextRequest {
    // Field
    private _text: string;

    // Constructor
    constructor(text: string) {
        this._text = text;
    }

    // Getter for text
    public get text(): string {
        return this._text;
    }

    // Setter for text
    public set text(value: string) {
        this._text = value;
    }
}

export default ReidentifyTextRequest;