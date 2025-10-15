/*
  Copyright (c) 2022 Skyflow, Inc.
*/
import {
  generateBearerToken,
  generateBearerTokenFromCreds,
  isExpired,
} from 'skyflow-node';

const filepath: string = 'CREDENTIALS_FILE_PATH';
let bearerToken: string = '';

// To generate Bearer Token from credentials string.
const cred = {
  clientID: '<YOUR_CLIENT_ID>',
  clientName: '<YOUR_CLIENT_NAME>',
  keyID: '<YOUR_KEY_ID>',
  tokenURI: '<YOUR_TOKEN_URI>',
  privateKey: '<YOUR_PEM_PRIVATE_KEY>',
};

function getSkyflowBearerTokenWithContextFromFilePath() {
  return new Promise((resolve, reject) => {
    try {
      const options = {
        ctx: 'context_id',
      };
      if (!isExpired(bearerToken)) resolve(bearerToken);
      else {
        generateBearerToken(filepath, options)
          .then(response => {
            bearerToken = response.accessToken;
            resolve(bearerToken);
          })
          .catch(error => {
            reject(error);
          });
      }
    } catch (e) {
      reject(e);
    }
  });
}

function getSkyflowBearerTokenWithContextFromCreds() {
  return new Promise((resolve, reject) => {
    try {
      const options = {
        ctx: 'context_id',
      };
      if (!isExpired(bearerToken)) resolve(bearerToken);
      else {
        generateBearerTokenFromCreds(JSON.stringify(cred), options)
          .then(response => {
            bearerToken = response.accessToken;
            resolve(bearerToken);
          })
          .catch(error => {
            reject(error);
          });
      }
    } catch (e) {
      reject(e);
    }
  });
}

const tokens = async () => {
  console.log(await getSkyflowBearerTokenWithContextFromFilePath());
  console.log(await getSkyflowBearerTokenWithContextFromCreds());
};

tokens();
