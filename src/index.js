import SkyflowClient from './SkyflowClient';
import { isTokenValid } from './http';

function connect(accountName, workspaceName, vaultId, credentials, options) {
  return new SkyflowClient(accountName, workspaceName, vaultId, credentials, options);
}

export { connect, SkyflowClient, isTokenValid }

