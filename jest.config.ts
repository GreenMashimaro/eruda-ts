import type { Config } from 'jest'

const config: Config = {
  testMatch: ['<rootDir>/**/*.spec.ts'],
  collectCoverageFrom: ['src/**/*/.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.scss$': 'jest-scss-transform',
  },
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/$1',
  },
}

export default config
