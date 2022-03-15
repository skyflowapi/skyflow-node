var skyflowClient = require("skyflow-node");
var filePath = "<YOUR_CREDENTIAL_FILE>";
skyflowClient.setLogLevel(skyflowClient.LogLevel.INFO)
var bearerToken = ""

const skyflow = skyflowClient.Skyflow.init({
  vaultID: "<VAULT_ID>",
  vaultURL: "<VAULT_URL>",
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

const result = skyflow.getById({
  records: [
    {
     ids:["<ID1>","<ID2>"],
     redaction : skyflowClient.Skyflow.RedactionType.PLAIN_TEXT,
     table: "cards"
    },
    {
      ids:["<ID1>"],
      redaction : skyflowClient.Skyflow.RedactionType.PLAIN_TEXT,
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