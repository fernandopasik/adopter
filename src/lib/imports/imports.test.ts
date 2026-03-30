import assert from 'node:assert/strict';
import { after, beforeEach, describe, it, mock } from 'node:test';

describe('imports', async () => {
  const addPackageImportMock = mock.fn();
  const packagesModule = mock.module('../packages/index.ts', {
    namedExports: { addPackageImport: addPackageImportMock },
  });

  const { addImport, getImport, importKey, imports } = await import('./imports.ts');

  beforeEach(() => {
    addPackageImportMock.mock.resetCalls();
    imports.clear();
  });

  after(() => {
    packagesModule.restore();
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
    const imprt = {
      filePath: 'example.js',
      moduleNames: ['default'],
      moduleSpecifier: 'dep1',
      packageName: 'dep1',
    };

    addImport(imprt);

    assert.strictEqual(addPackageImportMock.mock.calls.length, 1);
    assert.deepStrictEqual(addPackageImportMock.mock.calls.at(0)?.arguments, [imprt]);
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
