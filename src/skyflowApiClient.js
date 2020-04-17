import HTTP from './http';
import ModelsApi from './api/ModelsApi';
import OrganiztionsApi from './api/OrganizationsApi';
import UsersApi from './api/UsersApi';
import VaultsApi from './api/VaultsApi';
import NotebooksApi from './api/NotebooksApi';


class SkyflowApiClient {
    getAccessToken() {
        return new Promise((resolve, reject) => {
          Axios(`${properties.OKTA_DOMAIN_URL}/api/v1/authn`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: {
              username: properties.SKYFLOW_USERNAME,
              password: properties.SKYFLOW_PASSWORD,
            },
          })
            .then((res) => {
              Axios(
                `${properties.OKTA_ISSUER_URL}/v1/authorize?client_id=${properties.OKTA_CLIENT_ID}&nonce=test&state=test&redirect_uri=${properties.STUDIO_URL}/implicit/callback&response_type=token&scope=openid&sessionToken=${res.data.sessionToken}`,
                {
                  method: 'GET',
                  data: {},
                },
              )
                .then((response) => {
                  if (
                    response &&
                    response.request &&
                    response.request.res &&
                    response.request.res.responseUrl
                  ) {
                    const accessToken = response.request.res.responseUrl.match(
                      /\#(?:access_token)\=([\S\s]*?)\&/,
                    )[1];
      
                    resolve(accessToken);
                  } else {
                    reject("Can't retrieve token token");
                  }
                })
                .catch(err => {
                  reject(err);
                });
            })
            .catch(err => {
              reject(err);
            });
        });
      }
}

Object.assign(SkyflowApiClient.prototype, ModelsApi);
Object.assign(SkyflowApiClient.prototype, OrganiztionsApi)
Object.assign(SkyflowApiClient.prototype, UsersApi)
Object.assign(SkyflowApiClient.prototype,NotebooksApi);
Object.assign(SkyflowApiClient.prototype,VaultsApi);

export default SkyflowApiClient