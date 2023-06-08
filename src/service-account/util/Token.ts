/*
  Copyright (c) 2022 Skyflow, Inc. 
*/
import fs from "fs";
import Axios from "axios";
import jwt from "jsonwebtoken";
import { errorMessages } from "../errors/Messages";
import { printLog } from "../../vault-api/utils/logs-helper";
import logs from "../../vault-api/utils/logs";
import { MessageType, SDK_METRICS_HEADER_KEY } from "../../vault-api/utils/common";
import SkyflowError from '../../vault-api/libs/SkyflowError';
import { generateSDKMetrics } from "../../vault-api/utils/helpers";

export type ResponseToken = { accessToken: string, tokenType: string }
export type ResponseSignedDataTokens = { token: string, signedToken: string }



export type BearerTokenOptions = {
  ctx?: string,
  roleIDs?: string[],
}

export type SignedDataTokensOptions = {
  dataTokens: string[],
  timeToLive?: number,
  ctx?: string,
}

function generateBearerToken(credentialsFilePath, options?: BearerTokenOptions): Promise<ResponseToken> {
  return new Promise((resolve, reject) => {
    let credentials;

    if (!fs.existsSync(credentialsFilePath)) {
      printLog(errorMessages.FileNotFound, MessageType.ERROR);
      reject(new SkyflowError({ code: 400, description: errorMessages.FileNotFound }));
    }
    credentials = fs.readFileSync(credentialsFilePath, "utf8");

    if (credentials === '') {
      printLog(errorMessages.EmptyFile, MessageType.ERROR);
      reject(new SkyflowError({ code: 400, description: errorMessages.EmptyFile }))
    }

    try {
      JSON.parse(credentials);
    } catch (e) {
      printLog(errorMessages.NotAValidJSON, MessageType.ERROR);
      reject(new SkyflowError({ code: 400, description: errorMessages.NotAValidJSON }));
    }

    getToken(credentials, options).then((res) => {
      resolve(res)
    }).catch((err) => { reject(err) })
  })
}

