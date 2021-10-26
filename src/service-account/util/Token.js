import fs from "fs";
import Axios from "axios";
import jwt from "jsonwebtoken";
import * as messageVar from "../../errors/Messages.js";

function IsJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

function GenerateToken(credentialsFilePath) {
  try {
    const credentials = fs.readFileSync(credentialsFilePath, "utf8");

    if (typeof JSON.parse(credentials) !== "object") {
      throw new Error(messageVar.notAValidJSON);
    }

    if (!IsJsonString(credentials)) {
      throw new Error(messageVar.notAValidJSON);
    }

    const credentialsObj = JSON.parse(credentials);

    const expiryTime = Math.floor(Date.now() / 1000) + 60;
    const claims = {
      iss: credentialsObj.clientID,
      key: credentialsObj.keyID,
      aud: credentialsObj.tokenURI,
      exp: expiryTime,
      sub: credentialsObj.clientID,
    };

    if (claims.iss == null) {
      throw new Error(messageVar.clientIDNotFound);
    }
    if (claims.key == null) {
      throw new Error(messageVar.keyIDNotFound);
    }
    if (claims.aud == null) {
      throw new Error(messageVar.tokenURINotFound);
    }
    if (expiryTime == null) {
      throw new Error(messageVar.expiryTimeNotFound);
    }
    if (credentialsObj.privateKey == null) {
      throw new Error(messageVar.privateKeyNotFound);
    }

    const privateKey = credentialsObj.privateKey.toString("utf8");

    const signedJwt = jwt.sign(claims, privateKey, { algorithm: "RS256" });
    return new Promise((resolve, reject) => {
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
    }).catch((err) => {
      console.log(err.toString());
    });
  } catch (err) {
    console.log(err.toString());
  }
}

export default GenerateToken;
