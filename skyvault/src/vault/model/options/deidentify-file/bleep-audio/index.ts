export class Bleep {
    private _gain?: number;
    private _frequency?: number;
    private _startPadding?: number;
    private _stopPadding?: number;

    getGain(): number | undefined {
        return this._gain;
    }
    setGain(gain: number) {
        this._gain = gain;
    }
    getFrequency(): number | undefined {
        return this._frequency;
    }
    setFrequency(frequency: number) {
        this._frequency = frequency;
    }       
    getStartPadding(): number | undefined {
        return this._startPadding;
    }
    setStartPadding(startPadding: number) {
        this._startPadding = startPadding;
    }
    getStopPadding(): number | undefined {
        return this._stopPadding;
    }
    setStopPadding(stopPadding: number) {
        this._stopPadding = stopPadding;
    }
}