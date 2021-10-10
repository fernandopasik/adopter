import extractPackagePath from '../extract-package-path.js';
import filterTrackedDependencies from '../filter-tracked-dependencies.js';
import getPackageJson from '../get-package-json.js';
import getPackageModules from '../get-package-mods.js';
import * as packages from '../index.js';

jest.mock('../resolve-package.js', () => jest.fn((specifier: string) => specifier));

describe('packages', () => {
  it('extract package path', () => {
    expect(packages.extractPackagePath).toStrictEqual(extractPackagePath);
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
});
