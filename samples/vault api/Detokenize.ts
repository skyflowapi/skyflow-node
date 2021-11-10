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
      });
    });
  
  }
});


  const result = skyflow.detokenize({
    records: [
      {
        token : "14650ba6-4d47-4212-9834-e94c2b6a66a0"
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
            console.log(JSON.stringify(res));
        })
        .catch((err) => {
            console.log("detokenize error:")
            console.log(JSON.stringify(err));
        });