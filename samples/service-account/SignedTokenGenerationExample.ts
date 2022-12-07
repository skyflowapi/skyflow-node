/*
  Copyright (c) 2022 Skyflow, Inc.
*/
import {
  generateSignedDataTokens,
  generateSignedDataTokensFromCreds,
} from 'skyflow-node';

const filepath = 'CREDENTIALS_FILE_PATH';

// To generate Bearer Token from credentials string.
const cred = {
  clientID: '<YOUR_CLIENT_ID>',
  clientName: '<YOUR_CLIENT_NAME>',
  keyID: '<YOUR_KEY_ID>',
  tokenURI: '<YOUR_TOKEN_URI>',
  privateKey: '<YOUR_PEM_PRIVATE_KEY>',
};

function getSignedTokenFromFilePath() {
  return new Promise((resolve, reject) => {
    try {
      const options = {
        ctx: 'ctx',
        dataTokens: ['dataToken1', 'dataToken2'],
        timeToLive: 90 // In seconds.
      };

      generateSignedDataTokens(filepath, options)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    } catch (e) {
      reject(e);
    }
  });
}


function getSignedTokenFromCreds() {
  return new Promise((resolve, reject) => {
    try {
      const options = {
        ctx: 'ctx',
        dataTokens: ['dataToken1', 'dataToken2'],
        timeToLive: 90 // In seconds.
      };
      generateSignedDataTokensFromCreds(JSON.stringify(cred), options)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    } catch (e) {
      reject(e);
    }
  });
}

const tokens = async () => {
    try{
        const tokenResponseFromFilePath:any = await getSignedTokenFromFilePath();
        tokenResponseFromFilePath.forEach((response)=>{
            console.log(`Data Token: ${response.token}`);
            console.log(`Signed Data Token: ${response.signedToken}`);
        });

        const tokenResponseFromCreds:any = await getSignedTokenFromCreds();
        tokenResponseFromCreds.forEach((response)=>{
            console.log(`Data Token: ${response.token}`);
            console.log(`Signed Data Token: ${response.signedToken}`);
        });

    }catch(error){
        console.log(error);
    }
};

tokens();
