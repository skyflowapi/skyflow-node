import {Skyflow,GenerateToken} from "../../src/index";

var filePath = "credential.json";

const skyflow = Skyflow.init({
  vaultID: "<VaultId>",
  vaultURL: "<VaultURL>",
  getBearerToken: () => {
    return new Promise((resolve, reject) => {
      GenerateToken(filePath)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
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

