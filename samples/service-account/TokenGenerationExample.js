const skyflow = require("skyflow-node");
var filePath = "";
skyflow
  .GenerateToken(filePath)
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
