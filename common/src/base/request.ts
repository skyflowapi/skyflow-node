// Contract-agnostic marker base classes for request models.
// Layers (skyvault/flowvault) extend these for their own contract-specific requests.
export class BaseInsertRequest {}
export class BaseGetRequest {}
export class BaseDeleteRequest {}
export class BaseQueryRequest {}
export class BaseDetokenizeRequest {}
export class BaseUpdateRequest {}
export class BaseTokenizeRequest {}
export class BaseFileUploadRequest {}
export class BaseInvokeConnectionRequest {}
export class BaseGetTokensRequest {}
export class BaseUploadFilesRequest {}
export class BaseDeleteFilesRequest {}
