import findMissingPackages from '../find-missing-packages.js';
import getPackageExports from '../get-package-exports.js';
import getPackageName from '../get-package-name.js';
import * as packages from '../index.js';
import listPackageExports from '../list-package-exports.js';

describe('packages', () => {
  it('find missing packages', () => {
    expect(packages.findMissingPackages).toStrictEqual(findMissingPackages);
  });

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
