import * as fs from 'fs';
import jwt from "jsonwebtoken";
import { V1GetAuthTokenRequest } from '../ _generated_/rest';
import { getBaseUrl, LogLevel, MessageType, printLog } from '../utils';
import Client from './client';
import logs from '../utils/logs';
import { errorLogs } from '../error/log';
import SkyflowError from '../error';
import SKYFLOW_ERROR_CODE from '../error/codes';

export type BearerTokenOptions = {
    ctx?: string,
    roleIDs?: string[],
    logLevel?: LogLevel,
}

export type GenerateTokenOptions = {
    logLevel?: LogLevel,
}

export type SignedDataTokensResponse = {
    token: string,
    signedToken: string
}

export type SignedDataTokensOptions = {
    dataTokens: string[],
    timeToLive?: number,
    ctx?: string,
    logLevel?: LogLevel,
}

export type TokenResponse = {
    accessToken: string,
    tokenType: string
}

function generateBearerToken(credentialsFilePath: string, options?: BearerTokenOptions): Promise<TokenResponse> {
    return new Promise((resolve, reject) => {
        let credentials;

        if (!fs.existsSync(credentialsFilePath)) {
            printLog(errorLogs.FileNotFound, MessageType.ERROR, options?.logLevel);
            reject(new SkyflowError(SKYFLOW_ERROR_CODE.FILE_NOT_FOUND, [credentialsFilePath]));
        }
        credentials = fs.readFileSync(credentialsFilePath, "utf8");

        if (credentials === '') {
            printLog(errorLogs.EmptyFile, MessageType.ERROR, options?.logLevel);
            reject(new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_JSON_FILE, [credentialsFilePath]))
        }

        try {
            JSON.parse(credentials);
        } catch (e) {
            printLog(errorLogs.NotAValidJSON, MessageType.ERROR, options?.logLevel);
            reject(new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_JSON_FILE, [credentialsFilePath]));
        }

        getToken(credentials, options).then((res) => {
            resolve(res)
        }).catch((err) => { reject(err) })
    })
}


function generateBearerTokenFromCreds(credentials, options?: BearerTokenOptions): Promise<TokenResponse> {
    return getToken(credentials, options)
}

function generateToken(credentialsFilePath: string, options?: GenerateTokenOptions): Promise<TokenResponse> {
    printLog(logs.warnLogs.GENERATE_BEARER_DEPRECATED, MessageType.WARN, options?.logLevel)
    return generateBearerToken(credentialsFilePath)
}

function getToken(credentials, options?: BearerTokenOptions): Promise<TokenResponse> {
    return new Promise((resolve, reject) => {
        printLog(logs.infoLogs.GENERATE_BEARER_TOKEN_TRIGGERED, MessageType.LOG, options?.logLevel);
        try {
            if (!credentials || credentials === "" || credentials === "{}") {
                printLog(errorLogs.CredentialsContentEmpty, MessageType.ERROR, options?.logLevel);
                reject(new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_CREDENTIALS_STRING));
            }
            if (typeof (credentials) !== "string") {
                printLog(errorLogs.ExpectedStringParameter, MessageType.ERROR, options?.logLevel);
                reject(new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_CREDENTIALS_STRING));
            }

            if (options?.roleIDs && options.roleIDs?.length == 0) {
                printLog(errorLogs.ScopedRolesEmpty, MessageType.ERROR, options?.logLevel);
                reject(new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_ROLES));
            }

            if (options?.roleIDs && !Array.isArray(options.roleIDs)) {
                printLog(errorLogs.ExpectedRoleIDParameter, MessageType.ERROR, options?.logLevel);
                reject(new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_ROLES_KEY_TYPE));
            }
            let credentialsObj = JSON.parse("{}")
            try {
                credentialsObj = JSON.parse(credentials);
            }
            catch (e) {
                printLog(errorLogs.NotAValidJSON, MessageType.ERROR, options?.logLevel);
                throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_JSON_FORMAT);
            }
            const expiryTime = Math.floor(Date.now() / 1000) + 3600;
            const claims = {
                iss: credentialsObj.clientID,
                key: credentialsObj.keyID,
                aud: credentialsObj.tokenURI,
                exp: expiryTime,
                sub: credentialsObj.clientID,
                ...(options && options.ctx ? { ctx: options.ctx } : {}),
            };
            if (claims.iss == null) {
                printLog(errorLogs.ClientIDNotFound, MessageType.ERROR, options?.logLevel);
                reject(new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_CLIENT_ID));
            }
            else if (claims.key == null) {
                printLog(errorLogs.KeyIDNotFound, MessageType.ERROR, options?.logLevel);
                reject(new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_KEY_ID));
            }
            else if (claims.aud == null) {
                printLog(errorLogs.TokenURINotFound, MessageType.ERROR, options?.logLevel);
                reject(new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_TOKEN_URI));
            }
            else if (credentialsObj.privateKey == null) {
                printLog(errorLogs.PrivateKeyNotFound, MessageType.ERROR, options?.logLevel);
                reject(new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_PRIVATE_KEY));
            }
            else {
                const privateKey = credentialsObj.privateKey.toString("utf8");
                const signedJwt = jwt.sign(claims, privateKey, { algorithm: "RS256" });

                const scopedRoles = options?.roleIDs && getRolesForScopedToken(options.roleIDs);

                const url = getBaseUrl(credentialsObj?.tokenURI);

                if (url === '') {
                    printLog(errorLogs.TokenURINotFound, MessageType.ERROR, options?.logLevel);
                    reject(new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_TOKEN_URI));
                }

                const client = new Client(url);

                const req: V1GetAuthTokenRequest = {
                    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
                    assertion: signedJwt,
                    scope: scopedRoles,
                };
                client.authApi.authenticationServiceGetAuthToken(
                    req,
                    { headers: { "Content-Type": "application/json", } }
                ).then((res: any) => {
                    successResponse(res, options?.logLevel).then((response) => resolve(response)).catch(err => reject(err))
                })
                    .catch((err) => {
                        failureResponse(err).catch(err => reject(err))
                    });
            }
        }
        catch (e) {
            reject(e);
        }
    });
}

