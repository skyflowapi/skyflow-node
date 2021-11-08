import {Skyflow} from "../../src/index";
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
    gatewayURL:"https://www.testurl.com/{card_number}",
    methodName: Skyflow.RequestMethod.POST,
    requestHeader: {
      "Authorization": "",
    },
    pathParams: {
      card_number: "card number"
    },
    queryParams:{
        "cvv":"123",
        "series":["1","2","3"]
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

