module.exports = {
    setupFilesAfterEnv: [
        'jest-dom/extend-expect',
        'react-testing-library/cleanup-after-each'
      ],
    testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
    testPathIgnorePatterns: ['\\\\node_modules\\\\'],
  };
