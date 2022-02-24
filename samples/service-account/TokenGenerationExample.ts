import { generateBearerToken, generateBearerTokenFromCreds} from "../../src/index";

  generateBearerTokenFromCreds("<YOUR_CREDENTIAL_STRING>").then((res) => {
    console.log(res);
  }).catch((err) => {
    console.log(JSON.stringify(err));
  })

  generateBearerToken("<YOUR_CREDENTIAL_FILE>").then((res) => {
    console.log(res);
  }).catch((err) => {
    console.log(JSON.stringify(err));
  })
