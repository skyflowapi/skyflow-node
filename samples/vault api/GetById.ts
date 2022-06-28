/*
	Copyright (c) 2022 Skyflow, Inc. 
*/
import {Skyflow, generateBearerToken, isExpired, setLogLevel, LogLevel} from "skyflow-node";
var filePath = "<YOUR_CREDENTIAL_FILE>";
setLogLevel(LogLevel.INFO)
var bearerToken = ""

const skyflow = Skyflow.init({
  vaultID: "<VAULT_ID>",
  vaultURL: "<VAULT_URL>",
  getBearerToken: () => {
    return new Promise((resolve, reject) => {
      if(!isExpired(bearerToken)) {
        resolve(bearerToken)
      }
      else {    
        generateBearerToken(filePath)
        .then((res) => {
            bearerToken = res.accessToken
            resolve(bearerToken);
        })
        .catch((err) => {
            reject(err);
        });
      }
  })
}
});

const result = skyflow.getById({
  records: [
    {
     ids:["<ID1>","<ID2>"],
     redaction : Skyflow.RedactionType.PLAIN_TEXT,
     table: "cards"
    },
    {
      ids:["<ID1>"],
      redaction : Skyflow.RedactionType.PLAIN_TEXT,
      table: "persons"
     }
  ],
});
    
  result
  .then((res) => {
        console.log("getByID result:");
        console.log(JSON.stringify(res));
  })
  .catch((err) => {
    console.log("getByID error: ");
    console.log(JSON.stringify(err));
  });