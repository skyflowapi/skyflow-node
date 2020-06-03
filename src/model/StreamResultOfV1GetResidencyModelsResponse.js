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

import {RuntimeStreamError} from './RuntimeStreamError';
import {V1GetResidencyModelsResponse} from './V1GetResidencyModelsResponse';
import BaseEntity from './BaseEntity';

/**
 * The StreamResultOfV1GetResidencyModelsResponse model module.
 * @module model/StreamResultOfV1GetResidencyModelsResponse
 * @version v1
 */
export class StreamResultOfV1GetResidencyModelsResponse extends BaseEntity {
  /**
   * Constructs a new <code>StreamResultOfV1GetResidencyModelsResponse</code>.
   * @alias module:model/StreamResultOfV1GetResidencyModelsResponse
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>StreamResultOfV1GetResidencyModelsResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/StreamResultOfV1GetResidencyModelsResponse} obj Optional instance to populate.
   * @return {module:model/StreamResultOfV1GetResidencyModelsResponse} The populated <code>StreamResultOfV1GetResidencyModelsResponse</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new StreamResultOfV1GetResidencyModelsResponse();
      if (data.hasOwnProperty('result'))
        obj.result = V1GetResidencyModelsResponse.constructFromObject(data['result']);
      if (data.hasOwnProperty('error'))
        obj.error = RuntimeStreamError.constructFromObject(data['error']);
    }
    return obj;
  }
}

/**
 * @member {module:model/V1GetResidencyModelsResponse} result
 */
StreamResultOfV1GetResidencyModelsResponse.prototype.result = undefined;

/**
 * @member {module:model/RuntimeStreamError} error
 */
StreamResultOfV1GetResidencyModelsResponse.prototype.error = undefined;


