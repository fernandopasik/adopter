import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { Import } from '../../../imports/index.js';
import type { Package } from '../../../packages/index.js';
import { getPackage, isPackageImported } from '../../../packages/index.js';
import isPackageUsed from '../is-package-used.js';

jest.mock('../../../packages/index.js', () => ({
  getPackage: jest.fn(),
  isPackageImported: jest.fn(() => false),
}));

describe('is package used', () => {
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

  const pkg2 = {
    ...pkg,
    name: 'example2',
  };

  it('with a non imported package', () => {
    jest.mocked(getPackage).mockReturnValueOnce(pkg);
    jest.mocked(isPackageImported).mockReturnValueOnce(false);

    expect(isPackageUsed('example')).toBe(false);
    expect(isPackageImported).toHaveBeenCalledTimes(1);
    expect(getPackage).toHaveBeenCalledTimes(1);
  });

  it('with an imported package', () => {
    jest.mocked(isPackageImported).mockReturnValueOnce(true);

    expect(isPackageUsed('example')).toBe(true);
    expect(isPackageImported).toHaveBeenCalledTimes(1);
    expect(getPackage).not.toHaveBeenCalled();
  });

  it('with an imported dependent package', () => {
    jest.mocked(getPackage).mockReturnValueOnce({
      ...pkg,
      dependents: new Set([pkg2]),
    });
    jest.mocked(isPackageImported).mockReturnValueOnce(false);
    jest.mocked(isPackageImported).mockReturnValueOnce(true);

    expect(isPackageUsed('example')).toBe(true);
    expect(isPackageImported).toHaveBeenCalledTimes(2);
  });

  it('with not imported dependent packages', () => {
    jest.mocked(getPackage).mockReturnValueOnce({
      ...pkg,
      dependents: new Set([pkg2]),
    });
    jest.mocked(getPackage).mockReturnValueOnce(pkg2);
    jest.mocked(isPackageImported).mockReturnValueOnce(false);
    jest.mocked(isPackageImported).mockReturnValueOnce(false);

    expect(isPackageUsed('example')).toBe(false);
    expect(isPackageImported).toHaveBeenCalledTimes(2);
    expect(getPackage).toHaveBeenCalledTimes(2);
  });

  it('with a non tracked dependent packages', () => {
    jest.mocked(getPackage).mockReturnValueOnce({
      ...pkg,
      dependents: new Set([pkg2]),
    });
    jest.mocked(getPackage).mockReturnValueOnce(undefined);
    jest.mocked(isPackageImported).mockReturnValueOnce(false);
    jest.mocked(isPackageImported).mockReturnValueOnce(false);

    expect(isPackageUsed('example')).toBe(false);
    expect(isPackageImported).toHaveBeenCalledTimes(2);
    expect(getPackage).toHaveBeenCalledTimes(2);
  });
});
