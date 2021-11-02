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



  const result = skyflow.detokenize({
              records: [
                {
                  token : "1c541514-95fd-4d80-81fc-1c53d15ae1fd"
                },
                {
                  token : "23df721c-7b78-45f0-b12f-d6cd37507d2b"
                },
                {
                  token : "69fc4e4d-6d0d-46c4-97a0-010a1ef0db50"
                },
                {
                  token : "dc0281d3-aca4-411d-adfb-7e0d6ebab09f"
                }
              ],
        });
          
        result
        .then((res) => {
            console.log("detokenize result: ");
            console.log(res.records);
            console.log(res.errors);
        })
        .catch((err) => {
            console.log("detokenize error:")
            console.log(err);
            console.log(err.error.errors);
            console.log(err.error.records);
        });