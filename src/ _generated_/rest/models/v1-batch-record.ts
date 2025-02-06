/* tslint:disable */
/* eslint-disable */
/**
 * Skyflow Data API
 * # Data API  This API inserts, retrieves, and otherwise manages data in a vault.  The Data API is available from two base URIs. *identifier* is the identifier in your vault\'s URL.<ul><li><b>Sandbox:</b> https://_*identifier*.vault.skyflowapis-preview.com</li><li><b>Production:</b> https://_*identifier*.vault.skyflowapis.com</li></ul>  When you make an API call, you need to add a header: <table><tr><th>Header</th><th>Value</th><th>Example</th></tr><tr><td>Authorization</td><td>A Bearer Token. See <a href=\'/api-authentication/\'>API Authentication</a>.</td><td><code>Authorization: Bearer eyJhbGciOiJSUzI...1NiIsJdfPA</code></td></tr><table/>
 *
 * The version of the OpenAPI document: v1
 * Contact: support@skyflow.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


// May contain unused imports in some cases
// @ts-ignore
import type { BatchRecordMethod } from './batch-record-method';
// May contain unused imports in some cases
// @ts-ignore
import type { RedactionEnumREDACTION } from './redaction-enum-redaction';

/**
 * 
 * @export
 * @interface V1BatchRecord
 */
export interface V1BatchRecord {
    /**
     * Field and value key pairs. For example, `{\'field_1\':\'value_1\', \'field_2\':\'value_2\'}`. Only valid when `method` is `POST` or `PUT`.
     * @type {object}
     * @memberof V1BatchRecord
     */
    'fields'?: object;
    /**
     * Name of the table to perform the operation on.
     * @type {string}
     * @memberof V1BatchRecord
     */
    'tableName'?: string;
    /**
     * 
     * @type {BatchRecordMethod}
     * @memberof V1BatchRecord
     */
    'method'?: BatchRecordMethod;
    /**
     * ID to group operations by. Operations in the same group are executed sequentially.
     * @type {string}
     * @memberof V1BatchRecord
     */
    'batchID'?: string;
    /**
     * 
     * @type {RedactionEnumREDACTION}
     * @memberof V1BatchRecord
     */
    'redaction'?: RedactionEnumREDACTION;
    /**
     * If `true`, this operation returns tokens for fields with tokenization enabled. Only applicable if `skyflow_id` values are specified.
     * @type {boolean}
     * @memberof V1BatchRecord
     */
    'tokenization'?: boolean;
    /**
     * `skyflow_id` for the record. Only valid when `method` is `GET`, `DELETE`, or `PUT`.
     * @type {string}
     * @memberof V1BatchRecord
     */
    'ID'?: string;
    /**
     * If `true`, returns download URLs for fields with a file data type. URLs are valid for 15 minutes. If virus scanning is enabled, only returns if the file is clean.
     * @type {boolean}
     * @memberof V1BatchRecord
     */
    'downloadURL'?: boolean;
    /**
     * Column that stores primary keys for upsert operations. The column must be marked as unique in the vault schema. Only valid when `method` is `POST`.
     * @type {string}
     * @memberof V1BatchRecord
     */
    'upsert'?: string;
    /**
     * Fields and tokens for the record. For example, `{\'field_1\':\'token_1\', \'field_2\':\'token_2\'}`.
     * @type {object}
     * @memberof V1BatchRecord
     */
    'tokens'?: object;
}



