import type { Import } from '../../imports/index.js';
import getPackageModules from '../get-package-mods.js';
import type { Package } from '../packages.js';
import { getPackage } from '../packages.js';
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
      dependants: new Set<Package>(),
      dependencies: new Set<Package>(),
      imports: new Set<Import>(),
      modules: new Set<string>(),
    };

    (getPackage as jest.MockedFunction<typeof getPackage>).mockReturnValueOnce(pkg);

    expect(pkg.modules.size).toBe(0);

    await setPackageMods('example');

    expect(pkg.modules.size).toBe(0);
  });

  it('with a default module', async () => {
    const pkg = {
      name: 'example',
      isInstalled: false,
      dependants: new Set<Package>(),
      dependencies: new Set<Package>(),
      imports: new Set<Import>(),
      modules: new Set<string>(),
    };

    (getPackageModules as jest.MockedFunction<typeof getPackageModules>).mockResolvedValueOnce([
      'default',
    ]);
    (getPackage as jest.MockedFunction<typeof getPackage>).mockReturnValueOnce(pkg);

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
      dependants: new Set<Package>(),
      dependencies: new Set<Package>(),
      imports: new Set<Import>(),
      modules: new Set<string>(),
    };

    (getPackageModules as jest.MockedFunction<typeof getPackageModules>).mockResolvedValueOnce([
      'default',
      'moduleA',
      'moduleB',
    ]);
    (getPackage as jest.MockedFunction<typeof getPackage>).mockReturnValueOnce(pkg);

    expect(pkg.modules.size).toBe(0);

    await setPackageMods('example');

    expect(pkg.modules.size).toBe(3);
  });

  it('sets installed true', async () => {
    const pkg = {
      name: 'example',
      isInstalled: false,
      dependants: new Set<Package>(),
      dependencies: new Set<Package>(),
      imports: new Set<Import>(),
      modules: new Set<string>(),
    };

    (getPackage as jest.MockedFunction<typeof getPackage>).mockReturnValueOnce(pkg);

    expect(pkg.isInstalled).toBe(false);

    await setPackageMods('example');

    expect(pkg.isInstalled).toBe(true);
  });

  it('handles an uninstalled package', async () => {
    const pkg = {
      name: 'example',
      isInstalled: false,
      dependants: new Set<Package>(),
      dependencies: new Set<Package>(),
      imports: new Set<Import>(),
      modules: new Set<string>(),
    };

    (getPackage as jest.MockedFunction<typeof getPackage>).mockReturnValueOnce(pkg);
    (getPackageModules as jest.MockedFunction<typeof getPackageModules>).mockResolvedValueOnce(
      null,
    );

    expect(pkg.isInstalled).toBe(false);

    await setPackageMods('example');

    expect(pkg.isInstalled).toBe(false);
  });

  it('with non existent package', () => {
    (getPackage as jest.MockedFunction<typeof getPackage>).mockReturnValueOnce(undefined);

    expect(getPackageModules).not.toHaveBeenCalled();
  });
});
