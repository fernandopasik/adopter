import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import assert from 'node:assert/strict';
import type { Import } from '../imports/index.ts';
import getPackageModules from './get-package-mods.ts';
import { getPackage, type Package } from './packages.ts';
import setPackageMods from './set-package-mods.ts';

jest.mock('./get-package-mods.ts', () => jest.fn(async () => Promise.resolve([])));
jest.mock('./packages.ts', () => ({ getPackage: jest.fn() }));

describe('set package modules', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('with no modules', async () => {
    const pkg = {
      dependencies: new Set<Package>(),
      dependents: new Set<Package>(),
      imports: new Set<Import>(),
      isInstalled: false,
      modules: new Set<string>(),
      name: 'example',
    };

    jest.mocked(getPackage).mockReturnValueOnce(pkg);

    assert.strictEqual(pkg.modules.size, 0);

    await setPackageMods('example');

    assert.strictEqual(pkg.modules.size, 0);
  });

  it('with a default module', async () => {
    const pkg = {
      dependencies: new Set<Package>(),
      dependents: new Set<Package>(),
      imports: new Set<Import>(),
      isInstalled: false,
      modules: new Set<string>(),
      name: 'example',
    };

    jest.mocked(getPackageModules).mockResolvedValueOnce(['default']);
    jest.mocked(getPackage).mockReturnValueOnce(pkg);

    assert.strictEqual(pkg.modules.size, 0);
    assert.strictEqual(pkg.modules.has('default'), false);

    await setPackageMods('example');

    assert.strictEqual(pkg.modules.size, 1);
    assert.strictEqual(pkg.modules.has('default'), true);
  });

  it('with a multiple modules', async () => {
    const pkg = {
      dependencies: new Set<Package>(),
      dependents: new Set<Package>(),
      imports: new Set<Import>(),
      isInstalled: false,
      modules: new Set<string>(),
      name: 'example',
    };

    jest.mocked(getPackageModules).mockResolvedValueOnce(['default', 'moduleA', 'moduleB']);
    jest.mocked(getPackage).mockReturnValueOnce(pkg);

    assert.strictEqual(pkg.modules.size, 0);

    await setPackageMods('example');

    assert.strictEqual(pkg.modules.size, 3);
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

    await setPackageMods('example');

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

    jest.mocked(getPackage).mockReturnValueOnce(pkg);
    jest.mocked(getPackageModules).mockResolvedValueOnce(null);

    assert.strictEqual(pkg.isInstalled, false);

    await setPackageMods('example');

    assert.strictEqual(pkg.isInstalled, false);
  });

  it('with non existent package', () => {
    jest.mocked(getPackage).mockReturnValueOnce(undefined);

    expect(getPackageModules).not.toHaveBeenCalled();
  });
});
