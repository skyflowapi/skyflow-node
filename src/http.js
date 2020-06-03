import fetchHttp from 'fetch';
import axios from 'axios';

export default class HTTP {
    get(request) {
        return axios.get(request.url, {
            headers: request.defaultHeaders
        })
            .then(res => res.data)
            .catch(err => err)
    }

    post(request) {
        return axios.post(request.url, request.body, {
            headers: request.defaultHeaders,
        })
            .then(res => res.data)
            .catch(err => err)
    }

    put(request) {
        return axios.put(request.url, request.body, {
            headers: request.defaultHeaders
        })
            .then(res => { res.data })
            .catch(err => err)
    }

    delete(request) {
        return axios.delete(request.url, {
            headers: request.defaultHeaders
        })
            .then(res => { res.data })
            .catch(err => err)
    }

    fetch(request) {
        switch (request.method) {
            case 'GET': return this.get(request);
            case 'POST': return this.post(request);
            case 'PUT': return this.put(request)
            case 'DELETE': return this.delete(request)
        }

    }

}