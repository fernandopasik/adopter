import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { Import } from '../../imports/index.js';
import getPackageModules from '../get-package-mods.js';
import { getPackage, type Package } from '../packages.js';
import setPackageMods from '../set-package-mods.js';

jest.mock('../get-package-mods.js', () => jest.fn(async () => Promise.resolve([])));
jest.mock('../packages.js', () => ({ getPackage: jest.fn() }));

describe('set package modules', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('with no modules', async () => {
    const pkg = {
      name: 'example',
      isInstalled: false,
      dependents: new Set<Package>(),
      dependencies: new Set<Package>(),
      imports: new Set<Import>(),
      modules: new Set<string>(),
    };

    jest.mocked(getPackage).mockReturnValueOnce(pkg);

    expect(pkg.modules.size).toBe(0);

    await setPackageMods('example');

    expect(pkg.modules.size).toBe(0);
  });

  it('with a default module', async () => {
    const pkg = {
      name: 'example',
      isInstalled: false,
      dependents: new Set<Package>(),
      dependencies: new Set<Package>(),
      imports: new Set<Import>(),
      modules: new Set<string>(),
    };

    jest.mocked(getPackageModules).mockResolvedValueOnce(['default']);
    jest.mocked(getPackage).mockReturnValueOnce(pkg);

    expect(pkg.modules.size).toBe(0);
    expect(pkg.modules.has('default')).toBe(false);

    await setPackageMods('example');

    expect(pkg.modules.size).toBe(1);
    expect(pkg.modules.has('default')).toBe(true);
  });

  it('with a multiple modules', async () => {
    const pkg = {
      name: 'example',
      isInstalled: false,
      dependents: new Set<Package>(),
      dependencies: new Set<Package>(),
      imports: new Set<Import>(),
      modules: new Set<string>(),
    };

    jest.mocked(getPackageModules).mockResolvedValueOnce(['default', 'moduleA', 'moduleB']);
    jest.mocked(getPackage).mockReturnValueOnce(pkg);

    expect(pkg.modules.size).toBe(0);

    await setPackageMods('example');

    expect(pkg.modules.size).toBe(3);
  });

  it('sets installed true', async () => {
    const pkg = {
      name: 'example',
      isInstalled: false,
      dependents: new Set<Package>(),
      dependencies: new Set<Package>(),
      imports: new Set<Import>(),
      modules: new Set<string>(),
    };

    jest.mocked(getPackage).mockReturnValueOnce(pkg);

    expect(pkg.isInstalled).toBe(false);

    await setPackageMods('example');

    expect(pkg.isInstalled).toBe(true);
  });

  it('handles an uninstalled package', async () => {
    const pkg = {
      name: 'example',
      isInstalled: false,
      dependents: new Set<Package>(),
      dependencies: new Set<Package>(),
      imports: new Set<Import>(),
      modules: new Set<string>(),
    };

    jest.mocked(getPackage).mockReturnValueOnce(pkg);
    jest.mocked(getPackageModules).mockResolvedValueOnce(null);

    expect(pkg.isInstalled).toBe(false);

    await setPackageMods('example');

    expect(pkg.isInstalled).toBe(false);
  });

  it('with non existent package', () => {
    jest.mocked(getPackage).mockReturnValueOnce(undefined);

    expect(getPackageModules).not.toHaveBeenCalled();
  });
});
