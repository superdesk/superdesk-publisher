module.exports = {
  setupFilesAfterEnv: [
    "jest-dom/extend-expect",
    "@testing-library/react/cleanup-after-each"
  ],
  testMatch: ["**/__tests__/**/*.js?(x)", "**/?(*.)+(spec|test).js?(x)"],
  testPathIgnorePatterns: ["\\\\node_modules\\\\"],
  transform: {
    "^.+\\.js(x)?$": "babel-jest",
    "^.+\\.css$": "jest-transform-css"
  },
  verbose: true,
  moduleDirectories: ["node_modules"]
};
