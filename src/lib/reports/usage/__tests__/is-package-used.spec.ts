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
    (getPackage as jest.MockedFunction<typeof getPackage>).mockReturnValueOnce(pkg);
    (isPackageImported as jest.MockedFunction<typeof isPackageUsed>).mockReturnValueOnce(false);

    expect(isPackageUsed('example')).toBe(false);
    expect(isPackageImported).toHaveBeenCalledTimes(1);
    expect(getPackage).toHaveBeenCalledTimes(1);
  });

  it('with an imported package', () => {
    (isPackageImported as jest.MockedFunction<typeof isPackageUsed>).mockReturnValueOnce(true);

    expect(isPackageUsed('example')).toBe(true);
    expect(isPackageImported).toHaveBeenCalledTimes(1);
    expect(getPackage).not.toHaveBeenCalled();
  });

  it('with an imported dependent package', () => {
    (getPackage as jest.MockedFunction<typeof getPackage>).mockReturnValueOnce({
      ...pkg,
      dependents: new Set([pkg2]),
    });
    (isPackageImported as jest.MockedFunction<typeof isPackageUsed>).mockReturnValueOnce(false);
    (isPackageImported as jest.MockedFunction<typeof isPackageUsed>).mockReturnValueOnce(true);

    expect(isPackageUsed('example')).toBe(true);
    expect(isPackageImported).toHaveBeenCalledTimes(2);
  });

  it('with not imported dependent packages', () => {
    (getPackage as jest.MockedFunction<typeof getPackage>).mockReturnValueOnce({
      ...pkg,
      dependents: new Set([pkg2]),
    });
    (getPackage as jest.MockedFunction<typeof getPackage>).mockReturnValueOnce(pkg2);
    (isPackageImported as jest.MockedFunction<typeof isPackageUsed>).mockReturnValueOnce(false);
    (isPackageImported as jest.MockedFunction<typeof isPackageUsed>).mockReturnValueOnce(false);

    expect(isPackageUsed('example')).toBe(false);
    expect(isPackageImported).toHaveBeenCalledTimes(2);
    expect(getPackage).toHaveBeenCalledTimes(2);
  });

  it('with a non tracked dependent packages', () => {
    (getPackage as jest.MockedFunction<typeof getPackage>).mockReturnValueOnce({
      ...pkg,
      dependents: new Set([pkg2]),
    });
    (getPackage as jest.MockedFunction<typeof getPackage>).mockReturnValueOnce(undefined);
    (isPackageImported as jest.MockedFunction<typeof isPackageUsed>).mockReturnValueOnce(false);
    (isPackageImported as jest.MockedFunction<typeof isPackageUsed>).mockReturnValueOnce(false);

    expect(isPackageUsed('example')).toBe(false);
    expect(isPackageImported).toHaveBeenCalledTimes(2);
    expect(getPackage).toHaveBeenCalledTimes(2);
  });
});
