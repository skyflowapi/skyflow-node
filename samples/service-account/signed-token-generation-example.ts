/*
  Copyright (c) 2022 Skyflow, Inc.
*/
import {
  generateSignedDataTokens,
  generateSignedDataTokensFromCreds,
} from 'skyflow-node';

let filepath: string = 'CREDENTIALS_FILE_PATH';

// To generate Bearer Token from credentials string.
let cred = {
  clientID: '<YOUR_CLIENT_ID>',
  clientName: '<YOUR_CLIENT_NAME>',
  keyID: '<YOUR_KEY_ID>',
  tokenURI: '<YOUR_TOKEN_URI>',
  privateKey: '<YOUR_PEM_PRIVATE_KEY>',
};

// Approach 1: Signed data tokens with string context
function getSignedTokenWithStringContext() {
  return new Promise(async (resolve, reject) => {
    try {
      const options = {
        ctx: 'user_12345',
        dataTokens: ['dataToken1', 'dataToken2'],
        timeToLive: 90 // In seconds.
      };
      let response = await generateSignedDataTokens(filepath, options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

// Approach 2: Signed data tokens with JSON object context
// Each key in the ctx object maps to a Skyflow CEL policy variable under request.context.*
// For example: request.context.role == "analyst" && request.context.department == "research"
function getSignedTokenWithObjectContext() {
  return new Promise(async (resolve, reject) => {
    try {
      const options = {
        ctx: {
          role: 'analyst',
          department: 'research',
          user_id: 'user_67890',
        },
        dataTokens: ['dataToken1', 'dataToken2'],
        timeToLive: 90, // In seconds.
      };
      let response = await generateSignedDataTokens(filepath, options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

// Approach 3: Signed data tokens from credentials string
function getSignedTokenFromCreds() {
  return new Promise(async (resolve, reject) => {
    try {
      const options = {
        ctx: 'ctx',
        dataTokens: ['dataToken1', 'dataToken2'],
        timeToLive: 90, // In seconds.
      };
      let response = await generateSignedDataTokensFromCreds(
        JSON.stringify(cred),
        options
      );
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

const tokens = async () => {
  try {
    const tokenResponseString: any = await getSignedTokenWithStringContext();
    console.log('Signed tokens (string context):');
    tokenResponseString.forEach((response) => {
      console.log(`  Data Token: ${response.token}`);
      console.log(`  Signed Data Token: ${response.signedToken}`);
    });

    const tokenResponseObject: any = await getSignedTokenWithObjectContext();
    console.log('Signed tokens (object context):');
    tokenResponseObject.forEach((response) => {
      console.log(`  Data Token: ${response.token}`);
      console.log(`  Signed Data Token: ${response.signedToken}`);
    });

    const tokenResponseFromCreds: any = await getSignedTokenFromCreds();
    console.log('Signed tokens (from creds):');
    tokenResponseFromCreds.forEach((response) => {
      console.log(`  Data Token: ${response.token}`);
      console.log(`  Signed Data Token: ${response.signedToken}`);
    });
  } catch (error) {
    console.log(error);
  }
};

tokens();
