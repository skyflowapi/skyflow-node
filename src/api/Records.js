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
                        if (callback) {
                            callback(res.data);
                        }
                        return res.data;
                    })
                    .catch(err => err && err.response && err.response.data)
            }, { tableName, recordFields })

    },

    bulkGetRecords(tableName, options, callback) {
        return this.callApi(
            ({ tableName, options = {} }) => {
                return axios.get(this.vaultUrl + '/' + tableName,

                    {
                        headers: this.defaultHeaders,
                        params: {
                            skyflow_ids: options.skyflowIds,
                            redaction: options.redaction,
                            tokenization: options.tokenization,
                            fields: options.fields,
                            offset: options.offset,
                            limit: options.limit
                        }
                    })
                    .then(res => {
                        if (callback) {
                            callback(res.data);
                        }
                        return res.data;
                    })
                    .catch(err => err && err.response && err.response.data)
            }, { tableName, options })
    },

    getRecord(tableName, recordId, options = {}, callback) {
        let url = this.vaultUrl + '/' + tableName + '/' + recordId

        return this.callApi(
            ({ options }) => {
                return axios.get(url,

                    {
                        headers: this.defaultHeaders,
                        params: {
                            redaction: options.redaction,
                            tokenization: options.tokenization,
                            fields: options.fields,

                        }
                    })
                    .then(res => {
                        if (callback) {
                            callback(res.data);
                        }
                        return res.data;
                    })
                    .catch(err => err && err.response && err.response.data)
            }, { options })
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
                        if (callback) {
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
                        if (callback) {
                            callback(res.data);
                        }
                        return res.data;
                    })
                    .catch(err => err && err.response && err.response.data)
            }, { tableName, recordId })
    },

    bulkDeleteRecords(tableName,skyflowIds = [], callback) {
        return this.callApi(
            ({ tableName,skyflowIds }) => {
                return axios.delete(this.vaultUrl + '/' + tableName,
                    {
                        headers: this.defaultHeaders,
                        params : {
                            skyflow_ids : skyflowIds,
                        }
                    })
                    .then(res => {
                        if (callback) {
                            callback(res.data);
                        }
                        return res.data;
                    })
                    .catch(err => err && err.response && err.response.data)
            }, { tableName,skyflowIds })
    }

}

export default Records;