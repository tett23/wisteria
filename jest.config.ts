module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'esbuild-jest',
  },
  testRegex: '__tests__/.+(\\.|_)(test|spec)\\.(jsx?|tsx?)$',
  moduleNameMapper: {
    'components(.*)': '<rootDir>/renderer/components$1',
    'modules(.*)': '<rootDir>/renderer/modules$1',
    'models(.*)': '<rootDir>/models$1',
    'hooks(.*)': '<rootDir>/renderer/hooks$1',
    'assets(.*)': '<rootDir>/renderer/assets$1',
    'workers(.*)': '<rootDir>/workers$1',
  },
};
