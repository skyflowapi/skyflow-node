module.exports = {
    transform: {
      '^.+\\.(ts|tsx)?$': 'ts-jest',
      '^.+\\.(js|jsx)$': 'babel-jest',
    },
    // Do NOT babel-transform the already-compiled `common` package (it is plain
    // CJS from tsc). Jest may resolve the skyflow-common symlink to its realpath
    // (outside node_modules), which would otherwise trigger babel's core-js
    // injection against a dep that isn't installed. Matches both the realpath
    // (".../common/lib/...") and the symlink path (".../skyflow-common/lib/...").
    transformIgnorePatterns: ['/node_modules/', 'common/lib'],
    verbose: true,
    collectCoverage: true,
    coveragePathIgnorePatterns: [
      "/node_modules/",
      "src/ _generated_",
      "src/.*/model/request",
      "src/.*/model/response",
      "src/.*/model/options",
    ],
    testEnvironmentOptions: {
      "url": "https://skyflow-test.com"
    },
    testEnvironment: "node",
  };
