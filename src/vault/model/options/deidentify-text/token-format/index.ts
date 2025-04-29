class TokenFormat {
    private _default: string;
    private _vaultToken: string[];
    private _entityUniqueCounter: string[];
    private _entityOnly: string[];

    constructor(
        defaultToken: string,
        vaultToken: string[],
        entityUniqueCounter: string[],
        entityOnly: string[]
    ) {
        this._default = defaultToken;
        this._vaultToken = vaultToken;
        this._entityUniqueCounter = entityUniqueCounter;
        this._entityOnly = entityOnly;
    }

    public get default(): string {
        return this._default;
    }

    public set default(value: string) {
        this._default = value;
    }

    public get vaultToken(): string[] {
        return this._vaultToken;
    }

    public set vaultToken(value: string[]) {
        this._vaultToken = value;
    }

    public get entityUniqueCounter(): string[] {
        return this._entityUniqueCounter;
    }

    public set entityUniqueCounter(value: string[]) {
        this._entityUniqueCounter = value;
    }

    public get entityOnly(): string[] {
        return this._entityOnly;
    }

    public set entityOnly(value: string[]) {
        this._entityOnly = value;
    }
}