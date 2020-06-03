import SkyflowApiClient from './skyflowApiClient';
import HTTP from './http';

export default class Client extends SkyflowApiClient {

    constructor({ ...args }) {
        super()
        this.appId = args.appId
        this.appSecret = args.appSecret
        this.orgUrl = args.orgUrl || 'http://localhost:18081'
        this.username = args.username;
        this.password = args.password
        this.bearerToken = args.bearerToken;
        this.http = new HTTP();
    }

    getAppId() {
        return this.appId;
    }

    setAppId(appId) {
        this.appId = appId;
        return this;

    }

    getAppSecret() {
        return this.appSecret
    }

    setAppSecret(appSecret) {
        this.appSecret = appSecret;
        return this;

    }

    getOrgUrl() {
        return this.orgUrl
    }

    setOrgUrl(orgUrl) {
        this.orgUrl = orgUrl;
        return this;

    }

    getBearerToken() {
        return this.bearerToken
    }

    setBearerToken(bearerToken) {
        this.bearerToken = bearerToken
        return this;
    }

    buildRequest(path, method, pathParams, postBody, callback) {
        let request = {}
        request.defaultHeaders = {
            'X-SKYFLOW-APP-ID': this.appId,
            'X-SKYFLOW-APP-SECRET': this.appSecret,
            'Authorization': `Bearer ${this.bearerToken}`,
            'Content-Type': 'application/json',
            'accept': 'application/json'
        }

        let url = this.orgUrl + path;
        url = url.replace(/\{([\w-]+)\}/g, (fullMatch, key) => {
            var value;
            if (pathParams && pathParams.hasOwnProperty(key)) {
                value = this.paramToString(pathParams[key]);
            } else {
                value = fullMatch;
            }

            return encodeURIComponent(value);
        });

        request.url = url
        request.method = method
        request.body = postBody
        return request;
    }

    paramToString(param) {
        if (param == undefined || param == null) {
            return '';
        }
        if (param instanceof Date) {
            return param.toJSON();
        }

        return param.toString();
    }

    getAccessToken() {
        return this.http.fetch(this.buildRequest('/v1/auth/token', 'POST', {}, {username : this.username, password : this.password}))
        .then(res => res)
      }

 
    callApi(path, method, pathParams, postBody, callback) {
        if (this.isTokenValid())
        {   
            return this.http.fetch(this.buildRequest(path, method, pathParams, postBody, callback))
                .then(res => res)
                .catch(err => err);
        }else {
            return this.getAccessToken()
                .then(res => {               
                    this.bearerToken = res.accessToken;
                    return this.http.fetch(this.buildRequest(path, method, pathParams, postBody, callback))
                        .then(res => res)
                        .catch(err => err);
                })
                .catch(err => {
                    console.log(err);
                    return err;
                })
        }
    }

}