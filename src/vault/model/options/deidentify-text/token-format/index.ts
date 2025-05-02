class TokenFormat {
    // Fields
    private _default?: string;
    private _vaultToken?: string[];
    private _entityUniqueCounter?: string[];
    private _entityOnly?: string[];

    // Setters
    setDefault(defaultToken: string) {
        this._default = defaultToken;
    }

    setVaultToken(vaultToken: string[]) {
        this._vaultToken = vaultToken;
    }

    setEntityUniqueCounter(entityUniqueCounter: string[]) {
        this._entityUniqueCounter = entityUniqueCounter;
    }

    setEntityOnly(entityOnly: string[]) {
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