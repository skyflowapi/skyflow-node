import fs from "fs";
import Axios from "axios";
import jwt from "jsonwebtoken";
import { errorMessages } from "../errors/Messages";
import { printLog } from "../../vault-api/utils/logsHelper";
import logs from "../../vault-api/utils/logs";
import { MessageType } from "../../vault-api/utils/common";

export type ResponseToken = { accessToken: string, tokenType: string }
function generateBearerToken(credentialsFilePath): Promise<ResponseToken> {
  return new Promise((resolve, reject) => {
    let credentials;

    if (!fs.existsSync(credentialsFilePath)) {
      reject(errorMessages.fileNotFound);
    }
    credentials = fs.readFileSync(credentialsFilePath, "utf8");

    if (credentials === '') reject(errorMessages.EmptyFile)

    try {
      JSON.parse(credentials);
    } catch (e) {
      reject(errorMessages.notAValidJSON);
    }

    getToken(credentials).then((res) => {
      resolve(res)
    }).catch((err) => { reject(err) })
  })
}

function getToken(credentials): Promise<ResponseToken> {
  return new Promise((resolve, reject) => {
    if(!credentials && credentials == ""){
      reject(errorMessages.CredentialsContentEmpty)
    }
    if(typeof(credentials) !== "string"){
      reject(errorMessages.ExpectedStringParameter)
    }
    const credentialsObj = JSON.parse(credentials);
    const expiryTime = Math.floor(Date.now() / 1000) + 3600;

    const claims = {
      iss: credentialsObj.clientID,
      key: credentialsObj.keyID,
      aud: credentialsObj.tokenURI,
      exp: expiryTime,
      sub: credentialsObj.clientID,
    };

    if (claims.iss == null) {
      reject(errorMessages.clientIDNotFound);
    }
    if (claims.key == null) {
      reject(errorMessages.keyIDNotFound);
    }
    if (claims.aud == null) {
      reject(errorMessages.tokenURINotFound);
    }

    if (credentialsObj.privateKey == null) {
      reject(errorMessages.privateKeyNotFound);
    }

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
        resolve({
          accessToken: res.data.accessToken,
          tokenType: res.data.tokenType,
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function GenerateToken(credentialsFilePath): Promise<ResponseToken> {
  printLog(logs.warnLogs.GENERATE_BEARER_DEPRECATED, MessageType.WARN)
  return generateBearerToken(credentialsFilePath)
}

function generateBearerTokenFromCreds(credentials): Promise<ResponseToken> {
  return getToken(credentials)
}

export { generateBearerToken, GenerateToken, generateBearerTokenFromCreds};
