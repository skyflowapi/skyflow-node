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

