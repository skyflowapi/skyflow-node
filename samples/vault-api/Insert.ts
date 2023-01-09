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

const result = skyflow.insert(
  {
    records: [
      {
        fields: {
            "<FIELD_NAME>" : "<VALUE>"
        },
        table: "<TABLE_NAME>",
      },
    ],
  },
  {tokens: true}
);

result
  .then(response => {
    console.log('insert result:');
    console.log(JSON.stringify(response));
  })
  .catch(error => {
    console.log('insert error:');
    console.log(JSON.stringify(error));
  });
