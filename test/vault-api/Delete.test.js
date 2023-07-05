import Skyflow from "../../src/vault-api/Skyflow";
import clientModule from "../../src/vault-api/client";
import logs from "../../src/vault-api/utils/logs";

jest.mock("../../src/vault-api/utils/jwt-utils", () => ({
  __esModule: true,
  isTokenValid: jest.fn((token) => token === "token"),
}));

jest.mock("../../src/vault-api/client");

const errorDeleteInput = {
  records: [
    {
      id: "invalid_delete_id",
      table: "table1",
    },
  ],
};

const errorDeleteRequestResponse = {
  error: {
    code: "404",
    description: "No Records Found.",
  },
};

const deleteFailure = {
  errors: [
    {
      id : 'invalid_delete_id',
      ...errorDeleteRequestResponse,
    }
  ]
};

describe("testing delete with invalid bearer token", () => {
  test("delete failure with invalid token 1", (done) => {
    try {
      const skyflowConfig = {
        vaultID: "<VaultID>",
        vaultURL: "https://www.vaulturl.com",
        getBearerToken: () => {
          return new Promise((_, reject) => {
            reject("invalid token");
          });
        },
      };

      const clientReq = jest.fn(() =>
        Promise.reject(errorDeleteRequestResponse)
      );

      const mockClient = {
        config: skyflowConfig,
        request: clientReq,
        metadata: {},
      };

      clientModule.mockImplementation(() => {
        return mockClient;
      });

      const skyflow = Skyflow.init({
        vaultID: "<VaultID>",
        vaultURL: "https://www.vaulturl.com",
        getBearerToken: () => {
          return new Promise((_, reject) => {
            reject("invalid token");
          });
        },
      });

      const result = skyflow.delete(errorDeleteInput);
      try {
        result.catch((err) => {
          expect(err).toEqual("invalid token");
          done();
        });
      } catch (err) {
        done(err);
      }
    } catch (err) {
      done(err);
    }
  });

  test("delete failure with invalid token 2", (done) => {
    try {
      const skyflowConfig = {
        vaultID: "<VaultID>",
        vaultURL: "https://www.vaulturl.com",
        getBearerToken: () => {
          return new Promise((resolve, _) => {
            resolve("");
          });
        },
      };

      const clientReq = jest.fn(() =>
        Promise.reject(errorDeleteRequestResponse)
      );

      const mockClient = {
        config: skyflowConfig,
        request: clientReq,
        metadata: {},
      };

      clientModule.mockImplementation(() => {
        return mockClient;
      });

      const skyflow = Skyflow.init({
        vaultID: "<VaultID>",
        vaultURL: "https://www.vaulturl.com",
        getBearerToken: () => {
          return new Promise((resolve, _) => {
            resolve("");
          });
        },
      });

      const result = skyflow.delete(errorDeleteInput);
      try {
        result.catch((err) => {
          expect(err.message).toEqual(logs.errorLogs.INVALID_BEARER_TOKEN);
          done();
        });
      } catch (err) {
        done(err);
      }
    } catch (err) {
      done(err);
    }
  });

  test("delete failure with invalid token 3", (done) => {
    try {
      const skyflowConfig = {
        vaultID: "<VaultID>",
        vaultURL: "https://www.vaulturl.com",
        getBearerToken: () => {
          return new Promise((resolve, _) => {
            resolve("token");
          });
        },
      };

      const clientReq = jest.fn(() =>
        Promise.reject(errorDeleteRequestResponse)
      );

      const mockClient = {
        config: skyflowConfig,
        request: clientReq,
        metadata: {},
      };

      clientModule.mockImplementation(() => {
        return mockClient;
      });

      const skyflow = Skyflow.init({
        vaultID: "<VaultID>",
        vaultURL: "https://www.vaulturl.com",
        getBearerToken: () => {
          return new Promise((resolve, _) => {
            resolve("token");
          });
        },
      });

      const result = skyflow.delete(errorDeleteInput);
      try {
        result.catch((err) => {
          expect(err).toEqual(deleteFailure);
          done();
        });
      } catch (err) {
        done(err);
      }
    } catch (err) {
      done(err);
    }
  });
});
