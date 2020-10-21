import Axios from 'axios';
import jwt from 'jsonwebtoken';

const Auth = {

    getAccessToken() {
        try {
            const credentialsObj = this.credentials;
            const claims = {
                "iss": credentialsObj.clientID,
                "key": credentialsObj.keyID,
                "aud": credentialsObj.tokenURI,
                "exp": (Math.floor(Date.now() / 1000)) + 60,
                "sub": credentialsObj.clientID,
            }
            const privateKey = credentialsObj.privateKey.toString("utf8");
            const signedJwt = jwt.sign(claims, privateKey, { algorithm: 'RS256' });
            return Axios.post(credentialsObj.tokenURI, {
                'grant_type': 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                'assertion': signedJwt,
            },
                { headers: { 'Content-Type': 'application/json' } })
                .then((res) => {
                    return res.data
                })
                .catch((err) => {
                    console.log(err)
                })
        } catch (e) {
            console.log(e)
        }
    }
}

export default Auth;