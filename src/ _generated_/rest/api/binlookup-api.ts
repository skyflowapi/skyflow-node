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


import type { Configuration } from '../configuration';
import type { AxiosPromise, AxiosInstance, RawAxiosRequestConfig } from 'axios';
import globalAxios from 'axios';
// URLSearchParams not necessarily used
// @ts-ignore
import { URL, URLSearchParams } from 'url';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from '../common';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, type RequestArgs, BaseAPI, RequiredError, operationServerMap } from '../base';
// @ts-ignore
import type { GooglerpcStatus } from '../models';
// @ts-ignore
import type { V1BINListRequest } from '../models';
// @ts-ignore
import type { V1BINListResponse } from '../models';
/**
 * BINLookupApi - axios parameter creator
 * @export
 */
export const BINLookupApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * <b>Note</b>: This endpoint is in beta and subject to change. <br><br> Returns the specified card metadata.
         * @summary Get BIN
         * @param {V1BINListRequest} body Request to return specific card metadata.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        bINListServiceListCardsOfBIN: async (body: V1BINListRequest, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'body' is not null or undefined
            assertParamExists('bINListServiceListCardsOfBIN', 'body', body)
            const localVarPath = `/v1/card_lookup`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(body, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * BINLookupApi - functional programming interface
 * @export
 */
export const BINLookupApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = BINLookupApiAxiosParamCreator(configuration)
    return {
        /**
         * <b>Note</b>: This endpoint is in beta and subject to change. <br><br> Returns the specified card metadata.
         * @summary Get BIN
         * @param {V1BINListRequest} body Request to return specific card metadata.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async bINListServiceListCardsOfBIN(body: V1BINListRequest, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<V1BINListResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.bINListServiceListCardsOfBIN(body, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['BINLookupApi.bINListServiceListCardsOfBIN']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * BINLookupApi - factory interface
 * @export
 */
export const BINLookupApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = BINLookupApiFp(configuration)
    return {
        /**
         * <b>Note</b>: This endpoint is in beta and subject to change. <br><br> Returns the specified card metadata.
         * @summary Get BIN
         * @param {V1BINListRequest} body Request to return specific card metadata.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        bINListServiceListCardsOfBIN(body: V1BINListRequest, options?: RawAxiosRequestConfig): AxiosPromise<V1BINListResponse> {
            return localVarFp.bINListServiceListCardsOfBIN(body, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * BINLookupApi - interface
 * @export
 * @interface BINLookupApi
 */
export interface BINLookupApiInterface {
    /**
     * <b>Note</b>: This endpoint is in beta and subject to change. <br><br> Returns the specified card metadata.
     * @summary Get BIN
     * @param {V1BINListRequest} body Request to return specific card metadata.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof BINLookupApiInterface
     */
    bINListServiceListCardsOfBIN(body: V1BINListRequest, options?: RawAxiosRequestConfig): AxiosPromise<V1BINListResponse>;

}

/**
 * BINLookupApi - object-oriented interface
 * @export
 * @class BINLookupApi
 * @extends {BaseAPI}
 */
export class BINLookupApi extends BaseAPI implements BINLookupApiInterface {
    /**
     * <b>Note</b>: This endpoint is in beta and subject to change. <br><br> Returns the specified card metadata.
     * @summary Get BIN
     * @param {V1BINListRequest} body Request to return specific card metadata.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof BINLookupApi
     */
    public bINListServiceListCardsOfBIN(body: V1BINListRequest, options?: RawAxiosRequestConfig) {
        return BINLookupApiFp(this.configuration).bINListServiceListCardsOfBIN(body, options).then((request) => request(this.axios, this.basePath));
    }
}

