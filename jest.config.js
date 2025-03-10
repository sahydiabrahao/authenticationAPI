module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/main/**'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  preset: '@shelf/jest-mongodb',
  transform: {
    '.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    '@main': '<rootDir>/src/main',
    '@presentation': '<rootDir>/src/presentation',
    '@utils': '<rootDir>/src/utils',
    '@domain': '<rootDir>/src/domain',
    '@application': '<rootDir>/src/application',
    '@infra': '<rootDir>/src/infra',
  },
};
