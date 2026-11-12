// Contract-agnostic marker base classes for response models.
// Layers (skyvault/flowvault) extend these for their own contract-specific responses.
export class BaseInsertResponse {}
export class BaseGetResponse {}
export class BaseDeleteResponse {}
export class BaseQueryResponse {}
export class BaseDetokenizeResponse {}
export class BaseUpdateResponse {}
export class BaseTokenizeResponse {}
export class BaseFileUploadResponse {}
export class BaseInvokeConnectionResponse {}
export class BaseGetTokensResponse {}
export class BaseUploadFilesResponse {}
export class BaseDeleteFilesResponse {}
