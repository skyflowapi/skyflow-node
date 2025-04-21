import sdkDetails from "../../../package.json";

const errorPrefix = `Skyflow Node SDK v${sdkDetails.version}`;

const errorMessages = {
    CONFIG_MISSING: `${errorPrefix} Initialization failed. Skyflow config cannot be empty. Specify a valid skyflow config.`,
    INVALID_SKYFLOW_CONFIG: `${errorPrefix} Initialization failed. Invalid skyflow config. Vault/Connection config key missing in skyflow config.`,
    INVALID_TYPE_FOR_CONFIG: `${errorPrefix} Initialization failed. Invalid %s1 config. Specify a valid %s1 config.`,
    EMPTY_VAULT_CONFIG: `${errorPrefix} Initialization failed. Vault config cannot be empty. Specify a valid vault config.`,
    EMPTY_CONNECTION_CONFIG: `${errorPrefix} Initialization failed. Connection config cannot be empty. Specify a valid connection config.`,

    EMPTY_VAULT_ID: `${errorPrefix} Initialization failed. Invalid vault ID. Specify a valid vault Id.`,
    EMPTY_VAULT_ID_VALIDATION: `${errorPrefix} Validation error. Invalid vault ID. Specify a valid vault Id.`,
    INVALID_VAULT_ID: `${errorPrefix} Initialization failed. Invalid vault ID. Specify a valid vault Id as a string.`,
    EMPTY_CLUSTER_ID: `${errorPrefix} Initialization failed. Invalid cluster ID. Specify a valid cluster Id for vault with vaultId %s1 .`,
    INVALID_CLUSTER_ID: `${errorPrefix} Initialization failed. Invalid cluster ID. Specify cluster Id as a string for vault with vaultId %s1.`,
    INVALID_TOKEN: `${errorPrefix} Validation error. Invalid token. Specify a valid token.`,
    TOKEN_EXPIRED: `${errorPrefix} Validation error. Token provided is either invalid or has expired. Specify a valid token.`,
    INVALID_ENV: `${errorPrefix} Initialization failed. Invalid env. Specify a valid env for vault with vaultId %s1.`,
    INVALID_LOG_LEVEL: `${errorPrefix} Initialization failed. Invalid log level. Specify a valid log level.`,
    EMPTY_CREDENTIAL_FILE_PATH: `${errorPrefix} Initialization failed. Invalid credentials. Specify a valid file path.`,
    INVALID_CREDENTIAL_FILE_PATH: `${errorPrefix} Initialization failed. Invalid credentials. Expected file path to be a string.`,
    
    INVALID_FILE_PATH: `${errorPrefix} Initialization failed. Invalid skyflow credentials. Expected file path to exists.`,
    INVALID_API_KEY: `${errorPrefix} Initialization failed. Invalid skyflow credentials. Specify a valid api key.`,
    INVALID_PARSED_CREDENTIALS_STRING: `${errorPrefix} Initialization failed. Invalid skyflow credentials. Specify a valid credentials string.`,
    INVALID_BEARER_TOKEN: `${errorPrefix} Initialization failed. Invalid skyflow credentials. Specify a valid token.`,

    INVALID_FILE_PATH_WITH_ID: `${errorPrefix} Initialization failed. Invalid credentials. Expected file path to exists for %s1 with %s2 %s3.`,
    INVALID_API_KEY_WITH_ID: `${errorPrefix} Initialization failed. Invalid credentials. Specify a valid api key for %s1 with %s2 %s3.`,
    INVALID_PARSED_CREDENTIALS_STRING_WITH_ID: `${errorPrefix} Initialization failed. Invalid credentials. Specify a valid credentials string for %s1 with %s2 %s3.`,
    INVALID_BEARER_TOKEN_WITH_ID: `${errorPrefix} Initialization failed. Invalid credentials. Specify a valid token for %s1 with %s2 %s3.`,

    EMPTY_CONNECTION_ID_VALIDATION: `${errorPrefix} Validation error. Invalid connection ID. Specify a valid connection Id.`,
    EMPTY_CONNECTION_ID: `${errorPrefix} Initialization failed. Invalid connection ID. Specify a valid connection Id.`,
    INVALID_CONNECTION_ID: `${errorPrefix} Initialization failed. Invalid connection ID. Specify connection Id as a string.`,
    EMPTY_CONNECTION_URL: `${errorPrefix} Initialization failed. Invalid connection URL. Specify a valid connection Url.`,
    INVALID_CONNECTION_URL: `${errorPrefix} Initialization failed. Invalid connection URL. Specify connection Url as a valid url.`,

    VAULT_ID_EXITS_IN_CONFIG_LIST: `${errorPrefix} Validation error. %s1 already exists in the config list. Specify a new vaultId.`,
    CONNECTION_ID_EXITS_IN_CONFIG_LIST: `${errorPrefix} Validation error. %s1 already exists in the config list. Specify a new vaultId.`,
    VAULT_ID_NOT_IN_CONFIG_LIST: `${errorPrefix} Validation error. %s1 is missing from the config. Specify the vaultId's from config.`,
    CONNECTION_ID_NOT_IN_CONFIG_LIST: `${errorPrefix} Validation error. %s1 is missing from the config. Specify the connectionIds from config.`,

    EMPTY_CREDENTIALS: `${errorPrefix} Validation error. Invalid credentials. Credentials must not be empty.`,
    INVALID_CREDENTIALS: `${errorPrefix} Validation error. Invalid credentials. Specify a valid credentials.`,
    CREDENTIALS_WITH_NO_VALID_KEY: `${errorPrefix} Validation error. Invalid credentials. Credentials must include one of the following: { apiKey, token, credentials, path }.`,
    MULTIPLE_CREDENTIALS_PASSED: `${errorPrefix} Validation error. Multiple credentials provided. Specify only one of the following: { apiKey, token, credentials, path }.`,
    INVALID_CREDENTIALS_WITH_ID: `${errorPrefix} Validation error. Invalid credentials. Credentials must include one of the following: { apiKey, token, credentials, path } for %s1 with %s2 %s3.`,
    MULTIPLE_CREDENTIALS_PASSED_WITH_ID: `${errorPrefix} Validation error. Invalid credentials.Specify only one of the following: { apiKey, token, credentials, path } for %s1 with %s2 %s3.`,
    
    FILE_NOT_FOUND: `${errorPrefix} Validation error. Credential file not found at %s1. Verify the file path.`,
    INVALID_JSON_FILE: `${errorPrefix} Validation error. File at %s1 is not in valid JSON format. Verify the file contents.`,

    EMPTY_CREDENTIALS_STRING: `${errorPrefix} Validation error. Invalid credentials. Specify a valid credentials.`,
    INVALID_CREDENTIALS_STRING: `${errorPrefix} Validation error. Invalid credentials. Specify credentials as a string.`,

    MISSING_PRIVATE_KEY: `${errorPrefix} Validation error. Unable to read private key in credentials. Verify your private key.`,
    MISSING_CLIENT_ID: `${errorPrefix} Validation error. Unable to read client ID in credentials. Verify your client ID.`,
    MISSING_KEY_ID: `${errorPrefix} Validation error. Unable to read key ID in credentials. Verify your key ID.`,
    MISSING_TOKEN_URI: `${errorPrefix} Validation error. Unable to read token URI in credentials. Verify your token URI.`,

    INVALID_ROLES_KEY_TYPE: `${errorPrefix} Validation error. Invalid roles. Specify roles as an array.`,
    EMPTY_ROLES: `${errorPrefix} Validation error. Invalid roles. Specify at least one role.`,

    INVALID_JSON_FORMAT: `${errorPrefix} Validation error. Credentials is not in valid JSON format. Verify the credentials.`,

    EMPTY_DATA_TOKENS: `${errorPrefix} Validation error. Invalid data tokens. Specify valid data tokens.`,
    DATA_TOKEN_KEY_TYPE: `${errorPrefix} Validation error. Invalid data tokens. Specify data token as an string array.`,
    TIME_TO_LIVE_KET_TYPE: `${errorPrefix} Validation error. Invalid time to live. Specify time to live parameter as an string.`,

    INVALID_DELETE_IDS_INPUT: `${errorPrefix} Validation error. Invalid delete ids type in delete request. Specify delete ids as a string array.`,
    EMPTY_DELETE_IDS: `${errorPrefix} Validation error. Delete ids array cannot be empty. Specify id's in delete request.`,
    INVALID_ID_IN_DELETE: `${errorPrefix} Validation error. Invalid type of id passed in delete request. Id must be of type string at index %s1.`,
    INVALID_DELETE_REQUEST: `${errorPrefix} Validation error. Invalid delete request. Specify a valid delete request.`,
    EMPTY_ID_IN_DELETE: `${errorPrefix} Validation error. Id cannot be empty in delete request. Specify a valid id.`,

    MISSING_REDACTION_TYPE_IN_DETOKENIZE: `${errorPrefix} Validation error. Redaction type cannot be empty in detokenize request. Specify the redaction type.`,
    INVALID_REDACTION_TYPE_IN_DETOKENIZE: `${errorPrefix} Validation error. Invalid redaction type in detokenize request. Specify a redaction type.`,
    INVALID_TOKENS_TYPE_IN_DETOKENIZE: `${errorPrefix} Validation error. Invalid tokens type in detokenize request. Specify tokens as a string array.`,
    EMPTY_TOKENS_IN_DETOKENIZE: `${errorPrefix} Validation error. Tokens array cannot be empty. Specify token's in detokenize request.`,
    EMPTY_TOKEN_IN_DETOKENIZE: `${errorPrefix} Validation error. Token cannot be empty in detokenize request. Specify a valid token at index %s1.`,
    INVALID_TOKEN_IN_DETOKENIZE: `${errorPrefix} Validation error. Invalid type of token passed in detokenize request. token must be of type string at index %s1.`,
    INVALID_DETOKENIZE_REQUEST: `${errorPrefix} Validation error. Invalid detokenize request. Specify a valid detokenize request.`,

    MISSING_VALUES_IN_TOKENIZE: `${errorPrefix} Validation error. Values cannot be empty in tokenize request. Specify valid values.`,
    INVALID_VALUES_TYPE_IN_TOKENIZE: `${errorPrefix} Validation error. Invalid values type in tokenize request. Specify valid values of type array.`,
    EMPTY_VALUES_IN_TOKENIZE: `${errorPrefix} Validation error. Values array cannot be empty. Specify value's in tokenize request.`,
    EMPTY_DATA_IN_TOKENIZE: `${errorPrefix} Validation error. Data cannot be empty in tokenize request. Specify a valid data at index %s1.`,
    INVALID_DATA_IN_TOKENIZE: `${errorPrefix} Validation error. Invalid Data. Specify a valid data at index %s1.`,
    INVALID_COLUMN_GROUP_IN_TOKENIZE: `${errorPrefix} Validation error. Invalid type of column group passed in tokenize request. Column group must be of type string at index %s1.`,
    INVALID_VALUE_IN_TOKENIZE: `${errorPrefix} Validation error. Invalid type of value passed in tokenize request. Value must be of type string at index %s1.`,
    INVALID_TOKENIZE_REQUEST: `${errorPrefix} Validation error. Invalid tokenize request. Specify a valid tokenize request.`,
    EMPTY_COLUMN_GROUP_IN_TOKENIZE: `${errorPrefix} Validation error. Column group cannot be empty in tokenize request. Specify a valid column group at index %s1.`,
    EMPTY_VALUE_IN_TOKENIZE: `${errorPrefix} Validation error. Value cannot be empty in tokenize request. Specify a valid value at index %s1.`,

    INVALID_RECORD_IN_INSERT: `${errorPrefix} Validation error. Invalid data in insert request. data must be of type object at index %s1.`,
    INVALID_RECORD_IN_UPDATE: `${errorPrefix} Validation error. Invalid data in update request. data must be of type object.`,
    EMPTY_RECORD_IN_INSERT: `${errorPrefix} Validation error. Data cannot be empty in insert request. Specify valid data at index %s1.`,
    INVALID_INSERT_REQUEST: `${errorPrefix} Validation error. Invalid insert request. Specify a valid insert request.`,
    INVALID_TYPE_OF_DATA_IN_INSERT: `${errorPrefix} Validation error. Invalid type of data in insert request. Specify data as a object array.`,
    EMPTY_DATA_IN_INSERT: `${errorPrefix} Validation error. Data array cannot be empty. Specify data in insert request.`,

    INVALID_QUERY_REQUEST: `${errorPrefix} Validation error. Invalid query request. Specify a valid query request.`,
    EMPTY_QUERY: `${errorPrefix} Validation error. Query cannot be empty in query request. Specify a valid query.`,
    INVALID_QUERY: `${errorPrefix} Validation error. Invalid query in query request. Specify a valid query.`,

    INVALID_FILE_UPLOAD_REQUEST: `${errorPrefix} Validation error. Invalid file upload request. Specify a valid file upload request.`,
    MISSING_TABLE_IN_UPLOAD_FILE: `${errorPrefix} Validation error. Table name cannot be empty in file upload request. Specify table name as a string.`,
    INVALID_TABLE_IN_UPLOAD_FILE: `${errorPrefix} Validation error. Invalid table name in file upload request. Specify a valid table name.`,
    MISSING_SKYFLOW_ID_IN_UPLOAD_FILE: `${errorPrefix} Validation error. Skyflow id cannot be empty in file upload request. Specify a valid skyflow Id as string.`,
    INVALID_SKYFLOW_ID_IN_UPLOAD_FILE: `${errorPrefix} Validation error. Invalid skyflow Id in file upload request. Specify a valid skyflow Id.`,
    MISSING_COLUMN_NAME_IN_UPLOAD_FILE: `${errorPrefix} Validation error. Column name cannot be empty in file upload request. Specify a valid column name as string.`,
    INVALID_COLUMN_NAME_IN_UPLOAD_FILE: `${errorPrefix} Validation error. Invalid column name in file upload request. Specify a valid column name.`,
    MISSING_FILE_PATH_IN_UPLOAD_FILE: `${errorPrefix} Validation error. File path cannot be empty in file upload request. Specify a valid file path as string.`,
    INVALID_FILE_PATH_IN_UPLOAD_FILE: `${errorPrefix} Validation error. Invalid file path in file upload request. Specify a valid file path.`,

    MISSING_SKYFLOW_ID_IN_UPDATE: `${errorPrefix} Validation error. Skyflow id name cannot be empty in update request. Specify a skyflow Id name as string.`,
    INVALID_SKYFLOW_ID_IN_UPDATE: `${errorPrefix} Validation error. Invalid skyflow Id in update request. Specify a valid skyflow Id.`,
    INVALID_TYPE_OF_UPDATE_DATA: `${errorPrefix} Validation error. Invalid update data in update request. Specify a valid update data as array of object.`,
    EMPTY_UPDATE_DATA: `${errorPrefix} Validation error. Update data cannot be empty in update request. Specify a valid update data.`,
    INVALID_UPDATE_REQUEST: `${errorPrefix} Validation error. Invalid update request. Specify a valid update request.`,
    INVALID_DATA_IN_UPDATE: `${errorPrefix} Validation error. Invalid data in update request. data must be of type object at index %s1.`,
    EMPTY_DATA_IN_UPDATE: `${errorPrefix} Validation error. Data cannot be empty in update request. Specify a valid data at index %s1.`,
    INVALID_UPDATE_TOKENS: `${errorPrefix} Validation error. Invalid tokens. Specify valid tokens as object.`,
    INVALID_TOKEN_IN_UPDATE: `${errorPrefix} Validation error. Invalid tokens. Specify valid tokens as key value pairs.`,

    EMPTY_TABLE_NAME: `${errorPrefix} Validation error. Table name cannot be empty. Specify a valid table name.`,
    INVALID_TABLE_NAME: `${errorPrefix} Validation error. Invalid table name. Specify a valid table name as string.`,
    EMPTY_REDACTION_TYPE: `${errorPrefix} Validation error. Redaction type cannot be empty. Specify a valid redaction type.`,
    INVALID_REDACTION_TYPE: `${errorPrefix} Validation error. Invalid redaction type. Specify a valid redaction type.`,

    INVALID_TYPE_OF_IDS: `${errorPrefix} Validation error. Invalid ids passed in get request. Specify valid ids as array of string.`,
    EMPTY_IDS_IN_GET: `${errorPrefix} Validation error. Ids cannot be empty in get request. Specify valid ids.`,
    EMPTY_ID_IN_GET: `${errorPrefix} Validation error. Id cannot be empty. Specify a valid Id at index %s1.`,
    INVALID_ID_IN_GET: `${errorPrefix} Validation error. Invalid Id. Specify a valid Id at index %s1 as string.`,
    INVALID_GET_REQUEST: `${errorPrefix} Validation error. Invalid get request. Specify a valid get request.`,

    EMPTY_COLUMN_NAME: `${errorPrefix} Validation error. Column name cannot be empty. Specify a valid column name.`,
    INVALID_COLUMN_NAME: `${errorPrefix} Validation error. Invalid column name. Specify a valid column name as string.`,
    INVALID_COLUMN_VALUES: `${errorPrefix} Validation error. Invalid column values. Specify valid column values as string array.`,
    EMPTY_COLUMN_VALUES: `${errorPrefix} Validation error. Column values cannot be empty. Specify valid column values.`,
    EMPTY_COLUMN_VALUE: `${errorPrefix} Validation error. Column value cannot be empty. Specify a valid column value at index %s1.`,
    INVALID_COLUMN_VALUE: `${errorPrefix} Validation error. Invalid column value. Specify a valid column value at index %s1 as string.`,
    INVALID_GET_COLUMN_REQUEST: `${errorPrefix} Validation error. Invalid get column request. Specify a valid get column request.`,

    EMPTY_URL: `${errorPrefix} Validation error. Url cannot be empty. Specify a valid url.`,
    INVALID_URL: `${errorPrefix} Validation error. Invalid url. Specify a valid url as a string.`,
    EMPTY_METHOD_NAME: `${errorPrefix} Validation error. Method name cannot be empty. Specify a valid method name.`,
    INVALID_METHOD_NAME: `${errorPrefix} Validation error. Invalid method name. Specify a valid method name as a string.`,

    EMPTY_PATH_PARAMS: `${errorPrefix} Validation error. Path params cannot be empty. Specify valid path params.`,
    INVALID_PATH_PARAMS: `${errorPrefix} Validation error. Invalid path params. Specify valid path params.`,
    EMPTY_QUERY_PARAMS: `${errorPrefix} Validation error. Query params cannot be empty. Specify valid query params.`,
    INVALID_QUERY_PARAMS: `${errorPrefix} Validation error. Invalid query params. Specify valid query params.`,
    EMPTY_BODY: `${errorPrefix} Validation error. Body cannot be empty. Specify a valid body.`,
    INVALID_BODY: `${errorPrefix} Validation error. Invalid body. Specify a valid body.`,
    EMPTY_HEADERS: `${errorPrefix} Validation error. Headers cannot be empty. Specify valid headers.`,
    INVALID_HEADERS: `${errorPrefix} Validation error. Invalid headers. Specify valid headers.`,

    INVALID_INVOKE_CONNECTION_REQUEST: `${errorPrefix} Validation error. Invalid invoke connection request. Specify a valid get invoke connection request.`,
    ERROR_OCCURRED: `${errorPrefix} API error. Error occurred.`,

    EMPTY_INSERT_TOKEN: `${errorPrefix} Validation error. Tokens object cannot be empty. Specify a valid tokens object at index %s1.`,
    INVALID_INSERT_TOKEN: `${errorPrefix} Validation error. Invalid tokens object. Specify a valid tokens object at index %s1.`,
    INVALID_INSERT_TOKENS: `${errorPrefix} Validation error. Invalid tokens. Specify valid tokens as object array.`,
    INVALID_TOKEN_MODE: `${errorPrefix} Validation error. The token mode key has a value of type %s1. Specify token as type of TokenMode.`,
    INVALID_HOMOGENEOUS: `${errorPrefix} Validation error. The homogeneous key has a value of type %s1. Specify homogeneous as boolean.`,
    INVALID_TOKEN_STRICT: `${errorPrefix} Validation error. The tokenStrict key has a value of type %s1. Specify tokenStrict as boolean.`,
    INVALID_CONTINUE_ON_ERROR: `${errorPrefix} Validation error. The continueOnError key has a value of type %s1. Specify continueOnError as boolean.`,
    INVALID_UPSERT: `${errorPrefix} Validation error. The upsert key has a value of type %s1. Specify upsert as string.`,
    INVALID_RETURN_TOKEN: `${errorPrefix} Validation error. The returnToken key has a value of type %s1. Specify returnToken as boolean.`,

    NO_TOKENS_WITH_TOKEN_MODE: `${errorPrefix} Validation error. Tokens weren't specified for records while 'tokenMode' was ENABLE or ENABLE_STRICT` ,
    INSUFFICIENT_TOKENS_PASSED_FOR_TOKEN_MODE_ENABLE_STRICT: `${errorPrefix} Validation error. 'tokenMode' is set to 'ENABLE_STRICT', but some fields are missing tokens. Specify tokens for all fields.`,

    INVALID_DOWNLOAD_URL: `${errorPrefix} Validation error. The downloadURL key has a value of type %s1. Specify downloadURL as string.`,

    EMPTY_FIELD: `${errorPrefix} Validation error. Filed value cannot be empty. Specify a valid filed value at index %s1.`,
    INVALID_FIELD: `${errorPrefix} Validation error. Invalid filed value. Specify a valid filed value at index %s1 as string.`,

    INVALID_OFFSET: `${errorPrefix} Validation error. The offset key has a value of type %s1. Specify offset as string.`,
    INVALID_LIMIT: `${errorPrefix} Validation error. The limit key has a value of type %s1. Specify limit as string.`,

    INVALID_ORDER_BY: `${errorPrefix} Validation error. The orderBy key has a value of type %s1. Specify orderBy as string.`,
    INVALID_FIELDS: `${errorPrefix} Validation error. The fields key has a value of type %s1. Specify fields as array of strings.`,

    INVAILD_JSON_RESPONSE: `${errorPrefix} Validation error. The invalid json response. Please reach out to skyflow using requestId - %s1.`,

    EMPTY_VAULT_CLIENTS: `${errorPrefix} Validation error. No vault config found. Please add a vault config`,
    EMPTY_CONNECTION_CLIENTS: `${errorPrefix} Validation error. No connection config found. Please add a connection config`
};

export default errorMessages;