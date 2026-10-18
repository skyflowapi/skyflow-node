import {
  generateBearerToken,
  generateBearerTokenFromCreds,
  isExpired,
} from 'skyflow-flowvault-node';

const filepath = '<YOUR_CREDENTIALS_FILE_PATH>';
let bearerToken = '';

// To generate a Bearer Token from a credentials string.
const cred = {
  clientID: '<YOUR_CLIENT_ID>',
  clientName: '<YOUR_CLIENT_NAME>',
  keyID: '<YOUR_KEY_ID>',
  tokenURI: '<YOUR_TOKEN_URI>',
  privateKey: '<YOUR_PEM_PRIVATE_KEY>',
};

// Generate a Bearer Token from a credentials file path. Reuse it until it expires.
async function getBearerTokenFromFilePath(): Promise<string> {
  if (!isExpired(bearerToken)) return bearerToken;
  const response = await generateBearerToken(filepath);
  bearerToken = response.accessToken;
  return bearerToken;
}

// Generate a Bearer Token from a credentials string.
async function getBearerTokenFromCreds(): Promise<string> {
  if (!isExpired(bearerToken)) return bearerToken;
  const response = await generateBearerTokenFromCreds(JSON.stringify(cred));
  bearerToken = response.accessToken;
  return bearerToken;
}

(async () => {
  console.log('Generated Bearer Token (from file):', await getBearerTokenFromFilePath());
  console.log('Generated Bearer Token (from string):', await getBearerTokenFromCreds());
})();
