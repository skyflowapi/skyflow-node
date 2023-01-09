/*
  Copyright (c) 2022 Skyflow, Inc.
*/
import {
  generateBearerToken,
  isValid,
} from "skyflow-node";

let filepath = "<YOUR_CREDNTIALS_FILE_PATH>";
let bearerToken = "";
function getSkyflowBearerToken() {
  return new Promise(async (resolve, reject) => {
    try {
      if (isValid(bearerToken)) resolve(bearerToken);
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

const tokens = async () => {
    console.log(await getSkyflowBearerToken());
}

tokens();
