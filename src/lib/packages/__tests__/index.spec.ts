import getPackageExports from '../get-package-exports.js';
import getPackageName from '../get-package-name.js';
import * as packages from '../index.js';
import listPackageExports from '../list-package-exports.js';

jest.mock('../resolve-package.js', () => jest.fn((specifier: string) => specifier));

describe('packages', () => {
  it('get package name', () => {
    expect(packages.getPackageName).toStrictEqual(getPackageName);
  });

  it('get package exports', () => {
    expect(packages.getPackageExports).toStrictEqual(getPackageExports);
  });

  it('list package exports', () => {
    expect(packages.listPackageExports).toStrictEqual(listPackageExports);
  });
});
