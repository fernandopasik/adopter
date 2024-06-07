import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { Import } from '../../../imports/index.js';
import type { Package } from '../../../packages/index.js';
import { getPackage, isModuleImported, isPackageImported } from '../../../packages/index.js';
import isPackageUsed from '../is-package-used.js';
import packageUsage from '../package-usage.js';

jest.mock('../is-package-used.js', () => jest.fn(() => false));
jest.mock('../../../packages/index.js', () => ({
  getPackage: jest.fn(),
  isModuleImported: jest.fn(() => false),
  isPackageImported: jest.fn(() => false),
}));

const isModuleImportedMock = jest.mocked(isModuleImported);
const isPackageImportedMock = jest.mocked(isPackageImported);
const isPackageUsedMock = jest.mocked(isPackageUsed);
const getPackageMock = jest.mocked(getPackage);

describe('package usage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const pkg = {
    name: 'example',
    isInstalled: true,
    dependents: new Set<Package>(),
    dependencies: new Set<Package>(),
    imports: new Set<Import>(),
    modules: new Set<string>(),
  };

  it('get the package', () => {
    packageUsage('example');

    expect(getPackage).toHaveBeenCalledTimes(1);
    expect(getPackage).toHaveBeenCalledWith('example');
  });

  it('returns the package name', () => {
    const name = 'example';

    expect(packageUsage(name)).toStrictEqual(expect.objectContaining({ name }));
  });

  it('returns if package is imported', () => {
    isPackageImportedMock.mockReturnValueOnce(true);
    const name = 'example';

    const usage = packageUsage(name);

    expect(isPackageImported).toHaveBeenCalledTimes(1);
    expect(isPackageImported).toHaveBeenCalledWith(name);
    expect(usage).toStrictEqual(expect.objectContaining({ isImported: true }));
  });

  it('returns if package is used', () => {
    isPackageUsedMock.mockReturnValueOnce(true);
    const name = 'example';

    const usage = packageUsage(name);

    expect(isPackageUsed).toHaveBeenCalledTimes(1);
    expect(isPackageUsed).toHaveBeenCalledWith(name);
    expect(usage).toStrictEqual(expect.objectContaining({ isUsed: true }));
  });

  it('tracks its modules', () => {
    const modules = new Set(['example1', 'example2', 'example3']);
    getPackageMock.mockReturnValueOnce({ ...pkg, modules });
    isModuleImportedMock
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);

    const usage = packageUsage('example');

    expect(usage).toStrictEqual(
      expect.objectContaining({
        modulesImported: ['example2'],
        modulesNotImported: ['example1', 'example3'],
      }),
    );
  });

  it('tracks its dependencies and dependents', () => {
    const dependents = new Set([{ ...pkg, name: 'example1' }]);
    const dependencies = new Set([{ ...pkg, name: 'example2' }]);
    getPackageMock.mockReturnValueOnce({ ...pkg, dependents, dependencies });

    const usage = packageUsage('example');

    expect(usage).toStrictEqual(
      expect.objectContaining({
        dependents: [{ name: 'example1', isImported: false, isUsed: false }],
        dependencies: [{ name: 'example2', isImported: false, isUsed: false }],
      }),
    );
  });
});
