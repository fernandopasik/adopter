import extractPackageName from '../extract-package-name.js';
import filterTrackedDependencies from '../filter-tracked-dependencies.js';
import getPackageJson from '../get-package-json.js';
import getPackageModules from '../get-package-mods.js';
import * as packages from '../index.js';
import listPackageExports from '../list-package-exports.js';

jest.mock('../resolve-package.js', () => jest.fn((specifier: string) => specifier));

describe('packages', () => {
  it('extract package name', () => {
    expect(packages.extractPackageName).toStrictEqual(extractPackageName);
  });

  it('filter tracked dependencies', () => {
    expect(packages.filterTrackedDependencies).toStrictEqual(filterTrackedDependencies);
  });

  it('get package json', () => {
    expect(packages.getPackageJson).toStrictEqual(getPackageJson);
  });

  it('get package mods', () => {
    expect(packages.getPackageModules).toStrictEqual(getPackageModules);
  });

  it('list package exports', () => {
    expect(packages.listPackageExports).toStrictEqual(listPackageExports);
  });
});
