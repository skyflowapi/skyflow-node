const logs = {
  infoLogs: {
    EMPTY_BEARER_TOKEN : "BearerToken is Empty",
    BEARER_TOKEN_EXPIRED : "BearerToken is expired",
    GENERATE_BEARER_TOKEN_TRIGGERED : "generateBearerToken is triggered",
    GENERATE_BEARER_TOKEN_SUCCESS : "BearerToken is generated",
    INITIALIZE_CLIENT: 'Initializing skyflow client.',
    CLIENT_INITIALIZED: 'Initialized skyflow client successfully.',
    VALIDATE_RECORDS: 'Validating insert records.',
    VALIDATE_DETOKENIZE_INPUT: 'Validating detokenize input.',
    VALIDATE_GET_BY_ID_INPUT: 'Validating getByID input.',
    VALIDATE_CONNECTION_CONFIG: 'Validating connection config.',
    INSERT_DATA_SUCCESS: 'Data has been inserted successfully.',
    DETOKENIZE_SUCCESS: 'Data has been revealed successfully.',
    GET_BY_ID_SUCCESS: 'Data has been revealed successfully.',
    BEARER_TOKEN_LISTENER: 'Get bearer token listener added.',
    BEARER_TOKEN_RESOLVED: 'GetBearerToken promise resolved successfully.',
    REUSE_BEARER_TOKEN: 'Reusing the bearer token.',
    CONTROLLER_INITIALIZED: 'SkyflowController initialized.',
    INSERT_TRIGGERED: 'Insert method triggered.',
    DETOKENIZE_TRIGGERED: 'Detokenize method triggered.',
    GET_BY_ID_TRIGGERED: 'Get by ID triggered.',
    INVOKE_CONNECTION_TRIGGERED: 'Invoke connection triggered.',
    EMIT_REQUEST: 'Emitted %s1 request.',
    FETCH_RECORDS_RESOLVED: 'Detokenize request is resolved.',
    INSERT_RECORDS_RESOLVED: 'Insert request is resolved.',
    GET_BY_SKYFLOWID_RESOLVED: 'GetById request is resolved.',
    SEND_INVOKE_CONNECTION_RESOLVED: 'Invoke connection request resolved.',
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
    INVALID_RECORD_ID_TYPE: 'Invalid Type of Records Id.',
    INVALID_RECORD_LABEL: 'Invalid Record Label Type.',
    INVALID_RECORD_ALT_TEXT: 'Invalid Record altText Type.',
    FETCH_RECORDS_REJECTED: 'Detokenize request is rejected.',
    INSERT_RECORDS_REJECTED: 'Insert request is rejected.',
    GET_BY_SKYFLOWID_REJECTED: 'GetById request is rejected.',
    SEND_INVOKE_CONNECTION_REJECTED: 'Invoke connection request rejected.',
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
    INVALID_RECORD_TABLE_VALUE: 'Invalid Record Table value.',
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
  },
warnLogs:{
  GENERATE_BEARER_DEPRECATED: 'This method has been deprecated will be removed in future release, use GenerateBearerToken instead',
  ISVALID_DEPRECATED: 'This method has been deprecated will be removed in future release, use isExpired instead'
}
};

export default logs;