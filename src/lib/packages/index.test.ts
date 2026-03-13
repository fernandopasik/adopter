import { describe, it, jest } from '@jest/globals';
import assert from 'node:assert/strict';
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
    assert.strictEqual(packages.addPackageImport, addPackageImport);
  });

  it('analyze packages', () => {
    assert.strictEqual(packages.analyzePackages, analyzePackages);
  });

  it('extract package path', () => {
    assert.strictEqual(packages.extractPackagePath, extractPackagePath);
  });

  it('filter tracked dependencies', () => {
    assert.strictEqual(packages.filterTrackedDependencies, filterTrackedDependencies);
  });

  it('get package', () => {
    assert.strictEqual(packages.getPackage, getPackage);
  });

  it('get package json', () => {
    assert.strictEqual(packages.getPackageJson, getPackageJson);
  });

  it('get package mods', () => {
    assert.strictEqual(packages.getPackageModules, getPackageModules);
  });

  it('get package names', () => {
    assert.strictEqual(packages.getPackageNames, getPackageNames);
  });

  it('has module', () => {
    assert.strictEqual(packages.hasModule, hasModule);
  });

  it('has package', () => {
    assert.strictEqual(packages.hasPackage, hasPackage);
  });

  it('is module imported', () => {
    assert.strictEqual(packages.isModuleImported, isModuleImported);
  });

  it('is package imported', () => {
    assert.strictEqual(packages.isPackageImported, isPackageImported);
  });
});
