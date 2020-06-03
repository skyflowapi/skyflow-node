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

import {V1Notebook} from './V1Notebook';
import BaseEntity from './BaseEntity';

/**
 * The V1UpdateNotebookRequest model module.
 * @module model/V1UpdateNotebookRequest
 * @version v1
 */
export class V1UpdateNotebookRequest  {
  /**
   * Constructs a new <code>V1UpdateNotebookRequest</code>.
   * @alias module:model/V1UpdateNotebookRequest
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>V1UpdateNotebookRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/V1UpdateNotebookRequest} obj Optional instance to populate.
   * @return {module:model/V1UpdateNotebookRequest} The populated <code>V1UpdateNotebookRequest</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new V1UpdateNotebookRequest();
      if (data.hasOwnProperty('ID'))
        obj.ID = ApiClient.convertToType(data['ID'], 'String');
      if (data.hasOwnProperty('notebook'))
        obj.notebook = V1Notebook.constructFromObject(data['notebook']);
    }
    return obj;
  }
}

/**
 * @member {String} ID
 */
V1UpdateNotebookRequest.prototype.ID = undefined;

/**
 * @member {module:model/V1Notebook} notebook
 */
V1UpdateNotebookRequest.prototype.notebook = undefined;


