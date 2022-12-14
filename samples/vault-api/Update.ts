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


const result = skyflow.update(
  {
    records: [
      {
        id : "<SKYFLOW_ID>",
        table: "<TABLE_NAME>",
        "fields": {
          "<FIELD_NAME>": "<FIELD_VALUE>"
        }
      }
    ],
  },
  {
    tokens: true,
  }
);

result.then((response)=>{
  console.log("Update result:");
  console.log(JSON.stringify(response));
}).catch((error)=>{
  console.log("Update error:");
  console.log(JSON.stringify(error));
})