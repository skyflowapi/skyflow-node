/*
	Copyright (c) 2022 Skyflow, Inc. 
*/
import { generateBearerTokenFromCreds, isValid } from "skyflow-node";

let cred = {
  clientID: '<YOUR_CLIENT_ID>',
  clientName: '<YOUR_CLIENT_NAME>',
  keyID: '<YOUR_KEY_ID>',
  tokenURI: '<YOUR_TOKEN_URI>',
  privateKey: '<YOUR_PEM_PRIVATE_KEY>',
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
