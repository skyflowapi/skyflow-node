import SkyflowClient from './SkyflowClient';
import {isTokenValid} from './http';

function connect(orgId, username, password, appId, appSecret, options) {
  return new SkyflowClient(orgId, username, password, appId, appSecret, options);
}

export {connect, SkyflowClient, isTokenValid}

