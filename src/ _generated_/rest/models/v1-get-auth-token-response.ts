/* tslint:disable */
/* eslint-disable */
/**
 * Skyflow Management API
 * # Management API  This API controls aspects of your account and schema, including workspaces, vaults, keys, users, permissions, and more.  The Management API is available from two base URIs:<ul><li><b>Sandbox:</b> https://manage.skyflowapis-preview.com</li><li><b>Production:</b> https://manage.skyflowapis.com</li></ul>  When you make an API call, you need to add two headers: <table><tr><th>Header</th><th>Value</th><th>Example</th></tr><tr><td>Authorization</td><td>A Bearer Token. See <a href=\'/api-authentication/\'>API Authentication</a>.</td><td><code>Authorization: Bearer eyJhbGciOiJSUzI...1NiIsJdfPA</code></td></tr><tr><td>X-SKYFLOW-ACCOUNT-ID</td><td>Your Skyflow account ID.</td><td><code>X-SKYFLOW-ACCOUNT-ID: h451b763713e4424a7jke1bbkbbc84ef</code></td></tr><table/>
 *
 * The version of the OpenAPI document: v1
 * Contact: support@skyflow.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */



/**
 * 
 * @export
 * @interface V1GetAuthTokenResponse
 */
export interface V1GetAuthTokenResponse {
    /**
     * AccessToken.
     * @type {string}
     * @memberof V1GetAuthTokenResponse
     */
    'accessToken'?: string;
    /**
     * TokenType : Bearer.
     * @type {string}
     * @memberof V1GetAuthTokenResponse
     */
    'tokenType'?: string;
}

