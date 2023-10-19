/*
	Copyright (c) 2023 Skyflow, Inc.
*/
import {
  Skyflow,
  generateBearerToken,
  isExpired,
  setLogLevel,
  LogLevel,
} from "skyflow-node";

const filePath = "<YOUR_CREDENTIAL_FILE>";
setLogLevel(LogLevel.INFO);
let bearerToken = "";

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
          .catch((err) => {
            reject(err);
          });
      }
    });
  },
});

const result = skyflow.delete({
  records: [
    {
      id: "<SKYFLOW_ID_1>",
      table: "<TABLE_NAME",
    },
    {
      id: "<SKYFLOW_ID_2>",
      table: "<TABLE_NAME",
    },
  ],
});

result
  .then((response) => {
    console.log("delete result:");
    console.log(JSON.stringify(response));
  })
  .catch((error) => {
    console.log("delete error: ");
    console.log(JSON.stringify(error));
  });
