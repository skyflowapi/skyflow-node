import SkyflowError from "../error";
import * as sdkDetails from "../../package.json";
import { generateBearerToken, generateBearerTokenFromCreds } from "../service-account";
import Credentials, { ApiKeyCredentials, PathCredentials, StringCredentials, TokenCredentials } from "../vault/config/credentials";
import dotenv from "dotenv";
import logs from "./logs";
import os from 'os';
import process from "process";
import SKYFLOW_ERROR_CODE from "../error/codes";
import { isExpired } from "./jwt-utils";
import { isValidAPIKey } from "./validations";

dotenv.config();

export const SDK_METRICS_HEADER_KEY = "sky-metadata";

export const SKYFLOW_ID = "skyflowId";

export const BAD_REQUEST = "Bad Request";

export const SKYFLOW_AUTH_HEADER_KEY = "x-skyflow-authorization";

export const REQUEST_ID_KEY = "x-request-id";

export const LOGLEVEL = "loglevel";

export const CREDENTIALS = "credentials";

export const VAULT_ID = "vaultId";

export const CONNECTION_ID = "connectionId";

export const VAULT = "vault";

export const CONNECTION = "connection";

export enum TokenMode {
    DISABLE = 'DISABLE',
    ENABLE = 'ENABLE',
    ENABLE_STRICT = 'ENABLE_STRICT'
};

export enum LogLevel {
    WARN = 'WARN',
    INFO = 'INFO',
    DEBUG = 'DEBUG',
    ERROR = 'ERROR',
    OFF = 'OFF'
}

export enum AuthType {
    TOKEN = 'TOKEN',
    API_KEY = 'API_KEY'
}

export enum MessageType {
    LOG = 'LOG',
    WARN = 'WARN',
    ERROR = 'ERROR',
}

export enum RequestMethod {
    POST = 'POST',
    GET = 'GET',
    PUT = 'PUT',
    PATCH = 'PATCH',
}

export enum Env {
    DEV = 'DEV',
    STAGE = 'STAGE',
    SANDBOX = 'SANDBOX',
    PROD = 'PROD',
}

export enum RedactionType {
    DEFAULT = 'DEFAULT',
    PLAIN_TEXT = 'PLAIN_TEXT',
    MASKED = 'MASKED',
    REDACTED = 'REDACTED',
}

export enum OrderByEnum {
    ASCENDING = 'ASCENDING',
    DESCENDING = 'DESCENDING',
    NONE = 'NONE'
};

export const TYPES = {
    INSERT: 'INSERT',
    INSERT_BATCH: 'INSERT_BATCH',
    DETOKENIZE: 'DETOKENIZE',
    TOKENIZE: 'TOKENIZE',
    DELETE: 'DELETE',
    UPDATE: 'UPDATE',
    GET: 'GET',
    FILE_UPLOAD: 'FILE_UPLOAD',
    QUERY: 'QUERY',
    DETECT: 'DETECT',
    INVOKE_CONNECTION: 'INVOKE_CONNECTION',
    DEIDENTIFY_TEXT: 'DEIDENTIFY_TEXT',
    REIDENTIFY_TEXT: 'REIDENTIFY_TEXT',
    DEIDENTIFY_FILE: 'DEIDENTIFY_FILE',
    DETECT_RUN: 'DETECT_RUN',
};

export enum DeidenitfyFileRequestTypes {
    IMAGE= "IMAGE",
    FILE= 'FILE', 
    AUDIO= 'AUDIO', 
    PPT= 'PPT', 
    DOCUMENT= 'DOCUMENT',
    PDF= 'PDF', 
    SPREADSHEET= 'SPREADSHEET', 
    STRUCTURED_TEXT= 'STRUCTURED_TEXT',
    TEXT='TEXT'
}

export const CONTROLLER_TYPES = {
    DETECT: 'DETECT',
    VAULT: 'VAULT',
    CONNECTION: 'CONNECTION',
}

export enum DetectOutputTranscription {
    DIARIZED_TRANSCRIPTION = "diarized_transcription",
    MEDICAL_DIARIZED_TRANSCRIPTION = "medical_diarized_transcription",
    MEDICAL_TRANSCRIPTION = "medical_transcription",
    PLAINTEXT_TRANSCRIPTION = "plaintext_transcription",
    TRANSCRIPTION = "transcription",
}

