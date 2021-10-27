const skyflow = require("skyflow-node");

var filePath = "test/demoCredentials/workingCreds.json";

skyflow
  .GenerateToken(filePath)
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
