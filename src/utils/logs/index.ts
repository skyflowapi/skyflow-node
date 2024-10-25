const logs = {
    infoLogs: {
        EMPTY_BEARER_TOKEN: "BearerToken is Empty",
        BEARER_TOKEN_EXPIRED: "BearerToken is expired",
        GENERATE_BEARER_TOKEN_TRIGGERED: "generateBearerToken is triggered",
        GENERATE_BEARER_TOKEN_SUCCESS: "BearerToken is generated",
        GENERATE_SIGNED_DATA_TOKEN_SUCCESS: 'Signed Data tokens are generated',
        INITIALIZE_CLIENT: 'Initializing skyflow client.',
        VALIDATING_VAULT_CONFIG: 'Validating vault config.',
        VALIDATING_CONNECTION_CONFIG: 'Validating connection config.',
        VAULT_CONTROLLER_INITIALIZED: 'Initialized vault controller with vault ID %s1.',
        CONNECTION_CONTROLLER_INITIALIZED: 'Intitialized connection controller with connection ID %s1.',
        VAULT_ID_CONFIG_EXISTS: 'Vault config with vault ID %s1 already exists.',
        VAULT_ID_CONFIG_DOES_NOT_EXIST: `Vault config with vault ID %s1 doesn't exist.`,
        CONNECTION_ID_CONFIG_EXISTS: `Connection config with connection ID %s1 already exists.`,
        CONNECTION_ID_CONFIG_DOES_NOT_EXIST: `Connection config with connection ID %s1 doesn't exist.`,
        CURRENT_LOG_LEVEL: 'Current log level is %s1.',
        CLIENT_INITIALIZED: 'Initialized skyflow client successfully.',
        VALIDATE_INSERT_INPUT: 'Validating insert input.',
        VALIDATE_DETOKENIZE_INPUT: 'Validating detokenize input.',
        VALIDATE_TOKENIZE_INPUT: 'Validating tokenize input.',
        VALIDATE_FILE_UPLOAD_INPUT: 'Validating detokenize input.',
        VALIDATE_GET_INPUT: 'Validating get method input.',
        VALIDATE_QUERY_INPUT: 'Validating query method input.',
        VALIDATE_DELETE_INPUT: 'Validating delete method input.',
        VALIDATE_UPDATE_INPUT: 'Validating update method input.',
        VALIDATE_CONNECTION_CONFIG: 'Validating connection config.',
        INSERT_DATA_SUCCESS: 'Data inserted.',
        FILE_UPLOAD_DATA_SUCCESS: 'File uploaded.',
        DETOKENIZE_SUCCESS: 'Data detokenized.',
        GET_SUCCESS: 'Data revealed.',
        UPDATE_SUCCESS: 'Data updated.',
        DELETE_SUCCESS: 'Data deleted.',
        TOKENIZE_SUCCESS: 'Data tokenized.',
        QUERY_SUCCESS: 'Query executed.',
        BEARER_TOKEN_LISTENER: 'Get bearer token listener added.',
        BEARER_TOKEN_RESOLVED: 'GetBearerToken promise resolved successfully.',
        REUSE_BEARER_TOKEN: 'Reusing bearer token.',
        REUSE_API_KEY: 'Reusing api key.',
        CONTROLLER_INITIALIZED: 'SkyflowController initialized.',
        INSERT_TRIGGERED: 'Insert method triggered.',
        DETOKENIZE_TRIGGERED: 'Detokenize method triggered.',
        TOKENIZE_TRIGGERED: 'Tokenize method triggered.',
        GET_BY_ID_TRIGGERED: 'Get by ID triggered.',
        GET_TRIGGERED: 'Get call triggered.',
        QUERY_TRIGGERED: 'Query call triggered.',
        UPLOAD_FILE_TRIGGERED: 'Upload file call triggered.',
        INVOKE_CONNECTION_TRIGGERED: 'Invoke connection triggered.',
        DELETE_TRIGGERED: 'Delete method Triggered',
        DELETE_REQUEST_RESOLVED: 'Delete method is resolved',
        TOKENIZE_REQUEST_RESOLVED: 'Tokenize method is resolved',
        QUERY_REQUEST_RESOLVED: 'Query method is resolved',
        FILE_UPLOAD_REQUEST_RESOLVED: 'File upload method is resolved',
        EMIT_REQUEST: 'Emitted %s1 request.',
        DETOKENIZE_REQUEST_RESOLVED: 'Detokenize request is resolved.',
        INSERT_REQUEST_RESOLVED: 'Insert request is resolved.',
        GET_REQUEST_RESOLVED: 'Get request is resolved.',
        INVOKE_CONNECTION_REQUEST_RESOLVED: 'Invoke connection request resolved.',
        GENERATE_SIGNED_DATA_TOKENS_TRIGGERED: "generateSignedDataTokens is triggered",
        UPDATE_TRIGGERED: 'Update method triggered.',
        UPDATE_REQUEST_RESOLVED: 'Update request is resolved.',
        UNABLE_TO_GENERATE_SDK_METRIC: 'Unable to generate %s1 metric.',
        USING_BEARER_TOKEN: 'Using token from credentials',
        USING_API_KEY: 'Using api key from credentials',
        USING_SKYFLOW_CREDENTIALS_ENV: 'Using SKYFLOW_CREDENTIALS from env'
    },
    errorLogs: {
        
        CLIENT_CONNECTION: 'client connection not established.',
        VAULTID_IS_REQUIRED: 'Interface: init - Invalid client credentials. vaultID is required.',
        EMPTY_VAULTID_IN_INIT: 'Interface: init - Invalid client credentials. vaultID cannot be empty.',
        VAULTURL_IS_REQUIRED: 'Interface: init - Invalid client credentials. vaultURL is required.',
        EMPTY_VAULTURL_IN_INIT: 'Interface: init - Invalid client credentials. vaultURL cannot be empty.',
        INVALID_VAULTURL_IN_INIT: 'Interface: init - Invalid client credentials. Expecting https://XYZ for vaultURL',
        GET_BEARER_TOKEN_IS_REQUIRED: 'Interface: init - Invalid client credentials. getBearerToken is required.',
        BEARER_TOKEN_REJECTED: 'Interface: init - GetBearerToken promise got rejected.',
        INVALID_ENCODE_URI_IN_GET: 'Interface: get method - Invalid encodeURI type in get.',
        INVALID_BEARER_TOKEN: 'Bearer token is invalid or expired.',
        INVALID_VAULT_ID: 'Vault Id is invalid or cannot be found.',
        EMPTY_VAULT_ID: 'VaultID is empty.',
        INVALID_CREDENTIALS: 'Invalid client credentials.',
        INVALID_CONTAINER_TYPE: 'Invalid container type.',
        INVALID_COLLECT_VALUE: 'Invalid value',
        INVALID_COLLECT_VALUE_WITH_LABEL: 'Invalid %s1',
        RECORDS_KEY_NOT_FOUND: 'records object key value not found.',
        EMPTY_RECORDS: 'records object is empty.',
        RECORDS_KEY_ERROR: 'Key “records” is missing or payload is incorrectly formatted.',
        MISSING_RECORDS: 'Missing records property.',
        INVALID_RECORDS: 'Invalid Records.',
        EMPTY_RECORD_IDS: 'Record ids cannot be Empty.',
        EMPTY_RECORD_COLUMN_VALUES: 'Record column values cannot be empty.',
        INVALID_RECORD_ID_TYPE: 'Invalid Type of Records Id.',
        INVALID_RECORD_COLUMN_VALUE_TYPE: 'Invalid Type of Records Column Values.',
        INVALID_RECORD_LABEL: 'Invalid Record Label Type.',
        INVALID_RECORD_ALT_TEXT: 'Invalid Record altText Type.',
        DETOKENIZE_REQUEST_REJECTED: 'Detokenize request is rejected.',
        TOKENIZE_REQUEST_REJECTED: 'Tokenize request is rejected.',
        INVOKE_CONNECTION_REQUEST_REJECTED: 'Invoke connection request is rejected.',
        QUERY_REQUEST_REJECTED: 'Query request is rejected.',
        INSERT_REQUEST_REJECTED: 'Insert request is rejected.',
        FILE_UPLOAD_REQUEST_REJECTED: 'File upload request is rejected.',
        GET_REQUEST_REJECTED: 'Get request is rejected.',
        SEND_INVOKE_CONNECTION_REJECTED: 'Invoke connection request rejected.',
        UPDATE_REQUEST_REJECTED: 'Update request is rejected.',
        INVALID_TABLE_NAME: 'Table Name passed doesn’t exist in the vault with id.',
        EMPTY_TABLE_NAME: 'Table Name is empty.',
        EMPTY_TABLE_AND_FIELDS: 'table or fields parameter cannot be passed as empty at index %s1 in records array.',
        EMPTY_TABLE: "Table can't be passed as empty at index %s1 in records array.",
        TABLE_KEY_ERROR: 'Key “table” is missing or payload is incorrectly formatted.',
        FIELDS_KEY_ERROR: 'Key “fields” is missing or payload is incorrectly formatted.',
        INVALID_TABLE_OR_COLUMN: 'Invalid table or column.',
        INVALID_COLUMN_NAME: 'Column with given name is not present in the table in vault.',
        EMPTY_COLUMN_NAME: 'Column name is empty.',
        MISSING_TABLE: 'Missing Table Property.',
        MISSING_RECORD_COLUMN_VALUE: 'Column Values can not be empty when Column Name is specified.',
        MISSING_RECORD_COLUMN_NAME: 'Column Name can not be empty when Column Values are specified.',
        MISSING_ID_AND_COLUMN_NAME: 'Provide either ids or column name to get records',
        EMPTY_COLUMN_VALUE: 'Column Value is empty.',
        INVALID_RECORD_TABLE_VALUE: 'Invalid Record Table value.',
        INVALID_RECORD_COLUMN_VALUE: 'Invalid Record Column value.',
        INVALID_COLUMN_VALUES_OPTION_TYPE: 'Invalid Column Values type, should be an Array.',
        INVALID_TOKEN_ID: 'Token provided is invalid.',
        INVALID_TOKEN_ID_WITH_ID: 'Token %s1 provided is invalid',
        EMPTY_TOKEN_ID: 'Token is empty.',
        ID_KEY_ERROR: "Key 'token' is missing in the payload provided.",
        MISSING_TOKEN: 'Missing token property.',
        MISSING_TOKEN_KEY: 'token key is Missing.',
        REDACTION_KEY_ERROR: 'Key “redaction” is missing or payload is incorrectly formatted.',
        INVALID_REDACTION_TYPE: 'Redaction type value isn’t one of: “PLAIN_TEXT”, “REDACTED” ,“DEFAULT” or “MASKED”.',
        MISSING_REDACTION: 'Missing Redaction property.',
        MISSING_REDACTION_VALUE: 'Missing redaction value.',
        MISSING_IDS: 'Missing ids property.',
        MISSING_CONNECTION_URL: 'connection URL Key is Missing.',
        INVALID_CONNECTION_URL_TYPE: 'Invalid connection URL type.',
        INVALID_CONNECTION_URL: 'Invalid connection URL.',
        MISSING_METHODNAME_KEY: 'methodName Key is Missing.',
        INVALID_METHODNAME_VALUE: 'Invalid methodName value.',
        UNKNOWN_ERROR: 'Unknown Error.',
        TRANSACTION_ERROR: 'An error occurred during transaction.',
        CONNECTION_ERROR: 'Error while initializing the connection.',
        ERROR_OCCURED: 'Error occurred.',
        RESPONSE_BODY_KEY_MISSING: '%s1 is missing in the response.',
        INVALID_UPSERT_OPTION_TYPE: 'Interface: insert method - Invalid upsert option, should be an array.',
        EMPTY_UPSERT_OPTIONS_ARRAY: 'Interface: insert method - upsert option cannot be an empty array, atleast one object of table and column is required.',
        INVALID_UPSERT_OPTION_OBJECT_TYPE: 'Interface: insert method - Invalid upsert object at index %s1, an object of table and column is required.',
        MISSING_TABLE_IN_UPSERT_OPTION: 'Interface: insert method - "table" key is required in upsert options object at index %s1.',
        MISSING_COLUMN_IN_UPSERT_OPTION: 'Interface: insert method - "column" key is required in upsert option at index %s1.',
        INVALID_TABLE_IN_UPSERT_OPTION: 'Interface: insert method - Invalid table in upsert object at index %s1, table of type non empty string is required.',
        INVALID_COLUMN_IN_UPSERT_OPTION: 'Interface: insert method - Invalid column in upsert object at index %s1, column of type non empty string is required.',
        INVALID_TOKENS_IN_INSERT: 'Interface: insert method - Invalid tokens in options. tokens of type boolean is required.',
        INVALID_CONTINUE_ON_ERROR_IN_INSERT: 'Interface: insert method - Invalid continueOnError in options. Value of type boolean is required.',
        INVALID_TOKENS_IN_UPDATE: 'Interface: update method - Invalid tokens in options. tokens of type boolean is required.',
        MISSING_TABLE_IN_IN_UPDATE: 'Interface: update method - table key is required in records object at index %s1',
        MISSING_FIELDS_IN_IN_UPDATE: 'Interface: update method - fields key is required in records object at index %s1',
        MISSING_ID_IN_UPDATE: 'Interface: update method - id key is required in records object at index %s1',
        INVALID_ID_IN_UPDATE: 'Interface: update method - Invalid id in records object at index %s1, id of type non empty string is required.',
        INVALID_TABLE_IN_UPDATE: 'Interface: update method - Invalid table in records object at index %s1, table of type non empty string is required.',
        INVALID_FIELDS_IN_UPDATE: 'Interface: update method - Invalid fields in records object at index %s1, object with fields to be updated are required.',
        INVALID_UPDATE_INPUT: 'Interface: update method - Invalid argument , object with records key is required.',
        INVALID_RECORDS_UPDATE_INPUT: 'Interface: update method - Invalid records type, records should be an array of objects.',
        INVALID_GET_BY_ID_INPUT: 'Interface: getById method - columnName or columnValues cannot be passed, use get method instead.',
        INVALID_TOKENS_IN_GET: 'Interface: get method - Invalid tokens in options. tokens of type boolean is required.',
        TOKENS_GET_COLUMN_NOT_SUPPORTED: 'Interface: get method - column_name or column_values cannot be used with tokens in options.',
        REDACTION_WITH_TOKENS_NOT_SUPPORTED: 'Interface: get method - redaction cannot be used when tokens are true in options.',
        INVALID_DELETE_INPUT: 'Interface: delete method - Invalid argument , object with records key is required.',
        INVLAID_DELETE_RECORDS_INPUT: 'Interface: delete method - Invalid records type, records should be an array of objects.',
        MISSING_ID_IN_DELETE: 'Interface: delete method - id key is required in records object at index %s1',
        INVALID_ID_IN_DELETE: 'Interface: delete method - Invalid id in records object at index %s1, id of type non empty string is required.',
        MISSING_TABLE_IN_DELETE: 'Interface: delete method - table key is required in records object at index %s1',
        INVALID_TABLE_IN_DELETE: 'Interface: delete method - Invalid table in records object at index %s1, table of type non empty string is required.',
        DELETE_REQUEST_REJECTED: 'Delete request is rejected.',
        DETOKENIZE_INVALID_REDACTION_TYPE: 'Interface: detokenize method - Invalid redaction type, use Skyflow.RedactionType enum.',
    },
    warnLogs: {
        GENERATE_BEARER_DEPRECATED: 'This method has been deprecated will be removed in future release, use GenerateBearerToken instead',
        ISVALID_DEPRECATED: 'This method has been deprecated will be removed in future release, use isExpired instead'
    }
};

export default logs;