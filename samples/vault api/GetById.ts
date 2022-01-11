import {Skyflow, generateBearerToken} from "../../src/index";

var filePath = "<YOUR_CREDENTIAL_FILE>";

const skyflow = Skyflow.init({
  vaultID: "<VaultId>",
  vaultURL: "<VaultURL>",
  getBearerToken: () => {
    return new Promise((resolve, reject) => {
      generateBearerToken(filePath)
      .then((res) => {
       // resolve(JSON.parse(JSON.stringify(res)).accessToken);
       resolve(res.accessToken);
      })
      .catch((err) => {
        reject(err);
      });
    });
  }
});


const result = skyflow.getById({
  records: [
    {
     ids:["1d1f1085-7276-4494-ab8f-3c52a5baf006"],
     redaction : Skyflow.RedactionType.PLAIN_TEXT,
     table: "pii_fields"
    },
    {
      ids:["1234","f786a2e8-52-4424-affd-133e2637b547"],
      redaction : Skyflow.RedactionType.PLAIN_TEXT,
      table: "pii_fields"
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