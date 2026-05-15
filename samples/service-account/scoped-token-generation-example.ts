/*
  Copyright (c) 2022 Skyflow, Inc.
*/
import {
  generateBearerToken,
  generateBearerTokenFromCreds,
  isExpired,
} from 'skyflow-node';

const filepath = 'CREDENTIALS_FILE_PATH';
let bearerToken: string = '';

// To generate Bearer Token from credentials string.
const cred = {
  clientId: '<YOUR_CLIENT_ID>',
  clientName: '<YOUR_CLIENT_NAME>',
  keyId: '<YOUR_KEY_ID>',
  tokenUri: '<YOUR_TOKEN_URI>',
  privateKey: '<YOUR_PEM_PRIVATE_KEY>',
};

function getScopedBearerTokenFromFilePath() {
  return new Promise((resolve, reject) => {
    try {
      const options = {
        roleIds: ['roleID1', 'roleID2'],
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

function getScopedBearerTokenFromCreds() {
  return new Promise((resolve, reject) => {
    try {
      const options = {
        roleIds: ['roleID1', 'roleID2'],
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
  console.log(await getScopedBearerTokenFromFilePath());
  console.log(await getScopedBearerTokenFromCreds());
};

tokens();
