export class Bleep {
    private _gain?: number;
    private _frequency?: number;
    private _start_padding?: number;
    private _stop_padding?: number;

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
        return this._start_padding;
    }
    setStartPadding(start_padding: number) {
        this._start_padding = start_padding;
    }
    getStopPadding(): number | undefined {
        return this._stop_padding;
    }
    setStopPadding(stop_padding: number) {
        this._stop_padding = stop_padding;
    }
}