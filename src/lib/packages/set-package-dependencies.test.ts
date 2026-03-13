import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import assert from 'node:assert/strict';
import type { Import } from '../imports/index.ts';
import filterTrackedDependencies from './filter-tracked-dependencies.ts';
import getPackageJson from './get-package-json.ts';
import { getPackage, type Package } from './packages.ts';
import setPackageDependencies from './set-package-dependencies.ts';

jest.mock('./get-package-json.ts', () => jest.fn(async () => Promise.resolve({})));
jest.mock('./filter-tracked-dependencies.ts', () => jest.fn(() => []));
jest.mock('./packages.ts', () => ({ getPackage: jest.fn(), getPackageNames: jest.fn(() => []) }));

describe('set package dependencies', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('with none', async () => {
    const pkg = {
      dependencies: new Set<Package>(),
      dependents: new Set<Package>(),
      imports: new Set<Import>(),
      isInstalled: false,
      modules: new Set<string>(),
      name: 'example',
    };

    jest.mocked(getPackage).mockReturnValueOnce(pkg);

    assert.strictEqual(pkg.dependencies.size, 0);

    await setPackageDependencies('example');

    assert.strictEqual(pkg.dependencies.size, 0);
  });

  it('with multiple', async () => {
    const pkg = {
      dependencies: new Set<Package>(),
      dependents: new Set<Package>(),
      imports: new Set<Import>(),
      isInstalled: false,
      modules: new Set<string>(),
      name: 'example',
    };

    const dep1 = {
      dependencies: new Set<Package>(),
      dependents: new Set<Package>(),
      imports: new Set<Import>(),
      isInstalled: false,
      modules: new Set<string>(),
      name: 'example1',
    };

    const dep2 = {
      dependencies: new Set<Package>(),
      dependents: new Set<Package>(),
      imports: new Set<Import>(),
      isInstalled: false,
      modules: new Set<string>(),
      name: 'example1',
    };

    jest.mocked(getPackage).mockReturnValueOnce(pkg);
    jest.mocked(filterTrackedDependencies).mockReturnValueOnce([
      { name: 'dep1', version: '*' },
      { name: 'dep2', version: '*' },
    ]);
    jest.mocked(getPackage).mockReturnValueOnce(dep1);
    jest.mocked(getPackage).mockReturnValueOnce(dep2);

    assert.strictEqual(pkg.dependencies.size, 0);
    assert.strictEqual(pkg.dependencies.has(dep1), false);
    assert.strictEqual(pkg.dependencies.has(dep2), false);

    await setPackageDependencies('example');

    assert.strictEqual(pkg.dependencies.size, 2);
    assert.strictEqual(pkg.dependencies.has(dep1), true);
    assert.strictEqual(pkg.dependencies.has(dep2), true);
  });

  it('sets installed true', async () => {
    const pkg = {
      dependencies: new Set<Package>(),
      dependents: new Set<Package>(),
      imports: new Set<Import>(),
      isInstalled: false,
      modules: new Set<string>(),
      name: 'example',
    };

    jest.mocked(getPackage).mockReturnValueOnce(pkg);

    assert.strictEqual(pkg.isInstalled, false);

    await setPackageDependencies('example');

    assert.strictEqual(pkg.isInstalled, true);
  });

  it('handles an uninstalled package', async () => {
    const pkg = {
      dependencies: new Set<Package>(),
      dependents: new Set<Package>(),
      imports: new Set<Import>(),
      isInstalled: false,
      modules: new Set<string>(),
      name: 'example',
    };

    jest.mocked(getPackageJson).mockResolvedValueOnce(null);
    jest.mocked(getPackage).mockReturnValueOnce(pkg);

    assert.strictEqual(pkg.isInstalled, false);

    await setPackageDependencies('example');

    assert.strictEqual(pkg.isInstalled, false);
  });

  it('with non existent package', () => {
    jest.mocked(getPackage).mockReturnValueOnce(undefined);

    expect(getPackageJson).not.toHaveBeenCalled();
  });
});
