class Transformations {
    private _shiftDays: {
        max: number; 
        min: number;
        entities: string[];
    };

    constructor(shiftDays: { max: number; min: number; entities: string[] }) {
        this._shiftDays = shiftDays;
    }

    public get shiftDays(): { max: number; min: number; entities: string[] } {
        return this._shiftDays;
    }

    public set shiftDays(value: { max: number; min: number; entities: string[] }) {
        this._shiftDays = value;
    }
}