/*
  Copyright (c) 2022 Skyflow, Inc.
*/
import {
  generateToken,
  generateBearerToken,
  generateBearerTokenFromCreds,
  generateSignedDataTokens,
  generateSignedDataTokensFromCreds
} from './service-account/util/Token';
import Skyflow from './vault-api/Skyflow';
import { setLogLevel } from './vault-api/Logging';
import { LogLevel } from './vault-api/utils/common';
import { isValid, isExpired } from './vault-api/utils/jwt-utils';
process.emitWarning(
  'skyflow-node v1.x is deprecated and will reach End of Life on October 31, 2026. Please migrate to v2: https://github.com/skyflowapi/skyflow-node/blob/main/docs/migrate_to_v2.md',
  'DeprecationWarning'
);

/**
 * @deprecated skyflow-node v1.x is deprecated and will reach End of Life on October 31, 2026.
 * Please migrate to v2: https://github.com/skyflowapi/skyflow-node/blob/main/docs/migrate_to_v2.md
 */
export {
  generateBearerToken,
  generateToken,
  generateBearerTokenFromCreds,
  setLogLevel,
  LogLevel,
  Skyflow,
  isValid,
  isExpired,
  generateSignedDataTokens,
  generateSignedDataTokensFromCreds
};
