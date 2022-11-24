/*
    Copyright (c) 2022 Skyflow, Inc. 
*/
import { generateBearerToken, generateBearerTokenFromCreds, isExpired } from "skyflow-node";

let filepath = "CREDENTIALS_FILE_PATH";
let bearerToken = "";

// To generate Bearer Token from credentials string
let cred = {
    clientID: "<YOUR_clientID>",
    clientName: "<YOUR_clientName>",
    keyID: "<YOUR_keyID>",
    tokenURI: "<YOUR_tokenURI>",
    privateKey: "<YOUR_PEM_privateKey>",
};

function getSkyflowBearerTokenWithContextFromFilePath() {
    return new Promise(async (resolve, reject) => {
        try {
            const options = {
                ctx: "context_id",
            };
            if (!isExpired(bearerToken)) resolve(bearerToken);
            else {
                let response = await generateBearerToken(filepath, options);
                bearerToken = response.accessToken;
                resolve(bearerToken);
            }
        } catch (e) {
            reject(e);
        }
    });
}

function getSkyflowBearerTokenWithContextFromCreds() {
    return new Promise(async (resolve, reject) => {
        try {
            const options = {
                ctx: "context_id",
            };
            if (!isExpired(bearerToken)) resolve(bearerToken);
            else {
                let response = await generateBearerTokenFromCreds(
                    JSON.stringify(cred),
                    options
                );
                bearerToken = response.accessToken;
                resolve(bearerToken);
            }
        } catch (e) {
            reject(e);
        }
    });
}

const tokens = async () => {
    console.log(await getSkyflowBearerTokenWithContextFromFilePath());
    console.log(await getSkyflowBearerTokenWithContextFromCreds());

};

tokens();