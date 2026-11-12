module.exports = {
    transform: {
      '^.+\\.(ts|tsx)?$': 'ts-jest',
      '^.+\\.(js|jsx)$': 'babel-jest',
    },
    verbose: true,
    collectCoverage: false,
    testEnvironmentOptions: {
      "url": "https://skyflow-test.com"
    },
    testEnvironment: "node",
  };
