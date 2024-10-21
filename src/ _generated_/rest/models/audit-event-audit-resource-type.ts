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



/**
 * Type of the resource.
 * @export
 * @enum {string}
 */

export const AuditEventAuditResourceType = {
    NoneApi: 'NONE_API',
    Account: 'ACCOUNT',
    Audit: 'AUDIT',
    BaseDataType: 'BASE_DATA_TYPE',
    FieldTemplate: 'FIELD_TEMPLATE',
    File: 'FILE',
    Key: 'KEY',
    Policy: 'POLICY',
    ProtoParse: 'PROTO_PARSE',
    Record: 'RECORD',
    Role: 'ROLE',
    Rule: 'RULE',
    Secret: 'SECRET',
    ServiceAccount: 'SERVICE_ACCOUNT',
    Token: 'TOKEN',
    User: 'USER',
    Vault: 'VAULT',
    VaultTemplate: 'VAULT_TEMPLATE',
    Workspace: 'WORKSPACE',
    Table: 'TABLE',
    PolicyTemplate: 'POLICY_TEMPLATE',
    Member: 'MEMBER',
    Tag: 'TAG',
    Connection: 'CONNECTION',
    Migration: 'MIGRATION',
    ScheduledJob: 'SCHEDULED_JOB',
    Job: 'JOB',
    ColumnName: 'COLUMN_NAME',
    NetworkToken: 'NETWORK_TOKEN',
    Subscription: 'SUBSCRIPTION'
} as const;

export type AuditEventAuditResourceType = typeof AuditEventAuditResourceType[keyof typeof AuditEventAuditResourceType];


