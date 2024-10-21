//imports

class UpdateRequest {

    //fields
    private _tableName: string;
    private _skyflowId: string;
    private _updateData: object;

    // Constructor
    constructor(tableName: string, skyflowId: string, updateData: object) {
        this._tableName = tableName;
        this._skyflowId = skyflowId;
        this._updateData = updateData;
    }

    // Getter for tableName
    public get tableName(): string {
        return this._tableName;
    }

    // Setter for tableName
    public set tableName(value: string) {
        this._tableName = value;
    }

    // Getter for skyflowId
    public get skyflowId(): string {
        return this._skyflowId;
    }

    // Setter for skyflowId
    public set skyflowId(value: string) {
        this._skyflowId = value;
    }

    // Getter for updateData
    public get updateData(): object {
        return this._updateData;
    }

    // Setter for updateData
    public set updateData(value: object) {
        this._updateData = value;
    }

}

export default UpdateRequest;
