/*
  Copyright (c) 2022 Skyflow, Inc. 
*/
import {
  generateBearerToken, generateBearerTokenFromCreds, generateToken, getToken, __testing, getRolesForScopedToken,
  generateSignedDataTokens, generateSignedDataTokensFromCreds
} from "../src/service-account/util/Token";
import { errorMessages } from "../src/service-account/errors/Messages";
import { setLogLevel } from "../src/vault-api/Logging";
import { LogLevel } from "../src/vault-api/utils/common";
import SkyflowError from "../src/vault-api/libs/SkyflowError";

describe("fileValidityTest", () => {
  setLogLevel(LogLevel.WARN)
  test("invalidJSON", async () => {
    try {
      const res = await generateToken("test/demo-credentials/invalidJson.json")
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
  test("empty json", async () => {
    try {
      const res = await generateToken("test/demo-credentials/empty.json")
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
  test("no client id", async () => {
    try {
      const res = await generateToken("test/demo-credentials/noClientId.json")
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
  test("no key id", async () => {
    try {
      const res = await generateToken("test/demo-credentials/noKeyId.json")
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
  test("no private key", async () => {
    try {
      const res = await generateBearerToken("test/demo-credentials/noPrivateKey.json")
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
  test("no token uri key", async () => {
    try {
      const res = await generateToken("test/demo-credentials/noTokenURI.json")
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
  test("generateBearerTokenFromCreds test", async () => {
    try {
      const res = await generateBearerTokenFromCreds("{}")
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  test("File does not exist", async () => {
    try {
      await generateBearerToken('invalid-file-path.json')
    } catch (err) {
      expect(err).toBeDefined();
    }
  })

  test("Get token with non-string credentials", async () => {
    try {
      await getToken({ credentials: "non-string" })
    } catch (err) {
      expect(err).toBeDefined();
    }
  })

  test("Success response processing", async () => {
    const success = await __testing.successResponse({
      data: {
        accessToken: "access token",
        tokenType: "Bearer"
      }
    })

    expect(success).toBeDefined();
  })

  test("failure response processing JSON", async () => {
    const error = {
      response: {
        headers: {
          'x-request-id': 'RID',
          'content-type': 'application/json'
        },
        data: {
          error: {
            message: "Internal Server Error"
          }
        }
      }
    }


    try {
      const failure = await __testing.failureResponse(error)
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  test("failure response processing Plain text", async () => {
    const error = {
      response: {
        headers: {
          'x-request-id': 'RID',
          'content-type': 'text/plain'
        },
        data: {
          error: {
            message: "Internal Server Error"
          }
        }
      }
    }
    try {
      const failure = await __testing.failureResponse(error)
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
});
test("failure response processing Unknown format", async () => {
  const error = {
    response: {
      headers: {
        'x-request-id': 'RID',
        'content-type': 'invalid-type'
      },
      data: {
        error: {
          message: "Internal Server Error"
        }
      }
    }
  }


  try {
    const failure = await __testing.failureResponse(error)
  } catch (err) {
    expect(err).toBeDefined();
  }
});

describe('context and scoped token options test', () => {

  const creds_without_context = process.env.SA_WITHOUT_CONTEXT

  const credentials = {
    clientID: "test-client-id",
    keyID: "test-key-id",
    tokenURI: "https://test-token-uri.com",
    privateKey: null,
    data: "no-data",
  };

  test("empty roleID array passed to generate scoped token", async () => {
    const expectedError = new SkyflowError({
      code: 400,
      description: errorMessages.ScopedRolesEmpty,
    });

    const options = {
      roleIDs: [],
    };
    try {
      await generateBearerTokenFromCreds(credentials, options);
    } catch (err) {
      expect(err.description).toBe(expectedError.description);
    }
  });
  test("invlaid type passed to generate scoped token", async () => {
    const expectedError = new SkyflowError({
      code: 400,
      description: errorMessages.ExpectedRoleIDParameter,
    });
    const options = {
      roleIDs: true,
    };
    try {
      await generateBearerTokenFromCreds(credentials, options);
    } catch (err) {
      expect(err.description).toBe(expectedError.description);
    }
  });

  test('empty roleID array passed to generate scoped token', async () => {
    const options = {
      roleIDs: []
    }
    try {
      await generateBearerTokenFromCreds(creds_without_context, options)

    } catch (err) {
      expect(err.message).toBe(errorMessages.ScopedRolesEmpty)
    }
  })
  test('invlaid type passed to generate scoped token', async () => {
    const options = {
      roleIDs: true
    }
    try {
      await generateBearerTokenFromCreds(creds_without_context, options)

    } catch (err) {
      expect(err.message).toBe(errorMessages.ExpectedRoleIDParameter)
    }
  })
  test("String [] passed as roleIDs ", async () => {
    const response = getRolesForScopedToken(['roleID1'])
    expect(response).toStrictEqual("role:roleID1 ")
  })
  test("Empty [] passed as roleIDs ", async () => {
    try {
      await getRolesForScopedToken([])
    } catch (err) {
      expect(err).toBeDefined()
    }
  })
  test("Invalid type passed as roleIDs ", async () => {
    try {
      await getRolesForScopedToken(undefined)
    } catch (err) {
      expect(err).toBeDefined()
    }
  })
})

describe('signed data token generation test', () => {

  const data_token_creds = process.env.SIGNED_TOKEN_SA;

  test("no private key", async () => {
    const options = {
      dataTokens: ['datatoken1']
    }
    try {
      const res = await generateSignedDataTokens("test/demo-credentials/noPrivateKey.json", options)
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
  test("no token uri key", async () => {
    try {
      const res = await generateSignedDataTokens("test/demo-credentials/noTokenURI.json", options)
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
  test("generateBearerTokenFromCreds test", async () => {
    try {
      const res = await generateBearerTokenFromCreds("{}", options)
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  test("File does not exist", async () => {
    try {
      await generateSignedDataTokensFromCreds('invalid-file-path.json', options)
    } catch (err) {
      expect(err).toBeDefined();
    }
  })

  test("File is empty", async () => {
    const options = {
      dataTokens: ['token'],
    }
    try {
      await generateSignedDataTokens("test/demo-credentials/empty.json", options)
    } catch (err) {
      expect(err.message).toBe(errorMessages.EmptyFile);
    }
  })
  test("no file path passed", async () => {
    const options = {
      dataTokens: ['token'],
    }
    try {
      await generateSignedDataTokens("", options)
    } catch (err) {
      expect(err.message).toBe(errorMessages.FileNotFound);
    }
  })

  test("Empty data token array passed", async () => {
    const options = {
      dataTokens: []
    }
    try {
      await generateSignedDataTokensFromCreds(data_token_creds, options)
    } catch (err) {
      expect(err.message).toBe(errorMessages.DataTokensEmpty);
    }
  })

  test("data token is undefined", async () => {
    const options = {
      dataTokens: undefined
    }
    try {
      await generateSignedDataTokensFromCreds(data_token_creds, options)
    } catch (err) {
      expect(err.message).toBe(errorMessages.DataTokensNotFound);
    }
  })
  test("invalid data token type provided", async () => {
    const options = {
      dataTokens: 'string'
    }
    try {
      await generateSignedDataTokensFromCreds(data_token_creds, options)
    } catch (err) {
      expect(err.message).toBe(errorMessages.ExpectedDataTokensParameter);
    }
  })
  test("invalid time to live type provided", async () => {
    const options = {
      dataTokens: ['token'],
      timeToLive: 'string'
    }
    try {
      await generateSignedDataTokensFromCreds(data_token_creds, options)
    } catch (err) {
      expect(err.message).toBe(errorMessages.ExpectedTimeToLiveParameter);
    }
  })
  test("invalid credentials type provided", async () => {
    const options = {
      dataTokens: ['token'],
    }
    try {
      await generateSignedDataTokensFromCreds(true, options)
    } catch (err) {
      expect(err.message).toBe(errorMessages.ExpectedStringParameter);
    }
  })
  test("TokenURINotFound", async () => {
    const options = {
      dataTokens: ['token'],
    }
    try {
      await generateSignedDataTokens('test/demo-credentials/noTokenURI.json', options)
    } catch (err) {
      expect(err.message).toBe(errorMessages.TokenURINotFound);
    }
  })
})

