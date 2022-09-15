/*
	Copyright (c) 2022 Skyflow, Inc. 
*/
import fs from "fs";
import Axios from "axios";
import jwt from "jsonwebtoken";
import { errorMessages } from "../errors/Messages";
import { printLog } from "../../vault-api/utils/logs-helper";
import logs from "../../vault-api/utils/logs";
import { MessageType } from "../../vault-api/utils/common";
import SkyflowError from '../../vault-api/libs/SkyflowError';
export type ResponseToken = { accessToken: string, tokenType: string }
function generateBearerToken(credentialsFilePath): Promise<ResponseToken> {
  return new Promise((resolve, reject) => {
    let credentials;

    if (!fs.existsSync(credentialsFilePath)) {
      printLog(errorMessages.FileNotFound, MessageType.ERROR);
      reject(new SkyflowError({code: 400,description: errorMessages.FileNotFound}));
    }
    credentials = fs.readFileSync(credentialsFilePath, "utf8");

    if (credentials === ''){
      printLog(errorMessages.EmptyFile, MessageType.ERROR);
      reject(new SkyflowError({code: 400,description: errorMessages.EmptyFile}))
    }

    try {
      JSON.parse(credentials);
    } catch (e) {
      printLog(errorMessages.NotAValidJSON, MessageType.ERROR);
      reject(new SkyflowError({code: 400,description: errorMessages.NotAValidJSON}));
    }

    getToken(credentials).then((res) => {
      resolve(res)
    }).catch((err) => { reject(err) })
  })
}

function getToken(credentials): Promise<ResponseToken> {
  return new Promise((resolve, reject) => {
    printLog(logs.infoLogs.GENERATE_BEARER_TOKEN_TRIGGERED, MessageType.LOG);
    try {
        if(!credentials && credentials == ""){
          printLog(errorMessages.CredentialsContentEmpty, MessageType.ERROR);
          reject(new SkyflowError({code: 400,description: errorMessages.CredentialsContentEmpty}));
        }
        if(typeof(credentials) !== "string"){
          printLog(errorMessages.ExpectedStringParameter, MessageType.ERROR);
          reject(new SkyflowError({code: 400,description: errorMessages.ExpectedStringParameter}));
        }
        let credentialsObj = JSON.parse("{}")
        try {
           credentialsObj = JSON.parse(credentials);
        }
        catch(e) {
          printLog(errorMessages.NotAValidJSON, MessageType.ERROR);
          throw new SkyflowError({code: 400,description: errorMessages.NotAValidJSON});
        }
        const expiryTime = Math.floor(Date.now() / 1000) + 3600;

        const claims = {
          iss: credentialsObj.clientID,
          key: credentialsObj.keyID,
          aud: credentialsObj.tokenURI,
          exp: expiryTime,
          sub: credentialsObj.clientID,
        };

        if (claims.iss == null) {
          printLog(errorMessages.ClientIDNotFound, MessageType.ERROR);
          reject(new SkyflowError({code: 400,description: errorMessages.ClientIDNotFound}));
        }
        else if (claims.key == null) {
          printLog(errorMessages.KeyIDNotFound, MessageType.ERROR);
          reject(new SkyflowError({code: 400,description: errorMessages.KeyIDNotFound}));
        }
        else if (claims.aud == null) {
          printLog(errorMessages.TokenURINotFound, MessageType.ERROR);
          reject(new SkyflowError({code: 400,description: errorMessages.TokenURINotFound}));
        }
        else if (credentialsObj.privateKey == null) {
          printLog(errorMessages.PrivateKeyNotFound, MessageType.ERROR);
          reject(new SkyflowError({code: 400,description: errorMessages.PrivateKeyNotFound}));
        }
        else {
          const privateKey = credentialsObj.privateKey.toString("utf8");

          const signedJwt = jwt.sign(claims, privateKey, { algorithm: "RS256" });

          Axios(`${credentialsObj.tokenURI}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            data: {
              grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
              assertion: signedJwt,
            },
          })
            .then((res) => {
              successResponse(res).then((response)=> resolve(response)).catch(err => reject(err))
            })
            .catch((err) => {
              failureResponse(err).catch(err => reject(err))
          });
      }
    }
    catch(e) {
      reject(e);
    }
  });
}
function successResponse(res:any) : Promise<ResponseToken>  {
  printLog(logs.infoLogs.GENERATE_BEARER_TOKEN_SUCCESS, MessageType.LOG);
  return new Promise((resolve,_)=>{
    resolve({
      accessToken: res.data.accessToken,
      tokenType: res.data.tokenType,
    });
  })
}

function failureResponse(err:any) {
    return new Promise((_,reject)=>{
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

function generateBearerTokenFromCreds(credentials): Promise<ResponseToken> {
  return getToken(credentials)
}

export { generateBearerToken, generateToken, generateBearerTokenFromCreds};

export const __testing = {
  successResponse,
  failureResponse
}
