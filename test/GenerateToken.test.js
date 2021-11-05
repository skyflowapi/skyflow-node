import GenerateToken from "../src/service-account/util/Token";
import { errorMessages } from "../src/errors/Messages.js";

describe("fileValidityTest", () => {
  test("invalidJSON", () => {
    return expect(
      GenerateToken("test/demoCredentials/textFile.json")
    ).rejects.toMatch(errorMessages.clientIDNotFound);
  });
});

