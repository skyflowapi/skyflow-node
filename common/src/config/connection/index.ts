//imports
import Credentials from "../credentials";

interface ConnectionConfig {
    connectionUrl: string;
    connectionId: string;
    credentials?: Credentials;
}

export default ConnectionConfig;
