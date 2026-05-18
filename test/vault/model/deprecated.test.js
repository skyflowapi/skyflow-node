jest.mock("../../../src/utils", () => ({
  printLog: jest.fn(),
  MessageType: { LOG: "LOG", ERROR: "ERROR", WARN: "WARN" },
  LogLevel: {
    DEBUG: "DEBUG",
    INFO: "INFO",
    WARN: "WARN",
    ERROR: "ERROR",
    OFF: "OFF",
  },
  OrderByEnum: { ASC: "ASC", DESC: "DESC" },
  RedactionType: {
    DEFAULT: "DEFAULT",
    PLAIN_TEXT: "PLAIN_TEXT",
    MASKED: "MASKED",
    REDACTED: "REDACTED",
  },
}));

import { printLog } from "../../../src/utils";
import DetokenizeOptions from "../../../src/vault/model/options/detokenize";
import GetOptions from "../../../src/vault/model/options/get";
import FileUploadRequest from "../../../src/vault/model/request/file-upload";

beforeEach(() => {
  printLog.mockClear();
});

// ─── NEW API ──────────────────────────────────────────────────────────────────
// These tests cover the canonical (non-deprecated) interface.
// Keep them forever; they document what the API *should* do.

describe("DetokenizeOptions", () => {
  test("setDownloadUrl sets value retrieved by getDownloadUrl", () => {
    const opts = new DetokenizeOptions();
    opts.setDownloadUrl(true);
    expect(opts.getDownloadUrl()).toBe(true);
  });

  test("setDownloadUrl with false sets value correctly", () => {
    const opts = new DetokenizeOptions();
    opts.setDownloadUrl(false);
    expect(opts.getDownloadUrl()).toBe(false);
  });

  test("getDownloadUrl returns undefined when not set", () => {
    const opts = new DetokenizeOptions();
    expect(opts.getDownloadUrl()).toBeUndefined();
  });
});

describe("GetOptions", () => {
  test("setDownloadUrl sets value retrieved by getDownloadUrl", () => {
    const opts = new GetOptions();
    opts.setDownloadUrl(true);
    expect(opts.getDownloadUrl()).toBe(true);
  });

  test("setDownloadUrl with false sets value correctly", () => {
    const opts = new GetOptions();
    opts.setDownloadUrl(false);
    expect(opts.getDownloadUrl()).toBe(false);
  });

  test("getDownloadUrl returns undefined when not set", () => {
    const opts = new GetOptions();
    expect(opts.getDownloadUrl()).toBeUndefined();
  });
});

describe("FileUploadRequest", () => {
  test("2-arg constructor sets table and columnName", () => {
    const req = new FileUploadRequest("tbl", "col");
    expect(req.table).toBe("tbl");
    expect(req.columnName).toBe("col");
  });

  test("2-arg constructor does not log deprecation", () => {
    new FileUploadRequest("my_table", "file_col");
    expect(printLog).not.toHaveBeenCalledWith(
      expect.stringContaining(
        "FileUploadRequest(table, skyflowId, columnName)",
      ),
      expect.anything(),
      expect.anything(),
    );
  });
});

// ─── DEPRECATED ───────────────────────────────────────────────────────────────
// Remove each block below when the corresponding deprecated API is removed.
// The new-API blocks above retain full coverage after deletion.

describe("DetokenizeOptions deprecated methods", () => {
  test("setDownloadURL delegates to setDownloadUrl and logs deprecation", () => {
    const opts = new DetokenizeOptions();
    opts.setDownloadURL(true);
    expect(opts.getDownloadUrl()).toBe(true);
    expect(printLog).toHaveBeenCalledWith(
      expect.stringContaining("setDownloadURL"),
      expect.anything(),
      expect.anything(),
    );
  });

  test("setDownloadURL with false value delegates correctly", () => {
    const opts = new DetokenizeOptions();
    opts.setDownloadURL(false);
    expect(opts.getDownloadUrl()).toBe(false);
  });

  test("getDownloadURL returns same value as getDownloadUrl and logs deprecation", () => {
    const opts = new DetokenizeOptions();
    opts.setDownloadUrl(true);
    const result = opts.getDownloadURL();
    expect(result).toBe(true);
    expect(printLog).toHaveBeenCalledWith(
      expect.stringContaining("getDownloadURL"),
      expect.anything(),
      expect.anything(),
    );
  });

  test("getDownloadURL returns undefined when not set", () => {
    const opts = new DetokenizeOptions();
    expect(opts.getDownloadURL()).toBeUndefined();
  });
});

