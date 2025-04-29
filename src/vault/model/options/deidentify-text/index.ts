import { DetectEntities } from "../../../../utils";

class DeidentifyTextOptions {
    private _entities: DetectEntities[];
    private _allowRegexList: string[];
    private _restrictRegexList: string[];
    private _tokenFormat: TokenFormat;
    private _transformations: Transformations;

    constructor(
        entities: DetectEntities[],
        allowRegexList: string[],
        restrictRegexList: string[],
        tokenFormat: TokenFormat,
        transformations: Transformations
    ) {
        this._entities = entities;
        this._allowRegexList = allowRegexList;
        this._restrictRegexList = restrictRegexList;
        this._tokenFormat = tokenFormat;
        this._transformations = transformations;
    }

    public get entities(): string[] {
        return this._entities;
    }

    public set entities(value: DetectEntities[]) {
        this._entities = value;
    }

    public get allowRegexList(): string[] {
        return this._allowRegexList;
    }

    public set allowRegexList(value: string[]) {
        this._allowRegexList = value;
    }

    public get restrictRegexList(): string[] {
        return this._restrictRegexList;
    }

    public set restrictRegexList(value: string[]) {
        this._restrictRegexList = value;
    }

    public get tokenFormat(): TokenFormat {
        return this._tokenFormat;
    }

    public set tokenFormat(value: TokenFormat) {
        this._tokenFormat = value;
    }

    public get transformations(): Transformations {
        return this._transformations;
    }

    public set transformations(value: Transformations) {
        this._transformations = value;
    }
}

export default DeidentifyTextOptions;