import {Skyflow,GenerateToken, generateTokenFromCreds} from "../../src/index";

  generateTokenFromCreds(undefined).then((res) => {
    console.log(res);
  }).catch((err) => {
    console.log(err);
  })
