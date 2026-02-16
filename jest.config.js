module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: [
    "@testing-library/jest-dom"
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
