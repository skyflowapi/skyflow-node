import ModelsApi from './api/ModelsApi';
import OrganiztionsApi from './api/OrganizationsApi';
import UsersApi from './api/UsersApi';
import VaultsApi from './api/VaultsApi';
import NotebooksApi from './api/NotebooksApi';
import AuthenticationApi from './api/AuthenticationApi';
import RecordsApi from './api/RecordsApi'
import jwtDecode from 'jwt-decode';

class SkyflowApiClient {

  isTokenValid() {
    let decodedToken;
    try {
      decodedToken = jwtDecode(this.bearerToken);
    }
    catch (e) {
      return false;
    }
    return !(decodedToken.exp * 1000 < Date.now());
  }

  searchNotebook(vaultId, notebookName) {
    return this.http.fetch(this.buildRequest(`/v1/notebooks?vaultID=${vaultId}&&notebookName=${notebookName}`, 'GET'))
      .then(res => res)
      .catch(err => err)
  }

}

Object.assign(SkyflowApiClient.prototype, ModelsApi);
Object.assign(SkyflowApiClient.prototype, OrganiztionsApi)
Object.assign(SkyflowApiClient.prototype, UsersApi)
Object.assign(SkyflowApiClient.prototype, NotebooksApi);
Object.assign(SkyflowApiClient.prototype, VaultsApi);
Object.assign(SkyflowApiClient.prototype, AuthenticationApi);
Object.assign(SkyflowApiClient.prototype, RecordsApi);

export default SkyflowApiClient