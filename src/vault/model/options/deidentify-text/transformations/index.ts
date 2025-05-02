class Transformations {
    // Fields
    private _shiftDays?: {
        max: number;
        min: number;
        entities: string[];
    };

    // Setters
    setShiftDays(shiftDays: { max: number; min: number; entities: string[] }) {
        this._shiftDays = shiftDays;
    }

    // Getters
    getShiftDays(): { max: number; min: number; entities: string[] } | undefined {
        return this._shiftDays;
    }
}

export default Transformations;