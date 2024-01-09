/*
	Copyright (c) 2024 Skyflow, Inc.
*/
import {
  Skyflow,
  generateBearerToken,
  isExpired,
  setLogLevel,
  LogLevel,
} from "skyflow-node";

setLogLevel(LogLevel.DEBUG);
let bearerToken = "";
const filePath = "<YOUR_CREDENTIALS_FILE_PATH>";

const skyflow = Skyflow.init({
  vaultID: "<VAULT_ID>",
  vaultURL: "<VAULT_URL>",
  getBearerToken: () => {
    return new Promise((resolve, reject) => {
      if (!isExpired(bearerToken)) {
        resolve(bearerToken);
      } else {
        generateBearerToken(filePath)
          .then((response) => {
            bearerToken = response.accessToken;
            resolve(bearerToken);
          })
          .catch((error) => {
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
          expiry_date: "12/2026",
          card_number: "411111111111111",
          namee: "john doe",
        },
        table: "cards",
      },
      {
        fields: {
          expiry_date: "12/2027",
          card_number: "411111111111111",
          name: "jane doe",
        },
        table: "cards",
      },
    ],
  },
  {
    tokens: true,
    continueOnError: true,
  }
);

result
  .then((response) => {
    console.log("insert result:");
    console.log(JSON.stringify(response));
  })
  .catch((error) => {
    console.log("insert error:");
    console.log(JSON.stringify(error));
  });
