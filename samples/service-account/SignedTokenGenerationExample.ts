/*
    Copyright (c) 2022 Skyflow, Inc. 
*/
import { generateSignedDataTokens, generateSignedDataTokensFromCreds, isValid } from "skyflow-node";

let filepath = "CREDENTIALS_FILE_PATH";

function getSignedTokenFromFilePath() {
    return new Promise(async (resolve, reject) => {
        try {
            const options = {
                 dataTokens: ['dataToken1','dataToken2'],
            };

            let response = await generateSignedDataTokens(filepath, options);
            resolve(response);

        } catch (e) {
            reject(e);
        }
    });
}


let cred = {
    clientID: "<YOUR_clientID>",
    clientName: "<YOUR_clientName>",
    keyID: "<YOUR_keyID>",
    tokenURI: "<YOUR_tokenURI>",
    privateKey: "<YOUR_PEM_privateKey>",
};

function getSignedTokenFromCreds() {
    return new Promise(async (resolve, reject) => {
        try {
            const options = {
                dataTokens: ['dataToken1','dataToken2'],
            };
            let response = await generateSignedDataTokensFromCreds(
                JSON.stringify(cred),
                options
            );
            resolve(response);
            
        } catch (e) {
            reject(e);
        }
    });
}


const tokens = async () => {
    console.log(await getSignedTokenFromFilePath());
    console.log(await getSignedTokenFromCreds());

};

tokens();