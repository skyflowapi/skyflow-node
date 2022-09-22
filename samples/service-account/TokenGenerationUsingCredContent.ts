/*
	Copyright (c) 2022 Skyflow, Inc. 
*/
import { generateBearerTokenFromCreds, isValid } from "skyflow-node";

let cred = {
  clientID: "<YOUR_clientID>",
  clientName: "<YOUR_clientName>",
  keyID: "<YOUR_keyID>",
  tokenURI: "<YOUR_tokenURI>",
  privateKey: "<YOUR_PEM_privateKey>",
};
let bearerToken = "";
function getSkyflowBearerToken() {
  return new Promise(async (resolve, reject) => {
    try {
      if (isValid(bearerToken)) resolve(bearerToken);
      else {
        let response = await generateBearerTokenFromCreds(JSON.stringify(cred));
        bearerToken = response.accessToken;
        resolve(bearerToken);
      }
    } catch (e) {
      reject(e);
    }
  });
}

const tokens = async () => {
  console.log(await getSkyflowBearerToken());
};

tokens();
