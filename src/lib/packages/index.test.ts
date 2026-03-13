import { describe, expect, it, jest } from '@jest/globals';
import analyzePackages from './analyze-packages.ts';
import extractPackagePath from './extract-package-path.ts';
import filterTrackedDependencies from './filter-tracked-dependencies.ts';
import getPackageJson from './get-package-json.ts';
import getPackageModules from './get-package-mods.ts';
import * as packages from './index.ts';
import {
  addPackageImport,
  getPackage,
  getPackageNames,
  hasModule,
  hasPackage,
  isModuleImported,
  isPackageImported,
} from './packages.ts';

jest.mock('./resolve-package.ts', () => jest.fn((specifier: string) => specifier));

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

  it('is module imported', () => {
    expect(packages.isModuleImported).toStrictEqual(isModuleImported);
  });

  it('is package imported', () => {
    expect(packages.isPackageImported).toStrictEqual(isPackageImported);
  });
});
