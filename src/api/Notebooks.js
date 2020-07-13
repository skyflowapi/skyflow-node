
import axios from 'axios';

export const notebookUrl = '/notebooks';

const Notebooks = {
    getNotebookByName(vaultId) {
        return axios.get(this.baseUrl + notebookUrl + '?orgID=' + this.defaultHeaders['x-skyflow-org-id'] + '&vaultID=' + vaultId 
            ,{
            headers: this.defaultHeaders
        })
            .then(res => res.data)
            .catch(err => err)
        
    },
}

export default Notebooks;