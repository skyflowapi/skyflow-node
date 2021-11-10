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


  const response = skyflow.insert({
    records: [
      {
        fields: {
            cvv: "234",
            card_number: "411111111111111",
            fullname: "san",
            expiry_date: "11/22",
        },
        table: "cards",
      },
    ],
  },{tokens:true});
  response
    .then(
      (res) => {
        console.log("insert result:");
        console.log(JSON.stringify(res));
      },
      (err) => {
        console.log("insert error:");
        console.log(JSON.stringify(err));
      }
    )
    .catch((err) => {
      console.log("insert exception:");
      console.log(JSON.stringify(err));
    });