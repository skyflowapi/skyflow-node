// Imports
import { warnOnce } from '../../../../utils/warn-once';

class FileUploadRequest {
    private _table: string;
    private _columnName: string;
    private _legacySkyflowId?: string;

    // Constructor
    constructor(table: string, columnNameOrSkyflowId: string, columnName?: string) {
        this._table = table;

        if (columnName !== undefined) {
            // OLD: (table, skyflowId, columnName)
            warnOnce('FileUploadRequest 3-arg constructor is deprecated. Use FileUploadOptions.setSkyflowId() instead.');
            this._legacySkyflowId = columnNameOrSkyflowId;
            this._columnName = columnName;
        } else {
            // NEW: (table, columnName)
            this._columnName = columnNameOrSkyflowId;
        }
    }

    // Getters and Setters
    public get table(): string {
        return this._table;
    }
    public set table(value: string) {
        this._table = value;
    }

    public get columnName(): string {
        return this._columnName;
    }
    public set columnName(value: string) {
        this._columnName = value;
    }

    /** @deprecated Use FileUploadOptions.setSkyflowId() instead. Will be removed in v3. */
    public get skyflowId(): string {
        warnOnce('FileUploadRequest.skyflowId is deprecated. Use FileUploadOptions.setSkyflowId()');
        return this._legacySkyflowId ?? '';
    }

    /** @deprecated Use FileUploadOptions.setSkyflowId() instead. Will be removed in v3. */
    public set skyflowId(value: string) {
        warnOnce('FileUploadRequest.skyflowId is deprecated. Use FileUploadOptions.setSkyflowId()');
        this._legacySkyflowId = value;
    }
}

export default FileUploadRequest;