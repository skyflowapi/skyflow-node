import axios from 'axios';

const url = 'query'

const Query = {
    query(query,callback) {
        return this.callApi(
            ({ query, vault  }) => {
                return axios.post(this.vaultUrl + '/' + url, {
                    query,
                    vault
                }, {
                    headers: this.defaultHeaders
                })
                    .then(res => {
                        if(callback){
                            callback(res.data)
                        }
                        
                        return res.data;
                        
                    })
                    .catch(err => err && err.response && err.response.data)
            }, { query, vault : this.vaultId })
    }
}

export default Query;