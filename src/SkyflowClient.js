import AuthApi from './api/Auth';
import RecordApi from './api/Records';
import NotebookApi from './api/Notebooks';
import QueryApi from './api/Query';
import {isTokenValid} from './http'
/**
     * Client to connect to Skyflow api
     * 
*/
let SkyflowClient = function () {
    
    this.initialize.apply(this, arguments);
};

const prodBaseUrl = "vault.skyflowapis.com"

SkyflowClient.prototype = {

    initialize: function (workspaceURL, vaultId, credentials, options = {}) // + token
    {

        this.vaultId = vaultId;
        this.credentials = credentials;

        this.options = options;
        this.version = '/' + (this.options.version || 'v1');
        this.baseUrl = prodBaseUrl + this.version;

        this.vaultUrl = 'https://' + workspaceURL + this.version + '/vaults/' + vaultId

        if(this.options.accessToken) {
            this.defaultHeaders['Authorization'] = 'Bearer ' + res.accessToken
            this.accessToken = res.accessToken;
        }
        this.handlers = {};
        this.browser =
            typeof this.options.browser !== 'undefined'
                ? this.options.browser
                : typeof window !== 'undefined';
        this.node = !this.browser;

        if (this.browser && this.credentials) {
            throw new Error(
                'You are publicly sharing your App Secret. Do not expose the App Secret in browsers, "native" mobile apps, or other non-trusted environments.',
            );
        }

        this.defaultHeaders = {}

         this.getAccessToken()
            .then(res => {
                this.defaultHeaders['Authorization'] = 'Bearer ' + res.accessToken
                this.accessToken = res.accessToken;
            })
            .catch(err => err);

    },
    callApi : function(callback, args) {
        if(isTokenValid(this.accessToken)) {
            return callback({...args});
        }
        else {
            return this.getAccessToken()
            .then(res => {
                this.defaultHeaders['Authorization'] = 'Bearer ' + res.accessToken
                this.accessToken = res.accessToken;
                return callback({...args});
            })
            .catch(err => err);
        }
    }
}

Object.assign(SkyflowClient.prototype, AuthApi);
Object.assign(SkyflowClient.prototype, RecordApi);
Object.assign(SkyflowClient.prototype, NotebookApi);
Object.assign(SkyflowClient.prototype, QueryApi);

module.exports = SkyflowClient;
