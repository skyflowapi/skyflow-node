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

  const sdkResponse = skyflow.invokeConnection({
    connectionURL:"<ConnectionURL>",
    methodName: Skyflow.RequestMethod.POST,
    requestHeader: {
      "Authorization": "",
    },
    requestBody: {
      "expirationDate": {
        "mm": "01",
        "yy": "46"
      }
    }
  });
  sdkResponse
    .then(
      (res) => {
        console.log(JSON.stringify(res));
      }
    )
    .catch((err) => {
      console.log(JSON.stringify(err));
    });

