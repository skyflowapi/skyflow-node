/*
	Copyright (c) 2022 Skyflow, Inc. 
*/
import {
  Skyflow,
  generateBearerToken,
  isExpired,
  setLogLevel,
  LogLevel,
} from "skyflow-node";

var filePath = "<YOUR_CREDENTIAL_FILE>";
setLogLevel(LogLevel.INFO);
var bearerToken = "";

const skyflow = Skyflow.init({
  vaultID: "<VAULT_ID>",
  vaultURL: "<VAULT_URL>",
  getBearerToken: () => {
    return new Promise((resolve, reject) => {
      if (!isExpired(bearerToken)) {
        resolve(bearerToken);
      } else {
        generateBearerToken(filePath)
          .then((res) => {
            bearerToken = res.accessToken;
            resolve(bearerToken);
          })
          .catch((err) => {
            reject(err);
          });
      }
    });
  },
});

const response = skyflow.insert({
    records: [
      {
        fields: {
            card_number: "411111111111111",
            expiry_date: "11/22",
            fullname : "firstNameTest"
        },
        table: "cards",
      },
    ],
  },
  {
    tokens:true,
    upsert:[
        {
            table: 'cards',       // table
            column: 'card_number' // unique column in the table.
        }
    ]
  }
);

response
  .then(
    (res) => {
      console.log("insert result:");
      console.log(JSON.stringify(res));
    },
    (err) => {
      console.log("insert error:");
      console.log(JSON.stringify(err));
    }
  )
  .catch((err) => {
    console.log("insert exception:");
    console.log(JSON.stringify(err));
  });