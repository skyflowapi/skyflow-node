export type Credentials = 
  | TokenCredentials 
  | PathCredentials 
  | StringCredentials 
  | ApiKeyCredentials;

export interface TokenCredentials {
  token: string;
}

export interface PathCredentials {
  path: string;
  roles?: Array<string>;
  context?: string;
}

export interface StringCredentials {
  credentialsString: string;
  roles?: Array<string>;
  context?: string;
}

export interface ApiKeyCredentials {
  apiKey: string;
}

export default Credentials;