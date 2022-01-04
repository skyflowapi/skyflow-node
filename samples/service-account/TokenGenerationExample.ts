import {Skyflow,GenerateToken, generateBearerTokenFromCreds} from "../../src/index";

  generateBearerTokenFromCreds("credentials string").then((res) => {
    console.log(res);
  }).catch((err) => {
    console.log(err);
  })

  GenerateToken("<CREDENTIALS_FILE_PATH>").then((res) => {
    console.log(res);
  }).catch((err) => {
    console.log(err)
  })
