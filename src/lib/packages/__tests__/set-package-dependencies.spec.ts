import filterTrackedDependencies from '../filter-tracked-dependencies.js';
import getPackageJson from '../get-package-json.js';
import type { Package } from '../packages.js';
import { getPackage } from '../packages.js';
import setPackageDependencies from '../set-package-dependencies.js';

jest.mock('../get-package-json.js', () => jest.fn(async () => Promise.resolve({})));
jest.mock('../filter-tracked-dependencies.js', () => jest.fn(() => []));
jest.mock('../packages.js', () => ({ getPackage: jest.fn(), getPackageNames: jest.fn(() => []) }));

describe('set package dependencies', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('with none', async () => {
    const pkg = {
      name: 'example',
      isInstalled: false,
      dependants: new Set<Package>(),
      dependencies: new Set<Package>(),
      modules: new Set<string>(),
    };

    (getPackage as jest.MockedFunction<typeof getPackage>).mockReturnValueOnce(pkg);

    expect(pkg.dependencies.size).toBe(0);

    await setPackageDependencies('example');

    expect(pkg.dependencies.size).toBe(0);
  });

  it('with multiple', async () => {
    const pkg = {
      name: 'example',
      isInstalled: false,
      dependants: new Set<Package>(),
      dependencies: new Set<Package>(),
      modules: new Set<string>(),
    };

    const dep1 = {
      name: 'example1',
      isInstalled: false,
      dependants: new Set<Package>(),
      dependencies: new Set<Package>(),
      modules: new Set<string>(),
    };

    const dep2 = {
      name: 'example1',
      isInstalled: false,
      dependants: new Set<Package>(),
      dependencies: new Set<Package>(),
      modules: new Set<string>(),
    };

    (getPackage as jest.MockedFunction<typeof getPackage>).mockReturnValueOnce(pkg);
    (
      filterTrackedDependencies as jest.MockedFunction<typeof filterTrackedDependencies>
    ).mockReturnValueOnce([
      { name: 'dep1', version: '*' },
      { name: 'dep2', version: '*' },
    ]);
    (getPackage as jest.MockedFunction<typeof getPackage>).mockReturnValueOnce(dep1);
    (getPackage as jest.MockedFunction<typeof getPackage>).mockReturnValueOnce(dep2);

    expect(pkg.dependencies.size).toBe(0);
    expect(pkg.dependencies.has(dep1)).toBe(false);
    expect(pkg.dependencies.has(dep2)).toBe(false);

    await setPackageDependencies('example');

    expect(pkg.dependencies.size).toBe(2);
    expect(pkg.dependencies.has(dep1)).toBe(true);
    expect(pkg.dependencies.has(dep2)).toBe(true);
  });

  it('sets installed true', async () => {
    const pkg = {
      name: 'example',
      isInstalled: false,
      dependants: new Set<Package>(),
      dependencies: new Set<Package>(),
      modules: new Set<string>(),
    };

    (getPackage as jest.MockedFunction<typeof getPackage>).mockReturnValueOnce(pkg);

    expect(pkg.isInstalled).toBe(false);

    await setPackageDependencies('example');

    expect(pkg.isInstalled).toBe(true);
  });

  it('handles an uninstalled package', async () => {
    const pkg = {
      name: 'example',
      isInstalled: false,
      dependants: new Set<Package>(),
      dependencies: new Set<Package>(),
      modules: new Set<string>(),
    };

    (getPackageJson as jest.MockedFunction<typeof getPackageJson>).mockResolvedValueOnce(null);
    (getPackage as jest.MockedFunction<typeof getPackage>).mockReturnValueOnce(pkg);

    expect(pkg.isInstalled).toBe(false);

    await setPackageDependencies('example');

    expect(pkg.isInstalled).toBe(false);
  });

  it('with non existent package', () => {
    (getPackage as jest.MockedFunction<typeof getPackage>).mockReturnValueOnce(undefined);

    expect(getPackageJson).not.toHaveBeenCalled();
  });
});
