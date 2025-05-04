import { DetectEntities } from "../../../../../utils";

class Transformations {
    // Fields
    private _shiftDays?: {
        max: number;
        min: number;
        entities: DetectEntities[];
    };

    // Setters
    setShiftDays(shiftDays: { max: number; min: number; entities: DetectEntities[] }) {
        this._shiftDays = shiftDays;
    }

    // Getters
    getShiftDays(): { max: number; min: number; entities: DetectEntities[] } | undefined {
        return this._shiftDays;
    }
}

export default Transformations;