function getToken(credentials, options?: BearerTokenOptions): Promise<ResponseToken> {
  return new Promise((resolve, reject) => {
    printLog(logs.infoLogs.GENERATE_BEARER_TOKEN_TRIGGERED, MessageType.LOG);
    try {
      if (!credentials && credentials == "") {
        printLog(errorMessages.CredentialsContentEmpty, MessageType.ERROR);
        reject(new SkyflowError({ code: 400, description: errorMessages.CredentialsContentEmpty }));
      }
      if (typeof (credentials) !== "string") {
        printLog(errorMessages.ExpectedStringParameter, MessageType.ERROR);
        reject(new SkyflowError({ code: 400, description: errorMessages.ExpectedStringParameter }));
      }

      if (options?.roleIDs && options.roleIDs?.length == 0) {
        printLog(errorMessages.ScopedRolesEmpty, MessageType.ERROR);
        reject(new SkyflowError({ code: 400, description: errorMessages.ScopedRolesEmpty }));
      }

      if (options?.roleIDs && !Array.isArray(options.roleIDs)) {
        printLog(errorMessages.ExpectedRoleIDParameter, MessageType.ERROR);
        reject(new SkyflowError({ code: 400, description: errorMessages.ExpectedRoleIDParameter }));
      }
      let credentialsObj = JSON.parse("{}")
      try {
        credentialsObj = JSON.parse(credentials);
      }
      catch (e) {
        printLog(errorMessages.NotAValidJSON, MessageType.ERROR);
        throw new SkyflowError({ code: 400, description: errorMessages.NotAValidJSON });
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
        printLog(errorMessages.ClientIDNotFound, MessageType.ERROR);
        reject(new SkyflowError({ code: 400, description: errorMessages.ClientIDNotFound }));
      }
      else if (claims.key == null) {
        printLog(errorMessages.KeyIDNotFound, MessageType.ERROR);
        reject(new SkyflowError({ code: 400, description: errorMessages.KeyIDNotFound }));
      }
      else if (claims.aud == null) {
        printLog(errorMessages.TokenURINotFound, MessageType.ERROR);
        reject(new SkyflowError({ code: 400, description: errorMessages.TokenURINotFound }));
      }
      else if (credentialsObj.privateKey == null) {
        printLog(errorMessages.PrivateKeyNotFound, MessageType.ERROR);
        reject(new SkyflowError({ code: 400, description: errorMessages.PrivateKeyNotFound }));
      }
      else {
        const privateKey = credentialsObj.privateKey.toString("utf8");

        const signedJwt = jwt.sign(claims, privateKey, { algorithm: "RS256" });

        const scopedRoles = options?.roleIDs && getRolesForScopedToken(options.roleIDs)
        Axios(`${credentialsObj.tokenURI}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            [SDK_METRICS_HEADER_KEY]: JSON.stringify(generateSDKMetrics()),
          },
          data: {
            grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
            assertion: signedJwt,
            scope: scopedRoles,
          },
        })
          .then((res) => {
            successResponse(res).then((response) => resolve(response)).catch(err => reject(err))
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

export function getRolesForScopedToken(roleIDs: string[]) {
  let str = ''
  roleIDs.forEach((role) => {
    str = str + "role:" + role + " "
  })
  return str;
}

function successResponse(res: any): Promise<ResponseToken> {
  printLog(logs.infoLogs.GENERATE_BEARER_TOKEN_SUCCESS, MessageType.LOG);
  return new Promise((resolve, _) => {
    resolve({
      accessToken: res.data.accessToken,
      tokenType: res.data.tokenType,
    });
  })
}

function getSignedDataTokenResponseObject(signedToken, actualToken): ResponseSignedDataTokens {
  let responseObject: ResponseSignedDataTokens = {
    token: actualToken,
    signedToken: signedToken,
  }
  return responseObject;
}

function signedDataTokenSuccessResponse(res: ResponseSignedDataTokens[]): Promise<ResponseSignedDataTokens[]> {
  printLog(logs.infoLogs.GENERATE_SIGNED_DATA_TOKEN_SUCCESS, MessageType.LOG);

  return new Promise((resolve, _) => {
    resolve(res);
  })
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
          description = requestId ? `${description?.error?.message} - requestId: ${requestId}` : description?.error?.message;
        }
        printLog(description, MessageType.ERROR);
        reject(new SkyflowError({
          code: err.response.status,
          description: description,
        }, [], true));
      } else if (contentType && contentType.includes('text/plain')) {
        let description = requestId ? `${data} - requestId: ${requestId}` : data
        printLog(description, MessageType.ERROR);
        reject(new SkyflowError({
          code: err.response.status,
          description,
        }, [], true));
      } else {
        let description = requestId ? `${logs.errorLogs.ERROR_OCCURED} - requestId: ${requestId}` : logs.errorLogs.ERROR_OCCURED
        printLog(description, MessageType.ERROR);
        reject(new SkyflowError({
          code: err.response.status,
          description,
        }, [], true));
      }
    } else {
      printLog(err.message, MessageType.ERROR);
      reject(new SkyflowError({
        code: "500",
        description: err.message,
      }))
    }
  })
}
function generateToken(credentialsFilePath): Promise<ResponseToken> {
  printLog(logs.warnLogs.GENERATE_BEARER_DEPRECATED, MessageType.WARN)
  return generateBearerToken(credentialsFilePath)
}

function generateBearerTokenFromCreds(credentials, options?: BearerTokenOptions): Promise<ResponseToken> {
  return getToken(credentials, options)
}

function generateSignedDataTokens(credentialsFilePath, options: SignedDataTokensOptions): Promise<ResponseSignedDataTokens[]> {
  return new Promise((resolve, reject) => {
    let credentials;

    if (!fs.existsSync(credentialsFilePath)) {
      printLog(errorMessages.FileNotFound, MessageType.ERROR);
      reject(new SkyflowError({ code: 400, description: errorMessages.FileNotFound }));
    }
    credentials = fs.readFileSync(credentialsFilePath, "utf8");

    if (credentials === '') {
      printLog(errorMessages.EmptyFile, MessageType.ERROR);
      reject(new SkyflowError({ code: 400, description: errorMessages.EmptyFile }))
    }

    try {
      JSON.parse(credentials);
    } catch (e) {
      printLog(errorMessages.NotAValidJSON, MessageType.ERROR);
      reject(new SkyflowError({ code: 400, description: errorMessages.NotAValidJSON }));
    }

    getSignedTokens(credentials, options).then((res) => {
      resolve(res)
    }).catch((err) => { reject(err) })
  })

}

function getSignedTokens(credentials, options: SignedDataTokensOptions): Promise<ResponseSignedDataTokens[]> {
  return new Promise((resolve, reject) => {
    printLog(logs.infoLogs.GENERATE_SIGNED_DATA_TOKENS_TRIGGERED, MessageType.LOG);
    try {
      if (!credentials && credentials == "") {
        printLog(errorMessages.CredentialsContentEmpty, MessageType.ERROR);
        reject(new SkyflowError({ code: 400, description: errorMessages.CredentialsContentEmpty }));
      }
      if (typeof (credentials) !== "string") {
        printLog(errorMessages.ExpectedStringParameter, MessageType.ERROR);
        reject(new SkyflowError({ code: 400, description: errorMessages.ExpectedStringParameter }));
      }

      if (options?.dataTokens && options.dataTokens?.length == 0) {
        printLog(errorMessages.DataTokensEmpty, MessageType.ERROR);
        reject(new SkyflowError({ code: 400, description: errorMessages.DataTokensEmpty }));
      }

      if (options && options.dataTokens == null || undefined) {
        printLog(errorMessages.DataTokensNotFound, MessageType.ERROR);
        reject(new SkyflowError({ code: 400, description: errorMessages.DataTokensNotFound }));
      }

      if (options?.dataTokens && !Array.isArray(options.dataTokens)) {
        printLog(errorMessages.ExpectedDataTokensParameter, MessageType.ERROR);
        reject(new SkyflowError({ code: 400, description: errorMessages.ExpectedDataTokensParameter }));
      }

      if (options?.timeToLive && typeof (options.timeToLive) !== "number") {
        printLog(errorMessages.ExpectedTimeToLiveParameter, MessageType.ERROR);
        reject(new SkyflowError({ code: 400, description: errorMessages.ExpectedTimeToLiveParameter }));
      }

      let credentialsObj = JSON.parse("{}")
      try {
        credentialsObj = JSON.parse(credentials);
      }
      catch (e) {
        printLog(errorMessages.NotAValidJSON, MessageType.ERROR);
        throw new SkyflowError({ code: 400, description: errorMessages.NotAValidJSON });
      }

      let expiryTime;
      if (options?.timeToLive && options?.timeToLive !== null) {
        expiryTime = Math.floor(Date.now() / 1000) + options?.timeToLive;
      } else {
        expiryTime = Math.floor(Date.now() / 1000) + 60;
      }
      const prefix = "signed_token_";

      let responseArray: ResponseSignedDataTokens[] = [];
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
            printLog(errorMessages.KeyIDNotFound, MessageType.ERROR);
            reject(new SkyflowError({ code: 400, description: errorMessages.KeyIDNotFound }));
          }
          else if (claims.aud == null) {
            printLog(errorMessages.TokenURINotFound, MessageType.ERROR);
            reject(new SkyflowError({ code: 400, description: errorMessages.TokenURINotFound }));
          }
          else if (credentialsObj.privateKey == null) {
            printLog(errorMessages.PrivateKeyNotFound, MessageType.ERROR);
            reject(new SkyflowError({ code: 400, description: errorMessages.PrivateKeyNotFound }));
          }
          else {
            const privateKey = credentialsObj.privateKey.toString("utf8");
            const signedJwt = jwt.sign(claims, privateKey, { algorithm: "RS256" });
            const responseObject = getSignedDataTokenResponseObject(prefix + signedJwt, token);
            responseArray.push(responseObject)
          }
        })
      }
      signedDataTokenSuccessResponse(responseArray).then((response) => resolve(response)).catch(err => reject(err))
    }
    catch (e) {
      reject(e);
    }
  });
}

function generateSignedDataTokensFromCreds(credentials, options: SignedDataTokensOptions): Promise<ResponseSignedDataTokens[]> {
  return getSignedTokens(credentials, options)
}

export { generateBearerToken, generateToken, generateBearerTokenFromCreds, generateSignedDataTokens, generateSignedDataTokensFromCreds };

export const __testing = {
  successResponse,
  failureResponse
}
