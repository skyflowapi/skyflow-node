/*
    Copyright (c) 2022 Skyflow, Inc. 
*/
import { generateSignedDataTokens, generateSignedDataTokensFromCreds } from "skyflow-node";

let filepath = "CREDENTIALS_FILE_PATH";

function getSignedTokenFromFilePath() {
    return new Promise(async (resolve, reject) => {
        try {
            const options = {
                 ctx:'ctx',
                 dataTokens: ['dataToken1','dataToken2'],
                 timeToLive: 90 // In seconds.
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
                ctx:'ctx',
                dataTokens: ['dataToken1','dataToken2'],
                timeToLive: 90 // In seconds.
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
    try{
        const tokenResponseFromFilePath:any = await getSignedTokenFromFilePath();
        tokenResponseFromFilePath.forEach((response)=>{
            console.log(`Data Token: ${response.token}`);
            console.log(`Signed Data Token: ${response.signedToken}`);
        });

        const tokenResponseFromCreds:any = await getSignedTokenFromCreds();
        tokenResponseFromCreds.forEach((response)=>{
            console.log(`Data Token: ${response.token}`);
            console.log(`Signed Data Token: ${response.signedToken}`);
        });

    }catch(error){
        console.log(error);
    }
};

tokens();