export enum MaskingMethod{
    Blackbox= "blackbox",
    Blur= "blur",
}

export enum DetectEntities {
    ACCOUNT_NUMBER = "account_number",
    AGE = 'age',
    ALL = 'all',
    BANK_ACCOUNT = 'bank_account',
    BLOOD_TYPE = 'blood_type',
    CONDITION = 'condition',
    CORPORATE_ACTION = 'corporate_action',
    CREDIT_CARD = 'credit_card',
    CREDIT_CARD_EXPIRATION = 'credit_card_expiration',
    CVV = 'cvv',
    DATE = 'date',
    DATE_INTERVAL = 'date_interval',
    DOB = 'dob',
    DOSE = 'dose',
    DRIVER_LICENSE = 'driver_license',
    DRUG = 'drug',
    DURATION = 'duration',
    EMAIL_ADDRESS = 'email_address',
    EVENT = 'event',
    FILENAME = 'filename',
    FINANCIAL_METRIC = 'financial_metric',
    GENDER_SEXUALITY = 'gender_sexuality',
    HEALTHCARE_NUMBER = 'healthcare_number',
    INJURY = 'injury',
    IP_ADDRESS = 'ip_address',
    LANGUAGE = 'language',
    LOCATION = 'location',
    LOCATION_ADDRESS = 'location_address',
    LOCATION_ADDRESS_STREET = 'location_address_street',
    LOCATION_CITY = 'location_city',
    LOCATION_COORDINATE = 'location_coordinate',
    LOCATION_COUNTRY = 'location_country',
    LOCATION_STATE = 'location_state',
    LOCATION_ZIP = 'location_zip',
    MARITAL_STATUS = 'marital_status',
    MEDICAL_CODE = 'medical_code',
    MEDICAL_PROCESS = 'medical_process',
    MONEY = 'money',
    NAME = 'name',
    NAME_FAMILY = 'name_family',
    NAME_GIVEN = 'name_given',
    NAME_MEDICAL_PROFESSIONAL = 'name_medical_professional',
    NUMERICAL_PII = 'numerical_pii',
    OCCUPATION = 'occupation',
    ORGANIZATION = 'organization',
    ORGANIZATION_MEDICAL_FACILITY = 'organization_medical_facility',
    ORIGIN = 'origin',
    PASSPORT_NUMBER = 'passport_number',
    PASSWORD = 'password',
    PHONE_NUMBER = 'phone_number',
    PHYSICAL_ATTRIBUTE = 'physical_attribute',
    POLITICAL_AFFILIATION = 'political_affiliation',
    PRODUCT = 'product',
    RELIGION = 'religion',
    ROUTING_NUMBER = 'routing_number',
    SSN = 'ssn',
    STATISTICS = 'statistics',
    TIME = 'time',
    TREND = 'trend',
    URL = 'url',
    USERNAME = 'username',
    VEHICLE_ID = 'vehicle_id',
    ZODIAC_SIGN = 'zodiac_sign',
}

export enum TokenType {
    ENTITY_UNIQUE_COUNTER = 'entity_unq_counter',
    ENTITY_ONLY = 'entity_only',
    VAULT_TOKEN = 'vault_token'
}

export interface ISkyflowError {
    http_status?: string | number | null,
    grpc_code?: string | number | null,
    http_code: string | number | null | undefined,
    message: string,
    request_ID?: string | null,
    details?: Array<string> | null,
}

export interface AuthInfo {
    key: string,
    type: AuthType
}

export function getVaultURL(clusterID: string, env: Env) {
    switch (env) {
        case Env.PROD:
            return `https://${clusterID}.vault.skyflowapis.com`;
        case Env.SANDBOX:
            return `https://${clusterID}.vault.skyflowapis-preview.com`;
        case Env.DEV:
            return `https://${clusterID}.vault.skyflowapis.dev`;
        case Env.STAGE:
            return `https://${clusterID}.vault.skyflowapis.tech`;
        default:
            return `https://${clusterID}.vault.skyflowapis.com`;
    }
}

export function getConnectionBaseURL(clusterID: string, env: Env) {
    switch (env) {
        case Env.PROD:
            return `https://${clusterID}.gateway.skyflowapis.com`;
        case Env.SANDBOX:
            return `https://${clusterID}.gateway.skyflowapis-preview.com`;
        case Env.DEV:
            return `https://${clusterID}.gateway.skyflowapis.dev`;
        case Env.STAGE:
            return `https://${clusterID}.gateway.skyflowapis.tech`;
        default:
            return `https://${clusterID}.gateway.skyflowapis.com`;
    }
}

