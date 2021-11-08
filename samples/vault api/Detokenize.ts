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



  const result = skyflow.detokenize({
              records: [
                {
                  token : "token1"
                },
                {
                  token : "token2"
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