function generateSignedDataTokens(credentialsFilePath: string, options: SignedDataTokensOptions): Promise<SignedDataTokensResponse[]> {
    return new Promise((resolve, reject) => {
        let credentials;

        if (!fs.existsSync(credentialsFilePath)) {
            printLog(errorLogs.FileNotFound, MessageType.ERROR, options?.logLevel);
            reject(new SkyflowError(SKYFLOW_ERROR_CODE.FILE_NOT_FOUND, [credentialsFilePath]));
        }
        credentials = fs.readFileSync(credentialsFilePath, "utf8");

        if (credentials === '') {
            printLog(errorLogs.EmptyFile, MessageType.ERROR, options?.logLevel);
            reject(new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_JSON_FILE, [credentialsFilePath]))
        }

        try {
            JSON.parse(credentials);
        } catch (e) {
            printLog(errorLogs.NotAValidJSON, MessageType.ERROR, options?.logLevel);
            reject(new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_JSON_FILE, [credentialsFilePath]));
        }

        getSignedTokens(credentials, options).then((res) => {
            resolve(res)
        }).catch((err) => { reject(err) })
    })

}

function getSignedTokens(credentials, options: SignedDataTokensOptions): Promise<SignedDataTokensResponse[]> {
    return new Promise((resolve, reject) => {
        printLog(logs.infoLogs.GENERATE_SIGNED_DATA_TOKENS_TRIGGERED, MessageType.LOG, options?.logLevel);
        try {
            if (!credentials && credentials == "") {
                printLog(errorLogs.CredentialsContentEmpty, MessageType.ERROR, options?.logLevel);
                reject(new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_CREDENTIALS_STRING));
            }
            if (typeof (credentials) !== "string") {
                printLog(errorLogs.ExpectedStringParameter, MessageType.ERROR, options?.logLevel);
                reject(new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_CREDENTIALS_STRING));
            }

            if (options?.dataTokens && options.dataTokens?.length == 0) {
                printLog(errorLogs.DataTokensEmpty, MessageType.ERROR, options?.logLevel);
                reject(new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_DATA_TOKENS));
            }

            if (options && options.dataTokens == null || undefined) {
                printLog(errorLogs.DataTokensNotFound, MessageType.ERROR, options?.logLevel);
                reject(new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_DATA_TOKENS));
            }

            if (options?.dataTokens && !Array.isArray(options.dataTokens)) {
                printLog(errorLogs.ExpectedDataTokensParameter, MessageType.ERROR, options?.logLevel);
                reject(new SkyflowError(SKYFLOW_ERROR_CODE.DATA_TOKEN_KEY_TYPE));
            }

            if (options?.timeToLive && typeof (options.timeToLive) !== "number") {
                printLog(errorLogs.ExpectedTimeToLiveParameter, MessageType.ERROR, options?.logLevel);
                reject(new SkyflowError(SKYFLOW_ERROR_CODE.TIME_TO_LIVE_KET_TYPE));
            }

            let credentialsObj = JSON.parse("{}")
            try {
                credentialsObj = JSON.parse(credentials);
            }
            catch (e) {
                printLog(errorLogs.NotAValidJSON, MessageType.ERROR, options?.logLevel);
                throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_JSON_FORMAT);
            }

            let expiryTime;
            if (options?.timeToLive && options?.timeToLive !== null) {
                expiryTime = Math.floor(Date.now() / 1000) + options?.timeToLive;
            } else {
                expiryTime = Math.floor(Date.now() / 1000) + 60;
            }
            const prefix = "signed_token_";

            let responseArray: SignedDataTokensResponse[] = [];
            if (options && options?.dataTokens) {
                options.dataTokens.forEach((token) => {
                    const claims = {
                        iss: "sdk",
                        key: credentialsObj.keyID,
                        aud: credentialsObj.tokenURI,
                        exp: expiryTime,
                        sub: credentialsObj.clientID,
                        tok: token,
                        ...(options && options.ctx ? { ctx: options.ctx } : {}),
                    };

                    if (claims.key == null) {
                        printLog(errorLogs.KeyIDNotFound, MessageType.ERROR, options?.logLevel);
                        reject(new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_KEY_ID));
                    }
                    else if (claims.aud == null) {
                        printLog(errorLogs.TokenURINotFound, MessageType.ERROR, options?.logLevel);
                        reject(new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_TOKEN_URI));
                    }
                    else if (credentialsObj.privateKey == null) {
                        printLog(errorLogs.PrivateKeyNotFound, MessageType.ERROR, options?.logLevel);
                        reject(new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_PRIVATE_KEY));
                    }
                    else {
                        const privateKey = credentialsObj.privateKey.toString("utf8");
                        const signedJwt = jwt.sign(claims, privateKey, { algorithm: "RS256" });
                        const responseObject = getSignedDataTokenResponseObject(prefix + signedJwt, token);
                        responseArray.push(responseObject)
                    }
                })
            }
            signedDataTokenSuccessResponse(responseArray, options?.logLevel).then((response) => resolve(response)).catch(err => reject(err))
        }
        catch (e) {
            reject(e);
        }
    });
}

