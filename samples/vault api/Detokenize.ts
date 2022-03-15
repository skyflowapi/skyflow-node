
var skyflowClient = require("skyflow-node");
var filePath = "<YOUR_CREDENTIAL_FILE>";
skyflowClient.setLogLevel(skyflowClient.LogLevel.INFO)
var bearerToken = ""
const skyflow = skyflowClient.Skyflow.init({
  vaultID: "<VAULT_ID>",
  vaultURL: "<VALUT_URL>",
  getBearerToken: () => {
    return new Promise((resolve, reject) => {
      if(!skyflowClient.isExpired(bearerToken)) {
        resolve(bearerToken)
      }
      else {    
        skyflowClient.generateBearerToken(filePath)
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

       