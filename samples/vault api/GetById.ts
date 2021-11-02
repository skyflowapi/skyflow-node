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


  const result = skyflow.getById({
    records: [
      {
       ids:["f786a2e8-524c-4424-affd-133e2637b547"],
       redaction : Skyflow.RedactionType.PLAIN_TEXT,
       table: "cards"
      },
      {
        ids:["1234","f786a2e8-52-4424-affd-133e2637b547"],
        redaction : Skyflow.RedactionType.PLAIN_TEXT,
        table: "persons"
       }
    ],
  });
    
  result
  .then((res) => {
        console.log("getByID result:");
        console.log(res);
  })
  .catch((err) => {
    console.log("getByID error: ");
    console.log(err.error.records);
    console.log(err.error.errors);
  });