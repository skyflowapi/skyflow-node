import AuthApi from './api/Auth';
import RecordApi from './api/Records';
import NotebookApi from './api/Notebooks';
import {isTokenValid} from './http' 
/**
     * Client to connect to Skyflow api
     * 
*/
let SkyflowClient = function () {
    
    this.initialize.apply(this, arguments);
};

const sandboxBaseUrl = "https://api.skyflow.tech/";
const prodBaseUrl = "https://api.skyflow.com/"

SkyflowClient.prototype = {

    initialize: function (orgId, username, password, appId, appSecret, options = {}) // + token
    {

        this.orgId = orgId;
        if (!username && !password) {
            throw new Error('Invalid username or password')
        }
        this.username = username;
        this.password = password;

        this.appSecret = appSecret;

        this.appId = appId;
        this.options = options;
        this.version = this.options.version || 'v1';
        this.baseUrl = this.options.prodApp ? prodBaseUrl + this.version : sandboxBaseUrl + this.version;
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
        // this.requestAgent = HTTPSAgent

        this.defaultHeaders = {
            'x-skyflow-org-id': this.orgId,
            'x-skyflow-app-id': this.appId,
            'x-skyflow-app-secret': this.appSecret,

        }

        if (this.browser && this.appSecret) {
            throw new Error(
                'You are publicly sharing your App Secret. Do not expose the App Secret in browsers, "native" mobile apps, or other non-trusted environments.',
            );
        }
        
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
            this.getAccessToken()
            .then(res => {
                this.defaultHeaders['Authorization'] = 'Bearer ' + res.accessToken
                this.accessToken = res.data.accessToken;
                return callback(...args);
            })
            .catch(err => err);
        }
    }
}

Object.assign(SkyflowClient.prototype, AuthApi);
Object.assign(SkyflowClient.prototype, RecordApi);
Object.assign(SkyflowClient.prototype, NotebookApi);

module.exports = SkyflowClient;
