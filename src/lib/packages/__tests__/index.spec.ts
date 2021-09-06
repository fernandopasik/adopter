import findMissingPackages from '../find-missing-packages.js';
import getPackageName from '../get-package-name.js';
import * as packages from '../index.js';
import installPackages from '../install-packages.js';
import listPackageExports from '../list-package-exports.js';

describe('packages', () => {
  it('find missing packages', () => {
    expect(packages.findMissingPackages).toStrictEqual(findMissingPackages);
  });

  it('get package name', () => {
    expect(packages.getPackageName).toStrictEqual(getPackageName);
  });

  it('install packages', () => {
    expect(packages.installPackages).toStrictEqual(installPackages);
  });

  it('list package exports', () => {
    expect(packages.listPackageExports).toStrictEqual(listPackageExports);
  });
});