describe("GetOptions deprecated methods", () => {
  test("setDownloadURL delegates to setDownloadUrl and logs deprecation", () => {
    const opts = new GetOptions();
    opts.setDownloadURL(true);
    expect(opts.getDownloadUrl()).toBe(true);
    expect(printLog).toHaveBeenCalledWith(
      expect.stringContaining("setDownloadURL"),
      expect.anything(),
      expect.anything(),
    );
  });

  test("setDownloadURL with false value delegates correctly", () => {
    const opts = new GetOptions();
    opts.setDownloadURL(false);
    expect(opts.getDownloadUrl()).toBe(false);
  });

  test("getDownloadURL returns same value as getDownloadUrl and logs deprecation", () => {
    const opts = new GetOptions();
    opts.setDownloadUrl(true);
    const result = opts.getDownloadURL();
    expect(result).toBe(true);
    expect(printLog).toHaveBeenCalledWith(
      expect.stringContaining("getDownloadURL"),
      expect.anything(),
      expect.anything(),
    );
  });

  test("getDownloadURL returns undefined when not set", () => {
    const opts = new GetOptions();
    expect(opts.getDownloadURL()).toBeUndefined();
  });
});

describe("FileUploadRequest deprecated API", () => {
  test("3-arg constructor logs deprecation and routes args correctly", () => {
    const req = new FileUploadRequest("my_table", "sky-id-123", "file_col");
    expect(req.table).toBe("my_table");
    expect(req.columnName).toBe("file_col");
    expect(printLog).toHaveBeenCalledWith(
      expect.stringContaining(
        "FileUploadRequest(table, skyflowId, columnName)",
      ),
      expect.anything(),
      expect.anything(),
    );
  });

  test("skyflowId getter returns legacy value from 3-arg constructor and logs deprecation", () => {
    const req = new FileUploadRequest("tbl", "sky-id-456", "col");
    printLog.mockClear();
    expect(req.skyflowId).toBe("sky-id-456");
    expect(printLog).toHaveBeenCalledWith(
      expect.stringContaining("'skyflowId' of FileUploadRequest"),
      expect.anything(),
      expect.anything(),
    );
  });

  test("skyflowId getter returns empty string when not set via 2-arg constructor", () => {
    const req = new FileUploadRequest("tbl", "col");
    printLog.mockClear();
    expect(req.skyflowId).toBe("");
    expect(printLog).toHaveBeenCalledWith(
      expect.stringContaining("'skyflowId' of FileUploadRequest"),
      expect.anything(),
      expect.anything(),
    );
  });

  test("skyflowId setter updates value and logs deprecation", () => {
    const req = new FileUploadRequest("tbl", "col");
    printLog.mockClear();
    req.skyflowId = "new-id";
    expect(printLog).toHaveBeenCalledWith(
      expect.stringContaining("'skyflowId' of FileUploadRequest"),
      expect.anything(),
      expect.anything(),
    );
    printLog.mockClear();
    expect(req.skyflowId).toBe("new-id");
  });

  test("skyflowId setter overwrites value set by 3-arg constructor", () => {
    const req = new FileUploadRequest("tbl", "original-id", "col");
    printLog.mockClear();
    req.skyflowId = "updated-id";
    printLog.mockClear();
    expect(req.skyflowId).toBe("updated-id");
  });
});
