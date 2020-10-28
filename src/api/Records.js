import axios from 'axios';
import { notebookUrl } from './Notebooks';
import { isTokenValid } from '../http';
import VaultNotFoundException from '../CustomErrors/VaultNotFoundException';

const url = '/records'

const Records = {


    insertRecords(tableName, recordFields) {
        return this.callApi(
            ({ tableName, recordFields }) => {
                return axios.post(this.vaultUrl + '/' + tableName, {
                    records: recordFields
                }, {
                    headers: this.defaultHeaders
                })
                    .then(res => {
                        return res.data;
                    })
                    .catch(err => err && err.response && err.response.data)
            }, { tableName, recordFields })

    },

    getRecords(tableName) {
        return this.callApi(
            ({ tableName }) => {
                return axios.get(this.vaultUrl + '/' + tableName ,
                    {
                        headers: this.defaultHeaders
                    })
                    .then(res => {
                        return res.data;
                    })
                    .catch(err => err && err.response && err.response.data)
            }, { tableName })
    },

    getRecord(tableName, recordId) {
        return this.callApi(
            ({ tableName, recordId }) => {
                return axios.get(this.vaultUrl + '/' + tableName + '/' + recordId,
                    {
                        headers: this.defaultHeaders
                    })
                    .then(res => {
                        return res.data;
                    })
                    .catch(err => err && err.response && err.response.data)
            }, { tableName, recordId })
    },

    updateRecord(tableName, recordId, recordField) {
        return this.callApi(
            ({ tableName, recordId, recordField }) => {
                return axios.put(this.vaultUrl + '/' + tableName + '/' + recordId, {
                    record: recordField
                }, {
                    headers: this.defaultHeaders
                })
                    .then(res => res.data)
                    .catch(err => err && err.response && err.response.data)

            }, { tableName, recordId, recordField })


    },
    deleteRecord(tableName, recordId) {
        return this.callApi(
            ({ tableName, recordId }) => {
                return axios.delete(this.vaultUrl + '/' + tableName + '/' + recordId
                    , {
                        headers: this.defaultHeaders
                    })
                    .then(res => res.data)
                    .catch(err => err && err.response && err.response.data)
            }, { tableName, recordId })
    },

    deleteAllRecords(tableName) {
        return this.callApi(
            ({ tableName }) => {
                return axios.delete(this.vaultUrl + '/' + tableName ,
                    {
                        headers: this.defaultHeaders
                    })
                    .then(res => {
                        return res.data;
                    })
                    .catch(err => err && err.response && err.response.data)
            }, { tableName })
    }

}

export default Records;