export function validateToken(token: string) {
    if (isExpired(token)) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.TOKEN_EXPIRED);
    }
    return token;
}

export function removeSDKVersion(message: string): string {
    const sdkVersionPattern = /Skyflow Node SDK v[\d\.a-zA-Z\-]+/;
    const cleanedMessage = message.replace(sdkVersionPattern, '').trim();
    return cleanedMessage;
}

// Helper function to generate token based on credentials
export async function getToken(credentials: Credentials, logLevel?: LogLevel): Promise<{ accessToken: string }> {
    if ('credentialsString' in credentials) {
        const stringCred = credentials as StringCredentials;
        printLog(logs.infoLogs.USING_CREDENTIALS_STRING, MessageType.LOG, logLevel);
        return generateBearerTokenFromCreds(stringCred.credentialsString, {
            roleIDs: stringCred.roles,
            ctx: stringCred.context,
            logLevel,
        });
    }

    if ('path' in credentials) {
        const pathCred = credentials as PathCredentials;
        printLog(logs.infoLogs.USING_PATH, MessageType.LOG, logLevel);
        return generateBearerToken(pathCred.path, {
            roleIDs: pathCred.roles,
            ctx: pathCred.context,
            logLevel,
        });
    }

    throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_CREDENTIALS);
}

export async function getBearerToken(credentials?: Credentials, logLevel?: LogLevel): Promise<AuthInfo> {
    try {
        // If no credentials and no environment variable, throw error
        if (!credentials && process.env.SKYFLOW_CREDENTIALS === undefined) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_CREDENTIALS);
        }

        // If credentials are missing but environment variable exists, use it
        if (!credentials && process.env.SKYFLOW_CREDENTIALS) {
            printLog(logs.infoLogs.USING_SKYFLOW_CREDENTIALS_ENV, MessageType.LOG, logLevel);
            credentials = {
                credentialsString: process.env.SKYFLOW_CREDENTIALS
            } as StringCredentials;
        }

        // Handle ApiKeyCredentials
        if ('apiKey' in credentials!) {
            const apiKeyCred = credentials as ApiKeyCredentials;
            if (apiKeyCred.apiKey.trim().length > 0 && isValidAPIKey(apiKeyCred.apiKey)) {
                printLog(logs.infoLogs.USING_API_KEY, MessageType.LOG, logLevel);
                return { type: AuthType.API_KEY, key: apiKeyCred.apiKey };
            }
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_API_KEY);
        }

        // Handle TokenCredentials
        if ('token' in credentials!) {
            const tokenCred = credentials as TokenCredentials;
            printLog(logs.infoLogs.USING_BEARER_TOKEN, MessageType.LOG, logLevel);
            return { type: AuthType.TOKEN, key: validateToken(tokenCred.token) };
        }

        printLog(logs.infoLogs.BEARER_TOKEN_LISTENER, MessageType.LOG, logLevel);

        // Generate token based on provided credentials
        const token = await getToken(credentials!, logLevel);

        printLog(logs.infoLogs.BEARER_TOKEN_RESOLVED, MessageType.LOG, logLevel);

        return { type: AuthType.TOKEN, key: token.accessToken };

    } catch (err) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_CREDENTIALS);
    }
}

export function getBaseUrl(url: string): string {
    try {
        const parsedUrl = new URL(url);
        return `${parsedUrl.protocol}//${parsedUrl.hostname}`;
    } catch (error) {
        return '';
    }
}

export function fillUrlWithPathAndQueryParams(url: string,
    pathParams?: object,
    queryParams?: object) {
    let filledUrl = url;
    if (pathParams) {
        Object.entries(pathParams).forEach(([key, value]) => {
            filledUrl = url.replace(`{${key}}`, value);
        });
    }
    if (queryParams) {
        filledUrl += '?';
        Object.entries(queryParams).forEach(([key, value]) => {
            filledUrl += `${key}=${value}&`;
        });
        filledUrl = filledUrl.substring(0, filledUrl.length - 1);
    }
    return filledUrl;
}

