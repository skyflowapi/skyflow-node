import { DetectEntities } from "../../../../utils";
import TokenFormat from "./token-format";
import Transformations from "./transformations";

class DeidentifyTextOptions {
    // Fields
    private _entities?: DetectEntities[];
    private _allowRegexList?: string[];
    private _restrictRegexList?: string[];
    private _tokenFormat?: TokenFormat;
    private _transformations?: Transformations;

    // Setters
    setEntities(entities: DetectEntities[]) {
        this._entities = entities;
    }

    setAllowRegexList(allowRegexList: string[]) {
        this._allowRegexList = allowRegexList;
    }

    setRestrictRegexList(restrictRegexList: string[]) {
        this._restrictRegexList = restrictRegexList;
    }

    setTokenFormat(tokenFormat: TokenFormat) {
        this._tokenFormat = tokenFormat;
    }

    setTransformations(transformations: Transformations) {
        this._transformations = transformations;
    }

    // Getters
    getEntities(): DetectEntities[] | undefined {
        return this._entities;
    }

    getAllowRegexList(): string[] | undefined {
        return this._allowRegexList;
    }

    getRestrictRegexList(): string[] | undefined {
        return this._restrictRegexList;
    }

    getTokenFormat(): TokenFormat | undefined {
        return this._tokenFormat;
    }

    getTransformations(): Transformations | undefined {
        return this._transformations;
    }
}

export default DeidentifyTextOptions;