import GenerateToken from "../src/service-account/util/Token";
import { errorMessages } from "../src/errors/Messages.js";

describe("successfullResponseTest", () => {
  test("firstTestDemo", () => {
    return GenerateToken("test/demoCredentials/workingCreds.json").then(
      (data) => {
        expect(data.accessToken).toBeDefined();
        expect(data.tokenType).toBeDefined();
      }
    );
  });
});

describe("fileValidityTest", () => {
  test("invalidFile", () => {
    return expect(
      GenerateToken("test/demoCredentials/someFile.json")
    ).rejects.toMatch(errorMessages.fileNotFound);
  });
  test("invalidJSON", () => {
    return expect(
      GenerateToken("test/demoCredentials/invalidSyntax.json")
    ).rejects.toMatch(errorMessages.notAValidJSON);
  });
});

describe("missingObjectVariablesTest", () => {
  test("missing clientID", () => {
    return expect(
      GenerateToken("test/demoCredentials/clientIDNF.json")
    ).rejects.toMatch(errorMessages.clientIDNotFound);
  });
  test("missing tokenURI", () => {
    return expect(
      GenerateToken("test/demoCredentials/tokenURINF.json")
    ).rejects.toMatch(errorMessages.tokenURINotFound);
  });
  test("missing keyID", () => {
    return expect(
      GenerateToken("test/demoCredentials/keyIDNF.json")
    ).rejects.toMatch(errorMessages.keyIDNotFound);
  });

  test("missing privateKey", () => {
    return expect(
      GenerateToken("test/demoCredentials/primaryKeyNF.json")
    ).rejects.toMatch(errorMessages.privateKeyNotFound);
  });
});
