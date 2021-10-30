import fs from "fs";
import Axios from "axios";
import jwt from "jsonwebtoken";
import { errorMessages } from "../../errors/Messages.js";

function GenerateToken(credentialsFilePath) {
  return new Promise((resolve, reject) => {
    let credentials;

    if (!fs.existsSync(credentialsFilePath)) {
      reject(errorMessages.fileNotFound);
    }
    credentials = fs.readFileSync(credentialsFilePath, "utf8");

    try {
      JSON.parse(credentials);
    } catch (e) {
      reject(errorMessages.notAValidJSON);
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

export default GenerateToken;
