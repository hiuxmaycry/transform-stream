module.exports = {
  rootDir: '../',
  setupFilesAfterEnv: ['<rootDir>/config/setup.js'],
  testRegex: 'src/.*.test.(js|ts|tsx)$',
  coveragePathIgnorePatterns: ['/node_modules'],
  coverageThreshold: {
    './lib': { lines: 90 }
  },
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.ts$': 'babel-jest',
    '^.+\\.tsx$': 'babel-jest'
  },
  testEnvironment: 'node',
  reporters: ['default'],
  restoreMocks: true
};
