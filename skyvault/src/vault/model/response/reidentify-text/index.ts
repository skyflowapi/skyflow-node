// imports

class ReidentifyTextResponse {
    //fields
    processedText: string;

    constructor({
        processedText,
    }: {
        processedText: string;
    }) {
        this.processedText = processedText;
    }
}

export default ReidentifyTextResponse;