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
      modules: new Set<string>(),
    };

    (getPackage as jest.MockedFunction<typeof getPackage>).mockReturnValueOnce(pkg);

    await setPackageMods('example');

    expect(pkg.modules.size).toBe(0);
  });

  it('with a default module', async () => {
    const pkg = {
      name: 'example',
      isInstalled: false,
      dependants: new Set<Package>(),
      dependencies: new Set<Package>(),
      modules: new Set<string>(),
    };

    (getPackageModules as jest.MockedFunction<typeof getPackageModules>).mockResolvedValueOnce([
      'default',
    ]);
    (getPackage as jest.MockedFunction<typeof getPackage>).mockReturnValueOnce(pkg);

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
      modules: new Set<string>(),
    };

    (getPackageModules as jest.MockedFunction<typeof getPackageModules>).mockResolvedValueOnce([
      'default',
      'moduleA',
      'moduleB',
    ]);
    (getPackage as jest.MockedFunction<typeof getPackage>).mockReturnValueOnce(pkg);

    await setPackageMods('example');

    expect(pkg.modules.size).toBe(3);
  });
});
