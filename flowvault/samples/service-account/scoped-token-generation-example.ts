import {
  generateBearerToken,
  generateBearerTokenFromCreds,
  isExpired,
  LogLevel,
} from 'skyflow-flowvault-node';

const filepath = '<YOUR_CREDENTIALS_FILE_PATH>';
let bearerToken = '';

const cred = {
  clientID: '<YOUR_CLIENT_ID>',
  clientName: '<YOUR_CLIENT_NAME>',
  keyID: '<YOUR_KEY_ID>',
  tokenURI: '<YOUR_TOKEN_URI>',
  privateKey: '<YOUR_PEM_PRIVATE_KEY>',
};

// Scoped tokens restrict access to specific roles via roleIds.
async function getScopedBearerTokenFromFilePath(): Promise<string> {
  const options = {
    roleIds: ['<YOUR_ROLE_ID1>', '<YOUR_ROLE_ID2>'],
    // tokenUri: '<OVERRIDE_TOKEN_URI>', // optional
    logLevel: LogLevel.WARN,
  };
  if (!isExpired(bearerToken)) return bearerToken;
  const response = await generateBearerToken(filepath, options);
  bearerToken = response.accessToken;
  return bearerToken;
}

async function getScopedBearerTokenFromCreds(): Promise<string> {
  const options = {
    roleIds: ['<YOUR_ROLE_ID1>', '<YOUR_ROLE_ID2>'],
    logLevel: LogLevel.WARN,
  };
  if (!isExpired(bearerToken)) return bearerToken;
  const response = await generateBearerTokenFromCreds(JSON.stringify(cred), options);
  bearerToken = response.accessToken;
  return bearerToken;
}

(async () => {
  console.log('Scoped Token (from file):', await getScopedBearerTokenFromFilePath());
  console.log('Scoped Token (from string):', await getScopedBearerTokenFromCreds());
})();
