import SkyflowApiClient from './skyflowApiClient';
import HTTP from './http';
// import fetch from 'fetch';
import axios from 'axios';

export default class Client extends SkyflowApiClient {
    
    constructor(appId = '', appSecret = '', orgUrl = 'http://api.skyflow.dev', bearerToken = 'eyJraWQiOiJ0aUdXd3JWcVNsRU50RUxJbGt2LUkwSklLejhReExzX0dZbzEtdl8zODk0IiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULmg0UTNnUl9paHkxc3pXZFlPTkdmVV9obndOdm9oVkpQdXBneDZFRXFsMlUiLCJpc3MiOiJodHRwczovL2F1dGguc2t5Zmxvdy5kZXYvb2F1dGgyL2RlZmF1bHQiLCJhdWQiOiJhcGk6Ly9kZWZhdWx0IiwiaWF0IjoxNTg2OTU3MTI3LCJleHAiOjE1ODY5NjA3MjcsImNpZCI6IjBvYTUxYmYza0JqOWh1TUxhNHg2IiwidWlkIjoiMDB1NWNzam5wTDJ6amRoa0M0eDYiLCJzY3AiOlsib3BlbmlkIiwicHJvZmlsZSIsImVtYWlsIl0sInN1YiI6InZhc2FudGgua3VtYXJAemVtb3NvbGFicy5jb20ifQ.Fc63aopo4dyQZaoj_9sroda2VxRQcme5UayWGqimViNXJJqm34Yq9lH4xuodWwXyfDACqAQw_pKOC8cS0Xm7Bssu3Bv-0F_nJtEp6Bn1hP6w4L2gALmQUUaix2FH8YAqSdNwE8-eQQtCmpTjHGbKoaEwvzqvirgQVc_Q-h7DjgHs6jIG4X4U9RQZmwPEfdlmgC55ipgP5879371f-NpkE7wVc0sWzeTdp53LvTxVHiPGfd94MP-r5kt2fbxbrRDy9xFdX_QvYg1TJi6250QB_ot_u8kZHrDULXvRvWNd5-3UAT9TUfjb4GVcDswDy-1rI8sfrbx7PlwPDAoTSdhYhg') {
        super()
        this.appId = appId
        this.appSecret = appSecret
        this.orgUrl = orgUrl
        this.bearerToken = bearerToken
        this.http = new HTTP();
    }

    getAppId() {
        return this.appId;
    }

    setAppId(appId) {
        this.appId = appId;
        return this;

    }

    getAppSecret(){
        return this.appSecret
    }

    setAppSecret(appSecret){
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
            if (pathParams.hasOwnProperty(key)) {
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

    callApi(path, method, pathParams, postBody, callback) {
        return this.http.fetch(this.buildRequest(path, method, pathParams, postBody, callback));
    }

}