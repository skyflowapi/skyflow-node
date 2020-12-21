import axios from 'axios';
import VaultNotFoundException from '../CustomErrors/VaultNotFoundException';

const Records = {


    bulkInsertRecords(tableName, recordFields, callback) {
        return this.callApi(
            ({ tableName, recordFields }) => {
                return axios.post(this.vaultUrl + '/' + tableName, {
                    records: recordFields
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
            }, { tableName, recordFields })

    },

    bulkGetRecords(tableName, callback) {
        return this.callApi(
            ({ tableName }) => {
                return axios.get(this.vaultUrl + '/' + tableName ,
                    {
                        headers: this.defaultHeaders
                    })
                    .then(res => {
                        if(callback) {
                            callback(res.data);
                        }
                        return res.data;
                    })
                    .catch(err => err && err.response && err.response.data)
            }, { tableName })
    },

    getRecord(tableName, recordId, dlp, callback) {
        let url = this.vaultUrl + '/' + tableName + '/' + recordId
        if(dlp) {
            url+='?dlp=' + dlp
        }
        return this.callApi(
            ({ tableName, recordId }) => {
                return axios.get(url,
                    {
                        headers: this.defaultHeaders
                    })
                    .then(res => {
                        if(callback) {
                            callback(res.data);
                        }
                        return res.data;
                    })
                    .catch(err => err && err.response && err.response.data)
            }, { tableName, recordId })
    },

    updateRecord(tableName, recordId, recordField, callback) {
        return this.callApi(
            ({ tableName, recordId, recordField }) => {
                return axios.put(this.vaultUrl + '/' + tableName + '/' + recordId, {
                    record: recordField
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

            }, { tableName, recordId, recordField })


    },
    deleteRecord(tableName, recordId, callback) {
        return this.callApi(
            ({ tableName, recordId }) => {
                return axios.delete(this.vaultUrl + '/' + tableName + '/' + recordId
                    , {
                        headers: this.defaultHeaders
                    })
                    .then(res => {
                        if(callback) {
                            callback(res.data);
                        }
                        return res.data;
                    })
                    .catch(err => err && err.response && err.response.data)
            }, { tableName, recordId })
    },

    bulkDeleteRecords(tableName, callback) {
        return this.callApi(
            ({ tableName }) => {
                return axios.delete(this.vaultUrl + '/' + tableName ,
                    {
                        headers: this.defaultHeaders
                    })
                    .then(res => {
                        if(callback) {
                            callback(res.data);
                        }
                        return res.data;
                    })
                    .catch(err => err && err.response && err.response.data)
            }, { tableName })
    }

}

export default Records;