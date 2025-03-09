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
    '@domain': '<rootDir>/src/domain',
    '@infra': '<rootDir>/src/infra',
    '@main': '<rootDir>/src/main',
    '@presentation': '<rootDir>/src/presentation',
    '@utils': '<rootDir>/src/utils',
    '@application': '<rootDir>/src/application',
  },
};
