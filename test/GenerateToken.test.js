import {generateBearerToken, generateBearerTokenFromCreds, generateToken, getToken, __testing} from "../src/service-account/util/Token";
import { errorMessages } from "../src/service-account/errors/Messages";

describe("fileValidityTest", () => {
  test("invalidJSON",async () => {
    try {
      const res = await generateToken("test/demoCredentials/invalidJson.json")
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
  test("empty json", async () => {
    try {
      const res = await generateToken("test/demoCredentials/empty.json")
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
  test("no client id", async () => {
    try {
      const res = await generateToken("test/demoCredentials/noClientId.json")
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
  test("no key id", async () => {
    try {
      const res = await generateToken("test/demoCredentials/noKeyId.json")
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
  test("no private key", async () => {
    try {
      const res = await generateBearerToken("test/demoCredentials/noPrivateKey.json")
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
  test("no token uri key", async () => {
    try {
      const res = await generateToken("test/demoCredentials/noTokenURI.json")
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
    try{
      await generateBearerToken('invalid-file-path.json')
    } catch (err) {
      expect(err).toBeDefined();
    }
  })
  
  test("Get token with non-string credentials", async () => {
    try {
      await getToken({credentials: "non-string"})
    } catch (err) {
      expect(err).toBeDefined();
    }
  })
  
  test("Success response processing", async () => {
     const success = await __testing.successResponse({data: {
      accessToken: "access token",
      tokenType: "Bearer"
    }})
    
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
      const failure = await  __testing.failureResponse(error)
    } catch(err) {
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
      const failure = await  __testing.failureResponse(error)
    } catch(err) {
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
    const failure = await  __testing.failureResponse(error)
  } catch(err) {
    expect(err).toBeDefined();
  }
});

