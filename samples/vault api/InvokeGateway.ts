import {Skyflow,GenerateToken} from "../../src/index";

var filePath = "<YOUR_CREDENTIAL_FILE>";

const skyflow = Skyflow.init({
  vaultID: "<VaultId>",
  vaultURL: "<VaultURL>",
  getBearerToken: () => {
    return new Promise((resolve, reject) => {
      GenerateToken(filePath)
      .then((res) => {
       // resolve(JSON.parse(JSON.stringify(res)).accessToken);
       resolve(res.accessToken);
      })
      .catch((err) => {
        reject(err);
        resolve(err.accessToken);
      });
    });
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

