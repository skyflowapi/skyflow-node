import Skyflow from "../../src/vault-api/Skyflow";
import {XMLHttpRequest} from 'xmlhttprequest-ts';

const skyflow = Skyflow.init({
    vaultID: "<VaultID>",
    vaultURL: "<VaultURL>",
    getBearerToken: () => {
      return new Promise((resolve, reject) => {
        const Http = new XMLHttpRequest();

        Http.onreadystatechange = () => {
          if (Http.readyState == 4) {
            if (Http.status == 200) {
              const response = JSON.parse(Http.responseText);
              resolve(response.accessToken);
            } else {
              reject("Error occured");
            }
          }
        };

        Http.onerror = (error) => {
          reject("Error occured");
        };

        const url = "TOKEN Endpoint";
        Http.open("GET", url);
        Http.send();
      });
    },
  });

  const sdkResponse = skyflow.invokeGateway({
    gatewayURL:"<GatewayURL>",
    methodName: Skyflow.RequestMethod.POST,
    requestHeader: {
      "Authorization": "",
    },
    pathParams: {
      card_number: "card number"
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
      (result) => {
        console.log(result);
      }
    )
    .catch((err) => {
      console.log(err);
    });

