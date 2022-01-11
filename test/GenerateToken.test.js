import {GenerateToken} from "../src/service-account/util/Token";
import { errorMessages } from "../src/service-account/errors/Messages";

describe("fileValidityTest", () => {
  test("invalidJSON", () => {
    return expect(
      GenerateToken("test/demoCredentials/invalidJson.json")
    ).rejects.toMatch(errorMessages.clientIDNotFound);
  });

  test("empty json", () => {
    return expect(
      GenerateToken("test/demoCredentials/empty.json")
    ).rejects.toMatch(errorMessages.EmptyFile);
  });
  test("no client id", () => {
    return expect(
      GenerateToken("test/demoCredentials/noClientId.json")
    ).rejects.toMatch(errorMessages.clientIDNotFound);
  });
  test("no key id", () => {
    return expect(
      GenerateToken("test/demoCredentials/noKeyId.json")
    ).rejects.toMatch(errorMessages.keyIDNotFound);
  });
  test("no private key", () => {
    return expect(
      GenerateToken("test/demoCredentials/noPrivateKey.json")
    ).rejects.toMatch(errorMessages.privateKeyNotFound);
  });
  test("no token uri key", () => {
    return expect(
      GenerateToken("test/demoCredentials/noTokenURI.json")
    ).rejects.toMatch(errorMessages.tokenURINotFound);
  });
});

