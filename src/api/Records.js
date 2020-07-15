import axios from 'axios';
import { notebookUrl } from './Notebooks';
import { isTokenValid } from '../http';

const url = '/records'

const Records = {


    insertRecord(vaultId, recordFields) {
        return this.callApi(
            ({ vaultId, recordFields }) => {
                return this.getNotebookByName(vaultId)
                    .then(res => res.result.notebook)
                    .then(res => {
                        return axios.post(this.baseUrl + notebookUrl + '/' + res.ID + url, {
                            fields: recordFields,
                            notebookID: res.ID
                        }, {
                            headers: this.defaultHeaders
                        })
                            .then(res => {
                                return res.data;
                            })
                            .catch(err => err)
                    })


            }, { vaultId, recordFields })

    },

    getRecord(vaultId, recordId) {

        return this.callApi(
            ({ vaultId, recordId }) => {
                return this.getNotebookByName(vaultId)
                    .then(res => res.result.notebook)
                    .then(res => {
                        return axios.get(this.baseUrl + notebookUrl + '/' + res.ID + url + '/' + recordId,
                            {
                                headers: this.defaultHeaders
                            })
                            .then(res => {
                                return res.data;
                            })
                            .catch(err => err)
                    })


            }, { vaultId, recordId })
    },

    updateRecord(vaultId, recordId, recordFields) {
        return this.callApi(
            ({ vaultId, recordId }) => {
                return this.getNotebookByName(vaultId)
                    .then(res => res.result.notebook)
                    .then(res => {
                        return axios.put(this.baseUrl + notebookUrl + '/' + res.ID + url + '/' + recordId, {
                            fields: recordFields,
                            notebookID: res.ID
                        }, {
                            headers: this.defaultHeaders
                        })
                            .then(res => res.data)
                            .catch(err => err)
                    })


            }, { vaultId, recordId })


    },
    deleteRecord(vaultId, recordId) {
        return this.callApi(
            ({ vaultId, recordId }) => {
                return this.getNotebookByName(vaultId)
                    .then(res => res.result.notebook)
                    .then(res => {
                        return axios.delete(this.baseUrl + notebookUrl + '/' + res.ID + url + '/' + recordId
                            , {
                                headers: this.defaultHeaders
                            })
                            .then(res => res.data)
                            .catch(err => err)
                    })


            }, { vaultId, recordId })



    },

    insertBulkRecord(vaultId, recordFields) {
        return this.callApi(
            ({ vaultId, recordFields }) => {
                return this.getNotebookByName(vaultId)
                    .then(res => res.result.notebook)
                    .then(res => {
                        return axios.post(this.baseUrl + notebookUrl + '/' + res.ID + url, {
                            records: recordFields,
                            notebookID: res.ID
                        }, {
                            headers: this.defaultHeaders
                        })
                            .then(res => {
                                return res.data;
                            })
                            .catch(err => err)
                    })
            }, { vaultId, recordFields })
    }
}

export default Records;