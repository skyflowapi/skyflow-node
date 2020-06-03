/*
 * Skyflow
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * Contact: support@skyflow.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.4.14-SNAPSHOT
 *
 * Do not edit the class manually.
 *
 */

import {V1CreateNotebookRequest} from '../model/V1CreateNotebookRequest';
import {V1CreateNotebookResponse} from '../model/V1CreateNotebookResponse';
import {V1DeleteNotebookResponse} from '../model/V1DeleteNotebookResponse';
import {V1GetNotebookResponse} from '../model/V1GetNotebookResponse';
import {V1UpdateNotebookRequest} from '../model/V1UpdateNotebookRequest';
import {V1UpdateNotebookResponse} from '../model/V1UpdateNotebookResponse';

/**
* Notebooks service.
* @module api/NotebooksApi
* @version v1
*/
const NotebooksApi = {


    /**
     * Callback function to receive the result of the createNotebook operation.
     * @callback module:api/NotebooksApi~createNotebookCallback
     * @param {String} error Error message, if any.
     * @param {module:model/V1CreateNotebookResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Create Notebook
     * Creates a Notebook by using Information from body
     * @param {module:model/V1CreateNotebookRequest} body 
     * @param {module:api/NotebooksApi~createNotebookCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/V1CreateNotebookResponse}
     */
    createNotebook(body, callback) {
      let postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling createNotebook");
      }


      let pathParams = {
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = ['AppID', 'AppSecret', 'Bearer'];
      let contentTypes = ['application/json'];
      let accepts = ['application/json'];
      let returnType = V1CreateNotebookResponse;

      return this.callApi(
        '/v1/notebooks', 'POST',
        pathParams, postBody,
        returnType, callback
      );
    },

    /**
     * Callback function to receive the result of the deleteNotebook operation.
     * @callback module:api/NotebooksApi~deleteNotebookCallback
     * @param {String} error Error message, if any.
     * @param {module:model/V1DeleteNotebookResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Delete Notebook
     * Deletes a Notebook by Provided ID.
     * @param {String} ID 
     * @param {module:api/NotebooksApi~deleteNotebookCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/V1DeleteNotebookResponse}
     */
    deleteNotebook(ID, callback) {
      let postBody = null;

      // verify the required parameter 'ID' is set
      if (ID === undefined || ID === null) {
        throw new Error("Missing the required parameter 'ID' when calling deleteNotebook");
      }


      let pathParams = {
        'ID': ID
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = ['AppID', 'AppSecret', 'Bearer'];
      let contentTypes = ['application/json'];
      let accepts = ['application/json'];
      let returnType = V1DeleteNotebookResponse;

      return this.callApi(
        '/v1/notebooks/{ID}', 'DELETE',
        pathParams, postBody,
        returnType, callback
      );
    },

    /**
     * Callback function to receive the result of the getNotebook operation.
     * @callback module:api/NotebooksApi~getNotebookCallback
     * @param {String} error Error message, if any.
     * @param {module:model/V1GetNotebookResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get Notebook By ID
     * Retreives a Notebook by Provided ID.
     * @param {String} ID 
     * @param {module:api/NotebooksApi~getNotebookCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/V1GetNotebookResponse}
     */
    getNotebook(ID, callback) {
      let postBody = null;

      // verify the required parameter 'ID' is set
      if (ID === undefined || ID === null) {
        throw new Error("Missing the required parameter 'ID' when calling getNotebook");
      }


      let pathParams = {
        'ID': ID
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = ['AppID', 'AppSecret', 'Bearer'];
      let contentTypes = ['application/json'];
      let accepts = ['application/json'];
      let returnType = V1GetNotebookResponse;

      return this.callApi(
        '/v1/notebooks/{ID}', 'GET',
        pathParams, postBody,
        returnType, callback
      );
    },

    /**
     * Callback function to receive the result of the searchNotebooksByFilter operation.
     * @callback module:api/NotebooksApi~searchNotebooksByFilterCallback
     * @param {String} error Error message, if any.
     * @param {module:model/V1GetNotebookResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Search Notebooks
     * Streams Notebooks which matches the conditions set in query parameters.
     * @param {Object} opts Optional parameters
     * @param {String} opts.offset Pagination Offset.  - indicates from which record number to start retrieving data (default to 0)
     * @param {String} opts.limit Pagination Limit.  - indicates how many records to retrieve (default to 100)
     * @param {String} opts.orgID Organization ID Under which resource should be searched.
     * @param {String} opts.vaultID Vault ID Under which this resource should be searched.
     * @param {module:api/NotebooksApi~searchNotebooksByFilterCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/V1GetNotebookResponse}
     */
    searchNotebooksByFilter(opts, callback) {
      opts = opts || {};
      let postBody = null;


      let pathParams = {
      };
      let queryParams = {
        'offset': opts['offset'],
        'limit': opts['limit'],
        'orgID': opts['orgID'],
        'vaultID': opts['vaultID']
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = ['AppID', 'AppSecret', 'Bearer'];
      let contentTypes = ['application/json'];
      let accepts = ['application/json'];
      let returnType = V1GetNotebookResponse;

      return this.callApi(
        '/v1/notebooks', 'GET',
        pathParams, postBody,
        returnType, callback
      );
    },

    /**
     * Callback function to receive the result of the updateNotebook operation.
     * @callback module:api/NotebooksApi~updateNotebookCallback
     * @param {String} error Error message, if any.
     * @param {module:model/V1UpdateNotebookResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Update Notebook
     * Updates a Notebook by Provided ID.
     * @param {String} ID 
     * @param {module:model/V1UpdateNotebookRequest} body 
     * @param {module:api/NotebooksApi~updateNotebookCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/V1UpdateNotebookResponse}
     */
    updateNotebook(ID, body, callback) {
      let postBody = body;

      // verify the required parameter 'ID' is set
      if (ID === undefined || ID === null) {
        throw new Error("Missing the required parameter 'ID' when calling updateNotebook");
      }

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling updateNotebook");
      }


      let pathParams = {
        'ID': ID
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = ['AppID', 'AppSecret', 'Bearer'];
      let contentTypes = ['application/json'];
      let accepts = ['application/json'];
      let returnType = V1UpdateNotebookResponse;

      return this.callApi(
        '/v1/notebooks/{ID}', 'PUT',
        pathParams, postBody,
        returnType, callback
      );
    },


}
export default NotebooksApi

