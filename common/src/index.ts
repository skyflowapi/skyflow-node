// =============================================================================
// skyflow-common: contract-agnostic shared core for the Skyflow Node SDKs.
// Layers (skyvault/flowvault) consume this surface via `import { ... } from 'skyflow-common'`.
// =============================================================================

// --- Utils: enums, consts, helpers and shared interfaces ---------------------
// Exposes Env, LogLevel, RequestMethod, RedactionType, OrderByEnum, TokenMode,
// TokenType, MaskingMethod, DetectOutputTranscription, DetectEntities, MessageType,
// AuthType, CONFIG, CONTROLLER_TYPES, TYPES, SKYFLOW, SDK, HTTP_STATUS_CODE,
// CONTENT_TYPE, HTTP_HEADER, REQUEST (and other consts); printLog, parameterizedString,
// generateSDKMetrics, getVaultURL, getConnectionBaseURL, getBearerToken, getToken,
// validateToken, removeSDKVersion, getBaseUrl, fillUrlWithPathAndQueryParams,
// isValidURL, objectToXML; plus the ISkyflowError, SkyflowRecordError, AuthInfo types.
export * from "./utils";

// --- Errors ------------------------------------------------------------------
export { default as SkyflowError } from "./error";
export { default as SKYFLOW_ERROR_CODE } from "./error/codes";
export { default as errorMessages } from "./error/messages";
export { default as logs } from "./utils/logs";

// --- JWT helpers -------------------------------------------------------------
export { isExpired, isTokenValid } from "./utils/jwt-utils";

// --- Credentials & config ----------------------------------------------------
export { default as Credentials } from "./config/credentials";
export type {
    ApiKeyCredentials,
    TokenCredentials,
    PathCredentials,
    StringCredentials,
} from "./config/credentials";
export { default as VaultConfig } from "./config/vault";
export { default as ConnectionConfig } from "./config/connection";

// --- Shared, contract-agnostic types -----------------------------------------
// SkyflowConfig, StringKeyValueMapType, FileInput, Filepath, FileObject,
// InsertResponseType, GetResponseData, QueryResponseType, TokenizeRequestType,
// IndexRange, ServiceAccountResponseError.
export * from "./types";

// --- Service account (token generation) --------------------------------------
export {
    generateBearerToken,
    generateBearerTokenFromCreds,
    generateSignedDataTokens,
    generateSignedDataTokensFromCreds,
} from "./service-account";
export type {
    BearerTokenOptions,
    SignedDataTokensOptions,
    GenerateTokenOptions,
    SignedDataTokensResponse,
    TokenResponse,
} from "./service-account";

// --- Generic validators ------------------------------------------------------
export {
    validateSkyflowConfig,
    validateVaultConfig,
    validateConnectionConfig,
    validateUpdateVaultConfig,
    validateUpdateConnectionConfig,
    validateSkyflowCredentials,
    validateCredentialsWithId,
    isValidAPIKey,
    isLogLevel,
    isEnv,
} from "./validations";

// --- SDK identity ------------------------------------------------------------
export { setSdkIdentity, getSdkIdentity } from "./identity";
export type { SdkIdentity } from "./identity";

// --- Base (contract-agnostic) model classes ----------------------------------
export { BaseOptions } from "./base/options";
export * from "./base/request";
export * from "./base/response";

// --- Facade base (shared Skyflow client scaffolding) -------------------------
export { BaseSkyflow } from "./skyflow/base";
export type { BaseVaultEntry, BaseVaultClientLike } from "./skyflow/base";
