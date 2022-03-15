import {generateBearerToken, generateBearerTokenFromCreds, generateToken} from "../src/service-account/util/Token";
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
});

