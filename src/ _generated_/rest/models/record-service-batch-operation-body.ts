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
import type { V1BYOT } from './v1-byot';
// May contain unused imports in some cases
// @ts-ignore
import type { V1BatchRecord } from './v1-batch-record';

/**
 * 
 * @export
 * @interface RecordServiceBatchOperationBody
 */
export interface RecordServiceBatchOperationBody {
    /**
     * Record operations to perform.
     * @type {Array<V1BatchRecord>}
     * @memberof RecordServiceBatchOperationBody
     */
    'records'?: Array<V1BatchRecord>;
    /**
     * Continue performing operations on partial errors.
     * @type {boolean}
     * @memberof RecordServiceBatchOperationBody
     */
    'continueOnError'?: boolean;
    /**
     * 
     * @type {V1BYOT}
     * @memberof RecordServiceBatchOperationBody
     */
    'byot'?: V1BYOT;
}



