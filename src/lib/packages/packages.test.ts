import { beforeEach, describe, it } from '@jest/globals';
import assert from 'node:assert/strict';
import {
  addPackage,
  addPackageImport,
  getPackage,
  getPackageNames,
  hasModule,
  hasPackage,
  isModuleImported,
  isPackageImported,
  packages,
} from './packages.ts';

describe('packages', () => {
  beforeEach(() => {
    packages.clear();
  });

  it('can add package', () => {
    addPackage('example');

    assert.strictEqual(packages.has('example'), true);
  });

  it('does not have a package', () => {
    assert.strictEqual(hasPackage('nonexistent'), false);
  });

  it('can have a package', () => {
    addPackage('example');

    assert.strictEqual(hasPackage('example'), true);
  });

  it('does not have a module', () => {
    addPackage('example');

    assert.strictEqual(hasModule('moduleA', 'example'), false);
    assert.strictEqual(hasModule('moduleA', 'example2'), false);
  });

  it('can have a module', () => {
    addPackage('example');

    const pkg = getPackage('example');
    pkg?.modules.add('moduleA');

    assert.strictEqual(hasModule('moduleA', 'example'), true);
  });

  it('get package', () => {
    addPackage('example');

    assert.deepStrictEqual(getPackage('example'), {
      dependencies: new Set(),
      dependents: new Set(),
      imports: new Set(),
      isInstalled: false,
      modules: new Set(),
      name: 'example',
    });
  });

  it('get package names', () => {
    addPackage('example1');
    addPackage('example2');

    assert.deepStrictEqual(getPackageNames(), ['example1', 'example2']);
  });

  describe('package imports', () => {
    const imprt = {
      filePath: 'example.ts',
      moduleNames: ['default'],
      moduleSpecifier: 'example1',
      packageName: 'example1',
    };

    it('add package import', () => {
      addPackage('example1');
      assert.strictEqual(getPackage('example1')?.imports.has(imprt), false);

      addPackageImport(imprt);
      assert.strictEqual(getPackage('example1')?.imports.has(imprt), true);
    });

    it('add non existing package import', () => {
      const imprt2 = {
        filePath: 'example.ts',
        moduleNames: ['default'],
        moduleSpecifier: 'example2',
        packageName: 'example2',
      };

      addPackage('example1');
      assert.strictEqual(getPackage('example1')?.imports.has(imprt2), false);

      addPackageImport(imprt2);

      assert.strictEqual(getPackage('example1')?.imports.has(imprt2), false);
    });

    describe('is package imported', () => {
      it('with existent and imported package', () => {
        addPackage('example1');
        assert.strictEqual(isPackageImported('example1'), false);

        addPackageImport(imprt);
        assert.strictEqual(isPackageImported('example1'), true);
      });

      it('with existent and non imported package', () => {
        addPackage('example1');
        assert.strictEqual(isPackageImported('example1'), false);
      });

      it('with non existent package', () => {
        assert.strictEqual(isPackageImported('example2'), false);
      });
    });

    describe('is module imported', () => {
      it('with imported package and module', () => {
        addPackage('example1');
        assert.strictEqual(isModuleImported('default', 'example1'), false);

        addPackageImport(imprt);
        assert.strictEqual(isModuleImported('default', 'example1'), true);
      });

      it('with imported package and not module', () => {
        addPackage('example1');
        assert.strictEqual(isModuleImported('module1', 'example1'), false);

        addPackageImport(imprt);
        assert.strictEqual(isModuleImported('module1', 'example1'), false);
      });

      it('with non imported package', () => {
        assert.strictEqual(isModuleImported('module1', 'example1'), false);
      });
    });
  });
});
