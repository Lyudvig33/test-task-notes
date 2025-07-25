/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './src', 
  moduleNameMapper: {
    '^@resources/(.*)$': '<rootDir>/resources/$1',
    '^@common/(.*)$': '<rootDir>/common/$1',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  testRegex: '.*\\.spec\\.ts$',
  collectCoverageFrom: ['**/*.(ts|js)'],
};
