// imports 
import { Authentication } from "../../ _generated_/rest/api/resources/authentication/client/Client";

class Client {

    authApi: Authentication;

    constructor(tokenUri: string) {
        this.authApi = new Authentication({
            baseUrl: tokenUri,
            token:''
        });
    }

}

export default Client;