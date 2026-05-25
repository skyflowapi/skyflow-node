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

import { printLog, OrderByEnum, RedactionType } from "../../../src/utils";
import DetokenizeOptions from "../../../src/vault/model/options/detokenize";
import GetOptions from "../../../src/vault/model/options/get";
import FileUploadRequest from "../../../src/vault/model/request/file-upload";
import { Bleep } from "../../../src/vault/model/options/deidentify-file/bleep-audio";
import FileUploadOptions from "../../../src/vault/model/options/fileUpload";
import DeidentifyTextResponse from "../../../src/vault/model/response/deidentify-text";
import DeidentifyFileResponse from "../../../src/vault/model/response/deidentify-file";

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

describe("Bleep", () => {
  test("setStartPadding stores value retrieved by getStartPadding", () => {
    const b = new Bleep();
    b.setStartPadding(0.5);
    expect(b.getStartPadding()).toBe(0.5);
  });

  test("getStartPadding returns undefined when not set", () => {
    const b = new Bleep();
    expect(b.getStartPadding()).toBeUndefined();
  });

  test("setStopPadding stores value retrieved by getStopPadding", () => {
    const b = new Bleep();
    b.setStopPadding(1.2);
    expect(b.getStopPadding()).toBe(1.2);
  });

  test("getStopPadding returns undefined when not set", () => {
    const b = new Bleep();
    expect(b.getStopPadding()).toBeUndefined();
  });

  test("setGain stores value retrieved by getGain", () => {
    const b = new Bleep();
    b.setGain(0.8);
    expect(b.getGain()).toBe(0.8);
  });

  test("setFrequency stores value retrieved by getFrequency", () => {
    const b = new Bleep();
    b.setFrequency(440);
    expect(b.getFrequency()).toBe(440);
  });
});

