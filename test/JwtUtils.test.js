import { isTokenValid, isExpired, isValid } from "../src/vault-api/utils/jwt-utils/index";
import jwt from "jsonwebtoken";

describe("isTokenValid", () => {
  it("should return false for an empty token", () => {
    const token = "";
    const result = isTokenValid(token);
    expect(result).toBe(false);
  });

  it("should return false for a token with expired exp claim", () => {
    const token = jwt.sign(
      {  exp: Math.floor(Date.now() / 1000) - 3600  },
      "secret"
    );
    const result = isTokenValid(token);
    expect(result).toBe(false);
  });

  it("should return true for a token with valid exp claim", () => {
    const token = jwt.sign(
      { exp: Math.floor(Date.now() / 1000) + 3600 },
      "secret"
    );
    const result = isTokenValid(token);
    expect(result).toBe(true);
  });
});

describe("isExpired", () => {
  it("should return true for an empty token", () => {
    const token = "";
    const result = isExpired(token);
    expect(result).toBe(true);
  });

  it("should return true for a token with expired exp claim", () => {
    const token = jwt.sign({ exp: Math.floor(Date.now() / 1000) - 3600 }, "secret");
    const result = isExpired(token);
    expect(result).toBe(true);
  });

  it("should return false for a token with valid exp claim", () => {
    const token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + 3600 }, "secret");
    const result = isExpired(token);
    expect(result).toBe(false);
  });
});

describe("isValid", () => {
  it("should return true for a valid token", () => {
    const token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + 3600 }, "secret");
    const result = isValid(token);
    expect(result).toBe(true);
  });

  it("should return false for an expired token", () => {
    const token = jwt.sign({ exp: Math.floor(Date.now() / 1000) - 3600 }, "secret");
    const result = isValid(token);
    expect(result).toBe(false);
  });
});
