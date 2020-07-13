import axios from 'axios';

const Auth = {
    getAccessToken() {
        return axios.post(this.baseUrl + '/auth/token', { 
            username: this.username,
            password : this.password
        },{
            headers: this.defaultHeaders
        })
            .then(res => res.data)
            .catch(err => console.log(err))
        
    }
}

export default Auth;