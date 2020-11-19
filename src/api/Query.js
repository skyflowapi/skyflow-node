import axios from 'axios';

const url = 'query'

const Query = {
    query(query) {
        return this.callApi(
            ({ query, vault  }) => {
                return axios.post(this.vaultUrl + '/' + url, {
                    query,
                    vault
                }, {
                    headers: this.defaultHeaders
                })
                    .then(res => {
                        return res.data;
                    })
                    .catch(err => err && err.response && err.response.data)
            }, { query, vault : this.vaultId })
    }
}

export default Query;