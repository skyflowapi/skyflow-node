/*
	Copyright (c) 2022 Skyflow, Inc.
*/
import {
  Skyflow,
  generateBearerToken,
  isExpired,
  setLogLevel,
  LogLevel,
} from 'skyflow-node';

const filePath = '<YOUR_CREDENTIAL_FILE>';
setLogLevel(LogLevel.INFO);
let bearerToken = '';

const skyflow = Skyflow.init({
  vaultID: '<VAULT_ID>',
  vaultURL: '<VAULT_URL>',
  getBearerToken: () => {
    return new Promise((resolve, reject) => {
      if (!isExpired(bearerToken)) {
        resolve(bearerToken);
      } else {
        generateBearerToken(filePath)
          .then(response => {
            bearerToken = response.accessToken;
            resolve(bearerToken);
          })
          .catch(err => {
            reject(err);
          });
      }
    });
  },
});

const result = skyflow.invokeConnection({
  connectionURL: '<ConnectionURL>',
  methodName: Skyflow.RequestMethod.POST,
  requestHeader: {
    Authorization: '',
  },
  requestBody: {
    expirationDate: {
      mm: '01',
      yy: '46',
    },
  },
});

result
  .then(response => {
    console.log(JSON.stringify(response));
  })
  .catch(error => {
    console.log(JSON.stringify(error));
  });
