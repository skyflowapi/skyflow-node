import { DetectEntities } from "../../../../utils";

class ReidentifyTextOptions {
    // Fields
    private _redactedEntities?: DetectEntities[];
    private _maskedEntities?: DetectEntities[];
    private _plainTextEntities?: DetectEntities[];

    // Setters
    setRedactedEntities(redactedEntities: DetectEntities[]) {
        this._redactedEntities = redactedEntities;
    }

    setMaskedEntities(maskedEntities: DetectEntities[]) {
        this._maskedEntities = maskedEntities;
    }

    setPlainTextEntities(plainTextEntities: DetectEntities[]) {
        this._plainTextEntities = plainTextEntities;
    }

    // Getters
    getRedactedEntities(): DetectEntities[] | undefined {
        return this._redactedEntities;
    }

    getMaskedEntities(): DetectEntities[] | undefined {
        return this._maskedEntities;
    }

    getPlainTextEntities(): DetectEntities[] | undefined {
        return this._plainTextEntities;
    }
}

export default ReidentifyTextOptions;