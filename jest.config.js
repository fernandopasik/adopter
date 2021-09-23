export default {
  collectCoverageFrom: ['src/**/*.{j,t}s', '!src/bin/*', '!src/lib/packages/resolve-package.ts'],
  globals: { 'ts-jest': { tsconfig: 'tsconfig.all.json', useESM: true } },
  moduleNameMapper: { '(.*)\\.js': '$1' },
  preset: 'ts-jest/presets/js-with-ts-esm',
  testEnvironment: 'node',
};
