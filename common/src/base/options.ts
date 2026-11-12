export class BaseOptions {
    private _requestHeaders?: Record<string, string>;

    setRequestHeaders(h: Record<string, string>): void {
        this._requestHeaders = h;
    }

    getRequestHeaders(): Record<string, string> | undefined {
        return this._requestHeaders;
    }
}
