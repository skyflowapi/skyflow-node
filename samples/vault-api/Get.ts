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

const result = skyflow.get({
  records: [
    // To to get records using skyflow_ids.
    {
      ids: ['<ID1>', '<ID2>'],
      redaction: Skyflow.RedactionType.PLAIN_TEXT,
      table: 'cards',
    },
    // To get records using unique column name and values.
    {
      redaction : Skyflow.RedactionType.PLAIN_TEXT,
      table: "persons",
      columnName: "card_id",
      columnValues: ["123", "456"],
     }
  ],
});

result
  .then(response => {
    console.log('getByID result:');
    console.log(JSON.stringify(response));
  })
  .catch(error => {
    console.log('getByID error: ');
    console.log(JSON.stringify(error));
  });
