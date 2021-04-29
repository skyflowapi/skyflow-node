import axios from 'axios';
import VaultNotFoundException from '../CustomErrors/VaultNotFoundException';

const Tokens = {


    getRecordByToken(token, options, callback) {
        return this.callApi(
            ({ token, options }) => {
                return axios.get(this.vaultUrl + '/' + 'tokens/' + token,  {
                    headers: this.defaultHeaders,
                    params : {
                        redaction : options.redaction
                    }
                })
                .then(res => {
                    if(callback) {
                        callback(res.data);
                    }
                    return res.data;
                })
                    .catch(err => err && err.response && err.response.data)
            }, { token, options })

    },
    getBulkRecordsByTokens(tokens, options, callback) {
        return this.callApi(
            ({ tokens, options }) => {
                return axios.get(this.vaultUrl + '/' + 'tokens', {
                    params : {
                        token_ids : tokens,
                        redaction: options.redaction,
                    }
                }, {
                    headers: this.defaultHeaders
                })
                .then(res => {
                    if(callback) {
                        callback(res.data);
                    }
                    return res.data;
                })
                    .catch(err => err && err.response && err.response.data)
            }, { tokens,options })

    },
 

}

export default Tokens;