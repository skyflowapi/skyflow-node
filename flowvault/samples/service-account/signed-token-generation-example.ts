import {
  generateSignedDataTokens,
  generateSignedDataTokensFromCreds,
} from 'skyflow-flowvault-node';

const filepath = '<YOUR_CREDENTIALS_FILE_PATH>';

const cred = {
  clientID: '<YOUR_CLIENT_ID>',
  clientName: '<YOUR_CLIENT_NAME>',
  keyID: '<YOUR_KEY_ID>',
  tokenURI: '<YOUR_TOKEN_URI>',
  privateKey: '<YOUR_PEM_PRIVATE_KEY>',
};

// Approach 1: signed data tokens with a string context.
async function getSignedTokensWithStringContext() {
  const options = {
    ctx: 'user_12345',
    dataTokens: ['<DATA_TOKEN1>', '<DATA_TOKEN2>'],
    timeToLive: 30, // in seconds
  };
  return generateSignedDataTokens(filepath, options);
}

// Approach 2: signed data tokens with an object context. Each key maps to a
// Skyflow CEL policy variable under request.context.*, e.g.
//   request.context.role == "analyst" && request.context.department == "research"
async function getSignedTokensWithObjectContext() {
  const options = {
    ctx: { role: 'analyst', department: 'research', user_id: 'user_67890' },
    dataTokens: ['<DATA_TOKEN1>', '<DATA_TOKEN2>'],
    timeToLive: 30,
  };
  return generateSignedDataTokens(filepath, options);
}

// Approach 3: signed data tokens from a credentials string.
async function getSignedTokensFromCreds() {
  const options = {
    ctx: 'user_12345',
    dataTokens: ['<DATA_TOKEN1>', '<DATA_TOKEN2>'],
    timeToLive: 30,
  };
  return generateSignedDataTokensFromCreds(JSON.stringify(cred), options);
}

(async () => {
  console.log('String context:', await getSignedTokensWithStringContext());
  console.log('Object context:', await getSignedTokensWithObjectContext());
  console.log('Creds string:', await getSignedTokensFromCreds());
})();
