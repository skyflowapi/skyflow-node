/*
	Copyright (c) 2022 Skyflow, Inc. 
*/
import {
  generateToken,
  generateBearerToken,
  generateBearerTokenFromCreds,
} from './service-account/util/Token';
import Skyflow from './vault-api/Skyflow';
import {setLogLevel} from './vault-api/Logging';
import {LogLevel} from './vault-api/utils/common';
import {isValid,isExpired} from './vault-api/utils/jwt-utils';
export {
  generateBearerToken,
  generateToken,
  generateBearerTokenFromCreds,
  setLogLevel,
  LogLevel,
  Skyflow,
  isValid,
  isExpired
};
