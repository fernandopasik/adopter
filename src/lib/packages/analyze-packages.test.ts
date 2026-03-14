import { beforeEach, describe, it, jest } from '@jest/globals';
import assert from 'node:assert/strict';
import analyzePackages from './analyze-packages.ts';
import { addPackage } from './packages.ts';
import setPackageDependencies from './set-package-dependencies.ts';
import setPackageMods from './set-package-mods.ts';

jest.mock('./packages.ts', () => ({ addPackage: jest.fn() }));
jest.mock('./set-package-dependencies.ts');
jest.mock('./set-package-mods.ts');
jest.mock('./resolve-package.ts', () =>
  jest.fn(async (specifier: string) => Promise.resolve(specifier)),
);

describe('analyze packages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('adds each package', async () => {
    const addPackageMock = jest.mocked(addPackage);
    const packageList = ['example1', 'example2'];

    await analyzePackages(packageList);

    assert.strictEqual(addPackageMock.mock.calls.length, 2);
    assert.partialDeepStrictEqual(addPackageMock.mock.calls.at(0), ['example1']);
    assert.partialDeepStrictEqual(addPackageMock.mock.calls.at(1), ['example2']);
  });

  it('sets each package modules', async () => {
    const setPackageModsMock = jest.mocked(setPackageMods);
    const packageList = ['example1', 'example2'];

    await analyzePackages(packageList);

    assert.strictEqual(setPackageModsMock.mock.calls.length, 2);
    assert.partialDeepStrictEqual(setPackageModsMock.mock.calls.at(0), ['example1']);
    assert.partialDeepStrictEqual(setPackageModsMock.mock.calls.at(1), ['example2']);
  });

  it('sets each package dependencies', async () => {
    const setPackageDependenciesMock = jest.mocked(setPackageDependencies);
    const packageList = ['example1', 'example2'];

    await analyzePackages(packageList);

    assert.strictEqual(setPackageDependenciesMock.mock.calls.length, 2);
    assert.partialDeepStrictEqual(setPackageDependenciesMock.mock.calls.at(0), ['example1']);
    assert.partialDeepStrictEqual(setPackageDependenciesMock.mock.calls.at(1), ['example2']);
  });
});
