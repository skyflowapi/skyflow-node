import { DetectEntities, DetectOutputTranscription, MaskingMethod } from "../../../../utils";
import TokenFormat from "../deidentify-text/token-format";
import Transformations from "../deidentify-text/transformations";
import { Bleep } from  './bleep-audio'


class DeidentifyFileOptions {
    private _entities?: DetectEntities[];
    private _allowRegexList?: string[];
    private _restrictRegexList?: string[];
    private _tokenFormat?: TokenFormat;
    private _transformations?: Transformations;
    private _outputProcessedImage?: boolean;
    private _outputOcrText?: boolean;
    private _maskingMethod?: MaskingMethod;
    private _pixelDensity?: number;
    private _maxResolution?: number;
    private _outputProcessedAudio?: boolean;
    private _outputTranscription?: DetectOutputTranscription;
    private _bleep?: Bleep;
    private _outputDirectory?: string;
    private _density?: number;
    private _waitTime?: number;

    constructor() {
    }

    getDensity(): number | undefined{
        return this._density;
    }
    setDensity(density: number) {
        this._density = density;
    }

    getEntities(): string[] | undefined {
        return this._entities;
    }

    // Setters
    setEntities(entities: DetectEntities[]) {
        this._entities = entities;
    }

    getAllowRegexList(): string[] | undefined {
        return this._allowRegexList;
    }

    setAllowRegexList(allowRegexList: string[]) {
        this._allowRegexList = allowRegexList;
    }

    getRestrictRegexList(): string[] | undefined{
        return this._restrictRegexList;
    }

    setRestrictRegexList(restrictRegexList: string[]) {
        this._restrictRegexList = restrictRegexList;
    }

    getTokenFormat(): TokenFormat | undefined{
        return this._tokenFormat;
    }

    setTokenFormat(tokenFormat: TokenFormat) {
        this._tokenFormat = tokenFormat;
    }

    getTransformations(): object | undefined{
        return this._transformations;
    }

    setTransformations(transformations: Transformations) {
        this._transformations = transformations;
    }

    getOutputProcessedImage(): boolean | undefined {
        return this._outputProcessedImage;
    }

    setOutputProcessedImage(value: boolean | undefined) {
        this._outputProcessedImage = value;
    }

    getOutputOcrText(): boolean | undefined {
        return this._outputOcrText;
    }

    setOutputOcrText(outputOcrText: boolean | undefined) {
        this._outputOcrText = outputOcrText;
    }

    getMaskingMethod(): MaskingMethod | undefined {
        return this._maskingMethod;
    }

    setMaskingMethod(maskingMethod: MaskingMethod | undefined) {
        this._maskingMethod = maskingMethod;
    }

    getPixelDensity(): number | undefined {
        return this._pixelDensity;
    }

    setPixelDensity(pixelDensity: number | undefined) {
        this._pixelDensity = pixelDensity;
    }

    getMaxResolution(): number | undefined {
        return this._maxResolution;
    }

    setMaxResolution(maxResolution: number | undefined) {
        this._maxResolution = maxResolution;
    }

    getOutputProcessedAudio(): boolean | undefined {
        return this._outputProcessedAudio;
    }

    setOutputProcessedAudio(outputProcessedAudio: boolean | undefined) {
        this._outputProcessedAudio = outputProcessedAudio;
    }

    getOutputTranscription(): DetectOutputTranscription | undefined {
        return this._outputTranscription;
    }

    setOutputTranscription(outputTranscription: DetectOutputTranscription | undefined) {
        this._outputTranscription = outputTranscription;
    }

    getBleep(): Bleep | undefined {
        return this._bleep;
    }

    setBleep(bleep: Bleep | undefined) {
        this._bleep = bleep;
    }
    getOutputDirectory(): string | undefined {
        return this._outputDirectory;
    }
    setOutputDirectory(outputDirectory: string | undefined) {
        this._outputDirectory = outputDirectory;
    }

    getWaitTime(): number | undefined {
        return this._waitTime;
    }

    setWaitTime(waitTime: number | undefined) {
        this._waitTime = waitTime;
    }
}

export default DeidentifyFileOptions;
