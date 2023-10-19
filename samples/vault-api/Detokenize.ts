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
          .catch(error => {
            reject(error);
          });
      }
    });
  },
});

const result = skyflow.detokenize({
  records: [
    {
      token: '<TOKEN1>',
      redaction: Skyflow.RedactionType.DEFAULT  // optional
    },
    {
      token: '<TOKEN2>',
      redaction: Skyflow.RedactionType.MASKED  // optional
    },
    {
      token: '<TOKEN3>',
      redaction: Skyflow.RedactionType.REDACTED // optional
    },
    {
      token: '<TOKEN4>',
    },
  ],
});

result
  .then(response => {
    console.log('detokenize result: ');
    console.log(JSON.stringify(response));
  })
  .catch(error => {
    console.log('detokenize error:');
    console.log(JSON.stringify(error));
  });
  