import analyzePackages from '../analyze-packages.js';
import extractPackagePath from '../extract-package-path.js';
import filterTrackedDependencies from '../filter-tracked-dependencies.js';
import getPackageJson from '../get-package-json.js';
import getPackageModules from '../get-package-mods.js';
import * as packages from '../index.js';
import {
  addPackageImport,
  getPackage,
  getPackageNames,
  hasModule,
  hasPackage,
} from '../packages.js';

jest.mock('../resolve-package.js', () => jest.fn((specifier: string) => specifier));

describe('packages', () => {
  it('add package import', () => {
    expect(packages.addPackageImport).toStrictEqual(addPackageImport);
  });

  it('analyze packages', () => {
    expect(packages.analyzePackages).toStrictEqual(analyzePackages);
  });

  it('extract package path', () => {
    expect(packages.extractPackagePath).toStrictEqual(extractPackagePath);
  });

  it('filter tracked dependencies', () => {
    expect(packages.filterTrackedDependencies).toStrictEqual(filterTrackedDependencies);
  });

  it('get package', () => {
    expect(packages.getPackage).toStrictEqual(getPackage);
  });

  it('get package json', () => {
    expect(packages.getPackageJson).toStrictEqual(getPackageJson);
  });

  it('get package mods', () => {
    expect(packages.getPackageModules).toStrictEqual(getPackageModules);
  });

  it('get package names', () => {
    expect(packages.getPackageNames).toStrictEqual(getPackageNames);
  });

  it('has module', () => {
    expect(packages.hasModule).toStrictEqual(hasModule);
  });

  it('has package', () => {
    expect(packages.hasPackage).toStrictEqual(hasPackage);
  });
});
