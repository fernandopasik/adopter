import { beforeEach, describe, it, jest } from '@jest/globals';
import assert from 'node:assert/strict';
import { addPackageImport } from '../packages/index.ts';
import { addImport, getImport, importKey, imports } from './imports.ts';

jest.mock('../packages/index.ts', () => ({ addPackageImport: jest.fn() }));

describe('imports', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    imports.clear();
  });

  describe('key', () => {
    it('with default module in package', () => {
      const imprt = {
        filePath: 'example.js',
        moduleNames: ['default'],
        moduleSpecifier: 'dep1',
        packageName: 'dep1',
      };

      assert.strictEqual(importKey(imprt), 'example.js**dep1**default');
    });

    it('with named modules in package', () => {
      const imprt = {
        filePath: 'example.js',
        moduleNames: ['methodA', 'methodB'],
        moduleSpecifier: 'dep1',
        packageName: 'dep1',
      };

      assert.strictEqual(importKey(imprt), 'example.js**dep1**methodA**methodB');
    });

    it('with default and  modules in package', () => {
      const imprt = {
        filePath: 'example.js',
        moduleNames: ['default', 'methodA', 'methodB'],
        moduleSpecifier: 'dep1',
        packageName: 'dep1',
      };

      assert.strictEqual(importKey(imprt), 'example.js**dep1**default**methodA**methodB');
    });

    it('with a relative import', () => {
      const imprt = {
        filePath: 'example.js',
        moduleNames: ['default'],
        moduleSpecifier: './src/example.ts',
        packageName: null,
      };

      assert.strictEqual(importKey(imprt), 'example.js**./src/example.ts**default');
    });
  });

  it('can add an import', () => {
    const imprt = {
      filePath: 'example.js',
      moduleNames: ['default'],
      moduleSpecifier: 'dep1',
      packageName: 'dep1',
    };

    addImport(imprt);

    assert.deepStrictEqual(imports.get('example.js**dep1**default'), imprt);
  });

  it('tracks imports in packages', () => {
    const addPackageImportMock = jest.mocked(addPackageImport);
    const imprt = {
      filePath: 'example.js',
      moduleNames: ['default'],
      moduleSpecifier: 'dep1',
      packageName: 'dep1',
    };

    addImport(imprt);

    assert.strictEqual(addPackageImportMock.mock.calls.length, 1);
    assert.partialDeepStrictEqual(addPackageImportMock.mock.calls.at(0), [imprt]);
  });

  it('can get an existing import', () => {
    const imprt = {
      filePath: 'example.js',
      moduleNames: ['default'],
      moduleSpecifier: 'dep1',
      packageName: 'dep1',
    };

    addImport(imprt);

    assert.deepStrictEqual(getImport('example.js**dep1**default'), imprt);
  });

  it('can not get a non existing import', () => {
    assert.strictEqual(getImport('dep1**default'), undefined);
  });
});
