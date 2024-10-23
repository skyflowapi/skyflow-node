module.exports = {
    transform: {
      '^.+\\.(ts|tsx)?$': 'ts-jest',
      '^.+\\.(js|jsx)$': 'babel-jest',
    },
    verbose: true,
    collectCoverage: true,
    coveragePathIgnorePatterns: [
      "/node_modules/",
      "src/ _generated_",
      "src/.*/model/request",
      "src/.*/model/response",
      "src/.*/model/options",
      "src/utils/validations",
    ],
    testEnvironmentOptions: {
      "url": "https://skyflow-test.com"
    }, 
    testEnvironment: "node",
  };