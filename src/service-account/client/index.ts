// imports 
import { AuthenticationApi, Configuration } from "../../ _generated_/rest";


class Client {

    configuration: Configuration;

    authApi: AuthenticationApi;

    constructor(tokenURI: string) {
        this.configuration = new Configuration({
            basePath: tokenURI,
        });
        this.authApi = new AuthenticationApi(this.configuration);
    }

}

export default Client;