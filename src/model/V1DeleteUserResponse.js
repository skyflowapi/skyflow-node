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
 * The V1DeleteUserResponse model module.
 * @module model/V1DeleteUserResponse
 * @version v1
 */
export class V1DeleteUserResponse  {
  /**
   * Constructs a new <code>V1DeleteUserResponse</code>.
   * @alias module:model/V1DeleteUserResponse
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>V1DeleteUserResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/V1DeleteUserResponse} obj Optional instance to populate.
   * @return {module:model/V1DeleteUserResponse} The populated <code>V1DeleteUserResponse</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new V1DeleteUserResponse();
      if (data.hasOwnProperty('ID'))
        obj.ID = ApiClient.convertToType(data['ID'], 'String');
    }
    return obj;
  }
}

/**
 * @member {String} ID
 */
V1DeleteUserResponse.prototype.ID = undefined;


