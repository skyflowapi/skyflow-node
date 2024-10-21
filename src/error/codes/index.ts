import errorMessages from "../messages";

const SKYFLOW_ERROR_CODE = {
    CONFIG_MISSING: { http_code: 400, message: errorMessages.CONFIG_MISSING },
    INVALID_TYPE_FOR_CONFIG: { http_code: 400, message: errorMessages.INVALID_TYPE_FOR_CONFIG },
    EMPTY_VAULT_CONFIG: { http_code: 400, message: errorMessages.EMPTY_VAULT_CONFIG },
    INVALID_SKYFLOW_CONFIG: { http_code: 400, message: errorMessages.INVALID_SKYFLOW_CONFIG },

    EMPTY_VAULT_ID: { http_code: 400, message: errorMessages.EMPTY_VAULT_ID },
    INVALID_VAULT_ID: { http_code: 400, message: errorMessages.INVALID_VAULT_ID },
    EMPTY_CLUSTER_ID: { http_code: 400, message: errorMessages.EMPTY_CLUSTER_ID },
    INVALID_CLUSTER_ID: { http_code: 400, message: errorMessages.INVALID_CLUSTER_ID },

    INVALID_TOKEN: { http_code: 400, message: errorMessages.INVALID_TOKEN },
    TOKEN_EXPIRED: { http_code: 400, message: errorMessages.TOKEN_EXPIRED },
    INVALID_ENV: { http_code: 400, message: errorMessages.INVALID_ENV },
    INVALID_LOG_LEVEL: { http_code: 400, message: errorMessages.INVALID_LOG_LEVEL },
    EMPTY_CREDENTIAL_FILE_PATH: { http_code: 400, message: errorMessages.EMPTY_CREDENTIAL_FILE_PATH },
    INVALID_CREDENTIAL_FILE_PATH: { http_code: 400, message: errorMessages.INVALID_CREDENTIAL_FILE_PATH },

    EMPTY_CONNECTION_ID: { http_code: 400, message: errorMessages.EMPTY_CONNECTION_ID },
    INVALID_CONNECTION_ID: { http_code: 400, message: errorMessages.INVALID_CONNECTION_ID },
    EMPTY_CONNECTION_URL: { http_code: 400, message: errorMessages.EMPTY_CONNECTION_URL },
    INVALID_CONNECTION_URL: { http_code: 400, message: errorMessages.INVALID_CONNECTION_URL },


    VAULT_ID_NOT_IN_CONFIG_LIST: { http_code: 400, message: errorMessages.VAULT_ID_NOT_IN_CONFIG_LIST },
    CONNECTION_ID_NOT_IN_CONFIG_LIST: { http_code: 400, message: errorMessages.CONNECTION_ID_NOT_IN_CONFIG_LIST },

    INVALID_CREDENTIALS: { http_code: 400, message: errorMessages.INVALID_CREDENTIALS },
    CREDENTIALS_WITH_NO_VALID_KEY: { http_code: 400, message: errorMessages.CREDENTIALS_WITH_NO_VALID_KEY },
    EMPTY_CREDENTIALS: { http_code: 400, message: errorMessages.EMPTY_CREDENTIALS },
    MULTIPLE_CREDENTIALS_PASSED: { http_code: 400, message: errorMessages.MULTIPLE_CREDENTIALS_PASSED },
    MULTIPLE_CREDENTIALS_PASSED_WITH_ID: { http_code: 400, message: errorMessages.MULTIPLE_CREDENTIALS_PASSED_WITH_ID },
    INVALID_CREDENTIALS_WITH_ID: { http_code: 400, message: errorMessages.INVALID_CREDENTIALS_WITH_ID },

    FILE_NOT_FOUND: { http_code: 400, message: errorMessages.FILE_NOT_FOUND },
    INVALID_JSON_FILE: { http_code: 400, message: errorMessages.INVALID_JSON_FILE },

    EMPTY_CREDENTIALS_STRING: { http_code: 400, message: errorMessages.EMPTY_CREDENTIALS_STRING },
    INVALID_CREDENTIALS_STRING: { http_code: 400, message: errorMessages.INVALID_CREDENTIALS_STRING },


    MISSING_TOKEN_URI: { http_code: 400, message: errorMessages.MISSING_TOKEN_URI },
    MISSING_CLIENT_ID: { http_code: 400, message: errorMessages.MISSING_CLIENT_ID },
    MISSING_KEY_ID: { http_code: 400, message: errorMessages.MISSING_KEY_ID },
    MISSING_PRIVATE_KEY: { http_code: 400, message: errorMessages.MISSING_PRIVATE_KEY },

    INVALID_ROLES_KEY_TYPE: { http_code: 400, message: errorMessages.INVALID_ROLES_KEY_TYPE },
    EMPTY_ROLES: { http_code: 400, message: errorMessages.EMPTY_ROLES },

    INVALID_JSON_FORMAT: { http_code: 400, message: errorMessages.INVALID_JSON_FORMAT },

    EMPTY_DATA_TOKENS: { http_code: 400, message: errorMessages.EMPTY_DATA_TOKENS },
    DATA_TOKEN_KEY_TYPE: { http_code: 400, message: errorMessages.DATA_TOKEN_KEY_TYPE },
    TIME_TO_LIVE_KET_TYPE: { http_code: 400, message: errorMessages.TIME_TO_LIVE_KET_TYPE },

    EMPTY_TABLE_NAME: { http_code: 400, message: errorMessages.EMPTY_TABLE_NAME },
    INVALID_TABLE_NAME: { http_code: 400, message: errorMessages.INVALID_TABLE_NAME },

    EMPTY_REDACTION_TYPE: { http_code: 400, message: errorMessages.EMPTY_REDACTION_TYPE },
    INVALID_REDACTION_TYPE: { http_code: 400, message: errorMessages.INVALID_REDACTION_TYPE },

    INVALID_DELETE_IDS_INPUT: { http_code: 400, message: errorMessages.INVALID_DELETE_IDS_INPUT },
    EMPTY_DELETE_IDS: { http_code: 400, message: errorMessages.EMPTY_DELETE_IDS },
    EMPTY_ID_IN_DELETE: { http_code: 400, message: errorMessages.EMPTY_ID_IN_DELETE },
    INVALID_ID_IN_DELETE: { http_code: 400, message: errorMessages.INVALID_ID_IN_DELETE },
    INVALID_DELETE_REQUEST: { http_code: 400, message: errorMessages.INVALID_DELETE_REQUEST },

    INVALID_TOKENS_TYPE_IN_DETOKENIZE: { http_code: 400, message: errorMessages.INVALID_TOKENS_TYPE_IN_DETOKENIZE },
    EMPTY_TOKENS_IN_DETOKENIZE: { http_code: 400, message: errorMessages.EMPTY_TOKENS_IN_DETOKENIZE },
    EMPTY_TOKEN_IN_DETOKENIZE: { http_code: 400, message: errorMessages.EMPTY_TOKEN_IN_DETOKENIZE },
    INVALID_TOKEN_IN_DETOKENIZE: { http_code: 400, message: errorMessages.INVALID_TOKEN_IN_DETOKENIZE },
    INVALID_DETOKENIZE_REQUEST: { http_code: 400, message: errorMessages.INVALID_DETOKENIZE_REQUEST },

    INVALID_INSERT_REQUEST: { http_code: 400, message: errorMessages.INVALID_INSERT_REQUEST },
    INVALID_RECORD_IN_INSERT: { http_code: 400, message: errorMessages.INVALID_RECORD_IN_INSERT },
    EMPTY_RECORD_IN_INSERT: { http_code: 400, message: errorMessages.EMPTY_RECORD_IN_INSERT },
    EMPTY_DATA_IN_INSERT: { http_code: 400, message: errorMessages.EMPTY_DATA_IN_INSERT },
    INVALID_TYPE_OF_DATA_IN_INSERT: { http_code: 400, message: errorMessages.INVALID_TYPE_OF_DATA_IN_INSERT },

    MISSING_VALUES_IN_TOKENIZE: { http_code: 400, message: errorMessages.MISSING_VALUES_IN_TOKENIZE },
    INVALID_VALUES_TYPE_IN_TOKENIZE: { http_code: 400, message: errorMessages.INVALID_VALUES_TYPE_IN_TOKENIZE },
    EMPTY_VALUES_IN_TOKENIZE: { http_code: 400, message: errorMessages.EMPTY_VALUES_IN_TOKENIZE },
    EMPTY_DATA_IN_TOKENIZE: { http_code: 400, message: errorMessages.EMPTY_DATA_IN_TOKENIZE },
    INVALID_TOKENIZE_REQUEST: { http_code: 400, message: errorMessages.INVALID_TOKENIZE_REQUEST },
    INVALID_VALUE_IN_TOKENIZE: { http_code: 400, message: errorMessages.INVALID_VALUE_IN_TOKENIZE },
    INVALID_COLUMN_GROUP_IN_TOKENIZE: { http_code: 400, message: errorMessages.INVALID_COLUMN_GROUP_IN_TOKENIZE },
    EMPTY_COLUMN_GROUP_IN_TOKENIZE: { http_code: 400, message: errorMessages.EMPTY_COLUMN_GROUP_IN_TOKENIZE },
    EMPTY_VALUE_IN_TOKENIZE: { http_code: 400, message: errorMessages.EMPTY_VALUE_IN_TOKENIZE },

    INVALID_QUERY_REQUEST: { http_code: 400, message: errorMessages.INVALID_QUERY_REQUEST },
    INVALID_QUERY: { http_code: 400, message: errorMessages.INVALID_QUERY },
    EMPTY_QUERY: { http_code: 400, message: errorMessages.EMPTY_QUERY },

    MISSING_TABLE_IN_UPLOAD_FILE: { http_code: 400, message: errorMessages.MISSING_TABLE_IN_UPLOAD_FILE },
    INVALID_TABLE_IN_UPLOAD_FILE: { http_code: 400, message: errorMessages.INVALID_TABLE_IN_UPLOAD_FILE },
    MISSING_SKYFLOW_ID_IN_UPLOAD_FILE: { http_code: 400, message: errorMessages.MISSING_SKYFLOW_ID_IN_UPLOAD_FILE },
    INVALID_SKYFLOW_ID_IN_UPLOAD_FILE: { http_code: 400, message: errorMessages.INVALID_SKYFLOW_ID_IN_UPLOAD_FILE },
    MISSING_COLUMN_NAME_IN_UPLOAD_FILE: { http_code: 400, message: errorMessages.MISSING_COLUMN_NAME_IN_UPLOAD_FILE },
    INVALID_COLUMN_NAME_IN_UPLOAD_FILE: { http_code: 400, message: errorMessages.INVALID_COLUMN_NAME_IN_UPLOAD_FILE },
    MISSING_FILE_PATH_IN_UPLOAD_FILE: { http_code: 400, message: errorMessages.MISSING_FILE_PATH_IN_UPLOAD_FILE },
    INVALID_FILE_PATH_IN_UPLOAD_FILE: { http_code: 400, message: errorMessages.INVALID_FILE_PATH_IN_UPLOAD_FILE },
    INVALID_FILE_UPLOAD_REQUEST: { http_code: 400, message: errorMessages.INVALID_FILE_UPLOAD_REQUEST },

    MISSING_SKYFLOW_ID_IN_UPDATE: { http_code: 400, message: errorMessages.MISSING_SKYFLOW_ID_IN_UPDATE },
    INVALID_SKYFLOW_ID_IN_UPDATE: { http_code: 400, message: errorMessages.INVALID_SKYFLOW_ID_IN_UPDATE },
    INVALID_TYPE_OF_UPDATE_DATA: { http_code: 400, message: errorMessages.INVALID_TYPE_OF_UPDATE_DATA },
    EMPTY_UPDATE_DATA: { http_code: 400, message: errorMessages.EMPTY_UPDATE_DATA },
    INVALID_UPDATE_REQUEST: { http_code: 400, message: errorMessages.INVALID_UPDATE_REQUEST },
    EMPTY_DATA_IN_UPDATE: { http_code: 400, message: errorMessages.EMPTY_DATA_IN_UPDATE },
    INVALID_DATA_IN_UPDATE: { http_code: 400, message: errorMessages.INVALID_DATA_IN_UPDATE },

    INVALID_GET_REQUEST: { http_code: 400, message: errorMessages.INVALID_GET_REQUEST },
    EMPTY_IDS_IN_GET: { http_code: 400, message: errorMessages.EMPTY_IDS_IN_GET },
    EMPTY_ID_IN_GET: { http_code: 400, message: errorMessages.EMPTY_ID_IN_GET },
    INVALID_ID_IN_GET: { http_code: 400, message: errorMessages.INVALID_ID_IN_GET },
    INVALID_TYPE_OF_IDS: { http_code: 400, message: errorMessages.INVALID_TYPE_OF_IDS },

    EMPTY_COLUMN_NAME: { http_code: 400, message: errorMessages.EMPTY_COLUMN_NAME },
    INVALID_COLUMN_NAME: { http_code: 400, message: errorMessages.INVALID_COLUMN_NAME },
    INVALID_GET_COLUMN_REQUEST: { http_code: 400, message: errorMessages.INVALID_GET_COLUMN_REQUEST },

    INVALID_COLUMN_VALUES: { http_code: 400, message: errorMessages.INVALID_COLUMN_VALUES },
    EMPTY_COLUMN_VALUES: { http_code: 400, message: errorMessages.EMPTY_COLUMN_VALUES },
    INVALID_COLUMN_VALUE: { http_code: 400, message: errorMessages.INVALID_COLUMN_VALUE },
    EMPTY_COLUMN_VALUE: { http_code: 400, message: errorMessages.EMPTY_COLUMN_VALUE },

    EMPTY_URL: { http_code: 400, message: errorMessages.EMPTY_URL },
    INVALID_URL: { http_code: 400, message: errorMessages.INVALID_URL },
    EMPTY_METHOD_NAME: { http_code: 400, message: errorMessages.EMPTY_METHOD_NAME },
    INVALID_METHOD_NAME: { http_code: 400, message: errorMessages.INVALID_METHOD_NAME },
    EMPTY_QUERY_PARAMS: { http_code: 400, message: errorMessages.EMPTY_QUERY_PARAMS },
    INVALID_QUERY_PARAMS: { http_code: 400, message: errorMessages.INVALID_QUERY_PARAMS },
    EMPTY_PATH_PARAMS: { http_code: 400, message: errorMessages.EMPTY_PATH_PARAMS },
    INVALID_PATH_PARAMS: { http_code: 400, message: errorMessages.INVALID_PATH_PARAMS },
    EMPTY_BODY: { http_code: 400, message: errorMessages.EMPTY_BODY },
    INVALID_BODY: { http_code: 400, message: errorMessages.INVALID_BODY },
    EMPTY_HEADERS: { http_code: 400, message: errorMessages.EMPTY_HEADERS },
    INVALID_HEADERS: { http_code: 400, message: errorMessages.INVALID_HEADERS },
    INVALID_INVOKE_CONNECTION_REQUEST: { http_code: 400, message: errorMessages.INVALID_INVOKE_CONNECTION_REQUEST },

    INVALID_INSERT_TOKENS: { http_code: 400, message: errorMessages.INVALID_INSERT_TOKENS },
    EMPTY_INSERT_TOKEN: { http_code: 400, message: errorMessages.EMPTY_INSERT_TOKEN },
    INVALID_INSERT_TOKEN: { http_code: 400, message: errorMessages.INVALID_INSERT_TOKEN },
    INVALID_TOKEN_MODE: { http_code: 400, message: errorMessages.INVALID_TOKEN_MODE },
    INVALID_HOMOGENEOUS: { http_code: 400, message: errorMessages.INVALID_HOMOGENEOUS },
    INVALID_TOKEN_STRICT: { http_code: 400, message: errorMessages.INVALID_TOKEN_STRICT },
    INVALID_CONTINUE_ON_ERROR: { http_code: 400, message: errorMessages.INVALID_CONTINUE_ON_ERROR },
    INVALID_UPSERT: { http_code: 400, message: errorMessages.INVALID_UPSERT },
    INVALID_RETURN_TOKEN: { http_code: 400, message: errorMessages.INVALID_RETURN_TOKEN },

    INVALID_DOWNLOAD_URL: { http_code: 400, message: errorMessages.INVALID_DOWNLOAD_URL },

    INVALID_FIELD: { http_code: 400, message: errorMessages.INVALID_FIELD },
    EMPTY_FIELD: { http_code: 400, message: errorMessages.EMPTY_FIELD },

    INVALID_OFFSET: { http_code: 400, message: errorMessages.INVALID_OFFSET },
    INVALID_LIMIT: { http_code: 400, message: errorMessages.INVALID_LIMIT },

    INVALID_ORDER_BY: { http_code: 400, message: errorMessages.INVALID_ORDER_BY },
    INVALID_FIELDS: { http_code: 400, message: errorMessages.INVALID_FIELDS },
};

export default SKYFLOW_ERROR_CODE;