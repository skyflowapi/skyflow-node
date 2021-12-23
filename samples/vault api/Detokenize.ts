import {Skyflow, generateBearerToken, GenerateToken} from "../../src/index";

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
      });
  })
}
});


  const result = skyflow.detokenize({
    records: [
      {
        token : "59d684a5-3894-44c4-bf94-e71ab6e21ad7"
      },
      {
        token : "6877-8185-9209-0557123"
      },
      {
        token : "4b36bfc2-f0d3-41dd-8bc9-d0e4ec1e42d3"
      },
      {
        token : "5fbc3c11-ca8c-41f3-a9c3-e996cd252e28"
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