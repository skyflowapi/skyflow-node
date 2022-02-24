import { generateBearerToken, generateBearerTokenFromCreds} from "../../src/index";


  let credentialString = "<credentialString>"
  generateBearerTokenFromCreds(JSON.stringify(credentialString)).then((res) => {
    console.log(res);
  }).catch((err) => {
    console.log(JSON.stringify(err));
  })

  generateBearerToken("<YOUR_CREDENTIAL_FILE>").then((res) => {
    console.log(res);
  }).catch((err) => {
    console.log(JSON.stringify(err));
  })
