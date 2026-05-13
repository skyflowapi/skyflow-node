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
  clientId: '<YOUR_CLIENT_ID>',
  clientName: '<YOUR_CLIENT_NAME>',
  keyId: '<YOUR_KEY_ID>',
  tokenUri: '<YOUR_TOKEN_URI>',
  privateKey: '<YOUR_PEM_PRIVATE_KEY>',
};

// Approach 1: Bearer token with string context
// Use a simple string identifier when your policy references a single context value.
// In your Skyflow policy, reference this as: request.context
function getSkyflowBearerTokenWithStringContext() {
  return new Promise((resolve, reject) => {
    try {
      const options = {
        ctx: 'user_12345',
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

// Approach 2: Bearer token with JSON object context
// Use a structured object when your policy needs multiple context values.
// Each key maps to a Skyflow CEL policy variable under request.context.*
// For example, the object below enables policies like:
//   request.context.role == "admin" && request.context.department == "finance"
function getSkyflowBearerTokenWithObjectContext() {
  return new Promise((resolve, reject) => {
    try {
      const options = {
        ctx: {
          role: 'admin',
          department: 'finance',
          user_id: 'user_12345',
        },
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

// Approach 3: Bearer token with string context from credentials string
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
  console.log('String context:', await getSkyflowBearerTokenWithStringContext());
  console.log('Object context:', await getSkyflowBearerTokenWithObjectContext());
  console.log('Creds string context:', await getSkyflowBearerTokenWithContextFromCreds());
};

tokens();
