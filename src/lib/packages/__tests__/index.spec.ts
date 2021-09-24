import extractPackageName from '../extract-package-name.js';
import getPackagesExports from '../get-packages-exports.js';
import * as packages from '../index.js';
import listPackageExports from '../list-package-exports.js';

jest.mock('../resolve-package.js', () => jest.fn((specifier: string) => specifier));

describe('packages', () => {
  it('extract package name', () => {
    expect(packages.extractPackageName).toStrictEqual(extractPackageName);
  });

  it('get package exports', () => {
    expect(packages.getPackagesExports).toStrictEqual(getPackagesExports);
  });

  it('list package exports', () => {
    expect(packages.listPackageExports).toStrictEqual(listPackageExports);
  });
});
