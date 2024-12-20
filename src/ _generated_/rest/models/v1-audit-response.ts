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
import type { V1AuditAfterOptions } from './v1-audit-after-options';
// May contain unused imports in some cases
// @ts-ignore
import type { V1AuditResponseEvent } from './v1-audit-response-event';

/**
 * 
 * @export
 * @interface V1AuditResponse
 */
export interface V1AuditResponse {
    /**
     * Events matching the query.
     * @type {Array<V1AuditResponseEvent>}
     * @memberof V1AuditResponse
     */
    'event'?: Array<V1AuditResponseEvent>;
    /**
     * 
     * @type {V1AuditAfterOptions}
     * @memberof V1AuditResponse
     */
    'nextOps'?: V1AuditAfterOptions;
}