function generateSignedDataTokensFromCreds(credentials, options: SignedDataTokensOptions): Promise<SignedDataTokensResponse[]> {
    return getSignedTokens(credentials, options)
}

function failureResponse(err: any) {
    return new Promise((_, reject) => {
        if (err.response) {
            let data = err.response.data
            const headerMap = err.response.headers
            const requestId = headerMap['x-request-id'];
            const contentType = headerMap["content-type"];
            if (contentType && contentType.includes('application/json')) {
                let description = data;
                if (description?.error?.message) {
                    description =description?.error?.message;
                }
                printLog(description, MessageType.ERROR);
                reject(new SkyflowError({
                    http_code: err.response.status,
                    message: description,
                    request_ID: requestId,
                }));
            } else if (contentType && contentType.includes('text/plain')) {
                let description = data
                printLog(description, MessageType.ERROR);
                reject(new SkyflowError({
                    http_code: err.response.status,
                    message: description,
                    request_ID: requestId
                }));
            } else {
                let description = logs.errorLogs.ERROR_OCCURED;
                printLog(description, MessageType.ERROR);
                reject(new SkyflowError({
                    http_code: err.response.status,
                    message: description,
                    request_ID: requestId
                }));
            }
        } else {
            printLog(err.message, MessageType.ERROR);
            reject(new SkyflowError({
                http_code: "500",
                message: err.message,
            }))
        }
    })
}

function successResponse(res: any, logLevel?: LogLevel): Promise<TokenResponse> {
    printLog(logs.infoLogs.GENERATE_BEARER_TOKEN_SUCCESS, MessageType.LOG, logLevel);
    return new Promise((resolve, _) => {
        resolve({
            accessToken: res.data.accessToken,
            tokenType: res.data.tokenType,
        });
    })
}

function getSignedDataTokenResponseObject(signedToken, actualToken): SignedDataTokensResponse {
    let responseObject: SignedDataTokensResponse = {
        token: actualToken,
        signedToken: signedToken,
    }
    return responseObject;
}

function signedDataTokenSuccessResponse(res: SignedDataTokensResponse[], logLevel?: LogLevel): Promise<SignedDataTokensResponse[]> {
    printLog(logs.infoLogs.GENERATE_SIGNED_DATA_TOKEN_SUCCESS, MessageType.LOG, logLevel);
    return new Promise((resolve, _) => {
        resolve(res);
    })
}

export function getRolesForScopedToken(roleIDs: string[]) {
    let str = ''
    roleIDs?.forEach((role) => {
        str = str + "role:" + role + " "
    })
    return str;
}


export { generateBearerToken, generateToken, generateBearerTokenFromCreds, generateSignedDataTokens, generateSignedDataTokensFromCreds, getToken, successResponse, failureResponse };