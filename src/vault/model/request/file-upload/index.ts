// Imports
import { LogLevel, MessageType, printLog } from '../../../../utils';

class FileUploadRequest {
    private _table: string;
    private _columnName: string;
    private _legacySkyflowId?: string;

    // Constructor
    constructor(table: string, columnNameOrSkyflowId: string, columnName?: string) {
        this._table = table;

        if (columnName !== undefined) {
            // OLD: (table, skyflowId, columnName)
            printLog("[DEPRECATED] FileUploadRequest(table, skyflowId, columnName) is deprecated and will be removed in a future release. " +
                "Use FileUploadRequest(table, columnName) with FileUploadOptions.setSkyflowId(skyflowId) instead.", MessageType.WARN, LogLevel.WARN);
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
        printLog("[DEPRECATED] Property 'skyflowId' of FileUploadRequest is deprecated and will be removed in an upcoming release. Use FileUploadOptions.setSkyflowId() instead.", MessageType.WARN, LogLevel.WARN);
        return this._legacySkyflowId ?? '';
    }

    /** @deprecated Use FileUploadOptions.setSkyflowId() instead. Will be removed in v3. */
    public set skyflowId(value: string) {
        printLog("[DEPRECATED] Property 'skyflowId' of FileUploadRequest is deprecated and will be removed in an upcoming release. Use FileUploadOptions.setSkyflowId() instead.", MessageType.WARN, LogLevel.WARN);
        this._legacySkyflowId = value;
    }
}

export default FileUploadRequest;