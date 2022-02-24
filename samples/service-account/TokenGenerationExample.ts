import { generateBearerToken, generateBearerTokenFromCreds,isValid} from "../../src/index";

  let filepath = 'LOCATION_OF_SERVICE_ACCOUNT_KEY_FILE';
  let bearerToken = ""
  function getSkyflowBearerToken() {
      return new Promise(async (resolve, reject) => {
          try {
              if (isValid(bearerToken)) resolve(bearerToken)
              else {
                  let response = await generateBearerToken(filepath);
                  bearerToken = response.accessToken;
                  resolve(bearerToken);
              }
          } catch (e) {
              reject(e);
          }
      });
  }