export const LogLevelOptions = {
    DEBUG: {
        showDebugLogs: true, showInfoLogs: true, showWarnLogs: true, showErrorLogs: true,
    },
    INFO: {
        showDebugLogs: false, showInfoLogs: true, showWarnLogs: true, showErrorLogs: true,
    },
    WARN: {
        showDebugLogs: false, showInfoLogs: false, showWarnLogs: true, showErrorLogs: true,
    },
    ERROR: {
        showDebugLogs: false, showInfoLogs: false, showWarnLogs: false, showErrorLogs: true,
    },
    OFF: {
        showDebugLogs: false, showInfoLogs: false, showWarnLogs: false, showErrorLogs: false,
    }
};


export const printLog = (message: string, messageType: MessageType, logLevel: LogLevel = LogLevel.ERROR) => {
    const {
        showDebugLogs, showInfoLogs, showWarnLogs, showErrorLogs,
    } = LogLevelOptions[logLevel];
    const version = sdkDetails?.version ? `v${sdkDetails?.version}` : '';
    if (messageType === MessageType.LOG && showDebugLogs) {
        // eslint-disable-next-line no-console
        console.log(`DEBUG: [Skyflow Node SDK ${version}] ` + message);
    } else if (messageType === MessageType.LOG && showInfoLogs) {
        // eslint-disable-next-line no-console
        console.log(`INFO: [Skyflow Node SDK ${version}] ` + message);
    } else if (messageType === MessageType.WARN && showWarnLogs) {
        // eslint-disable-next-line no-console
        console.warn(`WARN: [Skyflow Node SDK ${version}] ` + message);
    } else if (messageType === MessageType.ERROR && showErrorLogs) {
        // eslint-disable-next-line no-console
        console.error(`ERROR: [Skyflow Node SDK ${version}] ` + message);
    }
};

export const parameterizedString = (...args: any[]) => {
    const str = args[0];
    const params = args.filter((arg, index) => index !== 0);
    if (!str) return '';
    return str.replace(/%s[0-9]+/g, (matchedStr: any) => {
        const variableIndex = matchedStr.replace('%s', '') - 1;
        return params[variableIndex];
    });
};

export const generateSDKMetrics = (logLevel?: LogLevel) => {
    let sdkNameVersion = "";
    let clientDeviceModel = "";
    let clientOSDetails = "";
    let runtimeDetails = "";
    try {
        sdkNameVersion = `${sdkDetails.name ? `${sdkDetails.name}@` : ""}${sdkDetails.version ? sdkDetails.version : ""
            }`;
    } catch (err) {
        printLog(
            parameterizedString(logs.infoLogs.UNABLE_TO_GENERATE_SDK_METRIC, "sdkNameVersion")
            , MessageType.LOG,
            logLevel
        );
        sdkNameVersion = "";
    }

    try {
        clientDeviceModel = `${process.platform ? `${process.platform}` : ""} ${process.arch ? process.arch : ""
            }`;
    } catch (err) {
        printLog(
            parameterizedString(logs.infoLogs.UNABLE_TO_GENERATE_SDK_METRIC, "clientDeviceModel")
            , MessageType.LOG,
            logLevel
        );
        clientDeviceModel = "";
    }

    try {
        clientOSDetails = `${os.release() && os.platform() ? os.platform() + '-' + os.release() : ""}`;
    } catch (err) {
        printLog(
            parameterizedString(logs.infoLogs.UNABLE_TO_GENERATE_SDK_METRIC, "clientOSDetails")
            , MessageType.LOG,
            logLevel
        );
        clientOSDetails = "";
    }

    try {
        runtimeDetails = `${process.version ? `Node@${process.version}` : ""}`;
    } catch (err) {
        printLog(
            parameterizedString(logs.infoLogs.UNABLE_TO_GENERATE_SDK_METRIC, "runtimeDetails")
            , MessageType.LOG,
            logLevel
        );
        runtimeDetails = "";
    }

    return {
        sdk_name_version: sdkNameVersion,
        sdk_client_device_model: clientDeviceModel,
        sdk_client_os_details: clientOSDetails,
        sdk_runtime_details: runtimeDetails,
    };
};

export const isValidURL = (url: string) => {
    if (url && url.substring(0, 5).toLowerCase() !== 'https') {
        return false;
    }
    try {
        const tempUrl = new URL(url);
        if (tempUrl) return true;
    } catch (err) {
        return false;
    }
};
