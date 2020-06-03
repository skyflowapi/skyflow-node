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

import BaseEntity from './BaseEntity';

/**
 * The V1DeleteRecordResponse model module.
 * @module model/V1DeleteRecordResponse
 * @version v1
 */
export class V1DeleteRecordResponse  {
  /**
   * Constructs a new <code>V1DeleteRecordResponse</code>.
   * @alias module:model/V1DeleteRecordResponse
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>V1DeleteRecordResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/V1DeleteRecordResponse} obj Optional instance to populate.
   * @return {module:model/V1DeleteRecordResponse} The populated <code>V1DeleteRecordResponse</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new V1DeleteRecordResponse();
      if (data.hasOwnProperty('ID'))
        obj.ID = ApiClient.convertToType(data['ID'], 'String');
    }
    return obj;
  }
}

/**
 * @member {String} ID
 */
V1DeleteRecordResponse.prototype.ID = undefined;


