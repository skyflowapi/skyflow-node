import { DetectEntities, DetectTokenTypeWithoutVault } from "../../../../../utils";

export class TokenTypes {
    private _default?: DetectTokenTypeWithoutVault;
    private _enitityUnqCounter?: DetectEntities[];
    private _entityOnly?: DetectEntities[];

    getDefault(): DetectTokenTypeWithoutVault | undefined {
        return this._default;
    }
    setDefault(defaultValue: DetectTokenTypeWithoutVault) {
        this._default = defaultValue;
    }
    getEntityUnqCounter(): DetectEntities[] | undefined {
        return this._enitityUnqCounter;
    }
    setEntityUnqCounter(entityUnqCounter: DetectEntities[]) {
        this._enitityUnqCounter = entityUnqCounter;
    }
    getEntityOnly(): DetectEntities[] | undefined {
        return this._entityOnly;
    }
    setEntityOnly(entityOnly: DetectEntities[]) {
        this._entityOnly = entityOnly;
    }
}