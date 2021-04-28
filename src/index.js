import SkyflowClient from './SkyflowClient';
import { isTokenValid } from './http';

function connect(workspaceUrl, vaultId, credentials, options) {
  return new SkyflowClient(workspaceUrl, vaultId, credentials, options);
}

export { connect, SkyflowClient, isTokenValid }

