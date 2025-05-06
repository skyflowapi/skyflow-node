import { DetectEntities, TokenType } from "../../../../../utils";

class TokenFormat {
    // Fields
    private _default?: TokenType = TokenType.ENTITY_UNIQUE_COUNTER;
    private _vaultToken?: DetectEntities[];
    private _entityUniqueCounter?: DetectEntities[];
    private _entityOnly?: DetectEntities[];

    // Setters
    setDefault(defaultToken: TokenType) {
        this._default = defaultToken;
    }

    setVaultToken(vaultToken: DetectEntities[]) {
        this._vaultToken = vaultToken;
    }

    setEntityUniqueCounter(entityUniqueCounter: DetectEntities[]) {
        this._entityUniqueCounter = entityUniqueCounter;
    }

    setEntityOnly(entityOnly: DetectEntities[]) {
        this._entityOnly = entityOnly;
    }

    // Getters
    getDefault(): string | undefined {
        return this._default;
    }

    getVaultToken(): string[] | undefined {
        return this._vaultToken;
    }

    getEntityUniqueCounter(): string[] | undefined {
        return this._entityUniqueCounter;
    }

    getEntityOnly(): string[] | undefined {
        return this._entityOnly;
    }
}

export default TokenFormat;