describe("FileUploadOptions", () => {
  test("setSkyflowId stores value retrieved by getSkyflowId", () => {
    const opts = new FileUploadOptions();
    opts.setSkyflowId("sky-123");
    expect(opts.getSkyflowId()).toBe("sky-123");
  });

  test("getSkyflowId returns undefined when not set", () => {
    const opts = new FileUploadOptions();
    expect(opts.getSkyflowId()).toBeUndefined();
  });

  test("setSkyflowId overwrites previous value", () => {
    const opts = new FileUploadOptions();
    opts.setSkyflowId("first");
    opts.setSkyflowId("second");
    expect(opts.getSkyflowId()).toBe("second");
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

// ─── FULL GETTER/SETTER COVERAGE ──────────────────────────────────────────────

describe("DetokenizeOptions full coverage", () => {
  test("setContinueOnError / getContinueOnError", () => {
    const opts = new DetokenizeOptions();
    expect(opts.getContinueOnError()).toBeUndefined();
    opts.setContinueOnError(true);
    expect(opts.getContinueOnError()).toBe(true);
    opts.setContinueOnError(false);
    expect(opts.getContinueOnError()).toBe(false);
  });
});

describe("GetOptions full coverage", () => {
  test("setRedactionType / getRedactionType", () => {
    const opts = new GetOptions();
    expect(opts.getRedactionType()).toBeUndefined();
    opts.setRedactionType(RedactionType.PLAIN_TEXT);
    expect(opts.getRedactionType()).toBe(RedactionType.PLAIN_TEXT);
  });

  test("setReturnTokens / getReturnTokens", () => {
    const opts = new GetOptions();
    expect(opts.getReturnTokens()).toBeUndefined();
    opts.setReturnTokens(true);
    expect(opts.getReturnTokens()).toBe(true);
  });

  test("setFields / getFields", () => {
    const opts = new GetOptions();
    expect(opts.getFields()).toBeUndefined();
    opts.setFields(["card_number", "cvv"]);
    expect(opts.getFields()).toEqual(["card_number", "cvv"]);
  });

  test("setOffset / getOffset", () => {
    const opts = new GetOptions();
    expect(opts.getOffset()).toBeUndefined();
    opts.setOffset("10");
    expect(opts.getOffset()).toBe("10");
  });

  test("setLimit / getLimit", () => {
    const opts = new GetOptions();
    expect(opts.getLimit()).toBeUndefined();
    opts.setLimit("25");
    expect(opts.getLimit()).toBe("25");
  });

  test("setColumnName / getColumnName", () => {
    const opts = new GetOptions();
    expect(opts.getColumnName()).toBeUndefined();
    opts.setColumnName("card_number");
    expect(opts.getColumnName()).toBe("card_number");
  });

  test("setColumnValues / getColumnValues", () => {
    const opts = new GetOptions();
    expect(opts.getColumnValues()).toBeUndefined();
    opts.setColumnValues(["val1", "val2"]);
    expect(opts.getColumnValues()).toEqual(["val1", "val2"]);
  });

  test("setOrderBy / getOrderBy", () => {
    const opts = new GetOptions();
    expect(opts.getOrderBy()).toBeUndefined();
    opts.setOrderBy(OrderByEnum.ASC);
    expect(opts.getOrderBy()).toBe(OrderByEnum.ASC);
  });
});

describe("FileUploadOptions full coverage", () => {
  test("setFilePath / getFilePath", () => {
    const opts = new FileUploadOptions();
    expect(opts.getFilePath()).toBeUndefined();
    opts.setFilePath("/tmp/file.pdf");
    expect(opts.getFilePath()).toBe("/tmp/file.pdf");
  });

  test("setBase64 / getBase64", () => {
    const opts = new FileUploadOptions();
    expect(opts.getBase64()).toBeUndefined();
    opts.setBase64("abc123==");
    expect(opts.getBase64()).toBe("abc123==");
  });

  test("setFileObject / getFileObject", () => {
    const opts = new FileUploadOptions();
    expect(opts.getFileObject()).toBeUndefined();
    const f = new File(["data"], "test.txt");
    opts.setFileObject(f);
    expect(opts.getFileObject()).toBe(f);
  });

  test("setFileName / getFileName", () => {
    const opts = new FileUploadOptions();
    expect(opts.getFileName()).toBeUndefined();
    opts.setFileName("report.pdf");
    expect(opts.getFileName()).toBe("report.pdf");
  });
});

describe("FileUploadRequest full coverage", () => {
  test("table setter updates value", () => {
    const req = new FileUploadRequest("old_table", "col");
    req.table = "new_table";
    expect(req.table).toBe("new_table");
  });

  test("columnName setter updates value", () => {
    const req = new FileUploadRequest("tbl", "old_col");
    req.columnName = "new_col";
    expect(req.columnName).toBe("new_col");
  });

  test("getLegacySkyflowId returns undefined for 2-arg constructor", () => {
    const req = new FileUploadRequest("tbl", "col");
    expect(req.getLegacySkyflowId()).toBeUndefined();
  });

  test("getLegacySkyflowId returns skyflowId for 3-arg constructor", () => {
    const req = new FileUploadRequest("tbl", "sky-999", "col");
    expect(req.getLegacySkyflowId()).toBe("sky-999");
  });
});

describe("DeidentifyTextResponse errors branch", () => {
  test("errors defaults to null when not provided", () => {
    const r = new DeidentifyTextResponse({
      processedText: "text",
      entities: [],
      wordCount: 1,
      charCount: 4,
    });
    expect(r.errors).toBeNull();
  });

  test("errors is set when provided as array", () => {
    const err = { requestId: "req-1", description: "fail" };
    const r = new DeidentifyTextResponse({
      processedText: "text",
      entities: [],
      wordCount: 1,
      charCount: 4,
      errors: [err],
    });
    expect(r.errors).toEqual([err]);
  });

  test("errors is null when explicitly passed null", () => {
    const r = new DeidentifyTextResponse({
      processedText: "text",
      entities: [],
      wordCount: 1,
      charCount: 4,
      errors: null,
    });
    expect(r.errors).toBeNull();
  });
});

describe("DeidentifyFileResponse errors branch", () => {
  test("errors defaults to null when not provided", () => {
    const r = new DeidentifyFileResponse({});
    expect(r.errors).toBeNull();
  });

  test("errors is set when provided as array", () => {
    const err = { requestId: "req-2", description: "fail" };
    const r = new DeidentifyFileResponse({ errors: [err] });
    expect(r.errors).toEqual([err]);
  });

  test("errors is null when explicitly passed null", () => {
    const r = new DeidentifyFileResponse({ errors: null });
    expect(r.errors).toBeNull();
  });
});
