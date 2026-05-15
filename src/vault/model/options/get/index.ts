// Imports
import { OrderByEnum, RedactionType } from "../../../../utils";
import { warnOnce } from '../../../../utils/warn-once';

class GetOptions {
    // Fields
    private redactionType?: RedactionType; 
    private returnTokens?: boolean; 
    private fields?: Array<string>; 
    private offset?: string;
    private limit?: string;
    private downloadUrl?: boolean;
    private columnName?: string;
    private columnValues?: Array<string>;
    private orderBy?: OrderByEnum;

    // Constructor
    constructor() {}

    // Setters
    setRedactionType(redactionType: RedactionType) {
        this.redactionType = redactionType;
    }

    setReturnTokens(returnTokens: boolean) {
        this.returnTokens = returnTokens;
    }

    setFields(fields: Array<string>) {
        this.fields = fields;
    }

    setOffset(offset: string) {
        this.offset = offset;
    }

    setLimit(limit: string) {
        this.limit = limit;
    }

    setDownloadUrl(downloadUrl: boolean) {
        this.downloadUrl = downloadUrl;
    }

    /** @deprecated Use setDownloadUrl() instead. Will be removed in v3. */
    setDownloadURL(downloadURL: boolean) {
        warnOnce('GetOptions.setDownloadURL() is deprecated, use setDownloadUrl()');
        this.setDownloadUrl(downloadURL);
    }

    setColumnName(columnName: string) {
        this.columnName = columnName;
    }

    setColumnValues(columnValues: Array<string>) {
        this.columnValues = columnValues;
    }

    setOrderBy(orderBy: OrderByEnum) {
        this.orderBy = orderBy;
    }

    // Getters
    getRedactionType(): RedactionType | undefined {
        return this.redactionType;
    }

    getReturnTokens(): boolean | undefined {
        return this.returnTokens;
    }

    getFields(): Array<string> | undefined {
        return this.fields;
    }

    getOffset(): string | undefined {
        return this.offset;
    }

    getLimit(): string | undefined {
        return this.limit;
    }

    getDownloadUrl(): boolean | undefined {
        return this.downloadUrl;
    }

    /** @deprecated Use getDownloadUrl() instead. Will be removed in v3. */
    getDownloadURL(): boolean | undefined {
        warnOnce('GetOptions.getDownloadURL() is deprecated, use getDownloadUrl()');
        return this.getDownloadUrl();
    }

    getColumnName(): string | undefined {
        return this.columnName;
    }

    getColumnValues(): Array<string> | undefined {
        return this.columnValues;
    }

    getOrderBy(): OrderByEnum | undefined {
        return this.orderBy;
    }
}

export default GetOptions;
