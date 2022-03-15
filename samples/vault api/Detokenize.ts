import {Skyflow, generateBearerToken, isValid, setLogLevel, LogLevel} from "skyflow-node";
var filePath = "<YOUR_CREDENTIAL_FILE>";
setLogLevel(LogLevel.INFO)
var bearerToken = ""

const skyflow = Skyflow.init({
  vaultID: "<VAULT_ID>",
  vaultURL: "<VAULT_URL>",
  getBearerToken: () => {
    return new Promise((resolve, reject) => {
      if(isValid(bearerToken)) {
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


const result = skyflow.detokenize({
    records: [
      {
        token : "<TOKEN1>"
      },
      {
        token : "<TOKEN2>"
      },
      {
        token : "<TOKEN3>"
      },
      {
        token : "<TOKEN4>"
      }
    ],  
  });
          
    result
    .then((res) => {
        console.log("detokenize result: ");
        console.log(JSON.stringify(res));
    })
    .catch((err) => {
        console.log("detokenize error:")
        console.log(JSON.stringify(err));
    });

       