// imports 
import { Authentication } from "../../ _generated_/rest/api/resources/authentication/client/Client";

class Client {

    authApi: Authentication;

    constructor(tokenURI: string) {
        this.authApi = new Authentication({
            baseUrl: tokenURI,
            token:''
        });
    }

}

export default Client;