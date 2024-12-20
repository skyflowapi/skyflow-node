
interface Credentials {
    token?: string;
    path?: string;
    credentialsString?: string;
    apiKey?: string;
    roles?: Array<string>;
    context?: string;
}

export default Credentials;