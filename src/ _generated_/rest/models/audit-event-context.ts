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
import type { ContextAccessType } from './context-access-type';
// May contain unused imports in some cases
// @ts-ignore
import type { ContextAuthMode } from './context-auth-mode';
// May contain unused imports in some cases
// @ts-ignore
import type { V1MemberType } from './v1-member-type';

/**
 * Context for an audit event.
 * @export
 * @interface AuditEventContext
 */
export interface AuditEventContext {
    /**
     * ID for the audit event.
     * @type {string}
     * @memberof AuditEventContext
     */
    'changeID'?: string;
    /**
     * ID for the request that caused the event.
     * @type {string}
     * @memberof AuditEventContext
     */
    'requestID'?: string;
    /**
     * ID for the request set by the service that received the request.
     * @type {string}
     * @memberof AuditEventContext
     */
    'traceID'?: string;
    /**
     * ID for the session in which the request was sent.
     * @type {string}
     * @memberof AuditEventContext
     */
    'sessionID'?: string;
    /**
     * Member who sent the request. Depending on `actorType`, this may be a user ID or a service account ID.
     * @type {string}
     * @memberof AuditEventContext
     */
    'actor'?: string;
    /**
     * 
     * @type {V1MemberType}
     * @memberof AuditEventContext
     */
    'actorType'?: V1MemberType;
    /**
     * 
     * @type {ContextAccessType}
     * @memberof AuditEventContext
     */
    'accessType'?: ContextAccessType;
    /**
     * IP Address of the client that made the request.
     * @type {string}
     * @memberof AuditEventContext
     */
    'ipAddress'?: string;
    /**
     * HTTP Origin request header (including scheme, hostname, and port) of the request.
     * @type {string}
     * @memberof AuditEventContext
     */
    'origin'?: string;
    /**
     * 
     * @type {ContextAuthMode}
     * @memberof AuditEventContext
     */
    'authMode'?: ContextAuthMode;
    /**
     * ID of the JWT token.
     * @type {string}
     * @memberof AuditEventContext
     */
    'jwtID'?: string;
    /**
     * Embedded User Context.
     * @type {string}
     * @memberof AuditEventContext
     */
    'bearerTokenContextID'?: string;
}



