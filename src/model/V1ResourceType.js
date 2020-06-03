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
 * Enum class V1ResourceType.
 * @enum {String}
 * @readonly
 */
const V1ResourceType = {
  /**
   * value: "NONE"
   * @const
   */
  NONE: "NONE",

  /**
   * value: "ORGANIZATION"
   * @const
   */
  ORGANIZATION: "ORGANIZATION",

  /**
   * value: "VAULT"
   * @const
   */
  VAULT: "VAULT",

  /**
   * value: "NOTEBOOK"
   * @const
   */
  NOTEBOOK: "NOTEBOOK",

  /**
   * Returns a <code>V1ResourceType</code> enum value from a JavaScript object name.
   * @param {Object} data The plain JavaScript object containing the name of the enum value.
   * @return {module:model/V1ResourceType} The enum <code>V1ResourceType</code> value.
   */
  constructFromObject: function(object) {
    return object;
  }
};

export {V1ResourceType};
