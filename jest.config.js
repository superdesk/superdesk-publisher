module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: [
    "jest-dom/extend-expect",
    "@testing-library/react/cleanup-after-each",
    "<rootDir>/client/__mocks__/mathRandomMock.js"
  ],
  testMatch: ["**/__tests__/**/*.js?(x)", "**/?(*.)+(spec|test).js?(x)"],
  testPathIgnorePatterns: ["\\\\node_modules\\\\"],
  transform: {
    "^.+\\.js(x)?$": "babel-jest",
    "^.+\\.css$": "jest-transform-css"
  },
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "<rootDir>/client/__mocks__/styleMock.js"
  },
  verbose: true,
  moduleDirectories: ["node_modules"]
};
