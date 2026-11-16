/*
  Copyright (c) 2022 Skyflow, Inc.
*/
// v1 nomenclature: roleIDs (uppercase D) — deprecated alias for roleIds in BearerTokenOptions
import {
  generateBearerTokenFromCreds,
  isExpired,
  LogLevel,
} from 'skyflow-node';

let bearerToken: string = '';

const cred = {
  clientId: '<YOUR_CLIENT_ID>',
  clientName: '<YOUR_CLIENT_NAME>',
  keyId: '<YOUR_KEY_ID>',
  tokenUri: '<YOUR_TOKEN_URI>',
  privateKey: '<YOUR_PRIVATE_KEY>',
};

function getScopedBearerTokenFromCreds() {
  return new Promise((resolve, reject) => {
    try {
      // v1: roleIDs (uppercase D) — deprecated key, emits WARN, still works
      const options = {
        roleIDs: ['<YOUR_ROLE_ID>'] as string[],
        logLevel: LogLevel.WARN,
      };
      if (!isExpired(bearerToken)) resolve(bearerToken);
      else {
        generateBearerTokenFromCreds(JSON.stringify(cred), options as any)
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
  console.log(await getScopedBearerTokenFromCreds());
};

tokens();
